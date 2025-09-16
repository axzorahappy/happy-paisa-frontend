import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface WordPuzzleGameProps {
  onGameComplete: (score: number) => void
}

interface WordList {
  word: string
  found: boolean
}

export default function WordPuzzleGame({ onGameComplete }: WordPuzzleGameProps) {
  const [gameStarted, setGameStarted] = useState(false)
  const [currentWord, setCurrentWord] = useState('')
  const [scrambledWord, setScrambledWord] = useState('')
  const [wordList, setWordList] = useState<WordList[]>([])
  const [score, setScore] = useState(0)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState(90)
  const [isActive, setIsActive] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [inputValue, setInputValue] = useState('')

  const words = [
    { word: 'HAPPY', hint: 'Feeling of joy and contentment' },
    { word: 'MONEY', hint: 'Medium of exchange' },
    { word: 'GAME', hint: 'Activity for entertainment' },
    { word: 'REWARD', hint: 'Something given for achievement' },
    { word: 'PUZZLE', hint: 'Problem requiring solution' },
    { word: 'BRAIN', hint: 'Organ for thinking' },
    { word: 'SMART', hint: 'Intelligent and clever' },
    { word: 'QUICK', hint: 'Fast and speedy' },
    { word: 'LEARN', hint: 'Acquire knowledge' },
    { word: 'THINK', hint: 'Use your mind' },
    { word: 'SOLVE', hint: 'Find the answer' },
    { word: 'LOGIC', hint: 'Reasoning and rational thinking' }
  ]

  const scrambleWord = (word: string): string => {
    const letters = word.split('')
    for (let i = letters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      const temp = letters[i]
      letters[i] = letters[j] || ''
      letters[j] = temp || ''
    }
    
    // Make sure it's actually scrambled
    let scrambled = letters.join('')
    let attempts = 0
    while (scrambled === word && attempts < 10) {
      for (let i = letters.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        const temp = letters[i]
        letters[i] = letters[j] || ''
        letters[j] = temp || ''
      }
      scrambled = letters.join('')
      attempts++
    }
    
    return scrambled
  }

  const initializeGame = () => {
    const selectedWords = words.slice(0, 8).map(w => ({ word: w.word, found: false }))
    setWordList(selectedWords)
    setCurrentIndex(0)
    setScore(0)
    setTimeLeft(90)
    setInputValue('')
    setShowHint(false)
    
    // Set first word
    if (selectedWords[0]) {
      setCurrentWord(selectedWords[0].word)
      setScrambledWord(scrambleWord(selectedWords[0].word))
    }
  }

  const startGame = () => {
    initializeGame()
    setIsActive(true)
    setGameStarted(true)
  }

  const nextWord = () => {
    if (currentIndex >= wordList.length - 1) {
      // Game complete
      setIsActive(false)
      onGameComplete(score)
      return
    }

    const nextIndex = currentIndex + 1
    setCurrentIndex(nextIndex)
    if (wordList[nextIndex]) {
      setCurrentWord(wordList[nextIndex].word)
      setScrambledWord(scrambleWord(wordList[nextIndex].word))
    }
    setInputValue('')
    setShowHint(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (inputValue.toUpperCase() === currentWord) {
      // Correct answer
      const points = Math.max(10, 50 - Math.floor((90 - timeLeft) / 2)) // More points for faster solving
      setScore(prev => prev + points)
      
      // Mark word as found
      setWordList(prev => prev.map((w, i) => 
        i === currentIndex ? { ...w, found: true } : w
      ))
      
      setTimeout(nextWord, 1000)
    } else {
      // Wrong answer - shake input
      setInputValue('')
    }
  }

  const getHint = () => {
    setShowHint(true)
    // Deduct points for using hint
    setScore(prev => Math.max(0, prev - 5))
  }

  const skipWord = () => {
    nextWord()
  }

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

  if (!gameStarted) {
    return (
      <div className="text-center space-y-6">
        <div className="text-6xl mb-4">📝</div>
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">Word Puzzle</h3>
          <p className="text-white/70 mb-6">Unscramble the letters to form words!</p>
          <div className="bg-white/10 rounded-lg p-4 mb-6">
            <div className="text-sm text-white/60 space-y-1">
              <p>• Unscramble 8 different words</p>
              <p>• Faster solving = more points</p>
              <p>• Use hints if stuck (costs 5 points)</p>
              <p>• 90 seconds total time limit</p>
            </div>
          </div>
        </div>
        <motion.button
          onClick={startGame}
          className="bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold py-4 px-8 rounded-lg text-xl"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Start Game
        </motion.button>
      </div>
    )
  }

  const currentWordData = words.find(w => w.word === currentWord)

  return (
    <div className="space-y-6">
      {/* Game Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white/10 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-white">{currentIndex + 1}/8</div>
          <div className="text-sm text-white/70">Word</div>
        </div>
        <div className="bg-white/10 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-white">{score}</div>
          <div className="text-sm text-white/70">Score</div>
        </div>
        <div className="bg-white/10 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-400">{timeLeft}s</div>
          <div className="text-sm text-white/70">Time Left</div>
        </div>
      </div>

      {/* Current Word */}
      <div className="bg-white/10 rounded-xl p-6 text-center">
        <div className="text-sm text-white/60 mb-4">Unscramble this word:</div>
        <div className="text-4xl font-bold text-white mb-4 tracking-wider">
          {scrambledWord}
        </div>
        <div className="text-sm text-white/60">
          ({currentWord.length} letters)
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type your answer..."
          className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-lg text-white text-center text-xl placeholder-white/50 focus:outline-none focus:border-purple-400 uppercase"
          maxLength={currentWord.length}
        />
        
        <div className="flex gap-3">
          <motion.button
            type="submit"
            disabled={!inputValue.trim()}
            className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-3 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: inputValue.trim() ? 1.02 : 1 }}
            whileTap={{ scale: inputValue.trim() ? 0.98 : 1 }}
          >
            Submit
          </motion.button>
          
          <motion.button
            type="button"
            onClick={getHint}
            className="bg-yellow-600 text-white font-bold py-3 px-6 rounded-lg"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Hint (-5pts)
          </motion.button>
          
          <motion.button
            type="button"
            onClick={skipWord}
            className="bg-gray-600 text-white font-bold py-3 px-6 rounded-lg"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Skip
          </motion.button>
        </div>
      </form>

      {/* Hint */}
      {showHint && currentWordData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4 text-center"
        >
          <div className="text-yellow-400 font-semibold">💡 Hint:</div>
          <div className="text-white mt-1">{currentWordData.hint}</div>
        </motion.div>
      )}

      {/* Word Progress */}
      <div className="space-y-2">
        <div className="text-white/70 text-sm text-center">Progress</div>
        <div className="grid grid-cols-4 gap-2">
          {wordList.map((word, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg text-center text-sm font-semibold transition-colors ${
                word.found 
                  ? 'bg-green-500/30 text-green-400' 
                  : index === currentIndex 
                    ? 'bg-purple-500/30 text-purple-400 border border-purple-500/50' 
                    : 'bg-white/10 text-white/50'
              }`}
            >
              {word.found ? word.word : '???'}
            </div>
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white/10 rounded-full h-2 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-orange-600 to-red-600"
          animate={{ width: `${((currentIndex + (wordList[currentIndex]?.found ? 1 : 0)) / wordList.length) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  )
}