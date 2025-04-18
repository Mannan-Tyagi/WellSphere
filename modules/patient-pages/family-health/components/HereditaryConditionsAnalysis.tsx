import React from 'react';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Badge,
  Button,
} from './ui-components';
import {
  PieChart,
  Pie,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Bar,
} from 'recharts';
import {
  Info,
  Dna,
  Sparkles,
  Shield,
  Heart,
  Activity,
  AlertTriangle,
} from './icons';

const HereditaryConditionsAnalysis = ({
  familyMembers,
  conditionsByGenerationData,
  conditionsDistributionData,
}) => {
  return (
    <div>
      <Tabs defaultValue="analysis">
        <TabsList>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
          <TabsTrigger value="action-plan">Action Plan</TabsTrigger>
        </TabsList>

        {/* Analysis Tab */}
        <TabsContent value="analysis" className="space-y-4 mt-4">
          <Card className="border-[#E8F3F4]">
            <CardHeader className="pb-2 bg-[#F0F9FA] border-b">
              <CardTitle className="text-lg font-semibold flex items-center text-[#006D77]">
                <Info className="mr-2 h-5 w-5" />
                Hereditary Conditions Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border rounded-md bg-white">
                  <h3 className="font-medium mb-4 text-center">Conditions Distribution</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={conditionsDistributionData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          label
                        >
                          {conditionsDistributionData.map((entry, index) => (
                            <cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value, name) => [`${value}`, name]} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="p-4 border rounded-md bg-white">
                  <h3 className="font-medium mb-4 text-center">Conditions by Generation</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={conditionsByGenerationData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="generation" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="hypertension" name="Hypertension" fill="#FF8042" />
                        <Bar dataKey="diabetes" name="Diabetes" fill="#FFBB28" />
                        <Bar dataKey="heartDisease" name="Heart Disease" fill="#00C49F" />
                        <Bar dataKey="allergies" name="Allergies" fill="#0088FE" />
                        <Bar dataKey="arthritis" name="Arthritis" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 bg-blue-50 rounded-md border border-blue-100">
                <div className="flex items-start">
                  <Info className="h-5 w-5 mr-2 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-blue-700 font-medium">Understanding Health Patterns</p>
                    <p className="text-xs text-blue-600 mt-1">
                      These visualizations help identify patterns of health conditions across generations,
                      which can inform prevention strategies and early screening recommendations.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#E8F3F4]">
            <CardHeader className="pb-2 bg-[#F0F9FA] border-b">
              <CardTitle className="text-lg font-semibold flex items-center text-[#006D77]">
                <Dna className="mr-2 h-5 w-5" />
                Genetic Risk Mapping
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="p-4 border rounded-md bg-white">
                <h3 className="font-medium mb-2">Family Health Map</h3>
                <p className="text-sm text-gray-600 mb-4">
                  A visual representation of health conditions across your family tree. 
                  This helps identify patterns of hereditary conditions.
                </p>

                <div className="grid grid-cols-3 gap-3 mt-6 mb-6">
                  {familyMembers.filter(m => m.relationship === 'Father' || m.relationship === 'Mother').map((member) => (
                    <div key={member.id} className="flex flex-col items-center">
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center text-white mb-2"
                        style={{ backgroundColor: member.color }}
                      >
                        {member.name.charAt(0)}
                      </div>
                      <p className="text-sm font-medium">{member.name}</p>
                      <p className="text-xs text-gray-500">{member.relationship}</p>
                      {member.conditions.length > 0 && (
                        <div className="mt-1 flex flex-wrap justify-center gap-1">
                          {member.conditions.map((condition, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {condition}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Connecting lines */}
                <div className="border-t border-gray-300 w-1/3 mx-auto mb-4"></div>

                <div className="grid grid-cols-3 gap-3">
                  {familyMembers.filter(m => m.relationship === 'Self' || m.relationship === 'Spouse').map((member) => (
                    <div key={member.id} className="flex flex-col items-center">
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center text-white mb-2"
                        style={{ backgroundColor: member.color }}
                      >
                        {member.name.charAt(0)}
                      </div>
                      <p className="text-sm font-medium">{member.name}</p>
                      <p className="text-xs text-gray-500">{member.relationship}</p>
                      {member.conditions.length > 0 && (
                        <div className="mt-1 flex flex-wrap justify-center gap-1">
                          {member.conditions.map((condition, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {condition}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-300 w-1/3 mx-auto my-4"></div>

                <div className="grid grid-cols-3 gap-3">
                  {familyMembers.filter(m => m.relationship === 'Daughter' || m.relationship === 'Son').map((member) => (
                    <div key={member.id} className="flex flex-col items-center">
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center text-white mb-2"
                        style={{ backgroundColor: member.color }}
                      >
                        {member.name.charAt(0)}
                      </div>
                      <p className="text-sm font-medium">{member.name}</p>
                      <p className="text-xs text-gray-500">{member.relationship}</p>
                      {member.conditions.length > 0 && (
                        <div className="mt-1 flex flex-wrap justify-center gap-1">
                          {member.conditions.map((condition, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {condition}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <Button className="w-full mt-4 bg-[#006D77] hover:bg-[#005a66]">
                Generate Detailed Health Map
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Action Plan Tab */}
        <TabsContent value="action-plan" className="space-y-4 mt-4">
          <Card className="border-[#E8F3F4]">
            <CardHeader className="pb-2 bg-[#F0F9FA] border-b">
              <CardTitle className="text-lg font-semibold flex items-center text-[#006D77]">
                <Sparkles className="mr-2 h-5 w-5" />
                Personalized Action Plan
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="p-3 bg-[#F0F9FA] rounded-md border border-[#E8F3F4] mb-4">
                <div className="flex items-start">
                  <Shield className="h-5 w-5 mr-2 text-[#006D77] mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-[#006D77]">AI-Generated Health Recommendations</p>
                    <p className="text-xs text-gray-600 mt-1">
                      Based on your family health patterns, these are recommended actions for preventive care and early detection.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-3 flex items-center">
                    <Heart className="h-5 w-5 mr-2 text-red-600" />
                    Cardiovascular Health Action Plan
                  </h3>

                  <div className="pl-7 space-y-3">
                    <div className="p-3 border rounded-md bg-white">
                      <div className="flex items-start">
                        <div className="w-6 h-6 rounded-full bg-red-100 text-red-800 flex items-center justify-center mr-2 mt-0.5">
                          1
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">Regular Blood Pressure Monitoring</h4>
                          <p className="text-sm text-gray-600 mt-1">
                            With family history of hypertension, regular monitoring is recommended.
                          </p>
                          <div className="flex mt-2">
                            <Badge className="bg-blue-100 text-blue-800 border-blue-200">For: John</Badge>
                            <Badge className="ml-2 bg-amber-100 text-amber-800 border-amber-200">Priority: High</Badge>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 border rounded-md bg-white">
                      <div className="flex items-start">
                        <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mr-2 mt-0.5">
                          2
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">Lipid Panel Screening</h4>
                          <p className="text-sm text-gray-600 mt-1">
                            Annual cholesterol screening recommended due to family cardiovascular risk factors.
                          </p>
                          <div className="flex mt-2">
                            <Badge className="bg-blue-100 text-blue-800 border-blue-200">For: All Adults</Badge>
                            <Badge className="ml-2 bg-amber-100 text-amber-800 border-amber-200">Priority: Medium</Badge>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 border rounded-md bg-white">
                      <div className="flex items-start">
                        <div className="w-6 h-6 rounded-full bg-green-100 text-green-800 flex items-center justify-center mr-2 mt-0.5">
                          3
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">Heart-Healthy Diet Plan</h4>
                          <p className="text-sm text-gray-600 mt-1">
                            DASH diet recommended to manage blood pressure and overall cardiovascular health.
                          </p>
                          <div className="flex mt-2">
                            <Badge className="bg-blue-100 text-blue-800 border-blue-200">For: All Family</Badge>
                            <Badge className="ml-2 bg-green-100 text-green-800 border-green-200">Priority: Ongoing</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-3 flex items-center">
                    <Activity className="h-5 w-5 mr-2 text-blue-600" />
                    Diabetes Prevention Plan
                  </h3>

                  <div className="pl-7 space-y-3">
                    <div className="p-3 border rounded-md bg-white">
                      <div className="flex items-start">
                        <div className="w-6 h-6 rounded-full bg-red-100 text-red-800 flex items-center justify-center mr-2 mt-0.5">
                          1
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">Regular A1C Testing</h4>
                          <p className="text-sm text-gray-600 mt-1">
                            Annual screening for prediabetes and diabetes monitoring for affected family members.
                          </p>
                          <div className="flex mt-2">
                            <Badge className="bg-blue-100 text-blue-800 border-blue-200">For: John, Adult Family</Badge>
                            <Badge className="ml-2 bg-amber-100 text-amber-800 border-amber-200">Priority: High</Badge>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 border rounded-md bg-white">
                      <div className="flex items-start">
                        <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mr-2 mt-0.5">
                          2
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">Weight Management</h4>
                          <p className="text-sm text-gray-600 mt-1">
                            Maintain healthy BMI through diet and exercise to reduce diabetes risk.
                          </p>
                          <div className="flex mt-2">
                            <Badge className="bg-blue-100 text-blue-800 border-blue-200">For: All Family</Badge>
                            <Badge className="ml-2 bg-green-100 text-green-800 border-green-200">Priority: Ongoing</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Button className="w-full mt-4 bg-[#006D77] hover:bg-[#005a66]">
                Create Custom Action Plan
              </Button>

              <div className="mt-4 p-3 bg-amber-50 rounded-md border border-amber-100">
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 mr-2 text-amber-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-amber-700 font-medium">Medical Advice Disclaimer</p>
                    <p className="text-xs text-amber-600 mt-1">
                      These recommendations are based on family health patterns and are not a substitute for professional medical advice. 
                      Always consult with healthcare providers before making health decisions.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HereditaryConditionsAnalysis;