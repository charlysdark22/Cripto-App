# Guía de Desarrollo del Backend para CriptoBot

Esta guía proporciona una arquitectura recomendada y pasos para implementar el backend del bot de trading.

## 🏗️ Arquitectura General

```
┌─────────────────────────────────────────────────────────────────┐
│                    Aplicación Móvil (React Native)             │
│                      (CriptoBot-Frontend)                       │
└────────────────────────┬────────────────────────────────────────┘
                         │ HTTP REST API (JSON)
         ┌───────────────▼───────────────┐
         │   API Gateway / Express.js    │
         │   (o FastAPI en Python)       │
         └───────────────┬───────────────┘
         ┌───────────────┴────────────────────────────────────────┐
         │                                                        │
    ┌────▼──────┐  ┌──────────────┐  ┌──────────────┐  ┌──────┐
    │ Bot Core  │  │  Data Layer  │  │  Auth/Users  │  │Cache │
    │  (IA/RL)  │  │  (Database)  │  │  (JWT/OAuth) │  │(Redis)
    └────┬──────┘  └──────┬───────┘  └──────────────┘  └──────┘
         │                │
    ┌────▼────────────────▼──────────────────────┐
    │           Broker Integration              │
    │  (Interactive Brokers, Binance, MT5, etc) │
    └──────────────────────────────────────────┘
         │
    ┌────▼──────────────────────────────┐
    │  Market Data Providers (APIs)     │
    │  (Yahoo Finance, IB, Binance, etc)│
    └───────────────────────────────────┘
```

## 🛠️ Stack Tecnológico Recomendado

### Opción 1: Python + FastAPI (Recomendado para IA)

```
Backend:
├── Framework: FastAPI
├── Async: AsyncIO + uvicorn
├── ORM: SQLAlchemy
├── Database: PostgreSQL + TimescaleDB (series temporales)
├── Cache: Redis
├── Task Queue: Celery + RabbitMQ
└── AI/ML: TensorFlow 2.x, PyTorch, Stable-Baselines3

Deployment:
├── Docker + Docker Compose
├── Kubernetes (producción)
└── CI/CD: GitHub Actions o Jenkins
```

### Opción 2: Node.js + Express (Más rápido para desarrollo)

```
Backend:
├── Framework: Express.js o NestJS
├── Database: MongoDB + Mongoose (o PostgreSQL + TypeORM)
├── Cache: Redis
├── Task Queue: Bull + Redis
├── AI/ML: TensorFlow.js, Brain.js, o llamadas a Python
└── WebSockets: Socket.io (para datos en tiempo real)
```

