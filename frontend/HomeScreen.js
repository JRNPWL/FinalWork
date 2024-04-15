import React, { useState, useEffect } from "react";
import { ScrollView, View, StyleSheet, TextInput, Button } from "react-native";
import { logout } from "./services/authService";
import { useNavigation } from "@react-navigation/native";
import MedicationSnippet from "./snippets/MedicationSnippet";
import JournalSnippet from "./snippets/JournalSnippet";
import CustomHeader from "./snippets/CustomHeader";

const HomeScreen = ({
  onLogoutSuccess,
  navigation,
  medications,
  journalEntries,
}) => {
  const navigate = useNavigation();

  const handleLogout = async () => {
    logout();
    onLogoutSuccess();
  };

  const handleMenuPress = () => {
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
    <View style={styles.container}>
      <CustomHeader
        title="Home"
        iconName="menu"
        onMenuPress={handleMenuPress}
      />
      <ScrollView>
        <MedicationSnippet navigation={navigation} medications={medications} />
        <JournalSnippet
          navigation={navigation}
          journalEntries={journalEntries}
        />
      </ScrollView>
      {/* <Button title="Menu" onPress={navigateToMenu} /> */}
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // flexDirection: "column",
    padding: "20",
  },
});

export default HomeScreen;
