/**
 * Chat Persistence Utility
 *
 * Handles localStorage persistence for chat state to maintain
 * conversation continuity when navigating away from the chat page.
 */

const STORAGE_KEY = 'juniper_chat_state'

export interface PersistedMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: number
  imageUrl?: string
}

export interface PersistedChatState {
  messages: PersistedMessage[]
  conversationId: string | null
  currentRequestId: string | null
  loadingStartTime: number | null
  lastUpdated: number
}

/**
 * Save chat state to localStorage
 */
export function saveChatState(state: Omit<PersistedChatState, 'lastUpdated'>): void {
  try {
    const persistedState: PersistedChatState = {
      ...state,
      lastUpdated: Date.now()
    }
    console.log('[CHAT_PERSISTENCE] Saving state:', {
      messageCount: state.messages.length,
      conversationId: state.conversationId,
      currentRequestId: state.currentRequestId,
      loadingStartTime: state.loadingStartTime,
      timestamp: new Date().toISOString()
    })
    localStorage.setItem(STORAGE_KEY, JSON.stringify(persistedState))
    console.log('[CHAT_PERSISTENCE] State saved successfully')
  } catch (error) {
    console.error('[CHAT_PERSISTENCE] Error saving chat state:', error)
  }
}

/**
 * Load chat state from localStorage
 * Returns null if no state exists or state is expired (older than 24 hours)
 */
export function loadChatState(): PersistedChatState | null {
  try {
    console.log('[CHAT_PERSISTENCE] Attempting to load state...')
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) {
      console.log('[CHAT_PERSISTENCE] No stored state found')
      return null
    }

    const state: PersistedChatState = JSON.parse(stored)
    console.log('[CHAT_PERSISTENCE] Found stored state:', {
      messageCount: state.messages.length,
      conversationId: state.conversationId,
      currentRequestId: state.currentRequestId,
      loadingStartTime: state.loadingStartTime,
      lastUpdated: new Date(state.lastUpdated).toISOString(),
      ageMs: Date.now() - state.lastUpdated
    })

    // Expire state after 24 hours
    const EXPIRY_MS = 24 * 60 * 60 * 1000
    if (Date.now() - state.lastUpdated > EXPIRY_MS) {
      console.log('[CHAT_PERSISTENCE] State expired, clearing')
      clearChatState()
      return null
    }

    console.log('[CHAT_PERSISTENCE] Returning valid state')
    return state
  } catch (error) {
    console.error('[CHAT_PERSISTENCE] Error loading chat state:', error)
    return null
  }
}

/**
 * Clear chat state from localStorage
 */
export function clearChatState(): void {
  try {
    console.log('[CHAT_PERSISTENCE] Clearing state')
    localStorage.removeItem(STORAGE_KEY)
    console.log('[CHAT_PERSISTENCE] State cleared successfully')
  } catch (error) {
    console.error('[CHAT_PERSISTENCE] Error clearing chat state:', error)
  }
}
