// MedicationSnippet.js

import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faPlus, faPills } from "@fortawesome/free-solid-svg-icons";

const MedicationSnippet = ({ navigation, medications }) => {
  const navigateToMedicationScreen = () => {
    navigation.navigate("MedicationScreen");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Medication</Text>
      {/* <View style={styles.medicationContainer}> */}
      <View style={styles.alignContainer}>
        <TouchableOpacity
          onPress={navigateToMedicationScreen}
          style={styles.medicationContainer}
        >
          {medications.slice(0, 3).map((medicationData, index) => (
            <View key={index} style={styles.medicationItem}>
              <View style={styles.infoContainer}>
                <View style={styles.iconContainer}>
                  <FontAwesomeIcon icon={faPills} size={64} color="black" />
                </View>
                <View style={styles.detailsContainer}>
                  <Text style={styles.medName}>{medicationData.name}</Text>
                  <View style={styles.infoBottomContainer}>
                    <Text style={styles.text}>{medicationData.dosage}, </Text>
                    {/* <Text style={styles.text}>{medicationData.frequency}, </Text> */}
                    <Text style={styles.text}>{medicationData.time}</Text>
                  </View>
                </View>
              </View>
            </View>
          ))}
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
    // paddingTop: 15,
    paddingBottom: 20,
    // backgroundColor: "lightgrey",
    // backgroundColor: "#F2f2f2",
    backgroundColor: "#F6F6F6",
  },
  medicationItem: {
    paddingTop: 20,
    paddingBottom: 20,
    width: "100%",
    // marginBottom: 10,
    // borderRadius: 25,
    // borderWidth: 1,
    borderBottomWidth: 1,
    borderColor: "lightgrey",
  },
  infoContainer: {
    flexDirection: "row",
    width: "100%",
  },
  iconContainer: {
    width: "45%",
    alignItems: "center",
    justifyContent: "center",
  },
  detailsContainer: {
    width: "55%",
  },
  infoBottomContainer: {
    flexDirection: "column",
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
  text: {
    fontSize: 16,
  },
  medicationName: {
    fontWeight: "bold",
  },
});

export default MedicationSnippet;
