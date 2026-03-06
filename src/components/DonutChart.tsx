import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { PieChart } from "react-native-chart-kit";
import { formatRupiah } from "../utils/currency";

interface ChartData {
  label: string;
  amount: number;
  color: string;
}

interface Props {
  data: ChartData[];
  total: number;
  centerLabel?: string;
}

const screenWidth = Dimensions.get("window").width;

export const DonutChart: React.FC<Props> = ({ data, total, centerLabel }) => {
  const chartData = data.map((d) => ({
    name: d.label,
    amount: d.amount || 1,
    color: d.color,
    legendFontColor: "#1E293B",
    legendFontSize: 13,
  }));

  return (
    <View style={styles.container}>
      <PieChart
        data={chartData}
        width={screenWidth - 32}
        height={200}
        chartConfig={{
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        }}
        accessor="amount"
        backgroundColor="transparent"
        paddingLeft="15"
        hasLegend={false}
        center={[screenWidth / 4 - 16, 0]}
      />

      {/* Legend */}
      <View style={styles.legend}>
        {data.map((d) => {
          const pct = total > 0 ? Math.round((d.amount / total) * 100) : 0;
          return (
            <View key={d.label} style={styles.legendItem}>
              <View style={styles.legendLeft}>
                <View style={[styles.dot, { backgroundColor: d.color }]} />
                <Text style={styles.legendLabel}>
                  ({pct}%) {d.label}
                </Text>
              </View>
              <Text style={[styles.legendAmount, { color: d.color }]}>
                {formatRupiah(d.amount)}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: 16,
  },
  legend: {
    width: "100%",
    paddingHorizontal: 16,
    gap: 8,
    marginTop: 8,
  },
  legendItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  legendLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendLabel: {
    fontSize: 13,
    color: "#1E293B",
  },
  legendAmount: {
    fontSize: 13,
    fontWeight: "700",
  },
});
