import React, { useState, useEffect, useCallback } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";
import { getUserId, logout } from "../services/authService";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import axios from "axios";

const UserProfile = ({ onLogoutSuccess }) => {
  const navigation = useNavigation();

  const [userData, setUserData] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [loading, setLoading] = useState(true);
  const defaultProfilePhoto = require("../assets/Default_pfp.png");

  const handleLogout = async () => {
    logout();
    onLogoutSuccess();
  };

  const navigateToEditProfile = async () => {
    navigation.navigate("EditUserProfile");
  };

  const fetchUserProfilePic = async () => {
    try {
      const userId = await getUserId();

      // Extra Check, routes are protected. User schouldnt even be able to see the page without already being logged in.
      if (!userId) {
        throw new Error("User is not logged in");
      }

      const photoApiUrl = `http://192.168.0.119:3000/api/users/${userId}/profilePicture`;
      // const response = await axios.get(photoApiUrl);
      setProfilePicture(photoApiUrl);
    } catch {
      console.error("Error fetching user profile picture:", error);
    }
  };

  const fetchUserData = async () => {
    try {
      const userId = await getUserId();

      if (!userId) {
        throw new Error("User is not logged in");
      }

      const apiUrl = `http://192.168.0.119:3000/api/users/${userId}`;

      const response = await axios.get(apiUrl);
      console.log(response.data);
      setUserData(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfilePic();
    fetchUserData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchUserProfilePic();

      fetchUserData();
    }, [])
  );

  const formatDob = (dob) => {
    if (!dob) return "";

    const dateParts = dob.split("-");
    const year = dateParts[0];
    const month = dateParts[1];
    const day = dateParts[2];

    return `${day}/${month}/${year}`;
  };

  const calculateAge = (dob) => {
    if (!dob) return "";

    const dobDate = new Date(dob);
    const today = new Date();

    let age = today.getFullYear() - dobDate.getFullYear();
    const monthDiff = today.getMonth() - dobDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < dobDate.getDate())
    ) {
      age--;
    }

    return age;
  };

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
        <View style={styles.topContainer}>
          <TouchableOpacity onPress={navigateToEditProfile} style={styles.text}>
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
            <View style={styles.infoGridItem}>
              <Text style={styles.label}>Name:</Text>
              <Text style={styles.text}>
                {userData?.name || "edit profile to add"}
              </Text>
            </View>
            <View style={styles.infoGridItem}>
              <Text style={styles.label}>DOB:</Text>
              <Text style={styles.text}>
                {userData?.dob
                  ? formatDob(userData.dob)
                  : "edit profile to add"}
              </Text>
            </View>
            <View style={styles.infoGridItem}>
              <Text style={styles.label}>Age:</Text>
              <Text style={styles.text}>
                {userData?.dob
                  ? calculateAge(userData.dob)
                  : "edit profile to add"}
              </Text>
            </View>
            <View style={styles.infoGridItem}>
              <Text style={styles.label}>Sex:</Text>
              <Text style={styles.text}>
                {userData?.sex || "edit profile to add"}
              </Text>
            </View>
          </View>
          <Text style={styles.medTitle}>Medical Info</Text>
          <View style={styles.medicalInfo}>
            <View style={styles.medGridItemRow}>
              <Text style={styles.label}>Blood Type:</Text>
              <Text style={styles.text}>
                {userData?.bloodType || "edit profile to add"}
              </Text>
            </View>
            <View style={styles.medGridItemRow}>
              <Text style={styles.label}>Doctor:</Text>
              <Text style={styles.text}>
                {userData?.doctor
                  ? `Dr. ${userData.doctor}`
                  : "edit profile to add"}
              </Text>
            </View>
            <View style={styles.medicalSubInfo}>
              <View style={styles.medGridItem}>
                <Text style={styles.medGridItemLabel}>Emergency Contact:</Text>
                <Text style={styles.text}>
                  {userData?.emergencyContact
                    ? `+32 ${userData.emergencyContact}`
                    : "edit profile to add"}
                </Text>
              </View>
              <View style={styles.medGridItem}>
                <Text style={styles.medGridItemLabel}>Medical History:</Text>
                <View>
                  {userData?.medicalHistory &&
                  userData.medicalHistory.length > 0 ? (
                    userData.medicalHistory.map((medicalHistoryItem, index) => (
                      <View key={index}>
                        <Text
                          style={styles.text}
                        >{`\u2022 ${medicalHistoryItem}`}</Text>
                      </View>
                    ))
                  ) : (
                    <Text style={styles.text}>edit profile to add</Text>
                  )}
                </View>
              </View>
            </View>
          </View>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.text}>
          <Text style={styles.editProfile}>logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    width: "100%",
    paddingBottom: 80, // Keep same number as footer+20
    backgroundColor: "white",
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
    backgroundColor: "lightgrey",
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
    color: "black",
  },
  medTitle: {
    fontSize: 22,
    fontWeight: "bold",
    paddingBottom: 10,
    paddingLeft: 20,
    color: "black",
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
    backgroundColor: "#F8f8f8",
  },
  medicalInfo: {
    flexDirection: "column",
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
    backgroundColor: "#F8f8f8",
  },
  medicalSubInfo: {
    flexDirection: "column",
    width: "100%",
    marginBottom: 10,
  },
  infoGridItem: {
    flexDirection: "row",
    margin: "auto",
    width: "50%",
    marginBottom: 15,
  },
  medGridItemRow: {
    flexDirection: "row",
    marginBottom: 15,
  },
  medGridItem: {
    flexDirection: "column",
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 10,
  },
  medGridItemLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
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
