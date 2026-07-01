import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import {
  Search, BarChart3, Shield, Zap, Globe, TrendingUp,
  Building2, ArrowRight, Menu, X, Github, Twitter, Linkedin,
  CheckCircle2, ChevronDown, Sparkles, Brain, Activity,
  LineChart, Database, Target, ChevronRight, Star,
} from 'lucide-react'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
}

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12 } },
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
}

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Analysis',
    description: 'Advanced machine learning analyzes startup failure patterns to identify risks before they become critical.',
    gradient: 'from-accent-500 to-cyan-500',
    stat: '95%',
    statLabel: 'Accuracy Rate',
  },
  {
    icon: Activity,
    title: 'Predictive Risk Scoring',
    description: 'Get actionable risk scores based on historical data from thousands of failed startups across all industries.',
    gradient: 'from-warning-500 to-amber-500',
    stat: '50K+',
    statLabel: 'Case Studies',
  },
  {
    icon: Database,
    title: 'Comprehensive Database',
    description: 'Access a growing database of startup post-mortems with detailed metadata, financials, and failure causes.',
    gradient: 'from-success-500 to-emerald-500',
    stat: '12K',
    statLabel: 'Risk Factors',
  },
  {
    icon: LineChart,
    title: 'Trend Visualization',
    description: 'Explore interactive charts showing failure trends over time across industries, stages, and geographies.',
    gradient: 'from-purple-500 to-pink-500',
    stat: '98%',
    statLabel: 'Satisfaction',
  },
  {
    icon: Target,
    title: 'Strategic Recommendations',
    description: 'Receive tailored recommendations to mitigate identified risks and avoid common failure patterns.',
    gradient: 'from-danger-500 to-rose-500',
    stat: '10K+',
    statLabel: 'Founders Helped',
  },
  {
    icon: Globe,
    title: 'Industry Insights',
    description: 'Understand failure patterns across industries, funding stages, and geographic regions worldwide.',
    gradient: 'from-brand-500 to-violet-500',
    stat: '20+',
    statLabel: 'Industries',
  },
]

const steps = [
  {
    number: '01',
    title: 'Input Your Data',
    description: 'Provide basic information about your venture including industry, funding stage, and key metrics.',
    icon: Search,
  },
  {
    number: '02',
    title: 'AI Analysis Engine',
    description: 'Our engine compares your profile against thousands of historical failures to identify risk factors.',
    icon: Brain,
  },
  {
    number: '03',
    title: 'Get Actionable Insights',
    description: 'Receive a detailed report with risk scores, prioritized recommendations, and strategic guidance.',
    icon: BarChart3,
  },
]

const stats = [
  { value: '50,000+', label: 'Startups Analyzed', suffix: '' },
  { value: '99.9', label: 'Uptime', suffix: '%' },
  { value: '12', label: 'Industries Covered', suffix: '+' },
  { value: '4.9', label: 'User Rating', suffix: '/5' },
]

