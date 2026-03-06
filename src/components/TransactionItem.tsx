import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Transaction } from "../store/useTransactionStore";
import { formatRupiah } from "../utils/currency";
import { formatDate } from "../utils/dateHelper";

interface Props {
  transaction: Transaction;
  onPress?: (tx: Transaction) => void;
  onLongPress?: (tx: Transaction) => void;
}

export const TransactionItem: React.FC<Props> = ({
  transaction,
  onPress,
  onLongPress,
}) => {
  const isIncome = transaction.type === "pemasukan";

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress?.(transaction)}
      onLongPress={() => onLongPress?.(transaction)}
      activeOpacity={0.7}
    >
      <View style={styles.left}>
        <Text style={styles.date}>{formatDate(transaction.date)}</Text>
        <Text style={styles.category}>{transaction.categoryLabel}</Text>
        <Text style={styles.description} numberOfLines={1}>
          {transaction.description}
        </Text>
      </View>
      <Text style={[styles.amount, isIncome ? styles.income : styles.expense]}>
        {isIncome ? "+" : "-"} {formatRupiah(transaction.amount)}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  left: {
    flex: 1,
    marginRight: 12,
  },
  date: {
    fontSize: 11,
    color: "#94A3B8",
    marginBottom: 2,
  },
  category: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: 2,
  },
  description: {
    fontSize: 12,
    color: "#64748B",
  },
  amount: {
    fontSize: 14,
    fontWeight: "700",
  },
  income: { color: "#16A34A" },
  expense: { color: "#DC2626" },
});
