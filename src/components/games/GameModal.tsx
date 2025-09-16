import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Trophy, Coins, Star } from 'lucide-react'

interface GameModalProps {
  isOpen: boolean
  onClose: () => void
  gameType: string
  onRewardEarned: (amount: number, gameType: string) => void
}

// Game components
import ClickerGame from './ClickerGame'
import MemoryGame from './MemoryGame'
import MathQuizGame from './MathQuizGame'
import SnakeGame from './SnakeGame'
import WordPuzzleGame from './WordPuzzleGame'

export default function GameModal({ isOpen, onClose, gameType, onRewardEarned }: GameModalProps) {
  const [gameScore, setGameScore] = useState(0)
  const [gameCompleted, setGameCompleted] = useState(false)
  const [rewardAmount, setRewardAmount] = useState(0)

  const games = {
    clicker: {
      title: 'Happy Clicker',
      description: 'Click as fast as you can!',
      component: ClickerGame,
      icon: '👆',
      maxReward: 100
    },
    memory: {
      title: 'Memory Match',
      description: 'Match the cards!',
      component: MemoryGame,
      icon: '🧠',
      maxReward: 150
    },
    math: {
      title: 'Math Quiz',
      description: 'Solve math problems!',
      component: MathQuizGame,
      icon: '🧮',
      maxReward: 200
    },
    snake: {
      title: 'Snake Game',
      description: 'Eat and grow!',
      component: SnakeGame,
      icon: '🐍',
      maxReward: 250
    },
    word: {
      title: 'Word Puzzle',
      description: 'Find the words!',
      component: WordPuzzleGame,
      icon: '📝',
      maxReward: 180
    }
  }

  const currentGame = games[gameType as keyof typeof games]
  const GameComponent = currentGame?.component

  useEffect(() => {
    if (isOpen) {
      setGameScore(0)
      setGameCompleted(false)
      setRewardAmount(0)
    }
  }, [isOpen, gameType])

  const handleGameComplete = (score: number) => {
    setGameScore(score)
    setGameCompleted(true)
    
    // Calculate reward based on score and game difficulty
    const maxReward = currentGame.maxReward
    const reward = Math.min(Math.floor(score * (maxReward / 100)), maxReward)
    setRewardAmount(reward)
  }

  const handleClaimReward = () => {
    if (rewardAmount > 0) {
      onRewardEarned(rewardAmount, gameType)
    }
    onClose()
  }

  if (!currentGame) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-xl border border-white/10 w-full max-w-2xl max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div className="flex items-center space-x-3">
                <div className="text-3xl">{currentGame.icon}</div>
                <div>
                  <h2 className="text-xl font-bold text-white">{currentGame.title}</h2>
                  <p className="text-white/70 text-sm">{currentGame.description}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-white/60 hover:text-white transition-colors p-2"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Game Area */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {!gameCompleted ? (
                <div>
                  {GameComponent && (
                    <GameComponent onGameComplete={handleGameComplete} />
                  )}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center space-y-6"
                >
                  <div className="text-6xl mb-4">🎉</div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Game Complete!</h3>
                    <p className="text-white/70">Great job playing {currentGame.title}!</p>
                  </div>
                  
                  <div className="bg-white/10 rounded-xl p-6 space-y-4">
                    <div className="flex items-center justify-center space-x-4">
                      <div className="text-center">
                        <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white">{gameScore}</div>
                        <div className="text-sm text-white/70">Final Score</div>
                      </div>
                      
                      <div className="text-center">
                        <Coins className="w-8 h-8 text-green-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-green-400">{rewardAmount}</div>
                        <div className="text-sm text-white/70">Happy Paisa</div>
                      </div>
                    </div>

                    {rewardAmount > 0 && (
                      <div className="flex items-center justify-center space-x-1 text-yellow-400">
                        {[...Array(Math.min(5, Math.ceil(rewardAmount / 50)))].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                      </div>
                    )}
                  </div>

                  <motion.button
                    onClick={handleClaimReward}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-4 px-6 rounded-lg hover:opacity-90 transition-opacity"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {rewardAmount > 0 ? `Claim ${rewardAmount} Happy Paisa` : 'Close Game'}
                  </motion.button>
                </motion.div>
              )}
            </div>

            {/* Footer Info */}
            {!gameCompleted && (
              <div className="bg-white/5 p-4 border-t border-white/10">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2 text-white/70">
                    <Coins className="w-4 h-4" />
                    <span>Max Reward: {currentGame.maxReward} Happy Paisa</span>
                  </div>
                  <div className="text-white/50">
                    Score higher for more rewards!
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}