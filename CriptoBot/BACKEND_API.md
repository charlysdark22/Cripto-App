# Backend API Specification para CriptoBot

## Overview

Este documento describe la API REST que debe implementar el backend para soportar la aplicación CriptoBot móvil.

## Base URL

```
http://localhost:5000/api
```

En producción, cambiar según corresponda.

## Health Check

### GET /health
Verifica que el servidor está activo.

**Response**: 200 OK
```json
{
  "status": "ok",
  "timestamp": "2025-12-27T12:00:00Z"
}
```

---

## Bot Management

### GET /bot/status
Obtiene el estado actual del bot.

**Response**: 200 OK
```json
{
  "id": "bot-001",
  "name": "Trading Bot Alpha",
  "isActive": true,
  "status": "running",
  "startTime": 1703676000000,
  "uptime": 3600000,
  "totalTrades": 42,
  "winRate": 65.5,
  "profitLoss": 1250.50,
  "profitLossPercentage": 12.5,
  "balance": 10000,
  "equity": 11250.50,
  "drawdown": -5.2,
  "lastTrade": {
    "id": "trade-42",
    "symbol": "BTC/USD",
    "type": "buy",
    "entryPrice": 42000,
    "exitPrice": null,
    "quantity": 0.025,
    "entryTime": 1703675900000,
    "exitTime": null,
    "profit": null,
    "profitPercentage": null,
    "status": "open",
    "reason": "Señal de compra detectada por modelo LSTM",
    "confidence": 92,
    "aiModel": "v2.1.0"
  }
}
```

### POST /bot/start
Inicia el bot.

**Request Body**: (vacío)

**Response**: 200 OK
```json
{
  "message": "Bot iniciado correctamente",
  "status": "running"
}
```

### POST /bot/stop
Detiene el bot.

**Request Body**: (vacío)

**Response**: 200 OK
```json
{
  "message": "Bot detenido",
  "status": "stopped"
}
```

### POST /bot/pause
Pausa el bot (sin cerrar posiciones).

**Request Body**: (vacío)

**Response**: 200 OK
```json
{
  "message": "Bot pausado",
  "status": "paused"
}
```

---

## Trades

### GET /trades
Lista todas las operaciones.

**Query Parameters**:
- `limit` (optional): Número máximo de trades a retornar (default: 50)
- `status` (optional): 'open' | 'closed'
- `symbol` (optional): Filtrar por símbolo

**Response**: 200 OK
```json
[
  {
    "id": "trade-42",
    "symbol": "BTC/USD",
    "type": "buy",
    "entryPrice": 42000,
    "exitPrice": 42500,
    "quantity": 0.025,
    "entryTime": 1703675900000,
    "exitTime": 1703680000000,
    "profit": 12.50,
    "profitPercentage": 0.3,
    "status": "closed",
    "reason": "Señal de compra detectada por modelo LSTM",
    "confidence": 92,
    "aiModel": "v2.1.0"
  }
]
```

### GET /trades/:tradeId
Obtiene detalles de una operación específica.

**Response**: 200 OK
```json
{
  "id": "trade-42",
  "symbol": "BTC/USD",
  "type": "buy",
  "entryPrice": 42000,
  "exitPrice": 42500,
  "quantity": 0.025,
  "entryTime": 1703675900000,
  "exitTime": 1703680000000,
  "profit": 12.50,
  "profitPercentage": 0.3,
  "status": "closed",
  "reason": "Señal de compra detectada por modelo LSTM",
  "confidence": 92,
  "aiModel": "v2.1.0"
}
```

### POST /trades/:tradeId/close
Cierra una operación abierta manualmente.

**Request Body**:
```json
{
  "reason": "Cierre manual por usuario"
}
```

**Response**: 200 OK
```json
{
  "id": "trade-42",
  "status": "closed",
  "exitPrice": 42500,
  "exitTime": 1703680000000,
  "profit": 12.50,
  "profitPercentage": 0.3
}
```

---

## Market Data

### GET /market/:symbol
Obtiene datos de mercado de un símbolo.

**Path Parameters**:
- `symbol`: Símbolo de trading (ej: BTC/USD, ETH/USD)

**Response**: 200 OK
```json
{
  "symbol": "BTC/USD",
  "price": 42500,
  "bid": 42480,
  "ask": 42520,
  "timestamp": 1703680000000,
  "high24h": 43000,
  "low24h": 41500,
  "volume24h": 25000000,
  "change24h": 500,
  "changePercentage24h": 1.19
}
```

### POST /market/multiple
Obtiene datos de múltiples símbolos.

**Request Body**:
```json
{
  "symbols": ["BTC/USD", "ETH/USD", "ADA/USD"]
}
```

**Response**: 200 OK
```json
[
  {
    "symbol": "BTC/USD",
    "price": 42500,
    "bid": 42480,
    "ask": 42520,
    "timestamp": 1703680000000,
    "high24h": 43000,
    "low24h": 41500,
    "volume24h": 25000000,
    "change24h": 500,
    "changePercentage24h": 1.19
  }
]
```

