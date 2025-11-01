import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Trophy, TrendingUp, MessageSquare, Brain, Target } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card'
import { Badge } from '../components/ui/Loader'
import { evaluationAPI } from '../lib/api'
import { formatDate, getScoreColor } from '../lib/utils'
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

export default function Reports() {
  const navigate = useNavigate()
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadReports()
  }, [])

  const loadReports = async () => {
    try {
      const response = await evaluationAPI.getReports()
      setReports(response.data)
    } catch (error) {
      console.error('Failed to load reports:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateAverage = (reports, field) => {
    if (reports.length === 0) return 0
    const sum = reports.reduce((acc, report) => acc + (report[field] || 0), 0)
    return (sum / reports.length).toFixed(1)
  }

  const stats = [
    {
      icon: Trophy,
      label: 'Average Score',
      value: calculateAverage(reports, 'overall_score'),
      color: 'text-yellow-500'
    },
    {
      icon: Brain,
      label: 'Technical Skills',
      value: calculateAverage(reports, 'technical_score'),
      color: 'text-blue-500'
    },
    {
      icon: MessageSquare,
      label: 'Communication',
      value: calculateAverage(reports, 'communication_score'),
      color: 'text-green-500'
    },
    {
      icon: Target,
      label: 'Creativity',
      value: calculateAverage(reports, 'creativity_score'),
      color: 'text-purple-500'
    }
  ]

  return (
    <div className="min-h-screen gradient-bg">
      <div className="border-b border-primary/10 glass sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Performance Reports</h1>
              <p className="text-sm text-muted-foreground">Track your learning progress and improvements</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent" />
          </div>
        ) : reports.length === 0 ? (
          <Card className="glass border-primary/10">
            <CardContent className="py-12 text-center">
              <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">No reports yet. Complete a session and get evaluated!</p>
              <Button onClick={() => navigate('/dashboard')} className="mt-4">
                Start Learning
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="glass border-primary/10 hover:border-primary/30 transition-all">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardDescription className="text-sm font-medium">{stat.label}</CardDescription>
                      <stat.icon className={`w-4 h-4 ${stat.color}`} />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{stat.value}/10</div>
                      <p className="text-xs text-muted-foreground mt-1">Average across all sessions</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Reports List */}
            <div className="space-y-6">
              {reports.map((report, index) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => navigate(`/report/${report.id}`)}
                  className="cursor-pointer"
                >
                  <Card className="glass border-primary/10 hover:border-primary/30 transition-all hover:glow">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <CardTitle className="text-xl mb-2">
                            Session Report #{report.id}
                          </CardTitle>
                          <CardDescription>{formatDate(report.created_at)}</CardDescription>
                        </div>
                        <Badge variant="success">Completed</Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Overall</p>
                          <p className={`text-2xl font-bold ${getScoreColor(report.overall_score)}`}>
                            {report.overall_score}/10
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Technical</p>
                          <p className={`text-2xl font-bold ${getScoreColor(report.technical_score)}`}>
                            {report.technical_score}/10
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Communication</p>
                          <p className={`text-2xl font-bold ${getScoreColor(report.communication_score)}`}>
                            {report.communication_score}/10
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Creativity</p>
                          <p className={`text-2xl font-bold ${getScoreColor(report.creativity_score)}`}>
                            {report.creativity_score}/10
                          </p>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-semibold text-green-500 mb-2">✅ Strengths</p>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {report.strengths?.slice(0, 2).map((strength, i) => (
                              <li key={i}>• {strength}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-yellow-500 mb-2">🎯 Improvements</p>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {report.improvements?.slice(0, 2).map((improvement, i) => (
                              <li key={i}>• {improvement}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <Button variant="link" className="mt-4 p-0 text-primary">
                        View Full Report →
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
