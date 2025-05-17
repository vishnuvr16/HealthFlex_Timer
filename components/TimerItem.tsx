import { Ionicons } from "@expo/vector-icons"
import type React from "react"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { useFormatTime } from "../hooks/useFormatTime"
import type { ThemeColors, Timer, TimerAction } from "../types"
import ProgressBar from "./ProgressBar"

interface TimerItemProps {
  timer: Timer
  dispatch: React.Dispatch<TimerAction>
  theme: ThemeColors
}

export default function TimerItem({ timer, dispatch, theme }: TimerItemProps) {
  const { formatTimeDisplay } = useFormatTime()

  // Calculate progress percentage
  const calculateProgress = (): number => {
    return (timer.duration - timer.remainingTime) / timer.duration
  }

  // Handle timer actions
  const handleStart = (): void => {
    dispatch({ type: "START_TIMER", payload: timer.id })
  }

  const handlePause = (): void => {
    dispatch({ type: "PAUSE_TIMER", payload: timer.id })
  }

  const handleReset = (): void => {
    dispatch({ type: "RESET_TIMER", payload: timer.id })
  }

  // Determine status color
  const getStatusColor = (): string => {
    switch (timer.status) {
      case "running":
        return theme.success
      case "paused":
        return theme.warning
      case "completed":
        return theme.info
      default:
        return theme.text
    }
  }

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.card,
          borderColor: theme.border,
        },
      ]}
    >
      <View style={styles.header}>
        <Text style={[styles.name, { color: theme.text }]}>{timer.name}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor() + "20" }]}>
          <Text style={[styles.statusText, { color: getStatusColor() }]}>
            {timer.status.charAt(0).toUpperCase() + timer.status.slice(1)}
          </Text>
        </View>
      </View>

      <View style={styles.timeContainer}>
        <Text style={[styles.timeText, { color: theme.text }]}>{formatTimeDisplay(timer.remainingTime)}</Text>
        <Text style={[styles.totalTime, { color: theme.text + "80" }]}>/ {formatTimeDisplay(timer.duration)}</Text>
      </View>

      <ProgressBar
        progress={calculateProgress()}
        backgroundColor={theme.progressBackground}
        fillColor={timer.status === "completed" ? theme.success : theme.progressFill}
      />

      <View style={styles.controls}>
        {timer.status !== "completed" && (
          <>
            {timer.status === "paused" ? (
              <TouchableOpacity
                style={[styles.controlButton, { backgroundColor: theme.success + "20" }]}
                onPress={handleStart}
              >
                <Ionicons name="play" size={20} color={theme.success} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.controlButton, { backgroundColor: theme.warning + "20" }]}
                onPress={handlePause}
              >
                <Ionicons name="pause" size={20} color={theme.warning} />
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.controlButton, { backgroundColor: theme.info + "20" }]}
              onPress={handleReset}
            >
              <Ionicons name="refresh" size={20} color={theme.info} />
            </TouchableOpacity>
          </>
        )}

        {timer.halfwayAlert && (
          <View style={[styles.alertIndicator, { backgroundColor: theme.warning + "20" }]}>
            <Ionicons name="notifications-outline" size={16} color={theme.warning} />
          </View>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 8,
  },
  timeText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  totalTime: {
    fontSize: 14,
    marginLeft: 4,
  },
  controls: {
    flexDirection: "row",
    marginTop: 12,
  },
  controlButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  alertIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: "auto",
  },
})
