import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable } from 'react-native';
import Svg, {
  Path,
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop,
  Circle,
  Line,
  Text as SvgText,
} from 'react-native-svg';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, borderRadius } from '../theme/spacing';
import { useTranslation } from '../i18n';
import type { AnxietyTrendPoint, AnxietyTrendSummary } from '../services/api';
import type { TimeRange } from '../hooks/useAnxietyTrend';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CHART_PADDING_LEFT = 36;
const CHART_PADDING_RIGHT = 16;
const CHART_HEIGHT = 180;
const DOT_RADIUS = 5;
const HIT_SLOP = 18;

interface AnxietyChartProps {
  points: AnxietyTrendPoint[];
  summary: AnxietyTrendSummary | null;
  range: TimeRange;
  onRangeChange: (range: TimeRange) => void;
}

function formatDateLabel(dateStr: string, compact: boolean): string {
  const d = new Date(dateStr + 'T00:00:00');
  if (compact) {
    return `${d.getDate()}/${d.getMonth() + 1}`;
  }
  return `${d.getDate()}/${d.getMonth() + 1}`;
}

function buildSmoothPath(coords: { x: number; y: number }[]): string {
  if (coords.length === 0) return '';
  if (coords.length === 1) return `M${coords[0].x},${coords[0].y}`;

  let d = `M${coords[0].x},${coords[0].y}`;
  for (let i = 0; i < coords.length - 1; i++) {
    const curr = coords[i];
    const next = coords[i + 1];
    const cpx = (curr.x + next.x) / 2;
    d += ` C${cpx},${curr.y} ${cpx},${next.y} ${next.x},${next.y}`;
  }
  return d;
}

