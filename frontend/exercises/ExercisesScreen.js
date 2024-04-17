import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  Button,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { fetchExercisesData } from "../services/dataService";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faDumbbell,
  faRunning,
  faBicycle,
} from "@fortawesome/free-solid-svg-icons"; // Import Font Awesome icons
import CustomHeader from "../snippets/CustomHeader";

const ExercisesScreen = () => {
  const navigation = useNavigation();
  const [exerciseData, setExerciseData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const exercises = await fetchExercisesData();
        setExerciseData(exercises);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching exercises:", error);
        setLoading(false);
      }
    };
    fetchExercises();
  }, []);

  const navigateToAddExercise = () => {
    navigation.navigate("AddExercisesScreen");
  };

  const handleMenuPress = () => {
    navigation.push("MenuScreen");
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Loading...</Text>
        </View>
      ) : (
        <View style={styles.exercisesContainer}>
          <CustomHeader
            title="Home"
            iconName="menu"
            onMenuPress={handleMenuPress}
          />
          <TouchableOpacity onPress={navigateToAddExercise}>
            <Text>Add Exercise</Text>
          </TouchableOpacity>

          {exerciseData.length > 0 ? (
            exerciseData.map((exercise, index) => (
              <View key={index} style={styles.exerciseItem}>
                <View style={styles.itemContainer}>
                  <View style={styles.topContainer}>
                    <Text style={styles.title}>{exercise.name}</Text>
                  </View>

                  <View style={styles.bottomContainer}>
                    <View style={styles.iconContainer}>
                      <FontAwesomeIcon
                        icon={
                          exercise.icon === "faDumbbell"
                            ? faDumbbell
                            : exercise.icon === "faRunning"
                            ? faRunning
                            : faBicycle
                        }
                        size={64}
                        style={styles.icon}
                      />
                    </View>

                    <View style={styles.detailsContainer}>
                      <View style={styles.detailItem}>
                        <Text style={styles.label}>Sets:</Text>
                        <Text style={styles.text}>{exercise.sets}</Text>
                      </View>
                      <View style={styles.detailItem}>
                        <Text style={styles.label}>Reps:</Text>
                        <Text style={styles.text}>{exercise.reps}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <Text>No exercises available</Text>
          )}
          {/* <Button title="Add Exercise" onPress={navigateToAddExercise} /> */}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  exercisesContainer: {
    width: "80%",
  },
  exerciseItem: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between", // Aligns items to opposite ends
    marginBottom: 20,
    // borderWidth: 1, // Add border for visualization
    borderRadius: 15,
    backgroundColor: "lightgrey",
    padding: 10, // Add padding for visualization
    paddingTop: 25, // Add padding for visualization
    paddingBottom: 25, // Add padding for visualization
  },
  itemContainer: {
    // alignSelf: "flex-start",
  },
  topContainer: {
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  bottomContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconContainer: {
    marginRight: 30, // Add margin for spacing between icon and details
  },
  detailsContainer: {
    flex: 1, // Expand to take remaining space
  },
  title: {
    fontSize: 21,
    fontWeight: "bold",
    textAlign: "left",
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
  },
  text: {
    fontSize: 16,
  },
  icon: {
    marginTop: 5,
  },
});

export default ExercisesScreen;
