import React, { useEffect, useState,useRef } from 'react';
import { View, Text,Platform, Image, StyleSheet, ScrollView,TouchableWithoutFeedback ,TextInput,PixelRatio} from 'react-native';
import { Avatar, Card } from 'react-native-elements';

import { MaterialIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Modal from 'react-native-modal';
import { TouchableOpacity} from "react-native-gesture-handler";
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EditCourse from '../screens/ediCourse'
// import * as Device from 'expo-device';
// import * as Notifications from 'expo-notifications';

// import Push from '../screens/push'
// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: false,
//     shouldSetBadge: false,
//   }),
// });
// async function registerForPushNotificationsAsync() {
//   let token;
//   if (Device.isDevice) {
//     const { status: existingStatus } = await Notifications.getPermissionsAsync();
//     let finalStatus = existingStatus;
//     if (existingStatus !== 'granted') {
//       const { status } = await Notifications.requestPermissionsAsync();
//       finalStatus = status;
//     }
//     if (finalStatus !== 'granted') {
//       alert('Failed to get push token for push notification!');
//       return;
//     }
//     token = (await Notifications.getExpoPushTokenAsync()).data;
//     alert(token);
//   } else {
//     alert('Must use physical device for Push Notifications');
//   }

//   if (Platform.OS === 'android') {
//     Notifications.setNotificationChannelAsync('default', {
//       name: 'default',
//       importance: Notifications.AndroidImportance.MAX,
//       vibrationPattern: [0, 250, 250, 250],
//       lightColor: '#FF231F7C',
//     });
//   }
//   // alert("ashik")
//   return token;
// }


//fcm ends here
const DashboardScreen = () => {
  const [iscourseviewModal, setcourseviewModalVisible] = useState(false);

  const [courseView, setcourseView] = useState([]);

  const [Title, setTitle] = useState('');const [Expire_Date, setExpire_Date] = useState('');
  const [Caption, setCaption] = useState('');const [Course_Details, setCourse_Details] = useState('');
  const [imageUri, setImageUri] = useState(null);
  

  // const [expoPushToken, setExpoPushToken] = useState('');
  // const [notification, setNotification] = useState(false);
  // const notificationListener = useRef();
  // const responseListener = useRef();

  useEffect(() => {
    // registerForPushNotificationsAsync().then(token =>
    //    setExpoPushToken(token),
      
    //    );

    // notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
    //   setNotification(notification);
    // });

    // responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
    //   console.log(response);
    // });

    // return () => {
    //   Notifications.removeNotificationSubscription(notificationListener.current);
    //   Notifications.removeNotificationSubscription(responseListener.current);
    // };
    // alert("ashik")
  }, []);

  
  
  // edit & view Course
  const toggleviewcourseModal = async (course) => {
    setcourseviewModalVisible(!iscourseviewModal);
    setcourseView(course);

    setTitle(course.Title)
    setCaption(course.Caption)
    setCourse_Details(course.Course_Details)
    setExpire_Date(course.Expire_Date)
    setImageUri('https://globaltraining.iclick.best/Api/Controller/uploads/'+course.Course_image)
    
     await AsyncStorage.setItem('editcourse', JSON.stringify(course));
     const storedCourse = await AsyncStorage.getItem('editcourse');
    //  console.log("AA "+storedCourse)
  };

  const toggleviewcourseCloseModal = () => {
    setcourseviewModalVisible(false);
    // setcourseView(null);
   
  };
   // ends edit & view Course

  const [loggedUser, setLoggedUser] = useState(null);
  const [user, setUser] = useState({
    loggeduser: 'Sam',
    userPhoto: 'https://cdn.vuetifyjs.com/images/john.jpg',
  });

  const [listData, setListData] = useState([]);

  

  const fetchData = () => {
    fetch('https://globaltraining.iclick.best/Api/Controller/GetCourse.php')
      .then(response => response.json())
      .then(data => {
        setListData(data.data);
      })
      .catch(error => {
        console.log("res " + error);
      });
  };

  fetch('https://globaltraining.iclick.best/Api/Controller/GetCourse.php')
  .then(response => response.json())
  .then(data => {
    setListData(data.data);
  })
  .catch(error => {
    console.log("res " + error);
  });

  return (
    <View style={styles.container}>
      {/* <Push/> */}
       <View style={styles.featuredCourseContainer}>
        <Text style={styles.featuredCourseHeader}>Upcoming Course</Text>
        
        {listData.length > 0 && (
          <View  >
            <Card containerStyle={styles.cardContainer}>
              <Card.Image
                onPress={() => toggleviewcourseModal(listData[0])} 
                source={{ uri: 'https://globaltraining.iclick.best/Api/Controller/uploads/' + listData[0].Course_image }}
                style={styles.cardImage}
                resizeMode="cover"
              />
            </Card>
            <View style={styles.courseSection}>
              <Text style={styles.cardTitle}>{listData[0].Title}</Text>
            </View>
          </View>
        )}
      </View>

      {/* Recent Course Loop */}
      <View style={styles.recentCourseContainer}>
        <Text style={styles.recentCourseHeader}>Other Courses</Text>
        <ScrollView contentContainerStyle={styles.scrollViewContent} overScrollMode="always">
          {listData.slice(1).map((course, index) => (
            <View style={styles.courseLoopContainer} key={index} >
              <View style={styles.profileIcon}>
                <Avatar source={{ uri: 'https://globaltraining.iclick.best/Api/Controller/uploads/' + course.Course_image }} rounded />
              </View>
              <View style={[styles.userInfo, { flex: 1 }]}>
                <Text style={styles.courseTitle}>{course.Title}</Text>
                <Text style={styles.courseCaption}>{course.Caption}</Text>
                {/* <Text style={styles.courseCaption}>{index+1}</Text> */}
              </View>
              <View style={styles.bellIconContainer}>
                <Avatar
                 onPress={() => toggleviewcourseModal(listData[index+1])} 
                  rounded
                  size="small"
                  overlayContainerStyle={styles.bellIcon}
                  icon={{ name: 'angle-right', type: 'font-awesome', color: 'black' }}
                />
              </View>
            </View>
          ))}
        </ScrollView>
        <View>
      <Modal
        isVisible={iscourseviewModal}
        animationIn="slideInRight"
        animationOut="slideOutRight"
        backdropOpacity={1}
        style={{ margin: 0, marginTop: 10,  backgroundColor: '#fff', }}
      >
        
        <View style={{ flex: 1, marginTop:30,padding:10 }}>
           <TouchableWithoutFeedback onPress={toggleviewcourseCloseModal}  style={{ paddingLeft:20, paddingTop: 10,}}>
           <MaterialCommunityIcons name="arrow-left" color={'grey'} size={24} />
          </TouchableWithoutFeedback>
          {/* <Text style={{ fontSize: 24 }}>This is a full-screen modal</Text> */}
         <View>
         <View style={styles.featuredCourseContainer}>
        <Text style={styles.editfeaturedCourseHeader}>{courseView.Title}</Text>
        
        {/* {courseView.length > 0 && ( */}
          <View>
           
            
           <EditCourse  />
            
          </View>
        {/* )} */}
      </View>
         </View>
        </View>
      </Modal>
      </View>
      </View>

     
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    padding: 16,
    backgroundColor: '#fff',
  },
  featuredCourseContainer: {
    marginBottom: 10,
    borderRadius: 20,
  },
  featuredCourseHeader: {
    fontSize: 13,
    marginBottom: 5,
    paddingLeft: 20,
    paddingRight: 20,
    fontWeight: 'bold',
  },
  editfeaturedCourseHeader: {
    fontSize: 13,
    marginBottom: 5,
    paddingLeft: 20,
    paddingRight: 20,
    fontWeight: 'bold',
    textAlign:'center'
  },
  cardContainer: {
    padding: 0,
    marginBottom: 10,
    borderRadius: 20,
  },
  cardImage: {
    aspectRatio: 16 / 9,
    borderRadius: 20,
    padding: 0,
  },
  courseSection: {
    marginTop: 10,
    paddingLeft: 20,
    paddingRight: 20,
  },
  cardTitle: {
    fontSize: 13,
  },
  recentCourseContainer: {
    marginTop:10,
    marginBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
    flex: 1, // Added flex property
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
  recentCourseHeader: {
    paddingLeft: 2,
    fontSize: 13,
    fontWeight: 'bold',
  },
  courseLoopContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
    backgroundColor: '#cac7c74f',
    borderRadius: 10,
    padding: 6,
  },
  profileIcon: {
    marginRight: -4,
  },
  userInfo: {
    marginLeft: 16,
  },
  courseTitle: {
    fontSize: 10,
  },
  courseCaption: {
    fontSize: 9,
  },
  bellIconContainer: {
    marginLeft: 'auto',
  },
  bellIcon: {
    backgroundColor: 'transparent',
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 50
  },
  image: {
    borderRadius: 10,
    width: '100%',
    height: 150,
    borderColor: '#9B9B9B',
    borderWidth: 1 / PixelRatio.get(),
    justifyContent: 'center',
    alignItems: 'center',
   

  },
});

export default DashboardScreen;
