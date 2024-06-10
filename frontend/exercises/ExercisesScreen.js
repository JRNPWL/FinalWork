import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Text,
  Image,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { fetchExercisesData } from "../services/dataService";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useFocusEffect } from "@react-navigation/native";

const ExercisesScreen = () => {
  const navigation = useNavigation();
  const [exerciseData, setExerciseData] = useState([]);
  const [loading, setLoading] = useState(true);

  const Icon = {
    chest: require("../assets/chest.png"),
    back: require("../assets/back.png"),
    arm: require("../assets/arm.png"),
    leg: require("../assets/leg.png"),
  };

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

  useEffect(() => {
    fetchExercises();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchExercises();
    }, [])
  );

  const navigateToAddExercise = () => {
    navigation.navigate("AddExercisesScreen");
  };

  const handleExercisePress = (exercise) => {
    navigation.navigate("ExerciseDetailScreen", { exercise });
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
          <View style={styles.topContainer}>
            <Text style={styles.pageTitle}>Exercises</Text>
            <TouchableOpacity
              onPress={navigateToAddExercise}
              style={styles.addExercise}
            >
              <Text style={styles.addExerciseText}>Add Exercise</Text>
              <FontAwesomeIcon icon={faPlus} size={11} color="black" />
            </TouchableOpacity>
          </View>
          <FlatList
            style={styles.contentContainer}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            data={exerciseData}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.medicationContainerButton}
                onPress={() => handleExercisePress(item)}
              >
                <View style={styles.centerBottomContainer}>
                  <View style={styles.bottomContainer}>
                    <View style={styles.iconContainer}>
                      <Image source={Icon[item.icon]} style={styles.icon} />
                      {/* <FontAwesomeIcon
                        icon={
                          item.icon === "faDumbbell"
                            ? faDumbbell
                            : item.icon === "faRunning"
                            ? faRunning
                            : faBicycle
                        }
                        size={64}
                        style={styles.icon}
                      /> */}
                    </View>

                    <View style={styles.detailsContainer}>
                      <Text style={styles.title}>{item.name}</Text>

                      <View style={styles.detailItem}>
                        <Text style={styles.label}>Sets:</Text>
                        <Text style={styles.text}>{item.sets}</Text>
                      </View>
                      <View style={styles.detailItem}>
                        <Text style={styles.label}>Reps:</Text>
                        <Text style={styles.text}>{item.reps}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    width: "100%",
    paddingBottom: 150, // Keep same number as footer+20
    paddingTop: 10, // Keep same number as header+20
    backgroundColor: "white",
  },
  contentContainer: {
    paddingBottom: 20, // List is reversed, add padding to bottom to add to top
    width: "100%",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  exercisesContainer: {
    width: "100%",
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
  addExercise: {
    flexDirection: "row",
    marginBottom: 20,
    alignItems: "center",
  },
  addExerciseText: {
    fontSize: 16,
    marginRight: 3,
  },
  centerBottomContainer: {
    alignItems: "center",
  },
  bottomContainer: {
    width: "90%",
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 6,
    marginBottom: 5,
    marginTop: 5,
    // backgroundColor: "lightgrey",
    backgroundColor: "#F8F8F8",
    padding: 10,
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
  detailsContainer: {
    width: "50%",
    justifyContent: "center",
  },
  detailItem: {
    flexDirection: "row",
    // marginTop: 5,
    // marginBottom: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
  },
  text: {
    fontSize: 16,
    marginLeft: 5,
  },
});

export default ExercisesScreen;
