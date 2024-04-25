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
    <TouchableOpacity onPress={navigateToJournalScreen}>
      <View style={styles.container}>
        <Text style={styles.title}>Profile</Text>
        <View style={styles.gridContainer}>
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
            {/* <View style={styles.gridItem}>
              <Text style={styles.label}>Email:</Text>
              <Text style={styles.text}>{userData.email}</Text>
            </View> */}
            <View style={styles.gridItem}>
              <Text style={styles.label}>Age:</Text>
              <Text style={styles.text}>{userData.age}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.label}>DOB:</Text>
              <Text style={styles.text}>{userData.sex}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.label}>Sex:</Text>
              <Text style={styles.text}>{userData.sex}</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f0f0f0",
    marginBottom: 40,
    borderRadius: 10,
    width: "100%",
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: "cover",
    borderRadius: 50, // Half of width and height
    backgroundColor: "grey",
  },
  gridContainer: {
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
    backgroundColor: "lightgrey",
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "50%",
  },
  personlInfo: {
    width: "50%",
    flexDirection: "column",
    flexWrap: "wrap",
    margin: "auto",
    paddingLeft: 10,
  },
  gridItem: {
    flexDirection: "row",
  },
  title: {
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
