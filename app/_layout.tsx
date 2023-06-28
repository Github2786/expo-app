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
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RootLayout() {
  const router = useRouter();
  const [expoPushToken, setExpoPushToken] = useState('');
  const [PushToken, setPushToken] = useState('');
  // const [notification, setNotification] = useState(false);
  // const notificationListener = useRef();
  // const responseListener = useRef();
  const [notification, setNotification] = useState<Notifications.Notification>();
  const notificationListener = useRef<Notifications.Subscription>();                  
  const responseListener = useRef<Notifications.Subscription>();
  const lastNotificationResponse = Notifications.useLastNotificationResponse();
  useEffect(() => {
    if (PushToken !== '') {
      saveToken();
    }
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
   
 
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });
 
    // responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
    //   console.log("testing "+response);
    //   // notificationCommonHandler(response.notification);
    //   // notificationNavigationHandler(response.notification.request.content);
    // });
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log("testing ");
      // notificationNavigationHandler(response.notification.request.content);
    });
    // saveToken();
    
    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
    
    
    
   }, [PushToken]);
    
   
   // Function to handle opening a notification with a dynamic link
    const handleNotificationOpen = (notification) => {
      const { data } = notification.request.content;

      console.log(notification.request)
      if (data.link) {
        // Open the dynamic link URL
        // Linking.openURL(data.link);
        console.log("last "+lastNotificationResponse)
        // router.push(data.link)
        // router.replace("/home")
        // navigation.dispatch(
        //   CommonActions.navigate({
        //     name: 'Other',
        //   })
        // );
        
      }
    };
    const notificationNavigationHandler = ({ data }) => {
      // navigate to app screen
      console.log('A notification has been touched', data)
    }

    
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
        // console.log(token);
        setPushToken(token)
        
      
        // console.log("ash " +PushToken)
        
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
        if(PushToken)
        {
          saveToken();
        }else
        {
          console.log("error")
        }
      return token;
    }
    const saveToken = async() => {
      // navigate to app screen
      console.log('Token is', PushToken);
      const storedUser = await AsyncStorage.getItem('user');
      const parsedUser = JSON.parse(storedUser);
      let name = parsedUser.name
      let userType = parsedUser.user_Type
      let email = parsedUser.email
      let Id = parsedUser.Id
     
      const credentials = {
        //username: username,
         name: name,
         email: email,
         token: PushToken,//'usertoken123456',//token,
         user_id: Id,
         status: userType == 1 ? 1 : 0,
         methodName: 'SaveToken',
       };
      //  console.log(credentials);
       try {
         const response = await axios.post(
           'https://globaltraining.iclick.best/Api/Controller/SaveFcmtoken.php',
           credentials
         );
     
         if (response.data === "Token created successfully") { 
        
           console.log(response.data)
          
          
          
           // console.log(JSON.parse(storedUser));
         } else {
           console.log('Failed');
          
           
         }
       } catch (error) {
         console.error(error);
       }
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
