import React, { Component } from 'react';

import { StyleSheet, Text, View, PixelRatio, TouchableOpacity, Image, TextInput, Alert ,Platform,TouchableWithoutFeedback} from 'react-native';

import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import DatePicker from "expo-datepicker";
import { Entypo } from "@expo/vector-icons";
import axios from 'axios';
import {  Snackbar } from 'react-native-paper';
// import * as Linking from 'expo-linking';
export default class Project extends Component {
  
constructor() {

    super();
    const currentDate = new Date();
    const expireDate = new Date(currentDate.getTime() + 10 * 24 * 60 * 60 * 1000); // Add 10 days (10 * 24 hours * 60 minutes * 60 seconds * 1000 milliseconds)
    
    this.state = {

      ImageSource: null,

      data: null,
      Title:'',
      Caption:'',

      Course_Details:'',
      Expire_Date:expireDate,
      date:expireDate,

      Course_image:'',
      added_by:'Admin',
      isLoading:false,
      setIsLoading:false,
      tokenlistData:[]

      

    }
}
componentDidMount() {
this.getToken();

// this.sendPushNotifications('dummycourse')
}

getPermissionAsync = async () => {
    // Camera roll Permission 
    if (Platform.OS === 'android') {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    }
    // Camera Permission
    const { status } = await Permissions.askAsync(Permissions.CAMERA,Permissions.AUDIO_RECORDING
);
    this.setState({ hasPermission: status === 'granted' });
  }
handleCameraType=()=>{
    const { cameraType } = this.state

    this.setState({cameraType:
      cameraType === Camera.Constants.Type.back
      ? Camera.Constants.Type.front
      : Camera.Constants.Type.back
    })
  }
pickImage = async () => {
  let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (permissionResult.granted === false) {
    alert('Permission to access camera roll is required!');
    return;
  }

  let pickerResult = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 1,
  });

  if (!pickerResult.canceled) {
    // console.log(pickerResult.assets[0].uri);
    this.setState({
      ImageSource: pickerResult.assets[0].uri,
      data: pickerResult.assets[0].base64,
    });
  }
}
uploadImageToServer = () => {
  // console.log(this.state.Image_TAG)
  fetch(this.state.ImageSource)
    .then((response) => response.blob())
    .then((blob) => {
      var reader = new FileReader();
      reader.onload = () => {
        var InsertAPI = 'https://globaltraining.iclick.best/Api/Controller/uploadexpo.php';
        var Data = {
          img: reader.result,
        };
        var headers = {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        };
        fetch(InsertAPI, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(Data),
        })
          .then((response) => {
            // console.log(response);
            return response.text();
          })
          .then((responseText) => {
            // console.log(responseText);
            this.setState({ Course_image: responseText })
            this.saveData()
            // Continue with your code
          })
          .catch((err) => {
            console.log(err);
          });
      };
      reader.readAsDataURL(blob);
    })
    .catch((error) => {
      console.log(error);
    });
}
saveData = () =>{
  const credentials = {
    name:this.state.Title,
    caption:this.state.Caption,
    date:this.state.Expire_Date,
    details:this.state.Course_Details,
    image:this.state.Course_image,
    methodName: 'SaveCourse',
};
  console.log("Save Data "+JSON.stringify(credentials));
  
  axios.post('https://globaltraining.iclick.best/Api/Controller/Savecourse.php', credentials)
  .then(response => {
    // Handle successful login response
    console.log(response.data);
    if (response.data === "New record created successfully") {
      console.log('Success');

      Alert.alert(
        'Success',
        'Record created successfully',
        [
          {
            text: 'ok',
            style: 'destructive'
            
          },
        ],
        { cancelable: true }
      );
      this.sendPushNotifications(this.state.Title)
     // const userData = response.data.data;
     
    
    } else {
      console.log('Failed');
      Alert.alert(
        'Failed',
        'Something went wrong',
        [
          {
            text: 'ok',
            style: 'destructive'
            
          },
        ],
        { cancelable: true }
      );
      
    }
  })
  .catch(error => {
    // Handle login error
    console.error(error);
  });
}
getToken=()=>{
  fetch('https://globaltraining.iclick.best/Api/Controller/GetTokens.php')
  .then(response => response.json())
  .then(data => {
    // tokenlistData(data.data);
   
    for (let i = 0; i < data.data.length; i++) {
      this.state.tokenlistData.push(data.data[i].Token);
    }
// console.log(this.state.tokenlistData)
    // this.state.tokenlistData.push(data);
  })
  .catch(error => {
    console.log("res " + error);
  });
}
// Function to send a push notification to multiple tokens
sendPushNotifications = async (coursename) => {
  const expoPushTokens = this.state.tokenlistData;
  // Construct the notification content
  const notificationContent = {
    sound: 'default',
    title: 'New Job Available!',
    body: coursename,
    data: {
      // link: Linking.createURL('/home'), //'https://google.com/', // Dynamic link URL
    },
    ios: {
      // Specify the iOS-specific notification configuration
      icon: '../assets/logo.png',
      // Other iOS-specific properties if needed
    },
    android: {
      // Specify the Android-specific notification configuration
      icon: '../assets/logo.png',
      // Other Android-specific properties if needed
    },
  };

  try {
    // Send the push notification for each token
    const notificationPromises = expoPushTokens.map(async (expoPushToken) => {
      const individualNotification = {
        ...notificationContent,
        to: expoPushToken,
      };

      const response = await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(individualNotification),
      });

      const data = await response.json();
      console.log('Push notification sent successfully:', data);
    });

    // Wait for all notifications to be sent
    await Promise.all(notificationPromises);
    console.log('All push notifications sent successfully');
  } catch (error) {
    console.error('Error sending push notifications:', error);
  }
}

  render() {
    return (
      <View style={styles.container}>

        <TouchableWithoutFeedback onPress={this.pickImage.bind(this)}>

          <View style={styles.ImageContainer}>

            {this.state.ImageSource === null ? <Text>Select a Photo</Text> :
              <Image style={styles.ImageContainer} source={{uri:this.state.ImageSource}} />
            }

          </View>

        </TouchableWithoutFeedback>


       
        <TextInput
          placeholder="Course Name "
          onChangeText={coursename => this.setState({ Title: coursename })}
          underlineColorAndroid='transparent'
          style={styles.TextInputStyle}
        />

        <TextInput
          placeholder="Caption"
          onChangeText={Caption => this.setState({ Caption: Caption })}
          underlineColorAndroid='transparent'
          style={styles.TextInputStyle}
        />
       <TextInput
          placeholder="Expire Date (DD/MM/YYY)"
          onChangeText={E_Date => this.setState({ Expire_Date: E_Date })}
          underlineColorAndroid='transparent'
          style={styles.TextInputStyle}
        />
        <TextInput
          placeholder="Course Details"
          multiline={true}
          numberOfLines={14}
          style={styles.TextInputStyle2}
          onChangeText={(details) => this.setState({ Course_Details: details })}
        />

        <TouchableOpacity onPress={this.uploadImageToServer} activeOpacity={0.6} style={styles.button} >

          <Text style={styles.TextStyle}> Save </Text>

        </TouchableOpacity>

      </View>
    );
  }

}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingTop: 20
  },

  ImageContainer: {
    borderRadius: 10,
    width: 250,
    height: 150,
    borderColor: '#9B9B9B',
    borderWidth: 1 / PixelRatio.get(),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#CDDC39',

  },

  TextInputStyle: {

    textAlign: 'left',
    paddingLeft:5,
    height: 40,
    width: '80%',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#028b53',
    marginTop: 20
  },

  TextInputStyle2: {

    textAlign: 'left',
    paddingLeft:5,
    height: 120,
    width: '80%',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#028b53',
    marginTop: 20
  },
  button: {

    width: '80%',
    backgroundColor: '#00BCD4',
    borderRadius: 7,
    marginTop: 20
  },

  TextStyle: {
    color: '#fff',
    textAlign: 'center',
    padding: 10
  },
  buttonText2: {
    color: '#fff',
    fontSize: 16,
  },
});