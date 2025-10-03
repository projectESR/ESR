import { useState, useRef } from 'react';
import { Droplet, Upload, Camera, History, FileText, Loader2, X } from 'lucide-react';
import ReportHistory from './ReportHistory';
import ReportDetail from './ReportDetail';

export default function MainApp() {
  const [view, setView] = useState<'upload' | 'history' | 'report'>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setAnalyzing(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch('http://localhost:8000/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Analysis failed');
      const analysis = await response.json();
      setResult(analysis);
      setView('report');
    } catch (error) {
      console.error('Analysis error:', error);
      alert('An error occurred during analysis');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleViewReport = (reportId: string) => {
    setSelectedReportId(reportId);
    setView('report');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-red-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                <Droplet className="w-6 h-6 text-white" fill="currentColor" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
                BloodType AI
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 rounded-lg">
                <span className="text-sm text-gray-700">Blood Analysis System</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-red-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1">
            <button
              onClick={() => setView('upload')}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-all ${
                view === 'upload'
                  ? 'text-red-600 border-b-2 border-red-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>New Analysis</span>
            </button>
            <button
              onClick={() => setView('history')}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-all ${
                view === 'history'
                  ? 'text-red-600 border-b-2 border-red-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <History className="w-4 h-4" />
              <span>History</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {view === 'upload' && (
          <div className="max-w-4xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Upload Section */}
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Analyze Blood Test Card
                  </h1>
                  <p className="text-gray-600">
                    Upload a clear image of your blood test card for instant analysis
                  </p>
                </div>

                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`relative border-2 border-dashed rounded-2xl p-8 transition-all ${
                    dragActive
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-300 hover:border-red-400 bg-white'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />

                  {!previewUrl ? (
                    <div className="text-center">
                      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Upload className="w-8 h-8 text-red-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Upload Test Card Image
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Drag and drop or click to browse
                      </p>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-6 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-all"
                      >
                        Choose File
                      </button>
                      <p className="text-xs text-gray-500 mt-4">
                        Supports: JPG, PNG (Max 10MB)
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="relative rounded-lg overflow-hidden">
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="w-full h-64 object-contain bg-gray-100"
                        />
                        <button
                          onClick={handleReset}
                          className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <button
                        onClick={handleAnalyze}
                        disabled={analyzing}
                        className="w-full py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {analyzing ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Analyzing...</span>
                          </>
                        ) : (
                          <>
                            <FileText className="w-5 h-5" />
                            <span>Analyze Blood Type</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-2 px-4 py-2 border-2 border-gray-300 rounded-lg hover:border-red-400 transition-all text-gray-700 hover:text-red-600">
                    <Camera className="w-4 h-4" />
                    <span>Use Camera</span>
                  </button>
                </div>
              </div>

              {/* Results Section */}
              <div>
                {result ? (
                  <div className="bg-white rounded-2xl shadow-lg border border-red-100 p-8 space-y-6">
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-full mb-4">
                        <Droplet className="w-10 h-10 text-white" fill="currentColor" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">Analysis Complete</h2>
                      <div className="text-6xl font-bold bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent mb-2">
                        {result.blood_type}
                      </div>
                      <p className="text-gray-600">Blood Type Detected</p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg">
                        <span className="font-medium text-gray-700">Confidence Score</span>
                        <span className="text-2xl font-bold text-red-600">
                          {(result.confidence_score * 100).toFixed(1)}%
                        </span>
                      </div>

                      <div className="space-y-2">
                        <h3 className="font-semibold text-gray-900">Section Analysis</h3>
                        {Object.entries(result.analysis_data).map(([key, value]: [string, any]) => (
                          <div key={key} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg text-sm">
                            <span className="text-gray-700 capitalize">
                              {key.replace('_', ' ')}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-1 rounded ${
                                value.agglutination ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                              }`}>
                                {value.agglutination ? 'Positive' : 'Negative'}
                              </span>
                              <span className="text-gray-600">
                                {(value.confidence * 100).toFixed(0)}%
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={handleReset}
                      className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-all"
                    >
                      Analyze Another
                    </button>
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl shadow-lg border border-red-100 p-8 text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-8 h-8 text-red-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Ready to Analyze
                    </h3>
                    <p className="text-gray-600">
                      Upload a blood test card image to get started with the analysis
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {view === 'history' && <ReportHistory onViewReport={handleViewReport} />}
        {view === 'report' && selectedReportId && (
          <ReportDetail reportId={selectedReportId} onBack={() => setView('history')} />
        )}
      </main>
    </div>
  );
}
