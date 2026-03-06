import { Ionicons } from "@expo/vector-icons";
import {
    addMonths,
    eachDayOfInterval,
    eachWeekOfInterval,
    endOfMonth,
    endOfWeek,
    format,
    getWeek,
    isSameDay,
    isSameMonth,
    startOfMonth,
    subMonths
} from "date-fns";
import { id } from "date-fns/locale";
import React, { useState } from "react";
import {
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { PeriodType } from "../utils/dateHelper";

interface Props {
  visible: boolean;
  period: PeriodType;
  currentDate: Date;
  onSelect: (date: Date) => void;
  onClose: () => void;
}

// ─── HARIAN ───────────────────────────────────────────────
const DailyPicker = ({
  currentDate,
  onSelect,
}: {
  currentDate: Date;
  onSelect: (d: Date) => void;
}) => {
  const [viewMonth, setViewMonth] = useState(new Date(currentDate));

  const start = startOfMonth(viewMonth);
  const end = endOfMonth(viewMonth);
  const days = eachDayOfInterval({ start, end });

  // padding awal minggu
  const firstDow = start.getDay(); // 0=minggu
  const paddingDays = Array(firstDow).fill(null);

  return (
    <View>
      {/* Month Nav */}
      <View style={styles.navRow}>
        <TouchableOpacity onPress={() => setViewMonth((d) => subMonths(d, 1))}>
          <Ionicons name="chevron-back" size={20} color="#1E3A5F" />
        </TouchableOpacity>
        <Text style={styles.navLabel}>
          {format(viewMonth, "MMMM yyyy", { locale: id })}
        </Text>
        <TouchableOpacity onPress={() => setViewMonth((d) => addMonths(d, 1))}>
          <Ionicons name="chevron-forward" size={20} color="#1E3A5F" />
        </TouchableOpacity>
      </View>

      {/* Day Labels */}
      <View style={styles.weekRow}>
        {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((d) => (
          <Text key={d} style={styles.weekLabel}>
            {d}
          </Text>
        ))}
      </View>

      {/* Days Grid */}
      <View style={styles.daysGrid}>
        {paddingDays.map((_, i) => (
          <View key={`pad-${i}`} style={styles.dayCell} />
        ))}
        {days.map((day) => {
          const isSelected = isSameDay(day, currentDate);
          const isToday = isSameDay(day, new Date());
          return (
            <TouchableOpacity
              key={day.toISOString()}
              style={[
                styles.dayCell,
                isSelected && styles.dayCellSelected,
                isToday && !isSelected && styles.dayCellToday,
              ]}
              onPress={() => onSelect(day)}
            >
              <Text
                style={[
                  styles.dayText,
                  isSelected && styles.dayTextSelected,
                  isToday && !isSelected && styles.dayTextToday,
                ]}
              >
                {format(day, "d")}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

// ─── MINGGUAN ─────────────────────────────────────────────
const WeeklyPicker = ({
  currentDate,
  onSelect,
}: {
  currentDate: Date;
  onSelect: (d: Date) => void;
}) => {
  const [viewMonth, setViewMonth] = useState(new Date(currentDate));

  const weeks = eachWeekOfInterval(
    { start: startOfMonth(viewMonth), end: endOfMonth(viewMonth) },
    { weekStartsOn: 1 },
  );

  const currentWeekNum = getWeek(currentDate, { weekStartsOn: 1 });

  return (
    <View>
      <View style={styles.navRow}>
        <TouchableOpacity onPress={() => setViewMonth((d) => subMonths(d, 1))}>
          <Ionicons name="chevron-back" size={20} color="#1E3A5F" />
        </TouchableOpacity>
        <Text style={styles.navLabel}>
          {format(viewMonth, "MMMM yyyy", { locale: id })}
        </Text>
        <TouchableOpacity onPress={() => setViewMonth((d) => addMonths(d, 1))}>
          <Ionicons name="chevron-forward" size={20} color="#1E3A5F" />
        </TouchableOpacity>
      </View>

      <View style={styles.weekList}>
        {weeks.map((weekStart, i) => {
          const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
          const weekNum = getWeek(weekStart, { weekStartsOn: 1 });
          const isSelected =
            weekNum === currentWeekNum && isSameMonth(weekStart, currentDate);

          return (
            <TouchableOpacity
              key={weekStart.toISOString()}
              style={[styles.weekItem, isSelected && styles.weekItemSelected]}
              onPress={() => onSelect(weekStart)}
            >
              <Text
                style={[
                  styles.weekItemText,
                  isSelected && styles.weekItemTextSelected,
                ]}
              >
                Minggu ke-{i + 1}
              </Text>
              <Text
                style={[
                  styles.weekItemSub,
                  isSelected && styles.weekItemTextSelected,
                ]}
              >
                {format(weekStart, "dd MMM", { locale: id })} -{" "}
                {format(weekEnd, "dd MMM yyyy", { locale: id })}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

// ─── BULANAN ──────────────────────────────────────────────
const MonthlyPicker = ({
  currentDate,
  onSelect,
}: {
  currentDate: Date;
  onSelect: (d: Date) => void;
}) => {
  const [viewYear, setViewYear] = useState(currentDate.getFullYear());

  const months = Array.from({ length: 12 }, (_, i) => new Date(viewYear, i, 1));

  return (
    <View>
      <View style={styles.navRow}>
        <TouchableOpacity onPress={() => setViewYear((y) => y - 1)}>
          <Ionicons name="chevron-back" size={20} color="#1E3A5F" />
        </TouchableOpacity>
        <Text style={styles.navLabel}>{viewYear}</Text>
        <TouchableOpacity onPress={() => setViewYear((y) => y + 1)}>
          <Ionicons name="chevron-forward" size={20} color="#1E3A5F" />
        </TouchableOpacity>
      </View>

      <View style={styles.monthGrid}>
        {months.map((month) => {
          const isSelected =
            month.getMonth() === currentDate.getMonth() &&
            month.getFullYear() === currentDate.getFullYear();

          return (
            <TouchableOpacity
              key={month.toISOString()}
              style={[styles.monthCell, isSelected && styles.monthCellSelected]}
              onPress={() => onSelect(month)}
            >
              <Text
                style={[
                  styles.monthText,
                  isSelected && styles.monthTextSelected,
                ]}
              >
                {format(month, "MMM", { locale: id })}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

// ─── TAHUNAN ──────────────────────────────────────────────
const YearlyPicker = ({
  currentDate,
  onSelect,
}: {
  currentDate: Date;
  onSelect: (d: Date) => void;
}) => {
  const currentYear = currentDate.getFullYear();
  const [baseYear, setBaseYear] = useState(currentYear - (currentYear % 12));

  const years = Array.from({ length: 12 }, (_, i) => baseYear + i);

  return (
    <View>
      <View style={styles.navRow}>
        <TouchableOpacity onPress={() => setBaseYear((y) => y - 12)}>
          <Ionicons name="chevron-back" size={20} color="#1E3A5F" />
        </TouchableOpacity>
        <Text style={styles.navLabel}>
          {baseYear} - {baseYear + 11}
        </Text>
        <TouchableOpacity onPress={() => setBaseYear((y) => y + 12)}>
          <Ionicons name="chevron-forward" size={20} color="#1E3A5F" />
        </TouchableOpacity>
      </View>

      <View style={styles.monthGrid}>
        {years.map((year) => {
          const isSelected = year === currentDate.getFullYear();
          return (
            <TouchableOpacity
              key={year}
              style={[styles.monthCell, isSelected && styles.monthCellSelected]}
              onPress={() =>
                onSelect(new Date(year, currentDate.getMonth(), 1))
              }
            >
              <Text
                style={[
                  styles.monthText,
                  isSelected && styles.monthTextSelected,
                ]}
              >
                {year}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

// ─── MAIN MODAL ───────────────────────────────────────────
export const PeriodPickerModal: React.FC<Props> = ({
  visible,
  period,
  currentDate,
  onSelect,
  onClose,
}) => {
  const handleSelect = (date: Date) => {
    onSelect(date);
    onClose();
  };

  const title = {
    harian: "Pilih Tanggal",
    mingguan: "Pilih Minggu",
    bulanan: "Pilih Bulan",
    tahunan: "Pilih Tahun",
  }[period];

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={22} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView>
            {period === "harian" && (
              <DailyPicker currentDate={currentDate} onSelect={handleSelect} />
            )}
            {period === "mingguan" && (
              <WeeklyPicker currentDate={currentDate} onSelect={handleSelect} />
            )}
            {period === "bulanan" && (
              <MonthlyPicker
                currentDate={currentDate}
                onSelect={handleSelect}
              />
            )}
            {period === "tahunan" && (
              <YearlyPicker currentDate={currentDate} onSelect={handleSelect} />
            )}
          </ScrollView>

          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnText}>Batal</Text>
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
    maxHeight: "80%",
  },
  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E293B",
  },
  navRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  navLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1E293B",
  },
  // Daily
  weekRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  weekLabel: {
    flex: 1,
    textAlign: "center",
    fontSize: 12,
    color: "#94A3B8",
    fontWeight: "600",
  },
  daysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dayCell: {
    width: "14.28%",
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
  },
  dayCellSelected: {
    backgroundColor: "#2563EB",
  },
  dayCellToday: {
    backgroundColor: "#EFF6FF",
  },
  dayText: {
    fontSize: 13,
    color: "#1E293B",
  },
  dayTextSelected: {
    color: "#fff",
    fontWeight: "700",
  },
  dayTextToday: {
    color: "#2563EB",
    fontWeight: "700",
  },
  // Weekly
  weekList: {
    gap: 8,
  },
  weekItem: {
    padding: 14,
    borderRadius: 10,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  weekItemSelected: {
    backgroundColor: "#2563EB",
    borderColor: "#2563EB",
  },
  weekItemText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 2,
  },
  weekItemSub: {
    fontSize: 12,
    color: "#64748B",
  },
  weekItemTextSelected: {
    color: "#fff",
  },
  // Monthly
  monthGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  monthCell: {
    width: "22%",
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  monthCellSelected: {
    backgroundColor: "#2563EB",
    borderColor: "#2563EB",
  },
  monthText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1E293B",
  },
  monthTextSelected: {
    color: "#fff",
  },
  closeBtn: {
    marginTop: 16,
    backgroundColor: "#F1F5F9",
    paddingVertical: 13,
    borderRadius: 8,
    alignItems: "center",
  },
  closeBtnText: {
    fontSize: 14,
    color: "#64748B",
    fontWeight: "600",
  },
});
