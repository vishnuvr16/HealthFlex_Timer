// "use client"

// import { useState, useEffect, useCallback } from "react"
// import { View, Text, TouchableOpacity, StyleSheet, SectionList, ScrollView, RefreshControl } from "react-native"
// import { Ionicons } from "@expo/vector-icons"
// import { useTimerContext } from "../context/TimerContext"
// import { useTheme } from "../context/ThemeContext"
// import TimerItem from "../components/TimerItem"
// import CategoryActions from "../components/CategoryActions"
// import CompletionModal from "../components/CompletionModal"

// // Import the actual Timer type from your types file
// import { Timer as TimerType, TimerAction } from "../types/index"

// // Extend the Timer type to match what's used in context
// interface Timer extends TimerType {
//   title?: string; // Add title for compatibility with TimerContext
//   name: string;
//   halfwayAlert: boolean;
//   createdAt: string;
// }

// interface NavigationProps {
//   navigate: (screen: string) => void;
// }

// type ExpandedCategoriesType = {
//   [key: string]: boolean;
// };

// export default function HomeScreen({ navigation }: { navigation: NavigationProps }) {
//   const { state, dispatch } = useTimerContext()
//   const { theme, isDarkMode, toggleTheme } = useTheme()
//   const [expandedCategories, setExpandedCategories] = useState<ExpandedCategoriesType>({})
//   const [completedTimer, setCompletedTimer] = useState<Timer | null>(null)
//   const [refreshing, setRefreshing] = useState(false)
//   const [showCompletionModal, setShowCompletionModal] = useState(false)
//   const [selectedCategory, setSelectedCategory] = useState<string>("all")
//   const [categories, setCategories] = useState<string[]>([])

//   // Extract unique categories from timers
//   useEffect(() => {
//     const uniqueCategories: string[] = ["all", ...new Set(state.timers.map((timer) => timer.category))]
//     setCategories(uniqueCategories)

//     // Initialize expanded state for all categories
//     const initialExpandedState: ExpandedCategoriesType = {}
//     uniqueCategories.forEach((category: string) => {
//       if (category !== "all") {
//         initialExpandedState[category] = true
//       }
//     })
//     setExpandedCategories(initialExpandedState)
//   }, [state.timers])

//   // Timer logic
//   useEffect(() => {
//     const interval = setInterval(() => {
//       state.timers.forEach((timer) => {
//         if (timer.status === "running" && timer.remainingTime > 0) {
//           dispatch({
//             type: "UPDATE_REMAINING_TIME",
//             payload: {
//               id: timer.id,
//               remainingTime: timer.remainingTime - 1,
//             },
//           })

//           // Check for halfway alert
//           // Only access halfwayAlert if it exists
//           const timerWithExtras = timer as unknown as Timer;
//           if (timerWithExtras.halfwayAlert && timer.remainingTime === Math.floor(timer.duration / 2)) {
//             alert(`Halfway point reached for "${timerWithExtras.name}"!`)
//           }

//           // Check if timer completed
//           if (timer.remainingTime === 1) {
//             dispatch({ type: "COMPLETE_TIMER", payload: timer.id })
//             setCompletedTimer(timer as unknown as Timer)
//             setShowCompletionModal(true)
//           }
//         }
//       })
//     }, 1000)

//     return () => clearInterval(interval)
//   }, [state.timers, dispatch])

//   // Prepare data for section list
//   const getSectionData = () => {
//     if (selectedCategory === "all") {
//       const sections = categories
//         .filter((category) => category !== "all")
//         .map((category) => ({
//           title: category,
//           data: state.timers.filter((timer) => timer.category === category),
//         }))
//         .filter((section) => section.data.length > 0)

//       return sections
//     } else {
//       return [
//         {
//           title: selectedCategory,
//           data: state.timers.filter((timer) => timer.category === selectedCategory),
//         },
//       ]
//     }
//   }

//   const toggleCategory = (category: string) => {
//     setExpandedCategories((prev) => ({
//       ...prev,
//       [category]: !prev[category],
//     }))
//   }

//   const onRefresh = useCallback(() => {
//     setRefreshing(true)
//     // Simulate a refresh
//     setTimeout(() => {
//       setRefreshing(false)
//     }, 1000)
//   }, [])

