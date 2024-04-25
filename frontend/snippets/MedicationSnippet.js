// MedicationSnippet.js

import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const MedicationSnippet = ({ navigation, medications }) => {
  const navigateToMedicationScreen = () => {
    navigation.navigate("MedicationScreen");
  };

  return (
    <TouchableOpacity onPress={navigateToMedicationScreen}>
      <View style={styles.container}>
        <Text style={styles.title}>Medication</Text>
        {medications.slice(0, 3).map((medication, index) => (
          <View key={index} style={styles.medicationContainer}>
            <Text style={styles.medicationName}>{medication.name}</Text>
            <Text style={styles.text}>{medication.dosage}</Text>
            <Text style={styles.text}>{medication.frequency}</Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f0f0f0",
    // padding: 20,
    marginBottom: 40,
    borderRadius: 10,
    width: "100%",
  },
  medicationContainer: {
    // marginBottom: 10,
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
  medicationName: {
    fontWeight: "bold",
  },
});

export default MedicationSnippet;
