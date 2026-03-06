import {
    EncodingType,
    documentDirectory,
    makeDirectoryAsync,
    writeAsStringAsync,
} from "expo-file-system";
import { isAvailableAsync, shareAsync } from "expo-sharing";
import { utils, write } from "xlsx";
import { Transaction } from "../store/useTransactionStore";
import { formatDate } from "./dateHelper";

interface ExportOptions {
  title: string;
  fromDate: Date;
  toDate: Date;
  category: string;
  transactions: Transaction[];
}

export const exportToExcel = async (
  options: ExportOptions,
): Promise<boolean> => {
  try {
    const { title, fromDate, toDate, category, transactions } = options;

    // Filter transaksi sesuai range & kategori
    const filtered = transactions.filter((tx) => {
      const txDate = new Date(tx.date);
      const inRange = txDate >= fromDate && txDate <= toDate;
      const inCategory = category === "semua" || tx.category === category;
      return inRange && inCategory;
    });

    // Hitung ringkasan
    const totalPemasukan = filtered
      .filter((tx) => tx.type === "pemasukan")
      .reduce((sum, tx) => sum + tx.amount, 0);

    const totalPengeluaran = filtered
      .filter((tx) => tx.type === "pengeluaran")
      .reduce((sum, tx) => sum + tx.amount, 0);

    const saldo = totalPemasukan - totalPengeluaran;

    // Buat data rows
    const rows: any[] = filtered.map((tx, index) => ({
      No: index + 1,
      Tanggal: formatDate(tx.date),
      Tipe: tx.type === "pemasukan" ? "Pemasukan" : "Pengeluaran",
      Kategori: tx.categoryLabel,
      Deskripsi: tx.description,
      Jumlah: tx.amount,
    }));

    // Tambah baris ringkasan di akhir
    rows.push({});
    rows.push({
      No: "",
      Tanggal: "Total Pemasukan",
      Tipe: "",
      Kategori: "",
      Deskripsi: "",
      Jumlah: totalPemasukan,
    });
    rows.push({
      No: "",
      Tanggal: "Total Pengeluaran",
      Tipe: "",
      Kategori: "",
      Deskripsi: "",
      Jumlah: totalPengeluaran,
    });
    rows.push({
      No: "",
      Tanggal: "Saldo",
      Tipe: "",
      Kategori: "",
      Deskripsi: "",
      Jumlah: saldo,
    });

    // Buat worksheet & workbook
    const ws = utils.json_to_sheet(rows);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Laporan Keuangan");

    // Set lebar kolom
    ws["!cols"] = [
      { wch: 5 },
      { wch: 15 },
      { wch: 12 },
      { wch: 20 },
      { wch: 30 },
      { wch: 18 },
    ];

    // Convert ke base64
    const wbout = write(wb, { type: "base64", bookType: "xlsx" });

    // Buat path file
    const fromStr = formatDate(fromDate).replace(/ /g, "_");
    const toStr = formatDate(toDate).replace(/ /g, "_");
    const filename = `Keuangan_${fromStr}_${toStr}.xlsx`;
    const folderUri = `${documentDirectory}laporan/`;
    const fileUri = `${folderUri}${filename}`;

    // Pastikan folder ada
    await makeDirectoryAsync(folderUri, { intermediates: true });

    // Tulis file
    await writeAsStringAsync(fileUri, wbout, {
      encoding: EncodingType.Base64,
    });

    // Share file
    const canShare = await isAvailableAsync();
    if (canShare) {
      await shareAsync(fileUri, {
        mimeType:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        dialogTitle: title,
        UTI: "com.microsoft.excel.xlsx",
      });
    }

    return true;
  } catch (error) {
    console.error("Export error:", error);
    return false;
  }
};
