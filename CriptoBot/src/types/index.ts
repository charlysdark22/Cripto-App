// Tipos para el Bot de Trading con IA

export interface BotStatus {
  id: string;
  name: string;
  isActive: boolean;
  status: 'running' | 'stopped' | 'paused' | 'error';
  startTime: number;
  uptime: number; // en milisegundos
  totalTrades: number;
  winRate: number; // porcentaje
  profitLoss: number;
  profitLossPercentage: number;
  balance: number;
  equity: number;
  drawdown: number; // máxima caída
  lastTrade?: Trade;
}

export interface Trade {
  id: string;
  symbol: string;
  type: 'buy' | 'sell';
  entryPrice: number;
  exitPrice?: number;
  quantity: number;
  entryTime: number;
  exitTime?: number;
  profit?: number;
  profitPercentage?: number;
  status: 'open' | 'closed' | 'cancelled';
  reason: string; // razón de la decisión de la IA
  confidence: number; // 0-100
  aiModel: string; // versión del modelo usado
}

export interface AIDecision {
  id: string;
  timestamp: number;
  symbol: string;
  action: 'buy' | 'sell' | 'hold';
  confidence: number; // 0-100
  prediction: {
    direction: 'up' | 'down' | 'neutral';
    probability: number;
  };
  factors: AIFactor[];
  executed: boolean;
  result?: {
    profit?: number;
    loss?: number;
    feedback: number; // para el aprendizaje reforzado
  };
}

export interface AIFactor {
  name: string;
  weight: number;
  value: number;
  contribution: number; // impacto en la decisión final
}

export interface Portfolio {
  totalBalance: number;
  totalEquity: number;
  usedMargin: number;
  freeMargin: number;
  marginLevel: number;
  positions: Position[];
  openTrades: Trade[];
}

export interface Position {
  symbol: string;
  quantity: number;
  entryPrice: number;
  currentPrice: number;
  profit: number;
  profitPercentage: number;
}

export interface MarketData {
  symbol: string;
  price: number;
  bid: number;
  ask: number;
  timestamp: number;
  high24h: number;
  low24h: number;
  volume24h: number;
  change24h: number;
  changePercentage24h: number;
}

export interface Settings {
  apiKey: string;
  apiSecret: string;
  brokerType: 'interactive-brokers' | 'binance' | 'mt5' | 'other';
  riskPercentage: number; // riesgo máximo por operación
  maxDrawdown: number; // máxima caída permitida
  dailyLossLimit: number; // pérdida máxima diaria
  positionSize: number;
  enableNotifications: boolean;
  enableDataLogging: boolean;
  updateInterval: number; // milisegundos
}

export interface PerformanceMetrics {
  totalTrades: number;
  winTrades: number;
  lossTrades: number;
  winRate: number;
  averageWin: number;
  averageLoss: number;
  profitFactor: number;
  sharpeRatio: number;
  maxDrawdown: number;
  recoveryFactor: number;
  totalProfit: number;
  roi: number;
}

export interface BotLog {
  id: string;
  timestamp: number;
  level: 'info' | 'warning' | 'error' | 'debug';
  message: string;
  data?: any;
}
