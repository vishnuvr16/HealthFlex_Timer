"use client"

import { Ionicons } from "@expo/vector-icons"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import type React from "react"
import { StatusBar, StyleSheet, View } from "react-native"
import { SafeAreaProvider } from "react-native-safe-area-context"

// Providers
import { ThemeProvider, useTheme } from "../hooks/useTheme"
import { TimerProvider } from "../hooks/useTimerContext"

// Screens
import HistoryScreen from "./history"
import TimersScreen from "./timers/index"

const Tab = createBottomTabNavigator()

function AppContent(): React.ReactElement {
  const { theme } = useTheme()

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar
        barStyle={theme.background === "#FFFFFF" ? "dark-content" : "light-content"}
        backgroundColor={theme.background}
      />
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: true,
            tabBarIcon: ({ focused, color, size }) => {
              let iconName: keyof typeof Ionicons.glyphMap = "timer-outline"

              if (route.name === "Timers") {
                iconName = focused ? "timer" : "timer-outline"
              } else if (route.name === "History") {
                iconName = focused ? "time" : "time-outline"
              }

              return <Ionicons name={iconName} size={size} color={color} />
            },
            tabBarActiveTintColor: theme.primary,
            tabBarInactiveTintColor: theme.text + "80",
            tabBarStyle: {
              backgroundColor: theme.background,
              borderTopColor: theme.border,
              elevation: 8,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: -2 },
              shadowOpacity: 0.1,
              shadowRadius: 3,
              height: 60,
              paddingBottom: 8,
            },
            tabBarLabelStyle: {
              fontSize: 12,
              fontWeight: "500",
            },
            headerStyle: {
              backgroundColor: theme.background,
              elevation: 4,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 3,
              height: 60,
            },
            headerTitleStyle: {
              color: theme.text,
              fontWeight: "bold",
              fontSize: 18,
            },
          })}
        >
          <Tab.Screen
            name="Timers"
            component={TimersScreen}
            options={{
              headerShown: false,
            }}
          />
          <Tab.Screen
            name="History"
            component={HistoryScreen}
            options={{
              title: "Timer History",
              headerTitleAlign: "center",
            }}
          />
        </Tab.Navigator>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

export default function App(): React.ReactElement {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <TimerProvider>
          <AppContent />
        </TimerProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  )
}
