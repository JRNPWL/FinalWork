// import React from "react";
// import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// // import CustomHeader from "./snippets/CustomHeader";
// import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
// import {
//   faHouse,
//   faDumbbell,
//   faUser,
//   faPills,
//   faBook,
// } from "@fortawesome/free-solid-svg-icons";
// import { LinearGradient } from "expo-linear-gradient";
// import Animated, {
//   useSharedValue,
//   useAnimatedStyle,
//   withSpring,
// } from "react-native-reanimated";

// const CustomFooter = ({}) => {
//   const navigation = useNavigation();
//   const fontSize = 28;
//   const springValue = useSharedValue(1);

//   const goBack = () => {
//     navigation.goBack();
//   };

//   // const navigateToHome = () => {
//   //   navigation.navigate("HomeScreen");
//   // };
//   // const navigateToProfile = () => {
//   //   navigation.navigate("UserProfile");
//   // };
//   // const navigateToMedication = () => {
//   //   navigation.navigate("MedicationScreen");
//   // };
//   // const navigateToJournal = () => {
//   //   navigation.navigate("JournalScreen");
//   // };
//   // const navigateToExercises = () => {
//   //   navigation.navigate("ExercisesScreen");
//   // };

//   const navigateToScreen = (screenName) => {
//     navigation.navigate(screenName);
//   };

//   const springAnimation = () => {
//     springValue.value = withSpring(0.8, {}, () => {
//       springValue.value = withSpring(1);
//     });
//   };

//   const animatedStyle = useAnimatedStyle(() => {
//     return {
//       transform: [{ scale: springValue.value }], // Use .value here
//     };
//   });

//   return (
//     // <LinearGradient colors={["#4facfe", "#00f2fe"]} style={styles.container}>
//     <View style={styles.gridContainer}>
//       <TouchableOpacity
//         style={styles.menuItem}
//         onPress={() => navigateToScreen("UserProfile")}
//       >
//         <FontAwesomeIcon
//           icon={faUser}
//           size={fontSize}
//           style={styles.menuItemIcon}
//         />
//         {/* <Text style={styles.menuItemText}>Profile</Text> */}
//       </TouchableOpacity>
//       <TouchableOpacity
//         style={styles.menuItem}
//         onPress={() => navigateToScreen("MedicationScreen")}
//       >
//         <FontAwesomeIcon
//           icon={faPills}
//           size={fontSize}
//           style={styles.menuItemIcon}
//         />
//         {/* <Text style={styles.menuItemText}>Medication</Text> */}
//       </TouchableOpacity>
//       <TouchableOpacity
//         style={styles.menuItem}
//         onPress={() => {
//           navigateToScreen("HomeScreen");
//           // springAnimation();
//         }}
//       >
//         {/* <Animated.View style={animatedStyle}> */}
//         <FontAwesomeIcon
//           icon={faHouse}
//           size={fontSize}
//           style={styles.menuItemIcon}
//         />
//         {/* </Animated.View> */}
//       </TouchableOpacity>
//       <TouchableOpacity
//         style={styles.menuItem}
//         onPress={() => navigateToScreen("JournalScreen")}
//       >
//         <FontAwesomeIcon
//           icon={faBook}
//           size={fontSize}
//           style={styles.menuItemIcon}
//         />
//         {/* <Text style={styles.menuItemText}>Journal</Text> */}
//       </TouchableOpacity>
//       <TouchableOpacity
//         style={styles.menuItem}
//         onPress={() => navigateToScreen("ExercisesScreen")}
//       >
//         <FontAwesomeIcon
//           icon={faDumbbell}
//           size={fontSize}
//           style={styles.menuItemIcon}
//         />
//         {/* <Text style={styles.menuItemText}>Exercises</Text> */}
//       </TouchableOpacity>
//     </View>
//     // </LinearGradient>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     width: "100%",
//     paddingLeft: 20,
//     paddingRight: 20,
//   },
//   gridContainer: {
//     // flex: 1,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     height: 60,
//     paddingLeft: 20,
//     paddingRight: 20,
//     backgroundColor: "#4facfe",
//   },
//   menuItem: {
//     alignItems: "center",
//     justifyContent: "center",
//     // paddingVertical: 20, // Increase vertical padding to make them closer together
//   },
//   menuItemIcon: {
//     // marginBottom: 10, // Adjust spacing between icon and text
//     color: "white",
//   },
// });

// export default CustomFooter;
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
// import FooterVisibilityContext from "../services/FooterVisibilityContext";

const CustomFooter = () => {
  const navigation = useNavigation();
  const iconSize = 28;
  // const { isFooterVisible } = useContext(FooterVisibilityContext);

  const springValues = {
    userProfile: useSharedValue(1),
    medicationScreen: useSharedValue(1),
    homeScreen: useSharedValue(1),
    journalScreen: useSharedValue(1),
    exercisesScreen: useSharedValue(1),
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
        {/* User Profile */}
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() =>
            navigateToScreen("UserProfile", springValues.userProfile)
          }
        >
          <Animated.View
            style={[
              styles.menuItemIcon,
              animatedStyle(springValues.userProfile),
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
