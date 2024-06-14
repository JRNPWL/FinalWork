import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";

const MedicationSnippet = ({ navigation, medications }) => {
  const navigateToMedicationScreen = () => {
    navigation.navigate("MedicationScreen");
  };

  const Icon = {
    Pill1: require("../assets/Pill1.png"),
    Pill2: require("../assets/Pill2.png"),
    Pill3: require("../assets/Pill3.png"),
    Pill4: require("../assets/Pill4.png"),
    Pill5: require("../assets/Pill5.png"),
    Pill6: require("../assets/Pill6.png"),
  };

  console.log(medications);

  if (!medications || medications.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Medication</Text>
        <View style={styles.alignContainer}>
          <View style={styles.noMedicationDetailsContainer}>
            <Text style={styles.noMedicationDataText}>
              No Medication Data Available
            </Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Medication</Text>
      <View style={styles.alignContainer}>
        <TouchableOpacity
          onPress={navigateToMedicationScreen}
          style={styles.medicationContainer}
        >
          {medications.slice(0, 3).map((medicationData, index) => (
            <View key={index} style={styles.medicationItem}>
              <View style={styles.infoContainer}>
                <View style={styles.iconContainer}>
                  <Image
                    source={Icon[medicationData.icon]}
                    style={styles.icon}
                  />
                </View>
                <View style={styles.detailsContainer}>
                  <Text style={styles.medName}>{medicationData.name}</Text>
                  <View style={styles.infoBottomContainer}>
                    <Text style={styles.text}>{medicationData.dosage}</Text>
                  </View>
                </View>
                <View style={styles.timeContainer}>
                  <Text style={styles.timeText}>
                    {new Date(medicationData.time).toLocaleTimeString("en-US", {
                      hour12: false,
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    marginBottom: 25,
    borderRadius: 10,
    width: "100%",
  },
  alignContainer: {
    alignItems: "center",
  },
  medicationContainer: {
    width: "90%",
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
    paddingBottom: 20,
    backgroundColor: "#F6F6F6",
  },
  medicationItem: {
    paddingTop: 20,
    paddingBottom: 20,
    width: "100%",
    borderBottomWidth: 1,
    borderColor: "lightgrey",
  },
  infoContainer: {
    flexDirection: "row",
    width: "100%",
  },
  iconContainer: {
    width: "30%",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    width: 64,
    height: 64,
  },
  detailsContainer: {
    justifyContent: "center",
    width: "40%",
  },
  infoBottomContainer: {
    flexDirection: "column",
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    width: "30%",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    paddingLeft: 20,
  },
  medName: {
    fontWeight: "bold",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 10,
  },
  timeText: {
    fontSize: 26,
    paddingRight: 20,
  },
  text: {
    fontSize: 16,
  },
  noMedicationDetailsContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "90%",
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
    paddingBottom: 20,
    backgroundColor: "#F6F6F6",
  },
  noMedicationDataText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "grey",
  },
});

export default MedicationSnippet;
