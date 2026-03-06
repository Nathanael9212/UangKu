import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { Transaction } from "../store/useTransactionStore";
import { TransactionItem } from "./TransactionItem";

interface Props {
  transactions: Transaction[];
  onPressItem?: (tx: Transaction) => void;
  onLongPressItem?: (tx: Transaction) => void;
}

export const TransactionList: React.FC<Props> = ({
  transactions,
  onPressItem,
  onLongPressItem,
}) => {
  if (transactions.length === 0) {
    return (
      <View style={styles.empty}>
        <Ionicons name="document-outline" size={64} color="#CBD5E1" />
        <Text style={styles.emptyText}>Data Tidak Tersedia</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={transactions}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TransactionItem
          transaction={item}
          onPress={onPressItem}
          onLongPress={onLongPressItem}
        />
      )}
      contentContainerStyle={styles.list}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    paddingBottom: 100,
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
    gap: 12,
  },
  emptyText: {
    fontSize: 15,
    color: "#94A3B8",
    fontWeight: "500",
  },
});
