import { useState } from "react";
import { Textarea, Button } from "@components/ui";
import { Sparkles, Paperclip, X, Send } from "@components/icons";

export default function NewMessagePage() {
  const [selectedRecipient, setSelectedRecipient] = useState(null);
  const [messageBody, setMessageBody] = useState("");
  const [aiSymptomSuggestions, setAiSymptomSuggestions] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const checkForSymptoms = (text) => {
    setMessageBody(text);
    // Simulate AI suggestions based on the message body
    const suggestions = ["Fever", "Cough", "Headache"];
    setAiSymptomSuggestions(suggestions);
  };

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files).map((file) => ({
      name: file.name,
      size: file.size,
      previewUrl: URL.createObjectURL(file),
    }));
    setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
  };

  const removeFile = (index) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleSendMessage = () => {
    // Handle sending the message
    console.log("Message sent:", { selectedRecipient, messageBody, selectedFiles });
  };

  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md">
        <div className="p-6">
          {/* Recipient Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Recipient
            </label>
            <select
              className="w-full border rounded-lg p-2"
              value={selectedRecipient}
              onChange={(e) => setSelectedRecipient(e.target.value)}
            >
              <option value="" disabled>
                Select a recipient
              </option>
              <option value="doctor">Doctor</option>
              <option value="nurse">Nurse</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Message */}
          <div className="mb-4 flex-grow">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <Textarea
              placeholder="Type your message here..."
              className="h-[150px] resize-none"
              value={messageBody}
              onChange={(e) => checkForSymptoms(e.target.value)}
            />
          </div>

          {/* AI Symptom Suggestions */}
          {aiSymptomSuggestions.length > 0 && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
              <div className="flex items-center text-blue-700 mb-2">
                <Sparkles size={16} className="mr-1" />
                <span className="font-medium">AI Suggestions</span>
              </div>
              <p className="text-sm text-blue-600 mb-2">
                Based on your message, you might want to include these details:
              </p>
              <div className="space-y-1">
                {aiSymptomSuggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="text-sm cursor-pointer hover:bg-blue-100 p-1 rounded"
                    onClick={() => setMessageBody(messageBody + "\n\n" + suggestion + ": ")}
                  >
                    • {suggestion}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* File Attachments */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Attachments
            </label>
            <div className="border border-dashed rounded-lg p-4 text-center">
              <p className="text-sm text-gray-500 mb-2">
                Drag and drop files here, or click to select files
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => document.getElementById("file-upload").click()}
              >
                <Paperclip className="mr-2 h-4 w-4" />
                Select Files
              </Button>
              <input
                id="file-upload"
                type="file"
                multiple
                className="hidden"
                onChange={handleFileSelect}
              />
            </div>

            {/* Selected Files */}
            {selectedFiles.length > 0 && (
              <div className="mt-2 space-y-2">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center p-2 bg-gray-50 rounded">
                    {file.previewUrl ? (
                      <img
                        src={file.previewUrl}
                        alt={file.name}
                        className="h-8 w-8 mr-2 object-cover rounded"
                      />
                    ) : (
                      <div className="h-8 w-8 mr-2 bg-gray-200 rounded flex items-center justify-center text-xs">
                        {file.name.split(".").pop()?.toUpperCase()}
                      </div>
                    )}
                    <div className="flex-grow">
                      <p className="text-sm truncate">{file.name}</p>
                      <p className="text-xs text-gray-500">
                        {(file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => removeFile(index)}
                    >
                      <X size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="mt-auto pt-4 border-t flex justify-end">
            <Button
              className="bg-[#006D77] hover:bg-[#00585F]"
              disabled={!selectedRecipient || !messageBody}
              onClick={handleSendMessage}
            >
              <Send size={16} className="mr-2" />
              Send Message
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}