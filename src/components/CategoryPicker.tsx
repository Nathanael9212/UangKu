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
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={styles.item}
                onPress={() => {
                  onSelect(cat);
                  onClose();
                }}
              >
                <View
                  style={[
                    styles.radio,
                    selected === cat.id && styles.radioSelected,
                  ]}
                />
                <Text style={styles.label}>{cat.label}</Text>
              </TouchableOpacity>
            ))}
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
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#CBD5E1",
  },
  radioSelected: {
    borderColor: "#2563EB",
    backgroundColor: "#2563EB",
  },
  label: {
    fontSize: 14,
    color: "#1E293B",
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
