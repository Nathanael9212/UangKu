import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { Platform } from "react-native";
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

const exportWeb = (wbout: string, filename: string) => {
  const byteCharacters = atob(wbout);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

export const exportToExcel = async (
  options: ExportOptions,
): Promise<boolean> => {
  try {
    const { title, fromDate, toDate, category, transactions } = options;

    const filtered = transactions.filter((tx) => {
      const txDate = new Date(tx.date);
      const inRange = txDate >= fromDate && txDate <= toDate;
      const inCategory = category === "semua" || tx.category === category;
      return inRange && inCategory;
    });

    const totalPemasukan = filtered
      .filter((tx) => tx.type === "pemasukan")
      .reduce((sum, tx) => sum + tx.amount, 0);

    const totalPengeluaran = filtered
      .filter((tx) => tx.type === "pengeluaran")
      .reduce((sum, tx) => sum + tx.amount, 0);

    const saldo = totalPemasukan - totalPengeluaran;

    const rows: any[] = filtered.map((tx, index) => ({
      No: index + 1,
      Tanggal: formatDate(tx.date),
      Tipe: tx.type === "pemasukan" ? "Pemasukan" : "Pengeluaran",
      Kategori: tx.categoryLabel,
      Deskripsi: tx.description,
      Jumlah: tx.amount,
    }));

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

    const ws = utils.json_to_sheet(rows);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Laporan Keuangan");

    ws["!cols"] = [
      { wch: 5 },
      { wch: 15 },
      { wch: 12 },
      { wch: 20 },
      { wch: 30 },
      { wch: 18 },
    ];

    const wbout = write(wb, { type: "base64", bookType: "xlsx" });

    const fromStr = formatDate(fromDate).replace(/ /g, "_");
    const toStr = formatDate(toDate).replace(/ /g, "_");
    const filename = `Keuangan_${fromStr}_${toStr}.xlsx`;

    if (Platform.OS === "web") {
      exportWeb(wbout, filename);
    } else {
      const folderUri = `${FileSystem.documentDirectory}laporan/`;
      const fileUri = `${folderUri}${filename}`;
      await FileSystem.makeDirectoryAsync(folderUri, { intermediates: true });
      await FileSystem.writeAsStringAsync(fileUri, wbout, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(fileUri, {
          mimeType:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          dialogTitle: title,
          UTI: "com.microsoft.excel.xlsx",
        });
      }
    }

    return true;
  } catch (error) {
    console.error("Export error:", error);
    return false;
  }
};
