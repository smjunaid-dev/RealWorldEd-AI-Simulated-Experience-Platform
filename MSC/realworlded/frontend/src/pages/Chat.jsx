import React, { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, ArrowLeft, Sparkles, Bot, User, CheckCircle2, Trophy } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card } from '../components/ui/Card'
import { TypingIndicator } from '../components/ui/Loader'
import { useSessionStore, useChatStore, useAuthStore } from '../store/store'
import { chatAPI, sessionsAPI, evaluationAPI } from '../lib/api'
import { cn } from '../lib/utils'

export default function Chat() {
  const { sessionId } = useParams()
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const { currentSession, setCurrentSession } = useSessionStore()
  const { messages, setMessages, addMessage, isTyping, setTyping } = useChatStore()
  
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    loadSession()
    loadMessages()
  }, [sessionId])

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const loadSession = async () => {
    try {
      const response = await sessionsAPI.getOne(sessionId)
      setCurrentSession(response.data)
    } catch (error) {
      console.error('Failed to load session:', error)
      navigate('/dashboard')
    }
  }

  const loadMessages = async () => {
    try {
      const response = await chatAPI.getMessages(sessionId)
      setMessages(response.data)
    } catch (error) {
      console.error('Failed to load messages:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: input,
      created_at: new Date().toISOString()
    }

    addMessage(userMessage)
    setInput('')
    setTyping(true)

    try {
      const response = await chatAPI.sendMessage({
        message: input,
        session_id: parseInt(sessionId)
      })

      const aiMessage = {
        id: Date.now() + 1,
        role: response.data.agent_type,
        content: response.data.message,
        agent_type: response.data.agent_type,
        created_at: new Date().toISOString()
      }

      addMessage(aiMessage)

      // Update session if needed
      if (response.data.session_update) {
        await sessionsAPI.update(sessionId, response.data.session_update)
        await loadSession()
      }
    } catch (error) {
      console.error('Failed to send message:', error)
      addMessage({
        id: Date.now() + 1,
        role: 'error',
        content: 'Sorry, something went wrong. Please try again.',
        created_at: new Date().toISOString()
      })
    } finally {
      setTyping(false)
    }
  }

  const handleEvaluate = async () => {
    if (messages.length < 5) {
      alert('Continue the conversation to get evaluated!')
      return
    }

    try {
      const response = await evaluationAPI.evaluate({ session_id: parseInt(sessionId) })
      navigate(`/report/${response.data.report.id}`)
    } catch (error) {
      console.error('Failed to evaluate:', error)
      alert(error.response?.data?.detail || 'Evaluation failed')
    }
  }

  const getAgentIcon = (role) => {
    switch (role) {
      case 'user':
        return <User className="w-5 h-5" />
      case 'mentor':
        return <Sparkles className="w-5 h-5 text-blue-400" />
      case 'client':
        return <Bot className="w-5 h-5 text-purple-400" />
      case 'evaluator':
        return <CheckCircle2 className="w-5 h-5 text-green-400" />
      default:
        return <Bot className="w-5 h-5 text-primary" />
    }
  }

  const getAgentName = (role) => {
    switch (role) {
      case 'user':
        return user?.username || 'You'
      case 'mentor':
        return 'AI Mentor'
      case 'client':
        return 'Client/Investor'
      case 'evaluator':
        return 'Evaluator'
      default:
        return 'AI'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mb-4" />
          <p className="text-muted-foreground">Loading session...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen gradient-bg flex flex-col">
      {/* Header */}
      <div className="border-b border-primary/10 glass sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-lg font-bold">
                  {currentSession?.mode === 'education' ? '🎓 Education Mode' : '💼 Business Mode'}
                </h1>
                <p className="text-xs text-muted-foreground">
                  {currentSession?.subject || currentSession?.business_type || 'AI Simulation'}
                </p>
              </div>
            </div>
            <Button onClick={handleEvaluate} className="glow">
              <Trophy className="w-4 h-4 mr-2" />
              Get Evaluated
            </Button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 container mx-auto px-4 py-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-4">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={message.id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className={cn(
                  'flex gap-3',
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                {message.role !== 'user' && (
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 glow">
                    {getAgentIcon(message.role)}
                  </div>
                )}
                
                <div
                  className={cn(
                    'max-w-[70%] rounded-2xl px-4 py-3',
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground ml-auto'
                      : 'glass border border-primary/20'
                  )}
                >
                  {message.role !== 'user' && (
                    <p className="text-xs font-semibold text-primary mb-1">
                      {getAgentName(message.role)}
                    </p>
                  )}
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>

                {message.role === 'user' && (
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    {getAgentIcon(message.role)}
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3 items-start"
            >
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 glow">
                <Bot className="w-5 h-5 text-primary" />
              </div>
              <TypingIndicator />
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-primary/10 glass sticky bottom-0">
        <div className="container mx-auto px-4 py-4">
          <div className="max-w-4xl mx-auto flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your message..."
              className="flex-1"
              disabled={isTyping}
            />
            <Button onClick={handleSend} disabled={isTyping || !input.trim()} className="glow">
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