## 📋 Estructura de Carpetas (Opción Python + FastAPI)

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                    # Entrada principal
│   ├── config.py                  # Configuración
│   ├── dependencies.py            # Inyección de dependencias
│   │
│   ├── api/
│   │   ├── __init__.py
│   │   ├── router.py              # Rutas principales
│   │   ├── v1/
│   │   │   ├── __init__.py
│   │   │   ├── endpoints/
│   │   │   │   ├── bot.py         # Endpoints /api/bot/*
│   │   │   │   ├── trades.py      # Endpoints /api/trades/*
│   │   │   │   ├── market.py      # Endpoints /api/market/*
│   │   │   │   ├── settings.py    # Endpoints /api/settings/*
│   │   │   │   ├── performance.py # Endpoints /api/performance/*
│   │   │   │   ├── logs.py        # Endpoints /api/logs/*
│   │   │   │   └── ai.py          # Endpoints /api/ai/*
│   │   │   └── schemas/           # Pydantic models (validación)
│   │   │
│   ├── core/
│   │   ├── __init__.py
│   │   ├── bot_engine.py          # Motor del bot
│   │   ├── ai_models.py           # Modelos de IA/ML
│   │   ├── risk_manager.py        # Gestión de riesgos
│   │   └── performance_tracker.py # Seguimiento de rendimiento
│   │
│   ├── integrations/
│   │   ├── __init__.py
│   │   ├── brokers/               # Conectores de brokers
│   │   │   ├── __init__.py
│   │   │   ├── base.py
│   │   │   ├── interactive_brokers.py
│   │   │   ├── binance.py
│   │   │   └── mt5.py
│   │   └── data_providers/        # Proveedores de datos
│   │       ├── __init__.py
│   │       ├── yahoo_finance.py
│   │       └── crypto_provider.py
│   │
│   ├── models/
│   │   ├── __init__.py
│   │   ├── database.py            # Configuración DB
│   │   ├── schemas.py             # SQLAlchemy models
│   │   └── repositories/          # Acceso a datos
│   │       ├── trade_repo.py
│   │       ├── decision_repo.py
│   │       └── log_repo.py
│   │
│   ├── services/
│   │   ├── __init__.py
│   │   ├── bot_service.py         # Lógica de negocio del bot
│   │   ├── trade_service.py       # Lógica de trades
│   │   └── ai_service.py          # Servicio de IA
│   │
│   ├── utils/
│   │   ├── __init__.py
│   │   ├── logger.py
│   │   ├── validators.py
│   │   └── helpers.py
│   │
│   ├── middleware/
│   │   ├── __init__.py
│   │   ├── error_handler.py
│   │   └── auth.py
│   │
│   └── tasks/
│       ├── __init__.py
│       ├── celery_app.py          # Configuración Celery
│       ├── bot_tasks.py           # Tareas del bot
│       └── data_tasks.py          # Tareas de datos
│
├── ai/
│   ├── __init__.py
│   ├── models/
│   │   ├── lstm_predictor.py      # Modelo LSTM
│   │   ├── reinforcement_learning.py # RL (DQN, PPO, etc)
│   │   └── ensemble.py            # Ensemble de modelos
│   │
│   ├── data/
│   │   ├── preprocessing.py
│   │   ├── feature_engineering.py
│   │   └── scaler.py
│   │
│   ├── training/
│   │   ├── trainer.py
│   │   ├── backtest.py
│   │   └── validator.py
│   │
│   └── utils/
│       ├── metrics.py
│       └── visualization.py
│
├── tests/
│   ├── __init__.py
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── docs/
│   ├── api.md
│   ├── setup.md
│   └── architecture.md
│
├── docker/
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── nginx.conf
│
├── migrations/           # Database migrations (Alembic)
├── logs/               # Archivos de log
├── config/             # Archivos de configuración
│   ├── development.yml
│   ├── production.yml
│   └── testing.yml
│
├── .env.example
├── .gitignore
├── requirements.txt    # Dependencias Python
├── setup.py           # Configuración del paquete
├── pytest.ini         # Configuración de pytest
├── pyproject.toml     # Configuración moderna
└── README.md
```

## 🚀 Instalación y Configuración (Python + FastAPI)

### 1. Crear entorno virtual

```bash
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
```

### 2. Instalar dependencias

```bash
pip install -r requirements.txt
```

### requirements.txt

```
# Framework
fastapi==0.104.1
uvicorn[standard]==0.24.0

# Database
sqlalchemy==2.0.23
alembic==1.12.1
psycopg2-binary==2.9.9  # PostgreSQL
redis==5.0.1

# Data & ML
pandas==2.1.3
numpy==1.26.2
scikit-learn==1.3.2
tensorflow==2.15.0
torch==2.1.1
stable-baselines3==2.3.2

# Broker Integration
ib-insync==0.9.88  # Interactive Brokers
python-binance==1.0.17  # Binance
python-mt5==5.0.1  # MetaTrader 5

# Data Providers
yfinance==0.2.32
alpha-vantage==1.3.3
ccxt==4.0.92  # Crypto exchanges

# Utilities
requests==2.31.0
pydantic==2.5.0
python-dotenv==1.0.0
pydantic-settings==2.1.0

# Async & Tasks
celery==5.3.4
flower==2.0.1  # Celery monitor
aioredis==2.0.1

# Logging & Monitoring
python-json-logger==2.0.7
prometheus-client==0.19.0

# Testing
pytest==7.4.3
pytest-asyncio==0.21.1
pytest-cov==4.1.0
httpx==0.25.2  # Para testing async

# Development
black==23.12.0
flake8==6.1.0
pylint==3.0.3
isort==5.13.2
mypy==1.7.1
ipython==8.17.2
```

### 3. Configuración inicial

```bash
# Crear archivo .env
cp .env.example .env

# Editar .env con tus datos
nano .env

# Ejecutar migraciones
alembic upgrade head

# Iniciar servidor
uvicorn app.main:app --reload
```

## 📊 Modelo de Base de Datos

### Tablas principales

```sql
-- Usuarios (si implementas multi-user)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR UNIQUE NOT NULL,
    email VARCHAR UNIQUE NOT NULL,
    password_hash VARCHAR NOT NULL,
    api_key VARCHAR UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Configuraciones del bot
CREATE TABLE bot_settings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    broker_type VARCHAR NOT NULL,
    api_key_encrypted VARCHAR,
    api_secret_encrypted VARCHAR,
    risk_percentage DECIMAL(5,2),
    max_drawdown DECIMAL(5,2),
    daily_loss_limit DECIMAL(12,2),
    position_size DECIMAL(10,4),
    enabled_notifications BOOLEAN DEFAULT TRUE,
    enabled_data_logging BOOLEAN DEFAULT TRUE,
    update_interval INTEGER DEFAULT 5000,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Operaciones (Trades)
