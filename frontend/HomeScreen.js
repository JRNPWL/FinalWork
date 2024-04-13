import React, { useState } from "react";
import { View, TextInput, Button } from "react-native";
import { logout } from "./services/authService";
import { useNavigation } from "@react-navigation/native";

const HomeScreen = ({ onLogoutSuccess }) => {
  const navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogout = async () => {
    logout();
    onLogoutSuccess();
  };

  const navigateToMenu = async () => {
    navigation.navigate("MenuScreen");
  };

  //   const handleLogin = async () => {
  //     const success = await login(email, password);
  //     if (success) {
  //       // Navigate to home screen or fetch user data
  //     } else {
  //       // Show error message
  //     }
  //   };

  return (
    <View>
      {/* <h1>HOME</h1> */}
      <Button title="Menu" onPress={navigateToMenu} />
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

export default HomeScreen;
