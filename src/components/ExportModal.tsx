import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ALL_CATEGORIES } from "../constants/categories";
import { useTransactionStore } from "../store/useTransactionStore";
import { formatDate } from "../utils/dateHelper";
import { exportToExcel } from "../utils/exportExcel";

interface Props {
  visible: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<Props> = ({ visible, onClose }) => {
  const transactions = useTransactionStore((s) => s.transactions);
  const [title, setTitle] = useState("Catatan Bulan Januari");
  const [fromDate, setFromDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  );
  const [toDate, setToDate] = useState(new Date());
  const [category, setCategory] = useState("semua");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    const result = await exportToExcel({
      title,
      fromDate,
      toDate,
      category,
      transactions,
    });
    setLoading(false);
    if (result) setSuccess(true);
    else Alert.alert("Gagal", "Terjadi kesalahan saat export.");
  };

  if (success) {
    return (
      <Modal visible={visible} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.sheet}>
            <Text style={styles.successTitle}>Catatan Berhasil di eksport</Text>
            <Text style={styles.successMsg}>
              {Platform.OS === "web"
                ? `File berhasil didownload ke folder Downloads kamu.\nKeuangan ${formatDate(fromDate)} - ${formatDate(toDate)}.xlsx`
                : `File Tersimpan di storage/laporan/\nKeuangan ${formatDate(fromDate)} - ${formatDate(toDate)}.xlsx`}
            </Text>
            <View style={styles.btnRow}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => {
                  setSuccess(false);
                  onClose();
                }}
              >
                <Text style={styles.cancelText}>Kembali</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.applyBtn}
                onPress={() => {
                  setSuccess(false);
                  onClose();
                }}
              >
                <Text style={styles.applyText}>Buka</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <Text style={styles.title}>Eksport Laporan</Text>

          <Text style={styles.fieldLabel}>Judul Laporan</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Judul laporan"
          />

          <View style={styles.dateRow}>
            <View style={styles.dateField}>
              <Text style={styles.fieldLabel}>Dari Tanggal</Text>
              <View style={styles.dateBox}>
                <Text style={styles.dateText}>{formatDate(fromDate)}</Text>
              </View>
            </View>
            <View style={styles.dateField}>
              <Text style={styles.fieldLabel}>Sampai Tanggal</Text>
              <View style={styles.dateBox}>
                <Text style={styles.dateText}>{formatDate(toDate)}</Text>
              </View>
            </View>
          </View>

          <Text style={styles.fieldLabel}>Kategori</Text>
          <View style={styles.dateBox}>
            <Text style={styles.dateText}>
              {category === "semua"
                ? "Semua Kategori"
                : ALL_CATEGORIES.find((c) => c.id === category)?.label}
            </Text>
          </View>

          <View style={styles.btnRow}>
            {loading ? (
              <ActivityIndicator color="#2563EB" />
            ) : (
              <>
                <TouchableOpacity
                  style={styles.applyBtn}
                  onPress={handleExport}
                >
                  <Text style={styles.applyText}>Eksport</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                  <Text style={styles.cancelText}>Batal</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "#00000060",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 16,
    textAlign: "center",
  },
  fieldLabel: {
    fontSize: 12,
    color: "#64748B",
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#1E293B",
  },
  dateRow: {
    flexDirection: "row",
    gap: 10,
  },
  dateField: { flex: 1 },
  dateBox: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  dateText: {
    fontSize: 13,
    color: "#1E293B",
  },
  btnRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 20,
  },
  applyBtn: {
    flex: 1,
    backgroundColor: "#16A34A",
    paddingVertical: 13,
    borderRadius: 8,
    alignItems: "center",
  },
  applyText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: "#DC2626",
    paddingVertical: 13,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
  successTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 12,
    textAlign: "center",
  },
  successMsg: {
    fontSize: 13,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
  },
});
