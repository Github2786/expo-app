import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView,TouchableWithoutFeedback ,TextInput,PixelRatio} from 'react-native';
import { Avatar, Card } from 'react-native-elements';

import { MaterialIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Modal from 'react-native-modal';
import { TouchableOpacity} from "react-native-gesture-handler";
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EditTrainer from '../screens/editTrainer'

const TrainerScreen = () => {

  const [iscourseviewModal, setcourseviewModalVisible] = useState(false);

  const [courseView, setcourseView] = useState([]);

  const [Title, setTitle] = useState('');const [Expire_Date, setExpire_Date] = useState('');
  const [Caption, setCaption] = useState('');const [Course_Details, setCourse_Details] = useState('');
  const [imageUri, setImageUri] = useState(null);
  
  useEffect(() => {
    fetchData()
    
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
    
     await AsyncStorage.setItem('edittrainer', JSON.stringify(course));
     const storedtrainer = await AsyncStorage.getItem('edittrainer');
     console.log("AA "+storedtrainer)
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

  const [listDatatrainer, setListDatatrainer] = useState([]);

  

  const fetchData = () => {
    fetch('https://globaltraining.iclick.best/Api/Controller/Gettrainers.php')
      .then(response => response.json())
      .then(data => {
        setListDatatrainer(data.data);
        console.log(data.data)
      })
      .catch(error => {
        console.log("res " + error);
      });
  };

//   fetch('https://globaltraining.iclick.best/Api/Controller/Gettrainers.php')
//   .then(response => response.json())
//   .then(data => {
//     setListData(data.data);
//     console.log(data.data)
//   })
//   .catch(error => {
//     console.log("res " + error);
//   });

  return (
    <View style={styles.container}>

      {/* Recent Course Loop */}
      <View style={styles.recentCourseContainer}>
      <View>
        <Text style={[styles.recentCourseHeader, { textAlign: 'center' , paddingBottom:20}]}>Trainers List</Text>
      </View>
       
        <ScrollView contentContainerStyle={styles.scrollViewContent} overScrollMode="always">
          {listDatatrainer.slice(1).map((trainer, index) => (
            <View style={styles.courseLoopContainer} key={index} >
              <View style={styles.profileIcon}>
                <Avatar source={{ uri: 'https://globaltraining.iclick.best/Api/Controller/Trainers/' + trainer.Photo }} rounded />
              </View>
              <View style={[styles.userInfo, { flex: 1 }]}>
                <Text style={styles.courseTitle}>{trainer.Name}</Text>
                <Text style={styles.courseCaption}>{trainer.Phone}</Text>
                <Text style={styles.courseCaption}>{trainer.Email}</Text>
                {/* <Text style={styles.courseCaption}>{index+1}</Text> */}
              </View>
              <View style={styles.bellIconContainer}>
                <Avatar
                 onPress={() => toggleviewcourseModal(listDatatrainer[index+1])} 
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
        <Text style={styles.editfeaturedCourseHeader}>{courseView.Name}</Text>
        
        {/* {courseView.length > 0 && ( */}
          <View>
           
            
           <EditTrainer  />
            
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
    justifyContent:'center',
    alignItems: 'center',

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

export default TrainerScreen;
