"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BarChart2,
  ArrowUp,
  ArrowDown,
  Droplets,
  TrendingUp,
  TrendingDown,
  Info,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area,
  AreaChart,
} from "recharts";

// Mock predictive data for blood pressure
const predictiveBPData = [
  { date: "2024-03-01", systolic: 125, diastolic: 82, prediction: false },
  { date: "2024-03-02", systolic: 128, diastolic: 84, prediction: false },
  { date: "2024-03-03", systolic: 130, diastolic: 85, prediction: false },
  { date: "2024-03-04", systolic: 127, diastolic: 83, prediction: false },
  { date: "2024-03-05", systolic: 132, diastolic: 87, prediction: false },
  { date: "2024-03-06", systolic: 129, diastolic: 84, prediction: false },
  { date: "2024-03-07", systolic: 126, diastolic: 82, prediction: false },
  // Predictive data (next 7 days)
  { date: "2024-03-08", systolic: 127, diastolic: 83, prediction: true },
  { date: "2024-03-09", systolic: 128, diastolic: 84, prediction: true },
  { date: "2024-03-10", systolic: 126, diastolic: 82, prediction: true },
  { date: "2024-03-11", systolic: 125, diastolic: 81, prediction: true },
  { date: "2024-03-12", systolic: 127, diastolic: 82, prediction: true },
  { date: "2024-03-13", systolic: 126, diastolic: 81, prediction: true },
  { date: "2024-03-14", systolic: 125, diastolic: 80, prediction: true },
];

// Mock prediction for hydration
const predictiveHydrationData = [
  { date: "2024-03-01", value: 65, prediction: false },
  { date: "2024-03-02", value: 62, prediction: false },
  { date: "2024-03-03", value: 67, prediction: false },
  { date: "2024-03-04", value: 70, prediction: false },
  { date: "2024-03-05", value: 68, prediction: false },
  { date: "2024-03-06", value: 72, prediction: false },
  { date: "2024-03-07", value: 69, prediction: false },
  // Predictive data
  { date: "2024-03-08", value: 68, prediction: true },
  { date: "2024-03-09", value: 66, prediction: true },
  { date: "2024-03-10", value: 62, prediction: true, warning: true },
  { date: "2024-03-11", value: 59, prediction: true, risk: true },
  { date: "2024-03-12", value: 57, prediction: true, risk: true },
  { date: "2024-03-13", value: 61, prediction: true, warning: true },
  { date: "2024-03-14", value: 64, prediction: true },
];

// AI insights
const predictiveInsights = [
  {
    title: "Blood Pressure Trending Stable",
    description:
      "Your blood pressure readings are predicted to remain stable over the next 7 days.",
    type: "positive",
    confidence: 0.89,
    recommendation:
      "Continue your current medication regimen and maintain sodium intake levels.",
  },
  {
    title: "Dehydration Risk Detected",
    description:
      "A potential risk of dehydration is predicted in 3-4 days based on your hydration patterns.",
    type: "warning",
    confidence: 0.76,
    recommendation:
      "Increase daily water intake by 16-24oz and monitor hydration levels more frequently.",
  },
];

interface PredictiveTrendsWidgetProps {
  vitalsData: any;
}