CREATE TABLE trades (
    id VARCHAR PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    symbol VARCHAR NOT NULL,
    trade_type VARCHAR NOT NULL, -- 'buy' or 'sell'
    entry_price DECIMAL(18,8) NOT NULL,
    exit_price DECIMAL(18,8),
    quantity DECIMAL(18,8) NOT NULL,
    entry_time BIGINT NOT NULL,
    exit_time BIGINT,
    profit DECIMAL(18,2),
    profit_percentage DECIMAL(10,4),
    status VARCHAR NOT NULL, -- 'open', 'closed', 'cancelled'
    reason TEXT,
    confidence DECIMAL(5,2),
    ai_model VARCHAR,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_symbol (symbol),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
);

-- Decisiones de IA (TimescaleDB para series temporales)
CREATE TABLE ai_decisions (
    time TIMESTAMPTZ NOT NULL,
    user_id INTEGER NOT NULL,
    symbol VARCHAR NOT NULL,
    action VARCHAR NOT NULL, -- 'buy', 'sell', 'hold'
    confidence DECIMAL(5,2),
    direction VARCHAR NOT NULL,
    probability DECIMAL(5,4),
    executed BOOLEAN DEFAULT FALSE,
    result_profit DECIMAL(18,2),
    result_feedback DECIMAL(5,4),
    PRIMARY KEY (time, user_id, symbol)
) PARTITION BY RANGE (time);

-- Logs del sistema
CREATE TABLE system_logs (
    id BIGSERIAL PRIMARY KEY,
    timestamp TIMESTAMPTZ NOT NULL,
    level VARCHAR NOT NULL, -- 'info', 'warning', 'error', 'debug'
    message TEXT NOT NULL,
    data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_level_timestamp (level, timestamp DESC)
);

-- Métricas de rendimiento
CREATE TABLE performance_metrics (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    date DATE NOT NULL,
    total_trades INTEGER,
    win_trades INTEGER,
    loss_trades INTEGER,
    win_rate DECIMAL(5,2),
    average_win DECIMAL(18,2),
    average_loss DECIMAL(18,2),
    profit_factor DECIMAL(10,4),
    sharpe_ratio DECIMAL(10,4),
    max_drawdown DECIMAL(5,2),
    recovery_factor DECIMAL(10,4),
    total_profit DECIMAL(18,2),
    roi DECIMAL(10,4),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, date)
);
```

## 🤖 Implementación de IA/ML

### Modelo LSTM para predicción

```python
# ai/models/lstm_predictor.py

import numpy as np
import tensorflow as tf
from tensorflow import keras
from sklearn.preprocessing import MinMaxScaler

class LSTMPredictor:
    def __init__(self, lookback_window=60):
        self.lookback_window = lookback_window
        self.scaler = MinMaxScaler()
        self.model = None
        
    def build_model(self, input_shape):
        """Construir modelo LSTM"""
        model = keras.Sequential([
            keras.layers.LSTM(128, activation='relu', 
                            input_shape=input_shape, 
                            return_sequences=True),
            keras.layers.Dropout(0.2),
            keras.layers.LSTM(64, activation='relu', 
                            return_sequences=False),
            keras.layers.Dropout(0.2),
            keras.layers.Dense(32, activation='relu'),
            keras.layers.Dropout(0.2),
            keras.layers.Dense(1)  # Predicción del precio
        ])
        
        model.compile(
            optimizer=keras.optimizers.Adam(learning_rate=0.001),
            loss='mse',
            metrics=['mae']
        )
        
        return model
    
    def prepare_data(self, prices):
        """Preparar datos para LSTM"""
        scaled_prices = self.scaler.fit_transform(prices.reshape(-1, 1))
        X, y = [], []
        
        for i in range(len(scaled_prices) - self.lookback_window):
            X.append(scaled_prices[i:i+self.lookback_window])
            y.append(scaled_prices[i+self.lookback_window])
        
        return np.array(X), np.array(y)
    
    def train(self, prices, epochs=50, batch_size=32):
        """Entrenar modelo"""
        X, y = self.prepare_data(prices)
        
        self.model = self.build_model((X.shape[1], X.shape[2]))
        self.model.fit(X, y, epochs=epochs, batch_size=batch_size, 
                      verbose=1, validation_split=0.1)
    
    def predict(self, recent_prices):
        """Hacer predicción"""
        if self.model is None:
            raise ValueError("Modelo no entrenado")
        
        scaled = self.scaler.transform(recent_prices.reshape(-1, 1))
        X = scaled.reshape(1, -1, 1)
        prediction = self.model.predict(X, verbose=0)
        
        return self.scaler.inverse_transform(prediction)[0][0]
