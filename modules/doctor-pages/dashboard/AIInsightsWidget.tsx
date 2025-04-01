import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, ChevronRight, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, RefreshCw, Info, ArrowRight, Lightbulb } from 'lucide-react';

const AIInsightsWidget = () => {
  const [insights, setInsights] = useState([
    {
      id: 1,
      title: 'Potential medication interaction',
      description: 'Patient Emma Wilson is on both Lisinopril and Potassium supplements, which may cause hyperkalemia.',
      type: 'warning',
      patientId: 'P-1003',
      patientName: 'Emma Wilson',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      viewed: false,
      confidence: 0.89
    },
    {
      id: 2,
      title: 'Appointment scheduling optimization',
      description: 'Scheduling follow-ups on Tuesday mornings could reduce wait times by 15% based on historical data.',
      type: 'optimization',
      patientId: null,
      patientName: null,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
      viewed: true,
      confidence: 0.76
    },
    {
      id: 3,
      title: 'Trending symptoms in your practice',
      description: 'There has been a 23% increase in respiratory complaints this month compared to last month.',
      type: 'trend',
      patientId: null,
      patientName: null,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      viewed: false,
      confidence: 0.82
    },
    {
      id: 4,
      title: 'Treatment effectiveness',
      description: 'Patients prescribed the new hypertension protocol show 18% better blood pressure control after 30 days.',
      type: 'positive',
      patientId: null,
      patientName: null,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 36), // 1.5 days ago
      viewed: true,
      confidence: 0.91
    }
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [activeInsight, setActiveInsight] = useState(null);
  const [filter, setFilter] = useState('all');

  // Filter insights
  const filteredInsights = insights.filter(insight => {
    if (filter === 'all') return true;
    return insight.type === filter;
  });

  // Mark insight as viewed
  const markAsViewed = (id) => {
    setInsights(insights.map(insight => 
      insight.id === id ? { ...insight, viewed: true } : insight
    ));
  };

  // Refresh insights
  const refreshInsights = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      // In a real app, this would fetch new insights from an API
      setIsLoading(false);
    }, 1500);
  };

  // Get insight icon
  const getInsightIcon = (type) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle size={16} className="text-amber-500" />;
      case 'optimization':
        return <Lightbulb size={16} className="text-blue-500" />;
      case 'trend':
        return <TrendingUp size={16} className="text-purple-500" />;
      case 'positive':
        return <CheckCircle size={16} className="text-green-500" />;
      default:
        return <Info size={16} className="text-gray-500" />;
    }
  };

  // Get insight background color
  const getInsightBackground = (type) => {
    switch (type) {
      case 'warning':
        return 'bg-amber-50 border-amber-200';
      case 'optimization':
        return 'bg-blue-50 border-blue-200';
      case 'trend':
        return 'bg-purple-50 border-purple-200';
      case 'positive':
        return 'bg-green-50 border-green-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="bg-white border rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-[#006D77] flex items-center">
          <Sparkles className="mr-2" size={20} />
          AI Insights
        </h2>
        <button 
          onClick={refreshInsights}
          className="p-1.5 rounded-full bg-[#F0F9FA] text-[#006D77] hover:bg-[#E8F3F4] transition-colors"
          disabled={isLoading}
        >
          <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
        </button>
      </div>
      
      {/* Filter tabs */}
      <div className="flex space-x-2 mb-3 overflow-x-auto pb-1 text-xs">
        <button 
          onClick={() => setFilter('all')}
          className={`px-2 py-1 rounded-md whitespace-nowrap ${filter === 'all' ? 'bg-[#006D77] text-white' : 'bg-gray-100 text-gray-800'}`}
        >
          All Insights
        </button>
        <button 
          onClick={() => setFilter('warning')}
          className={`px-2 py-1 rounded-md whitespace-nowrap flex items-center ${filter === 'warning' ? 'bg-amber-500 text-white' : 'bg-amber-50 text-amber-800'}`}
        >
          <AlertTriangle size={12} className="mr-1" /> Warnings
        </button>
        <button 
          onClick={() => setFilter('optimization')}
          className={`px-2 py-1 rounded-md whitespace-nowrap flex items-center ${filter === 'optimization' ? 'bg-blue-500 text-white' : 'bg-blue-50 text-blue-800'}`}
        >
          <Lightbulb size={12} className="mr-1" /> Optimizations
        </button>
        <button 
          onClick={() => setFilter('trend')}
          className={`px-2 py-1 rounded-md whitespace-nowrap flex items-center ${filter === 'trend' ? 'bg-purple-500 text-white' : 'bg-purple-50 text-purple-800'}`}
        >
          <TrendingUp size={12} className="mr-1" /> Trends
        </button>
      </div>
      
      {/* Insights List */}
      <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <RefreshCw size={24} className="animate-spin text-[#006D77]" />
          </div>
        ) : filteredInsights.length > 0 ? (
          filteredInsights.map(insight => (
            <div 
              key={insight.id}
              className={`p-3 rounded-md border ${getInsightBackground(insight.type)} ${!insight.viewed ? 'ring-1 ring-[#006D77]' : ''} relative`}
              onClick={() => {
                setActiveInsight(activeInsight?.id === insight.id ? null : insight);
                if (!insight.viewed) markAsViewed(insight.id);
              }}
            >
              <div className="flex items-start">
                <div className="mr-3 p-2 rounded-full bg-white flex-shrink-0">
                  {getInsightIcon(insight.type)}
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <p className="font-medium text-sm">{insight.title}</p>
                    <div className="flex items-center">
                      <span className="text-xs bg-white px-2 py-0.5 rounded-full text-gray-600">
                        {Math.round(insight.confidence * 100)}% confidence
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">{insight.description}</p>
                  
                  {/* Expanded content */}
                  {activeInsight?.id === insight.id && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      {insight.patientId && (
                        <div className="mb-2">
                          <span className="text-xs font-medium text-gray-500">Related Patient:</span>
                          <Link 
                            href={`/Doctor/Patients/${insight.patientId}`}
                            className="ml-1 text-xs text-[#006D77] hover:underline"
                          >
                            {insight.patientName}
                          </Link>
                        </div>
                      )}
                      <div className="flex justify-end">
                        <button className="text-xs bg-[#006D77] text-white px-3 py-1 rounded-md flex items-center">
                          Take Action <ArrowRight size={12} className="ml-1" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                {!insight.viewed && (
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#006D77]"></span>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-6 text-gray-500">
            <p>No insights found for this filter</p>
            {filter !== 'all' && (
              <button 
                onClick={() => setFilter('all')}
                className="mt-2 text-sm text-[#006D77] hover:underline"
              >
                Show all insights
              </button>
            )}
          </div>
        )}
      </div>
      
      <div className="mt-3 text-center">
        <Link href="/Doctor/AI-Insights" className="text-[#006D77] text-sm hover:underline flex items-center justify-center">
          View All Insights <ChevronRight size={16} />
        </Link>
      </div>
    </div>
  );
};

export default AIInsightsWidget;