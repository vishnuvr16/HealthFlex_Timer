"use client"

import { Ionicons } from "@expo/vector-icons"
import type React from "react"
import { useRef, useState } from "react"
import { Alert, Animated, FlatList, Share, StyleSheet, Text, TouchableOpacity, View } from "react-native"

import { useFormatTime } from "../hooks/useFormatTime"
import { useTheme } from "../hooks/useTheme"
import { useTimerContext } from "../hooks/useTimerContext"
import type { TimerHistory } from "../types"

import CategoryFilter from "../components/CategoryFilter"
import EmptyState from "../components/EmptyState"

interface DateGroup {
  date: string
  items: TimerHistory[]
}

export default function HistoryScreen(): React.ReactElement {
  const { state } = useTimerContext()
  const { theme, isDarkMode, toggleTheme } = useTheme()
  const { formatDuration } = useFormatTime()
  const [selectedFilter, setSelectedFilter] = useState<string>("all")
  const fadeAnim = useRef(new Animated.Value(1)).current

  // Get unique categories from history
  const categories = ["all", ...new Set(state.history.map((timer) => timer.category))]

  // Filter history based on selected category
  const filteredHistory =
    selectedFilter === "all" ? state.history : state.history.filter((timer) => timer.category === selectedFilter)

  // Export history data
  const exportData = async (): Promise<void> => {
    try {
      const jsonData = JSON.stringify(state.history, null, 2)
      await Share.share({
        message: jsonData,
        title: "Timer History Data",
      })
    } catch (error) {
      Alert.alert("Error", "Failed to export data")
    }
  }

  // Group history by date
  const groupHistoryByDate = (): DateGroup[] => {
    const grouped: Record<string, TimerHistory[]> = {}

    filteredHistory.forEach((item) => {
      const date = new Date(item.completedAt).toDateString()
      if (!grouped[date]) {
        grouped[date] = []
      }
      grouped[date].push(item)
    })

    return Object.keys(grouped)
      .map((date) => ({
        date,
        items: grouped[date].sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()),
      }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  const groupedHistory = groupHistoryByDate()

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header Actions */}
      <View style={[styles.headerActions,styles.give_gap]}>
        <TouchableOpacity style={[styles.iconButton, { backgroundColor: theme.card }]} onPress={toggleTheme}>
          <Ionicons name={isDarkMode ? "sunny" : "moon"} size={22} color={theme.text} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.iconButton, { backgroundColor: theme.card }]}
          onPress={exportData}
          disabled={state.history.length === 0}
        >
          <Ionicons
            name="share-outline"
            size={22}
            color={state.history.length === 0 ? theme.text + "40" : theme.text}
          />
        </TouchableOpacity>
      </View>

      {/* Category filter */}
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedFilter}
        onSelectCategory={setSelectedFilter}
        theme={theme}
      />

      {/* History list */}
      {state.history.length === 0 ? (
        <EmptyState
          icon="time-outline"
          message="No completed timers yet. Complete a timer to see it here!"
          theme={theme}
        />
      ) : filteredHistory.length === 0 ? (
        <EmptyState icon="filter-outline" message="No timers found for this category." theme={theme} />
      ) : (
        <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
          <FlatList
            data={groupedHistory}
            keyExtractor={(item) => item.date}
            renderItem={({ item }) => (
              <View style={styles.dateGroup}>
                <View style={[styles.dateHeader, { borderBottomColor: theme.border }]}>
                  <Ionicons name="calendar-outline" size={18} color={theme.primary} style={styles.dateIcon} />
                  <Text style={[styles.dateHeaderText,styles.margin, { color: theme.text }]}>
                    {new Date(item.date).toLocaleDateString(undefined, {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </Text>
                </View>
                {item.items.map((timer) => (
                  <View
                    key={timer.id}
                    style={[
                      styles.historyItem,
                      {
                        backgroundColor: theme.card,
                        borderColor: theme.border,
                      },
                    ]}
                  >
                    <View style={styles.historyItemHeader}>
                      <Text style={[styles.historyItemName, { color: theme.text }]}>{timer.name}</Text>
                      <View style={[styles.categoryBadge, { backgroundColor: theme.primary + "20" }]}>
                        <Text style={[styles.categoryBadgeText, { color: theme.primary }]}>{timer.category}</Text>
                      </View>
                    </View>

                    <View style={styles.historyItemDetails}>
                      <View style={styles.historyItemDetail}>
                        <Ionicons name="time-outline" size={16} color={theme.text} />
                        <Text style={[styles.historyItemDetailText, { color: theme.text }]}>
                          {formatDuration(timer.duration)}
                        </Text>
                      </View>

                      <View style={styles.historyItemDetail}>
                        <Ionicons name="checkmark-circle-outline" size={16} color={theme.success} />
                        <Text style={[styles.historyItemDetailText, { color: theme.text }]}>
                          {new Date(timer.completedAt).toLocaleTimeString()}
                        </Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            )}
            contentContainerStyle={styles.historyList}
            showsVerticalScrollIndicator={false}
          />
        </Animated.View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  give_gap:{
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between"
  },
  headerActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  historyList: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  dateGroup: {
    marginBottom: 24,
  },
  margin: {
    margin: 12,
  },
  dateHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
  },
  dateIcon: {
    marginRight: 8,
  },
  dateHeaderText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  historyItem: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  historyItemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  historyItemName: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
    marginRight: 8,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryBadgeText: {
    fontSize: 12,
    fontWeight: "500",
  },
  historyItemDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  historyItemDetail: {
    flexDirection: "row",
    alignItems: "center",
  },
  historyItemDetailText: {
    marginLeft: 6,
    fontSize: 14,
  },
})
