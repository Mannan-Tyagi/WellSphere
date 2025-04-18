import React, { useState } from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Send, Paperclip, FileText, MoreVertical, Download, Share, AlertCircle, MicOff, VideoOff } from 'lucide-react';

export default function VirtualConsultationInterface() {
  const [messageText, setMessageText] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [notes, setNotes] = useState('');
  const [layout, setLayout] = useState('default');
  const consultation = {
    technicalInfo: {
      audioEnabled: true,
      videoEnabled: true,
    },
  };
  const patientVideoRef = React.useRef(null);

  const handleSendMessage = () => {
    // Handle sending message logic
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex flex-col overflow-hidden">
        <Tabs>
          {/* Chat Tab */}
          <TabsContent value="chat" className="flex-1 flex flex-col p-0 m-0 overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-medium">Chat</h3>
            </div>
            <div className="flex-1 p-4">
              {/* Chat messages */}
            </div>
            <div className="p-3 border-t flex items-center bg-gray-50">
              <Textarea
                placeholder="Type your message..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                className="flex-1 resize-none"
              />
              <Button
                className="bg-[#006D77] hover:bg-[#00565E] text-white"
                onClick={handleSendMessage}
                disabled={!messageText.trim() && attachments.length === 0}
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents" className="flex-1 flex flex-col p-0 m-0 overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-medium">Shared Documents</h3>
              <Button variant="outline" size="sm" className="h-8">
                <Paperclip className="h-4 w-4 mr-2" />
                Share New
              </Button>
            </div>

            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                <div className="border rounded-lg overflow-hidden">
                  <div className="p-3 bg-gray-50 border-b flex justify-between items-center">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-blue-500 mr-2" />
                      <span className="font-medium">Recent Lab Results.pdf</span>
                    </div>
                    <div className="flex items-center">
                      <Badge variant="outline" className="mr-2 text-xs">Shared by Doctor</Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="flex items-center">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex items-center">
                            <Share className="h-4 w-4 mr-2" />
                            Share
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="flex items-center text-red-600">
                            <AlertCircle className="h-4 w-4 mr-2" />
                            Report Issue
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  <div className="p-4 flex justify-center">
                    <img
                      src="/assets/lab-results-preview.jpg"
                      alt="Lab Results Preview"
                      className="max-w-full h-auto border rounded"
                    />
                  </div>
                  <div className="p-3 border-t bg-gray-50 text-sm">
                    <p className="text-gray-500">Shared 5 minutes ago • 2 pages</p>
                  </div>
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <div className="p-3 bg-gray-50 border-b flex justify-between items-center">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-green-500 mr-2" />
                      <span className="font-medium">Treatment Plan.docx</span>
                    </div>
                    <div className="flex items-center">
                      <Badge variant="outline" className="mr-2 text-xs">Shared by Doctor</Badge>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="border p-3 rounded-lg">
                      <h4 className="font-medium mb-2">Treatment Plan Summary</h4>
                      <ul className="list-disc ml-5 space-y-1 text-sm">
                        <li>Continue current medication for 14 days</li>
                        <li>Schedule follow-up appointment in 2 weeks</li>
                        <li>Monitor blood pressure daily and record readings</li>
                        <li>Reduce sodium intake and increase physical activity</li>
                      </ul>
                    </div>
                  </div>
                  <div className="p-3 border-t bg-gray-50 text-sm">
                    <p className="text-gray-500">Shared 2 minutes ago • 1 page</p>
                  </div>
                </div>

                <div className="border rounded-lg p-4 flex items-center justify-center text-center h-40">
                  <div className="text-gray-400">
                    <Paperclip className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>Drag and drop files here or click the Share New button</p>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>

          {/* Notes Tab */}
          <TabsContent value="notes" className="flex-1 flex flex-col p-0 m-0 overflow-hidden">
            <div className="p-4 border-b">
              <h3 className="font-medium mb-1">Consultation Notes</h3>
              <p className="text-sm text-gray-500">
                These notes are for your personal reference and won't be shared with your doctor
              </p>
            </div>

            <div className="flex-1 p-4">
              <Textarea
                placeholder="Type your notes here..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-[200px] h-full resize-none"
              />
            </div>

            <div className="p-3 border-t flex justify-between items-center bg-gray-50">
              <p className="text-sm text-gray-500">
                Notes are automatically saved
              </p>
              <Button variant="outline" size="sm" className="h-8">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Patient/Doctor Side-by-Side Layout */}
      {layout === 'side-by-side' && (
        <div className="absolute bottom-4 left-4 top-4 w-1/4 rounded-lg overflow-hidden border-2 border-white shadow-lg">
          <video
            ref={patientVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
            poster="/assets/patient-video-placeholder.jpg"
          />

          <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
            You
          </div>

          <div className="absolute top-2 right-2 flex space-x-1">
            {!consultation.technicalInfo.audioEnabled && (
              <div className="bg-red-500 text-white p-1 rounded">
                <MicOff className="h-4 w-4" />
              </div>
            )}

            {!consultation.technicalInfo.videoEnabled && (
              <div className="bg-red-500 text-white p-1 rounded">
                <VideoOff className="h-4 w-4" />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}