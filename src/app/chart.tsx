import { Ionicons } from "@expo/vector-icons";
import {
  addDays,
  addMonths,
  addWeeks,
  addYears
} from "date-fns";
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
import { PeriodPickerModal } from "../components/PeriodPickerModal";
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
  const [period, setPeriod] = useState<PeriodType>("bulanan");
  const [viewType, setViewType] = useState<ViewType>("ringkasan");
  const [showViewDropdown, setShowViewDropdown] = useState(false);
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);
  const [showPeriodPicker, setShowPeriodPicker] = useState(false);

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

  const summary = useMemo(() => {
    const pemasukan = filtered
      .filter((t) => t.type === "pemasukan")
      .reduce((s, t) => s + t.amount, 0);
    const pengeluaran = filtered
      .filter((t) => t.type === "pengeluaran")
      .reduce((s, t) => s + t.amount, 0);
    return { pemasukan, pengeluaran, saldo: pemasukan - pengeluaran };
  }, [filtered]);

  const total = chartData.reduce((s, d) => s + d.amount, 0);

  const navigatePeriod = (direction: "prev" | "next") => {
    const fn = direction === "prev" ? -1 : 1;
    switch (period) {
      case "harian":
        setCurrentDate((d) => addDays(d, fn));
        break;
      case "mingguan":
        setCurrentDate((d) => addWeeks(d, fn));
        break;
      case "bulanan":
        setCurrentDate((d) => addMonths(d, fn));
        break;
      case "tahunan":
        setCurrentDate((d) => addYears(d, fn));
        break;
    }
  };

  const formatRupiah = (amount: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);

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
        <Text style={styles.headerTitle}>Grafik</Text>

        {/* View Type Dropdown */}
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => {
            setShowViewDropdown(!showViewDropdown);
            setShowPeriodDropdown(false);
          }}
        >
          <Text style={styles.dropdownText}>
            {viewType.charAt(0).toUpperCase() + viewType.slice(1)}
          </Text>
          <Ionicons name="chevron-down" size={14} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* View Type Dropdown Menu */}
      {showViewDropdown && (
        <View style={[styles.dropdownMenu, { top: 58, right: 12 }]}>
          {(["ringkasan", "pengeluaran", "pemasukan"] as ViewType[]).map(
            (v) => (
              <TouchableOpacity
                key={v}
                style={styles.dropdownItem}
                onPress={() => {
                  setViewType(v);
                  setShowViewDropdown(false);
                }}
              >
                <Ionicons
                  name={viewType === v ? "checkmark-circle" : "ellipse-outline"}
                  size={16}
                  color={viewType === v ? "#2563EB" : "#CBD5E1"}
                />
                <Text
                  style={[
                    styles.dropdownItemText,
                    viewType === v && styles.dropdownItemActive,
                  ]}
                >
                  {v.charAt(0).toUpperCase() + v.slice(1)}
                </Text>
              </TouchableOpacity>
            ),
          )}
        </View>
      )}

      <ScrollView
        onScrollBeginDrag={() => {
          setShowViewDropdown(false);
          setShowPeriodDropdown(false);
        }}
      >
        {/* Period Navigator */}
        <View style={styles.periodNav}>
          <TouchableOpacity onPress={() => navigatePeriod("prev")}>
            <Ionicons name="chevron-back" size={20} color="#1E3A5F" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.periodLabelBtn}
            onPress={() => setShowPeriodPicker(true)}
          >
            <Text style={styles.periodLabel}>
              {formatDisplayDate(currentDate, period)}
            </Text>
            <Ionicons name="chevron-down" size={14} color="#94A3B8" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigatePeriod("next")}>
            <Ionicons name="chevron-forward" size={20} color="#1E3A5F" />
          </TouchableOpacity>

          {/* Period Type Dropdown */}
          <TouchableOpacity
            style={styles.periodTypeBtn}
            onPress={() => {
              setShowPeriodDropdown(!showPeriodDropdown);
              setShowViewDropdown(false);
            }}
          >
            <Text style={styles.periodTypeText}>
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </Text>
            <Ionicons name="chevron-down" size={14} color="#1E3A5F" />
          </TouchableOpacity>
        </View>

        {/* Period Dropdown Menu */}
        {showPeriodDropdown && (
          <View style={[styles.dropdownMenu, { top: 120, right: 12 }]}>
            {(["harian", "mingguan", "bulanan", "tahunan"] as PeriodType[]).map(
              (p) => (
                <TouchableOpacity
                  key={p}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setPeriod(p);
                    setShowPeriodDropdown(false);
                  }}
                >
                  <Ionicons
                    name={period === p ? "checkmark-circle" : "ellipse-outline"}
                    size={16}
                    color={period === p ? "#2563EB" : "#CBD5E1"}
                  />
                  <Text
                    style={[
                      styles.dropdownItemText,
                      period === p && styles.dropdownItemActive,
                    ]}
                  >
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </Text>
                </TouchableOpacity>
              ),
            )}
          </View>
        )}

        {/* Summary Cards */}
        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryCardLabel}>Pemasukan</Text>
            <Text style={[styles.summaryCardValue, { color: "#16A34A" }]}>
              {formatRupiah(summary.pemasukan)}
            </Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryCardLabel}>Pengeluaran</Text>
            <Text style={[styles.summaryCardValue, { color: "#DC2626" }]}>
              {formatRupiah(summary.pengeluaran)}
            </Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryCardLabel}>Saldo</Text>
            <Text
              style={[
                styles.summaryCardValue,
                { color: summary.saldo >= 0 ? "#2563EB" : "#DC2626" },
              ]}
            >
              {formatRupiah(summary.saldo)}
            </Text>
          </View>
        </View>

        {/* Chart */}
        {chartData.length > 0 ? (
          <DonutChart data={chartData} total={total} />
        ) : (
          <View style={styles.empty}>
            <Ionicons name="pie-chart-outline" size={64} color="#CBD5E1" />
            <Text style={styles.emptyText}>Tidak ada data</Text>
            <Text style={styles.emptySubtext}>
              Belum ada transaksi pada periode ini
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Period Picker Modal */}
      <PeriodPickerModal
        visible={showPeriodPicker}
        period={period}
        currentDate={currentDate}
        onSelect={(date) => setCurrentDate(date)}
        onClose={() => setShowPeriodPicker(false)}
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
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 8,
    minWidth: 150,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 10,
    zIndex: 100,
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    gap: 10,
  },
  dropdownItemText: { fontSize: 14, color: "#64748B" },
  dropdownItemActive: { color: "#2563EB", fontWeight: "700" },
  periodNav: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 8,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  periodLabelBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  periodLabel: { fontSize: 15, fontWeight: "700", color: "#1E293B" },
  periodTypeBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  periodTypeText: { fontSize: 13, color: "#1E293B", fontWeight: "600" },
  summaryRow: {
    flexDirection: "row",
    padding: 16,
    gap: 8,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    alignItems: "center",
    gap: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryCardLabel: { fontSize: 11, color: "#94A3B8", fontWeight: "600" },
  summaryCardValue: { fontSize: 13, fontWeight: "800" },
  empty: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60,
    gap: 8,
  },
  emptyText: { fontSize: 15, color: "#94A3B8", fontWeight: "500" },
  emptySubtext: { fontSize: 13, color: "#CBD5E1" },
});
