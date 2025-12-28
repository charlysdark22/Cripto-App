import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  ViewStyle,
} from 'react-native';
import { colors, SIZES } from '../constants';

interface TradeCardProps {
  symbol: string;
  type: 'buy' | 'sell';
  entryPrice: number;
  exitPrice?: number;
  profit?: number;
  profitPercentage?: number;
  status: 'open' | 'closed';
  confidence: number;
  timestamp: number;
  reason: string;
  style?: ViewStyle;
}

export function TradeCard({
  symbol,
  type,
  entryPrice,
  exitPrice,
  profit,
  profitPercentage,
  status,
  confidence,
  timestamp,
  reason,
  style,
}: TradeCardProps) {
  const isProfit = profit !== undefined && profit > 0;
  const isClosed = status === 'closed';

  const statusColor = isClosed
    ? isProfit
      ? colors.success
      : colors.error
    : colors.primary;

  const typeColor = type === 'buy' ? colors.success : colors.error;

  return (
    <View style={[styles.container, style]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={[styles.typeIndicator, { backgroundColor: typeColor }]} />
          <View>
            <Text style={styles.symbol}>{symbol}</Text>
            <Text style={styles.type}>{type.toUpperCase()}</Text>
          </View>
        </View>
        <View style={styles.statusBadge}>
          <Text style={[styles.statusText, { color: statusColor }]}>
            {status.toUpperCase()}
          </Text>
        </View>
      </View>

      {/* Prices */}
      <View style={styles.pricesContainer}>
        <View style={styles.priceItem}>
          <Text style={styles.priceLabel}>Entry</Text>
          <Text style={styles.priceValue}>${entryPrice.toFixed(4)}</Text>
        </View>
        {exitPrice !== undefined && (
          <View style={styles.priceItem}>
            <Text style={styles.priceLabel}>Exit</Text>
            <Text style={styles.priceValue}>${exitPrice.toFixed(4)}</Text>
          </View>
        )}
        {profit !== undefined && (
          <View style={styles.priceItem}>
            <Text style={styles.priceLabel}>Profit</Text>
            <Text style={[styles.priceValue, { color: isProfit ? colors.success : colors.error }]}>
              ${profit.toFixed(2)}
            </Text>
          </View>
        )}
      </View>

      {/* Details */}
      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Confidence</Text>
          <Text style={styles.detailValue}>{confidence}%</Text>
        </View>
        {profitPercentage !== undefined && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Return</Text>
            <Text style={[styles.detailValue, { color: isProfit ? colors.success : colors.error }]}>
              {profitPercentage > 0 ? '+' : ''}{profitPercentage.toFixed(2)}%
            </Text>
          </View>
        )}
      </View>

      {/* Reason */}
      <View style={styles.reasonContainer}>
        <Text style={styles.reasonLabel}>Reason</Text>
        <Text style={styles.reasonText} numberOfLines={2}>
          {reason}
        </Text>
      </View>

      {/* Timestamp */}
      <Text style={styles.timestamp}>
        {new Date(timestamp).toLocaleString()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: SIZES.radius,
    padding: SIZES.lg,
    marginBottom: SIZES.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.lg,
    paddingBottom: SIZES.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeIndicator: {
    width: 12,
    height: 12,
    borderRadius: SIZES.radiusRound,
    marginRight: SIZES.md,
  },
  symbol: {
    fontSize: SIZES.fontLG,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  type: {
    fontSize: SIZES.fontMD,
    color: colors.textSecondary,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    backgroundColor: colors.surfaceLight,
    borderRadius: SIZES.radius,
  },
  statusText: {
    fontSize: SIZES.fontSM,
    fontWeight: '600',
  },
  pricesContainer: {
    flexDirection: 'row',
    marginBottom: SIZES.lg,
    justifyContent: 'space-between',
  },
  priceItem: {
    flex: 1,
  },
  priceLabel: {
    fontSize: SIZES.fontMD,
    color: colors.textSecondary,
    marginBottom: SIZES.xs,
  },
  priceValue: {
    fontSize: SIZES.fontXL,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  details: {
    marginBottom: SIZES.lg,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SIZES.sm,
  },
  detailLabel: {
    fontSize: SIZES.fontMD,
    color: colors.textSecondary,
  },
  detailValue: {
    fontSize: SIZES.fontMD,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  reasonContainer: {
    marginBottom: SIZES.lg,
  },
  reasonLabel: {
    fontSize: SIZES.fontMD,
    color: colors.textSecondary,
    marginBottom: SIZES.sm,
  },
  reasonText: {
    fontSize: SIZES.fontMD,
    color: colors.textPrimary,
    lineHeight: 20,
  },
  timestamp: {
    fontSize: SIZES.fontSM,
    color: colors.textTertiary,
    marginTop: SIZES.md,
  },
});