---

## Settings

### GET /settings
Obtiene la configuración actual del bot.

**Response**: 200 OK
```json
{
  "apiKey": "***",
  "apiSecret": "***",
  "brokerType": "interactive-brokers",
  "riskPercentage": 2.0,
  "maxDrawdown": 20.0,
  "dailyLossLimit": 1000,
  "positionSize": 0.1,
  "enableNotifications": true,
  "enableDataLogging": true,
  "updateInterval": 5000
}
```

### PUT /settings
Actualiza la configuración del bot.

**Request Body**:
```json
{
  "riskPercentage": 2.5,
  "maxDrawdown": 25.0,
  "dailyLossLimit": 1500,
  "enableNotifications": false
}
```

**Response**: 200 OK
```json
{
  "apiKey": "***",
  "apiSecret": "***",
  "brokerType": "interactive-brokers",
  "riskPercentage": 2.5,
  "maxDrawdown": 25.0,
  "dailyLossLimit": 1500,
  "positionSize": 0.1,
  "enableNotifications": false,
  "enableDataLogging": true,
  "updateInterval": 5000
}
```

---

## Performance Metrics

### GET /performance
Obtiene métricas de rendimiento del bot.

**Response**: 200 OK
```json
{
  "totalTrades": 100,
  "winTrades": 65,
  "lossTrades": 35,
  "winRate": 65.0,
  "averageWin": 25.50,
  "averageLoss": -18.30,
  "profitFactor": 2.15,
  "sharpeRatio": 1.85,
  "maxDrawdown": -12.5,
  "recoveryFactor": 8.5,
  "totalProfit": 1650.00,
  "roi": 16.5
}
```

---

## Logs

### GET /logs
Obtiene logs del sistema.

**Query Parameters**:
- `limit` (optional): Número máximo de logs (default: 100)
- `level` (optional): 'info' | 'warning' | 'error' | 'debug'

**Response**: 200 OK
```json
[
  {
    "id": "log-001",
    "timestamp": 1703680000000,
    "level": "info",
    "message": "Bot iniciado correctamente",
    "data": {}
  },
  {
    "id": "log-002",
    "timestamp": 1703680005000,
    "level": "debug",
    "message": "Conectado a broker",
    "data": {
      "broker": "interactive-brokers",
      "account": "ACCOUNT123"
    }
  }
]
```

---

## AI Decisions

### GET /ai/decisions
Obtiene las decisiones tomadas por la IA.

**Query Parameters**:
- `limit` (optional): Número máximo de decisiones (default: 50)
- `symbol` (optional): Filtrar por símbolo

**Response**: 200 OK
```json
[
  {
    "id": "decision-001",
    "timestamp": 1703680000000,
    "symbol": "BTC/USD",
    "action": "buy",
    "confidence": 92,
    "prediction": {
      "direction": "up",
      "probability": 0.92
    },
    "factors": [
      {
        "name": "RSI",
        "weight": 0.25,
        "value": 35,
        "contribution": 0.15
      },
      {
        "name": "MACD",
        "weight": 0.35,
        "value": 1.5,
        "contribution": 0.42
      },
      {
        "name": "Modelo LSTM",
        "weight": 0.40,
        "value": 0.85,
        "contribution": 0.35
      }
    ],
    "executed": true,
    "result": {
      "profit": 125.50,
      "feedback": 0.95
    }
  }
]
```

---

## Error Handling

Todos los errores deben retornar el siguiente formato:

**Response**: 4xx/5xx
```json
{
  "error": {
    "code": "INVALID_REQUEST",
    "message": "Descripción del error",
    "details": {}
  },
  "timestamp": "2025-12-27T12:00:00Z"
}
```

### Códigos de Error Comunes

- `INVALID_REQUEST`: Parámetros inválidos
- `UNAUTHORIZED`: API key inválida
- `FORBIDDEN`: Operación no permitida
- `NOT_FOUND`: Recurso no encontrado
- `CONFLICT`: Conflicto de estado
- `SERVER_ERROR`: Error interno del servidor
- `SERVICE_UNAVAILABLE`: Servicio no disponible

---

## Authentication

Aunque en la especificación básica no está incluido, se recomienda implementar:

```
Authorization: Bearer <API_TOKEN>
```

---

## Rate Limiting

Se recomienda implementar límites de rate:
- 100 requests/minuto para la mayoría de endpoints
- 1000 requests/minuto para datos de mercado

Retornar header `X-RateLimit-*`:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1703680060
```

---

## Notas de Implementación

1. **Timestamps**: Usar milisegundos desde epoch (Unix timestamp * 1000)
2. **Números**: Usar strings para valores monetarios si es necesario (evitar problemas de precisión)
3. **Errores**: Siempre retornar códigos HTTP apropiados
4. **CORS**: Configurar CORS para permitir requests desde la aplicación móvil
5. **Validación**: Validar todas las entradas en el servidor
6. **Seguridad**: Encriptar API keys en almacenamiento
7. **Logging**: Registrar todas las operaciones para auditoría
