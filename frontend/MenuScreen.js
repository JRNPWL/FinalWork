import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  Button,
} from "react-native";
// import { logout } from "./services/authService";
import { useNavigation } from "@react-navigation/native";
import CustomHeader from "./snippets/CustomHeader";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faHouse,
  faDumbbell,
  faUser,
  faPills,
  faBook,
} from "@fortawesome/free-solid-svg-icons";

const MenuScreen = ({}) => {
  const navigation = useNavigation();

  const goBack = () => {
    navigation.goBack();
  };

  const navigateToHome = async () => {
    navigation.navigate("HomeScreen");
  };
  const navigateToProfile = async () => {
    navigation.navigate("UserProfile");
  };
  const navigateToMedication = async () => {
    navigation.navigate("MedicationScreen");
  };
  const navigateToJournal = async () => {
    navigation.navigate("JournalScreen");
  };
  const navigateToExercises = async () => {
    navigation.navigate("ExercisesScreen");
  };

  return (
    <View>
      <CustomHeader
        title="Home"
        iconName="close-outline"
        onMenuPress={goBack}
      />
      <TouchableOpacity style={styles.menuItem} onPress={navigateToHome}>
        <FontAwesomeIcon icon={faHouse} size={24} />
        <Text style={styles.menuItemText}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem} onPress={navigateToProfile}>
        <FontAwesomeIcon icon={faUser} size={24} />
        <Text style={styles.menuItemText}>Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem} onPress={navigateToMedication}>
        <FontAwesomeIcon icon={faPills} size={24} />
        <Text style={styles.menuItemText}>Medication</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem} onPress={navigateToJournal}>
        <FontAwesomeIcon icon={faBook} size={24} />
        <Text style={styles.menuItemText}>Journal</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem} onPress={navigateToExercises}>
        <FontAwesomeIcon icon={faDumbbell} size={24} />
        <Text style={styles.menuItemText}>Exercises</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  menuItemText: {
    marginLeft: 10,
  },
});

export default MenuScreen;
