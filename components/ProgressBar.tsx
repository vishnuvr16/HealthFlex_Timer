import { StyleSheet, View } from "react-native"

interface ProgressBarProps {
  progress: number
  backgroundColor: string
  fillColor: string
  height?: number
}

export default function ProgressBar({ progress, backgroundColor, fillColor, height = 8 }: ProgressBarProps) {
  // Ensure progress is between 0 and 1
  const clampedProgress = Math.min(Math.max(progress, 0), 1)

  return (
    <View style={[styles.container, { backgroundColor, height }]}>
      <View
        style={[
          styles.fill,
          {
            backgroundColor: fillColor,
            width: `${clampedProgress * 100}%`,
          },
        ]}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 4,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
  },
})
