import { useEffect, useState } from 'react';
import { ArrowLeft, Calendar, TrendingUp, Droplet, Loader2 } from 'lucide-react';
import { supabase } from './supabase';

interface ReportDetailProps {
  reportId: string;
  onBack: () => void;
}

export default function ReportDetail({ reportId, onBack }: ReportDetailProps) {
  const [report, setReport] = useState<BloodReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReport();
  }, [reportId]);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('blood_reports')
        .select('*')
        .eq('id', reportId)
        .maybeSingle();

      if (error) throw error;
      setReport(data);
    } catch (error) {
      console.error('Error fetching report:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20">
        <p className="text-gray-600">Report not found</p>
        <button onClick={onBack} className="mt-4 text-red-600 hover:text-red-700">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to History
      </button>

      <div className="bg-white rounded-2xl shadow-lg border border-red-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-500 p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Blood Type Analysis Report</h1>
              <div className="flex items-center gap-4 text-red-100">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {formatDate(report.created_at)}
                </span>
              </div>
            </div>
            <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
              <Droplet className="w-10 h-10" fill="currentColor" />
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="p-8 space-y-8">
          {/* Blood Type */}
          <div className="text-center py-8 border-b">
            <p className="text-gray-600 mb-2">Detected Blood Type</p>
            <div className="text-7xl font-bold bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
              {report.blood_type}
            </div>
          </div>

          {/* Confidence Score */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-red-50 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-5 h-5 text-red-600" />
                <h3 className="font-semibold text-gray-900">Confidence Score</h3>
              </div>
              <div className="text-4xl font-bold text-red-600">
                {(report.confidence_score * 100).toFixed(1)}%
              </div>
            </div>

            <div className="p-6 bg-gray-50 rounded-xl">
              <h3 className="font-semibold text-gray-900 mb-2">Report ID</h3>
              <p className="text-sm text-gray-600 font-mono break-all">{report.id}</p>
            </div>
          </div>

          {/* Section Analysis */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Detailed Section Analysis</h3>
            <div className="space-y-3">
              {Object.entries(report.analysis_data).map(([key, value]: [string, any]) => (
                <div key={key} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900 capitalize">
                        {key.replace('_', ' ')}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Agglutination: {value.agglutination ? 'Detected' : 'Not Detected'}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                        value.agglutination
                          ? 'bg-red-100 text-red-700'
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {value.agglutination ? 'Positive' : 'Negative'}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Confidence: {(value.confidence * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Image */}
          {report.image_url && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Test Card Image</h3>
              <div className="rounded-lg overflow-hidden border border-gray-200">
                <img
                  src={report.image_url}
                  alt="Blood test card"
                  className="w-full h-auto"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
