import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { colors, SIZES } from '../constants';
import { HomeScreen, TradesScreen, AnalyticsScreen, SettingsScreen } from '../screens';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const HomeStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen name="HomeMain" component={HomeScreen} />
  </Stack.Navigator>
);

const TradesStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen name="TradesMain" component={TradesScreen} />
  </Stack.Navigator>
);

const AnalyticsStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen name="AnalyticsMain" component={AnalyticsScreen} />
  </Stack.Navigator>
);

const SettingsStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen name="SettingsMain" component={SettingsScreen} />
  </Stack.Navigator>
);

const BottomTabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ focused, color, size }) => {
        let iconName: 'home' | 'trending-up' | 'bar-chart' | 'settings' = 'home';

        if (route.name === 'Home') iconName = 'home';
        else if (route.name === 'Trades') iconName = 'trending-up';
        else if (route.name === 'Analytics') iconName = 'bar-chart';
        else if (route.name === 'Settings') iconName = 'settings';

        return <MaterialIcons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.textTertiary,
      tabBarStyle: {
        backgroundColor: colors.surface,
        borderTopColor: colors.border,
        borderTopWidth: 1,
        height: SIZES.tabHeight,
        paddingBottom: 8,
        paddingTop: 8,
      },
      tabBarLabelStyle: {
        fontSize: SIZES.fontSM,
        fontWeight: '500',
        marginTop: 4,
      },
    })}
  >
    <Tab.Screen
      name="Home"
      component={HomeStack}
      options={{ title: 'Inicio' }}
    />
    <Tab.Screen
      name="Trades"
      component={TradesStack}
      options={{ title: 'Operaciones' }}
    />
    <Tab.Screen
      name="Analytics"
      component={AnalyticsStack}
      options={{ title: 'Análisis' }}
    />
    <Tab.Screen
      name="Settings"
      component={SettingsStack}
      options={{ title: 'Configuración' }}
    />
  </Tab.Navigator>
);

export const RootNavigator = () => (
  <NavigationContainer>
    <BottomTabNavigator />
  </NavigationContainer>
);
