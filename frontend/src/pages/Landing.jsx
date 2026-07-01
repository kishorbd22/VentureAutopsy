import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import {
  ChevronDown, Search, BarChart3, Shield, Zap, Globe, TrendingUp,
  Building2, ArrowRight, Menu, X, Github, Twitter, Linkedin,
  CheckCircle2, HelpCircle, Star
} from 'lucide-react'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Card } from '../components/ui/card'

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
}

const stagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

const features = [
  {
    icon: Search,
    title: 'AI-Powered Analysis',
    description: 'Analyze startup failure patterns using advanced AI to identify risks before they become critical.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: BarChart3,
    title: 'Predictive Risk Scoring',
    description: 'Get actionable risk scores based on historical data from thousands of failed startups.',
    color: 'from-amber-500 to-orange-500',
  },
  {
    icon: Globe,
    title: 'Industry Insights',
    description: 'Understand failure patterns across industries, stages, and geographies.',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    icon: Shield,
    title: 'Strategic Recommendations',
    description: 'Receive tailored recommendations to mitigate identified risks.',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: TrendingUp,
    title: 'Trend Visualization',
    description: 'Explore interactive charts showing failure trends over time.',
    color: 'from-red-500 to-rose-500',
  },
  {
    icon: Building2,
    title: 'Comprehensive Database',
    description: 'Access a growing database of startup post-mortems with detailed metadata.',
    color: 'from-indigo-500 to-violet-500',
  },
]

const steps = [
  {
    number: '01',
    title: 'Input Your Startup Data',
    description: 'Provide basic information about your venture including industry, funding stage, and key metrics.',
    icon: Search,
  },
  {
    number: '02',
    title: 'AI Analysis',
    description: 'Our engine compares your profile against thousands of historical failures to identify risk factors.',
    icon: Zap,
  },
  {
    number: '03',
    title: 'Get Actionable Insights',
    description: 'Receive a detailed report with risk scores, recommendations, and strategic guidance.',
    icon: BarChart3,
  },
]

const testimonials = [
  { name: 'TechCrunch', text: 'The future of startup intelligence' },
  { name: ' Forbes', text: 'A must-have tool for founders' },
  { name: 'Product Hunt', text: '#1 Product of the Month' },
  { name: 'Y Combinator', text: 'Recommended reading for all founders' },
]

const faqs = [
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
]

function AnimatedCounter({ target, suffix = '' }) {
  const [count, setCount] = useState(0)

  const animate = () => {
    const duration = 2000
    const steps = 60
    const increment = target / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)
  }

  return (
    <span
      className="text-4xl font-bold text-gray-900"
      onMouseEnter={animate}
    >
      {count.toLocaleString()}{suffix}
    </span>
  )
}

