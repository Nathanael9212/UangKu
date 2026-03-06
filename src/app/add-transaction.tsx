import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { CategoryPicker } from "../components/CategoryPicker";
import { Category, TransactionType } from "../constants/categories";
import { useTransactionStore } from "../store/useTransactionStore";
import { formatRupiah, parseRupiah } from "../utils/currency";
import { formatDate } from "../utils/dateHelper";

const goBack = () => {
  router.canGoBack() ? router.back() : router.replace("/(tabs)");
};

export default function AddTransactionScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { transactions, addTransaction, editTransaction } =
    useTransactionStore();

  const existing = id ? transactions.find((t) => t.id === id) : null;
  const isEdit = !!existing;

  const [type, setType] = useState<TransactionType>(
    existing?.type ?? "pemasukan",
  );
  const [date] = useState(existing ? new Date(existing.date) : new Date());
  const [category, setCategory] = useState(existing?.category ?? "");
  const [categoryLabel, setCategoryLabel] = useState(
    existing?.categoryLabel ?? "",
  );
  const [amount, setAmount] = useState(
    existing ? formatRupiah(existing.amount) : "",
  );
  const [description, setDescription] = useState(existing?.description ?? "");
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);

  const handleSelectCategory = (cat: Category) => {
    setCategory(cat.id);
    setCategoryLabel(cat.label);
  };

  const handleSave = () => {
    if (!category)
      return Alert.alert("Error", "Pilih kategori terlebih dahulu.");
    if (!amount) return Alert.alert("Error", "Masukkan jumlah transaksi.");
    if (!description.trim())
      return Alert.alert("Error", "Masukkan deskripsi transaksi.");

    const tx = {
      type,
      date: date.toISOString(),
      category,
      categoryLabel,
      amount: parseRupiah(amount),
      description: description.trim(),
    };

    if (isEdit && id) {
      editTransaction(id, tx);
    } else {
      addTransaction(tx);
    }

    goBack();
  };

  const handleAmountChange = (val: string) => {
    const numeric = val.replace(/[^0-9]/g, "");
    if (numeric) {
      setAmount(formatRupiah(parseInt(numeric, 10)));
    } else {
      setAmount("");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack}>
          <Ionicons name="chevron-back-circle-outline" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isEdit ? "Edit Transaksi" : "Catat Transaksiku"}
        </Text>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.form}>
          <View style={styles.typeRow}>
            {(["pemasukan", "pengeluaran"] as TransactionType[]).map((t) => (
              <TouchableOpacity
                key={t}
                style={[
                  styles.typeBtn,
                  type === t &&
                    (t === "pemasukan"
                      ? styles.typeBtnIncome
                      : styles.typeBtnExpense),
                ]}
                onPress={() => {
                  setType(t);
                  setCategory("");
                  setCategoryLabel("");
                }}
              >
                <Text
                  style={[
                    styles.typeBtnText,
                    type === t && styles.typeBtnTextActive,
                  ]}
                >
                  {t === "pemasukan" ? "Pemasukan" : "Pengeluaran"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Tanggal</Text>
          <View style={styles.input}>
            <Text style={styles.inputText}>{formatDate(date)}</Text>
          </View>

          <Text style={styles.label}>Kategori</Text>
          <TouchableOpacity
            style={styles.inputRow}
            onPress={() => setShowCategoryPicker(true)}
          >
            <Text
              style={[styles.inputText, !categoryLabel && styles.placeholder]}
            >
              {categoryLabel || "Pilih kategori"}
            </Text>
            <Ionicons name="chevron-down" size={18} color="#94A3B8" />
          </TouchableOpacity>

          <Text style={styles.label}>Jumlah</Text>
          <TextInput
            style={styles.inputField}
            value={amount}
            onChangeText={handleAmountChange}
            placeholder="Rp 0"
            keyboardType="numeric"
            placeholderTextColor="#94A3B8"
          />

          <Text style={styles.label}>Deskripsi</Text>
          <TextInput
            style={styles.inputField}
            value={description}
            onChangeText={setDescription}
            placeholder="Masukkan deskripsi"
            placeholderTextColor="#94A3B8"
          />

          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveBtnText}>Save</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      <CategoryPicker
        visible={showCategoryPicker}
        type={type}
        selected={category}
        onSelect={handleSelectCategory}
        onClose={() => setShowCategoryPicker(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E3A5F",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  headerTitle: { fontSize: 16, fontWeight: "700", color: "#fff" },
  form: { padding: 20, gap: 4 },
  typeRow: { flexDirection: "row", gap: 10, marginBottom: 16 },
  typeBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
  },
  typeBtnIncome: { backgroundColor: "#16A34A" },
  typeBtnExpense: { backgroundColor: "#DC2626" },
  typeBtnText: { fontSize: 14, fontWeight: "600", color: "#64748B" },
  typeBtnTextActive: { color: "#fff" },
  label: { fontSize: 13, color: "#64748B", marginTop: 12, marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: "#fff",
  },
  inputRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: "#fff",
  },
  inputField: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: "#fff",
    fontSize: 14,
    color: "#1E293B",
  },
  inputText: { fontSize: 14, color: "#1E293B" },
  placeholder: { color: "#94A3B8" },
  saveBtn: {
    marginTop: 28,
    backgroundColor: "#2563EB",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  saveBtnText: { color: "#fff", fontWeight: "700", fontSize: 15 },
});
