import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, SIZES, SPACING } from '../constants';
import { botAPIService } from '../services/api';
import { TradeCard } from '../components';
import { Trade } from '../types';

export function TradesScreen() {
  const insets = useSafeAreaInsets();
  const [trades, setTrades] = useState<Trade[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTrades();
  }, []);

  const loadTrades = async () => {
    try {
      setIsLoading(true);
      const data = await botAPIService.getTrades(100);
      setTrades(data);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar las operaciones');
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTrades();
    setRefreshing(false);
  };

  const handleCloseTrade = async (tradeId: string) => {
    Alert.alert(
      'Confirmar',
      '¿Está seguro de que desea cerrar esta operación?',
      [
        { text: 'Cancelar', onPress: () => {} },
        {
          text: 'Cerrar',
          onPress: async () => {
            try {
              await botAPIService.closeTrade(tradeId);
              await loadTrades();
              Alert.alert('Éxito', 'Operación cerrada');
            } catch (error) {
              Alert.alert('Error', 'No se pudo cerrar la operación');
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const stats = {
    totalTrades: trades.length,
    closedTrades: trades.filter((t: any) => t.status === 'closed').length,
    openTrades: trades.filter((t: any) => t.status === 'open').length,
    winTrades: trades.filter((t: any) => t.status === 'closed' && (t.profit || 0) > 0).length,
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Operaciones</Text>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Total</Text>
          <Text style={styles.statValue}>{stats.totalTrades}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Abiertas</Text>
          <Text style={[styles.statValue, { color: colors.primary }]}>
            {stats.openTrades}
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Cerradas</Text>
          <Text style={styles.statValue}>{stats.closedTrades}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Ganadoras</Text>
          <Text style={[styles.statValue, { color: colors.success }]}>
            {stats.winTrades}
          </Text>
        </View>
      </View>

      {/* Lista de operaciones */}
      <FlatList
        data={trades}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item }: { item: any }) => (
          <View style={styles.tradeContainer}>
            <TradeCard
              symbol={item.symbol}
              type={item.type}
              entryPrice={item.entryPrice}
              exitPrice={item.exitPrice}
              profit={item.profit}
              profitPercentage={item.profitPercentage}
              status={item.status}
              confidence={item.confidence}
              timestamp={item.entryTime}
              reason={item.reason}
            />
          </View>
        )}
        keyExtractor={(item: any) => item.id}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No hay operaciones aún</Text>
          </View>
        }
        scrollEnabled={false}
        style={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: SPACING.container,
    paddingVertical: SPACING.section,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: SIZES.fontXXL,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.container,
    paddingVertical: SPACING.section,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: SIZES.fontSM,
    color: colors.textSecondary,
    marginBottom: SIZES.xs,
  },
  statValue: {
    fontSize: SIZES.fontLG,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  list: {
    paddingHorizontal: SPACING.container,
    paddingTop: SPACING.section,
  },
  tradeContainer: {
    marginBottom: SIZES.lg,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: SIZES.fontMD,
    color: colors.textSecondary,
  },
});
