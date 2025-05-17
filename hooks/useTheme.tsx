"use client"

import AsyncStorage from "@react-native-async-storage/async-storage"
import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useColorScheme } from "react-native"
import Colors from "../constants/Colors"
import type { ThemeColors, ThemeContextType } from "../types"

// Create context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

// Provider component
export function ThemeProvider({ children }: { children: ReactNode }) {
  const deviceTheme = useColorScheme()
  const [isDarkMode, setIsDarkMode] = useState(deviceTheme === "dark")
  const [theme, setTheme] = useState<ThemeColors>(isDarkMode ? Colors.dark : Colors.light)

  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem("themePreference")
        if (savedTheme !== null) {
          setIsDarkMode(savedTheme === "dark")
        }
      } catch (error) {
        console.error("Failed to load theme preference", error)
      }
    }

    loadThemePreference()
  }, [])

  useEffect(() => {
    setTheme(isDarkMode ? Colors.dark : Colors.light)

    const saveThemePreference = async () => {
      try {
        await AsyncStorage.setItem("themePreference", isDarkMode ? "dark" : "light")
      } catch (error) {
        console.error("Failed to save theme preference", error)
      }
    }

    saveThemePreference()
  }, [isDarkMode])

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  return <ThemeContext.Provider value={{ theme, isDarkMode, toggleTheme }}>{children}</ThemeContext.Provider>
}

// Custom hook to use the theme context
export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
