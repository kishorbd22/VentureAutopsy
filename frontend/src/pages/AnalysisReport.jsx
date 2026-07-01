import { useState } from "react"
import { useParams, Link } from "react-router-dom"
import { motion } from "framer-motion"
import {
  ArrowLeft, Download, Share2, MessageSquare, Sparkles,
  TrendingUp, AlertTriangle, CheckCircle2, Target,
  Calendar, BookOpen, Lightbulb, RefreshCw
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Button } from "../components/ui/button"
import { Textarea } from "../components/ui/textarea"
import {
  useAIReport,
  useAIChat,
  useScenarioSimulation,
  useAISuggestions,
} from "../hooks/useAI"

export default function AnalysisReport() {
  const { id } = useParams()
  const [chatMessage, setChatMessage] = useState("")
  const [conversation, setConversation] = useState([])

  const { data: reportData, isLoading: reportLoading } = useAIReport(id)
  const { data: suggestionsData } = useAISuggestions(id)
  const chatMutation = useAIChat(id)
  const scenarioMutation = useScenarioSimulation(id)

  const report = reportData?.success ? reportData.data : null

  const handleSendMessage = async () => {
    if (!chatMessage.trim()) return

    const userMsg = { role: "user", content: chatMessage }
    setConversation([...conversation, userMsg])
    setChatMessage("")

    try {
      const response = await chatMutation.mutateAsync({
        message: chatMessage,
        conversation_history: conversation,
      })
      const aiMsg = {
        role: "assistant",
        content: response.data.response,
      }
      setConversation((prev) => [...prev, aiMsg])
    } catch (error) {
      console.error("Chat error:", error)
    }
  }

  const handleScenarioSimulation = async (scenarioType) => {
    try {
      const response = await scenarioMutation.mutateAsync({
        scenario_type: scenarioType,
        params: scenarioType === "funding" ? { raise_amount: 2000000 } : {},
      })
      // Handle scenario results
      console.log("Scenario result:", response.data)
    } catch (error) {
      console.error("Scenario error:", error)
    }
  }

  if (reportLoading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-primary-600"></div>
            <p className="mt-4 text-gray-600">Generating AI report...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!report) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-700">Report not found. Please try again.</p>
            <Link to="/analyze">
              <Button className="mt-4">Back to Analysis</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/analyze">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">AI Analysis Report</h1>
            <p className="text-gray-500 mt-1">
              Comprehensive insights powered by AI
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Export PDF
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        </div>
      </div>

      {/* Executive Summary */}
      <Card className="border-l-4 border-l-primary-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary-600" />
            Executive Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {report.executive_summary}
          </p>
        </CardContent>
      </Card>

      {/* Risk Score Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Risk Score</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">
              {report.risk_score || 65}/100
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {report.risk_level || "High"} Risk
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Industry</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {report.industry_comparison?.industry || "Technology"}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {report.industry_comparison?.your_position || "Below average"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <Target className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {report.industry_comparison?.avg_success_rate || "23%"}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Industry average
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Analysis</CardTitle>
          <CardDescription>In-depth breakdown of key areas</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {report.detailed_analysis?.map((section, idx) => (
            <div key={idx} className="border-l-2 border-gray-200 pl-4">
              <h3 className="font-semibold text-gray-900 mb-2">{section.title}</h3>
              <p className="text-gray-600 leading-relaxed">{section.content}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Risk Factors */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            Risk Factors
          </CardTitle>
          <CardDescription>Prioritized risks that need immediate attention</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {report.risk_factors?.map((risk, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-lg border ${
                  risk.severity === "critical"
                    ? "bg-red-50 border-red-200"
                    : risk.severity === "high"
                    ? "bg-orange-50 border-orange-200"
                    : "bg-yellow-50 border-yellow-200"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-900">{risk.factor}</h4>
                    <p className="text-sm text-gray-600 mt-1">{risk.description}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      <strong>Mitigation:</strong> {risk.mitigation}
                    </p>
                  </div>
                  <Badge
                    variant={
                      risk.severity === "critical"
                        ? "destructive"
                        : risk.severity === "high"
                        ? "default"
                        : "secondary"
                    }
                  >
                    {risk.severity}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-600" />
            AI Recommendations
          </CardTitle>
          <CardDescription>Actionable steps to improve your startup&#39;s viability</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {report.recommendations?.map((rec, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">{rec}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* 90-Day Action Plan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary-600" />
            90-Day Action Plan
          </CardTitle>
          <CardDescription>Structured roadmap to mitigate risks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {report.action_plan?.map((phase, idx) => (
              <div key={idx}>
                <h3 className="font-semibold text-gray-900 mb-3">{phase.phase}</h3>
                <ul className="space-y-2">
                  {phase.actions?.map((action, actionIdx) => (
                    <li
                      key={actionIdx}
                      className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="w-6 h-6 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center flex-shrink-0 text-sm font-semibold">
                        {actionIdx + 1}
                      </div>
                      <span className="text-gray-700">{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Chat Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary-600" />
            Chat with AI
          </CardTitle>
          <CardDescription>
            Ask questions like &ldquo;What if I raise $2M?&rdquo; or &ldquo;How can I improve my score?&rdquo;
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Conversation History */}
          {conversation.length > 0 && (
            <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
              {conversation.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] p-4 rounded-lg ${
                      msg.role === "user"
                        ? "bg-primary-600 text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line">{msg.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Suggested Questions */}
          {suggestionsData?.success && (
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Suggested questions:</p>
              <div className="flex flex-wrap gap-2">
                {suggestionsData.data.suggested_questions?.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => setChatMessage(q)}
                    className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="flex gap-2">
            <Textarea
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              placeholder="Ask anything about your analysis..."
              className="min-h-[60px]"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage()
                }
              }}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!chatMessage.trim() || chatMutation.isPending}
              className="self-end"
            >
              <MessageSquare className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Scenario Simulation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-purple-600" />
            Scenario Simulation
          </CardTitle>
          <CardDescription>
            Test &ldquo;what-if&rdquo; scenarios to see potential outcomes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col gap-2"
              onClick={() => handleScenarioSimulation("funding")}
              disabled={scenarioMutation.isPending}
            >
              <TrendingUp className="h-6 w-6 text-green-600" />
              <span className="font-semibold">Raise Funding</span>
              <span className="text-xs text-gray-500">What if I raise $2M?</span>
            </Button>

            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col gap-2"
              onClick={() => handleScenarioSimulation("pivot")}
              disabled={scenarioMutation.isPending}
            >
              <RefreshCw className="h-6 w-6 text-blue-600" />
              <span className="font-semibold">Pivot Strategy</span>
              <span className="text-xs text-gray-500">What if I change direction?</span>
            </Button>

            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col gap-2"
              onClick={() => handleScenarioSimulation("team")}
              disabled={scenarioMutation.isPending}
            >
              <BookOpen className="h-6 w-6 text-purple-600" />
              <span className="font-semibold">Hire Team</span>
              <span className="text-xs text-gray-500">What if I add 10 people?</span>
            </Button>
          </div>

          {/* Scenario Results */}
          {scenarioMutation.data?.success && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200"
            >
              <h4 className="font-semibold text-gray-900 mb-2">Scenario Result</h4>
              <p className="text-sm text-gray-700 mb-4">
                {scenarioMutation.data.data.narrative}
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Original Score</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {scenarioMutation.data.data.original_score}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Projected Score</p>
                  <p className="text-2xl font-bold text-green-600">
                    {scenarioMutation.data.data.projected_score}
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-xs font-medium text-gray-700 mb-2">Recommendations:</p>
                <ul className="space-y-1">
                  {scenarioMutation.data.data.recommendations?.map((rec, idx) => (
                    <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* AI Suggestions */}
      {suggestionsData?.success && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-600" />
              Next Steps
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Immediate Actions</h4>
                <ul className="space-y-2">
                  {suggestionsData.data.immediate_actions?.map((action, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                      <div className="w-5 h-5 rounded-full bg-red-100 text-red-700 flex items-center justify-center flex-shrink-0 text-xs font-bold">
                        !
                      </div>
                      {action}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Key Metrics to Track</h4>
                <div className="flex flex-wrap gap-2">
                  {suggestionsData.data.key_metrics_to_track?.map((metric, idx) => (
                    <Badge key={idx} variant="secondary">
                      {metric}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}