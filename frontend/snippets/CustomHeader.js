import React, { useEffect, useContext } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faUser, faCircleQuestion } from "@fortawesome/free-regular-svg-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

const CustomHeader = () => {
  const navigation = useNavigation();
  const iconSize = 28;

  const springValues = {
    userProfile: useSharedValue(1),
    AboutScreen: useSharedValue(1),
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
              icon={faUser}
              size={iconSize}
              style={styles.menuItemIcon}
            />
          </Animated.View>
        </TouchableOpacity>

        {/* Medication Screen */}
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() =>
            navigateToScreen("AboutScreen", springValues.AboutScreen)
          }
        >
          <Animated.View
            style={[
              styles.menuItemIcon,
              animatedStyle(springValues.AboutScreen),
            ]}
          >
            {/* <FontAwesomeIcon
              icon={faCircleQuestion}
              size={iconSize}
              style={styles.menuItemIcon}
            /> */}
          </Animated.View>
        </TouchableOpacity>
      </View>
    </View>
    // )
  );
};

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: "lightgrey",
  },
  gridContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: 60,
    paddingLeft: 20,
    paddingRight: 20,
    // backgroundColor: "#4facfe",
  },
  menuItem: {
    alignItems: "center",
    justifyContent: "center",
  },
  menuItemIcon: {
    color: "black",
  },
});

export default CustomHeader;