const PredictiveTrendsWidget: React.FC<PredictiveTrendsWidgetProps> = ({
  vitalsData,
}) => {
  return (
    <Card className="border-[#E8F3F4] shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
          <BarChart2 className="h-5 w-5 mr-2 text-purple-500" />
          Predictive Analytics
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-6">
          {/* Selected predictions tabs */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium">7-Day Forecast</h3>
              <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                AI-Powered
              </Badge>
            </div>

            {/* Blood Pressure Prediction */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-xs font-medium text-gray-500">
                  Blood Pressure Forecast
                </h4>
                <span className="text-xs text-gray-500">Confidence: 89%</span>
              </div>

              <div className="h-32 md:h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={predictiveBPData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 10 }}
                      tickFormatter={(value) => {
                        const date = new Date(value);
                        return `${date.getMonth() + 1}/${date.getDate()}`;
                      }}
                    />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip
                      formatter={(value, name) => [
                        `${value} mmHg`,
                        name === "systolic" ? "Systolic" : "Diastolic",
                      ]}
                      labelFormatter={(label) =>
                        `Date: ${new Date(label).toLocaleDateString()}`
                      }
                    />
                    <Line
                      type="monotone"
                      dataKey="systolic"
                      stroke="#ef4444"
                      strokeWidth={2}
                      dot={false}
                      name="Systolic"
                    />
                    <Line
                      type="monotone"
                      dataKey="diastolic"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={false}
                      name="Diastolic"
                    />
                    {/* Divider for actual vs predicted */}
                    <Line
                      type="monotone"
                      dataKey={() => null}
                      stroke="#9ca3af"
                      strokeDasharray="3 3"
                      strokeWidth={1}
                      dot={false}
                      x="2024-03-07"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="flex items-center justify-center mt-1 text-xs">
                <div className="flex items-center mr-3">
                  <div className="w-3 h-3 bg-gray-200 mr-1"></div>
                  <span className="text-gray-500">Actual</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-gray-200 border border-dashed border-gray-400 mr-1"></div>
                  <span className="text-gray-500">Predicted</span>
                </div>
              </div>
            </div>

            {/* Hydration Risk Prediction */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-xs font-medium text-gray-500">
                  Hydration Risk Analysis
                </h4>
                <span className="text-xs text-gray-500">Confidence: 76%</span>
              </div>

              <div className="h-32 md:h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={predictiveHydrationData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 10 }}
                      tickFormatter={(value) => {
                        const date = new Date(value);
                        return `${date.getMonth() + 1}/${date.getDate()}`;
                      }}
                    />
                    <YAxis tick={{ fontSize: 10 }} domain={[40, 80]} />
                    <Tooltip
                      formatter={(value, name) => [`${value}%`, "Hydration"]}
                      labelFormatter={(label) =>
                        `Date: ${new Date(label).toLocaleDateString()}`
                      }
                    />
                    <defs>
                      <linearGradient
                        id="hydrationGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#0ea5e9"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#0ea5e9"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#0ea5e9"
                      strokeWidth={2}
                      dot={(props) => {
                        if (props.payload.risk) {
                          return (
                            <circle
                              key={`dot-risk-${props.payload.date}`}
                              cx={props.cx}
                              cy={props.cy}
                              r={5}
                              stroke="#dc2626"
                              strokeWidth={2}
                              fill="#ffffff"
                            />
                          );
                        } else if (props.payload.warning) {
                          return (
                            <circle
                              key={`dot-warning-${props.payload.date}`}
                              cx={props.cx}
                              cy={props.cy}
                              r={5}
                              stroke="#f59e0b"
                              strokeWidth={2}
                              fill="#ffffff"
                            />
                          );
                        } else if (props.payload.prediction) {
                          return null;
                        }
                        return (
                          <circle
                            key={`dot-normal-${props.payload.date}`}
                            cx={props.cx}
                            cy={props.cy}
                            r={3}
                            stroke={props.stroke}
                            fill={props.stroke}
                          />
                        );
                      }}
                      activeDot={{ r: 5 }}
                      name="Hydration"
                      fill="url(#hydrationGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-1 flex justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-amber-400 rounded-full mr-1"></div>
                    <span className="text-gray-500">Warning</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
                    <span className="text-gray-500">Risk</span>
                  </div>
                </div>
                <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                  <Droplets className="h-3 w-3 mr-1" /> Dehydration Risk
                </Badge>
              </div>
            </div>
          </div>

          {/* AI Insights */}
          <div>
            <h3 className="text-sm font-medium mb-2">
              Insights & Recommendations
            </h3>
            <div className="space-y-3">
              {predictiveInsights.map((insight, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-md ${
                    insight.type === "positive"
                      ? "bg-emerald-50 border border-emerald-200"
                      : "bg-amber-50 border border-amber-200"
                  }`}
                >
                  <div className="flex items-start">
                    {insight.type === "positive" ? (
                      <TrendingUp
                        className={`h-4 w-4 mt-0.5 mr-2 text-emerald-600`}
                      />
                    ) : (
                      <TrendingDown
                        className={`h-4 w-4 mt-0.5 mr-2 text-amber-600`}
                      />
                    )}
                    <div>
                      <h4
                        className={`text-sm font-medium ${
                          insight.type === "positive"
                            ? "text-emerald-800"
                            : "text-amber-800"
                        }`}
                      >
                        {insight.title}
                      </h4>
                      <p className="text-xs text-gray-600 mt-1">
                        {insight.description}
                      </p>
                      <div className="flex items-center mt-2">
                        <Info className="h-3 w-3 mr-1 text-gray-500" />
                        <p className="text-xs text-gray-600">
                          {insight.recommendation}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PredictiveTrendsWidget;
