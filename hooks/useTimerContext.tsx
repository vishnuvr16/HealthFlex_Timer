"use client"

import AsyncStorage from "@react-native-async-storage/async-storage"
import { createContext, useContext, useEffect, useReducer, type ReactNode } from "react"
import type { TimerAction, TimerContextType, TimerHistory, TimerState } from "../types"

// Initial state
const initialState: TimerState = {
  timers: [],
  history: [],
  isLoading: true,
}

// Create context
const TimerContext = createContext<TimerContextType | undefined>(undefined)

// Reducer function
function timerReducer(state: TimerState, action: TimerAction): TimerState {
  switch (action.type) {
    case "INITIALIZE":
      return {
        ...state,
        timers: action.payload.timers,
        history: action.payload.history,
        isLoading: false,
      }
    case "ADD_TIMER":
      return {
        ...state,
        timers: [...state.timers, action.payload],
      }
    case "UPDATE_TIMER":
      return {
        ...state,
        timers: state.timers.map((timer) => (timer.id === action.payload.id ? action.payload : timer)),
      }
    case "DELETE_TIMER":
      return {
        ...state,
        timers: state.timers.filter((timer) => timer.id !== action.payload),
      }
    case "COMPLETE_TIMER": {
      const completedTimer = state.timers.find((timer) => timer.id === action.payload)
      if (!completedTimer) return state

      const updatedTimers = state.timers.map((timer) =>
        timer.id === action.payload ? { ...timer, status: "completed" as const, remainingTime: 0 } : timer,
      )

      const historyEntry: TimerHistory = {
        ...completedTimer,
        completedAt: new Date().toISOString(),
        id: `history-${Date.now()}`,
      }

      return {
        ...state,
        timers: updatedTimers,
        history: [...state.history, historyEntry],
      }
    }
    case "START_TIMER":
      return {
        ...state,
        timers: state.timers.map((timer) =>
          timer.id === action.payload ? { ...timer, status: "running" as const } : timer,
        ),
      }
    case "PAUSE_TIMER":
      return {
        ...state,
        timers: state.timers.map((timer) =>
          timer.id === action.payload ? { ...timer, status: "paused" as const } : timer,
        ),
      }
    case "RESET_TIMER":
      return {
        ...state,
        timers: state.timers.map((timer) =>
          timer.id === action.payload ? { ...timer, status: "paused" as const, remainingTime: timer.duration } : timer,
        ),
      }
    case "UPDATE_REMAINING_TIME":
      return {
        ...state,
        timers: state.timers.map((timer) =>
          timer.id === action.payload.id ? { ...timer, remainingTime: action.payload.remainingTime } : timer,
        ),
      }
    case "START_CATEGORY_TIMERS":
      return {
        ...state,
        timers: state.timers.map((timer) =>
          timer.category === action.payload && timer.status !== "completed"
            ? { ...timer, status: "running" as const }
            : timer,
        ),
      }
    case "PAUSE_CATEGORY_TIMERS":
      return {
        ...state,
        timers: state.timers.map((timer) =>
          timer.category === action.payload && timer.status === "running"
            ? { ...timer, status: "paused" as const }
            : timer,
        ),
      }
    case "RESET_CATEGORY_TIMERS":
      return {
        ...state,
        timers: state.timers.map((timer) =>
          timer.category === action.payload
            ? { ...timer, status: "paused" as const, remainingTime: timer.duration }
            : timer,
        ),
      }
    default:
      return state
  }
}

// Provider component
export function TimerProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(timerReducer, initialState)

  // Load data from AsyncStorage on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const timersData = await AsyncStorage.getItem("timers")
        const historyData = await AsyncStorage.getItem("history")

        dispatch({
          type: "INITIALIZE",
          payload: {
            timers: timersData ? JSON.parse(timersData) : [],
            history: historyData ? JSON.parse(historyData) : [],
          },
        })
      } catch (error) {
        console.error("Failed to load data from storage", error)
      }
    }

    loadData()
  }, [])

  // Save data to AsyncStorage whenever state changes
  useEffect(() => {
    const saveData = async () => {
      if (!state.isLoading) {
        try {
          await AsyncStorage.setItem("timers", JSON.stringify(state.timers))
          await AsyncStorage.setItem("history", JSON.stringify(state.history))
        } catch (error) {
          console.error("Failed to save data to storage", error)
        }
      }
    }

    saveData()
  }, [state.timers, state.history, state.isLoading])

  return <TimerContext.Provider value={{ state, dispatch }}>{children}</TimerContext.Provider>
}

// Custom hook to use the timer context
export function useTimerContext(): TimerContextType {
  const context = useContext(TimerContext)
  if (!context) {
    throw new Error("useTimerContext must be used within a TimerProvider")
  }
  return context
}
