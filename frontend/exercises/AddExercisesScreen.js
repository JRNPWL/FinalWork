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
          <>
            {/* <View style={styles.flatlistContainer}> */}
            <FlatList
              data={exerciseOptions}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
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
              ListFooterComponent={<View style={{ height: 80 }} />}
            />
            {/* </View> */}
            <TouchableOpacity
              style={[
                styles.button,
                { position: "absolute", bottom: 15, right: 0 },
              ]}
              onPress={handleSubmit}
              disabled={!selectedExercise}
            >
              <Text style={styles.buttonText}>Add Exercise</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    width: "100%",
    paddingBottom: 120,
    paddingTop: 10,
    backgroundColor: "white",
  },
  contentContainer: {
    // marginBottom: 55,
    width: "90%",
    marginTop: 10,
  },
  backButton: {
    alignSelf: "flex-start",
    marginLeft: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    marginLeft: 10,
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
    backgroundColor: "#4facfe",
    width: " 100%",
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 6,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default AddExerciseScreen;
