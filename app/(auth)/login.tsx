import React, { useState } from "react";
import { Link } from "expo-router";
import { View, Text,Image,StyleSheet,Keyboard,TextInput,} from "react-native";
import { useAuth } from "../../context/AuthProvider";
import { TouchableOpacity } from "react-native-gesture-handler";
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { useSegments, useRouter } from "expo-router";
import { createContext, useContext, useEffect } from "react";
// import { Redirect } from 'react-router-dom';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {  Snackbar } from 'react-native-paper';
import * as Linking from 'expo-linking';

export default function Login() {
  const router = useRouter();
  const navigation = useNavigation();
  const { setUser,user } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [visible, setVisible] = useState(false);

  const [message, setMessage] = useState('');
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);
  useEffect(() => {
    const fetchStoredUser = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      

      if(storedUser)
        {
          // console.log(JSON.parse(storedUser));
          setUser(JSON.parse(storedUser))
        // router.replace("/login");
        } 
        else {
        // Redirect away from the sign-in page.
        // router.replace("/home");
        }
      
    };
    
    fetchStoredUser();
  }, []);
 

  // if(user == null)
  // {
   
   
  //   // if (storedUser) {
  //   //   // const user = JSON.parse(storedUser);
  //   //   // Use the user object as needed
    
  //   //   // setUser(user)
  //   // } else {
  //   //   setUser(null)
  //   // }
  // }else{
  //   console.log("b"+user);
  // }
  

//   const login = async () => {
//     const credentials = {
//       // username: username,
//       // password: password,
//       username: 'superadmin@123.com',
//       password: '123',
//       methodName: 'Login',
//     };
//     // setUser({
//     //   name: "John Doe",
//     // });
//     // console.log("sam "+username)
// // if(!username)
// // {
  
  
// // }else{
//   await axios.post('https://globaltraining.iclick.best/Api/Controller/login.php', credentials)
//   .then(response => {
//     // Handle successful login response
   
//     if (response.data.success) {
//       let res = response.data.data;
//       const user = { 
//         name: res[0].Name, email: res[0].Email,Id:res[0].Trainer_id
//       };

//       // Store the user object as a JSON string
//       await AsyncStorage.setItem('user', JSON.stringify(user));
     
//       console.log(AsyncStorage.getItem('user'));
//       // const userData = response.data.data;
//       // setUser(userData);
//       // AsyncStorage.setItem('user', JSON.stringify(userData));
//       // this.storeData(userData);
     
//     } else {
//       console.log('Failed');
      
//     }
//   })
//   .catch(error => {
//     // Handle login error
//     console.error(error);
//   });
// // }
    
//   };


const showLoginSuccessToast = () => {
  setVisible(true);
  setTimeout(() => {
    setVisible(false);
  }, 1500);
}
const login = async () => {
 
  
  const credentials = {
   username: username,
   password: password,
    // username: 'superadmin@123.com',
    // password: '123',
    methodName: 'Login',
  };

  try {
    const response = await axios.post(
      'https://globaltraining.iclick.best/Api/Controller/login.php',
      credentials
    );

    if (response.data.success) {
      let res = response.data.data;
      // console.log(res)
      const user = {
        name: res[0].Name,
        email: res[0].Email,
        Id: res[0].Trainer_id,
        image: res[0].Photo,
        user_Type:res[0].user_Type
      };
      
      setMessage('Logged in Successfull')
      showLoginSuccessToast()
      await AsyncStorage.setItem('user', JSON.stringify(user));
      const storedUser = await AsyncStorage.getItem('user');
      setUser(JSON.parse(storedUser))
     
      // console.log(JSON.parse(storedUser));
    } else {
      // console.log('Failed');
      setMessage('login failed')
      showLoginSuccessToast()
      
    }
  } catch (error) {
    console.error(error);
  }
};



  return (
    <View style={{ flex: 1, justifyContent: "center" }} >
      {/* <TouchableOpacity onPress={login}>
       
      </TouchableOpacity> */}

      <View style={styles.container}>
        <View style={styles.bannerImgContainer}>
          <Image
            source={require('../../assets/logo.png')}
            style={styles.bannerImg}
            resizeMode="contain"
            alt="Global training logo"
          />
        </View>
        <Text style={styles.logoCaption}>Matching Trainers To Classes</Text>
        <View style={styles.loginCaption}>
          <Text style={styles.loginText}>Login</Text>
          <Text style={styles.loginsubText}>login to continue using the app</Text>
        </View>

        <View style={styles.loginCard}>
          <TextInput
            style={styles.loginInput}
            value={username}
            onChangeText={setUsername}
            placeholder="Username"
          />
          <TextInput
            style={[styles.loginInput, styles.mt5]}
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            secureTextEntry
          />
          <View style={styles.textLinks}>
            <TouchableOpacity>
              {/* <Text style={styles.subText}>create account</Text> */}
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.subText}>forget password?</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.loginCaption2}>
            <TouchableOpacity onPress={login} style={styles.loginButton}>
              <Text style={styles.loginText2}>Login</Text>
            </TouchableOpacity>

           
            {/* <TouchableOpacity onPress={() => navigate('Dashboard')} style={styles.loginCaption2}>
               <Text style={styles.btnText}>Login</Text>
           </TouchableOpacity> */}

          </View>
        </View>
      </View>
    
      <Snackbar
          visible={visible}
          onDismiss={() => setVisible(false)}
          duration={1500}
          style={styles.snack}
        >
           <Text style={styles.msgText}> {message}</Text>
        </Snackbar>
       
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    paddingTop: 80,
    height: '100%',
    backgroundColor: '#fff',
  },
  bannerImgContainer: {
    marginTop: 1,
    alignItems: 'center',
  },
  bannerImg: {
    width: 140,
    height: 140,
  },
  loginCaption: {
    marginTop: 10,
    marginBottom: 30,
  },
  loginText: {
    color: '#2962F6',
    // fontFamily: 'sans-serif',
    fontWeight: '600',
    fontSize: 30,
    textAlign: 'center',
    marginTop: 40,
  },
  loginText2: {
    justifyContent: 'center',
    color: '#FFF',
    padding: 8,
    fontSize: 15,
    textAlign: 'center',
    borderRadius: 20,
    backgroundColor: '#2962F6',
    width: '100%',
  },
  msgText:{
    justifyContent: 'center',
    color: '#FFF',
    fontSize: 15,
    textAlign: 'center',
    borderRadius: 20,
    width: '100%',
  },
  subText: {
    fontSize: 12,
    color: '#BCB2B2',
  },
  loginsubText: {
    fontSize: 12,
    color: '#BCB2B2',
    textAlign: 'center',
  },
  loginCard: {
    width: '100%',
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    marginTop: 20,
  },
  loginInput: {
    width: '100%',
    backgroundColor: '#D9D9D9',
    color: '#FFFFFF',
    borderRadius: 20,
    padding: 10,
    marginBottom: 10,
  },
  mt5: {
    marginTop: 5,
  },
  textLinks: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  secGetStarted: {
    marginTop: 20,
    borderRadius: 20,
    textAlign: 'center',
    color: '#fff',
    backgroundColor: '#0060c0',
    width: '50%',
  },
  logoCaption: {
    textAlign: 'center',
  },
  loginCaption2: {
    marginTop: 20,
    width: '100%',
    textAlign: 'center',
    justifyContent: 'center',
  },
  loginButton:{

  },
  snack:{
   padding:0,
    textAlign:"center",
    backgroundColor: '#144272', // Change the background color here
    borderRadius: 20, // Set the desired border radius here
    color: '#FFFFFF !important' , // Set the text color to white
  }
});
