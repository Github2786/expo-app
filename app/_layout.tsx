import { Stack } from "expo-router";
import React, { useEffect, useState,useRef } from 'react';
import { AuthProvider } from "../context/AuthProvider";
// import { Subscription } from 'expo-modules-core';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { useRouter } from "expo-router";
// import { CommonActions } from '@react-navigation/native';
import * as Linking from 'expo-linking';
import { View, Text,Platform, Image, StyleSheet, ScrollView,TouchableWithoutFeedback ,TextInput,PixelRatio} from 'react-native';

export default function RootLayout() {
  const router = useRouter();
  const [expoPushToken, setExpoPushToken] = useState('');
  // const [notification, setNotification] = useState(false);
  // const notificationListener = useRef();
  // const responseListener = useRef();
  const [notification, setNotification] = useState<Notifications.Notification>();
  const notificationListener = useRef<Notifications.Subscription>();                  
  const responseListener =useRef<Notifications.Subscription>();
 
  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
 
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });
 
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });
 
    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
   }, []);
    
   // Function to handle opening a notification with a dynamic link
    const handleNotificationOpen = (notification) => {
      const { data } = notification.request.content;

      if (data.link) {
        // Open the dynamic link URL
        Linking.openURL(data.link);
        console.log(data)
        // router.push('/other')
        // router.replace("/home")
        // navigation.dispatch(
        //   CommonActions.navigate({
        //     name: 'Other',
        //   })
        // );
        
      }
    };

  // Notifications.setNotificationHandler({

  //   handleNotificationOpen(data)
  //     handleNotification: async () => ({
  //       shouldShowAlert: true,
  //       shouldPlaySound: true,
  //       shouldSetBadge: false,
  //     }),
  //   });

  // Set up the notification listener
Notifications.setNotificationHandler({
  handleNotification: async (notification) => {
    handleNotificationOpen(notification);
    return {
      shouldPlaySound: true,
      shouldShowAlert: true,
      shouldSetBadge: true,
    };
  },
});
    async function registerForPushNotificationsAsync() {
      let token;
      if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        if (finalStatus !== 'granted') {
          alert('Failed to get push token for push notification!');
          return;
        }
        token = (await Notifications.getExpoPushTokenAsync()).data;
        console.log(token);
      } else {
        alert('Must use physical device for Push Notifications');
      }
    
      if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }
      
      return token;
    }
 
    
  return (
    <AuthProvider>
      <Stack>
        
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />
        {/* <Stack.Screen
          name="other"
          options={{
            title: "",
            headerShown: true,
            headerTransparent: Platform.OS === "ios",
            headerBlurEffect: "regular",
          }}
        /> */}
      </Stack>
    </AuthProvider>
  );
}
