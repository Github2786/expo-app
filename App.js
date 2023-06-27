import React, { useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import { registerForPushNotificationsAsync, schedulePushNotification } from 'expo-notifications';

export default function App() {
  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      console.log(token); // This will log the device's push token to the console
    }).catch((error) => {
      console.log('Error:', error);
    });
  }, []);

  const handleScheduleNotification = () => {
    const trigger = new Date(Date.now() + 60000); // 1 minute from now
    schedulePushNotification({ content: { title: 'Notification Title', body: 'Notification Body' }, trigger });
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Welcome to Expo Notifications</Text>
      <Button title="Schedule Notification" onPress={handleScheduleNotification} />
    </View>
  );
}
