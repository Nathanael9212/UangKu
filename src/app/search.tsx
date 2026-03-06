import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { CategoryPicker } from "../components/CategoryPicker";
import { SummaryHeader } from "../components/SummaryHeader";
import { TransactionList } from "../components/TransactionList";
import { useTransactionStore } from "../store/useTransactionStore";
import { parseRupiah } from "../utils/currency";
import { formatDate } from "../utils/dateHelper";

export default function SearchScreen() {
  const transactions = useTransactionStore((s) => s.transactions);

  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("");
  const [categoryLabel, setCategoryLabel] = useState("");
  const [fromDate] = useState(new Date(new Date().getFullYear(), 0, 1));
  const [toDate] = useState(new Date());
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [searched, setSearched] = useState(false);

  const results = useMemo(() => {
    if (!searched) return [];

    return transactions.filter((tx) => {
      const matchKeyword = keyword
        ? tx.description.toLowerCase().includes(keyword.toLowerCase()) ||
          tx.categoryLabel.toLowerCase().includes(keyword.toLowerCase())
        : true;

      const matchCategory = category ? tx.category === category : true;

      const txDate = new Date(tx.date);
      const matchDate = txDate >= fromDate && txDate <= toDate;

      const txAmount = tx.amount;
      const min = minAmount ? parseRupiah(minAmount) : 0;
      const max = maxAmount ? parseRupiah(maxAmount) : Infinity;
      const matchAmount = txAmount >= min && txAmount <= max;

      return matchKeyword && matchCategory && matchDate && matchAmount;
    });
  }, [
    searched,
    keyword,
    category,
    fromDate,
    toDate,
    minAmount,
    maxAmount,
    transactions,
  ]);

  const summary = useMemo(() => {
    const pemasukan = results
      .filter((t) => t.type === "pemasukan")
      .reduce((s, t) => s + t.amount, 0);
    const pengeluaran = results
      .filter((t) => t.type === "pengeluaran")
      .reduce((s, t) => s + t.amount, 0);
    return { pemasukan, pengeluaran, saldo: pemasukan - pengeluaran };
  }, [results]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() =>
            router.canGoBack() ? router.back() : router.replace("/(tabs)")
          }
        >
          <Ionicons name="chevron-back-circle-outline" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cari Catatan</Text>
      </View>

      {/* Filter Form */}
      <View style={styles.form}>
        {/* Keyword */}
        <View style={styles.searchRow}>
          <Ionicons name="search-outline" size={18} color="#94A3B8" />
          <TextInput
            style={styles.searchInput}
            placeholder="Kata Kunci"
            placeholderTextColor="#94A3B8"
            value={keyword}
            onChangeText={setKeyword}
          />
        </View>

        {/* Kategori */}
        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Kategori</Text>
          <TouchableOpacity
            style={styles.fieldValue}
            onPress={() => setShowCategoryPicker(true)}
          >
            <Text style={styles.fieldValueText}>
              {categoryLabel || "Semua Kategori"}
            </Text>
            <Ionicons name="chevron-down" size={16} color="#94A3B8" />
          </TouchableOpacity>
        </View>

        {/* Tanggal */}
        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Tanggal</Text>
          <View style={styles.dateRange}>
            <View style={styles.dateBox}>
              <Text style={styles.dateText}>{formatDate(fromDate)}</Text>
            </View>
            <Text style={styles.dateSep}>—</Text>
            <View style={styles.dateBox}>
              <Text style={styles.dateText}>{formatDate(toDate)}</Text>
            </View>
          </View>
        </View>

        {/* Jumlah */}
        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Jumlah</Text>
          <View style={styles.dateRange}>
            <TextInput
              style={styles.amountInput}
              placeholder="Min"
              placeholderTextColor="#94A3B8"
              value={minAmount}
              onChangeText={setMinAmount}
              keyboardType="numeric"
            />
            <Text style={styles.dateSep}>—</Text>
            <TextInput
              style={styles.amountInput}
              placeholder="Max"
              placeholderTextColor="#94A3B8"
              value={maxAmount}
              onChangeText={setMaxAmount}
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Search Button */}
        <TouchableOpacity
          style={styles.searchBtn}
          onPress={() => setSearched(true)}
        >
          <Text style={styles.searchBtnText}>Cari</Text>
        </TouchableOpacity>
      </View>

      {/* Results */}
      {searched && (
        <>
          <SummaryHeader
            pemasukan={summary.pemasukan}
            pengeluaran={summary.pengeluaran}
            saldo={summary.saldo}
          />
          <TransactionList
            transactions={results}
            onPressItem={(tx) =>
              router.push({
                pathname: "/add-transaction",
                params: { id: tx.id },
              })
            }
          />
        </>
      )}

      <CategoryPicker
        visible={showCategoryPicker}
        type="pemasukan"
        selected={category}
        onSelect={(cat) => {
          setCategory(cat.id);
          setCategoryLabel(cat.label);
        }}
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
  form: { padding: 16, gap: 12, backgroundColor: "#fff", marginBottom: 4 },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  searchInput: { flex: 1, fontSize: 14, color: "#1E293B" },
  fieldRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  fieldLabel: { width: 70, fontSize: 13, color: "#64748B", fontWeight: "600" },
  fieldValue: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  fieldValueText: { fontSize: 13, color: "#1E293B" },
  dateRange: { flex: 1, flexDirection: "row", alignItems: "center", gap: 6 },
  dateBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  dateText: { fontSize: 12, color: "#1E293B" },
  dateSep: { fontSize: 14, color: "#94A3B8" },
  amountInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 13,
    color: "#1E293B",
  },
  searchBtn: {
    backgroundColor: "#16A34A",
    paddingVertical: 13,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 4,
  },
  searchBtnText: { color: "#fff", fontWeight: "700", fontSize: 14 },
});
