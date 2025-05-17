import { Ionicons } from "@expo/vector-icons"
import { StyleSheet, Text, View } from "react-native"
import type { ThemeColors } from "../types"

interface EmptyStateProps {
  icon: keyof typeof Ionicons.glyphMap
  message: string
  theme: ThemeColors
}

export default function EmptyState({ icon, message, theme }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={64} color={theme.text} />
      <Text style={[styles.message, { color: theme.text }]}>{message}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 16,
    lineHeight: 24,
  },
})
