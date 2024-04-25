import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  Button,
  Image,
} from "react-native";
import { getUserId } from "../services/authService";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import CustomHeader from "../snippets/CustomHeader";
import CustomFooter from "../snippets/CustomFooter";

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
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        {/* <CustomHeader
        title="Home"
        iconName="menu"
        onMenuPress={handleMenuPress}
      /> */}
        {userData ? (
          <>
            <View style={styles.topContainer}>
              <TouchableOpacity
                onPress={navigateToEditProfile}
                style={styles.text}
              >
                <Text style={styles.editProfile}>Edit Profile</Text>
              </TouchableOpacity>
              <Image
                style={styles.image}
                source={
                  profilePicture ? { uri: profilePicture } : defaultProfilePhoto
                }
              />
            </View>
            <View style={styles.gridContainer}>
              <Text style={styles.perTitle}>Personal Info</Text>
              <View style={styles.personlInfo}>
                <View style={styles.gridItem}>
                  <Text style={styles.label}>Name:</Text>
                  <Text style={styles.text}>{userData.name}</Text>
                </View>
                <View style={styles.gridItem}>
                  <Text style={styles.label}>Email:</Text>
                  <Text style={styles.text}>{userData.email}</Text>
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
              <Text style={styles.medTitle}>Medical Info</Text>
              <View style={styles.medicalInfo}>
                <View style={styles.gridItem}>
                  <Text style={styles.label}>Blood Type:</Text>
                  <Text style={styles.text}>{userData.bloodType}</Text>
                </View>
                <View style={styles.gridItem}>
                  <Text style={styles.label}>Blood Type:</Text>
                  <Text style={styles.text}>{userData.bloodType}</Text>
                </View>
                <View style={styles.gridItem}>
                  <Text style={styles.label}>Blood Type:</Text>
                  <Text style={styles.text}>{userData.bloodType}</Text>
                </View>
                <View style={styles.gridItem}>
                  <Text style={styles.label}>Blood Type:</Text>
                  <Text style={styles.text}>{userData.bloodType}</Text>
                </View>
                <View style={styles.medHistory}>
                  <Text style={styles.label}>Medical History:</Text>
                  <View>
                    {userData.medicalHistory.map(
                      (medicalHistoryItem, index) => (
                        <View key={index}>
                          <Text
                            style={styles.text}
                          >{`\u2022 ${medicalHistoryItem}`}</Text>
                        </View>
                      )
                    )}
                  </View>
                </View>
              </View>
            </View>

            {/* <Button title="Edit Profile" onPress={navigateToEditProfile} /> */}
          </>
        ) : (
          <Text style={styles.error}>Error: Failed to load user data.</Text>
        )}
        {/* <CustomFooter /> */}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    width: "100%",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  topContainer: {
    alignItems: "center",
    flexDirection: "column",
    padding: 10,
    marginTop: 10,
    marginBottom: 10,
  },
  editProfile: {
    marginBottom: 20,
    color: "grey",
    fontWeight: "bold",
  },
  image: {
    width: 150,
    height: 150,
    resizeMode: "cover",
    borderRadius: 75,
    backgroundColor: "grey",
    marginBottom: "2vh",
  },
  gridContainer: {
    flexDirection: "column",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: 10,
    width: "95%",
  },
  perTitle: {
    fontSize: 22,
    fontWeight: "bold",
    paddingBottom: 10,
    paddingLeft: 20,
    color: "white",
    textShadowColor: "black",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  medTitle: {
    fontSize: 22,
    fontWeight: "bold",
    paddingBottom: 10,
    paddingLeft: 20,
    color: "white",
    textShadowColor: "black",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  personlInfo: {
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
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 40,
    marginBottom: 20,
    backgroundColor: "lightgrey",
  },
  medicalInfo: {
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
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 40,
    marginBottom: 30,
    backgroundColor: "lightgrey",
  },
  gridItem: {
    flexDirection: "row",
    margin: "auto",
    width: "50%",
    marginBottom: 10,
  },
  medHistory: {
    flexDirection: "row",
    margin: "auto",
    width: "50%",
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 10,
  },
  text: {
    fontSize: 16,
  },
  error: {
    fontSize: 16,
    color: "red",
  },
});
export default UserProfile;
