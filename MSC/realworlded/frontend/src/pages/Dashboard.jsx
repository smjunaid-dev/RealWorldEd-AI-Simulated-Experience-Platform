import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { GraduationCap, Briefcase, Plus, MessageSquare, BarChart3, LogOut, Sparkles } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card'
import { Badge } from '../components/ui/Loader'
import { useAuthStore, useSessionStore } from '../store/store'
import { sessionsAPI } from '../lib/api'
import { formatDate } from '../lib/utils'

export default function Dashboard() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const { sessions, setSessions, setCurrentSession } = useSessionStore()
  const [loading, setLoading] = useState(true)
  const [selectedMode, setSelectedMode] = useState(null)

  useEffect(() => {
    loadSessions()
  }, [])

  const loadSessions = async () => {
    try {
      const response = await sessionsAPI.getAll()
      setSessions(response.data)
    } catch (error) {
      console.error('Failed to load sessions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateSession = (mode) => {
    navigate(`/session-setup?mode=${mode}`)
  }

  const handleSessionClick = (session) => {
    setCurrentSession(session)
    navigate(`/chat/${session.id}`)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const modes = [
    {
      id: 'education',
      title: '🎓 Education Mode',
      description: 'Learn programming through real-world projects and AI mentorship',
      icon: GraduationCap,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'business',
      title: '💼 Business Mode',
      description: 'Test your business ideas and pitch to AI investors',
      icon: Briefcase,
      color: 'from-purple-500 to-pink-500'
    }
  ]

  return (
    <div className="min-h-screen gradient-bg">
      {/* Navbar */}
      <nav className="border-b border-primary/10 glass sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center glow">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold">RealWorldEd</h1>
              <p className="text-xs text-muted-foreground">Welcome, {user?.username}!</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => navigate('/reports')}>
              <BarChart3 className="w-4 h-4 mr-2" />
              Reports
            </Button>
            <Button variant="ghost" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Mode Selection */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-2">Choose Your Learning Path</h2>
          <p className="text-muted-foreground mb-6">Select a mode to start your AI-powered learning journey</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {modes.map((mode) => (
              <motion.div
                key={mode.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card 
                  className="cursor-pointer glass border-primary/20 hover:border-primary/50 transition-all hover:glow overflow-hidden"
                  onClick={() => handleCreateSession(mode.id)}
                >
                  <div className={`h-2 bg-gradient-to-r ${mode.color}`} />
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-2xl mb-2">{mode.title}</CardTitle>
                        <CardDescription className="text-base">{mode.description}</CardDescription>
                      </div>
                      <mode.icon className="w-12 h-12 text-primary opacity-50" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full glow">
                      <Plus className="w-4 h-4 mr-2" />
                      Start New Session
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recent Sessions */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Recent Sessions</h2>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent" />
            </div>
          ) : sessions.length === 0 ? (
            <Card className="glass border-primary/10">
              <CardContent className="py-12 text-center">
                <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">No sessions yet. Start your first session above!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sessions.map((session) => (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Card 
                    className="cursor-pointer glass border-primary/10 hover:border-primary/30 transition-all"
                    onClick={() => handleSessionClick(session)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <Badge variant={session.status === 'completed' ? 'success' : 'default'}>
                          {session.status}
                        </Badge>
                        {session.mode === 'education' ? (
                          <GraduationCap className="w-5 h-5 text-primary" />
                        ) : (
                          <Briefcase className="w-5 h-5 text-primary" />
                        )}
                      </div>
                      <CardTitle className="text-lg">
                        {session.mode === 'education' ? '🎓 Education' : '💼 Business'}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        {session.subject || session.business_type || 'New session'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{formatDate(session.created_at)}</span>
                        <span className="text-primary">Continue →</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
