import React, { useState, useEffect, useContext } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
} from "react-native";
import { logout } from "./services/authService";
import { useNavigation } from "@react-navigation/native";
import MedicationSnippet from "./snippets/MedicationSnippet";
import JournalSnippet from "./snippets/JournalSnippet";
import UserSnippet from "./snippets/UserSnippet";

const HomeScreen = ({
  // onLogoutSuccess,
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

  // const handleLogout = async () => {
  //   logout();
  //   onLogoutSuccess();
  // };

  // const handleMenuPress = () => {
  //   navigation.navigate("MenuScreen");
  // };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* <Button title="Logout" onPress={handleLogout} /> */}
      {/* {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : ( */}
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        <Text style={styles.pageTitle}>Dashboard</Text>
        <UserSnippet navigation={navigation} userData={userData} />
        <MedicationSnippet navigation={navigation} medications={medications} />
        <JournalSnippet
          navigation={navigation}
          journalEntries={journalEntries}
        />
      </ScrollView>
      {/* )} */}
      {/* <CustomFooter /> */}
      {/* {isFooterVisible && <CustomFooter />} */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingBottom: 40, // Keep same number as footer+20
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContainer: {
    padding: 20,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 15,
    paddingLeft: 20,
  },
});

export default HomeScreen;
