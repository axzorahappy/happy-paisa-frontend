import { useState, useEffect, useRef, useCallback } from 'react'
import { useSpeechRecognition } from './useSpeechRecognition'

interface UseWakeWordDetectionProps {
  wakeWords?: string[]
  sensitivity?: number
  onWakeWordDetected?: (wakeWord: string) => void
  continuous?: boolean
}

export const useWakeWordDetection = ({
  wakeWords = ['hey mr happy', 'mr happy', 'hey happy', 'happy'],
  sensitivity = 0.7,
  onWakeWordDetected,
  continuous = true
}: UseWakeWordDetectionProps = {}) => {
  const [isWakeWordActive, setIsWakeWordActive] = useState(false)
  const [lastWakeWord, setLastWakeWord] = useState<string | null>(null)
  const [isAlwaysListening, setIsAlwaysListening] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  
  const wakeWordTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastDetectionRef = useRef<number>(0)

  // Continuous listening for wake words
  const {
    isListening: isWakeWordListening,
    transcript: wakeWordTranscript,
    isSupported,
    error,
    startListening: startWakeWordListening,
    stopListening: stopWakeWordListening,
    resetTranscript: resetWakeWordTranscript
  } = useSpeechRecognition({
    continuous: true,
    interimResults: true,
    onResult: (result) => {
      if (result.isFinal) {
        checkForWakeWord(result.transcript)
      }
    },
    onError: (error) => {
      console.warn('Wake word detection error:', error)
    }
  })

  const normalizeText = (text: string): string => {
    return text.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
  }

  const checkForWakeWord = useCallback((transcript: string) => {
    const normalizedTranscript = normalizeText(transcript)
    const now = Date.now()
    
    // Prevent rapid fire detections
    if (now - lastDetectionRef.current < 2000) {
      return
    }

    for (const wakeWord of wakeWords) {
      const normalizedWakeWord = normalizeText(wakeWord)
      
      // Check if wake word is present in transcript
      if (normalizedTranscript.includes(normalizedWakeWord)) {
        console.log('🎤 Wake word detected:', wakeWord)
        
        setLastWakeWord(wakeWord)
        setIsWakeWordActive(true)
        lastDetectionRef.current = now
        
        onWakeWordDetected?.(wakeWord)
        
        // Auto-deactivate after 30 seconds if no interaction
        if (wakeWordTimeoutRef.current) {
          clearTimeout(wakeWordTimeoutRef.current)
        }
        
        wakeWordTimeoutRef.current = setTimeout(() => {
          setIsWakeWordActive(false)
          setLastWakeWord(null)
        }, 30000)
        
        break
      }
    }
  }, [wakeWords, onWakeWordDetected])

  const startWakeWordDetection = useCallback(() => {
    if (isSupported && !isWakeWordListening && !isPaused) {
      setIsAlwaysListening(true)
      startWakeWordListening()
    }
  }, [isSupported, isWakeWordListening, startWakeWordListening, isPaused])

  const stopWakeWordDetection = useCallback(() => {
    setIsAlwaysListening(false)
    stopWakeWordListening()
    setIsWakeWordActive(false)
    setLastWakeWord(null)
    
    if (wakeWordTimeoutRef.current) {
      clearTimeout(wakeWordTimeoutRef.current)
      wakeWordTimeoutRef.current = null
    }
  }, [stopWakeWordListening])

  const pauseWakeWordDetection = useCallback(() => {
    if (isWakeWordListening) {
      stopWakeWordListening()
    }
    setIsPaused(true)
  }, [isWakeWordListening, stopWakeWordListening])

  const resumeWakeWordDetection = useCallback(() => {
    setIsPaused(false)
    if (isAlwaysListening) {
      startWakeWordListening()
    }
  }, [isAlwaysListening, startWakeWordListening])

  const deactivateWakeWord = useCallback(() => {
    setIsWakeWordActive(false)
    setLastWakeWord(null)
    
    if (wakeWordTimeoutRef.current) {
      clearTimeout(wakeWordTimeoutRef.current)
      wakeWordTimeoutRef.current = null
    }
  }, [])

  // Auto-start wake word detection on mount if continuous
  useEffect(() => {
    if (continuous && isSupported) {
      // Small delay to ensure proper initialization
      setTimeout(() => {
        startWakeWordDetection()
      }, 1000)
    }

    return () => {
      if (wakeWordTimeoutRef.current) {
        clearTimeout(wakeWordTimeoutRef.current)
      }
    }
  }, [continuous, isSupported, startWakeWordDetection])

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopWakeWordDetection()
    }
  }, [stopWakeWordDetection])

  return {
    isWakeWordActive,
    lastWakeWord,
    isAlwaysListening,
    isWakeWordListening,
    wakeWordTranscript,
    isSupported,
    error,
    startWakeWordDetection,
    stopWakeWordDetection,
    deactivateWakeWord,
    checkForWakeWord,
    pauseWakeWordDetection,
    resumeWakeWordDetection
  }
}