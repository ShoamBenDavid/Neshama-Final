import React from 'react';
import { View, StyleSheet } from 'react-native';
import Text from './Text';
import colors from '../config/colors';

interface MoodDataPoint {
  day: string;
  value: number; // 1-10 scale
}

interface MoodChartProps {
  data?: MoodDataPoint[];
}

const defaultData: MoodDataPoint[] = [
  { day: 'א', value: 6 },
  { day: 'ב', value: 4 },
  { day: 'ג', value: 7 },
  { day: 'ד', value: 5 },
  { day: 'ה', value: 8 },
  { day: 'ו', value: 9 },
  { day: 'ש', value: 7 },
  { day: 'א', value: 5 },
  { day: 'ב', value: 6 },
  { day: 'ג', value: 4 },
  { day: 'ד', value: 7 },
  { day: 'ה', value: 8 },
  { day: 'ו', value: 6 },
  { day: 'ש', value: 7 },
];

const getBarColor = (value: number): string => {
  if (value >= 7) return colors.green;
  if (value >= 5) return colors.warning;
  return colors.pink;
};

const getMoodEmoji = (value: number): string => {
  if (value >= 8) return '😊';
  if (value >= 6) return '🙂';
  if (value >= 4) return '😐';
  return '😔';
};

export default function MoodChart({ data = defaultData }: MoodChartProps) {
  const maxValue = 10;
  const chartHeight = 140;

  // Calculate average
  const average = data.reduce((sum, d) => sum + d.value, 0) / data.length;
  const averagePosition = (average / maxValue) * chartHeight;

  return (
    <View style={styles.container}>
      {/* Y-axis labels */}
      <View style={styles.yAxis}>
        <Text style={styles.yLabel}>10</Text>
        <Text style={styles.yLabel}>5</Text>
        <Text style={styles.yLabel}>0</Text>
      </View>

      {/* Chart area */}
      <View style={styles.chartArea}>
        {/* Grid lines */}
        <View style={[styles.gridLine, { top: 0 }]} />
        <View style={[styles.gridLine, { top: chartHeight / 2 }]} />
        <View style={[styles.gridLine, { top: chartHeight }]} />

        {/* Average line */}
        <View
          style={[
            styles.averageLine,
            { bottom: averagePosition },
          ]}
        >
          <View style={styles.averageLineInner} />
          <View style={styles.averageLabel}>
            <Text style={styles.averageLabelText}>ממוצע {average.toFixed(1)}</Text>
          </View>
        </View>

        {/* Bars */}
        <View style={styles.barsContainer}>
          {data.map((point, index) => {
            const barHeight = (point.value / maxValue) * chartHeight;
            const barColor = getBarColor(point.value);

            return (
              <View key={index} style={styles.barWrapper}>
                <View style={styles.barContainer}>
                  <View
                    style={[
                      styles.bar,
                      {
                        height: barHeight,
                        backgroundColor: barColor,
                      },
                    ]}
                  >
                    {/* Dot at top of bar */}
                    <View style={[styles.barDot, { backgroundColor: barColor }]} />
                  </View>
                </View>
              </View>
            );
          })}
        </View>
       
      </View>

      {/* X-axis labels */}
      <View style={styles.xAxis}>
        {data.map((point, index) => (
          <View key={index} style={styles.xLabelContainer}>
            <Text style={styles.xLabel}>{point.day}</Text>
          </View>
        ))}
      </View>

      {/* Summary row */}
      <View style={styles.summaryRow}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryEmoji}>{getMoodEmoji(Math.max(...data.map(d => d.value)))}</Text>
          <Text style={styles.summaryText}>יום הכי טוב: {Math.max(...data.map(d => d.value))}</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryEmoji}>{getMoodEmoji(average)}</Text>
          <Text style={styles.summaryText}>ממוצע: {average.toFixed(1)}</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryEmoji}>📈</Text>
          <Text style={styles.summaryText}>מגמה: חיובית</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 8,
  },
  yAxis: {
    position: 'absolute',
    left: 0,
    top: 8,
    height: 140,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingRight: 8,
    zIndex: 10,
  },
  yLabel: {
    fontSize: 10,
    color: colors.text.light,
  },
  chartArea: {
    height: 140,
    marginLeft: 24,
    marginRight: 8,
    position: 'relative',
  },
  gridLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: colors.gray[200],
  },
  averageLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 5,
  },
  averageLineInner: {
    flex: 1,
    height: 2,
    backgroundColor: colors.primary,
    opacity: 0.6,
    borderStyle: 'dashed',
  },
  averageLabel: {
    backgroundColor: colors.lightPurple,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 4,
  },
  averageLabelText: {
    fontSize: 9,
    color: colors.primary,
    fontWeight: '600',
  },
  barsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: '100%',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  barWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: '100%',
  },
  barContainer: {
    width: '60%',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  bar: {
    width: '100%',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    alignItems: 'center',
    minHeight: 4,
  },
  barDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    position: 'absolute',
    top: -4,
    borderWidth: 2,
    borderColor: colors.white,
  },
  trendLineContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  trendLine: {
    position: 'absolute',
    height: 2,
    backgroundColor: colors.primary,
    opacity: 0.3,
    transformOrigin: 'left center',
  },
  xAxis: {
    flexDirection: 'row',
    marginLeft: 24,
    marginRight: 8,
    marginTop: 8,
  },
  xLabelContainer: {
    flex: 1,
    alignItems: 'center',
  },
  xLabel: {
    fontSize: 10,
    color: colors.text.light,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  summaryEmoji: {
    fontSize: 14,
  },
  summaryText: {
    fontSize: 11,
    color: colors.text.secondary,
  },
});

