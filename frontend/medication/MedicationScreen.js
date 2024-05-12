import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  TouchableOpacity,
} from "react-native";
import { getUserId } from "../services/authService";
import { useNavigation } from "@react-navigation/native";
import * as Notifications from "expo-notifications";
import { fetchMedicationData } from "../services/dataService";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faPlus,
  faPills,
  faArrowRight,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

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
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Text style={styles.pageTitle}>Medication</Text>
        <TouchableOpacity
          style={styles.addMeds}
          onPress={navigateToAddMedication}
        >
          <Text style={styles.addMedsText}>Add Medication</Text>
          <FontAwesomeIcon icon={faPlus} size={11} color="black" />
        </TouchableOpacity>
      </View>
      {medicationData.length > 0 ? (
        medicationData.map((medicationData, index) => (
          <View key={index} style={styles.medicationContainer}>
            <View style={styles.infoContainer}>
              <View style={styles.iconContainer}>
                <FontAwesomeIcon icon={faPills} size={64} color="black" />
              </View>
              <View style={styles.detailsContainer}>
                <Text style={styles.label}>{medicationData.name}</Text>
                <View style={styles.infoBottomContainer}>
                  <Text style={styles.text}>{medicationData.dosage}</Text>
                  {/* <Text style={styles.text}>{medicationData.frequency}, </Text> */}
                </View>
              </View>
              <View style={styles.timeContainer}>
                <Text style={styles.timeText}>{medicationData.time}</Text>
                <FontAwesomeIcon icon={faChevronRight} size={15} color="grey" />
              </View>
            </View>
          </View>
        ))
      ) : (
        <Text>No medication data available</Text>
      )}
    </View>
    // <View style={styles.container}>
    //   {medicationData.length > 0 ? (
    //     medicationData.map((medicationData, index) => (
    //       <View key={index} style={styles.medicationContainer}>
    //         <View style={styles.medicationContainer}></View>

    //         <View style={styles.infoContainer}>
    //           {/* <Text style={styles.label}>Name:</Text> */}
    //           <Text style={styles.text}>{medicationData.name}</Text>

    //           <View style={styles.infoBottomContainer}>
    //             {/* <Text style={styles.label}>Dosage:</Text> */}
    //             <Text style={styles.text}>{medicationData.dosage}, </Text>

    //             {/* <Text style={styles.label}>Frequency:</Text> */}
    //             <Text style={styles.text}>{medicationData.frequency}, </Text>

    //             {/* <Text style={styles.label}>Time:</Text> */}
    //             <Text style={styles.text}>{medicationData.time}</Text>
    //           </View>

    //           {/* <Text style={styles.label}>Reminders:</Text>
    //           <View style={styles.reminderContainer}>
    //             {medicationData.reminders.map((reminder, index) => (
    //               <View key={index} style={styles.reminderItem}>
    //                 <Text>Date: {reminder.date}</Text>
    //                 <Text>Time: {reminder.time}</Text>
    //               </View>
    //             ))}
    //           </View> */}
    //         </View>
    //       </View>
    //     ))
    //   ) : (
    //     <Text>No medication data available</Text>
    //     // <Text style={styles.error}>Error: Failed to load user data.</Text>
    //   )}
    //   <TouchableOpacity onPress={navigateToAddMedication}>
    //     <Text>Add Medication</Text>
    //   </TouchableOpacity>
    // </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    paddingBottom: 80, // Keep same number as footer+20
    paddingTop: 10, // Keep same number as header+20
    backgroundColor: "white",
    paddingLeft: 0,
    marginLeft: 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  topContainer: {
    width: "90%",
    marginLeft: "7%",
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  addMeds: {
    flexDirection: "row",
    marginBottom: 20,
    alignItems: "center",
  },
  addMedsText: {
    fontSize: 16,
    marginRight: 3,
  },
  medicationContainer: {
    alignItems: "center",
    width: "90%",
  },
  infoContainer: {
    width: "100%",
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 6,
    // backgroundColor: "lightgrey",
    // backgroundColor: "#F2f2f2",
    backgroundColor: "#F8F8F8",
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
  },
  iconContainer: {
    width: "30%",
    alignItems: "center",
    justifyContent: "center",
  },
  detailsContainer: {
    justifyContent: "center",
    width: "40%",
    // marginLeft: 10,
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "right",
    width: "30%",
  },
  infoBottomContainer: {
    flexDirection: "column",
  },
  label: {
    fontSize: 17,
    fontWeight: "bold",
    // marginBottom: 5,
  },
  timeText: {
    fontSize: 26,
  },
  text: {
    fontSize: 16,
  },
  reminderContainer: {
    marginTop: 10,
  },
  reminderItem: {
    marginBottom: 10,
  },
});

export default MedicationScreen;
