# CriptoBot - Trading AI Móvil

Una aplicación React Native con Expo para Android e iOS que actúa como **interfaz de control y monitoreo** para un bot autónomo de trading con IA de aprendizaje profundo.

## 🎯 Características

### Pantalla Principal (Home)
- **Estado en Vivo** del bot (Activo/Inactivo)
- **Métricas de Rendimiento**:
  - Balance total
  - Ganancias/Pérdidas
  - ROI (%)
  - Tasa de ganancia
  - Máxima caída (Drawdown)
- **Controles**:
  - Botón para iniciar/detener bot
  - Pausar operaciones
- **Última Operación**: Detalles de la operación más reciente

### Pantalla de Operaciones (Trades)
- Lista de todas las operaciones ejecutadas
- **Información por operación**:
  - Símbolo (BTC/USD, etc.)
  - Tipo (BUY/SELL)
  - Precio de entrada y salida
  - Ganancia/Pérdida
  - Porcentaje de retorno
  - Confianza de la IA
  - Razón de la decisión
- Filtros y búsqueda
- Capacidad de cerrar operaciones manualmente

### Pantalla de Análisis (Analytics)
- **Resumen General**:
  - Total operaciones
  - Operaciones ganadoras/perdedoras
  - Tasa de ganancia
- **Rentabilidad**:
  - Ganancia total
  - ROI
  - Promedio ganancias/pérdidas
- **Análisis de Riesgos**:
  - Máxima caída
  - Ratio Sharpe
  - Profit Factor
  - Factor de recuperación
- **Interpretación automática** de métricas

### Pantalla de Configuración (Settings)
- **Conexión API**:
  - Selector de broker (Interactive Brokers, Binance, MT5)
  - API Key y Secret
- **Gestión de Riesgos**:
  - Porcentaje de riesgo por operación
  - Máxima caída permitida
  - Límite de pérdida diaria
  - Tamaño de posición
- **Preferencias**:
  - Habilitar/deshabilitar notificaciones
  - Registro de datos
  - Intervalo de actualización

## 📱 Platforms

- ✅ **Android**: Compatible con Android 5.0+
- ✅ **iOS**: Compatible con iOS 12.0+
- ✅ **Web**: Previsualización en navegador (Expo Web)

## 🛠️ Tech Stack

- **Framework**: React Native con Expo
- **Navegación**: React Navigation (Bottom Tabs + Stack)
- **Estado Global**: Zustand
- **Almacenamiento**: AsyncStorage
- **API**: Axios
- **UI Components**: React Native Native Components
- **Gráficos**: react-native-chart-kit
- **Iconos**: Material Icons
- **TypeScript**: Para type-safety

## 📦 Estructura del Proyecto

```
CriptoBot/
├── app/
│   └── _layout.tsx          # Layout raíz
├── src/
│   ├── screens/             # Pantallas principales
│   │   ├── HomeScreen.tsx
│   │   ├── TradesScreen.tsx
│   │   ├── AnalyticsScreen.tsx
│   │   └── SettingsScreen.tsx
│   ├── components/          # Componentes reutilizables
│   │   ├── Button.tsx
│   │   ├── StatCard.tsx
│   │   ├── TradeCard.tsx
│   │   └── SettingItem.tsx
│   ├── navigation/          # Configuración de navegación
│   │   └── RootNavigator.tsx
│   ├── context/             # Gestión de estado (Zustand)
│   │   └── botStore.ts
│   ├── services/            # Servicios API
│   │   └── api.ts
│   ├── types/               # TypeScript interfaces
│   │   └── index.ts
│   ├── constants/           # Colores, tamaños, etc.
│   │   ├── colors.ts
│   │   └── sizes.ts
│   └── utils/               # Funciones auxiliares
├── package.json
└── app.json
```

## 🚀 Instalación y Configuración

### Requisitos previos
- Node.js 16+ instalado
- npm o yarn
- Expo CLI (opcional pero recomendado)

### Instalación

