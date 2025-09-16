import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'

interface MrHappyAvatarProps {
  emotion?: 'happy' | 'excited' | 'helpful' | 'playful' | 'encouraging' | 'thoughtful' | 'listening'
  isListening?: boolean
  isSpeaking?: boolean
  isActive?: boolean
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export const MrHappyAvatar: React.FC<MrHappyAvatarProps> = ({
  emotion = 'happy',
  isListening = false,
  isSpeaking = false,
  isActive = false,
  size = 'md',
  className
}) => {
  const sizes = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32'
  }

  const getEyeExpression = () => {
    switch (emotion) {
      case 'excited':
        return '✨'
      case 'playful':
        return '😄'
      case 'thoughtful':
        return '🤔'
      case 'encouraging':
        return '😊'
      case 'listening':
        return '👂'
      default:
        return '😊'
    }
  }

  const getMoodColor = () => {
    switch (emotion) {
      case 'excited':
        return 'from-yellow-400 to-orange-500'
      case 'playful':
        return 'from-pink-400 to-purple-500'
      case 'thoughtful':
        return 'from-blue-400 to-indigo-500'
      case 'encouraging':
        return 'from-green-400 to-teal-500'
      case 'listening':
        return 'from-red-400 to-pink-500'
      default:
        return 'from-purple-400 to-blue-500'
    }
  }

  return (
    <div className={cn('relative flex items-center justify-center', className)}>
      {/* Outer glow ring */}
      <motion.div
        className={cn(
          'absolute inset-0 rounded-full bg-gradient-to-r opacity-30 blur-sm',
          getMoodColor(),
          sizes[size]
        )}
        animate={isActive ? {
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3]
        } : {}}
        transition={{
          duration: 2,
          repeat: isActive ? Infinity : 0,
          ease: "easeInOut"
        }}
      />

      {/* Main avatar circle */}
      <motion.div
        className={cn(
          'relative rounded-full bg-gradient-to-br flex items-center justify-center text-white shadow-lg',
          getMoodColor(),
          sizes[size]
        )}
        animate={{
          scale: isListening ? [1, 1.1, 1] : isSpeaking ? [1, 1.05, 1] : 1,
        }}
        transition={{
          duration: isListening ? 1 : isSpeaking ? 0.5 : 0.3,
          repeat: (isListening || isSpeaking) ? Infinity : 0,
          ease: "easeInOut"
        }}
      >
        {/* Mr. Happy Face */}
        <div className="relative flex flex-col items-center justify-center">
          {/* Face emoji */}
          <motion.div 
            className={cn(
              'text-center',
              size === 'sm' ? 'text-lg' : 
              size === 'md' ? 'text-2xl' : 
              size === 'lg' ? 'text-4xl' : 'text-6xl'
            )}
            animate={isSpeaking ? {
              rotate: [-2, 2, -1, 1, 0],
            } : {}}
            transition={{
              duration: 0.5,
              repeat: isSpeaking ? Infinity : 0,
              ease: "easeInOut"
            }}
          >
            {getEyeExpression()}
          </motion.div>

          {/* Name badge for larger sizes */}
          {(size === 'lg' || size === 'xl') && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute -bottom-8 left-1/2 transform -translate-x-1/2"
            >
              <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium text-gray-800">
                Mr. Happy
              </div>
            </motion.div>
          )}
        </div>

        {/* Voice activity indicator */}
        {isListening && (
          <motion.div
            className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [1, 0.7, 1]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}

        {isSpeaking && (
          <motion.div
            className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full"
            animate={{
              opacity: [1, 0.3, 1]
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}
      </motion.div>

      {/* Sound waves animation when speaking */}
      {isSpeaking && (
        <div className="absolute inset-0 flex items-center justify-center">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className={cn(
                'absolute rounded-full border-2 border-white opacity-20',
                sizes[size]
              )}
              initial={{ scale: 1, opacity: 0.2 }}
              animate={{
                scale: [1, 1.5, 2],
                opacity: [0.2, 0.1, 0]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeOut"
              }}
            />
          ))}
        </div>
      )}

      {/* Listening pulse animation */}
      {isListening && (
        <motion.div
          className={cn(
            'absolute inset-0 rounded-full bg-red-400 opacity-20',
            sizes[size]
          )}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
    </div>
  )
}

// Mood-based avatar variants
export const MrHappyMoodAvatar: React.FC<{
  mood: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  isActive?: boolean
}> = ({ mood, size = 'md', isActive = false }) => {
  const moodToEmotion = {
    'excited': 'excited' as const,
    'helpful': 'helpful' as const,
    'playful': 'playful' as const,
    'encouraging': 'encouraging' as const,
    'curious': 'thoughtful' as const,
    'listening': 'listening' as const,
    'speaking': 'happy' as const
  }

  return (
    <MrHappyAvatar
      emotion={moodToEmotion[mood as keyof typeof moodToEmotion] || 'happy'}
      size={size}
      isActive={isActive}
    />
  )
}

// Status indicator component
export const MrHappyStatusIndicator: React.FC<{
  status: 'idle' | 'listening' | 'thinking' | 'speaking'
  className?: string
}> = ({ status, className }) => {
  const statusConfig = {
    idle: { color: 'bg-gray-500', text: 'Ready' },
    listening: { color: 'bg-red-500', text: 'Listening...' },
    thinking: { color: 'bg-yellow-500', text: 'Thinking...' },
    speaking: { color: 'bg-blue-500', text: 'Speaking...' }
  }

  const config = statusConfig[status]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn('flex items-center space-x-2', className)}
    >
      <motion.div
        className={cn('w-2 h-2 rounded-full', config.color)}
        animate={status !== 'idle' ? {
          scale: [1, 1.2, 1],
          opacity: [1, 0.7, 1]
        } : {}}
        transition={{
          duration: 1,
          repeat: status !== 'idle' ? Infinity : 0,
          ease: "easeInOut"
        }}
      />
      <span className="text-xs text-white/80">{config.text}</span>
    </motion.div>
  )
}