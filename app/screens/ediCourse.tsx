import React, { Component } from 'react';

import { StyleSheet, Text, View, PixelRatio,RefreshControl, TouchableOpacity, Image, TextInput, Alert ,Platform,TouchableWithoutFeedback} from 'react-native';

import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import DatePicker from "expo-datepicker";
import { Entypo } from "@expo/vector-icons";
import axios from 'axios';
import {  Button, Snackbar } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class Project extends Component {
  

  constructor() {
    
    super();
    
    const currentDate = new Date();
    const expireDate = new Date(currentDate.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString();; // Add 10 days (10 * 24 hours * 60 minutes * 60 seconds * 1000 milliseconds)
   
    this.state = {

      ImageSource: null,
      notImageSource: null,

      data: null,
      Title:'',
      Caption:'',

      Course_Details:'',
      Expire_Date:expireDate,
      date:expireDate,
      Course_id:'',

      Course_image:'',
      added_by:'Admin',
      isLoading:false,
      setIsLoading:false,
      listCourse:[],
      usertype:null
     
      
    }
  
  }
  componentDidMount() {
    this.getEditCourse();
    this.getUserType();
  }
  getUserType = async () =>{
    const storedUser = await AsyncStorage.getItem('user');
    const parsedUser = JSON.parse(storedUser);
    this.state.usertype = parsedUser.user_Type
    // console.log(this.state.usertype);
  }
getEditCourse = async () => {
    try {
        const storedCourse = await AsyncStorage.getItem('editcourse');
        const parsedCourse = JSON.parse(storedCourse);
        
        if (parsedCourse) {
          this.setState({ listCourse: parsedCourse });

          // console.log(JSON.stringify(this.state.listCourse));

          this.state.Title = this.state.listCourse.Title;
          this.state.Caption = this.state.listCourse.Caption;
          this.state.Expire_Date = this.state.listCourse.Expire_Date;
          this.state.Course_Details = this.state.listCourse.Course_Details;
          this.state.Course_id = this.state.listCourse.course_id;
          this.state.ImageSource = 'https://globaltraining.iclick.best/Api/Controller/uploads/'+this.state.listCourse.Course_image;
          this.state.notImageSource = this.state.listCourse.Course_image;
        }
      } catch (error) {
        console.log('Error retrieving stored course:', error);
      }
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
  if(this.state.usertype == 1)
  {
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
}



showDeleteConfirmation = () => {
  Alert.alert(
    'Delete Confirmation',
    'Are you sure you want to delete?',
    [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => this.deleteItem(),
      },
    ],
    { cancelable: true }
  );
}

afterDelete = () => {
  Alert.alert(
    'Success',
    'Record deleted successfully',
    [
      {
        text: 'ok',
        style: 'destructive',
        onPress: () => this.goback(),
      },
    ],
    { cancelable: true }
  );
}

deleteItem = () => {
  // Perform the delete operation here
  // ...
  console.log('id '+this.state.Course_id);
    const credentials = {
      course_id:this.state.Course_id,
      methodName: 'DeleteCourse',
  };
  axios.post('https://globaltraining.iclick.best/Api/Controller/Savecourse.php', credentials)
  .then(response => {
    // Handle successful login response
    console.log(response.data);
    if (response.data === "Record deleted successfully") {
      console.log('Record deleted successfully');
      this.afterDelete();
     // const userData = response.data.data;
     
    
    } else {
      console.log('Failed');
      
    }
  })
  .catch(error => {
    // Handle login error
    console.error(error);
  });

}


uploadImageToServer = () => {
    if (typeof this.state.ImageSource === 'string' && this.state.ImageSource.indexOf('file://') !== -1) {
  // It is a file path
  // Handle file path logic here
  // console.log("File "+this.state.ImageSource)
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
          this.updatecourseData()
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
} else {
  
    //  this.setState({ Course_image: this.state.notImageSource })
     this.setState({ Course_image: this.state.notImageSource }, () => {
    
      this.updatecourseData()
    });
    
     
}


 
}
updatecourseData = () =>{

        const credentials = {
          name:this.state.Title,
          caption:this.state.Caption,
          date:this.state.Expire_Date,
          details:this.state.Course_Details,
          image:this.state.Course_image.replace(/[\r\n]+/g, ''),
          Course_id:this.state.Course_id,
          methodName: 'UpdateCourse',
      };
  // console.log("Update Data "+JSON.stringify(credentials));
  
      axios.post('https://globaltraining.iclick.best/Api/Controller/Savecourse.php', credentials)
      .then(response => {
        // Handle successful login response
        console.log(response.data);
        if (response.data === "Updated") {
          console.log('Success');
        // const userData = response.data.data;
        
        
        } else {
          console.log('Failed');
          
        }
      })
      .catch(error => {
        // Handle login error
        console.error(error);
      });
}

goback = () => {
 
};

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
          placeholder="Course Details"
          multiline={true}
          value={this.state.Title}
          numberOfLines={14}
          style={styles.TextInputStyle3}
          onChangeText={coursename => this.setState({ Title: coursename })}
          editable={this.state.usertype == 1}
        />
       
        
        <TextInput
          placeholder="Caption"
          value={this.state.Caption}
          onChangeText={Caption => this.setState({ Caption: Caption })}
          underlineColorAndroid='transparent'
          style={styles.TextInputStyle}
          editable={this.state.usertype == 1}
        />
       <TextInput
          placeholder="Expire Date (DD/MM/YYY)"
          value={this.state.Expire_Date}
          onChangeText={E_Date => this.setState({ Expire_Date: E_Date })}
          underlineColorAndroid='transparent'
          style={styles.TextInputStyle}
          editable={this.state.usertype == 1}
        />
       
        <TextInput
          placeholder="Course Details"
          multiline={true}
          value={this.state.Course_Details}
          numberOfLines={14}
          style={styles.TextInputStyle2}
          editable={this.state.usertype == 1}
          onChangeText={Course_Details => this.setState({ Course_Details: Course_Details })}
        />
        
        <View style={styles.buttonContainer}>
          {this.state.usertype == 1 && (
            <>
              <Button onPress={this.showDeleteConfirmation} style={styles.TextInputStylebtn2}>
                <Text style={styles.TextStyle}>Delete</Text>
              </Button>
              
              <View style={styles.buttonSpace}></View>
              <Button onPress={this.uploadImageToServer} style={styles.TextInputStylebtn}>
                <Text style={styles.TextStyle}>Update</Text>
              </Button>
            </>
          )}
        </View>


        
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
  TextInputStylebtn: {

    textAlign: 'left',
    paddingLeft:5,
    height: 40,
    width: '40%',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#000',
    marginTop: 20,
    color:'#fff',
    backgroundColor: '#009900',
  },
  TextInputStylebtn2: {

    textAlign: 'left',
    paddingLeft:5,
    height: 40,
    width: '40%',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#000',
    marginTop: 20,
    color:'#fff',
    backgroundColor: '#F29727',
  },
  TextInputStyle2: {

    textAlign: 'left',
    paddingLeft:5,
    height: 60,
    width: '80%',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#028b53',
    marginTop: 20
  },

  TextInputStyle3: {

    textAlign: 'left',
    paddingLeft:5,
    height: 'auto',
    minHeight:100,
    width: '80%',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#028b53',
    marginTop: 20
  },
  button: {

    width: '80%',
    backgroundColor: '#009900',
    borderRadius: 7,
    marginTop: 20,
    color:'#fff'
  },

  TextStyle: {
    color: '#000',
    textAlign: 'center',
    padding: 10,
  },
  buttonText2: {
    color: '#fff',
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  buttonSpace: {
    width: 10, // Adjust the width to control the amount of space
  },
});