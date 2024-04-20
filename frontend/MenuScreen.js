import React from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
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
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  BounceIn,
  BounceInDown,
  BounceInLeft,
  BounceInRight,
  BounceInUp,
  BounceOut,
  BounceOutDown,
  BounceOutUp,
  FadeIn,
  FadeInLeft,
  FadeOut,
  SlideInDown,
  SlideInLeft,
  Easing,
} from "react-native-reanimated";

const MenuScreen = ({}) => {
  const navigation = useNavigation();

  const goBack = () => {
    navigation.goBack();
  };

  const navigateToScreen = (screenName) => {
    navigation.navigate(screenName);
  };

  return (
    <Animated.View
      entering={BounceInDown.duration(300).easing(Easing.inOut)}
      exiting={BounceOutDown.duration(200)}
      style={styles.container}
    >
      <LinearGradient colors={["#4facfe", "#00f2fe"]} style={styles.container}>
        <View style={styles.container}>
          <CustomHeader
            title="Home"
            iconName="close-outline"
            onMenuPress={goBack}
          />
          <View style={styles.gridContainer}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigateToScreen("HomeScreen")}
            >
              <FontAwesomeIcon
                icon={faHouse}
                size={48}
                style={styles.menuItemIcon}
              />
              <Text style={styles.menuItemText}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigateToScreen("UserProfile")}
            >
              <FontAwesomeIcon
                icon={faUser}
                size={48}
                style={styles.menuItemIcon}
              />
              <Text style={styles.menuItemText}>Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigateToScreen("MedicationScreen")}
            >
              <FontAwesomeIcon
                icon={faPills}
                size={48}
                style={styles.menuItemIcon}
              />
              <Text style={styles.menuItemText}>Medication</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigateToScreen("JournalScreen")}
            >
              <FontAwesomeIcon
                icon={faBook}
                size={48}
                style={styles.menuItemIcon}
              />
              <Text style={styles.menuItemText}>Journal</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigateToScreen("ExercisesScreen")}
            >
              <FontAwesomeIcon
                icon={faDumbbell}
                size={48}
                style={styles.menuItemIcon}
              />
              <Text style={styles.menuItemText}>Exercises</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex: 1000, // works on ios
    elevation: 1000, // works on android
  },
  gridContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: 10,
  },
  menuItem: {
    width: "48%", // Adjust the width to fit 2 columns
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20, // Increase vertical padding to make them closer together
  },
  menuItemIcon: {
    marginBottom: 10, // Adjust spacing between icon and text
    color: "#fff",
  },
  menuItemText: {
    fontSize: 18, // Increase text size
    color: "#fff",
  },
});

export default MenuScreen;
