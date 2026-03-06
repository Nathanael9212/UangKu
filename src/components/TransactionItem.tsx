import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getCategoryById } from "../constants/categories";
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
  const category = getCategoryById(transaction.category);
  const iconColor = category?.color ?? (isIncome ? "#16A34A" : "#DC2626");
  const iconName =
    category?.icon ??
    (isIncome ? "arrow-down-circle-outline" : "arrow-up-circle-outline");

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress?.(transaction)}
      onLongPress={() => onLongPress?.(transaction)}
      activeOpacity={0.7}
    >
      {/* Icon */}
      <View style={[styles.iconBox, { backgroundColor: iconColor + "20" }]}>
        <Ionicons name={iconName as any} size={20} color={iconColor} />
      </View>

      {/* Content */}
      <View style={styles.left}>
        <Text style={styles.category}>{transaction.categoryLabel}</Text>
        <Text style={styles.description} numberOfLines={1}>
          {transaction.description}
        </Text>
        <Text style={styles.date}>{formatDate(transaction.date)}</Text>
      </View>

      {/* Amount */}
      <Text style={[styles.amount, isIncome ? styles.income : styles.expense]}>
        {isIncome ? "+" : "-"}
        {formatRupiah(transaction.amount)}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    gap: 12,
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  left: {
    flex: 1,
    gap: 2,
  },
  category: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1E293B",
  },
  description: {
    fontSize: 12,
    color: "#64748B",
  },
  date: {
    fontSize: 11,
    color: "#94A3B8",
  },
  amount: {
    fontSize: 14,
    fontWeight: "800",
  },
  income: { color: "#16A34A" },
  expense: { color: "#DC2626" },
});