```

### Reinforcement Learning (DQN)

```python
# ai/models/reinforcement_learning.py

from stable_baselines3 import DQN
from stable_baselines3.common.env_util import make_vec_env
import gymnasium as gym

class TradingEnvironment(gym.Env):
    """Ambiente personalizado para trading"""
    
    def __init__(self, data, initial_balance=10000):
        super().__init__()
        self.data = data
        self.initial_balance = initial_balance
        self.balance = initial_balance
        self.current_step = 0
        
        # Acciones: 0=hold, 1=buy, 2=sell
        self.action_space = gym.spaces.Discrete(3)
        # Observaciones: precio, balance, posición, etc
        self.observation_space = gym.spaces.Box(
            low=0, high=np.inf, shape=(5,), dtype=np.float32
        )
    
    def reset(self, seed=None):
        super().reset(seed=seed)
        self.balance = self.initial_balance
        self.current_step = 0
        return self._get_observation(), {}
    
    def step(self, action):
        # Lógica de la acción
        reward = 0
        terminated = self.current_step >= len(self.data) - 1
        
        self.current_step += 1
        return self._get_observation(), reward, terminated, False, {}
    
    def _get_observation(self):
        # Retornar observación actual
        pass

# Entrenar modelo DQN
env = make_vec_env(TradingEnvironment, n_envs=4)
model = DQN("MlpPolicy", env, verbose=1)
model.learn(total_timesteps=100000)
model.save("dqn_trader")
```

## 🔐 Seguridad

### API Authentication

```python
# app/core/security.py

from datetime import datetime, timedelta
from typing import Optional
import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthCredentials

security = HTTPBearer()
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = "HS256"

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(hours=24)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(credentials: HTTPAuthCredentials = Depends(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    return user_id
```

## 📈 Monitoreo en Producción

```python
# app/core/monitoring.py

from prometheus_client import Counter, Histogram, Gauge
import time

# Métricas de Prometheus
trade_counter = Counter(
    'trades_total', 'Total trades executed',
    ['symbol', 'type']
)

trade_profit = Gauge(
    'trade_profit_latest', 'Latest trade profit'
)

api_request_duration = Histogram(
    'api_request_duration_seconds', 'API request duration'
)

@app.middleware("http")
async def add_metrics(request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    api_request_duration.observe(process_time)
    return response
```

## 📝 Ejemplo de Endpoint Completo

```python
# app/api/v1/endpoints/trades.py

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.models import schemas
from app.models.repositories import TradeRepository
from app.core.security import get_current_user

router = APIRouter(prefix="/trades", tags=["trades"])

@router.get("/", response_model=List[schemas.TradeResponse])
async def get_trades(
    limit: int = Query(50, ge=1, le=500),
    status: Optional[str] = None,
    symbol: Optional[str] = None,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Obtener listado de trades
    """
    repo = TradeRepository(db)
    trades = repo.get_by_user(
        user_id=current_user,
        limit=limit,
        status=status,
        symbol=symbol
    )
    return trades

@router.post("/{trade_id}/close", response_model=schemas.TradeResponse)
async def close_trade(
    trade_id: str,
    request: schemas.CloseTradeRequest,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Cerrar un trade abierto
    """
    repo = TradeRepository(db)
    trade = repo.get_by_id(trade_id)
    
    if not trade:
        raise HTTPException(status_code=404, detail="Trade not found")
    
    if trade.user_id != current_user:
        raise HTTPException(status_code=403, detail="Unauthorized")
    
    # Cerrar el trade
    trade.status = "closed"
    trade.exit_time = int(time.time() * 1000)
    # ... calcular profit
    
    db.commit()
    return trade
```

## 🚀 Deployment

### Docker Compose

```yaml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "5000:5000"
    environment:
      DATABASE_URL: postgresql://user:password@postgres:5432/criptobot
      REDIS_URL: redis://redis:6379
    depends_on:
      - postgres
      - redis
    volumes:
      - ./:/app

  postgres:
    image: postgres:15
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: criptobot
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  celery_worker:
    build: .
    command: celery -A app.tasks.celery_app worker --loglevel=info
    depends_on:
      - postgres
      - redis
    environment:
      DATABASE_URL: postgresql://user:password@postgres:5432/criptobot
      REDIS_URL: redis://redis:6379

  flower:
    build: .
    command: celery -A app.tasks.celery_app flower
    ports:
      - "5555:5555"
    depends_on:
      - celery_worker

volumes:
  postgres_data:
  redis_data:
```

---

Esta guía proporciona una estructura sólida para construir un backend profesional para CriptoBot. El siguiente paso es implementar cada módulo según necesites.