//   return (
//     <View style={[styles.container, { backgroundColor: theme.background }]}>
//       {/* Theme toggle and Add button */}
//       <View style={styles.header}>
//         <TouchableOpacity style={[styles.themeToggle, { backgroundColor: theme.card }]} onPress={toggleTheme}>
//           <Ionicons name={isDarkMode ? "sunny" : "moon"} size={24} color={theme.text} />
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={[styles.addButton, { backgroundColor: theme.primary }]}
//           onPress={() => navigation.navigate("AddTimer")}
//         >
//           <Ionicons name="add" size={24} color="white" />
//         </TouchableOpacity>
//       </View>

//       {/* Category filter */}
//       <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryFilter}>
//         {categories.map((category) => (
//           <TouchableOpacity
//             key={category}
//             style={[
//               styles.categoryChip,
//               {
//                 backgroundColor: selectedCategory === category ? theme.primary : theme.card,
//                 borderColor: theme.border,
//               },
//             ]}
//             onPress={() => setSelectedCategory(category)}
//           >
//             <Text style={[styles.categoryChipText, { color: selectedCategory === category ? "white" : theme.text }]}>
//               {category === "all" ? "All Categories" : category}
//             </Text>
//           </TouchableOpacity>
//         ))}
//       </ScrollView>

//       {/* Timer list */}
//       {state.timers.length === 0 ? (
//         <View style={styles.emptyState}>
//           <Ionicons name="timer-outline" size={64} color={theme.text} />
//           <Text style={[styles.emptyStateText, { color: theme.text }]}>
//             No timers yet. Tap the + button to create one!
//           </Text>
//         </View>
//       ) : (
//         <SectionList
//           sections={getSectionData()}
//           keyExtractor={(item) => item.id}
//           refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
//           renderSectionHeader={({ section: { title } }) => (
//             <View style={[styles.sectionHeader, { backgroundColor: theme.background }]}>
//               <TouchableOpacity style={styles.sectionTitleContainer} onPress={() => toggleCategory(title)}>
//                 <Text style={[styles.sectionTitle, { color: theme.text }]}>{title}</Text>
//                 <Ionicons
//                   name={expandedCategories[title] ? "chevron-down" : "chevron-forward"}
//                   size={20}
//                   color={theme.text}
//                 />
//               </TouchableOpacity>

//               {/* Category bulk actions */}
//               <CategoryActions 
//                 category={title} 
//                 dispatch={dispatch as unknown as React.Dispatch<import("../types/index").TimerAction>} 
//                 theme={theme} 
//               />
//             </View>
//           )}
//           renderItem={({ item, section }) =>
//             expandedCategories[section.title] ? (
//               <TimerItem 
//                 timer={item as unknown as import("../types/index").Timer} 
//                 dispatch={dispatch as unknown as React.Dispatch<import("../types/index").TimerAction>} 
//                 theme={theme} 
//               />
//             ) : null
//           }
//           stickySectionHeadersEnabled={true}
//           contentContainerStyle={styles.listContent}
//         />
//       )}

//       {/* Completion Modal */}
//       <CompletionModal
//         visible={showCompletionModal}
//         timer={completedTimer as unknown as import("../types/index").Timer | null}
//         onClose={() => setShowCompletionModal(false)}
//         theme={theme}
//       />
//     </View>
//   )
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingHorizontal: 16,
//     paddingTop: 8,
//   },
//   themeToggle: {
//     padding: 8,
//     borderRadius: 20,
//   },
//   addButton: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     justifyContent: "center",
//     alignItems: "center",
//     elevation: 3,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 3,
//   },
//   categoryFilter: {
//     paddingHorizontal: 16,
//     marginVertical: 16,
//   },
//   categoryChip: {
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 20,
//     marginRight: 8,
//     borderWidth: 1,
//   },
//   categoryChipText: {
//     fontWeight: "500",
//   },
//   sectionHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: "#E5E7EB",
//   },
//   sectionTitleContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginRight: 8,
//   },
//   listContent: {
//     paddingBottom: 20,
//   },
//   emptyState: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 20,
//   },
//   emptyStateText: {
//     fontSize: 16,
//     textAlign: "center",
//     marginTop: 16,
//   },
// })