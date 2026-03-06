import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SortType } from "../hooks/useFilteredTransactions";

interface Props {
  visible: boolean;
  current: SortType;
  onSelect: (sort: SortType) => void;
  onClose: () => void;
}

export const SortModal: React.FC<Props> = ({
  visible,
  current,
  onSelect,
  onClose,
}) => {
  const options: { value: SortType; label: string }[] = [
    { value: "terbaru", label: "Terbaru" },
    { value: "terlama", label: "Terlama" },
  ];

  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableOpacity
        style={styles.overlay}
        onPress={onClose}
        activeOpacity={1}
      >
        <View style={styles.menu}>
          {options.map((opt) => (
            <TouchableOpacity
              key={opt.value}
              style={styles.item}
              onPress={() => {
                onSelect(opt.value);
                onClose();
              }}
            >
              <Ionicons
                name={
                  current === opt.value ? "checkmark-circle" : "ellipse-outline"
                }
                size={18}
                color={current === opt.value ? "#2563EB" : "#CBD5E1"}
              />
              <Text
                style={[
                  styles.label,
                  current === opt.value && styles.labelActive,
                ]}
              >
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "#00000040",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    paddingTop: 100,
    paddingRight: 16,
  },
  menu: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 8,
    minWidth: 150,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 10,
  },
  label: {
    fontSize: 14,
    color: "#64748B",
  },
  labelActive: {
    color: "#2563EB",
    fontWeight: "600",
  },
});
