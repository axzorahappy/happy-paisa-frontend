import React from 'react'
import { motion } from 'framer-motion'
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react'
import { cn } from '../../lib/utils'

interface VoiceButtonProps {
  isListening?: boolean
  isSpeaking?: boolean
  isSupported?: boolean
  disabled?: boolean
  onStartListening?: () => void
  onStopListening?: () => void
  onStopSpeaking?: () => void
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export const VoiceButton: React.FC<VoiceButtonProps> = ({
  isListening = false,
  isSpeaking = false,
  isSupported = true,
  disabled = false,
  onStartListening,
  onStopListening,
  onStopSpeaking,
  className,
  size = 'md'
}) => {
  const handleClick = () => {
    if (disabled || !isSupported) return
    
    if (isSpeaking) {
      onStopSpeaking?.()
    } else if (isListening) {
      onStopListening?.()
    } else {
      onStartListening?.()
    }
  }

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  }

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24
  }

  const getIcon = () => {
    if (isSpeaking) return <Volume2 size={iconSizes[size]} />
    if (isListening) return <Mic size={iconSizes[size]} />
    return isSupported ? <Mic size={iconSizes[size]} /> : <MicOff size={iconSizes[size]} />
  }

  const getButtonColor = () => {
    if (isSpeaking) return 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
    if (isListening) return 'from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
    if (!isSupported) return 'from-gray-500 to-gray-600'
    return 'from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700'
  }

  return (
    <div className={cn('relative', className)}>
      <motion.button
        onClick={handleClick}
        disabled={disabled || !isSupported}
        className={cn(
          'relative rounded-full bg-gradient-to-r text-white shadow-lg transition-all duration-200 flex items-center justify-center',
          sizeClasses[size],
          getButtonColor(),
          disabled || !isSupported 
            ? 'cursor-not-allowed opacity-50' 
            : 'cursor-pointer active:scale-95 hover:shadow-xl'
        )}
        whileTap={{ scale: disabled ? 1 : 0.95 }}
        whileHover={{ scale: disabled ? 1 : 1.05 }}
      >
        {getIcon()}
        
        {/* Listening pulse animation */}
        {isListening && (
          <motion.div
            className="absolute inset-0 rounded-full bg-red-400"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.6, 0.2, 0.6]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}

        {/* Speaking pulse animation */}
        {isSpeaking && (
          <motion.div
            className="absolute inset-0 rounded-full bg-blue-400"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.4, 0.1, 0.4]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}
      </motion.button>

      {/* Status indicator */}
      <div className="absolute -top-1 -right-1">
        {isListening && (
          <motion.div
            className="w-3 h-3 bg-red-500 rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        )}
        {isSpeaking && (
          <motion.div
            className="w-3 h-3 bg-blue-500 rounded-full"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          />
        )}
      </div>
    </div>
  )
}

interface AudioVisualizerProps {
  isActive?: boolean
  className?: string
  barCount?: number
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  isActive = false,
  className,
  barCount = 5
}) => {
  return (
    <div className={cn('flex items-center space-x-1', className)}>
      {Array.from({ length: barCount }, (_, i) => (
        <motion.div
          key={i}
          className="w-1 bg-gradient-to-t from-purple-400 to-pink-400 rounded-full"
          initial={{ height: 4 }}
          animate={isActive ? {
            height: [4, 12, 8, 16, 6, 14, 4],
            opacity: [0.4, 1, 0.6, 1, 0.7, 1, 0.4]
          } : { height: 4, opacity: 0.4 }}
          transition={{
            duration: 1.5,
            repeat: isActive ? Infinity : 0,
            delay: i * 0.1,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  )
}

interface VoiceStatusProps {
  isListening?: boolean
  isSpeaking?: boolean
  transcript?: string
  className?: string
}

export const VoiceStatus: React.FC<VoiceStatusProps> = ({
  isListening,
  isSpeaking,
  transcript,
  className
}) => {
  if (!isListening && !isSpeaking && !transcript) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={cn(
        'bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-3',
        className
      )}
    >
      <div className="flex items-center space-x-2 mb-2">
        <AudioVisualizer isActive={isListening || isSpeaking} barCount={4} />
        <span className="text-sm text-white/70">
          {isListening && 'Listening...'}
          {isSpeaking && 'Speaking...'}
          {!isListening && !isSpeaking && transcript && 'Heard:'}
        </span>
      </div>
      
      {transcript && (
        <div className="text-sm text-white bg-white/5 rounded p-2 border border-white/10">
          "{transcript}"
        </div>
      )}
    </motion.div>
  )
}