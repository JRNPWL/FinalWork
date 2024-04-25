import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Text,
  Button,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
// import { fetchExercisesData } from "../services/dataService";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faDumbbell,
  faRunning,
  faBicycle,
} from "@fortawesome/free-solid-svg-icons"; // Import Font Awesome icons
// import CustomHeader from "../snippets/CustomHeader";

const AboutScreen = () => {
  const navigation = useNavigation();

  const navigateToAddExercise = () => {
    navigation.navigate("AddExercisesScreen");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>About</Text>
      <Text style={styles.text}></Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingBottom: 80, // Keep same number as footer+20
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  exercisesContainer: {
    width: "80%",
  },
  exerciseItem: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between", // Aligns items to opposite ends
    marginBottom: 20,
    // borderWidth: 1, // Add border for visualization
    borderRadius: 15,
    backgroundColor: "lightgrey",
    padding: 10, // Add padding for visualization
    paddingTop: 25, // Add padding for visualization
    paddingBottom: 25, // Add padding for visualization
  },
  itemContainer: {
    // alignSelf: "flex-start",
  },
  topContainer: {
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  bottomContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconContainer: {
    marginRight: 30, // Add margin for spacing between icon and details
  },
  detailsContainer: {
    flex: 1, // Expand to take remaining space
  },
  title: {
    fontSize: 21,
    fontWeight: "bold",
    textAlign: "left",
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
  },
  text: {
    fontSize: 16,
  },
  icon: {
    marginTop: 5,
  },
});

export default AboutScreen;
