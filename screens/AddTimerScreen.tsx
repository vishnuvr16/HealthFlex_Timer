"use client"

import { Ionicons } from "@expo/vector-icons"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
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
import { useTheme } from "../context/ThemeContext"
import { useTimerContext } from "../context/TimerContext"

type AddTimerScreenProps = {
  navigation: NativeStackNavigationProp<any>
}

export default function AddTimerScreen({ navigation }: AddTimerScreenProps) {
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
    return (
      Number.parseInt(hours || "0") * 3600 +
      Number.parseInt(minutes || "0") * 60 +
      Number.parseInt(seconds || "0")
    )
  }

  const handleAddTimer = () => {
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

    const newTimer = {
      id: `timer-${Date.now()}`,
      title: name.trim(),
      duration,
      remainingTime: duration,
      category: category.trim(),
      status: "paused" as const,
      halfwayAlert,
      createdAt: new Date().toISOString(),
    }

    dispatch({ type: "ADD_TIMER", payload: newTimer })

    navigation.goBack()
  }

  const handleAddCategory = () => {
    const trimmed = newCategory.trim()
    if (trimmed && !customCategories.includes(trimmed)) {
      setCustomCategories([...customCategories, trimmed])
      setCategory(trimmed)
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

        {/* Duration Inputs */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.text }]}>Duration</Text>
          <View style={styles.durationContainer}>
            {[
              { label: "Hours", value: hours, set: setHours },
              { label: "Minutes", value: minutes, set: setMinutes },
              { label: "Seconds", value: seconds, set: setSeconds },
            ].map(({ label, value, set }) => (
              <View key={label} style={styles.durationInput}>
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
                  value={value}
                  onChangeText={set}
                  maxLength={2}
                />
                <Text style={[styles.timeLabel, { color: theme.text }]}>{label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Category Selector */}
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
                <Text
                  style={[
                    styles.categoryChipText,
                    { color: category === cat ? "white" : theme.text },
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.newCategoryContainer}>
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
          <Text style={[styles.label, { color: theme.text }]}>Halfway Alert</Text>
          <Switch
            trackColor={{ false: theme.border, true: theme.primary + "80" }}
            thumbColor={halfwayAlert ? theme.primary : theme.card}
            ios_backgroundColor={theme.border}
            onValueChange={setHalfwayAlert}
            value={halfwayAlert}
          />
        </View>

        {/* Submit */}
        <TouchableOpacity
          style={[styles.createButton, { backgroundColor: theme.primary }]}
          onPress={handleAddTimer}
        >
          <Text style={styles.createButtonText}>Create Timer</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  // same styles as your original
  container: { flex: 1 },
  scrollContent: { padding: 16 },
  inputGroup: { marginBottom: 24 },
  label: { fontSize: 16, fontWeight: "bold", marginBottom: 8 },
  input: {
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    fontSize: 16,
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
    height: 50,
    width: "100%",
    borderRadius: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    fontSize: 16,
    textAlign: "center",
  },
  timeLabel: { marginTop: 4, fontSize: 14 },
  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 12,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
  },
  categoryChipText: { fontWeight: "500" },
  newCategoryContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  newCategoryInput: {
    flex: 1,
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    fontSize: 16,
    marginRight: 8,
  },
  addCategoryButton: {
    width: 50,
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  createButton: {
    height: 56,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  createButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
})
