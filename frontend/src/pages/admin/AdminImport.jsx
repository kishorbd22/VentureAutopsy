import { useRef, useState } from "react"
import { useImportCSV, useSampleTemplate } from "../../hooks/useAdmin"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Upload, Download, FileSpreadsheet, CheckCircle2, AlertCircle, Loader2 } from "lucide-react"

export default function AdminImport() {
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploadStatus, setUploadStatus] = useState(null) // 'success' | 'error' | null
  const [importResult, setImportResult] = useState(null)
  const fileInputRef = useRef(null)

  const importMutation = useImportCSV()
  const { data: templateData } = useSampleTemplate()

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.name.endsWith(".csv")) {
        setUploadStatus("error")
        setImportResult({ message: "Only CSV files are allowed" })
        return
      }
      setSelectedFile(file)
      setUploadStatus(null)
      setImportResult(null)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    try {
      const result = await importMutation.mutateAsync(selectedFile)
      setUploadStatus("success")
      setImportResult(result)
      setSelectedFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ""
    } catch (error) {
      setUploadStatus("error")
      setImportResult({ message: error.response?.data?.detail || "Import failed" })
    }
  }

  const handleDownloadTemplate = () => {
    if (!templateData?.success) return
    const blob = new Blob([templateData.data], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = templateData.filename || "template.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Import Data</h1>
        <p className="text-gray-500 mt-1">Upload CSV files to populate the database</p>
      </div>

      {/* CSV Import Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload CSV File
          </CardTitle>
          <CardDescription>
            Import startup data from a CSV file. The file should contain columns: name, industry,
            country, total_funding_usd, number_of_employees, death_cause, stage_at_death
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* File Input */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-500 transition-colors">
            <FileSpreadsheet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <Input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="max-w-md mx-auto"
            />
            {selectedFile && (
              <p className="mt-2 text-sm text-gray-600">
                Selected: <span className="font-medium">{selectedFile.name}</span>
              </p>
            )}
          </div>

          {/* Upload Button */}
          <div className="flex justify-center">
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || importMutation.isPending}
              className="gap-2"
            >
              {importMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Import CSV
                </>
              )}
            </Button>
          </div>

          {/* Status Messages */}
          {uploadStatus === "success" && importResult && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-green-900">Import Successful</p>
                <p className="text-sm text-green-700 mt-1">
                  {importResult.message || `Successfully imported ${importResult.data?.imported || 0} startups`}
                </p>
              </div>
            </div>
          )}

          {uploadStatus === "error" && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-red-900">Import Failed</p>
                <p className="text-sm text-red-700 mt-1">
                  {importResult?.message || "An error occurred during import"}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Template Download Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Download Template
          </CardTitle>
          <CardDescription>
            Get the sample CSV template to ensure proper formatting
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            onClick={handleDownloadTemplate}
            disabled={!templateData?.success}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Download CSV Template
          </Button>
          {templateData?.success && (
            <p className="text-sm text-gray-500 mt-2">
              Template ready: {templateData.filename}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Import Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="font-semibold">1.</span>
              Download the CSV template using the button above
            </li>
            <li className="flex items-start gap-2">
              <span className="font-semibold">2.</span>
              Fill in your startup data following the template format
            </li>
            <li className="flex items-start gap-2">
              <span className="font-semibold">3.</span>
              Upload the completed CSV file
            </li>
            <li className="flex items-start gap-2">
              <span className="font-semibold">4.</span>
              Wait for the import to complete and review the results
            </li>
          </ul>

          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900">
              <strong>Note:</strong> Large files may take a few moments to process. All imported data
              will be validated before being added to the database.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}