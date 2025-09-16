import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface MemoryGameProps {
  onGameComplete: (score: number) => void
}

interface Card {
  id: number
  emoji: string
  isFlipped: boolean
  isMatched: boolean
}

export default function MemoryGame({ onGameComplete }: MemoryGameProps) {
  const [cards, setCards] = useState<Card[]>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [matches, setMatches] = useState(0)
  const [moves, setMoves] = useState(0)
  const [timeLeft, setTimeLeft] = useState(60)
  const [isActive, setIsActive] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)

  const emojis = ['🎮', '🎯', '🎲', '🎪', '🎨', '🎭', '🎺', '🎸', '🎤', '🎧', '🎬', '🎹']

  const initializeGame = () => {
    const selectedEmojis = emojis.slice(0, 8) // Use 8 different emojis
    const gameCards: Card[] = []
    
    selectedEmojis.forEach((emoji, index) => {
      // Create pairs
      gameCards.push(
        {
          id: index * 2,
          emoji,
          isFlipped: false,
          isMatched: false
        },
        {
          id: index * 2 + 1,
          emoji,
          isFlipped: false,
          isMatched: false
        }
      )
    })

    // Shuffle cards
    const shuffled = gameCards.sort(() => Math.random() - 0.5)
    setCards(shuffled)
    setMatches(0)
    setMoves(0)
    setFlippedCards([])
    setTimeLeft(60)
  }

  const startGame = () => {
    initializeGame()
    setIsActive(true)
    setGameStarted(true)
  }

  const flipCard = (cardId: number) => {
    if (!isActive || flippedCards.length >= 2) return
    
    const card = cards.find(c => c.id === cardId)
    if (!card || card.isFlipped || card.isMatched) return

    setCards(prev => prev.map(c => 
      c.id === cardId ? { ...c, isFlipped: true } : c
    ))

    const newFlippedCards = [...flippedCards, cardId]
    setFlippedCards(newFlippedCards)

    if (newFlippedCards.length === 2) {
      setMoves(prev => prev + 1)
      
      const [firstCardId, secondCardId] = newFlippedCards
      const firstCard = cards.find(c => c.id === firstCardId)
      const secondCard = cards.find(c => c.id === secondCardId)

      if (firstCard && secondCard && firstCard.emoji === secondCard.emoji) {
        // Match found
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            c.id === firstCardId || c.id === secondCardId 
              ? { ...c, isMatched: true } 
              : c
          ))
          setMatches(prev => prev + 1)
          setFlippedCards([])
        }, 500)
      } else {
        // No match
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            c.id === firstCardId || c.id === secondCardId 
              ? { ...c, isFlipped: false } 
              : c
          ))
          setFlippedCards([])
        }, 1000)
      }
    }
  }

  useEffect(() => {
    if (matches === 8) { // All pairs found
      setIsActive(false)
      const score = Math.max(0, 200 - moves * 5 + (timeLeft * 2)) // Score based on efficiency
      onGameComplete(score)
    }
  }, [matches, moves, timeLeft, onGameComplete])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      setIsActive(false)
      const score = Math.max(0, matches * 25 - moves * 2) // Partial score if time runs out
      onGameComplete(score)
    }
    return () => clearInterval(interval)
  }, [isActive, timeLeft, matches, moves, onGameComplete])

  if (!gameStarted) {
    return (
      <div className="text-center space-y-6">
        <div className="text-6xl mb-4">🧠</div>
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">Memory Match</h3>
          <p className="text-white/70 mb-6">Match all the pairs of cards in 60 seconds!</p>
          <div className="bg-white/10 rounded-lg p-4 mb-6">
            <div className="text-sm text-white/60 space-y-1">
              <p>• Find all 8 matching pairs</p>
              <p>• Fewer moves = higher score</p>
              <p>• Time bonus for quick completion</p>
              <p>• Remember card positions!</p>
            </div>
          </div>
        </div>
        <motion.button
          onClick={startGame}
          className="bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold py-4 px-8 rounded-lg text-xl"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Start Game
        </motion.button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Game Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white/10 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-white">{matches}/8</div>
          <div className="text-sm text-white/70">Matches</div>
        </div>
        <div className="bg-white/10 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-400">{timeLeft}s</div>
          <div className="text-sm text-white/70">Time Left</div>
        </div>
        <div className="bg-white/10 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-400">{moves}</div>
          <div className="text-sm text-white/70">Moves</div>
        </div>
      </div>

      {/* Game Board */}
      <div className="grid grid-cols-4 gap-3">
        {cards.map((card) => (
          <motion.div
            key={card.id}
            onClick={() => flipCard(card.id)}
            className="aspect-square cursor-pointer"
            whileHover={{ scale: card.isMatched ? 1 : 1.05 }}
            whileTap={{ scale: card.isMatched ? 1 : 0.95 }}
          >
            <div className="w-full h-full relative">
              {/* Card Back */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center shadow-lg"
                animate={{ 
                  rotateY: card.isFlipped || card.isMatched ? 180 : 0,
                  opacity: card.isMatched ? 0.5 : 1
                }}
                transition={{ duration: 0.3 }}
                style={{ backfaceVisibility: 'hidden' }}
              >
                <div className="text-2xl">❓</div>
              </motion.div>

              {/* Card Front */}
              <motion.div
                className="absolute inset-0 bg-white rounded-lg flex items-center justify-center shadow-lg border-2"
                animate={{ 
                  rotateY: card.isFlipped || card.isMatched ? 0 : -180,
                }}
                transition={{ duration: 0.3 }}
                style={{ 
                  backfaceVisibility: 'hidden',
                  borderColor: card.isMatched ? '#10b981' : card.isFlipped ? '#8b5cf6' : 'transparent'
                }}
              >
                <div className="text-3xl">{card.emoji}</div>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="bg-white/10 rounded-full h-2 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-pink-600 to-purple-600"
          animate={{ width: `${(matches / 8) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Hint */}
      {moves > 10 && matches < 3 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-yellow-400 text-sm"
        >
          💡 Tip: Try to remember where you saw each emoji!
        </motion.div>
      )}
    </div>
  )
}