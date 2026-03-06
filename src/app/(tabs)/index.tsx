import { Ionicons } from "@expo/vector-icons";
import {
    addDays,
    addMonths,
    addWeeks,
    addYears
} from "date-fns";
import { router } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { ExportModal } from "../../components/ExportModal";
import { FilterModal } from "../../components/FilterModal";
import { SortModal } from "../../components/SortModal";
import { SummaryHeader } from "../../components/SummaryHeader";
import { TransactionList } from "../../components/TransactionList";
import { TransactionType } from "../../constants/categories";
import {
    SortType,
    useFilteredTransactions,
} from "../../hooks/useFilteredTransactions";
import {
    Transaction,
    useTransactionStore,
} from "../../store/useTransactionStore";
import { PeriodType, formatDisplayDate } from "../../utils/dateHelper";

type SettingMenu = "search" | "chart" | "category" | "settings";

export default function HomeScreen() {
  const [period, setPeriod] = useState<PeriodType>("bulanan");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showFilter, setShowFilter] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [typeFilter, setTypeFilter] = useState<TransactionType | "semua">(
    "pemasukan",
  );
  const [sort, setSort] = useState<SortType>("terbaru");

  const deleteTransaction = useTransactionStore((s) => s.deleteTransaction);
  const { filtered, summary } = useFilteredTransactions({
    period,
    currentDate,
    selectedCategories,
    typeFilter,
    sort,
  });

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

  const handleLongPress = (tx: Transaction) => {
    Alert.alert("Hapus Transaksi", `Hapus "${tx.description}"?`, [
      { text: "Batal", style: "cancel" },
      {
        text: "Hapus",
        style: "destructive",
        onPress: () => deleteTransaction(tx.id),
      },
    ]);
  };

  const handleSettingMenu = (menu: SettingMenu) => {
    setShowSettings(false);
    switch (menu) {
      case "search":
        router.push("/search");
        break;
      case "chart":
        router.push("/chart");
        break;
      case "category":
        setShowFilter(true);
        break;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        {/* Period Navigator */}
        <TouchableOpacity onPress={() => navigatePeriod("prev")}>
          <Ionicons name="chevron-back" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.periodLabel}>
          {formatDisplayDate(currentDate, period)}
        </Text>
        <TouchableOpacity onPress={() => navigatePeriod("next")}>
          <Ionicons name="chevron-forward" size={20} color="#fff" />
        </TouchableOpacity>

        {/* Action Icons */}
        <View style={styles.topActions}>
          <TouchableOpacity onPress={() => setShowExport(true)}>
            <Ionicons name="download-outline" size={22} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowSort(true)}>
            <Ionicons name="swap-vertical-outline" size={22} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowFilter(true)}>
            <Ionicons name="filter-outline" size={22} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowSettings(!showSettings)}>
            <Ionicons name="menu-outline" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Period Tabs */}
      <View style={styles.periodTabs}>
        {(["harian", "mingguan", "bulanan", "tahunan"] as PeriodType[]).map(
          (p) => (
            <TouchableOpacity
              key={p}
              style={[styles.tab, period === p && styles.tabActive]}
              onPress={() => setPeriod(p)}
            >
              <Text
                style={[styles.tabText, period === p && styles.tabTextActive]}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </Text>
            </TouchableOpacity>
          ),
        )}
      </View>

      {/* Summary */}
      <SummaryHeader
        pemasukan={summary.pemasukan}
        pengeluaran={summary.pengeluaran}
        saldo={summary.saldo}
      />

      {/* Transaction List */}
      <TransactionList
        transactions={filtered}
        onLongPressItem={handleLongPress}
        onPressItem={(tx) =>
          router.push({ pathname: "/add-transaction", params: { id: tx.id } })
        }
      />

      {/* Settings Dropdown */}
      {showSettings && (
        <View style={styles.settingsMenu}>
          {[
            { key: "search", icon: "search-outline", label: "Cari Catatan" },
            { key: "chart", icon: "bar-chart-outline", label: "Grafik" },
            { key: "category", icon: "list-outline", label: "Kategori" },
            { key: "settings", icon: "settings-outline", label: "Pengaturan" },
          ].map((item) => (
            <TouchableOpacity
              key={item.key}
              style={styles.settingsItem}
              onPress={() => handleSettingMenu(item.key as SettingMenu)}
            >
              <Ionicons name={item.icon as any} size={18} color="#1E293B" />
              <Text style={styles.settingsLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("/add-transaction")}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Modals */}
      <FilterModal
        visible={showFilter}
        typeFilter={typeFilter}
        selectedCategories={selectedCategories}
        onApply={(type, cats) => {
          setTypeFilter(type);
          setSelectedCategories(cats);
        }}
        onClose={() => setShowFilter(false)}
      />
      <SortModal
        visible={showSort}
        current={sort}
        onSelect={setSort}
        onClose={() => setShowSort(false)}
      />
      <ExportModal visible={showExport} onClose={() => setShowExport(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E3A5F",
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  periodLabel: {
    flex: 1,
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
    textAlign: "center",
  },
  topActions: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  periodTabs: {
    flexDirection: "row",
    backgroundColor: "#1E3A5F",
    paddingHorizontal: 12,
    paddingBottom: 10,
    gap: 6,
  },
  tab: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: "center",
  },
  tabActive: { backgroundColor: "#ffffff25" },
  tabText: { fontSize: 12, color: "#ffffff80" },
  tabTextActive: { color: "#fff", fontWeight: "700" },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  settingsMenu: {
    position: "absolute",
    top: 96,
    right: 12,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 8,
    minWidth: 160,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 100,
  },
  settingsItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 10,
  },
  settingsLabel: { fontSize: 14, color: "#1E293B" },
});
