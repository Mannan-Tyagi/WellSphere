"use client";

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Card } from '@/components/ui/card';
import { Lightbulb, BookOpen, Calendar, ArrowRight, Mic, Check, AlertCircle, FileText, Stethoscope, UserPlus } from 'lucide-react';

export function AIAssistantPanel() {
  const [activeTab, setActiveTab] = useState('insights');
  
  return (
    <div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="documentation">Documentation</TabsTrigger>
          <TabsTrigger value="followup">Follow-up</TabsTrigger>
        </TabsList>
        
        {/* Clinical Insights */}
        <TabsContent value="insights" className="pt-4">
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {/* Pattern Recognition */}
              <Card className="p-4 border-l-4 border-l-blue-500">
                <div className="flex items-start gap-3">
                  <Lightbulb className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium">Pattern Recognition</h3>
                    <p className="text-sm mt-1">
                      Patient's symptoms and history suggest a classic migraine pattern. 85% of similar cases in our database responded well to triptan therapy combined with preventative measures.
                    </p>
                    <div className="mt-2">
                      <Button variant="link" className="h-auto p-0 text-xs text-blue-600">
                        View similar cases
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
              
              {/* Treatment Suggestions */}
              <Card className="p-4 border-l-4 border-l-green-500">
                <div className="flex items-start gap-3">
                  <BookOpen className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium">Evidence-Based Treatment</h3>
                    <p className="text-sm mt-1">
                      Recent studies show that combining Sumatriptan with NSAIDs may provide better relief than monotherapy for patients with similar presentation.
                    </p>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-green-100 text-green-800 font-normal">
                          Level A Evidence
                        </Badge>
                        <Button variant="link" className="h-auto p-0 text-xs text-blue-600">
                          View citation
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500">
                        Source: American Headache Society Guidelines (2021)
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
              
              {/* Risk Stratification */}
              <Card className="p-4 border-l-4 border-l-amber-500">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium">Risk Stratification</h3>
                    <p className="text-sm mt-1">
                      Patient has multiple risk factors for chronic migraine development:
                    </p>
                    <ul className="list-disc text-sm pl-5 mt-1 space-y-1">
                      <li>Frequency > 3 headaches/week</li>
                      <li>Female gender</li>
                      <li>History of medication overuse</li>
                    </ul>
                    <div className="mt-2">
                      <Button variant="link" className="h-auto p-0 text-xs text-blue-600">
                        View prevention strategies
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </ScrollArea>
        </TabsContent>
        
        {/* Documentation Helper */}
        <TabsContent value="documentation" className="pt-4">
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {/* Suggested Phrases */}
              <Card className="p-4">
                <h3 className="text-sm font-medium flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Suggested Documentation Phrases
                </h3>
                <div className="mt-3 space-y-2">
                  <div className="p-2 bg-gray-50 rounded-md text-sm hover:bg-gray-100 cursor-pointer">
                    Patient presents with recurring headaches characterized by throbbing pain, photophobia, and mild nausea consistent with migraine without aura.
                  </div>
                  <div className="p-2 bg-gray-50 rounded-md text-sm hover:bg-gray-100 cursor-pointer">
                    Neurological examination reveals no focal deficits. Cranial nerves II-XII intact. No meningeal signs present.
                  </div>
                  <div className="p-2 bg-gray-50 rounded-md text-sm hover:bg-gray-100 cursor-pointer">
                    Treatment plan includes abortive therapy with Sumatriptan 50mg at onset, lifestyle modifications, and headache diary to identify triggers.
                  </div>
                </div>
              </Card>
              
              {/* Missing Elements */}
              <Card className="p-4">
                <h3 className="text-sm font-medium flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                  Missing Documentation Elements
                </h3>
                <div className="mt-3 space-y-2">
                  <div className="flex items-start gap-2">
                    <div className="h-5 w-5 flex-shrink-0 rounded-full border border-amber-200 bg-amber-100 flex items-center justify-center text-amber-600">
                      <span className="text-xs">!</span>
                    </div>
                    <div>
                      <p className="text-sm">Specific follow-up timeframe</p>
                      <p className="text-xs text-gray-500">Required for billing code 99214</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="h-5 w-5 flex-shrink-0 rounded-full border border-amber-200 bg-amber-100 flex items-center justify-center text-amber-600">
                      <span className="text-xs">!</span>
                    </div>
                    <div>
                      <p className="text-sm">Medication side effect discussion</p>
                      <p className="text-xs text-gray-500">Recommended for complete documentation</p>
                    </div>
                  </div>
                </div>
              </Card>
              
              {/* Coding Suggestions */}
              <Card className="p-4">
                <h3 className="text-sm font-medium flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  Medical Coding Suggestions
                </h3>
                <div className="mt-3 space-y-2">
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                    <div>
                      <p className="text-sm font-medium">G43.009</p>
                      <p className="text-xs text-gray-500">Migraine without aura, not intractable</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">95% confidence</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                    <div>
                      <p className="text-sm font-medium">99214</p>
                      <p className="text-xs text-gray-500">Office visit, established patient</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">90% confidence</Badge>
                  </div>
                </div>
              </Card>
            </div>
          </ScrollArea>
        </TabsContent>
        
        {/* Follow-up Recommendations */}
        <TabsContent value="followup" className="pt-4">
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {/* Follow-up Timing */}
              <Card className="p-4">
                <h3 className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Recommended Follow-up
                </h3>
                <div className="mt-3 space-y-3">
                  <div className="flex items-center gap-3 p-2 bg-blue-50 rounded-md border border-blue-100">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      <Calendar size={16} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">4 weeks</p>
                      <p className="text-xs text-gray-600">To assess response to Sumatriptan therapy</p>
                    </div>
                    <Button size="sm" variant="outline" className="h-8">
                      Schedule
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-md border border-gray-200">
                    <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                      <Calendar size={16} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">3 months</p>
                      <p className="text-xs text-gray-600">If symptoms improve with current treatment</p>
                    </div>
                    <Button size="sm" variant="outline" className="h-8">
                      Schedule
                    </Button>
                  </div>
                </div>
              </Card>
              
              {/* Specialist Referrals */}
              <Card className="p-4">
                <h3 className="text-sm font-medium flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  Suggested Referrals
                </h3>
                <div className="mt-3 space-y-3">
                  <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-md border border-gray-200">
                    <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                      <Stethoscope size={16} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Neurology</p>
                      <p className="text-xs text-gray-600">If symptoms persist or worsen despite treatment</p>
                    </div>
                    <Button size="sm" variant="outline" className="h-8">
                      Refer
                    </Button>
                  </div>
                </div>
              </Card>
              
              {/* Preventive Care */}
              <Card className="p-4">
                <h3 className="text-sm font-medium flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  Preventive Care Reminders
                </h3>
                <div className="mt-3 space-y-2">
                  <div className="flex items-start gap-2 p-2 bg-amber-50 rounded-md">
                    <AlertCircle size={16} className="text-amber-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm">Annual mammogram due next month</p>
                      <p className="text-xs text-gray-600 mt-1">Last completed: 11 months ago</p>
                      <Button size="sm" variant="link" className="h-6 p-0 mt-1 text-xs text-blue-600">
                        Schedule screening
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2 p-2 bg-green-50 rounded-md">
                    <Check size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm">Flu vaccination up to date</p>
                      <p className="text-xs text-gray-600 mt-1">Administered: 2 months ago</p>
                    </div>
                  </div>
                </div>
              </Card>
              
              {/* Voice Commands */}
              <Card className="p-4">
                <h3 className="text-sm font-medium flex items-center gap-2">
                  <Mic className="h-4 w-4" />
                  Voice Commands
                </h3>
                <div className="mt-3 space-y-2 text-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 bg-gray-50 rounded-md">
                      <p className="font-medium">"Add to subjective"</p>
                    </div>
                    <div className="p-2 bg-gray-50 rounded-md">
                      <p className="font-medium">"Add to assessment"</p>
                    </div>
                    <div className="p-2 bg-gray-50 rounded-md">
                      <p className="font-medium">"Schedule follow-up"</p>
                    </div>
                    <div className="p-2 bg-gray-50 rounded-md">
                      <p className="font-medium">"Order labs"</p>
                    </div>
                  </div>
                  <Button size="sm" variant="link" className="h-6 p-0 text-xs text-blue-600">
                    View all commands
                  </Button>
                </div>
              </Card>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}