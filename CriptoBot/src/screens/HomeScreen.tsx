import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, SIZES, SPACING } from '../constants';
import { useBotStore } from '../context/botStore';
import { botAPIService } from '../services/api';
import { Button, StatCard } from '../components';
import moment from 'moment';

export const HomeScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const { botStatus, setBotStatus } = useBotStore();

  useEffect(() => {
    loadBotStatus();
  }, []);

  const loadBotStatus = async () => {
    try {
      setIsLoading(true);
      const status = await botAPIService.getBotStatus();
      setBotStatus(status);
    } catch (error) {
      Alert.alert('Error', 'No se pudo conectar con el servidor');
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadBotStatus();
    setRefreshing(false);
  };

  const handleStartBot = async () => {
    try {
      await botAPIService.startBot();
      await loadBotStatus();
      Alert.alert('Éxito', 'Bot iniciado correctamente');
    } catch (error) {
      Alert.alert('Error', 'No se pudo iniciar el bot');
    }
  };

  const handleStopBot = async () => {
    Alert.alert(
      'Confirmar',
      '¿Está seguro de que desea detener el bot?',
      [
        { text: 'Cancelar', onPress: () => {} },
        {
          text: 'Detener',
          onPress: async () => {
            try {
              await botAPIService.stopBot();
              await loadBotStatus();
              Alert.alert('Éxito', 'Bot detenido');
            } catch (error) {
              Alert.alert('Error', 'No se pudo detener el bot');
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

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top }]}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>CriptoBot Trading AI</Text>
        <View style={[styles.statusIndicator, { 
          backgroundColor: botStatus?.isActive ? colors.success : colors.error 
        }]} />
      </View>

      {/* Estado Principal */}
      {botStatus && (
        <>
          <View style={styles.mainStatusCard}>
            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>Estado</Text>
              <Text style={[styles.statusValue, {
                color: botStatus.isActive ? colors.success : colors.error
              }]}>
                {botStatus.isActive ? 'EN EJECUCIÓN' : 'DETENIDO'}
              </Text>
            </View>

            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>Uptime</Text>
              <Text style={styles.statusValue}>
                {Math.floor(botStatus.uptime / 1000 / 60)} min
              </Text>
            </View>
          </View>

          {/* Controles */}
          <View style={styles.buttonContainer}>
            {!botStatus.isActive ? (
              <Button
                title="Iniciar Bot"
                onPress={handleStartBot}
                variant="success"
              />
            ) : (
              <Button
                title="Detener Bot"
                onPress={handleStopBot}
                variant="danger"
              />
            )}
          </View>

          {/* Cards de Estadísticas */}
          <View style={styles.statsContainer}>
            <StatCard
              label="Balance Total"
              value={botStatus.balance?.toFixed(2) || '0.00'}
              unit="USD"
              variant="default"
            />
            <StatCard
              label="Ganancias/Pérdidas"
              value={botStatus.profitLoss?.toFixed(2) || '0.00'}
              unit="USD"
              variant={botStatus.profitLoss > 0 ? 'positive' : 'negative'}
            />
            <StatCard
              label="% ROI"
              value={botStatus.profitLossPercentage?.toFixed(2) || '0.00'}
              unit="%"
              variant={botStatus.profitLossPercentage > 0 ? 'positive' : 'negative'}
            />
            <StatCard
              label="Total Operaciones"
              value={botStatus.totalTrades}
              variant="default"
            />
            <StatCard
              label="Tasa de Ganancia"
              value={botStatus.winRate?.toFixed(1) || '0.0'}
              unit="%"
              variant="default"
            />
            <StatCard
              label="Máxima Caída"
              value={Math.abs(botStatus.drawdown)?.toFixed(2) || '0.00'}
              unit="%"
              variant="warning"
            />
          </View>

          {/* Última Operación */}
          {botStatus.lastTrade && (
            <View style={styles.lastTradeSection}>
              <Text style={styles.sectionTitle}>Última Operación</Text>
              <View style={styles.tradeInfo}>
                <View style={styles.tradeRow}>
                  <Text style={styles.tradeLabel}>Símbolo</Text>
                  <Text style={styles.tradeValue}>{botStatus.lastTrade.symbol}</Text>
                </View>
                <View style={styles.tradeRow}>
                  <Text style={styles.tradeLabel}>Tipo</Text>
                  <Text style={[styles.tradeValue, {
                    color: botStatus.lastTrade.type === 'buy' ? colors.success : colors.error
                  }]}>
                    {botStatus.lastTrade.type.toUpperCase()}
                  </Text>
                </View>
                <View style={styles.tradeRow}>
                  <Text style={styles.tradeLabel}>Precio</Text>
                  <Text style={styles.tradeValue}>
                    ${botStatus.lastTrade.entryPrice.toFixed(2)}
                  </Text>
                </View>
                <View style={styles.tradeRow}>
                  <Text style={styles.tradeLabel}>Confianza</Text>
                  <Text style={styles.tradeValue}>
                    {botStatus.lastTrade.confidence}%
                  </Text>
                </View>
              </View>
            </View>
          )}
        </>
      )}

      {/* Padding */}
      <View style={{ height: SPACING.section }} />
    </ScrollView>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: SIZES.fontXXL,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: SIZES.radiusRound,
  },
  mainStatusCard: {
    marginHorizontal: SPACING.container,
    marginTop: SPACING.section,
    backgroundColor: colors.surface,
    borderRadius: SIZES.radius,
    padding: SIZES.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SIZES.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  statusLabel: {
    fontSize: SIZES.fontMD,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  statusValue: {
    fontSize: SIZES.fontLG,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  buttonContainer: {
    marginHorizontal: SPACING.container,
    marginTop: SPACING.section,
  },
  statsContainer: {
    marginHorizontal: SPACING.container,
    marginTop: SPACING.section,
    marginBottom: SPACING.section,
  },
  lastTradeSection: {
    marginHorizontal: SPACING.container,
    marginBottom: SPACING.section,
  },
  sectionTitle: {
    fontSize: SIZES.fontLG,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: SIZES.lg,
  },
  tradeInfo: {
    backgroundColor: colors.surface,
    borderRadius: SIZES.radius,
    padding: SIZES.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tradeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SIZES.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tradeLabel: {
    fontSize: SIZES.fontMD,
    color: colors.textSecondary,
  },
  tradeValue: {
    fontSize: SIZES.fontMD,
    fontWeight: '600',
    color: colors.textPrimary,
  },
});
