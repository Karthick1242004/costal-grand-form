import { format } from "date-fns"
import { Star, Sparkles, Crown } from "lucide-react"
import React from "react"

// Helper function to safely format dates
export const formatDate = (date: any): string => {
  if (!date) return ""
  if (date instanceof Date && !isNaN(date.getTime())) {
    return format(date, "PPP")
  }
  // If it's a string, try to parse it
  if (typeof date === "string") {
    const parsedDate = new Date(date)
    if (!isNaN(parsedDate.getTime())) {
      return format(parsedDate, "PPP")
    }
  }
  return ""
}

// Helper function to get tier icon and color
export const getTierInfo = (tier: string) => {
  switch (tier) {
    case "bronze":
      return {
        icon: Star,
        color: "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400",
      }
    case "silver":
      return {
        icon: Sparkles,
        color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
      }
    case "gold":
      return {
        icon: Crown,
        color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
      }
    case "platinum":
      return {
        icon: Crown,
        color: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
      }
    case "diamond":
      return {
        icon: Crown,
        color: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/20 dark:text-cyan-400",
      }
    default:
      return {
        icon: Star,
        color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
      }
  }
}

// Helper function to render tier icon
export const renderTierIcon = (tier: string, className = "w-4 h-4") => {
  const tierInfo = getTierInfo(tier)
  const IconComponent = tierInfo.icon
  return React.createElement(IconComponent, { className })
} 