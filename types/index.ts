import type React from "react"
// Define all the types used throughout the application

export interface Timer {
  id: string
  name: string
  duration: number
  remainingTime: number
  category: string
  status: "running" | "paused" | "completed"
  halfwayAlert: boolean
  createdAt: string
}

export interface TimerHistory extends Timer {
  completedAt: string
}

export interface TimerState {
  timers: Timer[]
  history: TimerHistory[]
  isLoading: boolean
}

export type TimerAction =
  | { type: "INITIALIZE"; payload: { timers: Timer[]; history: TimerHistory[] } }
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

export interface ThemeColors {
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

export interface ThemeContextType {
  theme: ThemeColors
  isDarkMode: boolean
  toggleTheme: () => void
}

export interface TimerContextType {
  state: TimerState
  dispatch: React.Dispatch<TimerAction>
}
