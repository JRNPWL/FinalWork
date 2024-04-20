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
// import CustomHeader from "./snippets/CustomHeader";
import CustomFooter from "./snippets/CustomFooter";
import Animated from "react-native-reanimated";

const HomeScreen = ({
  onLogoutSuccess,
  navigation,
  medications,
  journalEntries,
}) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if medications and journalEntries are available
    if (medications.length > 0 && journalEntries.length > 0) {
      setIsLoading(false); // Set loading state to false once data is available
    }
  }, [medications, journalEntries]);

  const handleLogout = async () => {
    logout();
    onLogoutSuccess();
  };

  const handleMenuPress = () => {
    navigation.navigate("MenuScreen");
  };

  return (
    <View style={styles.container}>
      {/* <CustomHeader
        title="Home"
        iconName="menu"
        onMenuPress={handleMenuPress}
      /> */}
      <Button title="Logout" onPress={handleLogout} />
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <ScrollView style={styles.scrollContainer}>
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
