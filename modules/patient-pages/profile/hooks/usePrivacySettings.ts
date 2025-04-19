import { useState } from 'react';

export function usePrivacySettings() {
  // Mock privacy settings
  const [privacySettings, setPrivacySettings] = useState({
    dataSharing: {
      shareWithProviders: true,
      shareWithFamily: true,
      shareWithResearchers: false,
      shareForPublicHealth: true
    },
    accessControls: {
      twoFactorAuth: true,
      loginNotifications: true,
      bioAuthEnabled: true
    },
    dataExport: {
      exportReady: true,
      lastExported: '2025-02-15',
      format: 'fhir'
    },
    granularControls: {
      medications: 'all',
      labResults: 'selected',
      conditions: 'all',
      procedures: 'none',
      mentalHealth: 'none',
      sexualHealth: 'none'
    }
  });
  
  const handleToggleChange = (category, setting, value) => {
    setPrivacySettings({
      ...privacySettings,
      [category]: {
        ...privacySettings[category],
        [setting]: value
      }
    });
  };
  
  const handleSelectChange = (category, setting, value) => {
    setPrivacySettings({
      ...privacySettings,
      [category]: {
        ...privacySettings[category],
        [setting]: value
      }
    });
  };
  
  const onComplete = () => {
    console.log('Privacy settings saved', privacySettings);
    // Here we would typically call an API to save the settings
    // For now, just returning a mocked success
    return Promise.resolve({ success: true });
  };

  return {
    privacySettings,
    handleToggleChange,
    handleSelectChange,
    onComplete
  };
}
