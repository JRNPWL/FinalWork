import React, { useEffect, useContext } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faHouse,
  faDumbbell,
  faChartSimple,
  faPills,
  faBook,
} from "@fortawesome/free-solid-svg-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

const CustomFooter = () => {
  const navigation = useNavigation();
  const iconSize = 28;

  const springValues = {
    userProfile: useSharedValue(1),
    medicationScreen: useSharedValue(1),
    homeScreen: useSharedValue(1),
    journalScreen: useSharedValue(1),
    exercisesScreen: useSharedValue(1),
    statisticsScreen: useSharedValue(1),
  };

  const navigateToScreen = (screenName, springValue) => {
    springAnimation(springValue);
    setTimeout(() => {
      navigation.navigate(screenName);
    }, 300); // Adjust the delay time as needed
  };

  const springAnimation = (springValue) => {
    springValue.value = withSpring(0.8, { stiffness: 300, damping: 15 }, () => {
      springValue.value = withSpring(1, { stiffness: 300, damping: 15 });
    });
  };

  const animatedStyle = (springValue) =>
    useAnimatedStyle(() => {
      return {
        transform: [{ scale: springValue.value }],
      };
    });

  useEffect(() => {
    // Reset all shared values when component mounts
    for (const key in springValues) {
      springValues[key].value = 1;
    }
  }, []);

  return (
    // isFooterVisible && (
    <View style={styles.container}>
      <View style={styles.gridContainer}>
        {/* Stats Profile */}
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() =>
            navigateToScreen("StatisticsScreen", springValues.statisticsScreen)
          }
        >
          <Animated.View
            style={[
              styles.menuItemIcon,
              animatedStyle(springValues.statisticsScreen),
            ]}
          >
            <FontAwesomeIcon
              icon={faChartSimple}
              size={iconSize}
              style={styles.menuItemIcon}
            />
          </Animated.View>
        </TouchableOpacity>

        {/* Medication Screen */}
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() =>
            navigateToScreen("MedicationScreen", springValues.medicationScreen)
          }
        >
          <Animated.View
            style={[
              styles.menuItemIcon,
              animatedStyle(springValues.medicationScreen),
            ]}
          >
            <FontAwesomeIcon
              icon={faPills}
              size={iconSize}
              style={styles.menuItemIcon}
            />
          </Animated.View>
        </TouchableOpacity>

        {/* Home Screen */}
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() =>
            navigateToScreen("HomeScreen", springValues.homeScreen)
          }
        >
          <Animated.View
            style={[
              styles.menuItemIcon,
              animatedStyle(springValues.homeScreen),
            ]}
          >
            <FontAwesomeIcon
              icon={faHouse}
              size={iconSize}
              style={styles.menuItemIcon}
            />
          </Animated.View>
        </TouchableOpacity>

        {/* Journal Screen */}
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() =>
            navigateToScreen("JournalScreen", springValues.journalScreen)
          }
        >
          <Animated.View
            style={[
              styles.menuItemIcon,
              animatedStyle(springValues.journalScreen),
            ]}
          >
            <FontAwesomeIcon
              icon={faBook}
              size={iconSize}
              style={styles.menuItemIcon}
            />
          </Animated.View>
        </TouchableOpacity>

        {/* Exercise Screen */}
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() =>
            navigateToScreen("ExercisesScreen", springValues.exercisesScreen)
          }
        >
          <Animated.View
            style={[
              styles.menuItemIcon,
              animatedStyle(springValues.exercisesScreen),
            ]}
          >
            <FontAwesomeIcon
              icon={faDumbbell}
              size={iconSize}
              style={styles.menuItemIcon}
            />
          </Animated.View>
        </TouchableOpacity>
      </View>
    </View>
    // )
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    // zIndex: 1000, // Ensure it appears above other content
    // elevation: 1000, // works on android
  },
  gridContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: 60,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: "#4facfe",
  },
  menuItem: {
    alignItems: "center",
    justifyContent: "center",
  },
  menuItemIcon: {
    color: "white",
  },
});

export default CustomFooter;
