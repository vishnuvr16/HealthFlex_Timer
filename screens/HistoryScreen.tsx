"use client"

import { Ionicons } from "@expo/vector-icons"
import React, { useState } from "react"
import { Alert, FlatList, Share, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { useTheme } from "../context/ThemeContext"
import { useTimerContext } from "../context/TimerContext"

// Define context types that match what's actually coming from your context providers
type TimerHistoryItem = {
  id: string;
  name: string;
  category: string;
  duration: number;
  completedAt: string;
}

type TimerState = {
  history: TimerHistoryItem[];
}

// We're not defining the full context type here, just what we use
type TimerContextProps = {
  state: TimerState;
}

type ThemeContextProps = {
  theme: {
    background: string;
    text: string;
    card: string;
    border: string;
    primary: string;
  };
  isDarkMode: boolean;
  toggleTheme: () => void;
}

type DateGroup = {
  date: string;
  items: TimerHistoryItem[];
}

export default function HistoryScreen(): React.ReactElement {
  // Use any to bypass the type checking since we know the structure
  const { state } = useTimerContext() as any;
  const { theme, isDarkMode, toggleTheme } = useTheme() as any;
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  // Get unique categories from history
  const history: TimerHistoryItem[] = state.history || [];
  const categories: string[] = ["all", ...Array.from(new Set(history.map((timer) => timer.category)))];

  // Filter history based on selected category
  const filteredHistory: TimerHistoryItem[] =
    selectedFilter === "all" ? history : history.filter((timer) => timer.category === selectedFilter);

  // Format duration for display
  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    let result = "";
    if (hours > 0) result += `${hours}h `;
    if (minutes > 0) result += `${minutes}m `;
    if (remainingSeconds > 0 || result === "") result += `${remainingSeconds}s`;

    return result;
  };

  // Export history data
  const exportData = async (): Promise<void> => {
    try {
      const jsonData = JSON.stringify(history, null, 2);
      await Share.share({
        message: jsonData,
        title: "Timer History Data",
      });
    } catch (error) {
      Alert.alert("Error", "Failed to export data");
    }
  };

  // Group history by date
  const groupHistoryByDate = (): DateGroup[] => {
    const grouped: Record<string, TimerHistoryItem[]> = {};

    filteredHistory.forEach((item) => {
      const date = new Date(item.completedAt).toDateString();
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(item);
    });

    return Object.keys(grouped)
      .map((date) => ({
        date,
        items: grouped[date].sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()),
      }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const groupedHistory = groupHistoryByDate();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Timer History</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={[styles.iconButton, { backgroundColor: theme.card }]} onPress={toggleTheme}>
            <Ionicons name={isDarkMode ? "sunny" : "moon"} size={22} color={theme.text} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.iconButton, { backgroundColor: theme.card }]} onPress={exportData}>
            <Ionicons name="share-outline" size={22} color={theme.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Category filter */}
      <View style={styles.filterContainer}>
        <FlatList
          data={categories}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.filterChip,
                {
                  backgroundColor: selectedFilter === item ? theme.primary : theme.card,
                  borderColor: theme.border,
                },
              ]}
              onPress={() => setSelectedFilter(item)}
            >
              <Text style={[styles.filterChipText, { color: selectedFilter === item ? "white" : theme.text }]}>
                {item === "all" ? "All Categories" : item}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.filterList}
        />
      </View>

      {/* History list */}
      {history.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="time-outline" size={64} color={theme.text} />
          <Text style={[styles.emptyStateText, { color: theme.text }]}>
            No completed timers yet. Complete a timer to see it here!
          </Text>
        </View>
      ) : filteredHistory.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="filter-outline" size={64} color={theme.text} />
          <Text style={[styles.emptyStateText, { color: theme.text }]}>No timers found for this category.</Text>
        </View>
      ) : (
        <FlatList
          data={groupedHistory}
          keyExtractor={(item) => item.date}
          renderItem={({ item }) => (
            <View style={styles.dateGroup}>
              <Text style={[styles.dateHeader, { color: theme.text }]}>
                {new Date(item.date).toLocaleDateString(undefined, {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Text>
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
                    <View style={[styles.categoryBadge, { backgroundColor: `${theme.primary}20` }]}>
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
                      <Ionicons name="calendar-outline" size={16} color={theme.text} />
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
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  headerActions: {
    flexDirection: "row",
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  filterContainer: {
    marginBottom: 16,
  },
  filterList: {
    paddingHorizontal: 16,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
  filterChipText: {
    fontWeight: "500",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 16,
  },
  historyList: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  dateGroup: {
    marginBottom: 16,
  },
  dateHeader: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  historyItem: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
  },
  historyItemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  historyItemName: {
    fontSize: 16,
    fontWeight: "bold",
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
    marginLeft: 4,
    fontSize: 14,
  },
});