import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { FadeInDown, useReducedMotion } from 'react-native-reanimated';
import { TextField } from '../TextField';
import { useTheme } from '@/src/hooks/useTheme';

const AnimatedView = Animated.createAnimatedComponent(View);

export interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number | null;
  unit?: string;
  trend?: 'up' | 'down' | 'neutral' | null;
  color?: string;
  onConfigure?: () => void;
  ctaLabel?: string;
  index?: number;
}

const MetricCard = ({
  icon,
  label,
  value,
  unit,
  trend,
  color,
  onConfigure,
  ctaLabel = 'Configurar',
  index = 0,
}: MetricCardProps) => {
  'use memo';
  const t = useTheme();
  const isReducedMotion = useReducedMotion();

  const tintColor = color ?? t.secondary500;
  const iconBoxBg = `${tintColor}1A`;

  const cardContent = (
    <View
      testID="metric-card"
      style={[s.card, { backgroundColor: t.surface, shadowColor: '#000' }]}
    >
      {icon !== null && icon !== undefined && (
        <View style={[s.iconBox, { backgroundColor: iconBoxBg }]}>{icon}</View>
      )}
      <TextField
        variant="caption"
        style={[s.label, { color: t.textSecondary }]}
      >
        {label}
      </TextField>

      {value !== null && value !== undefined ? (
        <View style={s.valueRow}>
          <TextField variant="body" style={[s.value, { color: t.textPrimary }]}>
            {String(value)}
            {unit ? (
              <TextField
                variant="caption"
                style={{ color: t.textSecondary, fontSize: t.fontSizeCaption }}
              >
                {unit}
              </TextField>
            ) : null}
          </TextField>
        </View>
      ) : (
        <View style={s.emptyState}>
          <TextField
            variant="caption"
            style={[s.emptyText, { color: t.textSecondary }]}
          >
            Sin datos aún
          </TextField>
          {onConfigure && (
            <Pressable
              onPress={onConfigure}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <TextField
                variant="caption"
                style={[s.ctaText, { color: t.primary600 }]}
              >
                {ctaLabel}
              </TextField>
            </Pressable>
          )}
        </View>
      )}

      {trend && trend !== 'neutral' && (
        <View testID={`metric-card-trend-${trend}`} style={s.trendChip}>
          <TextField
            variant="caption"
            style={[
              s.trendText,
              {
                color: trend === 'up' ? t.success : t.error,
              },
            ]}
          >
            {trend === 'up' ? '↑' : '↓'}
          </TextField>
        </View>
      )}
    </View>
  );

  if (isReducedMotion) {
    return cardContent;
  }

  return (
    <AnimatedView
      entering={FadeInDown.delay(index * 80)
        .springify()
        .damping(14)}
    >
      {cardContent}
    </AnimatedView>
  );
};

const s = StyleSheet.create({
  card: {
    width: 120,
    minHeight: 96,
    borderRadius: 16,
    padding: 12,
    marginRight: 10,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  value: {
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 26,
  },
  emptyState: {
    marginTop: 4,
  },
  emptyText: {
    fontSize: 11,
    marginBottom: 4,
  },
  ctaText: {
    fontSize: 11,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  trendChip: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  trendText: {
    fontSize: 11,
    fontWeight: '700',
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 2,
    marginBottom: 4,
  },
});

export default MetricCard;
