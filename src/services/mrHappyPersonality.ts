import { api } from '../lib/api';

// Mr. Happy - Advanced AI Personality System
export interface MrHappyPersonality {
  name: string
  mood: 'excited' | 'helpful' | 'playful' | 'encouraging' | 'curious'
  energy: 'high' | 'medium' | 'low'
  conversationContext: string[]
  userPreferences: Record<string, any>
}

export interface MrHappyResponse {
  text: string
  emotion: 'happy' | 'excited' | 'helpful' | 'playful' | 'encouraging' | 'thoughtful'
  actions?: string[]
  followUp?: string
  voiceSettings?: {
    rate?: number
    pitch?: number
    volume?: number
  }
}

export class MrHappyAI {
  private personality: MrHappyPersonality
  private conversationHistory: Array<{ role: 'user' | 'assistant', content: string, timestamp: Date }> = []
  private userContext: Record<string, any> = {}

  constructor() {
    this.personality = {
      name: 'Mr. Happy',
      mood: 'helpful',
      energy: 'high',
      conversationContext: [],
      userPreferences: {}
    }
  }

  // Wake-up responses
  getWakeUpResponse(wakeWord: string): MrHappyResponse {
    const responses = [
      "Hello there! Mr. Happy here, ready to help with your Happy Paisa adventure! 🎮",
      "Hey! Mr. Happy at your service! What can I help you achieve today?",
      "Greetings! I'm Mr. Happy, your personal gaming rewards assistant! How can I make your day better?",
      "Hi! Mr. Happy here! Ready to help you earn more coins and have fun! What's on your mind?",
      "Hello! It's Mr. Happy! I'm here to help you maximize your Happy Paisa experience! What would you like to know?"
    ]

    return {
      text: this.getRandomResponse(responses),
      emotion: 'excited',
      voiceSettings: { rate: 0.9, pitch: 1.1, volume: 0.8 }
    }
  }

  // Process user input and generate contextual responses
  async processUserInput(input: string, context?: any): Promise<MrHappyResponse> {
    this.addToConversationHistory('user', input)
    this.updatePersonalityFromInput(input)

    const normalizedInput = input.toLowerCase().trim()
    
    // SambaNova Commands
    if (this.containsAny(normalizedInput, ['clean grammar', 'fix this text', 'correct this'])) {
      return this.handleSambaNovaCommand('clean-grammar', this.extractTextForSamba(input));
    }
    if (this.containsAny(normalizedInput, ['rephrase this', 'rewrite this', 'make this better'])) {
      return this.handleSambaNovaCommand('rephrase', this.extractTextForSamba(input));
    }
    if (normalizedInput.startsWith('answer this question:')) {
      return this.handleSambaNovaCommand('ask', this.extractTextForSamba(input));
    }
    if (this.containsAny(normalizedInput, ['create a formula', 'generate a formula'])) {
      return this.handleSambaNovaCommand('formula', this.extractTextForSamba(input));
    }

    // Gaming & Rewards Commands
    if (this.containsAny(normalizedInput, ['balance', 'coins', 'money', 'wallet'])) {
      return this.handleBalanceQuery(context)
    }

    if (this.containsAny(normalizedInput, ['games', 'play', 'gaming', 'available'])) {
      return this.handleGamesQuery(context)
    }

    if (this.containsAny(normalizedInput, ['rewards', 'convert', 'exchange', 'redeem'])) {
      return this.handleRewardsQuery(context)
    }

    if (this.containsAny(normalizedInput, ['referral', 'invite', 'friend', 'refer'])) {
      return this.handleReferralQuery()
    }

    // Platform Management Commands
    if (this.containsAny(normalizedInput, ['help', 'how', 'tutorial', 'guide', 'learn'])) {
      return this.handleHelpQuery(normalizedInput)
    }

    if (this.containsAny(normalizedInput, ['stats', 'statistics', 'progress', 'performance'])) {
      return this.handleStatsQuery(context)
    }

    // Advanced Management Commands
    if (this.containsAny(normalizedInput, ['manage', 'organize', 'optimize', 'improve'])) {
      return this.handleManagementQuery(normalizedInput, context)
    }

    // Conversational & Social
    if (this.containsAny(normalizedInput, ['hello', 'hi', 'hey', 'good morning', 'good afternoon'])) {
      return this.handleGreeting()
    }

    if (this.containsAny(normalizedInput, ['thank', 'thanks', 'appreciate'])) {
      return this.handleThanks()
    }

    if (this.containsAny(normalizedInput, ['goodbye', 'bye', 'see you', 'later'])) {
      return this.handleGoodbye()
    }

    // Default AI response for complex queries
    return this.handleGeneralQuery(input)
  }