function FeatureCard({ feature, index }) {
  return (
    <motion.div
      variants={scaleIn}
      className="group relative"
    >
      <div className="relative h-full p-6 rounded-2xl bg-elevation-2 border border-dark-700/50 transition-all duration-300 hover:border-accent-500/20 hover:shadow-glow hover:-translate-y-0.5">
        {/* Gradient icon */}
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
          <feature.icon className="w-6 h-6 text-white" />
        </div>

        {/* Content */}
        <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
        <p className="text-sm text-surface-400 leading-relaxed">{feature.description}</p>

        {/* Stat */}
        <div className="mt-4 pt-4 border-t border-dark-700/50 flex items-center justify-between">
          <span className="text-2xl font-bold text-gradient">{feature.stat}</span>
          <span className="text-xs text-surface-500">{feature.statLabel}</span>
        </div>

        {/* Hover glow */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-accent-500/0 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>
    </motion.div>
  )
}

function FAQItem({ question, answer, isOpen, onClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="rounded-2xl bg-elevation-2 border border-dark-700/50 overflow-hidden transition-all duration-300 hover:border-dark-600/50"
    >
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between p-5 text-left gap-4"
      >
        <span className="text-sm font-medium text-white">{question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0"
        >
          <ChevronDown className="w-4 h-4 text-surface-500" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-5 text-sm text-surface-400 leading-relaxed border-t border-dark-700/50 pt-4">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function Landing() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openFAQ, setOpenFAQ] = useState(null)
  const { scrollY } = useScroll()
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0.2])
  const heroScale = useTransform(scrollY, [0, 400], [1, 0.95])

  const toggleFAQ = (index) => setOpenFAQ(openFAQ === index ? null : index)

  return (
    <div className="min-h-screen bg-dark-950 text-white">
      {/* ─── NAVIGATION ─── */}
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-50 bg-dark-950/80 backdrop-blur-xl border-b border-dark-800/50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-premium flex items-center justify-center">
                <Activity className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white">
                Venture <span className="text-accent-400">Autopsy</span>
              </span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-8">
              <Link to="#features" className="text-sm text-surface-400 hover:text-white transition-colors">
                Features
              </Link>
              <Link to="#how-it-works" className="text-sm text-surface-400 hover:text-white transition-colors">
                How It Works
              </Link>
              <Link to="#faq" className="text-sm text-surface-400 hover:text-white transition-colors">
                FAQ
              </Link>
              <Link to="/login">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Link to="/register">
                <Button size="sm" className="gap-2">
                  Get Started <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl hover:bg-dark-800 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-dark-900 border-b border-dark-800"
            >
              <div className="px-4 py-4 space-y-3">
                <Link to="#features" className="block text-sm text-surface-400 hover:text-white py-2">Features</Link>
                <Link to="#how-it-works" className="block text-sm text-surface-400 hover:text-white py-2">How It Works</Link>
                <Link to="#faq" className="block text-sm text-surface-400 hover:text-white py-2">FAQ</Link>
                <div className="pt-2 space-y-2">
                  <Link to="/login" className="block"><Button variant="ghost" size="sm" className="w-full justify-start">Sign In</Button></Link>
                  <Link to="/register" className="block"><Button size="sm" className="w-full">Get Started</Button></Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* ─── HERO SECTION ─── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Background effects */}
        <div className="absolute inset-0 bg-dark-950">
          {/* Grid pattern */}
          <div className="absolute inset-0 bg-grid opacity-30" />
          
          {/* Gradient orbs */}
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-accent-500/20 blur-[120px]"
          />
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
            className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-purple-500/20 blur-[100px]"
          />
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.08, 0.15, 0.08] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-brand-500/10 blur-[150px]"
          />

          {/* Particle dots */}
          <div className="absolute inset-0 bg-dots" />
        </div>

        <motion.div
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Badge variant="info" className="mb-6 px-4 py-1.5 text-sm">
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              Now in Public Beta — Free to use
            </Badge>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight mb-6"
          >
            Learn from{' '}
            <span className="text-gradient">50,000+</span>
            <br />
            <span className="text-gradient">Startup Failures</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-6 text-lg sm:text-xl text-surface-400 max-w-3xl mx-auto leading-relaxed"
          >
            Venture Autopsy uses advanced AI to analyze startup failure patterns, predict risks,
            and give you the intelligence you need to build a successful company.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/analyze">
              <Button size="xl" className="gap-3 shadow-glow hover:shadow-glow-lg transition-all">
                <Search className="w-5 h-5" />
                Analyze Your Startup
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="outline" size="xl" className="gap-3">
                <BarChart3 className="w-5 h-5" />
                View Dashboard
              </Button>
            </Link>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-surface-500">{stat.label}</div>
              </div>
            ))}
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="mt-16"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <ChevronDown className="w-5 h-5 text-surface-600 mx-auto" />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* ─── FEATURES SECTION ─── */}
      <section id="features" className="relative py-24 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-dark-950 via-dark-900/50 to-dark-950" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge variant="info" className="mb-4">Features</Badge>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Everything you need to{' '}
              <span className="text-gradient">de-risk</span> your startup
            </h2>
            <p className="text-lg text-surface-400 max-w-2xl mx-auto">
              Powerful tools and AI-driven insights to help you make informed decisions and avoid common pitfalls.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((feature, i) => (
              <FeatureCard key={i} feature={feature} index={i} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section id="how-it-works" className="relative py-24 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-dark-950 via-dark-900 to-dark-950" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge variant="info" className="mb-4">Process</Badge>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              How It <span className="text-gradient">Works</span>
            </h2>
            <p className="text-lg text-surface-400 max-w-2xl mx-auto">
              Three simple steps to gain invaluable insights into your startup's risk profile.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="relative"
              >
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-24 left-[60%] w-[80%] h-px bg-gradient-to-r from-accent-500/50 to-transparent" />
                )}
                
                <div className="relative p-8 rounded-2xl bg-elevation-2 border border-dark-700/50 h-full">
                  <div className="text-6xl font-bold text-dark-700 absolute top-4 right-6 select-none">
                    {step.number}
                  </div>
                  <div className="relative">
                    <div className="w-14 h-14 rounded-xl bg-gradient-premium flex items-center justify-center mb-6 shadow-glow">
                      <step.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                    <p className="text-surface-400 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── STATISTICS SECTION ─── */}
      <section className="relative py-24 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-dark-950 via-dark-900/50 to-dark-950" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Trusted by{' '}
              <span className="text-gradient">founders worldwide</span>
            </h2>
            <p className="text-lg text-surface-400 max-w-2xl mx-auto">
              Join thousands of entrepreneurs using Venture Autopsy to build better companies.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { value: '50,000+', label: 'Startups Analyzed', color: 'from-accent-400 to-cyan-400' },
              { value: '45,000+', label: 'Founders Helped', color: 'from-brand-400 to-purple-400' },
              { value: '12,000+', label: 'Risk Factors', color: 'from-warning-400 to-amber-400' },
              { value: '98%', label: 'Satisfaction Rate', color: 'from-success-400 to-emerald-400' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-6 rounded-2xl bg-elevation-2 border border-dark-700/50"
              >
                <div className={`text-4xl sm:text-5xl font-bold bg-gradient-to-br ${stat.color} bg-clip-text text-transparent mb-2`}>
                  {stat.value}
                </div>
                <p className="text-sm text-surface-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ SECTION ─── */}
      <section id="faq" className="relative py-24 lg:py-32">
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge variant="info" className="mb-4">FAQ</Badge>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Frequently Asked{' '}
              <span className="text-gradient">Questions</span>
            </h2>
            <p className="text-lg text-surface-400">
              Get answers to common questions about Venture Autopsy.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="space-y-3"
          >
            {[
              {
                question: 'How does Venture Autopsy work?',
                answer: 'Venture Autopsy uses AI to analyze your startup\'s profile against a comprehensive database of failed companies. It identifies patterns, calculates risk scores, and provides actionable recommendations to help you avoid common pitfalls.',
              },
              {
                question: 'Is my data secure?',
                answer: 'Yes, we take data security seriously. All data is encrypted in transit and at rest. We do not share your proprietary information with third parties. Your competitive insights remain confidential.',
              },
              {
                question: 'What industries do you cover?',
                answer: 'We cover all major industries including SaaS, FinTech, HealthTech, E-commerce, Consumer Tech, Enterprise, and more. Our database is continuously growing with new post-mortems.',
              },
              {
                question: 'How accurate are the risk predictions?',
                answer: 'Our models are trained on thousands of real startup failure cases. While no prediction can be 100% accurate, our risk scores have been validated against known outcomes and provide statistically significant early warning signals.',
              },
              {
                question: 'Can I export the analysis reports?',
                answer: 'Yes, you can export detailed analysis reports in PDF and CSV formats. Reports include risk breakdowns, industry comparisons, and prioritized action items.',
              },
            ].map((faq, i) => (
              <motion.div key={i} variants={fadeInUp} custom={i}>
                <FAQItem
                  question={faq.question}
                  answer={faq.answer}
                  isOpen={openFAQ === i}
                  onClick={() => toggleFAQ(i)}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── CTA SECTION ─── */}
      <section className="relative py-24 lg:py-32">
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl p-12 text-center"
          >
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-premium" />
            <div className="absolute inset-0 bg-grid opacity-20" />
            
            {/* Content */}
            <div className="relative z-10">
              <Sparkles className="w-10 h-10 text-white/80 mx-auto mb-6" />
              <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                Ready to Build a More Resilient Startup?
              </h2>
              <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
                Join thousands of founders who use Venture Autopsy to learn from the past and build a better future.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/register">
                  <Button
                    size="xl"
                    className="gap-2 bg-white text-brand-600 hover:bg-white/90 px-8 shadow-xl"
                  >
                    Get Started Free
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/analyze">
                  <Button
                    variant="outline"
                    size="xl"
                    className="gap-2 border-white/30 text-white hover:bg-white/10 px-8"
                  >
                    <Search className="w-5 h-5" />
                    Try Free Analysis
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="relative border-t border-dark-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
            <div className="col-span-2 lg:col-span-2">
              <Link to="/" className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-premium flex items-center justify-center">
                  <Activity className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-bold text-white">
                  Venture <span className="text-accent-400">Autopsy</span>
                </span>
              </Link>
              <p className="text-sm text-surface-500 max-w-sm leading-relaxed">
                AI-powered startup failure intelligence platform. Learn from the past to build a better future.
              </p>
              <div className="flex gap-3 mt-6">
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl bg-dark-800 hover:bg-dark-700 text-surface-400 hover:text-white transition-all">
                  <Github className="w-4 h-4" />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl bg-dark-800 hover:bg-dark-700 text-surface-400 hover:text-white transition-all">
                  <Twitter className="w-4 h-4" />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl bg-dark-800 hover:bg-dark-700 text-surface-400 hover:text-white transition-all">
                  <Linkedin className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2.5">
                <li><Link to="/analyze" className="text-sm text-surface-500 hover:text-white transition-colors">Analyze</Link></li>
                <li><Link to="/dashboard" className="text-sm text-surface-500 hover:text-white transition-colors">Dashboard</Link></li>
                <li><Link to="/analytics" className="text-sm text-surface-500 hover:text-white transition-colors">Analytics</Link></li>
                <li><Link to="/compare" className="text-sm text-surface-500 hover:text-white transition-colors">Compare</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Resources</h4>
              <ul className="space-y-2.5">
                <li><a href="#" className="text-sm text-surface-500 hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="text-sm text-surface-500 hover:text-white transition-colors">API Reference</a></li>
                <li><a href="#" className="text-sm text-surface-500 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-sm text-surface-500 hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2.5">
                <li><a href="#" className="text-sm text-surface-500 hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="text-sm text-surface-500 hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="text-sm text-surface-500 hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="text-sm text-surface-500 hover:text-white transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>

          <div className="divider my-8" />

          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-surface-500">
              &copy; {new Date().getFullYear()} Venture Autopsy. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-sm text-surface-500">
              <span className="status-dot-active" />
              All systems operational
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}