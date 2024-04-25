import React, { useState, useEffect, useContext } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  TextInput,
  Button,
  ActivityIndicator,
} from "react-native";
import { logout } from "./services/authService";
import { useNavigation } from "@react-navigation/native";
import MedicationSnippet from "./snippets/MedicationSnippet";
import JournalSnippet from "./snippets/JournalSnippet";
import UserSnippet from "./snippets/UserSnippet";

const HomeScreen = ({
  onLogoutSuccess,
  navigation,
  medications,
  journalEntries,
  userData,
}) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if medications and journalEntries are available
    if (
      medications.length > 0 &&
      journalEntries.length > 0
      // && userData.length > 0
    ) {
      setIsLoading(false); // Set loading state to false once data is available
    }
  }, [medications, journalEntries, userData]);

  const handleLogout = async () => {
    logout();
    onLogoutSuccess();
  };

  const handleMenuPress = () => {
    navigation.navigate("MenuScreen");
  };

  return (
    <View style={styles.container}>
      <Button title="Logout" onPress={handleLogout} />
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <ScrollView style={styles.scrollContainer}>
          <UserSnippet navigation={navigation} userData={userData} />
          <MedicationSnippet
            navigation={navigation}
            medications={medications}
          />
          <JournalSnippet
            navigation={navigation}
            journalEntries={journalEntries}
          />
        </ScrollView>
      )}
      {/* <CustomFooter /> */}
      {/* {isFooterVisible && <CustomFooter />} */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "white",
  },
  scrollContainer: {
    padding: 20,
  },
});

export default HomeScreen;
