import { useState, useEffect, useRef, useCallback } from 'react'

interface UseSpeechSynthesisProps {
  voice?: SpeechSynthesisVoice | null
  rate?: number
  pitch?: number
  volume?: number
  onStart?: () => void
  onEnd?: () => void
  onError?: (error: string) => void
}

export const useSpeechSynthesis = ({
  voice = null,
  rate = 1,
  pitch = 1,
  volume = 1,
  onStart,
  onEnd,
  onError
}: UseSpeechSynthesisProps = {}) => {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  // Initialize speech synthesis and load voices
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsSupported(true)

      const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices()
        setVoices(availableVoices)
      }

      // Load voices
      loadVoices()
      
      // Voices might load asynchronously
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices
      }
    } else {
      setIsSupported(false)
    }
  }, [])

  const speak = useCallback((text: string) => {
    if (!isSupported || !text.trim()) {
      onError?.('Speech synthesis not supported or empty text')
      return
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utteranceRef.current = utterance

    // Set utterance properties
    utterance.voice = voice
    utterance.rate = rate
    utterance.pitch = pitch
    utterance.volume = volume

    utterance.onstart = () => {
      setIsSpeaking(true)
      setIsPaused(false)
      onStart?.()
    }

    utterance.onend = () => {
      setIsSpeaking(false)
      setIsPaused(false)
      onEnd?.()
    }

    utterance.onerror = (event) => {
      setIsSpeaking(false)
      setIsPaused(false)
      onError?.(`Speech synthesis error: ${event.error}`)
    }

    utterance.onpause = () => {
      setIsPaused(true)
    }

    utterance.onresume = () => {
      setIsPaused(false)
    }

    window.speechSynthesis.speak(utterance)
  }, [isSupported, voice, rate, pitch, volume, onStart, onEnd, onError])

  const pause = useCallback(() => {
    if (isSupported && isSpeaking && !isPaused) {
      window.speechSynthesis.pause()
    }
  }, [isSupported, isSpeaking, isPaused])

  const resume = useCallback(() => {
    if (isSupported && isSpeaking && isPaused) {
      window.speechSynthesis.resume()
    }
  }, [isSupported, isSpeaking, isPaused])

  const cancel = useCallback(() => {
    if (isSupported) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
      setIsPaused(false)
    }
  }, [isSupported])

  // Get a female voice if available, otherwise default
  const getPreferredVoice = useCallback(() => {
    if (!voices.length) return null
    
    // Try to find a female English voice
    const femaleVoice = voices.find(voice => 
      voice.lang.startsWith('en') && 
      (voice.name.toLowerCase().includes('female') || 
       voice.name.toLowerCase().includes('samantha') ||
       voice.name.toLowerCase().includes('karen') ||
       voice.name.toLowerCase().includes('monica'))
    )
    
    if (femaleVoice) return femaleVoice
    
    // Fallback to any English voice
    const englishVoice = voices.find(voice => voice.lang.startsWith('en'))
    return englishVoice || voices[0] || null
  }, [voices])

  return {
    isSpeaking,
    isPaused,
    isSupported,
    voices,
    speak,
    pause,
    resume,
    cancel,
    getPreferredVoice
  }
}