// App.js

import React, { useEffect } from 'react';
import { View } from 'react-native';
import Constants from 'expo-constants';
import * as Analytics from 'expo-analytics-amplitude';

const trackingId = 'G-5EJKCKXDGG'; // Replace with your own Google Analytics tracking ID

export default function App() {
  useEffect(() => {
    initializeGoogleAnalytics();
    trackScreenView('Home Screen');
  }, []);

  const initializeGoogleAnalytics = () => {
    Analytics.initializeAsync(trackingId, Constants.manifest.version);
  };

  const trackScreenView = (screenName) => {
    Analytics.logEvent('screenView', {
      screenName: screenName,
      appName: Constants.manifest.name,
      appVersion: Constants.manifest.version,
    });
  };

  return <View style={{ flex: 1 }} />;
}
