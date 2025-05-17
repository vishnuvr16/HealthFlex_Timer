"use client"

import { Ionicons } from "@expo/vector-icons"
import { useEffect } from "react"
import { Animated, Easing, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import type { ThemeColors, Timer } from "../types"

interface CompletionModalProps {
  visible: boolean
  timer: Timer | null
  onClose: () => void
  theme: ThemeColors
}

export default function CompletionModal({ visible, timer, onClose, theme }: CompletionModalProps) {
  const scaleAnim = new Animated.Value(0.5)
  const opacityAnim = new Animated.Value(0)

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.back(1.5)),
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start()
    } else {
      scaleAnim.setValue(0.5)
      opacityAnim.setValue(0)
    }
  }, [visible, scaleAnim, opacityAnim])

  if (!timer) return null

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <Animated.View
          style={[
            styles.modalContent,
            {
              backgroundColor: theme.background,
              borderColor: theme.border,
              transform: [{ scale: scaleAnim }],
              opacity: opacityAnim,
            },
          ]}
        >
          <View style={styles.iconContainer}>
            <View style={[styles.iconCircle, { backgroundColor: theme.success + "20" }]}>
              <Ionicons name="checkmark-circle" size={48} color={theme.success} />
            </View>
          </View>

          <Text style={[styles.congratsText, { color: theme.text }]}>Timer Completed!</Text>

          <Text style={[styles.timerName, { color: theme.text }]}>{timer.name}</Text>

          <Text style={[styles.categoryText, { color: theme.text + "80" }]}>Category: {timer.category}</Text>

          <TouchableOpacity style={[styles.closeButton, { backgroundColor: theme.primary }]} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    padding: 24,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 1,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  iconContainer: {
    marginBottom: 16,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  congratsText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  timerName: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 8,
    textAlign: "center",
  },
  categoryText: {
    fontSize: 16,
    marginBottom: 24,
  },
  closeButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
})
