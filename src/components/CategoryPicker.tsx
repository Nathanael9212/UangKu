import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Category,
  PEMASUKAN_CATEGORIES,
  PENGELUARAN_CATEGORIES,
  TransactionType,
} from "../constants/categories";

interface Props {
  visible: boolean;
  type: TransactionType;
  selected: string;
  onSelect: (category: Category) => void;
  onClose: () => void;
}

export const CategoryPicker: React.FC<Props> = ({
  visible,
  type,
  selected,
  onSelect,
  onClose,
}) => {
  const categories =
    type === "pemasukan" ? PEMASUKAN_CATEGORIES : PENGELUARAN_CATEGORIES;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <Text style={styles.title}>Pilih Kategori</Text>
          <ScrollView>
            {categories.map((cat) => {
              const isSelected = selected === cat.id;
              return (
                <TouchableOpacity
                  key={cat.id}
                  style={[styles.item, isSelected && styles.itemSelected]}
                  onPress={() => {
                    onSelect(cat);
                    onClose();
                  }}
                >
                  <View
                    style={[
                      styles.iconBox,
                      { backgroundColor: cat.color + "20" },
                    ]}
                  >
                    <Ionicons
                      name={cat.icon as any}
                      size={18}
                      color={cat.color}
                    />
                  </View>
                  <Text
                    style={[styles.label, isSelected && styles.labelSelected]}
                  >
                    {cat.label}
                  </Text>
                  {isSelected && (
                    <Ionicons
                      name="checkmark-circle"
                      size={18}
                      color={cat.color}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
          <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
            <Text style={styles.cancelText}>Batal</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "#00000060",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    maxHeight: "70%",
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 16,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    gap: 12,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  itemSelected: {
    backgroundColor: "#F8FAFC",
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    flex: 1,
    fontSize: 14,
    color: "#1E293B",
  },
  labelSelected: {
    fontWeight: "700",
  },
  cancelBtn: {
    marginTop: 16,
    alignItems: "center",
    paddingVertical: 12,
    backgroundColor: "#F1F5F9",
    borderRadius: 8,
  },
  cancelText: {
    fontSize: 14,
    color: "#64748B",
    fontWeight: "600",
  },
});
