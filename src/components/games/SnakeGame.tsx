import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'

interface SnakeGameProps {
  onGameComplete: (score: number) => void
}

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'
type Position = { x: number; y: number }

export default function SnakeGame({ onGameComplete }: SnakeGameProps) {
  const GRID_SIZE = 15
  const INITIAL_SNAKE = [{ x: 7, y: 7 }]
  const INITIAL_FOOD = { x: 10, y: 10 }

  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE)
  const [food, setFood] = useState<Position>(INITIAL_FOOD)
  const [direction, setDirection] = useState<Direction>('RIGHT')
  const [isActive, setIsActive] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const [score, setScore] = useState(0)
  const [gameSpeed, setGameSpeed] = useState(150)

  const generateFood = useCallback((snakeBody: Position[]): Position => {
    let newFood: Position
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      }
    } while (snakeBody.some(segment => segment.x === newFood.x && segment.y === newFood.y))
    return newFood
  }, [])

  const startGame = () => {
    setSnake(INITIAL_SNAKE)
    setFood(generateFood(INITIAL_SNAKE))
    setDirection('RIGHT')
    setScore(0)
    setGameSpeed(150)
    setIsActive(true)
    setGameStarted(true)
  }

  const moveSnake = useCallback(() => {
    if (!isActive) return

    setSnake(currentSnake => {
      const newSnake = [...currentSnake]
      const head = { ...newSnake[0] }
      
      // Ensure head has valid coordinates
      if (head.x === undefined || head.y === undefined) {
        return currentSnake
      }

      // Move head based on direction
      switch (direction) {
        case 'UP':
          head.y -= 1
          break
        case 'DOWN':
          head.y += 1
          break
        case 'LEFT':
          head.x -= 1
          break
        case 'RIGHT':
          head.x += 1
          break
      }

      // Check wall collision
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        setIsActive(false)
        onGameComplete(score)
        return currentSnake
      }

      // Check self collision
      if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        setIsActive(false)
        onGameComplete(score)
        return currentSnake
      }

      // Ensure head is valid Position before adding
      const validHead: Position = { x: head.x, y: head.y }
      newSnake.unshift(validHead)

      // Check food collision
      if (head.x === food.x && head.y === food.y) {
        setScore(prev => prev + 10)
        setFood(generateFood(newSnake))
        // Increase speed slightly
        setGameSpeed(prev => Math.max(100, prev - 2))
      } else {
        newSnake.pop()
      }

      return newSnake
    })
  }, [direction, isActive, food, score, generateFood, onGameComplete])

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isActive) return

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault()
          setDirection(prev => prev !== 'DOWN' ? 'UP' : prev)
          break
        case 'ArrowDown':
          e.preventDefault()
          setDirection(prev => prev !== 'UP' ? 'DOWN' : prev)
          break
        case 'ArrowLeft':
          e.preventDefault()
          setDirection(prev => prev !== 'RIGHT' ? 'LEFT' : prev)
          break
        case 'ArrowRight':
          e.preventDefault()
          setDirection(prev => prev !== 'LEFT' ? 'RIGHT' : prev)
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [isActive])

  // Game loop
  useEffect(() => {
    if (!isActive) return

    const gameInterval = setInterval(moveSnake, gameSpeed)
    return () => clearInterval(gameInterval)
  }, [isActive, moveSnake, gameSpeed])

  const handleDirectionButton = (newDirection: Direction) => {
    if (!isActive) return

    const opposites = {
      UP: 'DOWN',
      DOWN: 'UP',
      LEFT: 'RIGHT',
      RIGHT: 'LEFT'
    }

    if (direction !== opposites[newDirection]) {
      setDirection(newDirection)
    }
  }

  if (!gameStarted) {
    return (
      <div className="text-center space-y-6">
        <div className="text-6xl mb-4">🐍</div>
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">Snake Game</h3>
          <p className="text-white/70 mb-6">Eat the food and grow as long as possible!</p>
          <div className="bg-white/10 rounded-lg p-4 mb-6">
            <div className="text-sm text-white/60 space-y-1">
              <p>• Use arrow keys or buttons to move</p>
              <p>• Eat food to grow and earn points</p>
              <p>• Don't hit walls or yourself</p>
              <p>• Speed increases as you grow</p>
            </div>
          </div>
        </div>
        <motion.button
          onClick={startGame}
          className="bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-4 px-8 rounded-lg text-xl"
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
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/10 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-white">{score}</div>
          <div className="text-sm text-white/70">Score</div>
        </div>
        <div className="bg-white/10 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-400">{snake.length}</div>
          <div className="text-sm text-white/70">Length</div>
        </div>
      </div>

      {/* Game Board */}
      <div className="bg-black/50 rounded-lg p-4 mx-auto" style={{ width: 'fit-content' }}>
        <div 
          className="grid gap-1 bg-gray-900 rounded"
          style={{ 
            gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
            width: `${GRID_SIZE * 20}px`,
            height: `${GRID_SIZE * 20}px`
          }}
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
            const x = index % GRID_SIZE
            const y = Math.floor(index / GRID_SIZE)
            
            const isSnakeHead = snake[0]?.x === x && snake[0]?.y === y
            const isSnakeBody = snake.slice(1).some(segment => segment.x === x && segment.y === y)
            const isFood = food.x === x && food.y === y

            let cellClass = 'w-5 h-5 rounded-sm '
            
            if (isSnakeHead) {
              cellClass += 'bg-green-400'
            } else if (isSnakeBody) {
              cellClass += 'bg-green-600'
            } else if (isFood) {
              cellClass += 'bg-red-500'
            } else {
              cellClass += 'bg-gray-800'
            }

            return (
              <div key={index} className={cellClass}>
                {isFood && <div className="text-xs text-center leading-5">🍎</div>}
              </div>
            )
          })}
        </div>
      </div>

      {/* Mobile Controls */}
      <div className="grid grid-cols-3 gap-2 max-w-48 mx-auto">
        <div></div>
        <motion.button
          onClick={() => handleDirectionButton('UP')}
          className="bg-white/20 text-white p-3 rounded-lg font-bold"
          whileTap={{ scale: 0.9 }}
        >
          ↑
        </motion.button>
        <div></div>
        
        <motion.button
          onClick={() => handleDirectionButton('LEFT')}
          className="bg-white/20 text-white p-3 rounded-lg font-bold"
          whileTap={{ scale: 0.9 }}
        >
          ←
        </motion.button>
        <div className="bg-white/10 rounded-lg flex items-center justify-center text-white/60 text-xs">
          Move
        </div>
        <motion.button
          onClick={() => handleDirectionButton('RIGHT')}
          className="bg-white/20 text-white p-3 rounded-lg font-bold"
          whileTap={{ scale: 0.9 }}
        >
          →
        </motion.button>
        
        <div></div>
        <motion.button
          onClick={() => handleDirectionButton('DOWN')}
          className="bg-white/20 text-white p-3 rounded-lg font-bold"
          whileTap={{ scale: 0.9 }}
        >
          ↓
        </motion.button>
        <div></div>
      </div>

      <div className="text-center text-white/60 text-sm">
        {isActive ? 'Use arrow keys or buttons to move' : 'Game Over!'}
      </div>
    </div>
  )
}