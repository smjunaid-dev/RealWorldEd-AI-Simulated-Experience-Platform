import React, { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, GraduationCap, Briefcase, Sparkles } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card'
import { useSessionStore } from '../store/store'
import { sessionsAPI, chatAPI } from '../lib/api'

export default function SessionSetup() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const mode = searchParams.get('mode')
  const setCurrentSession = useSessionStore((state) => state.setCurrentSession)
  
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    // Education mode
    subject: '',
    application: '',
    project_idea: '',
    // Business mode
    business_type: '',
    location: '',
    business_idea: ''
  })

  // Check if user is authenticated
  React.useEffect(() => {
    const token = localStorage.getItem('token')
    console.log('SessionSetup - Token exists:', !!token)
    if (!token) {
      console.error('No authentication token found!')
      alert('Please login first')
      navigate('/login')
    }
  }, [])

  const subjects = [
    'C++', 'Java', 'Python', 'JavaScript', 'TypeScript', 'Go', 'Rust', 
    'C#', 'Ruby', 'PHP', 'Swift', 'Kotlin', 'Other'
  ]

  const applications = [
    'Game Development', 'Web Development', 'Mobile Apps', 'AI/ML',
    'Data Science', 'Backend APIs', 'Desktop Apps', 'IoT',
    'Blockchain', 'Cloud Computing', 'DevOps', 'Other'
  ]

  const businessTypes = [
    'Startup', 'Restaurant', 'E-commerce', 'SaaS', 'Retail Store',
    'Consulting', 'Manufacturing', 'Healthcare', 'Education', 'Other'
  ]

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value })
  }

  const handleNext = () => {
    if (mode === 'education' && step === 1 && !formData.subject) return
    if (mode === 'education' && step === 2 && !formData.application) return
    if (mode === 'business' && step === 1 && !formData.business_type) return
    
    setStep(step + 1)
  }

  const handleBack = () => {
    if (step === 1) {
      navigate('/dashboard')
    } else {
      setStep(step - 1)
    }
  }

  const handleStart = async () => {
    setLoading(true)
    
    try {
      console.log('Creating session with data:', {
        mode,
        ...(mode === 'education' ? {
          subject: formData.subject,
          application: formData.application,
          project_idea: formData.project_idea
        } : {
          business_type: formData.business_type,
          location: formData.location,
          business_idea: formData.business_idea
        })
      })

      // Check token before creating session
      const token = localStorage.getItem('token')
      console.log('Token before API call:', token ? 'EXISTS' : 'MISSING')
      if (!token) {
        alert('You must be logged in to create a session')
        navigate('/login')
        return
      }

      // Create session with details
      const sessionData = {
        mode,
        ...(mode === 'education' ? {
          subject: formData.subject,
          application: formData.application,
          project_idea: formData.project_idea
        } : {
          business_type: formData.business_type,
          location: formData.location,
          business_idea: formData.business_idea
        })
      }

      const response = await sessionsAPI.create(sessionData)
      console.log('Session created:', response.data)
      setCurrentSession(response.data)

      // Send initial message to trigger AI intro
      const message = mode === 'education' 
        ? `I want to learn ${formData.subject} for ${formData.application}. ${formData.project_idea ? `My project idea: ${formData.project_idea}` : ''}`
        : `I have a ${formData.business_type} business idea${formData.location ? ` in ${formData.location}` : ''}. ${formData.business_idea}`
      
      console.log('Sending initial message:', message)
      
      await chatAPI.sendMessage({
        message,
        session_id: response.data.id
      })

      console.log('Navigating to chat...')
      navigate(`/chat/${response.data.id}`)
    } catch (error) {
      console.error('Failed to create session:', error)
      console.error('Error details:', error.response?.data)
      alert(`Failed to start session: ${error.response?.data?.detail || error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const isEducation = mode === 'education'

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-4 glow"
          >
            {isEducation ? (
              <GraduationCap className="w-8 h-8 text-primary" />
            ) : (
              <Briefcase className="w-8 h-8 text-primary" />
            )}
          </motion.div>
          <h1 className="text-3xl font-bold mb-2">
            {isEducation ? '🎓 Education Mode' : '💼 Business Mode'}
          </h1>
          <p className="text-muted-foreground">
            {isEducation 
              ? 'Let\'s set up your learning journey'
              : 'Prepare your business pitch'}
          </p>
        </div>

        <Card className="glass border-primary/20">
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <div className="flex gap-2">
                {[1, 2, 3].map((s) => (
                  <div
                    key={s}
                    className={`h-2 w-12 rounded-full transition-all ${
                      s <= step ? 'bg-primary' : 'bg-primary/20'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">Step {step}/3</span>
            </div>
            <CardTitle>
              {isEducation 
                ? step === 1 ? 'Choose Your Subject' 
                  : step === 2 ? 'Select Application' 
                  : 'Project Details'
                : step === 1 ? 'Business Type'
                  : step === 2 ? 'Location'
                  : 'Your Business Idea'}
            </CardTitle>
            <CardDescription>
              {isEducation
                ? step === 1 ? 'What programming language do you want to learn?'
                  : step === 2 ? 'Where will you apply this knowledge?'
                  : 'Tell us about your project (optional)'
                : step === 1 ? 'What type of business do you want to pitch?'
                  : step === 2 ? 'Where is your business located?'
                  : 'Describe your business idea'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Education Mode Steps */}
              {isEducation && step === 1 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {subjects.map((subject) => (
                    <Button
                      key={subject}
                      variant={formData.subject === subject ? 'default' : 'outline'}
                      className="w-full"
                      onClick={() => handleChange('subject', subject)}
                    >
                      {subject}
                    </Button>
                  ))}
                </div>
              )}

              {isEducation && step === 2 && (
                <div className="grid grid-cols-2 gap-3">
                  {applications.map((app) => (
                    <Button
                      key={app}
                      variant={formData.application === app ? 'default' : 'outline'}
                      className="w-full text-sm"
                      onClick={() => handleChange('application', app)}
                    >
                      {app}
                    </Button>
                  ))}
                </div>
              )}

              {isEducation && step === 3 && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Project Idea (Optional)
                    </label>
                    <textarea
                      className="w-full min-h-[120px] px-3 py-2 rounded-md border border-input bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="E.g., I want to build a 2D car racing game with multiple levels and power-ups..."
                      value={formData.project_idea}
                      onChange={(e) => handleChange('project_idea', e.target.value)}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    The AI mentor will guide you through this project step by step
                  </p>
                </div>
              )}

              {/* Business Mode Steps */}
              {!isEducation && step === 1 && (
                <div className="grid grid-cols-2 gap-3">
                  {businessTypes.map((type) => (
                    <Button
                      key={type}
                      variant={formData.business_type === type ? 'default' : 'outline'}
                      className="w-full"
                      onClick={() => handleChange('business_type', type)}
                    >
                      {type}
                    </Button>
                  ))}
                </div>
              )}

              {!isEducation && step === 2 && (
                <div>
                  <Input
                    placeholder="e.g., New York, USA"
                    value={formData.location}
                    onChange={(e) => handleChange('location', e.target.value)}
                  />
                </div>
              )}

              {!isEducation && step === 3 && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Describe Your Business Idea
                    </label>
                    <textarea
                      className="w-full min-h-[120px] px-3 py-2 rounded-md border border-input bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="E.g., A sustainable coffee shop using only locally sourced ingredients..."
                      value={formData.business_idea}
                      onChange={(e) => handleChange('business_idea', e.target.value)}
                      required
                    />
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleBack}
                  disabled={loading}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                
                {step < 3 ? (
                  <Button
                    className="flex-1 glow"
                    onClick={handleNext}
                    disabled={
                      (isEducation && step === 1 && !formData.subject) ||
                      (isEducation && step === 2 && !formData.application) ||
                      (!isEducation && step === 1 && !formData.business_type)
                    }
                  >
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    className="flex-1 glow"
                    onClick={handleStart}
                    disabled={loading || (!isEducation && !formData.business_idea)}
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                        Starting...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Start Session
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
