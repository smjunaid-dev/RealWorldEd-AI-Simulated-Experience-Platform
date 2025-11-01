import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Download, Trophy, TrendingUp } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card'
import { evaluationAPI } from '../lib/api'
import { formatDate, getScoreColor, getScoreGradient } from '../lib/utils'
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts'

export default function Report() {
  const { reportId } = useParams()
  const navigate = useNavigate()
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadReport()
  }, [reportId])

  const loadReport = async () => {
    try {
      const response = await evaluationAPI.getReport(reportId)
      setReport(response.data)
    } catch (error) {
      console.error('Failed to load report:', error)
      navigate('/reports')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mb-4" />
          <p className="text-muted-foreground">Loading report...</p>
        </div>
      </div>
    )
  }

  const radarData = [
    { subject: 'Technical', score: report.technical_score, fullMark: 10 },
    { subject: 'Communication', score: report.communication_score, fullMark: 10 },
    { subject: 'Creativity', score: report.creativity_score, fullMark: 10 },
    { subject: 'Business Sense', score: report.business_sense_score || report.technical_score, fullMark: 10 },
  ]

  return (
    <div className="min-h-screen gradient-bg">
      <div className="border-b border-primary/10 glass sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate('/reports')}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Performance Report</h1>
                <p className="text-sm text-muted-foreground">{formatDate(report.created_at)}</p>
              </div>
            </div>
            <Button variant="outline" className="glow">
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Overall Score */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8"
        >
          <Card className="glass border-primary/20 glow-strong overflow-hidden">
            <div className={`h-2 bg-gradient-to-r ${getScoreGradient(report.overall_score)}`} />
            <CardHeader className="text-center pb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Trophy className="w-8 h-8 text-yellow-500" />
                <CardTitle className="text-3xl">Overall Performance</CardTitle>
              </div>
              <div className="inline-flex items-baseline gap-2">
                <span className={`text-7xl font-bold ${getScoreColor(report.overall_score)}`}>
                  {report.overall_score}
                </span>
                <span className="text-3xl text-muted-foreground">/10</span>
              </div>
              <CardDescription className="text-lg mt-4">
                {report.overall_score >= 8 ? '🎉 Excellent Performance!' : 
                 report.overall_score >= 6 ? '👍 Good Job!' : 
                 '💪 Keep Practicing!'}
              </CardDescription>
            </CardHeader>
          </Card>
        </motion.div>

        {/* Scores Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="glass border-primary/10 h-full">
              <CardHeader>
                <CardTitle>Skills Radar</CardTitle>
                <CardDescription>Your performance across different dimensions</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#444" />
                    <PolarAngleAxis dataKey="subject" stroke="#888" />
                    <PolarRadiusAxis angle={90} domain={[0, 10]} stroke="#888" />
                    <Radar 
                      name="Score" 
                      dataKey="score" 
                      stroke="#00ffff" 
                      fill="#00ffff" 
                      fillOpacity={0.3} 
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            {[
              { label: 'Technical Skills', score: report.technical_score, icon: '🔧' },
              { label: 'Communication', score: report.communication_score, icon: '💬' },
              { label: 'Creativity', score: report.creativity_score, icon: '🎨' },
              { label: 'Business Sense', score: report.business_sense_score || report.technical_score, icon: '💼' }
            ].map((item, index) => (
              <Card key={index} className="glass border-primary/10">
                <CardContent className="py-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{item.icon}</span>
                      <span className="font-semibold">{item.label}</span>
                    </div>
                    <span className={`text-2xl font-bold ${getScoreColor(item.score)}`}>
                      {item.score}/10
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(item.score / 10) * 100}%` }}
                      transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                      className={`h-full bg-gradient-to-r ${getScoreGradient(item.score)}`}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </div>

        {/* Strengths & Improvements */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="glass border-green-500/20">
              <CardHeader>
                <CardTitle className="text-green-500">✅ Your Strengths</CardTitle>
                <CardDescription>Areas where you excelled</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {report.strengths?.map((strength, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="flex items-start gap-2"
                    >
                      <TrendingUp className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{strength}</span>
                    </motion.li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="glass border-yellow-500/20">
              <CardHeader>
                <CardTitle className="text-yellow-500">🎯 Areas for Improvement</CardTitle>
                <CardDescription>Focus on these to level up</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {report.improvements?.map((improvement, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="flex items-start gap-2"
                    >
                      <span className="text-yellow-500 flex-shrink-0">→</span>
                      <span className="text-sm">{improvement}</span>
                    </motion.li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Detailed Feedback */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="glass border-primary/10">
            <CardHeader>
              <CardTitle>💬 Detailed Feedback</CardTitle>
              <CardDescription>Personalized analysis from our AI evaluator</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {report.detailed_feedback}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center mt-8">
          <Button onClick={() => navigate('/dashboard')} size="lg" className="glow">
            Start New Session
          </Button>
          <Button onClick={() => navigate('/reports')} variant="outline" size="lg">
            View All Reports
          </Button>
        </div>
      </div>
    </div>
  )
}
