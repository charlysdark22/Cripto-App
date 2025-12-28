import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
  Switch,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, SIZES, SPACING } from '../constants';
import { useBotStore } from '../context/botStore';
import { botAPIService } from '../services/api';
import { Button, SettingItem } from '../components';
import { Settings } from '../types';

export function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [tempSettings, setTempSettings] = useState<Partial<Settings>>({});

  const { setSettings: storeSettings } = useBotStore();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      const data = await botAPIService.getSettings();
      setSettings(data);
      setTempSettings(data);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar las configuraciones');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setIsSaving(true);
      const updated = await botAPIService.updateSettings(tempSettings);
      setSettings(updated);
      storeSettings(updated);
      Alert.alert('Éxito', 'Configuraciones guardadas correctamente');
    } catch (error) {
      Alert.alert('Error', 'No se pudieron guardar las configuraciones');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    Alert.alert(
      'Confirmar',
      '¿Desea restaurar la configuración original?',
      [
        { text: 'Cancelar', onPress: () => {} },
        {
          text: 'Restaurar',
          onPress: () => {
            setTempSettings(settings || {});
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
    <ScrollView style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Configuración</Text>
      </View>

      {/* Sección API */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Conexión API</Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Tipo de Broker</Text>
          <View style={styles.brokerSelector}>
            {['interactive-brokers', 'binance', 'mt5'].map((broker: string) => (
              <TouchableOpacity
                key={broker}
                style={[
                  styles.brokerOption,
                  tempSettings.brokerType === broker && styles.brokerOptionActive,
                ]}
              >
                <Text style={styles.brokerOptionText}>{broker}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>API Key</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingrese su API Key"
            placeholderTextColor={colors.textTertiary}
            value={tempSettings.apiKey || ''}
            onChangeText={(text: string) =>
              setTempSettings({ ...tempSettings, apiKey: text })
            }
            secureTextEntry
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>API Secret</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingrese su API Secret"
            placeholderTextColor={colors.textTertiary}
            value={tempSettings.apiSecret || ''}
            onChangeText={(text: string) =>
              setTempSettings({ ...tempSettings, apiSecret: text })
            }
            secureTextEntry
          />
        </View>
      </View>

      {/* Sección Riesgos */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Gestión de Riesgos</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Riesgo por Operación (%)</Text>
          <TextInput
            style={styles.input}
            placeholder="2.0"
            placeholderTextColor={colors.textTertiary}
            value={tempSettings.riskPercentage?.toString() || ''}
            onChangeText={(text: string) =>
              setTempSettings({
                ...tempSettings,
                riskPercentage: parseFloat(text) || 0,
              })
            }
            keyboardType="decimal-pad"
          />
          <Text style={styles.inputHint}>
            Porcentaje del capital en riesgo por cada operación
          </Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Máxima Caída Permitida (%)</Text>
          <TextInput
            style={styles.input}
            placeholder="20.0"
            placeholderTextColor={colors.textTertiary}
            value={tempSettings.maxDrawdown?.toString() || ''}
            onChangeText={(text: string) =>
              setTempSettings({
                ...tempSettings,
                maxDrawdown: parseFloat(text) || 0,
              })
            }
            keyboardType="decimal-pad"
          />
          <Text style={styles.inputHint}>
            Porcentaje máximo de caída antes de detener
          </Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Límite de Pérdida Diaria (USD)</Text>
          <TextInput
            style={styles.input}
            placeholder="1000.0"
            placeholderTextColor={colors.textTertiary}
            value={tempSettings.dailyLossLimit?.toString() || ''}
            onChangeText={(text: string) =>
              setTempSettings({
                ...tempSettings,
                dailyLossLimit: parseFloat(text) || 0,
              })
            }
            keyboardType="decimal-pad"
          />
          <Text style={styles.inputHint}>
            Pérdida máxima permitida en un día
          </Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Tamaño de Posición</Text>
          <TextInput
            style={styles.input}
            placeholder="0.1"
            placeholderTextColor={colors.textTertiary}
            value={tempSettings.positionSize?.toString() || ''}
            onChangeText={(text: string) =>
              setTempSettings({
                ...tempSettings,
                positionSize: parseFloat(text) || 0,
              })
            }
            keyboardType="decimal-pad"
          />
        </View>
      </View>

      {/* Sección Notificaciones */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferencias</Text>

        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Notificaciones</Text>
          <Switch
            value={tempSettings.enableNotifications ?? false}
            onValueChange={(value: boolean) =>
              setTempSettings({
                ...tempSettings,
                enableNotifications: value,
              })
            }
            trackColor={{ false: colors.border, true: colors.primary }}
          />
        </View>

        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Registrar Datos</Text>
          <Switch
            value={tempSettings.enableDataLogging ?? false}
            onValueChange={(value: boolean) =>
              setTempSettings({
                ...tempSettings,
                enableDataLogging: value,
              })
            }
            trackColor={{ false: colors.border, true: colors.primary }}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>
            Intervalo de Actualización (ms)
          </Text>
          <TextInput
            style={styles.input}
            placeholder="5000"
            placeholderTextColor={colors.textTertiary}
            value={tempSettings.updateInterval?.toString() || ''}
            onChangeText={(text: string) =>
              setTempSettings({
                ...tempSettings,
                updateInterval: parseFloat(text) || 0,
              })
            }
            keyboardType="decimal-pad"
          />
        </View>
      </View>

      {/* Botones */}
      <View style={styles.buttonsContainer}>
        <Button
          title="Guardar Cambios"
          onPress={handleSaveSettings}
          variant="success"
          disabled={isSaving}
        />
        <Button
          title="Restaurar Configuración"
          onPress={handleReset}
          variant="outline"
          style={{ marginTop: SIZES.lg }}
        />
      </View>

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
  inputContainer: {
    marginBottom: SIZES.xl,
  },
  inputLabel: {
    fontSize: SIZES.fontMD,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: SIZES.md,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: SIZES.radius,
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.md,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
    fontSize: SIZES.fontMD,
  },
  inputHint: {
    fontSize: SIZES.fontSM,
    color: colors.textTertiary,
    marginTop: SIZES.sm,
  },
  brokerSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  brokerOption: {
    flex: 1,
    paddingVertical: SIZES.md,
    paddingHorizontal: SIZES.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    marginHorizontal: SIZES.sm,
    backgroundColor: colors.surface,
  },
  brokerOptionActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  brokerOptionText: {
    fontSize: SIZES.fontSM,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SIZES.lg,
    paddingHorizontal: SIZES.lg,
    backgroundColor: colors.surface,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  switchLabel: {
    fontSize: SIZES.fontMD,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  buttonsContainer: {
    marginHorizontal: SPACING.container,
    marginTop: SPACING.section,
    marginBottom: SPACING.section,
  },
});
