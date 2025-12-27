import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BotStatus, Trade, Settings } from '../types';

interface BotStore {
  botStatus: BotStatus | null;
  trades: Trade[];
  settings: Settings | null;
  isLoading: boolean;
  error: string | null;

  // Acciones
  setBotStatus: (status: BotStatus) => void;
  addTrade: (trade: Trade) => void;
  setSettings: (settings: Settings) => void;
  loadFromStorage: () => Promise<void>;
  saveBotStatus: () => Promise<void>;
  clearError: () => void;
}

export const useBotStore = create<BotStore>((set, get) => ({
  botStatus: null,
  trades: [],
  settings: null,
  isLoading: false,
  error: null,

  setBotStatus: (status: BotStatus) => {
    set({ botStatus: status });
  },

  addTrade: (trade: Trade) => {
    set((state) => ({
      trades: [trade, ...(state.trades || [])],
    }));
  },

  setSettings: (settings: Settings) => {
    set({ settings });
  },

  loadFromStorage: async () => {
    try {
      set({ isLoading: true });
      const botData = await AsyncStorage.getItem('botStatus');
      const tradesData = await AsyncStorage.getItem('trades');
      const settingsData = await AsyncStorage.getItem('settings');

      if (botData) set({ botStatus: JSON.parse(botData) });
      if (tradesData) set({ trades: JSON.parse(tradesData) });
      if (settingsData) set({ settings: JSON.parse(settingsData) });
    } catch (error) {
      set({ error: 'Error al cargar datos del almacenamiento' });
    } finally {
      set({ isLoading: false });
    }
  },

  saveBotStatus: async () => {
    try {
      const { botStatus, trades, settings } = get();
      if (botStatus) {
        await AsyncStorage.setItem('botStatus', JSON.stringify(botStatus));
      }
      if (trades.length > 0) {
        await AsyncStorage.setItem('trades', JSON.stringify(trades));
      }
      if (settings) {
        await AsyncStorage.setItem('settings', JSON.stringify(settings));
      }
    } catch (error) {
      set({ error: 'Error al guardar datos' });
    }
  },

  clearError: () => set({ error: null }),
}));
