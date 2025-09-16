import { useState, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, X, Minimize2, MessageCircle, Loader, Mic, MicOff, Volume2, VolumeX } from 'lucide-react'
import { MrHappyAI } from '../services/mrHappyPersonality'
import { MrHappyAvatar } from '../components/ui/MrHappyAvatar'
import { cn } from '../lib/utils'
import { useSpeechRecognition } from '../hooks/useSpeechRecognition'
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis'
import { useWakeWordDetection } from '../hooks/useWakeWordDetection'

interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
  emotion?: string
  timestamp: Date
}

export default function FloatingMrHappy() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [currentInput, setCurrentInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [mrHappyEmotion, setMrHappyEmotion] = useState<string>('happy')
  const [hasNewMessage, setHasNewMessage] = useState(false)
  const [autoSpeak, setAutoSpeak] = useState(true)
  const [showMuteToast, setShowMuteToast] = useState(false)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatWidgetRef = useRef<HTMLDivElement>(null)
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // Get current status for avatar
  const getCurrentStatus = (): 'idle' | 'listening' | 'thinking' | 'speaking' => {
    if (isSpeaking) return 'speaking'
    if (loading) return 'thinking'
    if (isConversationListening) return 'listening'
    return 'idle'
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Handle wake word detection
  const handleWakeUpDetected = useCallback(async (wakeWord: string) => {
    if (!isOpen) {
      setIsOpen(true)
      setHasNewMessage(false)
    }
    
    const wakeUpResponse = mrHappy.getWakeUpResponse(wakeWord)
    const wakeUpMessage: Message = {
      id: Date.now().toString(),
      type: 'assistant',
      content: wakeUpResponse.text,
      emotion: wakeUpResponse.emotion,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, wakeUpMessage])
    setMrHappyEmotion(wakeUpResponse.emotion)
    if (autoSpeak && speechSynthSupported) {
      speak(wakeUpResponse.text)
    }
    setTimeout(() => startConversationListening(), 1500)
  }, [mrHappy, autoSpeak, speechSynthSupported, speak, startConversationListening, isOpen])

  const handleVoiceInput = useCallback(async (input: string) => {
    if (!input.trim()) return
    await processUserMessage(input)
  }, [])

  const handleVoiceToggle = () => {
    if (isConversationListening) {
      stopConversationListening()
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
    // Initial greeting when component mounts
    if (messages.length === 0) {
      const initialGreeting: Message = {
        id: 'initial',
        type: 'assistant',
        content: "Hi! I'm Mr. Happy! 😊 Say 'Hey Mr. Happy' to activate voice mode, or just type to chat!",
        emotion: 'happy',
        timestamp: new Date()
      }
      setMessages([initialGreeting])
    }
  }, [])

  // Ensure wake word detection resumes when conversation is over
  useEffect(() => {
    if (!isConversationListening && isAlwaysListening) {
      resumeWakeWordDetection()
    }
  }, [isConversationListening, isAlwaysListening, resumeWakeWordDetection])

  // Click outside to close and escape key functionality
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && chatWidgetRef.current && !chatWidgetRef.current.contains(event.target as Node)) {
        // Don't close if clicking on the floating button itself
        const target = event.target as HTMLElement
        const isFloatingButton = target.closest('.floating-mr-happy-button')
        
        if (!isFloatingButton) {
          handleClose()
        }
      }
    }

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        handleClose()
      }
    }

    if (isOpen) {
      // Add delay to prevent immediate closing when opening
      const timer = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside)
        document.addEventListener('keydown', handleEscapeKey)
      }, 200)
      
      return () => {
        clearTimeout(timer)
        document.removeEventListener('mousedown', handleClickOutside)
        document.removeEventListener('keydown', handleEscapeKey)
      }
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscapeKey)
    }
  }, [isOpen])

  const processUserMessage = async (input: string) => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])
    setCurrentInput('')
    setLoading(true)

    try {
      let mrHappyResponse = await mrHappy.processUserInput(input, {})

      // Use only built-in Mr. Happy responses (no external API needed)

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: mrHappyResponse.text,
        emotion: mrHappyResponse.emotion,
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, assistantMessage])
      setMrHappyEmotion(mrHappyResponse.emotion)
      
      // Speak the response if auto-speak is enabled
      if (autoSpeak && speechSynthSupported) {
        speak(mrHappyResponse.text)
      }
      
      // Show notification if chat is closed
      if (!isOpen) {
        setHasNewMessage(true)
      }
    } catch (error) {
      console.error('Error processing message:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: "Sorry, I'm having a little trouble right now. Please try again!",
        emotion: 'confused',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (currentInput.trim() && !loading) {
      processUserMessage(currentInput.trim())
    }
  }

  const handleOpen = () => {
    setIsOpen(true)
    setIsMinimized(false)
    setHasNewMessage(false)
  }

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const newAutoSpeak = !autoSpeak
    setAutoSpeak(newAutoSpeak)
    
    // Show toast notification
    setShowMuteToast(true)
    setTimeout(() => setShowMuteToast(false), 2000)
  }

  const toggleAutoSpeak = () => {
    const newAutoSpeak = !autoSpeak
    setAutoSpeak(newAutoSpeak)
    
    // Show toast notification
    setShowMuteToast(true)
    setTimeout(() => setShowMuteToast(false), 2000)
  }

  const handleClose = () => {
    setIsOpen(false)
    setIsMinimized(false)
    // Resume wake word detection when closing
    if (isAlwaysListening && !isConversationListening) {
      resumeWakeWordDetection()
    }
  }

  const handleMinimize = () => {
    setIsMinimized(true)
    setIsOpen(false)
  }

  return (
    <>
      {/* Floating Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleOpen}
            onDoubleClick={handleDoubleClick}
            className="floating-mr-happy-button fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
            title={`Click to open chat • Double-click to ${autoSpeak ? 'mute' : 'unmute'} Mr. Happy`}
          >
            <div className="relative">
              <MrHappyAvatar
                emotion={mrHappyEmotion as any}
                size="sm"
                isActive={isWakeWordActive || isConversationListening || isSpeaking}
                isListening={isConversationListening}
                isSpeaking={isSpeaking}
              />
              {hasNewMessage && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              )}
              {isAlwaysListening && (
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              )}
              {/* Quick mute indicator */}
              {!autoSpeak && (
                <div className="absolute -top-1 -left-1 w-4 h-4 bg-gray-600 rounded-full flex items-center justify-center">
                  <VolumeX className="w-2 h-2 text-white" />
                </div>
              )}
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Widget */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={chatWidgetRef}
            initial={{ scale: 0, opacity: 0, y: 100 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0, y: 100 }}
            className="fixed bottom-6 right-6 z-50 w-80 h-96 bg-black/90 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-b border-white/10">
              <div className="flex items-center space-x-3">
                <MrHappyAvatar
                  emotion={mrHappyEmotion as any}
                  size="sm"
                  isActive={loading}
                  isListening={false}
                  isSpeaking={false}
                />
                <div>
                  <h3 className="text-white font-medium">Mr. Happy</h3>
                  <p className="text-xs text-white/60">Your AI Assistant</p>
                </div>
              </div>
              <div className="flex space-x-1">
                <button
                  onClick={toggleWakeWordDetection}
                  className={cn(
                    'p-2 rounded-lg transition-colors',
                    isAlwaysListening
                      ? 'bg-green-500/20 text-green-400'
                      : 'text-white/60 hover:text-white/80 hover:bg-white/10'
                  )}
                  title={`Wake word detection ${isAlwaysListening ? 'ON' : 'OFF'}`}
                >
                  {isAlwaysListening ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                </button>
                <button
                  onClick={toggleAutoSpeak}
                  className={cn(
                    'p-2 rounded-lg transition-colors',
                    autoSpeak
                      ? 'bg-blue-500/20 text-blue-400'
                      : 'bg-red-500/20 text-red-400 hover:text-red-300'
                  )}
                  title={`${autoSpeak ? 'Mute' : 'Unmute'} Mr. Happy`}
                >
                  {autoSpeak ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>
                <button
                  onClick={handleMinimize}
                  className="p-2 text-white/60 hover:text-white/80 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <Minimize2 className="w-4 h-4" />
                </button>
                <button
                  onClick={handleClose}
                  className="p-2 text-white/60 hover:text-white/80 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 h-64">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    'flex items-start space-x-3',
                    message.type === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  {message.type === 'assistant' && (
                    <MrHappyAvatar
                      emotion={message.emotion as any}
                      size="sm"
                      isActive={false}
                      isListening={false}
                      isSpeaking={false}
                    />
                  )}
                  <div
                    className={cn(
                      'max-w-xs px-3 py-2 rounded-lg text-sm',
                      message.type === 'user'
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                        : 'bg-white/10 text-white border border-white/20'
                    )}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))}
              
              {loading && (
                <div className="flex items-start space-x-3">
                  <MrHappyAvatar
                    emotion="thoughtful"
                    size="sm"
                    isActive={true}
                    isListening={false}
                    isSpeaking={false}
                  />
                  <div className="bg-white/10 text-white border border-white/10 px-3 py-2 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Loader className="w-3 h-3 animate-spin" />
                      <span className="text-sm">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Voice Status */}
            {isWakeWordActive && (
              <div className="px-4 py-2 bg-green-500/20 border-y border-green-500/30">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-xs text-green-300">
                    Wake word detected: "{lastWakeWord}"
                  </span>
                </div>
              </div>
            )}
            
            {transcript && (
              <div className="px-4 py-2 bg-blue-500/20 border-y border-blue-500/30">
                <div className="text-xs text-blue-300">
                  Listening: "{transcript}"
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-white/10">
              <form onSubmit={handleSubmit} className="flex space-x-2">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={currentInput}
                    onChange={(e) => setCurrentInput(e.target.value)}
                    placeholder={isConversationListening ? "Listening..." : "Ask Mr. Happy anything..."}
                    className="w-full px-3 py-2 pr-10 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-400 text-sm"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={handleVoiceToggle}
                    className={cn(
                      'absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full transition-colors',
                      isConversationListening 
                        ? 'bg-red-500 text-white' 
                        : 'bg-purple-600 hover:bg-purple-700 text-white'
                    )}
                    disabled={loading || !speechSupported}
                  >
                    <Mic className="w-3 h-3" />
                  </button>
                </div>
                <button
                  type="submit"
                  disabled={loading || !currentInput.trim()}
                  className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                >
                  <Send className="w-4 h-4 text-white" />
                </button>
              </form>
              
              {speechError && (
                <div className="mt-2 text-xs text-red-400">
                  Voice Error: {speechError}
                </div>
              )}
              
              <div className="mt-2 text-xs text-white/40 text-center space-y-1">
                <div>💡 Say "Hey Mr. Happy" or use the mic button!</div>
                <div>{autoSpeak ? '🔊' : '🔇'} Double-click floating button to {autoSpeak ? 'mute' : 'unmute'}</div>
                <div>💆 Click outside or press ESC to close chat</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mute/Unmute Toast Notification */}
      <AnimatePresence>
        {showMuteToast && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="fixed bottom-24 right-6 z-50 bg-black/90 backdrop-blur-xl border border-white/20 rounded-lg p-3 shadow-xl"
          >
            <div className="flex items-center space-x-2">
              {autoSpeak ? (
                <Volume2 className="w-4 h-4 text-blue-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-red-400" />
              )}
              <span className="text-white text-sm font-medium">
                Mr. Happy {autoSpeak ? 'unmuted' : 'muted'}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}