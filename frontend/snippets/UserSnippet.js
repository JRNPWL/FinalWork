import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { getUserId } from "../services/authService";
import axios from "axios";

const UserSnippet = ({ navigation, userData }) => {
  const [profilePicture, setProfilePicture] = useState(null);
  const defaultProfilePhoto = require("../assets/Default_pfp.png");

  useEffect(() => {
    const fetchUserProfilePic = async () => {
      try {
        const userId = await getUserId();

        // Extra Check, routes are protected. User schouldnt even be able to see the page without already being logged in.
        if (!userId) {
          throw new Error("User is not logged in");
        }

        const photoApiUrl = `http://192.168.0.119:3000/api/users/${userId}/profilePicture`;
        const response = await axios.get(photoApiUrl);
        setProfilePicture(photoApiUrl);
      } catch {
        // console.error("Error fetching user profile picture:", error);
      }
    };

    fetchUserProfilePic();
  }, []);

  const navigateToJournalScreen = () => {
    navigation.navigate("UserProfile");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>Profile</Text>
      <View style={styles.alignContainer}>
        <TouchableOpacity
          onPress={navigateToJournalScreen}
          style={styles.gridContainer}
        >
          {/* <View style={styles.gridContainer}> */}
          <View style={styles.imageContainer}>
            <Image
              style={styles.image}
              source={
                profilePicture ? { uri: profilePicture } : defaultProfilePhoto
              }
            />
          </View>
          <View style={styles.personlInfo}>
            <View style={styles.gridItem}>
              <Text style={styles.label}>Name:</Text>
              <Text style={styles.text}>{userData.name}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.label}>DOB:</Text>
              <Text style={styles.text}>11/09/2001</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.label}>Age:</Text>
              <Text style={styles.text}>{userData.age}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.label}>Sex:</Text>
              <Text style={styles.text}>{userData.sex}</Text>
            </View>
          </View>
          {/* </View> */}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // backgroundColor: "#f0f0f0",
    backgroundColor: "white",
    marginBottom: 25,
    borderRadius: 10,
    width: "100%",
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: "cover",
    borderRadius: 50, // Half of width and height
    backgroundColor: "lightgrey",
  },
  alignContainer: {
    alignItems: "center",
  },
  gridContainer: {
    width: "90%",
    flexDirection: "row",
    flexWrap: "wrap",
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 6,
    borderRadius: 25,
    padding: 10,
    paddingTop: 15,
    paddingBottom: 15,
    // backgroundColor: "lightgrey",
    // backgroundColor: "#F2f2f2",
    backgroundColor: "#F6F6F6",
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "40%",
  },
  personlInfo: {
    // height: "100%",
    width: "60%",
    // padding: 10,
    // paddingTop: 15,
    // paddingBottom: 15,
    paddingLeft: 15,
    flexDirection: "column",
    flexWrap: "wrap",
    margin: "auto",
  },
  gridItem: {
    flexDirection: "row",
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    paddingLeft: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 10,
  },
  text: {
    fontSize: 16,
  },
});

export default UserSnippet;
