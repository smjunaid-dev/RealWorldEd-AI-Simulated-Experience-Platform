import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export function Loader({ className, size = 'md' }) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <motion.div
        className={cn('border-4 border-primary/30 border-t-primary rounded-full', sizes[size])}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  )
}

export function TypingIndicator() {
  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg w-fit">
      <div className="typing-indicator">
        <span className="text-primary"></span>
        <span className="text-primary"></span>
        <span className="text-primary"></span>
      </div>
      <span className="text-sm text-muted-foreground">AI is thinking...</span>
    </div>
  )
}

export function Badge({ children, className, variant = 'default' }) {
  const variants = {
    default: 'bg-primary text-primary-foreground',
    secondary: 'bg-secondary text-secondary-foreground',
    success: 'bg-green-500 text-white',
    warning: 'bg-yellow-500 text-white',
    danger: 'bg-red-500 text-white',
  }

  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', variants[variant], className)}>
      {children}
    </span>
  )
}
