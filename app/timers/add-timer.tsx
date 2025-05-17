"use client"

import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import type { StackNavigationProp } from "@react-navigation/stack"
import type React from "react"
import { useState } from "react"
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"

import { useTheme } from "../../hooks/useTheme"
import { useTimerContext } from "../../hooks/useTimerContext"

export default function AddTimerScreen(): React.ReactElement {
  const navigation = useNavigation<StackNavigationProp<any>>()
  const { dispatch } = useTimerContext()
  const { theme } = useTheme()

  const [name, setName] = useState<string>("")
  const [hours, setHours] = useState<string>("0")
  const [minutes, setMinutes] = useState<string>("0")
  const [seconds, setSeconds] = useState<string>("0")
  const [category, setCategory] = useState<string>("")
  const [halfwayAlert, setHalfwayAlert] = useState<boolean>(false)
  const [customCategories, setCustomCategories] = useState<string[]>([
    "Workout",
    "Study",
    "Break",
    "Cooking",
    "Meditation",
  ])
  const [newCategory, setNewCategory] = useState<string>("")

  const calculateTotalSeconds = (): number => {
    return Number.parseInt(hours || "0") * 3600 + Number.parseInt(minutes || "0") * 60 + Number.parseInt(seconds || "0")
  }

  const handleAddTimer = (): void => {
    // Validate inputs
    if (!name.trim()) {
      Alert.alert("Error", "Please enter a timer name")
      return
    }

    if (!category.trim()) {
      Alert.alert("Error", "Please select or create a category")
      return
    }

    const duration = calculateTotalSeconds()
    if (duration <= 0) {
      Alert.alert("Error", "Please set a duration greater than 0")
      return
    }

    // Create new timer
    const newTimer = {
      id: `timer-${Date.now()}`,
      name: name.trim(),
      duration,
      remainingTime: duration,
      category: category.trim(),
      status: "paused" as const,
      halfwayAlert,
      createdAt: new Date().toISOString(),
    }

    // Add to context
    dispatch({ type: "ADD_TIMER", payload: newTimer })

    // Navigate back
    navigation.goBack()
  }

  const handleAddCategory = (): void => {
    if (newCategory.trim() && !customCategories.includes(newCategory.trim())) {
      setCustomCategories([...customCategories, newCategory.trim()])
      setCategory(newCategory.trim())
      setNewCategory("")
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Timer Name */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.text }]}>Timer Name</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="create-outline" size={20} color={theme.text + "80"} style={styles.inputIcon} />
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.card,
                  color: theme.text,
                  borderColor: theme.border,
                },
              ]}
              placeholder="Enter timer name"
              placeholderTextColor={theme.text + "80"}
              value={name}
              onChangeText={setName}
            />
          </View>
        </View>

        {/* Duration */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.text }]}>Duration</Text>
          <View style={styles.durationContainer}>
            <View style={styles.durationInput}>
              <TextInput
                style={[
                  styles.timeInput,
                  {
                    backgroundColor: theme.card,
                    color: theme.text,
                    borderColor: theme.border,
                  },
                ]}
                placeholder="0"
                placeholderTextColor={theme.text + "80"}
                keyboardType="number-pad"
                value={hours}
                onChangeText={setHours}
                maxLength={2}
              />
              <Text style={[styles.timeLabel, { color: theme.text }]}>Hours</Text>
            </View>

            <View style={styles.durationInput}>
              <TextInput
                style={[
                  styles.timeInput,
                  {
                    backgroundColor: theme.card,
                    color: theme.text,
                    borderColor: theme.border,
                  },
                ]}
                placeholder="0"
                placeholderTextColor={theme.text + "80"}
                keyboardType="number-pad"
                value={minutes}
                onChangeText={setMinutes}
                maxLength={2}
              />
              <Text style={[styles.timeLabel, { color: theme.text }]}>Minutes</Text>
            </View>

            <View style={styles.durationInput}>
              <TextInput
                style={[
                  styles.timeInput,
                  {
                    backgroundColor: theme.card,
                    color: theme.text,
                    borderColor: theme.border,
                  },
                ]}
                placeholder="0"
                placeholderTextColor={theme.text + "80"}
                keyboardType="number-pad"
                value={seconds}
                onChangeText={setSeconds}
                maxLength={2}
              />
              <Text style={[styles.timeLabel, { color: theme.text }]}>Seconds</Text>
            </View>
          </View>
        </View>

        {/* Category */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.text }]}>Category</Text>
          <View style={styles.categoryContainer}>
            {customCategories.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryChip,
                  {
                    backgroundColor: category === cat ? theme.primary : theme.card,
                    borderColor: theme.border,
                  },
                ]}
                onPress={() => setCategory(cat)}
              >
                <Text style={[styles.categoryChipText, { color: category === cat ? "white" : theme.text }]}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.newCategoryContainer}>
            <View style={[styles.inputWrapper, { flex: 1 }]}>
              <Ionicons name="pricetag-outline" size={20} color={theme.text + "80"} style={styles.inputIcon} />
              <TextInput
                style={[
                  styles.newCategoryInput,
                  {
                    backgroundColor: theme.card,
                    color: theme.text,
                    borderColor: theme.border,
                  },
                ]}
                placeholder="Add new category"
                placeholderTextColor={theme.text + "80"}
                value={newCategory}
                onChangeText={setNewCategory}
              />
            </View>
            <TouchableOpacity
              style={[styles.addCategoryButton, { backgroundColor: theme.primary }]}
              onPress={handleAddCategory}
            >
              <Ionicons name="add" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Halfway Alert */}
        <View style={styles.switchContainer}>
          <View style={styles.switchLabel}>
            <Ionicons name="notifications-outline" size={20} color={theme.text} style={styles.switchIcon} />
            <Text style={[styles.label, { color: theme.text, marginBottom: 0 }]}>Halfway Alert</Text>
          </View>
          <Switch
            trackColor={{ false: theme.border, true: theme.primary + "80" }}
            thumbColor={halfwayAlert ? theme.primary : theme.card}
            ios_backgroundColor={theme.border}
            onValueChange={setHalfwayAlert}
            value={halfwayAlert}
          />
        </View>

        {/* Create Button */}
        <TouchableOpacity style={[styles.createButton, { backgroundColor: theme.primary }]} onPress={handleAddTimer}>
          <Ionicons name="save-outline" size={20} color="white" style={{ marginRight: 8 }} />
          <Text style={styles.createButtonText}>Create Timer</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1,
    overflow: "hidden",
  },
  inputIcon: {
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    height: 54,
    paddingHorizontal: 8,
    fontSize: 16,
    borderWidth: 0,
  },
  durationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  durationInput: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: 4,
  },
  timeInput: {
    height: 54,
    width: "100%",
    borderRadius: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    fontSize: 18,
    textAlign: "center",
    fontFamily: "monospace",
  },
  timeLabel: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: "500",
  },
  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
    borderWidth: 1,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  categoryChipText: {
    fontWeight: "600",
  },
  newCategoryContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  newCategoryInput: {
    flex: 1,
    height: 54,
    paddingHorizontal: 8,
    fontSize: 16,
    borderWidth: 0,
  },
  addCategoryButton: {
    width: 54,
    height: 54,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 32,
    paddingVertical: 8,
  },
  switchLabel: {
    flexDirection: "row",
    alignItems: "center",
  },
  switchIcon: {
    marginRight: 8,
  },
  createButton: {
    height: 56,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    flexDirection: "row",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  createButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
})
