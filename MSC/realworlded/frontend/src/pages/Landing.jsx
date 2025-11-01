import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sparkles, GraduationCap, Briefcase, Brain, Target, TrendingUp, Users } from 'lucide-react'
import { Button } from '../components/ui/Button'

export default function Landing() {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Mentorship',
      description: 'Get personalized guidance from AI agents trained to simulate real-world scenarios'
    },
    {
      icon: GraduationCap,
      title: 'Education Mode',
      description: 'Transform theoretical knowledge into practical skills through project-based learning'
    },
    {
      icon: Briefcase,
      title: 'Business Mode',
      description: 'Test your entrepreneurial ideas and pitch skills with AI investors'
    },
    {
      icon: Target,
      title: 'Real-World Scenarios',
      description: 'Face authentic challenges that prepare you for actual professional situations'
    },
    {
      icon: TrendingUp,
      title: 'Performance Analytics',
      description: 'Track your progress with detailed evaluations and personalized feedback'
    },
    {
      icon: Users,
      title: 'Multi-Agent Simulation',
      description: 'Interact with various AI agents - mentors, clients, and evaluators'
    }
  ]

  return (
    <div className="min-h-screen gradient-bg">
      {/* Hero Section */}
      <nav className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center glow">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <span className="text-2xl font-bold">RealWorldEd</span>
        </div>
        <div className="flex gap-4">
          <Link to="/login">
            <Button variant="ghost">Login</Button>
          </Link>
          <Link to="/signup">
            <Button className="glow">Get Started</Button>
          </Link>
        </div>
      </nav>

      <section className="container mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Sparkles className="w-4 h-4 text-primary animate-glow" />
            <span className="text-sm font-medium">AI Simulated Experience Platform</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Turn Theory into
            <br />
            <span className="text-primary glow-strong">Real-World Practice</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Experience real-world scenarios through AI simulations. Master communication, 
            decision-making, and problem-solving before entering the professional world.
          </p>
          
          <div className="flex gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="glow text-lg">
                Start Learning Free
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg">
              Watch Demo
            </Button>
          </div>
        </motion.div>

        {/* Animated Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-20 relative"
        >
          <div className="glass rounded-2xl p-8 max-w-5xl mx-auto border-primary/20 glow">
            <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Sparkles className="w-20 h-20 text-primary mx-auto mb-4 float" />
                <p className="text-lg font-medium">Interactive AI Simulation Platform</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
          <p className="text-xl text-muted-foreground">Everything you need to bridge the gap between learning and doing</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="glass rounded-xl p-6 border-primary/10 hover:border-primary/30 transition-all hover:glow">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-xl text-muted-foreground">Your journey from theory to mastery in 4 simple steps</p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {[
            { step: 1, title: 'Choose Your Mode', desc: 'Select Education or Business mode based on your goals' },
            { step: 2, title: 'Start Learning', desc: 'Get guidance from AI mentors and work on real projects' },
            { step: 3, title: 'Face Real Scenarios', desc: 'Interact with AI clients and investors in simulated situations' },
            { step: 4, title: 'Get Evaluated', desc: 'Receive detailed feedback and track your improvement' }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="flex gap-6 items-start"
            >
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 glow">
                <span className="text-2xl font-bold text-primary">{item.step}</span>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-lg">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="glass rounded-2xl p-12 text-center border-primary/20 glow-strong"
        >
          <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Learning?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of students and entrepreneurs who are preparing for real-world success
          </p>
          <Link to="/signup">
            <Button size="lg" className="glow text-lg">
              Start Your Free Journey
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-primary/10 mt-20">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="font-semibold">RealWorldEd</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2025 RealWorldEd. Built with AI for the future.
          </p>
        </div>
      </footer>
    </div>
  )
}