export default function AnxietyChart({
  points,
  summary,
  range,
  onRangeChange,
}: AnxietyChartProps) {
  const { t, isRTL } = useTranslation();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const containerWidth = SCREEN_WIDTH - spacing.lg * 2;
  const chartWidth = containerWidth - CHART_PADDING_LEFT - CHART_PADDING_RIGHT;

  const maxAnxiety = useMemo(() => {
    if (points.length === 0) return 1;
    return Math.max(0.5, ...points.map((p) => p.anxiety));
  }, [points]);

  const coords = useMemo(() => {
    if (points.length === 0) return [];
    if (points.length === 1) {
      return [
        {
          x: CHART_PADDING_LEFT + chartWidth / 2,
          y: CHART_HEIGHT - (points[0].anxiety / maxAnxiety) * (CHART_HEIGHT - 24) - 12,
        },
      ];
    }
    return points.map((p, i) => ({
      x: CHART_PADDING_LEFT + (i / (points.length - 1)) * chartWidth,
      y: CHART_HEIGHT - (p.anxiety / maxAnxiety) * (CHART_HEIGHT - 24) - 12,
    }));
  }, [points, chartWidth, maxAnxiety]);

  const linePath = useMemo(() => buildSmoothPath(coords), [coords]);

  const areaPath = useMemo(() => {
    if (coords.length === 0) return '';
    const bottomY = CHART_HEIGHT;
    const fill = `${linePath} L${coords[coords.length - 1].x},${bottomY} L${coords[0].x},${bottomY} Z`;
    return fill;
  }, [linePath, coords]);

  const yLabels = useMemo(() => {
    const steps = [0, 0.25, 0.5, 0.75, 1.0];
    return steps
      .filter((s) => s <= maxAnxiety + 0.1)
      .map((s) => ({
        value: s,
        y: CHART_HEIGHT - (s / maxAnxiety) * (CHART_HEIGHT - 24) - 12,
        label: s.toFixed(1),
      }));
  }, [maxAnxiety]);

  const xLabels = useMemo(() => {
    if (points.length <= 1) {
      return points.map((p, i) => ({
        label: formatDateLabel(p.date, true),
        x: coords[i]?.x ?? CHART_PADDING_LEFT,
      }));
    }
    const step = Math.max(1, Math.floor(points.length / 5));
    const labels: { label: string; x: number }[] = [];
    for (let i = 0; i < points.length; i += step) {
      labels.push({
        label: formatDateLabel(points[i].date, true),
        x: coords[i].x,
      });
    }
    if (labels.length > 0) {
      const lastIdx = points.length - 1;
      const lastLabelX = labels[labels.length - 1].x;
      if (Math.abs(coords[lastIdx].x - lastLabelX) > 30) {
        labels.push({
          label: formatDateLabel(points[lastIdx].date, true),
          x: coords[lastIdx].x,
        });
      }
    }
    return labels;
  }, [points, coords]);

  const trendIcon =
    summary?.trendDirection === 'improving'
      ? '↓'
      : summary?.trendDirection === 'increasing'
        ? '↑'
        : '→';
  const trendColor =
    summary?.trendDirection === 'improving'
      ? '#43E97B'
      : summary?.trendDirection === 'increasing'
        ? '#FD746C'
        : colors.text.tertiary;

  const RANGES: TimeRange[] = [7, 14, 30];
  const rangeLabels: Record<TimeRange, string> = {
    7: t('dashboard.chart.week'),
    14: t('dashboard.chart.twoWeeks'),
    30: t('dashboard.chart.month'),
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>{t('dashboard.chart.title')}</Text>
          <Text style={styles.subtitle}>{t('dashboard.chart.subtitle')}</Text>
        </View>
        {summary && (
          <View style={[styles.trendBadge, { backgroundColor: trendColor + '18' }]}>
            <Text style={[styles.trendText, { color: trendColor }]}>
              {trendIcon} {summary.trendPercent}%
            </Text>
          </View>
        )}
      </View>

      <View style={styles.rangeRow}>
        {RANGES.map((r) => (
          <Pressable
            key={r}
            onPress={() => onRangeChange(r)}
            style={[styles.rangeChip, range === r && styles.rangeChipActive]}
          >
            <Text
              style={[
                styles.rangeChipText,
                range === r && styles.rangeChipTextActive,
              ]}
            >
              {rangeLabels[r]}
            </Text>
          </Pressable>
        ))}
      </View>

      {points.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>{t('dashboard.chart.noData')}</Text>
        </View>
      ) : (
        <View>
          <Svg
            width={containerWidth}
            height={CHART_HEIGHT + 28}
            style={isRTL ? { transform: [{ scaleX: -1 }] } : undefined}
          >
            <Defs>
              <SvgLinearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0%" stopColor="#667EEA" stopOpacity={0.35} />
                <Stop offset="100%" stopColor="#667EEA" stopOpacity={0.02} />
              </SvgLinearGradient>
            </Defs>

            {yLabels.map((yl) => (
              <Line
                key={yl.value}
                x1={CHART_PADDING_LEFT}
                y1={yl.y}
                x2={CHART_PADDING_LEFT + chartWidth}
                y2={yl.y}
                stroke={colors.borderLight}
                strokeWidth={1}
                strokeDasharray="4 4"
              />
            ))}

            {yLabels.map((yl) => (
              <SvgText
                key={`lbl-${yl.value}`}
                x={isRTL ? containerWidth - 4 : 4}
                y={yl.y + 4}
                fontSize={10}
                fill={colors.text.tertiary}
                textAnchor={isRTL ? 'end' : 'start'}
                transform={isRTL ? `scale(-1,1) translate(${-containerWidth}, 0)` : undefined}
              >
                {yl.label}
              </SvgText>
            ))}

            {areaPath ? <Path d={areaPath} fill="url(#areaGradient)" /> : null}

            {linePath ? (
              <Path
                d={linePath}
                fill="none"
                stroke="#667EEA"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ) : null}

            {coords.map((c, i) => (
              <Circle
                key={i}
                cx={c.x}
                cy={c.y}
                r={selectedIndex === i ? DOT_RADIUS + 2 : DOT_RADIUS}
                fill={selectedIndex === i ? '#667EEA' : '#fff'}
                stroke="#667EEA"
                strokeWidth={2}
              />
            ))}

            {xLabels.map((xl, i) => (
              <SvgText
                key={`x-${i}`}
                x={xl.x}
                y={CHART_HEIGHT + 18}
                fontSize={10}
                fill={colors.text.tertiary}
                textAnchor="middle"
                transform={isRTL ? `scale(-1,1) translate(${-xl.x * 2}, 0)` : undefined}
              >
                {xl.label}
              </SvgText>
            ))}
          </Svg>

          {/* Hit areas for data points */}
          <View style={[StyleSheet.absoluteFill, styles.hitLayer]} pointerEvents="box-none">
            {coords.map((c, i) => (
              <Pressable
                key={i}
                onPress={() => setSelectedIndex(selectedIndex === i ? null : i)}
                style={[
                  styles.hitArea,
                  {
                    left: (isRTL ? containerWidth - c.x : c.x) - HIT_SLOP,
                    top: c.y - HIT_SLOP,
                    width: HIT_SLOP * 2,
                    height: HIT_SLOP * 2,
                  },
                ]}
              />
            ))}
          </View>

          {selectedIndex !== null && points[selectedIndex] && (
            <View
              style={[
                styles.tooltip,
                {
                  left: Math.max(
                    8,
                    Math.min(
                      (isRTL ? containerWidth - coords[selectedIndex].x : coords[selectedIndex].x) - 55,
                      containerWidth - 118,
                    ),
                  ),
                  top: coords[selectedIndex].y - 50,
                },
              ]}
            >
              <Text style={styles.tooltipDate}>
                {formatDateLabel(points[selectedIndex].date, false)}
              </Text>
              <Text style={styles.tooltipValue}>
                {t('dashboard.chart.anxiety')}: {(points[selectedIndex].anxiety * 100).toFixed(0)}%
              </Text>
              <Text style={styles.tooltipMood}>
                {t('dashboard.chart.mood')}: {points[selectedIndex].mood}/5
              </Text>
            </View>
          )}
        </View>
      )}

      {summary && !points.length ? null : summary ? (
        <View style={styles.insightRow}>
          <Text style={styles.insightLabel}>{t('dashboard.chart.avg')}</Text>
          <Text style={styles.insightValue}>
            {(summary.averageAnxiety * 100).toFixed(0)}%
          </Text>
          <View style={styles.insightDivider} />
          <Text style={styles.insightLabel}>{t('dashboard.chart.entries')}</Text>
          <Text style={styles.insightValue}>{summary.totalEntries}</Text>
          <View style={styles.insightDivider} />
          <Text style={styles.insightLabel}>{t('dashboard.chart.days')}</Text>
          <Text style={styles.insightValue}>{summary.totalDays}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.base,
    marginBottom: spacing.base,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.h4,
    color: colors.text.primary,
  },
  subtitle: {
    ...typography.caption,
    color: colors.text.tertiary,
    marginTop: 2,
  },
  trendBadge: {
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  trendText: {
    ...typography.captionMedium,
  },
  rangeRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.base,
  },
  rangeChip: {
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: colors.borderLight,
  },
  rangeChipActive: {
    backgroundColor: colors.primary,
  },
  rangeChipText: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  rangeChipTextActive: {
    color: '#fff',
  },
  emptyContainer: {
    height: CHART_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    ...typography.body,
    color: colors.text.tertiary,
    textAlign: 'center',
  },
  hitLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  hitArea: {
    position: 'absolute',
  },
  tooltip: {
    position: 'absolute',
    backgroundColor: colors.text.primary,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minWidth: 110,
  },
  tooltipDate: {
    ...typography.captionMedium,
    color: '#fff',
    marginBottom: 2,
  },
  tooltipValue: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.85)',
  },
  tooltipMood: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.7)',
  },
  insightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.base,
    gap: spacing.sm,
  },
  insightLabel: {
    ...typography.caption,
    color: colors.text.tertiary,
  },
  insightValue: {
    ...typography.captionMedium,
    color: colors.text.primary,
  },
  insightDivider: {
    width: 1,
    height: 14,
    backgroundColor: colors.borderLight,
    marginHorizontal: spacing.xs,
  },
});
