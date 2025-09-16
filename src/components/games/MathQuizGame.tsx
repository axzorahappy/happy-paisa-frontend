import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'

interface MathQuizGameProps {
  onGameComplete: (score: number) => void
}

interface Question {
  question: string
  answer: number
  options: number[]
  difficulty: 'easy' | 'medium' | 'hard'
}

export default function MathQuizGame({ onGameComplete }: MathQuizGameProps) {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [score, setScore] = useState(0)
  const [questionNumber, setQuestionNumber] = useState(0)
  const [timeLeft, setTimeLeft] = useState(10)
  const [isActive, setIsActive] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [streak, setStreak] = useState(0)
  const [totalQuestions] = useState(10)

  const generateQuestion = useCallback((difficulty: 'easy' | 'medium' | 'hard'): Question => {
    let num1: number, num2: number, operation: string, answer: number

    switch (difficulty) {
      case 'easy':
        num1 = Math.floor(Math.random() * 20) + 1
        num2 = Math.floor(Math.random() * 20) + 1
        operation = Math.random() > 0.5 ? '+' : '-'
        answer = operation === '+' ? num1 + num2 : Math.max(num1, num2) - Math.min(num1, num2)
        break
      case 'medium':
        num1 = Math.floor(Math.random() * 50) + 10
        num2 = Math.floor(Math.random() * 12) + 2
        operation = Math.random() > 0.5 ? '×' : '÷'
        if (operation === '×') {
          answer = num1 * num2
        } else {
          answer = num1
          num1 = answer * num2
        }
        break
      case 'hard':
        num1 = Math.floor(Math.random() * 100) + 50
        num2 = Math.floor(Math.random() * 100) + 50
        const ops = ['+', '-', '×']
        operation = ops[Math.floor(Math.random() * ops.length)] || '+'
        switch (operation) {
          case '+':
            answer = num1 + num2
            break
          case '-':
            answer = Math.max(num1, num2) - Math.min(num1, num2)
            break
          case '×':
            num1 = Math.floor(Math.random() * 20) + 5
            num2 = Math.floor(Math.random() * 20) + 5
            answer = num1 * num2
            break
          default:
            answer = num1 + num2
        }
        break
    }

    const question = `${num1} ${operation} ${num2} = ?`
    
    // Generate wrong options
    const wrongOptions: number[] = []
    while (wrongOptions.length < 3) {
      const wrong = answer + (Math.floor(Math.random() * 20) - 10)
      if (wrong !== answer && !wrongOptions.includes(wrong) && wrong >= 0) {
        wrongOptions.push(wrong)
      }
    }

    const options = [answer, ...wrongOptions].sort(() => Math.random() - 0.5)

    return { question, answer, options, difficulty }
  }, [])

  const getDifficulty = () => {
    if (questionNumber < 3) return 'easy'
    if (questionNumber < 7) return 'medium'
    return 'hard'
  }

  const startGame = () => {
    setIsActive(true)
    setScore(0)
    setQuestionNumber(0)
    setStreak(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setTimeLeft(10)
    
    const firstQuestion = generateQuestion('easy')
    setCurrentQuestion(firstQuestion)
  }

  const nextQuestion = () => {
    if (questionNumber >= totalQuestions - 1) {
      setIsActive(false)
      onGameComplete(score)
      return
    }

    const newQuestionNumber = questionNumber + 1
    setQuestionNumber(newQuestionNumber)
    setSelectedAnswer(null)
    setShowResult(false)
    setTimeLeft(10)
    
    const difficulty = getDifficulty()
    const question = generateQuestion(difficulty)
    setCurrentQuestion(question)
  }

  const handleAnswer = (selectedOption: number) => {
    if (selectedAnswer !== null || !currentQuestion) return

    setSelectedAnswer(selectedOption)
    setShowResult(true)

    const isCorrect = selectedOption === currentQuestion.answer
    if (isCorrect) {
      const points = currentQuestion.difficulty === 'easy' ? 10 : 
                    currentQuestion.difficulty === 'medium' ? 15 : 20
      const bonusPoints = streak >= 3 ? Math.floor(points * 0.5) : 0
      const totalPoints = points + bonusPoints
      
      setScore(prev => prev + totalPoints)
      setStreak(prev => prev + 1)
    } else {
      setStreak(0)
    }

    setTimeout(nextQuestion, 1500)
  }

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isActive && timeLeft > 0 && !showResult) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1)
      }, 1000)
    } else if (timeLeft === 0 && !showResult) {
      handleAnswer(-1) // Wrong answer for timeout
    }
    return () => clearInterval(interval)
  }, [isActive, timeLeft, showResult])

  if (!isActive && questionNumber === 0) {
    return (
      <div className="text-center space-y-6">
        <div className="text-6xl mb-4">🧮</div>
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">Math Quiz Challenge</h3>
          <p className="text-white/70 mb-6">Solve {totalQuestions} math problems as fast as you can!</p>
          <div className="bg-white/10 rounded-lg p-4 mb-6">
            <div className="text-sm text-white/60 space-y-1">
              <p>• Questions get harder as you progress</p>
              <p>• Correct streaks give bonus points</p>
              <p>• 10 seconds per question</p>
              <p>• Easy: 10pts, Medium: 15pts, Hard: 20pts</p>
            </div>
          </div>
        </div>
        <motion.button
          onClick={startGame}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 px-8 rounded-lg text-xl"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Start Quiz
        </motion.button>
      </div>
    )
  }

  if (!currentQuestion) return null

  const difficulty = getDifficulty()
  const difficultyColor = {
    easy: 'text-green-400',
    medium: 'text-yellow-400',
    hard: 'text-red-400'
  }

  return (
    <div className="space-y-6">
      {/* Progress and Stats */}
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-white/10 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-white">{questionNumber + 1}/{totalQuestions}</div>
          <div className="text-xs text-white/70">Question</div>
        </div>
        <div className="bg-white/10 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-white">{score}</div>
          <div className="text-xs text-white/70">Score</div>
        </div>
        <div className="bg-white/10 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-blue-400">{timeLeft}s</div>
          <div className="text-xs text-white/70">Time</div>
        </div>
        <div className="bg-white/10 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-purple-400">{streak}</div>
          <div className="text-xs text-white/70">Streak</div>
        </div>
      </div>

      {/* Difficulty Indicator */}
      <div className="text-center">
        <span className={`font-semibold ${difficultyColor[difficulty]} uppercase text-sm`}>
          {difficulty} Level
        </span>
      </div>

      {/* Question */}
      <div className="bg-white/10 rounded-xl p-6 text-center">
        <div className="text-3xl font-bold text-white mb-4">
          {currentQuestion.question}
        </div>
      </div>

      {/* Answer Options */}
      <div className="grid grid-cols-2 gap-4">
        {currentQuestion.options.map((option, index) => {
          let buttonClass = "p-4 rounded-lg font-semibold text-lg transition-all duration-300 "
          
          if (showResult) {
            if (option === currentQuestion.answer) {
              buttonClass += "bg-green-600 text-white border-2 border-green-400"
            } else if (option === selectedAnswer) {
              buttonClass += "bg-red-600 text-white border-2 border-red-400"
            } else {
              buttonClass += "bg-white/10 text-white/50"
            }
          } else {
            buttonClass += "bg-white/10 text-white hover:bg-white/20 border-2 border-transparent hover:border-white/30"
          }

          return (
            <motion.button
              key={index}
              onClick={() => handleAnswer(option)}
              disabled={showResult || selectedAnswer !== null}
              className={buttonClass}
              whileHover={!showResult ? { scale: 1.02 } : {}}
              whileTap={!showResult ? { scale: 0.98 } : {}}
            >
              {option}
            </motion.button>
          )
        })}
      </div>

      {/* Result Message */}
      {showResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          {selectedAnswer === currentQuestion.answer ? (
            <div className="text-green-400">
              <div className="text-2xl mb-1">✅ Correct!</div>
              {streak >= 3 && <div className="text-sm">🔥 Streak bonus!</div>}
            </div>
          ) : (
            <div className="text-red-400">
              <div className="text-2xl mb-1">❌ Wrong!</div>
              <div className="text-sm">The answer was {currentQuestion.answer}</div>
            </div>
          )}
        </motion.div>
      )}

      {/* Progress Bar */}
      <div className="bg-white/10 rounded-full h-2 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-600 to-purple-600"
          initial={{ width: '100%' }}
          animate={{ width: `${(timeLeft / 10) * 100}%` }}
          transition={{ duration: 1 }}
        />
      </div>
    </div>
  )
}