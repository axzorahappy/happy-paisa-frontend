import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'

interface ClickerGameProps {
  onGameComplete: (score: number) => void
}

export default function ClickerGame({ onGameComplete }: ClickerGameProps) {
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30)
  const [isActive, setIsActive] = useState(false)
  const [clickAnimation, setClickAnimation] = useState(false)
  const [multiplier, setMultiplier] = useState(1)

  const startGame = () => {
    setIsActive(true)
    setScore(0)
    setTimeLeft(30)
    setMultiplier(1)
  }

  const handleClick = useCallback(() => {
    if (!isActive) return
    
    setScore(prev => prev + multiplier)
    setClickAnimation(true)
    setTimeout(() => setClickAnimation(false), 100)
    
    // Increase multiplier every 10 clicks
    if ((score + multiplier) % 10 === 0) {
      setMultiplier(prev => Math.min(prev + 1, 5))
    }
  }, [isActive, multiplier, score])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      setIsActive(false)
      onGameComplete(score)
    }
    return () => clearInterval(interval)
  }, [isActive, timeLeft, score, onGameComplete])

  const getClicksPerSecond = () => {
    return score > 0 ? (score / (30 - timeLeft)).toFixed(1) : '0.0'
  }

  const getPerformanceLevel = () => {
    const cps = parseFloat(getClicksPerSecond())
    if (cps >= 8) return { level: 'LEGENDARY', color: 'text-purple-400', emoji: '🔥' }
    if (cps >= 6) return { level: 'EXPERT', color: 'text-yellow-400', emoji: '⚡' }
    if (cps >= 4) return { level: 'GOOD', color: 'text-green-400', emoji: '✨' }
    if (cps >= 2) return { level: 'DECENT', color: 'text-blue-400', emoji: '👍' }
    return { level: 'BEGINNER', color: 'text-gray-400', emoji: '🎯' }
  }

  if (!isActive && timeLeft === 30) {
    return (
      <div className="text-center space-y-6">
        <div className="text-6xl mb-4">👆</div>
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">Happy Clicker</h3>
          <p className="text-white/70 mb-6">Click the button as fast as you can for 30 seconds!</p>
          <div className="bg-white/10 rounded-lg p-4 mb-6">
            <div className="text-sm text-white/60 space-y-1">
              <p>• Click faster to increase your multiplier</p>
              <p>• Higher click rates = more Happy Paisa</p>
              <p>• Try to reach LEGENDARY level!</p>
            </div>
          </div>
        </div>
        <motion.button
          onClick={startGame}
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 px-8 rounded-lg text-xl"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Start Game
        </motion.button>
      </div>
    )
  }

  const performance = getPerformanceLevel()

  return (
    <div className="text-center space-y-6">
      {/* Game Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white/10 rounded-lg p-4">
          <div className="text-2xl font-bold text-white">{score}</div>
          <div className="text-sm text-white/70">Clicks</div>
        </div>
        <div className="bg-white/10 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-400">{timeLeft}</div>
          <div className="text-sm text-white/70">Seconds</div>
        </div>
        <div className="bg-white/10 rounded-lg p-4">
          <div className="text-2xl font-bold text-purple-400">×{multiplier}</div>
          <div className="text-sm text-white/70">Multiplier</div>
        </div>
      </div>

      {/* Performance Level */}
      <div className="bg-white/5 rounded-lg p-4">
        <div className="flex items-center justify-center space-x-2">
          <span className="text-2xl">{performance.emoji}</span>
          <span className={`font-bold ${performance.color}`}>{performance.level}</span>
        </div>
        <div className="text-white/60 text-sm mt-1">
          {getClicksPerSecond()} clicks per second
        </div>
      </div>

      {/* Click Button */}
      <div className="relative">
        <motion.button
          onClick={handleClick}
          className="w-48 h-48 bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 rounded-full text-white font-bold text-2xl shadow-2xl relative overflow-hidden"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          animate={clickAnimation ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 0.1 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-full" />
          <div className="relative z-10">
            <div className="text-4xl mb-2">👆</div>
            <div>CLICK!</div>
          </div>
          
          {/* Click effect */}
          {clickAnimation && (
            <motion.div
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 2, opacity: 0 }}
              className="absolute inset-0 border-4 border-white rounded-full"
            />
          )}
        </motion.button>

        {/* Floating score animations */}
        {clickAnimation && (
          <motion.div
            initial={{ y: 0, opacity: 1 }}
            animate={{ y: -50, opacity: 0 }}
            className="absolute top-4 left-1/2 transform -translate-x-1/2 text-2xl font-bold text-yellow-400 pointer-events-none"
          >
            +{multiplier}
          </motion.div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="bg-white/10 rounded-full h-2 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-purple-600 to-pink-600"
          initial={{ width: '100%' }}
          animate={{ width: `${(timeLeft / 30) * 100}%` }}
          transition={{ duration: 1 }}
        />
      </div>
    </div>
  )
}