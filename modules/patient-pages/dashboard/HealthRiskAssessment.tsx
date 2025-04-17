import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronRight, Sparkles, AlertTriangle, TrendingUp, TrendingDown, Info } from 'lucide-react';

const HealthRiskAssessment = () => {
  // Mock health risk data
  const healthRisks = [
    {
      id: 1,
      title: 'Elevated risk for heart disease',
      description: 'Based on family history and current cholesterol levels',
      severity: 'medium',
      actionable: true,
      recommendations: [
        'Consider scheduling a cardiac workup',
        'Discuss statin therapy with your doctor'
      ],
      confidence: 0.78
    },
    {
      id: 2,
      title: 'Pre-diabetic indicators',
      description: 'A1C levels trending upward over last 3 readings',
      severity: 'high',
      actionable: true,
      trend: 'increasing',
      recommendations: [
        'Increase physical activity',
        'Reduce refined carbohydrate intake',
        'Monitor blood glucose more frequently'
      ],
      confidence: 0.85
    },
    {
      id: 3,
      title: 'Vitamin D deficiency risk',
      description: 'Based on lab results and seasonal factors',
      severity: 'low',
      actionable: true,
      trend: 'stable',
      recommendations: [
        'Consider vitamin D supplementation',
        'Increase sun exposure safely'
      ],
      confidence: 0.92
    }
  ];
  
  // Helper function to get severity badge
  const getSeverityBadge = (severity) => {
    switch (severity) {
      case 'high':
        return <Badge className="bg-rose-100 text-rose-800 border-rose-200">High Risk</Badge>;
      case 'medium':
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200">Medium Risk</Badge>;
      case 'low':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Low Risk</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Unknown</Badge>;
    }
  };
  
  // Helper function to get trend icon
  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'increasing':
        return <TrendingUp className="h-4 w-4 text-rose-600" />;
      case 'decreasing':
        return <TrendingDown className="h-4 w-4 text-emerald-600" />;
      case 'stable':
        return <Info className="h-4 w-4 text-blue-600" />;
      default:
        return null;
    }
  };
  
  return (
    <Card className="border-[#E8F3F4] shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold flex items-center text-[#006D77]">
          <Sparkles className="mr-2 h-5 w-5" />
          AI Health Assessment
        </CardTitle>
        <Link href="/patient/health/risks" className="text-sm text-[#006D77] hover:underline flex items-center">
          View All <ChevronRight className="h-4 w-4" />
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-3 bg-[#F0F9FA] rounded-lg border border-[#E8F3F4] text-sm">
            <p className="flex items-center text-[#006D77]">
              <Sparkles className="h-4 w-4 mr-2" />
              Personalized risk assessment based on your health data, family history, and lifestyle factors.
            </p>
          </div>
          
          {healthRisks.map((risk) => (
            <div 
              key={risk.id} 
              className={`border rounded-lg p-3 hover:bg-gray-50 transition-colors ${
                risk.severity === 'high' ? 'border-rose-200' : 'border-gray-200'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-start">
                  {risk.severity === 'high' && (
                    <AlertTriangle className="h-5 w-5 text-rose-600 mr-2 mt-0.5 flex-shrink-0" />
                  )}
                  <div>
                    <h3 className="font-medium">{risk.title}</h3>
                    <p className="text-sm text-gray-600">{risk.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {risk.trend && getTrendIcon(risk.trend)}
                  {getSeverityBadge(risk.severity)}
                </div>
              </div>
              
              {risk.recommendations && (
                <div className="mt-2">
                  <h4 className="text-sm font-medium text-gray-700">Recommendations:</h4>
                  <ul className="mt-1 space-y-1">
                    {risk.recommendations.map((rec, idx) => (
                      <li key={idx} className="text-sm text-gray-600 flex items-start">
                        <span className="mr-2">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="mt-3 flex justify-between items-center">
                <div className="text-xs text-gray-500">
                  AI confidence: {Math.round(risk.confidence * 100)}%
                </div>
                {risk.actionable && (
                  <Button 
                    size="sm" 
                    className="bg-[#006D77] hover:bg-[#00585F] h-7"
                  >
                    Take Action
                  </Button>
                )}
              </div>
            </div>
          ))}
          
          {healthRisks.length === 0 && (
            <div className="py-8 text-center text-gray-500">
              <p>No health risks identified</p>
              <Button className="mt-2 bg-[#006D77] hover:bg-[#00585F]">
                Run Assessment
              </Button>
            </div>
          )}
          
          <div className="text-xs text-gray-500 italic text-center">
            Last updated: {new Date().toLocaleDateString()}. This assessment is not a substitute for professional medical advice.
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HealthRiskAssessment;
