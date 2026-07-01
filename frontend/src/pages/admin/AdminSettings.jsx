import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Separator } from "../../components/ui/separator"
import { Settings, Save, RefreshCw } from "lucide-react"

export default function AdminSettings() {
  const [siteName, setSiteName] = useState("Venture Autopsy")
  const [contactEmail, setContactEmail] = useState("admin@ventureautopsy.com")
  const [maxUploadSize, setMaxUploadSize] = useState("10")
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
    alert("Settings saved successfully!")
  }

  const handleClearCache = () => {
    if (confirm("Are you sure you want to clear all cached data?")) {
      localStorage.clear()
      alert("Cache cleared!")
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">Manage application configuration</p>
      </div>

      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            General Settings
          </CardTitle>
          <CardDescription>Basic application configuration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="siteName">Site Name</Label>
            <Input
              id="siteName"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              placeholder="Enter site name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactEmail">Contact Email</Label>
            <Input
              id="contactEmail"
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder="admin@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxUploadSize">Max CSV Upload Size (MB)</Label>
            <Input
              id="maxUploadSize"
              type="number"
              value={maxUploadSize}
              onChange={(e) => setMaxUploadSize(e.target.value)}
              placeholder="10"
            />
          </div>

          <Button onClick={handleSave} disabled={isSaving} className="gap-2">
            {isSaving ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Settings
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Separator />

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
          <CardDescription>Manage application data and cache</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h3 className="font-semibold text-gray-900">Clear Cache</h3>
              <p className="text-sm text-gray-500">Clear all cached data and refresh</p>
            </div>
            <Button variant="outline" onClick={handleClearCache}>
              Clear Cache
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h3 className="font-semibold text-gray-900">Database Statistics</h3>
              <p className="text-sm text-gray-500">View database size and statistics</p>
            </div>
            <Button variant="outline" disabled>
              View Stats
            </Button>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-700">Danger Zone</CardTitle>
          <CardDescription>Irreversible and destructive actions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg">
            <div>
              <h3 className="font-semibold text-gray-900">Reset All Data</h3>
              <p className="text-sm text-gray-500">
                Delete all users, startups, and analyses. This cannot be undone.
              </p>
            </div>
            <Button
              variant="destructive"
              onClick={() => {
                if (confirm("Are you sure? This will delete ALL data and cannot be undone!")) {
                  alert("This action is disabled in demo mode")
                }
              }}
            >
              Reset Everything
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}