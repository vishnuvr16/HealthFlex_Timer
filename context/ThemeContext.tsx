"use client"

import AsyncStorage from "@react-native-async-storage/async-storage"
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react"
import { useColorScheme } from "react-native"

type Theme = {
  background: string
  card: string
  text: string
  border: string
  primary: string
  secondary: string
  success: string
  danger: string
  warning: string
  info: string
  progressBackground: string
  progressFill: string
}

type ThemeContextType = {
  theme: Theme
  isDarkMode: boolean
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

const lightTheme: Theme = {
  background: "#FFFFFF",
  card: "#F3F4F6",
  text: "#1F2937",
  border: "#E5E7EB",
  primary: "#6366F1",
  secondary: "#8B5CF6",
  success: "#10B981",
  danger: "#EF4444",
  warning: "#F59E0B",
  info: "#3B82F6",
  progressBackground: "#E5E7EB",
  progressFill: "#6366F1",
}

const darkTheme: Theme = {
  background: "#1F2937",
  card: "#374151",
  text: "#F9FAFB",
  border: "#4B5563",
  primary: "#818CF8",
  secondary: "#A78BFA",
  success: "#34D399",
  danger: "#F87171",
  warning: "#FBBF24",
  info: "#60A5FA",
  progressBackground: "#4B5563",
  progressFill: "#818CF8",
}

type ThemeProviderProps = {
  children: ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const deviceTheme = useColorScheme()
  const [isDarkMode, setIsDarkMode] = useState(deviceTheme === "dark")
  const [theme, setTheme] = useState<Theme>(isDarkMode ? darkTheme : lightTheme)

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
    setTheme(isDarkMode ? darkTheme : lightTheme)

    const saveThemePreference = async () => {
      try {
        await AsyncStorage.setItem(
          "themePreference",
          isDarkMode ? "dark" : "light"
        )
      } catch (error) {
        console.error("Failed to save theme preference", error)
      }
    }

    saveThemePreference()
  }, [isDarkMode])

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev)
  }

  return (
    <ThemeContext.Provider value={{ theme, isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
