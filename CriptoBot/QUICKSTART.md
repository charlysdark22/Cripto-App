# 🚀 Quick Start Guide - CriptoBot

## Instalación Rápida (5 minutos)

### 1. Navega al directorio

```bash
cd /home/charly/Descargas/Cripto-App/CriptoBot
```

### 2. Instala las dependencias (si aún no lo has hecho)

```bash
npm install
```

### 3. Inicia la aplicación

**Opción A: Con Expo Go (Más fácil)**
```bash
expo start
# Abre Expo Go en tu teléfono
# Escanea el código QR que aparece
```

**Opción B: Android con emulador**
```bash
npm run android
# O
expo run android
```

**Opción C: iOS (requiere macOS)** 
```bash
npm run ios
# O
expo run ios
```

**Opción D: Web (navegador)**
```bash
npm run web
# Se abrirá en http://localhost:19006
```

---

## 📁 Estructura Principal

```
src/
├── screens/          # Pantallas de la app
├── components/       # Componentes reutilizables
├── services/         # Llamadas a API
├── context/          # Estado global (Zustand)
├── types/            # TypeScript interfaces
├── constants/        # Colores, tamaños
└── navigation/       # Configuración de tabs
```

---

## 🔗 Conectar a un Backend

### Paso 1: Editar la URL del servidor

Abre `src/services/api.ts` y cambia:

```typescript
private baseURL: string = 'http://localhost:5000/api';
// Cambiar a tu servidor backend
```

### Paso 2: Crear un servidor backend simple (Python + Flask)

```python
# backend.py
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({"status": "ok"}), 200

@app.route('/api/bot/status', methods=['GET'])
def bot_status():
    return jsonify({
        "id": "bot-001",
        "name": "Trading Bot",
        "isActive": True,
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
        "lastTrade": None
    }), 200

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
```

```bash
# Instalar dependencias
pip install flask flask-cors

# Ejecutar servidor
python backend.py
```

---

## 📱 Pantallas Disponibles

### 1. **Home (Inicio)**
- Estado del bot en vivo
- Botones de control (iniciar/detener)
- Métricas principales
- Última operación

### 2. **Trades (Operaciones)**
- Lista de todas las operaciones
- Filtrar por estado
- Detalles de cada trade
- Cerrar operaciones manualmente

### 3. **Analytics (Análisis)**
- Métricas de rendimiento
- Gráficos de ganancias
- Ratios de riesgo/recompensa
- Análisis profundo

### 4. **Settings (Configuración)**
- Conexión con broker
- Parámetros de riesgo
- Preferencias de notificaciones
- Configuración de API

---

## 🔄 Flujo de Datos

```
User Action (tap button)
    ↓
Component (Button component triggers onPress)
    ↓
Service (botAPIService.startBot())
    ↓
Backend API (POST /api/bot/start)
    ↓
Backend (procesa la solicitud)
    ↓
Response (JSON)
    ↓
Store (useBotStore.setBotStatus())
    ↓
Component Re-render (muestra nuevos datos)
```

---

## 🛠️ Comandos Útiles

```bash
# Instalar dependencias
npm install

# Iniciar en desarrollo
expo start

# Limpiar caché
expo start --clear

# Ver logs en tiempo real
expo logs

# Compilar para Android
eas build -p android

# Compilar para iOS (macOS)
eas build -p ios

# Ejecutar tests
npm test

# Linter
npm run lint
```

---

## 🐛 Solución de Problemas

### "Cannot connect to API"
- Verifica que el backend está corriendo
- Cambia `localhost` por `127.0.0.1` o tu IP local
- En móvil físico, usa `http://192.168.x.x:5000`

### "Module not found"
```bash
# Reinstala todo
rm -rf node_modules
npm install
```

### Cambios no se reflejan
```bash
# Limpia el caché de Expo
expo start --clear
```

### Error en Android
```bash
# Limpia caché de gradle
rm -rf android/.gradle
npm run android
```

---

## 📚 Documentación Completa

Para más detalles, consulta:
- `README.md` - Información general del proyecto
- `BACKEND_API.md` - Especificación completa de API
- `DEVELOPMENT_GUIDE.md` - Guía de desarrollo del backend

---

## 💡 Tips de Desarrollo

1. **Usar expo-router**: La navegación ya está configurada con React Navigation
2. **TypeScript**: El proyecto usa TypeScript - revisa `src/types/index.ts`
3. **Zustand**: Gestión de estado - consulta `src/context/botStore.ts`
4. **AsyncStorage**: Datos persistentes en el dispositivo
5. **Testing**: Prepara tests con Jest y React Native Testing Library

---

## 🎯 Próximos Pasos

1. **Configura un backend** (Flask, FastAPI, Express, etc)
2. **Implementa autenticación** (JWT, OAuth)
3. **Conecta un broker real** (Interactive Brokers, Binance, etc)
4. **Entrena modelos de IA** (LSTM, DQN)
5. **Despliega a producción** (AppStore, PlayStore, EAS Build)

---

## 📞 Support

Si encuentras problemas:
1. Revisa la documentación
2. Busca en GitHub Issues
3. Consulta el error en Stack Overflow
4. Abre un issue en el repositorio

---

**¡Listo para empezar! 🚀**
