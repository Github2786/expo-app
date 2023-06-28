import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { useAuth } from "../../context/AuthProvider";
import { Avatar, Card, Button } from 'react-native-elements';

import { MaterialIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Modal from 'react-native-modal';

const Header = () => {
  const [isaccountModalVisible, setaccountModalVisible] = useState(false);

  const { setUser, user } = useAuth();

  const togglecourseModal = () => {
    setaccountModalVisible(!isaccountModalVisible);
  };

  useEffect(() => {}, []);

  return (
    <View style={styles.container}>
      <View style={styles.appBar}>
        <View style={styles.row}>
          <View style={styles.profileIcon}>
            {user && user.image ? (
              <Avatar rounded source={{ uri: 'https://globaltraining.iclick.best/Api/Controller/Trainers/' + user.image }} />
            ) : (
              <Image source={{ uri: 'https://cdn.vuetifyjs.com/images/john.jpg' }} style={styles.userAvatar} />
            )}
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>Hi, {user && user.name}</Text>
            <Text style={styles.welcomeMessage}>Welcome to global training</Text>
          </View>

          <View style={styles.bellIconContainer}>
            <Avatar
              // onPress={togglecourseModal}
              rounded
              size="small"
              overlayContainerStyle={styles.bellIcon2}
              icon={{ name: 'navicon', type: 'font-awesome', color: 'black' }}
            />
          </View>
        </View>
      </View>
      <View>
        <Modal
          isVisible={isaccountModalVisible}
          animationIn="slideInUp"
          animationOut="slideOutDown"
          backdropOpacity={1}
          style={{ margin: 0, marginTop: 10, backgroundColor: '#fff' }}
        >
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <TouchableWithoutFeedback onPress={togglecourseModal}>
              <MaterialCommunityIcons name="arrow-left" color="grey" size={24} />
              
            </TouchableWithoutFeedback>
            <View >
                {/* <Text style={{ justifyContent: 'center',alignContent:'center' }}>No Content Available</Text> */}
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 40,
    backgroundColor: '#fff'
  },
  appBar: {
    elevation: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
    marginRight: 20,
  },
  profileIcon: {
    paddingRight: 0,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  userInfo: {
    marginLeft: 16,
  },
  userName: {
    fontWeight: '400',
    fontSize: 13,
  },
  welcomeMessage: {
    color: 'rgba(0, 0, 0, 0.41)',
    fontSize: 12,
  },
  bellIconContainer: {
    marginLeft: 'auto',
    zIndex: 10000,
  },
  bellIcon2: {
    backgroundColor: '#e3e5e4',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Header;
