import { cn } from '@/lib/utils'
import ReactMarkdown from 'react-markdown'
import { User, Bot } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: number
  imageUrl?: string
}

interface ChatMessageProps {
  message: Message
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user'
  
  return (
    <div className={cn(
      "flex gap-2 md:gap-3 mb-3 md:mb-4 last:mb-0",
      isUser ? "justify-end" : "justify-start"
    )}>
      {!isUser && (
        <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Bot className="h-3 w-3 md:h-4 md:w-4 text-primary" />
        </div>
      )}
      
      <div className={cn(
        "max-w-[85%] md:max-w-[80%] rounded-lg px-3 md:px-4 py-2 md:py-3",
        isUser ? "bg-primary text-primary-foreground" : "bg-muted"
      )}>
        {/* Image Display */}
        {message.imageUrl && (
          <div className="mb-3">
            <img
              src={message.imageUrl}
              alt="Shared image"
              className="max-w-full h-auto rounded-lg border border-border cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => window.open(message.imageUrl, '_blank')}
              style={{ maxHeight: '300px', objectFit: 'contain' }}
            />
          </div>
        )}
        
        {/* Text Content */}
        {message.content && (
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown
              components={{
                p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                ul: ({ children }) => <ul className="mb-2 list-disc pl-4">{children}</ul>,
                ol: ({ children }) => <ol className="mb-2 list-decimal pl-4">{children}</ol>,
                li: ({ children }) => <li className="mb-1">{children}</li>,
                code: ({ node, inline, className, children, ...props }) => {
                  if (inline) {
                    return <code className="px-1 py-0.5 rounded bg-black/10 dark:bg-white/10 font-mono text-sm" {...props}>{children}</code>
                  }
                  return (
                    <pre className="overflow-x-auto p-2 rounded bg-black/10 dark:bg-white/10">
                      <code className="font-mono text-sm" {...props}>{children}</code>
                    </pre>
                  )
                },
                a: ({ children, href }) => (
                  <a href={href} target="_blank" rel="noopener noreferrer" className="underline hover:no-underline">
                    {children}
                  </a>
                ),
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        )}
        <div className={cn(
          "text-xs mt-2 opacity-60",
          isUser ? "text-primary-foreground" : "text-foreground"
        )}>
          {new Date(message.timestamp).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </div>
      </div>
      
      {isUser && (
        <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
          <User className="h-3 w-3 md:h-4 md:w-4 text-primary-foreground" />
        </div>
      )}
    </div>
  )
}