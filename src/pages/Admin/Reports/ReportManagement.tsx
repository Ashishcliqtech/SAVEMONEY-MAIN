import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Download,
  Calendar,
  Filter,
  BarChart3,
  PieChart,
  TrendingUp,
  Users,
  DollarSign,
  ShoppingBag,
  Clock,
  Eye,
} from 'lucide-react';
import { Card, Button, Badge, Input } from '../../../components/ui';
import toast from 'react-hot-toast';

interface Report {
  id: string;
  name: string;
  type: 'financial' | 'user' | 'store' | 'offer' | 'transaction';
  description: string;
  lastGenerated: string;
  fileSize: string;
  format: 'pdf' | 'excel' | 'csv';
  status: 'ready' | 'generating' | 'failed';
}

export const ReportManagement: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([
    {
      id: '1',
      name: 'Monthly Financial Report',
      type: 'financial',
      description: 'Complete financial overview including revenue, cashback paid, and profit margins',
      lastGenerated: '2025-01-22T10:30:00Z',
      fileSize: '2.4 MB',
      format: 'pdf',
      status: 'ready',
    },
    {
      id: '2',
      name: 'User Activity Report',
      type: 'user',
      description: 'User engagement metrics, signup trends, and retention analysis',
      lastGenerated: '2025-01-21T14:15:00Z',
      fileSize: '1.8 MB',
      format: 'excel',
      status: 'ready',
    },
    {
      id: '3',
      name: 'Store Performance Report',
      type: 'store',
      description: 'Store-wise performance metrics, top performers, and growth analysis',
      lastGenerated: '2025-01-20T09:45:00Z',
      fileSize: '3.1 MB',
      format: 'pdf',
      status: 'ready',
    },
    {
      id: '4',
      name: 'Transaction Analysis',
      type: 'transaction',
      description: 'Detailed transaction analysis with fraud detection insights',
      lastGenerated: '2025-01-19T16:20:00Z',
      fileSize: '4.2 MB',
      format: 'csv',
      status: 'generating',
    },
  ]);

  const [dateRange, setDateRange] = useState({
    from: '',
    to: '',
  });

  const reportTypes = [
    { value: 'financial', label: 'Financial Reports', icon: DollarSign, color: 'text-green-600' },
    { value: 'user', label: 'User Reports', icon: Users, color: 'text-blue-600' },
    { value: 'store', label: 'Store Reports', icon: ShoppingBag, color: 'text-purple-600' },
    { value: 'offer', label: 'Offer Reports', icon: Star, color: 'text-orange-600' },
    { value: 'transaction', label: 'Transaction Reports', icon: TrendingUp, color: 'text-teal-600' },
  ];

  const quickReports = [
    {
      name: 'Today\'s Summary',
      description: 'Quick overview of today\'s key metrics',
      icon: Clock,
      color: 'bg-blue-500',
    },
    {
      name: 'Weekly Performance',
      description: 'Last 7 days performance summary',
      icon: BarChart3,
      color: 'bg-green-500',
    },
    {
      name: 'Top Performers',
      description: 'Best performing stores and offers',
      icon: TrendingUp,
      color: 'bg-purple-500',
    },
    {
      name: 'User Insights',
      description: 'User behavior and engagement metrics',
      icon: Users,
      color: 'bg-orange-500',
    },
  ];

  const handleGenerateReport = (reportType: string) => {
    toast.success(`Generating ${reportType} report...`);
    // Simulate report generation
    setTimeout(() => {
      toast.success('Report generated successfully!');
    }, 3000);
  };

  const handleDownload = (reportId: string) => {
    toast.success('Downloading report...');
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'financial': return 'success';
      case 'user': return 'info';
      case 'store': return 'primary';
      case 'offer': return 'warning';
      case 'transaction': return 'secondary';
      default: return 'secondary';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'success';
      case 'generating': return 'warning';
      case 'failed': return 'danger';
      default: return 'secondary';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Reports & Analytics
          </h1>
          <p className="text-gray-600">
            Generate and download detailed reports for business insights
          </p>
        </div>

        {/* Quick Reports */}
        <Card className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Quick Reports
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickReports.map((report, index) => (
              <motion.div
                key={report.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center p-4 rounded-xl hover:bg-gray-50 transition-colors group cursor-pointer border border-gray-200">
                  <div className={`w-12 h-12 ${report.color} rounded-xl flex items-center justify-center mr-4`}>
                    <report.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 group-hover:text-purple-600 transition-colors">
                      {report.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {report.description}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Report Generator */}
        <Card className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Custom Report Generator
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Report Type
                </label>
                <div className="space-y-2">
                  {reportTypes.map((type) => (
                    <label key={type.value} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="radio"
                        name="reportType"
                        value={type.value}
                        className="text-purple-600 focus:ring-purple-500"
                      />
                      <type.icon className={`w-5 h-5 ml-3 mr-2 ${type.color}`} />
                      <span className="font-medium">{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="From Date"
                  type="date"
                  value={dateRange.from}
                  onChange={(e) => setDateRange({...dateRange, from: e.target.value})}
                />
                <Input
                  label="To Date"
                  type="date"
                  value={dateRange.to}
                  onChange={(e) => setDateRange({...dateRange, to: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Format
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                  <option value="pdf">PDF Report</option>
                  <option value="excel">Excel Spreadsheet</option>
                  <option value="csv">CSV Data</option>
                </select>
              </div>

              <Button
                variant="primary"
                size="lg"
                fullWidth
                icon={FileText}
                onClick={() => handleGenerateReport('custom')}
              >
                Generate Report
              </Button>
            </div>
          </div>
        </Card>

        {/* Generated Reports */}
        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Generated Reports
          </h2>
          
          <div className="space-y-4">
            {reports.map((report, index) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                    <FileText className="w-6 h-6 text-gray-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{report.name}</div>
                    <div className="text-sm text-gray-500">{report.description}</div>
                    <div className="flex items-center space-x-4 text-xs text-gray-400 mt-1">
                      <span>Generated: {new Date(report.lastGenerated).toLocaleDateString()}</span>
                      <span>Size: {report.fileSize}</span>
                      <Badge variant={getTypeColor(report.type)} size="sm">
                        {report.type}
                      </Badge>
                      <Badge variant={getStatusColor(report.status)} size="sm">
                        {report.status}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={Eye}
                  >
                    Preview
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    icon={Download}
                    onClick={() => handleDownload(report.id)}
                    disabled={report.status !== 'ready'}
                  >
                    Download
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};