import React, { useState, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Loader, Settings, Mic, MicOff } from 'lucide-react'
import { api } from '../lib/api'
import { useSpeechRecognition } from '../hooks/useSpeechRecognition'
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis'
import { useWakeWordDetection } from '../hooks/useWakeWordDetection'
import { MrHappyAI } from '../services/mrHappyPersonality'
import { MrHappyAvatar, MrHappyStatusIndicator } from '../components/ui/MrHappyAvatar'
import { VoiceStatus } from '../components/ui/VoiceButton'
import { PopupResponse } from '../components/ui/PopupResponse'
import { cn } from '../lib/utils'

interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
  emotion?: string
  timestamp: Date
  actions?: string[]
}

export default function MrHappyAIPanel() {
  const [messages, setMessages] = useState<Message[]>([])
  const [currentPrompt, setCurrentPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [autoSpeak, setAutoSpeak] = useState(true)
  const [mrHappyEmotion, setMrHappyEmotion] = useState<string>('happy')
  const [popup, setPopup] = useState<{ message: string; emoji: string } | null>(null)
  
  const [inputText, setInputText] = useState('');

  // Mr. Happy AI instance
  const mrHappyRef = useRef(new MrHappyAI())
  const mrHappy = mrHappyRef.current

  // Wake word detection
  const {
    isWakeWordActive,
    lastWakeWord,
    isAlwaysListening,
    startWakeWordDetection,
    stopWakeWordDetection,
    pauseWakeWordDetection,
    resumeWakeWordDetection
  } = useWakeWordDetection({
    wakeWords: ['hey mr happy', 'mr happy', 'hey happy'],
    onWakeWordDetected: (wakeWord) => {
      handleWakeUpDetected(wakeWord)
    }
  })

  // Speech recognition for conversation
  const {
    isListening: isConversationListening,
    transcript,
    isSupported: speechSupported,
    error: speechError,
    startListening: startConversationListening,
    stopListening: stopConversationListening,
    resetTranscript
  } = useSpeechRecognition({
    continuous: false,
    interimResults: true,
    onResult: (result) => {
      if (result.isFinal) {
        handleVoiceInput(result.transcript.trim())
        resetTranscript()
      }
    }
  })

  // Speech synthesis
  const {
    isSpeaking,
    isSupported: speechSynthSupported,
    speak
  } = useSpeechSynthesis({
    rate: 0.9,
    pitch: 1.1,
    volume: 0.8
  })

  // Get current status
  const getCurrentStatus = (): 'idle' | 'listening' | 'thinking' | 'speaking' => {
    if (isSpeaking) return 'speaking'
    if (loading) return 'thinking'
    if (isConversationListening) return 'listening'
    return 'idle'
  }

  // Execute actions with popup feedback
  const executeActions = (actions: string[]) => {
    actions.forEach((action) => {
      const actionMap: { [key: string]: { message: string; emoji: string } } = {
        load_balance: { message: 'Fetching your balance...', emoji: '💰' },
        load_games: { message: 'Loading games...', emoji: '🎮' },
        show_games: { message: 'Showing available games...', emoji: '🎯' },
        show_conversion_rates: { message: 'Checking conversion rates...', emoji: '🔄' },
        get_referral_info: { message: 'Getting referral information...', emoji: '👥' },
        get_reward_history: { message: 'Loading reward history...', emoji: '📜' },
        get_profile_info: { message: 'Getting profile information...', emoji: '👤' },
        show_leaderboard: { message: 'Loading leaderboard...', emoji: '🏆' }
      }
      
      if (actionMap[action]) {
        setPopup(actionMap[action])
        setTimeout(() => setPopup(null), 3000)
      }
    })
  }

  // Handle wake word detection
  const handleWakeUpDetected = useCallback(async (wakeWord: string) => {
    const wakeUpResponse = mrHappy.getWakeUpResponse(wakeWord)
    const wakeUpMessage: Message = {
      id: Date.now().toString(),
      type: 'assistant',
      content: wakeUpResponse.text,
      emotion: wakeUpResponse.emotion,
      timestamp: new Date(),
      actions: wakeUpResponse.actions
    }
    setMessages(prev => [...prev, wakeUpMessage])
    setMrHappyEmotion(wakeUpResponse.emotion)
    if (autoSpeak && speechSynthSupported) {
      speak(wakeUpResponse.text)
    }
    setTimeout(() => startConversationListening(), 1500)
  }, [mrHappy, autoSpeak, speechSynthSupported, speak, startConversationListening])

  const handleVoiceInput = useCallback(async (input: string) => {
    if (!input.trim()) return
    await processUserMessage(input)
  }, [])

  const processUserMessage = async (input: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])
    setLoading(true)
    try {
      let mrHappyResponse = await mrHappy.processUserInput(input, {})

      // Execute actions with popup feedback instead of balance display
      if (mrHappyResponse.actions && mrHappyResponse.actions.length > 0) {
        executeActions(mrHappyResponse.actions)
      }

      if (mrHappyResponse.text.includes('learning and improving')) {
        try {
          const aiResponse = await api('/api/ai/chat', {
            method: 'POST',
            body: JSON.stringify({
              messages: [...messages, userMessage].map(m => ({ role: m.type, content: m.content }))
            }),
            headers: { 'Content-Type': 'application/json' }
          })

          if (aiResponse.content) {
            mrHappyResponse = { ...mrHappyResponse, text: aiResponse.content, emotion: 'thoughtful' };
          }
        } catch (err) {
          console.error('Error calling chat API:', err);
          mrHappyResponse = { ...mrHappyResponse, text: "I'm sorry, I'm having a little trouble connecting to my advanced brain right now. Please try again in a moment." };
        }
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: mrHappyResponse.text,
        emotion: mrHappyResponse.emotion,
        timestamp: new Date(),
        actions: mrHappyResponse.actions
      }
      setMessages(prev => [...prev, assistantMessage])
      setMrHappyEmotion(mrHappyResponse.emotion)
      if (autoSpeak && speechSynthSupported) {
        speak(mrHappyResponse.text)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (currentPrompt.trim()) {
      processUserMessage(currentPrompt)
      setCurrentPrompt('')
    }
  }

  const handleVoiceToggle = () => {
    if (isConversationListening) {
      stopConversationListening()
      // No need to resume here, the useEffect below handles it
    } else {
      pauseWakeWordDetection()
      startConversationListening()
    }
  }

  const toggleWakeWordDetection = () => {
    if (isAlwaysListening) stopWakeWordDetection()
    else startWakeWordDetection()
  }

  useEffect(() => {
    const initialGreeting: Message = {
      id: 'initial',
      type: 'assistant',
      content: 'Hi! I\'m Mr. Happy! 😊 Say "Hey Mr. Happy" to activate me, or just click to chat!',
      emotion: 'happy',
      timestamp: new Date()
    }
    setMessages([initialGreeting])
  }, [])

  // Ensure wake word detection resumes when conversation is over
  useEffect(() => {
    if (!isConversationListening && isAlwaysListening) {
      resumeWakeWordDetection()
    }
  }, [isConversationListening, isAlwaysListening, resumeWakeWordDetection])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 backdrop-blur-sm border border-white/10 rounded-xl p-6 relative overflow-hidden"
    >
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center space-x-3">
          <MrHappyAvatar
            emotion={mrHappyEmotion as any}
            isListening={isConversationListening}
            isSpeaking={isSpeaking}
            isActive={isWakeWordActive || isConversationListening || isSpeaking}
            size="lg"
          />
          <div>
            <h3 className="text-xl font-bold text-white">Mr. Happy</h3>
            <MrHappyStatusIndicator status={getCurrentStatus()} />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <motion.button
            onClick={toggleWakeWordDetection}
            className={cn(
              'p-2 rounded-lg transition-colors',
              isAlwaysListening
                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                : 'bg-white/5 text-white/60 border border-white/10'
            )}
            title={`Wake word detection ${isAlwaysListening ? 'ON' : 'OFF'}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isAlwaysListening ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
          </motion.button>
          <motion.button
            onClick={() => setAutoSpeak(!autoSpeak)}
            className={cn(
              'p-2 rounded-lg transition-colors',
              autoSpeak
                ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                : 'bg-white/5 text-white/60 border border-white/10'
            )}
            title="Auto-speak responses"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Settings className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {isWakeWordActive && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg"
        >
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm text-green-300">
              Mr. Happy is listening! Detected: "{lastWakeWord}"
            </span>
          </div>
        </motion.div>
      )}

      <div className="mb-4 max-h-96 overflow-y-auto space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={cn(
                'flex items-start space-x-3',
                message.type === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {message.type === 'assistant' && (
                <MrHappyAvatar emotion={message.emotion as any} size="sm" isActive={false} />
              )}
              <div className={cn(
                'max-w-xs lg:max-w-md px-4 py-3 rounded-lg shadow-lg',
                message.type === 'user'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                  : 'bg-white/10 text-white border border-white/20 backdrop-blur-sm'
              )}>
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                {message.actions && (
                  <div className="mt-2 text-xs text-white/60">
                    Actions: {message.actions.join(', ')}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start space-x-3">
            <MrHappyAvatar emotion="thoughtful" size="sm" isActive={true} />
            <div className="bg-white/10 text-white border border-white/10 px-4 py-3 rounded-lg backdrop-blur-sm">
              <div className="flex items-center space-x-2">
                <Loader className="w-4 h-4 animate-spin" />
                <span className="text-sm">Mr. Happy is thinking...</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <textarea
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Enter text for Mr. Happy to process (e.g., 'fix this text: ...')"
        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-400 mt-4"
        rows={4}
      />

      <VoiceStatus isListening={isConversationListening} isSpeaking={isSpeaking} transcript={transcript} className="mb-4" />

      <form onSubmit={handleManualSubmit} className="flex items-center space-x-2">
        <div className="flex-1 relative">
          <input
            type="text"
            value={currentPrompt}
            onChange={(e) => setCurrentPrompt(e.target.value)}
            placeholder="Chat with Mr. Happy or use voice..."
            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-400 pr-12"
            disabled={loading}
          />
          <motion.button
            type="button"
            onClick={handleVoiceToggle}
            className={cn(
              'absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full transition-colors',
              isConversationListening ? 'bg-red-500 text-white' : 'bg-purple-600 hover:bg-purple-700 text-white'
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={loading}
          >
            <Mic className="w-4 h-4" />
          </motion.button>
        </div>
        <motion.button
          type="submit"
          disabled={loading || !currentPrompt.trim()}
          className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
          whileHover={{ scale: loading ? 1 : 1.05 }}
          whileTap={{ scale: loading ? 1 : 0.95 }}
        >
          <Send className="w-4 h-4 text-white" />
        </motion.button>
      </form>

      {speechError && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2 text-sm text-red-400">
          Voice Error: {speechError}
        </motion.div>
      )}

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 text-xs text-white/40 text-center">
        💡 Say "Hey Mr. Happy" to activate voice mode, or just type to chat!
      </motion.div>

      {/* Popup Response Component */}
      {popup && (
        <PopupResponse
          message={popup.message}
          emoji={popup.emoji}
          onClose={() => setPopup(null)}
        />
      )}
    </motion.div>
  )
}