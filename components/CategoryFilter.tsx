import { Ionicons } from "@expo/vector-icons"
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import type { ThemeColors } from "../types"

interface CategoryFilterProps {
  categories: string[]
  selectedCategory: string
  onSelectCategory: (category: string) => void
  theme: ThemeColors
}

export default function CategoryFilter({ categories, selectedCategory, onSelectCategory, theme }: CategoryFilterProps) {
  if (categories.length <= 1) return null

  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.filterButton,
              {
                backgroundColor: selectedCategory === category ? theme.primary : "transparent",
                borderColor: selectedCategory === category ? theme.primary : theme.border,
              },
            ]}
            onPress={() => onSelectCategory(category)}
          >
            {category === "all" && (
              <Ionicons
                name="apps"
                size={14}
                color={selectedCategory === category ? "white" : theme.text}
                style={styles.buttonIcon}
              />
            )}
            <Text style={[styles.buttonText, { color: selectedCategory === category ? "white" : theme.text }]}>
              {category === "all" ? "All" : category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  container: {
    paddingVertical: 8,
  },
  contentContainer: {
    paddingHorizontal: 16,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    minWidth: 40,
    justifyContent: "center",
  },
  buttonIcon: {
    marginRight: 4,
  },
  buttonText: {
    fontWeight: "500",
    fontSize: 13,
  },
})
