'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { Send, Plus, Copy, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { ChatMessage } from './components/ChatMessage'
import { ConversationHistory } from './components/ConversationHistory'
import { createClient } from '@/lib/utils/supabase/client'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

const AUTO_CLEAR_DELAY = 10 * 60 * 1000 // 10 minutes

export default function ChatPage() {
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const autoRefreshTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Get current user on mount
  useEffect(() => {
    async function getUser() {
      const supabase = createClient()
      const { data: { user }, error } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
      }
    }
    getUser()
  }, [])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]')
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight
      }
    }
  }, [messages])

  // Auto-clear functionality
  const resetAutoRefreshTimer = useCallback(() => {
    if (autoRefreshTimerRef.current) {
      clearTimeout(autoRefreshTimerRef.current)
    }
    
    if (messages.length > 0) {
      autoRefreshTimerRef.current = setTimeout(() => {
        handleClearChat(true)
      }, AUTO_CLEAR_DELAY)
    }
  }, [messages.length])

  useEffect(() => {
    resetAutoRefreshTimer()
    return () => {
      if (autoRefreshTimerRef.current) {
        clearTimeout(autoRefreshTimerRef.current)
      }
    }
  }, [messages, resetAutoRefreshTimer])

  const handleSendMessage = async () => {
    const trimmedMessage = inputValue.trim()
    if (!trimmedMessage || isLoading) return

    const userMessage: Message = {
      role: 'user',
      content: trimmedMessage,
      timestamp: Date.now()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: trimmedMessage,
          history: [...messages, userMessage],
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      const data = await response.json()
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.response,
        timestamp: Date.now()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      toast.error('Failed to send message. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClearChat = async (isAutoRefresh = false) => {
    if (messages.length === 0) return

    try {
      // Save conversation to database
      if (user) {
        const supabase = createClient()
        // Create conversation
        const { data: conversation, error: convError } = await supabase
          .from('conversations')
          .insert({
            user_id: user.id,
            title: messages[0]?.content.substring(0, 100) || 'Untitled',
            conversation_type: 'chat',
            status: 'completed',
            metadata: {}
          })
          .select()
          .single()

        console.log('Conversation save result:', { conversation, convError })

        if (!convError && conversation) {
          // Save messages
          const messagesToSave = messages.map(msg => ({
            conversation_id: conversation.id,
            user_id: user.id,
            role: msg.role,
            content: msg.content,
            metadata: {},
            created_at: new Date(msg.timestamp).toISOString()
          }))

          const { data: savedMessages, error: msgError } = await supabase.from('messages').insert(messagesToSave)
          console.log('Messages save result:', { savedMessages, msgError })
        }
      }
    } catch (error) {
      console.error('Error saving conversation:', error)
    }

    // Clear messages
    setMessages([])
    
    if (!isAutoRefresh) {
      toast.success('Chat cleared. Your conversation has been saved.')
    }
  }

  const handleCopyChat = () => {
    if (messages.length === 0) {
      toast.error('There are no messages to copy.')
      return
    }

    const chatText = messages.map(msg => {
      const time = new Date(msg.timestamp).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
      const role = msg.role === 'user' ? 'You' : 'Assistant'
      return `[${time}] ${role}: ${msg.content}`
    }).join('\n\n')

    navigator.clipboard.writeText(chatText)
    toast.success('Chat conversation copied to clipboard.')
  }

  const handleContinueChat = (loadedMessages: Message[]) => {
    setMessages(loadedMessages)
    toast.success('Previous conversation has been loaded.')
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <ConversationHistory onContinueChat={handleContinueChat} />
      
      <div className="flex-1 flex flex-col min-h-0 border-l">
        <div className="flex justify-between items-center p-4 border-b flex-shrink-0 bg-background">
          <h1 className="text-2xl font-bold">Chat</h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleCopyChat}
              disabled={messages.length === 0}
              title="Copy chat"
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleClearChat(false)}
              disabled={messages.length === 0}
              title="New chat"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <ScrollArea ref={scrollAreaRef} className="flex-1 p-4 min-h-0 bg-background">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground mt-8">
              Start a conversation by typing a message below
            </div>
          ) : (
            <div>
              {messages.map((message, index) => (
                <ChatMessage key={index} message={message} />
              ))}
              {isLoading && (
                <div className="flex items-center gap-2 text-muted-foreground mb-4">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Thinking...</span>
                </div>
              )}
            </div>
          )}
        </ScrollArea>

        <div className="p-4 border-t flex-shrink-0 bg-background">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSendMessage()
            }}
            className="flex gap-2"
          >
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type a message..."
              maxLength={2000}
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
          <div className="text-xs text-muted-foreground mt-1 text-right">
            {inputValue.length}/2000
          </div>
        </div>
      </div>
    </div>
  )
}