function FAQItem({ question, answer, isOpen, onClick }) {
  return (
    <motion.div
      initial={fadeIn.hidden}
      whileInView={fadeIn.visible}
      viewport={{ once: true }}
      className="border border-gray-200 rounded-xl overflow-hidden"
    >
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="font-semibold text-gray-900 flex items-center gap-3">
          <HelpCircle className="h-5 w-5 text-primary-500 flex-shrink-0" />
          {question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="h-5 w-5 text-gray-400" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="px-6 pb-6 text-gray-600 leading-relaxed">
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
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0.3])
  const heroScale = useTransform(scrollY, [0, 500], [1, 0.95])

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl">🔬</span>
              <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Venture Autopsy
              </span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-8">
              <Link to="#features" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                Features
              </Link>
              <Link to="#how-it-works" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                How It Works
              </Link>
              <Link to="#faq" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                FAQ
              </Link>
              <Link to="/login">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Link to="/register">
                <Button size="sm" className="gap-2">
                  Get Started <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
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
              className="md:hidden bg-white border-b border-gray-100"
            >
              <div className="px-4 py-4 space-y-3">
                <Link to="#features" className="block text-sm font-medium text-gray-600 hover:text-gray-900">
                  Features
                </Link>
                <Link to="#how-it-works" className="block text-sm font-medium text-gray-600 hover:text-gray-900">
                  How It Works
                </Link>
                <Link to="#faq" className="block text-sm font-medium text-gray-600 hover:text-gray-900">
                  FAQ
                </Link>
                <Link to="/login" className="block">
                  <Button variant="ghost" size="sm" className="w-full justify-start">Sign In</Button>
                </Link>
                <Link to="/register" className="block">
                  <Button size="sm" className="w-full">Get Started</Button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute top-0 -left-4 w-96 h-96 bg-primary-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
          />
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.4, 0.3],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 2,
            }}
            className="absolute top-0 -right-4 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
          />
          <motion.div
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 9,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 4,
            }}
            className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
          />
        </div>

        <motion.div
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Badge className="mb-6 px-4 py-1.5 text-sm font-medium bg-white/80 backdrop-blur border border-gray-200">
              {'\u{1F680}'} Now in Public Beta
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 tracking-tight mb-6"
          >
            Learn from 50,000+
            <br />
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Startup Failures
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          >
            Venture Autopsy uses AI to analyze startup failure patterns, predict risks,
            and give you the insights you need to build a successful company.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/analyze">
              <Button size="lg" className="gap-2 text-base px-8 h-12 shadow-lg hover:shadow-xl transition-all">
                <Search className="h-5 w-5" />
                Analyze Startup
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="outline" size="lg" className="gap-2 text-base px-8 h-12">
                <BarChart3 className="h-5 w-5" />
                View Dashboard
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-20"
          >
            <ChevronDown className="h-6 w-6 text-gray-400 mx-auto animate-bounce" />
          </motion.div>
        </motion.div>
      </section>

      {/* Trusted By Section */}
      <section className="py-12 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-semibold text-gray-500 uppercase tracking-wider mb-8">
            Trusted by innovative teams worldwide
          </p>
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                variants={fadeIn}
                custom={i}
                className="flex flex-col items-center gap-2"
              >
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(5)].map((_, idx) => (
                    <Star key={idx} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm font-medium text-gray-900">{'\u201C'}{t.text}{'\u201D'}</p>
                <p className="text-xs text-gray-500">{t.name}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything you need to <span className="text-primary-600">de-risk</span> your startup
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful tools and insights to help you make informed decisions and avoid common pitfalls.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {features.map((feature, i) => (
              <motion.div key={i} variants={scaleIn} custom={i}>
                <Card className="h-full p-6 hover:shadow-xl transition-all duration-300 group border-0 shadow-md">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Three simple steps to gain invaluable insights into your startup{'\u2019'}s risk profile.
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
                <Card className="h-full p-8 hover:shadow-xl transition-all duration-300 border-0 shadow-md">
                  <div className="text-6xl font-extrabold text-gray-100 absolute top-4 right-6">
                    {step.number}
                  </div>
                  <div className="relative">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center mb-6 shadow-lg">
                      <step.icon className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Screenshots/Demo Section */}
      <section id="screenshots" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              See It In Action
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful insights delivered through an intuitive interface
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="space-y-8"
          >
            {/* Dashboard Preview */}
            <motion.div variants={fadeIn} className="rounded-2xl overflow-hidden shadow-2xl border border-gray-200">
              <div className="bg-gray-900 px-4 py-3 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="ml-4 text-gray-400 text-sm">Analytics Dashboard</span>
              </div>
              <div className="bg-gray-100 p-8">
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <div className="grid grid-cols-4 gap-4 mb-6">
                    <div className="bg-blue-50 rounded-lg p-4 h-24"></div>
                    <div className="bg-green-50 rounded-lg p-4 h-24"></div>
                    <div className="bg-purple-50 rounded-lg p-4 h-24"></div>
                    <div className="bg-orange-50 rounded-lg p-4 h-24"></div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-6 h-64"></div>
                </div>
              </div>
            </motion.div>

            {/* Analysis Tool Preview */}
            <motion.div variants={fadeIn} className="rounded-2xl overflow-hidden shadow-2xl border border-gray-200">
              <div className="bg-gray-900 px-4 py-3 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="ml-4 text-gray-400 text-sm">Analysis Tool</span>
              </div>
              <div className="bg-gray-100 p-8">
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <div className="space-y-4">
                    <div className="h-12 bg-gray-100 rounded"></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="h-20 bg-gray-100 rounded"></div>
                      <div className="h-20 bg-gray-100 rounded"></div>
                    </div>
                    <div className="h-32 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg flex items-center justify-center">
                      <div className="w-32 h-32 rounded-full border-8 border-indigo-200"></div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-24 bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Trusted by founders worldwide</h2>
            <p className="text-xl text-indigo-100">
              Join thousands of entrepreneurs using Venture Autopsy to build better companies.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {[
              { value: 520, suffix: '+', label: 'Startups Analyzed' },
              { value: 45, suffix: 'K', label: 'Founders Helped' },
              { value: 12, suffix: 'K', label: 'Risk Factors Identified' },
              { value: 98, suffix: '%', label: 'Satisfaction Rate' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                variants={fadeIn}
                custom={i}
                className="text-center"
              >
                <div className="text-5xl font-extrabold mb-2">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-indigo-200 text-lg">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Get answers to common questions about Venture Autopsy.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="space-y-4"
          >
            {faqs.map((faq, i) => (
              <motion.div key={i} variants={fadeIn} custom={i}>
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

      {/* CTA Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-12 text-center text-white shadow-2xl"
          >
            <h2 className="text-4xl font-bold mb-4">
              Ready to Build a More Resilient Startup?
            </h2>
            <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
              Join thousands of founders who use Venture Autopsy to learn from the past and build a better future.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register">
                <Button
                  size="lg"
                  className="gap-2 bg-white text-indigo-600 hover:bg-indigo-50 px-8 h-12 text-base"
                >
                  Get Started Free
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/analyze">
                <Button
                  variant="outline"
                  size="lg"
                  className="gap-2 border-white/30 text-white hover:bg-white/10 px-8 h-12 text-base"
                >
                  <Search className="h-5 w-5" />
                  Try Analysis
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
            <div className="col-span-2 lg:col-span-2">
              <Link to="/" className="flex items-center gap-2 mb-4">
                <span className="text-3xl">🔬</span>
                <span className="text-xl font-bold text-white">Venture Autopsy</span>
              </Link>
              <p className="text-gray-400 max-w-sm leading-relaxed">
                AI-powered startup failure intelligence platform. Learn from the past to build a better future.
              </p>
              <div className="flex gap-4 mt-6">
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors">
                  <Github className="h-5 w-5" />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors">
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2">
                <li><Link to="/analyze" className="hover:text-white transition-colors">Analyze</Link></li>
                <li><Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
                <li><Link to="/analytics" className="hover:text-white transition-colors">Analytics</Link></li>
                <li><Link to="/compare" className="hover:text-white transition-colors">Compare</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Reference</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-400">
              {'\u00A9'} {new Date().getFullYear()} Venture Autopsy. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              All systems operational
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}