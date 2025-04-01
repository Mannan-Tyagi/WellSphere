import React, { useState } from 'react';
import Link from 'next/link';
import { BarChart3, ChevronRight, TrendingUp, TrendingDown, Users, Clock, Calendar, DollarSign, Activity, Filter } from 'lucide-react';

const AnalyticsSummaryWidget = () => {
  const [timeRange, setTimeRange] = useState('week');
  const [activeTab, setActiveTab] = useState('overview');
  
  // Mock analytics data
  const analyticsData = {
    overview: {
      day: {
        patientsServed: 8,
        patientsChange: 0,
        avgWaitTime: '12 min',
        waitTimeChange: -5,
        appointmentCompletion: 92,
        completionChange: 2,
        revenue: '$1,240',
        revenueChange: 5
      },
      week: {
        patientsServed: 42,
        patientsChange: 8,
        avgWaitTime: '15 min',
        waitTimeChange: -10,
        appointmentCompletion: 88,
        completionChange: 3,
        revenue: '$6,850',
        revenueChange: 12
      },
      month: {
        patientsServed: 168,
        patientsChange: 15,
        avgWaitTime: '18 min',
        waitTimeChange: -8,
        appointmentCompletion: 85,
        completionChange: 5,
        revenue: '$27,400',
        revenueChange: 18
      }
    },
    patientMetrics: {
      day: {
        newPatients: 2,
        newPatientsChange: 0,
        returningPatients: 6,
        returningPatientsChange: 1,
        noShows: 1,
        noShowsChange: -1,
        referrals: 3,
        referralsChange: 2
      },
      week: {
        newPatients: 12,
        newPatientsChange: 3,
        returningPatients: 30,
        returningPatientsChange: 5,
        noShows: 4,
        noShowsChange: -2,
        referrals: 15,
        referralsChange: 4
      },
      month: {
        newPatients: 45,
        newPatientsChange: 8,
        returningPatients: 123,
        returningPatientsChange: 7,
        noShows: 15,
        noShowsChange: -5,
        referrals: 52,
        referralsChange: 12
      }
    },
    clinicalMetrics: {
      day: {
        procedures: 5,
        proceduresChange: 1,
        prescriptions: 12,
        prescriptionsChange: 2,
        labTests: 8,
        labTestsChange: 0,
        followUps: 6,
        followUpsChange: 1
      },
      week: {
        procedures: 28,
        proceduresChange: 4,
        prescriptions: 65,
        prescriptionsChange: 8,
        labTests: 42,
        labTestsChange: 5,
        followUps: 35,
        followUpsChange: 3
      },
      month: {
        procedures: 112,
        proceduresChange: 15,
        prescriptions: 245,
        prescriptionsChange: 22,
        labTests: 168,
        labTestsChange: 18,
        followUps: 140,
        followUpsChange: 12
      }
    }
  };
  
  // Get current data based on selected time range and tab
  const currentData = analyticsData[activeTab][timeRange];
  
  // Helper function to render trend indicator
  const renderTrend = (value, inverse = false) => {
    const isPositive = inverse ? value < 0 : value > 0;
    const isNeutral = value === 0;
    
    if (isNeutral) {
      return <span className="text-gray-500 text-xs">No change</span>;
    }
    
    return (
      <div className={`flex items-center ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
        <span className="ml-1 text-xs">{Math.abs(value)}%</span>
      </div>
    );
  };
  
  return (
    <div className="bg-white border rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-[#006D77] flex items-center">
          <BarChart3 className="mr-2" size={20} />
          Analytics Summary
        </h2>
        <div className="flex text-xs">
          <button 
            onClick={() => setTimeRange('day')}
            className={`px-2 py-1 rounded-l-md ${timeRange === 'day' ? 'bg-[#006D77] text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
          >
            Day
          </button>
          <button 
            onClick={() => setTimeRange('week')}
            className={`px-2 py-1 ${timeRange === 'week' ? 'bg-[#006D77] text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
          >
            Week
          </button>
          <button 
            onClick={() => setTimeRange('month')}
            className={`px-2 py-1 rounded-r-md ${timeRange === 'month' ? 'bg-[#006D77] text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
          >
            Month
          </button>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="flex space-x-2 mb-4 overflow-x-auto pb-1 text-xs">
        <button 
          onClick={() => setActiveTab('overview')}
          className={`px-3 py-1.5 rounded-md whitespace-nowrap ${activeTab === 'overview' ? 'bg-[#006D77] text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
        >
          Overview
        </button>
        <button 
          onClick={() => setActiveTab('patientMetrics')}
          className={`px-3 py-1.5 rounded-md whitespace-nowrap ${activeTab === 'patientMetrics' ? 'bg-[#006D77] text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
        >
          Patient Metrics
        </button>
        <button 
          onClick={() => setActiveTab('clinicalMetrics')}
          className={`px-3 py-1.5 rounded-md whitespace-nowrap ${activeTab === 'clinicalMetrics' ? 'bg-[#006D77] text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
        >
          Clinical Metrics
        </button>
      </div>
      
      {/* Overview Metrics */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-blue-700 font-medium flex items-center">
                  <Users size={14} className="mr-1" /> Patients Served
                </p>
                <p className="text-xl font-bold text-blue-900">{currentData.patientsServed}</p>
              </div>
              <div>{renderTrend(currentData.patientsChange)}</div>
            </div>
          </div>
          
          <div className="p-3 bg-green-50 rounded-lg border border-green-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-green-700 font-medium flex items-center">
                  <Clock size={14} className="mr-1" /> Avg. Wait Time
                </p>
                <p className="text-xl font-bold text-green-900">{currentData.avgWaitTime}</p>
              </div>
              <div>{renderTrend(currentData.waitTimeChange, true)}</div>
            </div>
          </div>
          
          <div className="p-3 bg-purple-50 rounded-lg border border-purple-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-purple-700 font-medium flex items-center">
                  <Calendar size={14} className="mr-1" /> Appt. Completion
                </p>
                <p className="text-xl font-bold text-purple-900">{currentData.appointmentCompletion}%</p>
              </div>
              <div>{renderTrend(currentData.completionChange)}</div>
            </div>
          </div>
          
          <div className="p-3 bg-amber-50 rounded-lg border border-amber-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-amber-700 font-medium flex items-center">
                  <DollarSign size={14} className="mr-1" /> Revenue
                </p>
                <p className="text-xl font-bold text-amber-900">{currentData.revenue}</p>
              </div>
              <div>{renderTrend(currentData.revenueChange)}</div>
            </div>
          </div>
        </div>
      )}
      
      {/* Patient Metrics */}
      {activeTab === 'patientMetrics' && (
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-blue-700 font-medium">New Patients</p>
                <p className="text-xl font-bold text-blue-900">{currentData.newPatients}</p>
              </div>
              <div>{renderTrend(currentData.newPatientsChange)}</div>
            </div>
          </div>
          
          <div className="p-3 bg-green-50 rounded-lg border border-green-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-green-700 font-medium">Returning</p>
                <p className="text-xl font-bold text-green-900">{currentData.returningPatients}</p>
              </div>
              <div>{renderTrend(currentData.returningPatientsChange)}</div>
            </div>
          </div>
          
          <div className="p-3 bg-red-50 rounded-lg border border-red-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-red-700 font-medium">No-Shows</p>
                <p className="text-xl font-bold text-red-900">{currentData.noShows}</p>
              </div>
              <div>{renderTrend(currentData.noShowsChange, true)}</div>
            </div>
          </div>
          
          <div className="p-3 bg-purple-50 rounded-lg border border-purple-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-purple-700 font-medium">Referrals</p>
                <p className="text-xl font-bold text-purple-900">{currentData.referrals}</p>
              </div>
              <div>{renderTrend(currentData.referralsChange)}</div>
            </div>
          </div>
        </div>
      )}
      
      {/* Clinical Metrics */}
      {activeTab === 'clinicalMetrics' && (
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-blue-700 font-medium">Procedures</p>
                <p className="text-xl font-bold text-blue-900">{currentData.procedures}</p>
              </div>
              <div>{renderTrend(currentData.proceduresChange)}</div>
            </div>
          </div>
          
          <div className="p-3 bg-green-50 rounded-lg border border-green-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-green-700 font-medium">Prescriptions</p>
                <p className="text-xl font-bold text-green-900">{currentData.prescriptions}</p>
              </div>
              <div>{renderTrend(currentData.prescriptionsChange)}</div>
            </div>
          </div>
          
          <div className="p-3 bg-purple-50 rounded-lg border border-purple-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-purple-700 font-medium">Lab Tests</p>
                <p className="text-xl font-bold text-purple-900">{currentData.labTests}</p>
              </div>
              <div>{renderTrend(currentData.labTestsChange)}</div>
            </div>
          </div>
          
          <div className="p-3 bg-amber-50 rounded-lg border border-amber-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-amber-700 font-medium">Follow-ups</p>
                <p className="text-xl font-bold text-amber-900">{currentData.followUps}</p>
              </div>
              <div>{renderTrend(currentData.followUpsChange)}</div>
            </div>
          </div>
        </div>
      )}
      
      <div className="mt-4 text-center">
        <Link href="/Doctor/Analytics" className="text-[#006D77] text-sm hover:underline flex items-center justify-center">
          View Detailed Analytics <ChevronRight size={16} />
        </Link>
      </div>
    </div>
  );
};

export default AnalyticsSummaryWidget;