import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, SIZES, SPACING } from '../constants';
import { botAPIService } from '../services/api';
import { PerformanceMetrics } from '../types';

export const AnalyticsScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    try {
      setIsLoading(true);
      const data = await botAPIService.getPerformanceMetrics();
      setMetrics(data);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar las métricas');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Análisis & Métricas</Text>
      </View>

      {metrics && (
        <>
          {/* Resumen General */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Resumen General</Text>
            <View style={styles.metricsGrid}>
              <MetricCard
                label="Total Operaciones"
                value={metrics.totalTrades.toString()}
              />
              <MetricCard
                label="Operaciones Ganadoras"
                value={metrics.winTrades.toString()}
              />
              <MetricCard
                label="Operaciones Perdedoras"
                value={metrics.lossTrades.toString()}
              />
              <MetricCard
                label="Tasa de Ganancia"
                value={`${metrics.winRate.toFixed(2)}%`}
                variant="positive"
              />
            </View>
          </View>

          {/* Rentabilidad */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Rentabilidad</Text>
            <View style={styles.metricsGrid}>
              <MetricCard
                label="Ganancia Total"
                value={`$${metrics.totalProfit.toFixed(2)}`}
                variant={metrics.totalProfit > 0 ? 'positive' : 'negative'}
              />
              <MetricCard
                label="ROI"
                value={`${metrics.roi.toFixed(2)}%`}
                variant={metrics.roi > 0 ? 'positive' : 'negative'}
              />
              <MetricCard
                label="Promedio Ganancia"
                value={`$${metrics.averageWin.toFixed(2)}`}
                variant="positive"
              />
              <MetricCard
                label="Promedio Pérdida"
                value={`$${metrics.averageLoss.toFixed(2)}`}
                variant="negative"
              />
            </View>
          </View>

          {/* Riesgos */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Análisis de Riesgos</Text>
            <View style={styles.metricsGrid}>
              <MetricCard
                label="Máxima Caída"
                value={`${metrics.maxDrawdown.toFixed(2)}%`}
                variant="warning"
              />
              <MetricCard
                label="Ratio Sharpe"
                value={metrics.sharpeRatio.toFixed(2)}
              />
              <MetricCard
                label="Profit Factor"
                value={metrics.profitFactor.toFixed(2)}
              />
              <MetricCard
                label="Factor de Recuperación"
                value={metrics.recoveryFactor.toFixed(2)}
              />
            </View>
          </View>

          {/* Interpretación */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Interpretación</Text>
            <View style={styles.interpretationCard}>
              <InterpretationItem
                label="Rendimiento Esperado"
                value={`${(metrics.roi / 12).toFixed(2)}% mensual (estimado)`}
              />
              <InterpretationItem
                label="Consistencia"
                value={
                  metrics.profitFactor > 2
                    ? 'Muy Alta'
                    : metrics.profitFactor > 1.5
                    ? 'Alta'
                    : 'Media'
                }
              />
              <InterpretationItem
                label="Riesgo/Recompensa"
                value={
                  metrics.averageWin > 0 && metrics.averageLoss > 0
                    ? `1:${(metrics.averageWin / metrics.averageLoss).toFixed(2)}`
                    : 'N/A'
                }
              />
            </View>
          </View>
        </>
      )}

      <View style={{ height: SPACING.section }} />
    </ScrollView>
  );
};

interface MetricCardProps {
  label: string;
  value: string;
  variant?: 'default' | 'positive' | 'negative' | 'warning';
}

const MetricCard: React.FC<MetricCardProps> = ({ label, value, variant = 'default' }) => {
  const getColor = () => {
    switch (variant) {
      case 'positive':
        return colors.success;
      case 'negative':
        return colors.error;
      case 'warning':
        return colors.warning;
      default:
        return colors.primary;
    }
  };

  return (
    <View style={styles.metricCard}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={[styles.metricValue, { color: getColor() }]}>{value}</Text>
    </View>
  );
};

interface InterpretationItemProps {
  label: string;
  value: string;
}

const InterpretationItem: React.FC<InterpretationItemProps> = ({ label, value }) => (
  <View style={styles.interpretationItem}>
    <Text style={styles.interpretationLabel}>{label}</Text>
    <Text style={styles.interpretationValue}>{value}</Text>
  </View>
);

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
  section: {
    marginHorizontal: SPACING.container,
    marginTop: SPACING.section,
    marginBottom: SPACING.section,
  },
  sectionTitle: {
    fontSize: SIZES.fontXL,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: SIZES.lg,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricCard: {
    width: '48%',
    backgroundColor: colors.surface,
    borderRadius: SIZES.radius,
    padding: SIZES.lg,
    marginBottom: SIZES.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  metricLabel: {
    fontSize: SIZES.fontMD,
    color: colors.textSecondary,
    marginBottom: SIZES.md,
  },
  metricValue: {
    fontSize: SIZES.fontXL,
    fontWeight: '700',
  },
  interpretationCard: {
    backgroundColor: colors.surface,
    borderRadius: SIZES.radius,
    padding: SIZES.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  interpretationItem: {
    paddingVertical: SIZES.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  interpretationLabel: {
    fontSize: SIZES.fontMD,
    color: colors.textSecondary,
    marginBottom: SIZES.md,
  },
  interpretationValue: {
    fontSize: SIZES.fontMD,
    fontWeight: '600',
    color: colors.textPrimary,
  },
});
