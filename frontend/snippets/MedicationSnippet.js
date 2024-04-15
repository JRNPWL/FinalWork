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
            <Text>{medication.dosage}</Text>
            <Text>{medication.frequency}</Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f0f0f0",
    padding: 20,
    marginBottom: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  medicationContainer: {
    marginBottom: 10,
  },
  medicationName: {
    fontWeight: "bold",
  },
});

export default MedicationSnippet;
