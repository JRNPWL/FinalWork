import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";

const ExerciseSnippet = ({ navigation, exercises }) => {
  const navigateToMedicationScreen = () => {
    navigation.navigate("ExercisesScreen");
  };

  const Icon = {
    chest: require("../assets/chest.png"),
    back: require("../assets/back.png"),
    arm: require("../assets/arm.png"),
    leg: require("../assets/leg.png"),
  };

  if (!exercises || exercises.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.pageTitle}>Exercises</Text>
        <View style={styles.alignContainer}>
          <View style={styles.noExerciseDetailsContainer}>
            <Text style={styles.noExerciseDataText}>
              No Exercise Data Available
            </Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>Exercises</Text>
      <View style={styles.alignContainer}>
        <TouchableOpacity
          onPress={navigateToMedicationScreen}
          style={styles.medicationContainer}
        >
          {exercises.slice(0, 3).map((exerciseData, index) => (
            <View key={index} style={styles.exerciseItem}>
              <View style={styles.infoContainer}>
                <View style={styles.iconContainer}>
                  <Image source={Icon[exerciseData.icon]} style={styles.icon} />
                </View>
                <View style={styles.centerDetailsContainer}>
                  <View style={styles.detailsContainer}>
                    <Text style={styles.title}>{exerciseData.name}</Text>

                    <View style={styles.detailItem}>
                      <Text style={styles.label}>Sets:</Text>
                      <Text style={styles.text}>{exerciseData.sets}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Text style={styles.label}>Reps:</Text>
                      <Text style={styles.text}>{exerciseData.reps}</Text>
                    </View>
                  </View>
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
  exerciseItem: {
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
    width: "50%",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    width: 64,
    height: 64,
  },
  centerDetailsContainer: {
    width: "50%",
  },
  detailsContainer: {
    justifyContent: "center",
  },
  detailItem: {
    flexDirection: "row",
  },
  infoBottomContainer: {
    flexDirection: "column",
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "right",
    width: "30%",
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    paddingLeft: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    // marginBottom: 10,
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
  },
  text: {
    fontSize: 16,
  },
  medicationName: {
    fontWeight: "bold",
  },
  noExerciseDetailsContainer: {
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
  noExerciseDataText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "grey",
  },
});

export default ExerciseSnippet;
