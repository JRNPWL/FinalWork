//   const scheduleNotificationsForReminders = (reminders, medicationName) => {
//     reminders.forEach((reminder, index) => {
//       const dateTime = new Date(reminder);
//       const notificationMessage = `Reminder ${
//         index + 1
//       }: Take ${medicationName} at ${dateTime.toLocaleString()}`;

//       PushNotification.localNotificationSchedule({
//         message: notificationMessage,
//         date: dateTime,
//       });
//     });
//   };

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
  faChevronRight,
  faDumbbell,
  faRunning,
  faBicycle,
} from "@fortawesome/free-solid-svg-icons";

const MedicationScreen = () => {
  const navigation = useNavigation();

  const [medicationData, setMedicationData] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigateToAddMedication = async () => {
    navigation.navigate("AddMedicationScreen");
  };

  useEffect(() => {
    const fetchMedications = async () => {
      try {
        const meds = await fetchMedicationData();
        setMedicationData(meds);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching medications:", error);
        setLoading(false);
      }
    };

    fetchMedications();
  }, []);

  const handleMedicationPress = (medication) => {
    navigation.navigate("MedicationDetailScreen", { medication });
  };

  const groupMedicationsByDate = (medications) => {
    return medications.reduce((acc, med) => {
      const date = new Date(med.date).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
      });

      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(med);
      return acc;
    }, {});
  };

  const groupedMedications = medicationData
    ? groupMedicationsByDate(medicationData)
    : {};
  const sortedDates = Object.keys(groupedMedications).sort(
    (a, b) => new Date(a) - new Date(b)
  );

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
      {sortedDates.length > 0 ? (
        sortedDates.map((date) => (
          <View key={date} style={styles.dateGroup}>
            <Text style={styles.dateText}>{date}</Text>
            {groupedMedications[date].map((medicationData, medIndex) => (
              <TouchableOpacity
                key={medIndex}
                style={styles.medicationContainer}
                onPress={() => handleMedicationPress(medicationData)}
              >
                <View style={styles.medicationContainer}>
                  <View style={styles.infoContainer}>
                    <View style={styles.iconContainer}>
                      <FontAwesomeIcon
                        icon={
                          medicationData.icon === "faDumbbell"
                            ? faDumbbell
                            : medicationData.icon === "faRunning"
                            ? faRunning
                            : faBicycle
                        }
                        size={64}
                        style={styles.icon}
                      />
                    </View>
                    <View style={styles.detailsContainer}>
                      <Text style={styles.label}>{medicationData.name}</Text>
                      <View style={styles.infoBottomContainer}>
                        <Text style={styles.text}>{medicationData.dosage}</Text>
                      </View>
                    </View>
                    <View style={styles.timeContainer}>
                      <Text style={styles.text}>{medicationData.time}</Text>
                      <FontAwesomeIcon
                        icon={faChevronRight}
                        size={15}
                        color="grey"
                      />
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ))
      ) : (
        <Text>No medication data available</Text>
      )}
    </View>
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
  dateGroup: {
    width: "90%",
    marginBottom: 20,
  },
  dateText: {
    marginLeft: "4%",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  medicationContainer: {
    alignItems: "center",
    width: "100%",
    marginBottom: 10,
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
    backgroundColor: "#F8F8F8",
    padding: 15,
    borderRadius: 15,
  },
  iconContainer: {
    width: "30%",
    alignItems: "center",
    justifyContent: "center",
  },
  detailsContainer: {
    justifyContent: "center",
    width: "40%",
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
  },
  timeText: {
    fontSize: 26,
  },
  text: {
    fontSize: 16,
  },
});

export default MedicationScreen;
