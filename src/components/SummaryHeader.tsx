import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { formatRupiah } from "../utils/currency";

interface Props {
  pemasukan: number;
  pengeluaran: number;
  saldo: number;
}

export const SummaryHeader: React.FC<Props> = ({
  pemasukan,
  pengeluaran,
  saldo,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.item}>
        <Text style={styles.label}>Pemasukan</Text>
        <Text style={[styles.amount, styles.income]}>
          {formatRupiah(pemasukan)}
        </Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.item}>
        <Text style={styles.label}>Pengeluaran</Text>
        <Text style={[styles.amount, styles.expense]}>
          {formatRupiah(pengeluaran)}
        </Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.item}>
        <Text style={styles.label}>Saldo</Text>
        <Text style={[styles.amount, styles.balance]}>
          {formatRupiah(saldo)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#1E3A5F",
    paddingVertical: 14,
    paddingHorizontal: 16,
    justifyContent: "space-between",
    alignItems: "center",
  },
  item: {
    flex: 1,
    alignItems: "center",
  },
  divider: {
    width: 1,
    height: 36,
    backgroundColor: "#ffffff30",
  },
  label: {
    fontSize: 11,
    color: "#ffffffaa",
    marginBottom: 4,
  },
  amount: {
    fontSize: 13,
    fontWeight: "700",
  },
  income: { color: "#4ADE80" },
  expense: { color: "#F87171" },
  balance: { color: "#FFFFFF" },
});
