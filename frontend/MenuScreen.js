import React, { useState } from "react";
import { View, TextInput, Button } from "react-native";
// import { logout } from "./services/authService";
import { useNavigation } from "@react-navigation/native";

const MenuScreen = ({ onLogoutSuccess }) => {
  const navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // const handleLogout = async () => {
  //   logout();
  //   onLogoutSuccess();
  // };

  const navigateToProfile = async () => {
    navigation.navigate("UserProfile");
  };
  const navigateToMedication = async () => {
    navigation.navigate("MedicationScreen");
  };
  const navigateToJournal = async () => {
    navigation.navigate("JournalScreen");
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
      {/* <h1>Menu</h1> */}
      <Button title="Profile" onPress={navigateToProfile} />
      <Button title="Medication" onPress={navigateToMedication} />
      <Button title="Journal" onPress={navigateToJournal} />
      {/* <Button title="Logout" onPress={handleLogout} /> */}
    </View>
  );
};

export default MenuScreen;
