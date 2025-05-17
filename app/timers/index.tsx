"use client"

import { createStackNavigator } from "@react-navigation/stack"
import type React from "react"
import { useTheme } from "../../hooks/useTheme"

import AddTimerScreen from "./add-timer"
import HomeScreen from "./home"

const Stack = createStackNavigator()

export default function TimersNavigator(): React.ReactElement {
  const { theme } = useTheme()

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.background,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: theme.border,
        },
        headerTitleStyle: {
          color: theme.text,
          fontWeight: "bold",
        },
        headerTintColor: theme.primary,
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "My Timers",
          headerTitleAlign: "center"
        }}
      />
      <Stack.Screen
        name="AddTimer"
        component={AddTimerScreen}
        options={{
          title: "Create New Timer",
        }}
      />
    </Stack.Navigator>
  )
}
