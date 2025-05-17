"use client"

import AsyncStorage from "@react-native-async-storage/async-storage"
import React, {
  createContext,
  Dispatch,
  ReactNode,
  useContext,
  useEffect,
  useReducer,
} from "react"

type Timer = {
  id: string
  title: string
  duration: number
  remainingTime: number
  status: "paused" | "running" | "completed"
  category?: string
}

type HistoryItem = Timer & {
  completedAt: string
}

type TimerState = {
  timers: Timer[]
  history: HistoryItem[]
  isLoading: boolean
}

type TimerAction =
  | { type: "INITIALIZE"; payload: { timers: Timer[]; history: HistoryItem[] } }
  | { type: "ADD_TIMER"; payload: Timer }
  | { type: "UPDATE_TIMER"; payload: Timer }
  | { type: "DELETE_TIMER"; payload: string }
  | { type: "COMPLETE_TIMER"; payload: string }
  | { type: "START_TIMER"; payload: string }
  | { type: "PAUSE_TIMER"; payload: string }
  | { type: "RESET_TIMER"; payload: string }
  | { type: "UPDATE_REMAINING_TIME"; payload: { id: string; remainingTime: number } }
  | { type: "START_CATEGORY_TIMERS"; payload: string }
  | { type: "PAUSE_CATEGORY_TIMERS"; payload: string }
  | { type: "RESET_CATEGORY_TIMERS"; payload: string }

type TimerContextType = {
  state: TimerState
  dispatch: Dispatch<TimerAction>
}

const TimerContext = createContext<TimerContextType | undefined>(undefined)

// Initial state
const initialState: TimerState = {
  timers: [],
  history: [],
  isLoading: true,
}

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
        timers: state.timers.map((timer) =>
          timer.id === action.payload.id ? action.payload : timer
        ),
      }
    case "DELETE_TIMER":
      return {
        ...state,
        timers: state.timers.filter((timer) => timer.id !== action.payload),
      }
    case "COMPLETE_TIMER":
      const completedTimer = state.timers.find(
        (timer) => timer.id === action.payload
      )
      if (!completedTimer) return state

      const updatedTimers = state.timers.map((timer) =>
        timer.id === action.payload
          ? { ...timer, status: "completed", remainingTime: 0 }
          : timer
      )

      return {
        ...state,
        timers: updatedTimers,
        history: [
          ...state.history,
          {
            ...completedTimer,
            completedAt: new Date().toISOString(),
            id: `history-${Date.now()}`,
          },
        ],
      }
    case "START_TIMER":
      return {
        ...state,
        timers: state.timers.map((timer) =>
          timer.id === action.payload ? { ...timer, status: "running" } : timer
        ),
      }
    case "PAUSE_TIMER":
      return {
        ...state,
        timers: state.timers.map((timer) =>
          timer.id === action.payload ? { ...timer, status: "paused" } : timer
        ),
      }
    case "RESET_TIMER":
      return {
        ...state,
        timers: state.timers.map((timer) =>
          timer.id === action.payload
            ? { ...timer, status: "paused", remainingTime: timer.duration }
            : timer
        ),
      }
    case "UPDATE_REMAINING_TIME":
      return {
        ...state,
        timers: state.timers.map((timer) =>
          timer.id === action.payload.id
            ? { ...timer, remainingTime: action.payload.remainingTime }
            : timer
        ),
      }
    case "START_CATEGORY_TIMERS":
      return {
        ...state,
        timers: state.timers.map((timer) =>
          timer.category === action.payload && timer.status !== "completed"
            ? { ...timer, status: "running" }
            : timer
        ),
      }
    case "PAUSE_CATEGORY_TIMERS":
      return {
        ...state,
        timers: state.timers.map((timer) =>
          timer.category === action.payload && timer.status === "running"
            ? { ...timer, status: "paused" }
            : timer
        ),
      }
    case "RESET_CATEGORY_TIMERS":
      return {
        ...state,
        timers: state.timers.map((timer) =>
          timer.category === action.payload
            ? { ...timer, status: "paused", remainingTime: timer.duration }
            : timer
        ),
      }
    default:
      return state
  }
}

type TimerProviderProps = {
  children: ReactNode
}

export function TimerProvider({ children }: TimerProviderProps) {
  const [state, dispatch] = useReducer(timerReducer, initialState)

  useEffect(() => {
    const isValidStatus = (status: any): status is Timer["status"] =>
      status === "paused" || status === "running" || status === "completed"
    
    const loadData = async () => {
      try {
        const timersData = await AsyncStorage.getItem("timers")
        const historyData = await AsyncStorage.getItem("history")
    
        const parsedTimers: Timer[] = (timersData ? JSON.parse(timersData) : []).map((t: any) => ({
          ...t,
          status: isValidStatus(t.status) ? t.status : "paused", // default fallback
        }))
    
        const parsedHistory: HistoryItem[] = (historyData ? JSON.parse(historyData) : []).map((h: any) => ({
          ...h,
          status: isValidStatus(h.status) ? h.status : "completed",
        }))
    
        dispatch({
          type: "INITIALIZE",
          payload: {
            timers: parsedTimers,
            history: parsedHistory,
          },
        })
      } catch (error) {
        console.error("Failed to load data from storage", error)
      }
    }
    

    loadData()
  }, [])

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

  return (
    <TimerContext.Provider value={{ state, dispatch }}>
      {children}
    </TimerContext.Provider>
  )
}

export function useTimerContext(): TimerContextType {
  const context = useContext(TimerContext)
  if (!context) {
    throw new Error("useTimerContext must be used within a TimerProvider")
  }
  return context
}