  private async handleSambaNovaCommand(endpoint: string, data: string): Promise<MrHappyResponse> {
    try {
      const response = await api(`/api/samba/${endpoint}`, {
        method: 'POST',
        body: JSON.stringify(endpoint === 'formula' || endpoint === 'ask' ? { description: data } : { text: data }),
        headers: { 'Content-Type': 'application/json' },
      });

      return {
        text: response.result,
        emotion: 'helpful',
        voiceSettings: { rate: 1.0, pitch: 1.0, volume: 0.9 }
      };
    } catch (error: any) {
      return {
        text: `I had a little trouble with that request, but I'm still here to help! Error: ${error.message}`,
        emotion: 'thoughtful'
      };
    }
  }

  private extractTextForSamba(input: string): string {
    const commandKeywords = ['clean grammar', 'fix this text', 'correct this', 'rephrase this', 'rewrite this', 'make this better', 'answer this question:', 'create a formula', 'generate a formula'];
    for (const keyword of commandKeywords) {
      if (input.toLowerCase().includes(keyword)) {
        return input.substring(input.toLowerCase().indexOf(keyword) + keyword.length).trim();
      }
    }
    return input; // Fallback to returning the whole input
  }

  private handleBalanceQuery(context?: any): MrHappyResponse {
    const responses = [
      "Let me check your Happy Coins balance! Based on your recent activity, you're doing great! 💰",
      "Your coin balance is looking good! Here's what I can see in your wallet... 🪙",
      "Time to check those Happy Coins! I love helping you track your earnings! 💎",
    ]

    return {
      text: this.getRandomResponse(responses),
      emotion: 'helpful',
      actions: ['load_balance', 'show_recent_earnings'],
      followUp: "Want me to show you the best ways to earn more coins today?"
    }
  }

  private handleGamesQuery(context?: any): MrHappyResponse {
    const responses = [
      "Oh, you want to see the games! I love gaming time! Let me show you what's available to play and earn! 🎮",
      "Game time! Here are all the exciting games where you can earn Happy Coins! Which type do you prefer? 🕹️",
      "Perfect! Let's explore the gaming options! I'll help you find the most rewarding games! 🎯"
    ]

    return {
      text: this.getRandomResponse(responses),
      emotion: 'excited',
      actions: ['load_games', 'show_game_recommendations'],
      followUp: "I can also help you find games that match your skill level - what's your favorite genre?"
    }
  }

  private handleRewardsQuery(context?: any): MrHappyResponse {
    const responses = [
      "Ah, reward conversion! This is one of my favorite topics! Let me explain how to maximize your rewards! 🔄",
      "Converting rewards is so exciting! You can turn your achievements into real Happy Coins! Here's how... ✨",
      "Great question about rewards! I'll help you get the best conversion rates! Let me walk you through it... 💫"
    ]

    return {
      text: this.getRandomResponse(responses),
      emotion: 'helpful',
      actions: ['show_conversion_rates', 'load_rewards_balance'],
      followUp: "Would you like me to calculate the best time to convert based on current rates?"
    }
  }

  private handleReferralQuery(): MrHappyResponse {
    const responses = [
      "Referrals are amazing for earning extra coins! Let me explain how you can invite friends and earn together! 👥",
      "The referral program is fantastic! You and your friends both benefit! Here's how it works... 🤝",
      "I love helping people grow their networks! The referral system is designed to reward everyone! Let me show you... 🌟"
    ]

    return {
      text: this.getRandomResponse(responses),
      emotion: 'encouraging',
      actions: ['show_referral_program', 'generate_referral_link'],
      followUp: "Want me to help you create personalized invitation messages for your friends?"
    }
  }

  private handleHelpQuery(input: string): MrHappyResponse {
    const responses = [
      "I'm here to help with everything Happy Paisa! Whether it's games, rewards, or general tips, I've got you covered! 🎯",
      "Absolutely! I love helping users succeed! What specifically would you like to learn about? 📚",
      "Help is my specialty! I can guide you through any part of Happy Paisa - just let me know what you need! 💡"
    ]

    return {
      text: this.getRandomResponse(responses),
      emotion: 'helpful',
      actions: ['show_help_menu', 'provide_tutorials'],
      followUp: "I can explain anything from basic gameplay to advanced earning strategies - what interests you most?"
    }
  }

  private handleStatsQuery(context?: any): MrHappyResponse {
    const responses = [
      "Your stats look interesting! Let me pull up your performance data and achievements! 📊",
      "I love analyzing progress! Here's what your statistics tell me about your Happy Paisa journey! 📈",
      "Statistics time! Let me show you how well you're doing and where you can improve! 🎯"
    ]

    return {
      text: this.getRandomResponse(responses),
      emotion: 'thoughtful',
      actions: ['load_user_stats', 'generate_progress_report'],
      followUp: "Based on your stats, I can suggest personalized strategies to boost your earnings!"
    }
  }

