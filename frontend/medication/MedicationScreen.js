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
import * as Notifications from "expo-notifications";
import { fetchMedicationData } from "../services/dataService";

const MedicationScreen = () => {
  const navigation = useNavigation();

  const [medicationData, setMedicationData] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [loading, setLoading] = useState(true);
  const defaultProfilePhoto = require("../assets/Default_pfp.png");

  const navigateToAddMedication = async () => {
    navigation.navigate("AddMedicationScreen");
  };

  const scheduleNotificationsForReminders = (reminders, medicationName) => {
    reminders.forEach((reminder, index) => {
      const dateTime = new Date(reminder);
      const notificationMessage = `Reminder ${
        index + 1
      }: Take ${medicationName} at ${dateTime.toLocaleString()}`;

      PushNotification.localNotificationSchedule({
        message: notificationMessage,
        date: dateTime,
      });
    });
  };

  useEffect(() => {
    // const fetchMedicationData = async () => {
    //   try {
    //     const userId = await getUserId();

    //     // Extra Check, routes are protected. User schouldnt even be able to see the page without already being logged in.
    //     if (!userId) {
    //       throw new Error("User is not logged in");
    //     }

    //     const apiUrl = `http://192.168.0.119:3000/api/medications/${userId}`;

    //     const response = await axios.get(apiUrl);
    //     // console.log(response);
    //     // setMedicationData(response.data);
    //     // const data = await response.json();
    //     if (Array.isArray(response.data)) {
    //       setMedicationData(response.data); // Set medicationData to the array of medication objects
    //       console.log(response.data);

    //       response.data.forEach((medication) => {
    //         console.log(medication);
    //         scheduleNotificationsForReminders(
    //           medication.reminders,
    //           medication.name
    //         );
    //       });
    //     }

    //     setLoading(false);
    //   } catch (error) {
    //     console.error("Error fetching user data:", error);
    //     setLoading(false);
    //   }
    // };

    // fetchMedicationData();

    // const fetchUserProfilePic = async () => {
    //   try {
    //     const userId = await getUserId();

    //     // Extra Check, routes are protected. User schouldnt even be able to see the page without already being logged in.
    //     if (!userId) {
    //       throw new Error("User is not logged in");
    //     }

    //     const photoApiUrl = `http://localhost:3000/api/users/${userId}/profilePicture`;
    //     const response = await axios.get(photoApiUrl);
    //     setProfilePicture(photoApiUrl);
    //   } catch {
    //     console.error("Error fetching user profile picture:", error);
    //   }
    // };

    // fetchUserProfilePic();
    const fetchMedications = async () => {
      try {
        const meds = await fetchMedicationData();
        console.log(meds);
        setMedicationData(meds);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching medications:", error);
      }
    };

    fetchMedications();
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
      {medicationData.length > 0 ? (
        medicationData.map((medicationData, index) => (
          <View key={index} style={styles.medicationContainer}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.text}>{medicationData.name}</Text>

            <Text style={styles.label}>Dosage:</Text>
            <Text style={styles.text}>{medicationData.dosage}</Text>

            <Text style={styles.label}>Frequency:</Text>
            <Text style={styles.text}>{medicationData.frequency}</Text>

            <Text style={styles.label}>Time:</Text>
            <Text style={styles.text}>{medicationData.time}</Text>

            <Text style={styles.label}>Reminders:</Text>
            {/* <View style={styles.reminderContainer}>
        {medicationData.reminders.map((reminder, index) => (
          <View key={index} style={styles.reminderItem}>
            <Text>Date: {reminder.date}</Text>
            <Text>Time: {reminder.time}</Text>
          </View>
        ))}
      </View> */}
          </View>
        ))
      ) : (
        <Text>No medication data available</Text>
        // <Text style={styles.error}>Error: Failed to load user data.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  reminderContainer: {
    marginTop: 10,
  },
  reminderItem: {
    marginBottom: 10,
  },
});

export default MedicationScreen;
