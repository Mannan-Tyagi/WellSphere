import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Accessibility, Eye, Type, Volume2, Moon, Check, 
  Headphones, VolumeX, Mic, ArrowLeft, ArrowRight
} from 'lucide-react';

const AccessibilitySettings = () => {
  // Mock accessibility settings
  const [accessibilitySettings, setAccessibilitySettings] = useState({
    visual: {
      highContrast: false,
      largeText: true,
      reduceMotion: true,
      colorBlindMode: 'none',
      fontSizeScale: 1.2,
    },
    audio: {
      screenReader: false,
      soundFeedback: true,
      notificationSounds: true,
      voiceControl: false,
    },
    navigation: {
      keyboardShortcuts: true,
      gestureNavigation: false,
      simplifiedInterface: false,
    },
    contentDisplay: {
      showImages: true,
      readingLevel: 'standard',
      contentDensity: 'balanced',
    }
  });
  
  const handleToggleSwitch = (category, setting, value) => {
    setAccessibilitySettings({
      ...accessibilitySettings,
      [category]: {
        ...accessibilitySettings[category],
        [setting]: value
      }
    });
  };
  
  const handleSliderChange = (category, setting, value) => {
    setAccessibilitySettings({
      ...accessibilitySettings,
      [category]: {
        ...accessibilitySettings[category],
        [setting]: value[0]
      }
    });
  };
  
  const handleSelectChange = (category, setting, value) => {
    setAccessibilitySettings({
      ...accessibilitySettings,
      [category]: {
        ...accessibilitySettings[category],
        [setting]: value
      }
    });
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-xl text-[#006D77] flex items-center">
            <Accessibility className="mr-2 h-5 w-5" />
            Accessibility Settings
          </CardTitle>
          <CardDescription>
            Customize the appearance and behavior of WellSphere to meet your accessibility needs.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-3 flex items-center">
                <Eye className="h-4 w-4 mr-2 text-gray-700" />
                Visual Accessibility
              </h3>
              
              <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <Label htmlFor="high-contrast" className="font-medium cursor-pointer">High Contrast Mode</Label>
                  <Switch 
                    id="high-contrast" 
                    checked={accessibilitySettings.visual.highContrast}
                    onCheckedChange={(checked) => handleToggleSwitch('visual', 'highContrast', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="large-text" className="font-medium cursor-pointer">Larger Text</Label>
                  <Switch 
                    id="large-text" 
                    checked={accessibilitySettings.visual.largeText}
                    onCheckedChange={(checked) => handleToggleSwitch('visual', 'largeText', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="reduce-motion" className="font-medium cursor-pointer">Reduce Motion</Label>
                  <Switch 
                    id="reduce-motion" 
                    checked={accessibilitySettings.visual.reduceMotion}
                    onCheckedChange={(checked) => handleToggleSwitch('visual', 'reduceMotion', checked)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="font-scale" className="text-sm font-medium">Text Size Scale</Label>
                  <div className="flex items-center space-x-2">
                    <Type size={14} />
                    <Slider 
                      id="font-scale"
                      defaultValue={[accessibilitySettings.visual.fontSizeScale]}
                      max={2.0}
                      min={0.8}
                      step={0.1}
                      onValueChange={(value) => handleSliderChange('visual', 'fontSizeScale', value)}
                      className="flex-1"
                    />
                    <Type size={20} />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Current scale: {accessibilitySettings.visual.fontSizeScale.toFixed(1)}x
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="color-blind-mode" className="text-sm font-medium">Color Blind Mode</Label>
                  <Select 
                    value={accessibilitySettings.visual.colorBlindMode} 
                    onValueChange={(value) => handleSelectChange('visual', 'colorBlindMode', value)}
                  >
                    <SelectTrigger id="color-blind-mode">
                      <SelectValue placeholder="Select color mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None (Standard Colors)</SelectItem>
                      <SelectItem value="protanopia">Protanopia (Red-Blind)</SelectItem>
                      <SelectItem value="deuteranopia">Deuteranopia (Green-Blind)</SelectItem>
                      <SelectItem value="tritanopia">Tritanopia (Blue-Blind)</SelectItem>
                      <SelectItem value="achromatopsia">Achromatopsia (Full Color Blindness)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="bg-white p-3 border rounded-lg mt-3">
                  <h4 className="text-sm font-medium mb-2">Preview with selected settings</h4>
                  <div className={`p-3 border rounded-md ${accessibilitySettings.visual.highContrast ? 'bg-black text-white' : 'bg-gray-50'}`}>
                    <p style={{ fontSize: `${accessibilitySettings.visual.largeText ? accessibilitySettings.visual.fontSizeScale * 100 : 100}%` }}>
                      This is a preview of how text will appear with your selected settings.
                    </p>
                    <div className="flex space-x-2 mt-2">
                      <div className="w-5 h-5 rounded-full bg-red-500"></div>
                      <div className="w-5 h-5 rounded-full bg-green-500"></div>
                      <div className="w-5 h-5 rounded-full bg-blue-500"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-3 flex items-center">
                <Volume2 className="h-4 w-4 mr-2 text-gray-700" />
                Audio & Speech Accessibility
              </h3>
              
              <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="screen-reader" className="font-medium cursor-pointer">Screen Reader Compatible</Label>
                    <p className="text-xs text-gray-500">Optimize interface for screen readers</p>
                  </div>
                  <Switch 
                    id="screen-reader" 
                    checked={accessibilitySettings.audio.screenReader}
                    onCheckedChange={(checked) => handleToggleSwitch('audio', 'screenReader', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="sound-feedback" className="font-medium cursor-pointer">Sound Feedback</Label>
                    <p className="text-xs text-gray-500">Audible feedback when interacting with controls</p>
                  </div>
                  <Switch 
                    id="sound-feedback" 
                    checked={accessibilitySettings.audio.soundFeedback}
                    onCheckedChange={(checked) => handleToggleSwitch('audio', 'soundFeedback', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="voice-control" className="font-medium cursor-pointer">Voice Control</Label>
                    <p className="text-xs text-gray-500">Navigate and interact using voice commands</p>
                  </div>
                  <Switch 
                    id="voice-control" 
                    checked={accessibilitySettings.audio.voiceControl}
                    onCheckedChange={(checked) => handleToggleSwitch('audio', 'voiceControl', checked)}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <Button variant="outline" className="flex items-center justify-center">
                    <Headphones size={16} className="mr-2" />
                    Test Audio
                  </Button>
                  <Button variant="outline" className="flex items-center justify-center">
                    <Mic size={16} className="mr-2" />
                    Test Microphone
                  </Button>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-3 flex items-center">
                <ArrowRight className="h-4 w-4 mr-2 text-gray-700" />
                Navigation & Controls
              </h3>
              
              <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="keyboard-shortcuts" className="font-medium cursor-pointer">Keyboard Shortcuts</Label>
                    <p className="text-xs text-gray-500">Enable navigation using keyboard shortcuts</p>
                  </div>
                  <Switch 
                    id="keyboard-shortcuts" 
                    checked={accessibilitySettings.navigation.keyboardShortcuts}
                    onCheckedChange={(checked) => handleToggleSwitch('navigation', 'keyboardShortcuts', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="gesture-navigation" className="font-medium cursor-pointer">Gesture Navigation</Label>
                    <p className="text-xs text-gray-500">Navigate using swipe and other touch gestures</p>
                  </div>
                  <Switch 
                    id="gesture-navigation" 
                    checked={accessibilitySettings.navigation.gestureNavigation}
                    onCheckedChange={(checked) => handleToggleSwitch('navigation', 'gestureNavigation', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="simplified-interface" className="font-medium cursor-pointer">Simplified Interface</Label>
                    <p className="text-xs text-gray-500">Reduce complexity of the user interface</p>
                  </div>
                  <Switch 
                    id="simplified-interface" 
                    checked={accessibilitySettings.navigation.simplifiedInterface}
                    onCheckedChange={(checked) => handleToggleSwitch('navigation', 'simplifiedInterface', checked)}
                  />
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-3 flex items-center">
                <Moon className="h-4 w-4 mr-2 text-gray-700" />
                Content Display Preferences
              </h3>
              
              <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="show-images" className="font-medium cursor-pointer">Show Images</Label>
                    <p className="text-xs text-gray-500">Display images and graphics</p>
                  </div>
                  <Switch 
                    id="show-images" 
                    checked={accessibilitySettings.contentDisplay.showImages}
                    onCheckedChange={(checked) => handleToggleSwitch('contentDisplay', 'showImages', checked)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Reading Level</Label>
                  <RadioGroup 
                    value={accessibilitySettings.contentDisplay.readingLevel}
                    onValueChange={(value) => handleSelectChange('contentDisplay', 'readingLevel', value)}
                    className="space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="simplified" id="simplified" />
                      <Label htmlFor="simplified" className="cursor-pointer">Simplified</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="standard" id="standard" />
                      <Label htmlFor="standard" className="cursor-pointer">Standard</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="detailed" id="detailed" />
                      <Label htmlFor="detailed" className="cursor-pointer">Detailed</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <Button className="bg-[#006D77] hover:bg-[#00585F]">
              <Check className="h-4 w-4 mr-2" />
              Save Accessibility Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccessibilitySettings;
