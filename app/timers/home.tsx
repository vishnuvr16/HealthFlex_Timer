"use client"

import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import type { StackNavigationProp } from "@react-navigation/stack"
import type React from "react"
import { useCallback, useEffect, useRef, useState } from "react"
import { Alert, Animated, FlatList, RefreshControl, StyleSheet, TouchableOpacity, View } from "react-native"

import { useTheme } from "../../hooks/useTheme"
import { useTimerContext } from "../../hooks/useTimerContext"
import type { Timer } from "../../types"

import CategoryFilter from "../../components/CategoryFilter"
import CompletionModal from "../../components/CompletionModal"
import EmptyState from "../../components/EmptyState"
import TimerItem from "../../components/TimerItem"

export default function HomeScreen(): React.ReactElement {
  const navigation = useNavigation<StackNavigationProp<any>>()
  const { state, dispatch } = useTimerContext()
  const { theme, isDarkMode, toggleTheme } = useTheme()
  const fadeAnim = useRef(new Animated.Value(0)).current

  const [completedTimer, setCompletedTimer] = useState<Timer | null>(null)
  const [refreshing, setRefreshing] = useState<boolean>(false)
  const [showCompletionModal, setShowCompletionModal] = useState<boolean>(false)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [categories, setCategories] = useState<string[]>([])

  // Extract unique categories from timers
  useEffect(() => {
    const uniqueCategories = ["all", ...new Set(state.timers.map((timer) => timer.category))]
    setCategories(uniqueCategories)

    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start()
  }, [state.timers, fadeAnim])

  // Timer logic
  useEffect(() => {
    const interval = setInterval(() => {
      state.timers.forEach((timer) => {
        if (timer.status === "running" && timer.remainingTime > 0) {
          dispatch({
            type: "UPDATE_REMAINING_TIME",
            payload: {
              id: timer.id,
              remainingTime: timer.remainingTime - 1,
            },
          })

          // Check for halfway alert
          if (timer.halfwayAlert && timer.remainingTime === Math.floor(timer.duration / 2)) {
            Alert.alert("Halfway Point", `You're halfway through "${timer.name}"!`)
          }

          // Check if timer completed
          if (timer.remainingTime === 1) {
            dispatch({ type: "COMPLETE_TIMER", payload: timer.id })
            setCompletedTimer(timer)
            setShowCompletionModal(true)
          }
        }
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [state.timers, dispatch])

  // Filter timers based on selected category
  const filteredTimers =
    selectedCategory === "all" ? state.timers : state.timers.filter((timer) => timer.category === selectedCategory)

  const onRefresh = useCallback((): void => {
    setRefreshing(true)
    // Simulate a refresh
    setTimeout(() => {
      setRefreshing(false)
    }, 1000)
  }, [])

  // Start all visible timers
  const startAllTimers = () => {
    if (filteredTimers.length === 0) return

    if (selectedCategory === "all") {
      state.timers.forEach((timer) => {
        if (timer.status !== "completed") {
          dispatch({ type: "START_TIMER", payload: timer.id })
        }
      })
    } else {
      dispatch({ type: "START_CATEGORY_TIMERS", payload: selectedCategory })
    }
  }

  // Pause all visible timers
  const pauseAllTimers = () => {
    if (filteredTimers.length === 0) return

    if (selectedCategory === "all") {
      state.timers.forEach((timer) => {
        if (timer.status === "running") {
          dispatch({ type: "PAUSE_TIMER", payload: timer.id })
        }
      })
    } else {
      dispatch({ type: "PAUSE_CATEGORY_TIMERS", payload: selectedCategory })
    }
  }

  // Reset all visible timers
  const resetAllTimers = () => {
    if (filteredTimers.length === 0) return

    if (selectedCategory === "all") {
      state.timers.forEach((timer) => {
        dispatch({ type: "RESET_TIMER", payload: timer.id })
      })
    } else {
      dispatch({ type: "RESET_CATEGORY_TIMERS", payload: selectedCategory })
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Top action bar */}
      <View style={styles.actionBar}>
        <TouchableOpacity style={[styles.themeToggle, { backgroundColor: theme.card }]} onPress={toggleTheme}>
          <Ionicons name={isDarkMode ? "sunny" : "moon"} size={22} color={theme.text} />
        </TouchableOpacity>

        <View style={styles.bulkActions}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.success + "20" }]}
            onPress={startAllTimers}
          >
            <Ionicons name="play" size={20} color={theme.success} />
            {/* <Text style={[styles.actionText, { color: theme.success }]}>Start All</Text> */}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.warning + "20" }]}
            onPress={pauseAllTimers}
          >
            <Ionicons name="pause" size={20} color={theme.warning} />
            {/* <Text style={[styles.actionText, { color: theme.warning }]}>Pause All</Text> */}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.info + "20" }]}
            onPress={resetAllTimers}
          >
            <Ionicons name="refresh" size={20} color={theme.info} />
            {/* <Text style={[styles.actionText, { color: theme.info }]}>Reset All</Text> */}
          </TouchableOpacity>
        </View>
      </View>

      {/* Category filter */}
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        theme={theme}
      />

      {/* Timer list */}
      {state.timers.length === 0 ? (
        <EmptyState icon="timer-outline" message="No timers yet. Tap the + button to create one!" theme={theme} />
      ) : filteredTimers.length === 0 ? (
        <EmptyState
          icon="filter-outline"
          message="No timers in this category. Try selecting a different category or create a new timer."
          theme={theme}
        />
      ) : (
        <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
          <FlatList
            data={filteredTimers}
            keyExtractor={(item) => item.id}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            renderItem={({ item }) => <TimerItem timer={item} dispatch={dispatch} theme={theme} />}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        </Animated.View>
      )}

      {/* Add button */}
      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: theme.primary }]}
        onPress={() => navigation.navigate("AddTimer")}
      >
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>

      {/* Completion Modal */}
      <CompletionModal
        visible={showCompletionModal}
        timer={completedTimer}
        onClose={() => setShowCompletionModal(false)}
        theme={theme}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  actionBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  themeToggle: {
    padding: 8,
    borderRadius: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  bulkActions: {
    flexDirection: "row",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 16,
    marginLeft: 8,
  },
  actionText: {
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 90,
    paddingTop: 8,
  },
})
