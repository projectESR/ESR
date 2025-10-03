import { useEffect, useState } from 'react';
import { FileText, Calendar, TrendingUp, Loader2 } from 'lucide-react';
import { supabase, BloodReport } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface ReportHistoryProps {
  onViewReport: (reportId: string) => void;
}

export default function ReportHistory({ onViewReport }: ReportHistoryProps) {
  const { user } = useAuth();
  const [reports, setReports] = useState<BloodReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, [user]);

  const fetchReports = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('blood_reports')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReports(data || []);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
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

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Report History</h1>
        <p className="text-gray-600">View all your previous blood type analyses</p>
      </div>

      {reports.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg border border-red-100 p-12 text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-10 h-10 text-red-600" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-2">No Reports Yet</h3>
          <p className="text-gray-600 mb-6">
            Start by uploading your first blood test card image
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {reports.map((report) => (
            <button
              key={report.id}
              onClick={() => onViewReport(report.id)}
              className="bg-white rounded-xl shadow-md border border-red-100 p-6 hover:shadow-xl hover:border-red-200 transition-all text-left group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">{report.blood_type}</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-red-600 transition-colors">
                      Blood Type: {report.blood_type}
                    </h3>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(report.created_at)}
                      </span>
                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        {(report.confidence_score * 100).toFixed(1)}% confidence
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  View Details →
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
