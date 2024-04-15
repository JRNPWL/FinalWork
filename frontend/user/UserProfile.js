import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  TextInput,
  Button,
  Image,
} from "react-native";
import { getUserId } from "../services/authService";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import CustomHeader from "../snippets/CustomHeader";

const UserProfile = () => {
  const navigation = useNavigation();

  const [userData, setUserData] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [loading, setLoading] = useState(true);
  const defaultProfilePhoto = require("../assets/Default_pfp.png");

  const handleMenuPress = () => {
    navigation.push("MenuScreen");
  };

  const navigateToEditProfile = async () => {
    navigation.navigate("EditUserProfile");
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = await getUserId();

        // Extra Check, routes are protected. User schouldnt even be able to see the page without already being logged in.
        if (!userId) {
          throw new Error("User is not logged in");
        }

        const apiUrl = `http://192.168.0.119:3000/api/users/${userId}`;

        const response = await axios.get(apiUrl);
        // console.log(response);
        setUserData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false);
      }
    };

    fetchUserData();

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
        console.error("Error fetching user profile picture:", error);
      }
    };

    fetchUserProfilePic();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CustomHeader
        title="Home"
        iconName="menu"
        onMenuPress={handleMenuPress}
      />
      {userData ? (
        <>
          <Image
            style={styles.image}
            source={
              profilePicture ? { uri: profilePicture } : defaultProfilePhoto
            }
          />
          <Text style={styles.label}>Name</Text>
          <Text style={styles.text}>{userData.name}</Text>

          <Text style={styles.label}>Email</Text>
          <Text style={styles.text}>{userData.email}</Text>
          <Button title="Edit Profile" onPress={navigateToEditProfile} />
        </>
      ) : (
        <Text style={styles.error}>Error: Failed to load user data.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  text: {
    fontSize: 16,
    marginBottom: 20,
  },
  image: {
    width: 150,
    height: 150,
    // width: "20vh",
    // height: "20vh",
    resizeMode: "cover",
    borderRadius: 75,
    backgroundColor: "grey",
    marginTop: "5vh",
    marginBottom: "5vh",
    // paddingBottom: 20,
  },
  error: {
    fontSize: 16,
    color: "red",
  },
});

export default UserProfile;
