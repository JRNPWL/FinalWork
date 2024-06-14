import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { fetchMedicationData } from "../services/dataService";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faPlus,
  faChevronRight,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { useFocusEffect } from "@react-navigation/native";
import { updateMedicationTaken } from "../services/dataService";

const CircleButton = ({
  medTaken,
  medicationId,
  medicationDate,
  medicationTime,
  onPress,
}) => {
  const [ticked, setTicked] = useState(medTaken);

  const handlePress = async () => {
    const currentTime = new Date();
    const medicationDateObj = new Date(medicationDate);
    const medicationTimeObj = new Date(medicationTime);

    if (
      currentTime < medicationDateObj ||
      (currentTime.toDateString() === medicationDateObj.toDateString() &&
        currentTime < medicationTimeObj)
    ) {
      // Medication time is in the future, show alert
      Alert.alert(
        "Medication Time Alert",
        "It's not yet time to take this medication. Do you want to proceed?",
        [
          {
            text: "Proceed",
            onPress: () => {
              const updatedTicked = !ticked;
              setTicked(updatedTicked);

              onPress(
                medicationId,
                medicationDate,
                medicationTime,
                updatedTicked
              );
            },
          },
          {
            text: "Cancel",
            style: "cancel",
            onPress: () => {
              // Do nothing if cancelled
            },
          },
        ],
        { cancelable: false }
      );
    } else {
      const updatedTicked = !ticked;
      setTicked(updatedTicked);
      onPress(medicationId, medicationDate, medicationTime, updatedTicked);
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.circleButton}>
      {ticked ? (
        <FontAwesomeIcon icon={faCheck} size={30} color="#4facfe" />
      ) : (
        <View
          style={{
            width: 30,
            height: 30,
            borderRadius: 15,
            borderWidth: 1,
            borderColor: "#4facfe",
          }}
        />
      )}
    </TouchableOpacity>
  );
};

const MedicationScreen = () => {
  const navigation = useNavigation();
  const [medicationData, setMedicationData] = useState(null);
  const [loading, setLoading] = useState(true);

  const Icon = {
    Pill1: require("../assets/Pill1.png"),
    Pill2: require("../assets/Pill2.png"),
    Pill3: require("../assets/Pill3.png"),
    Pill4: require("../assets/Pill4.png"),
    Pill5: require("../assets/Pill5.png"),
    Pill6: require("../assets/Pill6.png"),
  };

  // Navigation
  const navigateToAddMedication = async () => {
    navigation.navigate("AddMedicationScreen");
  };

  const handleMedicationPress = (medication) => {
    navigation.navigate("MedicationDetailScreen", { medication });
  };

  // Fetching Data
  const fetchMedications = async () => {
    try {
      const meds = await fetchMedicationData();
      console.log(meds);
      setMedicationData(meds);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching medications:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedications();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchMedications();
    }, [])
  );

  // Handle medicationTaken
  const handleCirclePress = async (
    medicationId,
    medicationDate,
    medicationTime,
    updatedTicked
  ) => {
    try {
      console.log("Medication ID:", medicationId);
      console.log("Medication Date:", medicationDate);
      console.log("Medication Time:", medicationTime);
      console.log("Updated Ticked:", updatedTicked);

      await updateMedicationTaken(medicationId, updatedTicked);
      console.log(`Medication taken status updated for ID: ${medicationId}`);

      fetchMedications();
    } catch (error) {
      console.error("Failed to update medication:", error);
    }
  };

  // Group Medications By Date
  const groupMedicationsByDate = (medications) => {
    return medications.reduce((acc, med) => {
      const date = new Date(med.date).toISOString().slice(0, 10);
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

  const sortedDates = Object.keys(groupedMedications).sort((a, b) => {
    const dateA = new Date(a);
    const dateB = new Date(b);
    // Compare years
    if (dateA.getFullYear() !== dateB.getFullYear()) {
      return dateB.getFullYear() - dateA.getFullYear();
    }
    // Compare months
    if (dateA.getMonth() !== dateB.getMonth()) {
      return dateB.getMonth() - dateA.getMonth();
    }
    // Compare days
    return dateB.getDate() - dateA.getDate();
  });

  // Loading
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
      <ScrollView
        contentContainerStyle={{
          justifyContent: "center",
          width: "100%",
          paddingLeft: 10,
          paddingRight: 10,
        }}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        {sortedDates.length > 0 ? (
          sortedDates.map((date) => (
            <View key={date} style={styles.dateGroup}>
              <Text style={styles.dateText}>
                {new Date(date).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                })}
              </Text>
              {groupedMedications[date].map((medicationData, medIndex) => (
                <TouchableOpacity
                  key={medIndex}
                  style={styles.medicationContainerButton}
                  onPress={() => handleMedicationPress(medicationData)}
                >
                  <View style={styles.medicationContainer}>
                    <View style={styles.infoContainer}>
                      <View style={styles.iconContainer}>
                        <Image
                          source={Icon[medicationData.icon]}
                          style={styles.icon}
                        />
                      </View>
                      <View style={styles.detailsContainer}>
                        <Text style={styles.label}>{medicationData.name}</Text>
                        <View style={styles.infoBottomContainer}>
                          <Text style={styles.text}>
                            {medicationData.dosage}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.timeContainer}>
                        <Text style={styles.timeText}>
                          {new Date(medicationData.time).toLocaleTimeString(
                            "en-US",
                            {
                              hour12: false,
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </Text>
                        <CircleButton
                          medTaken={medicationData.medicationTaken}
                          medicationId={medicationData.medicationId}
                          medicationDate={medicationData.date}
                          medicationTime={medicationData.time}
                          onPress={handleCirclePress}
                        />
                        {/* <FontAwesomeIcon
                          icon={faChevronRight}
                          size={15}
                          color="grey"
                        /> */}
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
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    paddingBottom: 65, // Keep same number as footer+20
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
    width: "95%",
  },
  dateText: {
    marginLeft: "4%",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  medicationContainerButton: {
    alignItems: "center",
    width: "100%",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 6,
    backgroundColor: "#F8F8F8",
    borderRadius: 15,
  },
  medicationContainer: {
    alignItems: "center",
    width: "100%",
    marginBottom: 10,
  },
  infoContainer: {
    width: "100%",
    flexDirection: "row",
    padding: 15,
  },
  iconContainer: {
    width: "25%",
    // alignItems: "center",
    // justifyContent: "center",
  },
  icon: {
    width: 64,
    height: 64,
  },
  detailsContainer: {
    justifyContent: "center",
    alignItems: "flex-start",
    width: "40%",
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    width: "35%",
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
  circleButton: {
    paddingLeft: 5,
    paddingRight: 5,
  },
});

export default MedicationScreen;
