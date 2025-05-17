// Custom hook for formatting time values consistently across the app

export function useFormatTime() {
    // Format time for display in HH:MM:SS format
    const formatTimeDisplay = (seconds: number): string => {
      const hours = Math.floor(seconds / 3600)
      const minutes = Math.floor((seconds % 3600) / 60)
      const remainingSeconds = seconds % 60
  
      return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
    }
  
    // Format duration for display in a more human-readable format (1h 30m 15s)
    const formatDuration = (seconds: number): string => {
      const hours = Math.floor(seconds / 3600)
      const minutes = Math.floor((seconds % 3600) / 60)
      const remainingSeconds = seconds % 60
  
      let result = ""
      if (hours > 0) result += `${hours}h `
      if (minutes > 0) result += `${minutes}m `
      if (remainingSeconds > 0 || result === "") result += `${remainingSeconds}s`
  
      return result
    }
  
    // Format date for display
    const formatDate = (dateString: string): string => {
      const date = new Date(dateString)
      return date.toLocaleString()
    }
  
    return {
      formatTimeDisplay,
      formatDuration,
      formatDate,
    }
  }
  