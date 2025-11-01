import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function getScoreColor(score) {
  if (score >= 8) return 'text-green-500'
  if (score >= 6) return 'text-yellow-500'
  return 'text-red-500'
}

export function getScoreGradient(score) {
  if (score >= 8) return 'from-green-500 to-emerald-500'
  if (score >= 6) return 'from-yellow-500 to-orange-500'
  return 'from-red-500 to-pink-500'
}
