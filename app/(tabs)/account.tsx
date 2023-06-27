import { View, Text, Pressable } from "react-native";
import { useAuth } from "../../context/AuthProvider";
import { Link } from "expo-router";
import { TouchableOpacity } from "react-native-gesture-handler";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Accout() {
  const { setUser, user } = useAuth();
  console.log(user)
  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem('user');
  }

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Account</Text>
      <Text>{user && user.name}</Text>
      <TouchableOpacity onPress={() => logout()}>
        <Text>Log out</Text>
      </TouchableOpacity>
    </View>
  );
}
