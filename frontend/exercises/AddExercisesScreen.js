import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faDumbbell,
  faRunning,
  faBicycle,
  faPlus,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import exercisesData from "./exercises.json";
import { addExercise } from "../services/dataService";
import { getUserId } from "../services/authService";

const AddExerciseScreen = ({ navigation }) => {
  const [exerciseOptions, setExerciseOptions] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [loading, setLoading] = useState(true);

  const Icon = {
    chest: require("../assets/chest.png"),
    back: require("../assets/back.png"),
    arm: require("../assets/arm.png"),
    leg: require("../assets/leg.png"),
  };

  useEffect(() => {
    setExerciseOptions(exercisesData);
    setLoading(false);
  }, []);

  const handleSelectExercise = (exercise) => {
    setSelectedExercise(exercise);
  };

  const handleSubmit = async () => {
    try {
      const userId = await getUserId();
      const { name, sets, reps, description, icon } = selectedExercise;
      const response = await addExercise(
        userId,
        name,
        sets,
        reps,
        description,
        icon
      );
      console.log("Exercise added successfully:", response.data);
      navigation.goBack();
    } catch (error) {
      console.error("Error adding exercise:", error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <FontAwesomeIcon icon={faArrowLeft} size={20} color="black" />
      </TouchableOpacity>

      <View style={styles.contentContainer}>
        <Text style={styles.title}>Select an Exercise to Add</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <FlatList
            data={exerciseOptions}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.exerciseItem,
                  selectedExercise?.id === item.id &&
                    styles.selectedExerciseItem,
                ]}
                onPress={() => handleSelectExercise(item)}
              >
                <Image source={Icon[item.icon]} style={styles.icon} />
                <View style={styles.exerciseDetails}>
                  <Text style={styles.exerciseText}>{item.name}</Text>
                  <Text style={styles.exerciseDescription}>
                    {item.description}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit}
          disabled={!selectedExercise}
        >
          <Text style={styles.buttonText}>Add Exercise</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    width: "100%",
    paddingBottom: 150,
    paddingTop: 10,
    backgroundColor: "white",
  },
  contentContainer: {
    width: "90%",
  },
  backButton: {
    alignSelf: "flex-start",
    marginLeft: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  icon: {
    width: 40,
    height: 40,
  },
  exerciseItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  selectedExerciseItem: {
    backgroundColor: "#e0e0e0",
  },
  exerciseDetails: {
    marginLeft: 10,
  },
  exerciseText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  exerciseDescription: {
    fontSize: 14,
    color: "#666",
  },
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});

export default AddExerciseScreen;
