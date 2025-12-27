import axios, { AxiosInstance } from 'axios';
import { BotStatus, Trade, MarketData, Settings } from '../types';

class BotAPIService {
  private api: AxiosInstance;
  private baseURL: string = 'http://localhost:5000/api'; // Cambiar con tu servidor backend

  constructor() {
    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // Bot Status
  async getBotStatus(): Promise<BotStatus> {
    const response = await this.api.get('/bot/status');
    return response.data;
  }

  async startBot(): Promise<void> {
    await this.api.post('/bot/start');
  }

  async stopBot(): Promise<void> {
    await this.api.post('/bot/stop');
  }

  async pauseBot(): Promise<void> {
    await this.api.post('/bot/pause');
  }

  // Trades
  async getTrades(limit: number = 50): Promise<Trade[]> {
    const response = await this.api.get('/trades', { params: { limit } });
    return response.data;
  }

  async getTrade(tradeId: string): Promise<Trade> {
    const response = await this.api.get(`/trades/${tradeId}`);
    return response.data;
  }

  async closeTrade(tradeId: string): Promise<void> {
    await this.api.post(`/trades/${tradeId}/close`);
  }

  // Market Data
  async getMarketData(symbol: string): Promise<MarketData> {
    const response = await this.api.get(`/market/${symbol}`);
    return response.data;
  }

  async getMarketDataMultiple(symbols: string[]): Promise<MarketData[]> {
    const response = await this.api.post('/market/multiple', { symbols });
    return response.data;
  }

  // Settings
  async getSettings(): Promise<Settings> {
    const response = await this.api.get('/settings');
    return response.data;
  }

  async updateSettings(settings: Partial<Settings>): Promise<Settings> {
    const response = await this.api.put('/settings', settings);
    return response.data;
  }

  // Performance
  async getPerformanceMetrics() {
    const response = await this.api.get('/performance');
    return response.data;
  }

  // Logs
  async getLogs(limit: number = 100) {
    const response = await this.api.get('/logs', { params: { limit } });
    return response.data;
  }

  // AI Decisions
  async getAIDecisions(limit: number = 50) {
    const response = await this.api.get('/ai/decisions', { params: { limit } });
    return response.data;
  }

  // Health Check
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.api.get('/health');
      return response.status === 200;
    } catch {
      return false;
    }
  }
}

export const botAPIService = new BotAPIService();