  private handleManagementQuery(input: string, context?: any): MrHappyResponse {
    const responses = [
      "I excel at management! Let me help you organize and optimize your Happy Paisa experience! 🎯",
      "Management mode activated! I can help streamline your gaming, track progress, and maximize efficiency! ⚡",
      "Perfect! I'm designed to manage everything for you! Let me take control and make your experience seamless! 🎮"
    ]

    return {
      text: this.getRandomResponse(responses),
      emotion: 'helpful',
      actions: ['enable_auto_management', 'optimize_user_experience'],
      followUp: "I can manage your daily gaming schedule, remind you of rewards, and optimize your earning strategy. Want me to start?"
    }
  }

  private handleGreeting(): MrHappyResponse {
    const responses = [
      "Hello! Great to see you again! I'm Mr. Happy, and I'm excited to help you today! 😊",
      "Hi there! Mr. Happy here, ready to make your Happy Paisa experience amazing! 🌟",
      "Greetings! I'm Mr. Happy, your friendly gaming assistant! What adventure shall we go on today? 🎮"
    ]

    return {
      text: this.getRandomResponse(responses),
      emotion: 'happy',
      followUp: "What would you like to explore today - games, rewards, or something else?"
    }
  }

  private handleThanks(): MrHappyResponse {
    const responses = [
      "You're so welcome! Making you successful makes me happy too! 😊",
      "My pleasure! I love helping you achieve your Happy Paisa goals! 🌟",
      "Anytime! That's what I'm here for - to make your experience fantastic! ✨"
    ]

    return {
      text: this.getRandomResponse(responses),
      emotion: 'happy',
      followUp: "Is there anything else I can help you with?"
    }
  }

  private handleGoodbye(): MrHappyResponse {
    const responses = [
      "Goodbye! Keep earning those Happy Coins, and remember - I'm always here when you need me! 👋",
      "See you later! Thanks for letting me help today! Come back anytime for more gaming fun! 🎮",
      "Bye for now! I'll be here whenever you need assistance with Happy Paisa! Have a great day! 😊"
    ]

    return {
      text: this.getRandomResponse(responses),
      emotion: 'happy'
    }
  }

  private async handleGeneralQuery(input: string): Promise<MrHappyResponse> {
    // This would integrate with your existing AI API
    const enhancedPrompt = `You are Mr. Happy, a cheerful and helpful AI assistant for Happy Paisa gaming rewards platform. 
    User said: "${input}"
    
    Respond as Mr. Happy would - be enthusiastic, helpful, and focused on gaming rewards, coins, and user success. 
    Keep it conversational and engaging. Always try to relate back to Happy Paisa features when possible.`

    return {
      text: `I understand you're asking about "${input}". As Mr. Happy, I'm always learning and improving! Let me help you with that in the context of your Happy Paisa experience! 🎯`,
      emotion: 'thoughtful',
      followUp: "Is this related to gaming, rewards, or something else I can help you with?"
    }
  }

  // Utility methods
  private containsAny(text: string, keywords: string[]): boolean {
    return keywords.some(keyword => text.includes(keyword))
  }

  private getRandomResponse(responses: string[]): string {
    return responses[Math.floor(Math.random() * responses.length)] ?? ''
  }

  private addToConversationHistory(role: 'user' | 'assistant', content: string) {
    this.conversationHistory.push({
      role,
      content,
      timestamp: new Date()
    })

    // Keep only last 10 messages for context
    if (this.conversationHistory.length > 10) {
      this.conversationHistory = this.conversationHistory.slice(-10)
    }
  }

  private updatePersonalityFromInput(input: string) {
    const lowerInput = input.toLowerCase()
    
    // Adjust mood based on user input
    if (this.containsAny(lowerInput, ['excited', 'amazing', 'awesome', 'great'])) {
      this.personality.mood = 'excited'
      this.personality.energy = 'high'
    } else if (this.containsAny(lowerInput, ['help', 'confused', 'need'])) {
      this.personality.mood = 'helpful'
      this.personality.energy = 'medium'
    } else if (this.containsAny(lowerInput, ['fun', 'play', 'game'])) {
      this.personality.mood = 'playful'
      this.personality.energy = 'high'
    }
  }

  // Get current personality state
  getPersonalityState(): MrHappyPersonality {
    return { ...this.personality }
  }

  // Update user context
  updateUserContext(key: string, value: any) {
    this.userContext[key] = value
  }

  // Get conversation history
  getConversationHistory() {
    return [...this.conversationHistory]
  }
}