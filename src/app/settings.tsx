import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useTransactionStore } from "../store/useTransactionStore";

interface SettingRowProps {
  icon: string;
  iconColor?: string;
  label: string;
  sublabel?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
  danger?: boolean;
}

const SettingRow: React.FC<SettingRowProps> = ({
  icon,
  iconColor = "#2563EB",
  label,
  sublabel,
  onPress,
  rightElement,
  danger,
}) => (
  <TouchableOpacity
    style={styles.row}
    onPress={onPress}
    activeOpacity={onPress ? 0.7 : 1}
  >
    <View style={[styles.iconBox, { backgroundColor: iconColor + "20" }]}>
      <Ionicons name={icon as any} size={18} color={iconColor} />
    </View>
    <View style={styles.rowContent}>
      <Text style={[styles.rowLabel, danger && styles.dangerText]}>
        {label}
      </Text>
      {sublabel && <Text style={styles.rowSublabel}>{sublabel}</Text>}
    </View>
    {rightElement ??
      (onPress && (
        <Ionicons name="chevron-forward" size={16} color="#CBD5E1" />
      ))}
  </TouchableOpacity>
);

export default function SettingsScreen() {
  const { transactions, clearAll } = useTransactionStore();
  const [notifEnabled, setNotifEnabled] = useState(false);

  const totalTransactions = transactions.length;
  const totalPemasukan = transactions
    .filter((t) => t.type === "pemasukan")
    .reduce((s, t) => s + t.amount, 0);
  const totalPengeluaran = transactions
    .filter((t) => t.type === "pengeluaran")
    .reduce((s, t) => s + t.amount, 0);

  const formatRupiah = (amount: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);

  const handleClearData = () => {
    Alert.alert(
      "Hapus Semua Data",
      "Semua transaksi akan dihapus permanen. Tindakan ini tidak bisa dibatalkan.",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus Semua",
          style: "destructive",
          onPress: () => {
            clearAll();
            Alert.alert("Berhasil", "Semua data telah dihapus.");
          },
        },
      ],
    );
  };

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
        <Text style={styles.headerTitle}>Pengaturan</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Statistik */}
        <Text style={styles.sectionTitle}>Ringkasan Data</Text>
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{totalTransactions}</Text>
            <Text style={styles.statLabel}>Total Transaksi</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: "#16A34A" }]}>
              {formatRupiah(totalPemasukan)}
            </Text>
            <Text style={styles.statLabel}>Total Pemasukan</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: "#DC2626" }]}>
              {formatRupiah(totalPengeluaran)}
            </Text>
            <Text style={styles.statLabel}>Total Pengeluaran</Text>
          </View>
        </View>

        {/* Preferensi */}
        <Text style={styles.sectionTitle}>Preferensi</Text>
        <View style={styles.card}>
          <SettingRow
            icon="notifications-outline"
            iconColor="#F59E0B"
            label="Notifikasi"
            sublabel="Pengingat transaksi harian"
            rightElement={
              <Switch
                value={notifEnabled}
                onValueChange={setNotifEnabled}
                trackColor={{ false: "#E2E8F0", true: "#2563EB" }}
                thumbColor="#fff"
              />
            }
          />
          <View style={styles.separator} />
          <SettingRow
            icon="cash-outline"
            iconColor="#16A34A"
            label="Mata Uang"
            sublabel="Rupiah (IDR)"
          />
          <View style={styles.separator} />
          <SettingRow
            icon="calendar-outline"
            iconColor="#7C3AED"
            label="Awal Minggu"
            sublabel="Senin"
          />
        </View>

        {/* Data */}
        <Text style={styles.sectionTitle}>Data</Text>
        <View style={styles.card}>
          <SettingRow
            icon="wallet-outline"
            iconColor="#F59E0B"
            label="Budget & Limit"
            sublabel="Atur batas pengeluaran per kategori"
            onPress={() => router.push("/budget" as any)}
          />
          <View style={styles.separator} />
          <SettingRow
            icon="download-outline"
            iconColor="#2563EB"
            label="Export Data"
            sublabel="Simpan semua transaksi ke Excel"
            onPress={() => {
              router.back();
            }}
          />
          <View style={styles.separator} />
          <View style={styles.separator} />
          <SettingRow
            icon="trash-outline"
            iconColor="#DC2626"
            label="Hapus Semua Data"
            sublabel="Hapus seluruh riwayat transaksi"
            onPress={handleClearData}
            danger
          />
        </View>

        {/* Tentang */}
        <Text style={styles.sectionTitle}>Tentang</Text>
        <View style={styles.card}>
          <SettingRow
            icon="information-circle-outline"
            iconColor="#0891B2"
            label="Versi Aplikasi"
            sublabel="1.0.0"
          />
          <View style={styles.separator} />
          <SettingRow
            icon="code-slash-outline"
            iconColor="#64748B"
            label="Dibuat dengan"
            sublabel="React Native + Expo"
          />
          <View style={styles.separator} />
          <SettingRow
            icon="heart-outline"
            iconColor="#DB2777"
            label="UangKu"
            sublabel="Atur keuanganmu dengan mudah 💰"
          />
        </View>
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
  headerTitle: { fontSize: 16, fontWeight: "700", color: "#fff" },
  scroll: { padding: 16, gap: 8, paddingBottom: 40 },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#94A3B8",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginTop: 16,
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 12,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  rowContent: { flex: 1 },
  rowLabel: { fontSize: 14, fontWeight: "600", color: "#1E293B" },
  rowSublabel: { fontSize: 12, color: "#94A3B8", marginTop: 2 },
  dangerText: { color: "#DC2626" },
  separator: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginLeft: 64,
  },
  statsCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    flexDirection: "column",
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statItem: {
    alignItems: "center",
    gap: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1E293B",
  },
  statLabel: {
    fontSize: 12,
    color: "#94A3B8",
  },
  statDivider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    width: "100%",
  },
});
