import React, { useState } from 'react';
import { View, Text, Button,Image,StyleSheet,TouchableWithoutFeedback,Platform } from 'react-native';
import Modal from 'react-native-modal';
import { Col, Row, Grid, } from 'react-native-easy-grid';
import { Avatar, Card } from 'react-native-elements';
import { MaterialIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TouchableOpacity } from "react-native-gesture-handler";

import AddTrainer from '../screens/addtrainer'
import AddCourse from '../screens/addcourse'

import Trinerlist from '../screens/trainerlist'

export default function Other() {
  const [isModalVisible, setModalVisible] = useState(false);
  const [iscourseModalVisible, setcourseModalVisible] = useState(false);

  const [trainerList, settrainerList] = useState(false);
  const [courseList, setcourseList] = useState(false);
  
  
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  const togglecourseModal = () => {
    setcourseModalVisible(!iscourseModalVisible);
  };

  const trainerlistModal = () => {
    settrainerList(!trainerList);
  };
  
  

  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <View style={styles.container}>
           <Card containerStyle={styles.cardContainer}>
              <Card.Image
                source={require('../../assets/admindash.jpeg')}
                style={styles.cardImage}
                resizeMode="cover"
              />
            </Card>
       
        <View style={styles.MainContainer}>
        <View style={{ flex: 1 }}>
      <Grid>
        <Row style={{ flex: 1, justifyContent: 'center', padding:10 }}>
          <Col style={styles.ColContainer} onPress={toggleModal} >
          <MaterialCommunityIcons name="account" color={'grey'} size={24} />
              <Text style={{ marginTop: 5, fontSize: 10, opacity: 0.5 }}>
                Add Trainer
              </Text>
          </Col>
          <Col style={styles.ColContainer} onPress={trainerlistModal} >
            <MaterialCommunityIcons name="account-group" color={'grey'} size={24} />
              <Text style={{ marginTop: 5, fontSize: 10, opacity: 0.5 }}>
                Trainer List
            </Text>
          </Col>
          <Col style={styles.ColContainer}   onPress={togglecourseModal} >
            <MaterialCommunityIcons name="note-plus" color={'grey'} size={24} />
              <Text style={{ marginTop: 5, fontSize: 10, opacity: 0.5 }}>
                Add Course
            </Text>
          </Col>
          
          <Col style={styles.ColContainer} >
            <MaterialCommunityIcons name="note-multiple" color={'grey'} size={24} />
              <Text style={{ marginTop: 5, fontSize: 10, opacity: 0.5 }}>
                Course List
            </Text>
          </Col>
        </Row>
       
      </Grid>
    </View>
        </View>
       
     </View>
     


      {/* trainer modal starts here */}
      <Modal
        isVisible={isModalVisible}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        backdropOpacity={1}
        style={{ margin: 0, marginTop: 10,  backgroundColor: '#fff', }}
      >
        
        <View style={{ flex: 1, justifyContent: 'center' }}>
          
          {Platform.OS === 'ios' ? (
      <TouchableOpacity onPress={toggleModal} style={{ paddingLeft: 20, paddingTop: 50 }}>
        <MaterialCommunityIcons name="arrow-left" color={'grey'} size={24} />
      </TouchableOpacity>
    ) : (
      <TouchableWithoutFeedback onPress={toggleModal} style={{ paddingLeft: 20, paddingTop: 50 }}>
        <MaterialCommunityIcons name="arrow-left" color={'grey'} size={24} />
      </TouchableWithoutFeedback>
    )}
          {/* <Text style={{ fontSize: 24 }}>This is a full-screen modal</Text> */}
          <AddTrainer/>
          
        </View>
      </Modal>

      {/* trainer list modal starts here */}
      <Modal
        isVisible={trainerList}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        backdropOpacity={1}
        style={{ margin: 0, marginTop: 10,  backgroundColor: '#fff', }}
      >
        
        <View style={{ flex: 1, justifyContent: 'center' }}>
          
          {Platform.OS === 'ios' ? (
      <TouchableOpacity onPress={trainerlistModal} style={{ paddingLeft: 20, paddingTop: 50 }}>
        <MaterialCommunityIcons name="arrow-left" color={'grey'} size={24} />
      </TouchableOpacity>
    ) : (
      <TouchableWithoutFeedback onPress={toggleModal} style={{ paddingLeft: 20, paddingTop: 50 }}>
        <MaterialCommunityIcons name="arrow-left" color={'grey'} size={24} /> Trainer LiSt
      </TouchableWithoutFeedback>
    )}
          {/* <Text style={{ fontSize: 24 }}>This is a full-screen modal</Text> */}
          <Trinerlist/>
          
        </View>
      </Modal>

     

      {/* course modal starts here */}
      <Modal
        isVisible={iscourseModalVisible}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        backdropOpacity={1}
        style={{ margin: 0, marginTop: 10,  backgroundColor: '#fff', }}
      >
        
        <View style={{ flex: 1, justifyContent: 'center' }}>
          

          {Platform.OS === 'ios' ? (
      <TouchableOpacity onPress={togglecourseModal} style={{ paddingLeft: 20, paddingTop: 50 }}>
        <MaterialCommunityIcons name="arrow-left" color={'grey'} size={24} />
      </TouchableOpacity>
    ) : (
      <TouchableWithoutFeedback onPress={togglecourseModal} style={{ paddingLeft: 20, paddingTop: 50 }}>
        <MaterialCommunityIcons name="arrow-left" color={'grey'} size={24} />
      </TouchableWithoutFeedback>
    )}
          {/* <Text style={{ fontSize: 24 }}>This is a full-screen modal</Text> */}
          <AddCourse/>
          
        </View>
      </Modal>
       <View>
        
       </View>
    </View>
  );
}
const styles = StyleSheet.create({
  
  container: {
    paddingTop: 10,
    padding: 16,
    height: '100%',
    backgroundColor: '#fff',
  },
  bannerImgContainer: {
    marginTop: 1,
    alignItems: 'center',
  },
  bannerImg: {
    width: "100%",
    height: 140,
  },
  MainContainer:{
   
    flex: 1,
    paddingTop: 10,
  }
  ,
  ColContainer:{
    backgroundColor: '#EEEEEE', height: 60,padding:5, margin:2,justifyContent: 'center', alignItems: 'center'
    ,borderRadius: 10,
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
});