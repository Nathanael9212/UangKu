import React, { useState } from 'react';
import {
  View, Text, Modal, TouchableOpacity,
  ScrollView, StyleSheet,
} from 'react-native';
import { PEMASUKAN_CATEGORIES, PENGELUARAN_CATEGORIES, TransactionType } from '../constants/categories';

interface Props {
  visible: boolean;
  typeFilter: TransactionType | 'semua';
  selectedCategories: string[];
  onApply: (type: TransactionType | 'semua', categories: string[]) => void;
  onClose: () => void;
}

export const FilterModal: React.FC<Props> = ({
  visible, typeFilter, selectedCategories, onApply, onClose,
}) => {
  const [localType, setLocalType] = useState<TransactionType | 'semua'>(typeFilter);
  const [localCategories, setLocalCategories] = useState<string[]>(selectedCategories);

  const categories = localType === 'pemasukan'
    ? PEMASUKAN_CATEGORIES
    : localType === 'pengeluaran'
    ? PENGELUARAN_CATEGORIES
    : [...PEMASUKAN_CATEGORIES, ...PENGELUARAN_CATEGORIES];

  const toggleCategory = (id: string) => {
    setLocalCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const selectAll = () => setLocalCategories(categories.map((c) => c.id));
  const isAllSelected = localCategories.length === 0 || localCategories.length === categories.length;

  const handleApply = () => {
    onApply(localType, isAllSelected ? [] : localCategories);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <Text style={styles.title}>Filter</Text>
          <Text style={styles.subtitle}>Item yang ingin di filter</Text>

          {/* Type Toggle */}
          <View style={styles.typeRow}>
            {(['pemasukan', 'pengeluaran'] as TransactionType[]).map((t) => (
              <TouchableOpacity
                key={t}
                style={[styles.typeBtn, localType === t && styles.typeBtnActive]}
                onPress={() => { setLocalType(t); setLocalCategories([]); }}
              >
                <Text style={[styles.typeBtnText, localType === t && styles.typeBtnTextActive]}>
                  {t === 'pemasukan' ? 'Pemasukan' : 'Pengeluaran'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Category List */}
          <ScrollView style={styles.categoryList}>
            {/* Pilih Semua */}
            <TouchableOpacity style={styles.categoryItem} onPress={selectAll}>
              <View style={[styles.checkbox, isAllSelected && styles.checkboxChecked]}>
                {isAllSelected && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.categoryLabel}>
                {localType === 'pemasukan' ? 'Seluruh Pemasukan' : 'Seluruh Pengeluaran'}
              </Text>
            </TouchableOpacity>

            {categories.map((cat) => {
              const isChecked = localCategories.includes(cat.id);
              return (
                <TouchableOpacity
                  key={cat.id}
                  style={styles.categoryItem}
                  onPress={() => toggleCategory(cat.id)}
                >
                  <View style={[styles.checkbox, isChecked && styles.checkboxChecked]}>
                    {isChecked && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                  <Text style={styles.categoryLabel}>{cat.label}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Buttons */}
          <View style={styles.btnRow}>
            <TouchableOpacity style={styles.applyBtn} onPress={handleApply}>
              <Text style={styles.applyText}>Filter</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelText}>Batal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#00000060',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    maxHeight: '80%',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 14,
  },
  typeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  typeBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
  },
  typeBtnActive: {
    backgroundColor: '#2563EB',
  },
  typeBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  typeBtnTextActive: {
    color: '#fff',
  },
  categoryList: {
    maxHeight: 280,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  checkmark: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  categoryLabel: {
    fontSize: 14,
    color: '#1E293B',
  },
  btnRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  applyBtn: {
    flex: 1,
    backgroundColor: '#16A34A',
    paddingVertical: 13,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#DC2626',
    paddingVertical: 13,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
});