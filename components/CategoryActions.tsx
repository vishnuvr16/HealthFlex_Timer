import { Ionicons } from "@expo/vector-icons"
import type React from "react"
import { StyleSheet, TouchableOpacity, View } from "react-native"
import type { ThemeColors, TimerAction } from "../types"

interface CategoryActionsProps {
  category: string
  dispatch: React.Dispatch<TimerAction>
  theme: ThemeColors
}

export default function CategoryActions({ category, dispatch, theme }: CategoryActionsProps) {
  // Handle bulk actions
  const handleStartAll = (): void => {
    dispatch({ type: "START_CATEGORY_TIMERS", payload: category })
  }

  const handlePauseAll = (): void => {
    dispatch({ type: "PAUSE_CATEGORY_TIMERS", payload: category })
  }

  const handleResetAll = (): void => {
    dispatch({ type: "RESET_CATEGORY_TIMERS", payload: category })
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.actionButton, { backgroundColor: theme.success + "20" }]}
        onPress={handleStartAll}
      >
        <Ionicons name="play" size={16} color={theme.success} />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.actionButton, { backgroundColor: theme.warning + "20" }]}
        onPress={handlePauseAll}
      >
        <Ionicons name="pause" size={16} color={theme.warning} />
      </TouchableOpacity>

      <TouchableOpacity style={[styles.actionButton, { backgroundColor: theme.info + "20" }]} onPress={handleResetAll}>
        <Ionicons name="refresh" size={16} color={theme.info} />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
})
