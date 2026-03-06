import { Ionicons } from "@expo/vector-icons";
import { addMonths, subMonths } from "date-fns";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { DonutChart } from "../components/DonutChart";
import { useTransactionStore } from "../store/useTransactionStore";
import {
    PeriodType,
    formatDisplayDate,
    getDateRange,
    isInRange,
} from "../utils/dateHelper";

type ViewType = "ringkasan" | "pengeluaran" | "pemasukan";

const COLORS = [
  "#2563EB",
  "#16A34A",
  "#DC2626",
  "#D97706",
  "#7C3AED",
  "#0891B2",
  "#DB2777",
  "#65A30D",
];

export default function ChartScreen() {
  const transactions = useTransactionStore((s) => s.transactions);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [period] = useState<PeriodType>("bulanan");
  const [viewType, setViewType] = useState<ViewType>("ringkasan");
  const [showDropdown, setShowDropdown] = useState(false);

  const { start, end } = getDateRange(currentDate, period);

  const filtered = useMemo(
    () => transactions.filter((tx) => isInRange(tx.date, start, end)),
    [transactions, start, end],
  );

  const chartData = useMemo(() => {
    const source =
      viewType === "ringkasan"
        ? filtered
        : filtered.filter(
            (tx) =>
              tx.type ===
              (viewType === "pengeluaran" ? "pengeluaran" : "pemasukan"),
          );

    const grouped: Record<string, { label: string; amount: number }> = {};
    source.forEach((tx) => {
      if (!grouped[tx.category]) {
        grouped[tx.category] = { label: tx.categoryLabel, amount: 0 };
      }
      grouped[tx.category].amount += tx.amount;
    });

    return Object.entries(grouped).map(([, val], i) => ({
      label: val.label,
      amount: val.amount,
      color: COLORS[i % COLORS.length],
    }));
  }, [filtered, viewType]);

  const total = chartData.reduce((s, d) => s + d.amount, 0);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back-circle-outline" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Grafik</Text>

        {/* View Type Dropdown */}
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => setShowDropdown(!showDropdown)}
        >
          <Text style={styles.dropdownText}>
            {viewType.charAt(0).toUpperCase() + viewType.slice(1)}
          </Text>
          <Ionicons name="chevron-down" size={14} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Dropdown Menu */}
      {showDropdown && (
        <View style={styles.dropdownMenu}>
          {(["ringkasan", "pengeluaran", "pemasukan"] as ViewType[]).map(
            (v) => (
              <TouchableOpacity
                key={v}
                style={styles.dropdownItem}
                onPress={() => {
                  setViewType(v);
                  setShowDropdown(false);
                }}
              >
                <Ionicons
                  name={viewType === v ? "checkmark-circle" : "ellipse-outline"}
                  size={16}
                  color={viewType === v ? "#2563EB" : "#CBD5E1"}
                />
                <Text style={styles.dropdownItemText}>
                  {v.charAt(0).toUpperCase() + v.slice(1)}
                </Text>
              </TouchableOpacity>
            ),
          )}
        </View>
      )}

      <ScrollView>
        {/* Month Navigator */}
        <View style={styles.monthNav}>
          <TouchableOpacity
            onPress={() => setCurrentDate((d) => subMonths(d, 1))}
          >
            <Ionicons name="chevron-back" size={20} color="#1E3A5F" />
          </TouchableOpacity>
          <Text style={styles.monthLabel}>
            {formatDisplayDate(currentDate, "bulanan")}
          </Text>
          <TouchableOpacity
            onPress={() => setCurrentDate((d) => addMonths(d, 1))}
          >
            <Ionicons name="chevron-forward" size={20} color="#1E3A5F" />
          </TouchableOpacity>

          {/* Period Picker */}
          <View style={styles.periodBox}>
            <Text style={styles.periodText}>Bulanan</Text>
            <Ionicons name="chevron-down" size={14} color="#1E3A5F" />
          </View>
        </View>

        {/* Chart */}
        {chartData.length > 0 ? (
          <DonutChart data={chartData} total={total} />
        ) : (
          <View style={styles.empty}>
            <Ionicons name="pie-chart-outline" size={64} color="#CBD5E1" />
            <Text style={styles.emptyText}>Tidak ada data</Text>
          </View>
        )}
      </ScrollView>
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
  headerTitle: { flex: 1, fontSize: 16, fontWeight: "700", color: "#fff" },
  dropdown: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#ffffff20",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  dropdownText: { color: "#fff", fontSize: 13, fontWeight: "600" },
  dropdownMenu: {
    position: "absolute",
    top: 56,
    right: 12,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 8,
    minWidth: 150,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 100,
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    gap: 10,
  },
  dropdownItemText: { fontSize: 14, color: "#1E293B" },
  monthNav: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 8,
  },
  monthLabel: { flex: 1, fontSize: 15, fontWeight: "700", color: "#1E293B" },
  periodBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  periodText: { fontSize: 13, color: "#1E293B" },
  empty: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
    gap: 12,
  },
  emptyText: { fontSize: 15, color: "#94A3B8", fontWeight: "500" },
});