```bash
# Navegar al proyecto
cd /home/charly/Descargas/Cripto-App/CriptoBot

# Instalar dependencias
npm install
```

## 🎮 Ejecución

### En Android (requiere Android Studio o emulador)
```bash
npm run android
# O
expo run android
```

### En iOS (requiere macOS)
```bash
npm run ios
# O
expo run ios
```

### En Web (para desarrollo/previsualización)
```bash
npm run web
# O
expo start --web
```

### Con Expo Go (más fácil para empezar)
```bash
expo start
# Luego abre la app Expo Go en tu teléfono y escanea el código QR
```

## 🔗 Backend Integration

Esta aplicación se conecta a un servidor backend que debe implementar la siguiente API:

### Endpoints Requeridos

#### Bot Status
```
GET /api/bot/status
POST /api/bot/start
POST /api/bot/stop
POST /api/bot/pause
```

#### Trades
```
GET /api/trades?limit=50
GET /api/trades/:tradeId
POST /api/trades/:tradeId/close
```

#### Market Data
```
GET /api/market/:symbol
POST /api/market/multiple
```

#### Settings
```
GET /api/settings
PUT /api/settings
```

#### Performance
```
GET /api/performance
```

#### Logs
```
GET /api/logs?limit=100
```

#### AI Decisions
```
GET /api/ai/decisions?limit=50
```

#### Health
```
GET /api/health
```

### Configuración del Servidor

Por defecto, la aplicación se conecta a `http://localhost:5000/api`. Para cambiar:

1. Editar `src/services/api.ts`
2. Cambiar `baseURL` en la clase `BotAPIService`

## 🎨 Tema de Colores

### Colores Principales
- **Primario**: #1E90FF (Azul)
- **Éxito**: #51CF66 (Verde)
- **Error**: #FF6B6B (Rojo)
- **Warning**: #FFD43B (Amarillo)

### Tema Oscuro
- **Fondo**: #0A0E27
- **Superficie**: #1A1F3A
- **Texto Primario**: #FFFFFF
- **Texto Secundario**: #B0B5C1

## 🧪 Testing

El proyecto está listo para integrarse con testing frameworks como Jest y React Native Testing Library.

## 📝 Variables de Entorno

Para desarrollo local, crea un archivo `.env`:

```
API_BASE_URL=http://localhost:5000/api
ENVIRONMENT=development
LOG_LEVEL=debug
```

## 🐛 Troubleshooting

### La app no conecta al servidor
- Verifica que el backend está corriendo en `localhost:5000`
- En Android/iOS físicos, usa la IP local (ej: `http://192.168.x.x:5000`)
- Comprueba que el firewall no bloquea las conexiones

### Error de dependencias
```bash
# Reinstala las dependencias
rm -rf node_modules package-lock.json
npm install
```

### Error en Android
```bash
# Limpia el caché de Android
rm -rf android/.gradle
npm run android -- --clear-cache
```

## 📚 Recursos

- [React Native Docs](https://reactnative.dev/)
- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Zustand](https://zustand-demo.vercel.app/)

## 🤝 Próximos Pasos

### Fase 1: Implementación Básica ✅
- ✅ Estructura del proyecto
- ✅ Componentes UI
- ✅ Navegación
- ✅ Estado global

### Fase 2: Integración Backend (Siguiente)
- [ ] Conectar API endpoints
- [ ] Implementar autenticación
- [ ] WebSocket para datos en tiempo real
- [ ] Notificaciones push

### Fase 3: Características Avanzadas
- [ ] Gráficos de trading en tiempo real
- [ ] Alertas personalizadas
- [ ] Análisis técnico en la app
- [ ] Modo offline

## 📄 Licencia

Este proyecto es propietario. Todos los derechos reservados.

## 👨‍💻 Desarrollo

**Creado**: 27 de Diciembre de 2025  
**Rama actual**: main  
**Estado**: En desarrollo activo

---

**Nota**: Este es un proyecto ambicioso que requiere:
1. Backend robusto con IA
2. Pruebas exhaustivas
3. Validación regulatoria
4. Gestión profesional de riesgos
