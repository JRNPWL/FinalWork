import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faEdit,
  faCheck,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";

const ExerciseDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { exercise } = route.params;

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(exercise.name);
  const [sets, setSets] = useState(exercise.sets);
  const [reps, setReps] = useState(exercise.reps);
  const [description, setDescription] = useState(exercise.description);
  const [icon, setIcon] = useState(exercise.icon);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <FontAwesomeIcon icon={faArrowLeft} size={20} color="black" />
      </TouchableOpacity>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Exercise Details</Text>
        <View style={styles.detailContainer}>
          <Text style={styles.label}>Name:</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
            />
          ) : (
            <Text style={styles.text}>{name}</Text>
          )}
        </View>
        <View style={styles.detailContainer}>
          <Text style={styles.label}>Sets:</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={sets}
              onChangeText={setSets}
            />
          ) : (
            <Text style={styles.text}>{sets}</Text>
          )}
        </View>
        <View style={styles.detailContainer}>
          <Text style={styles.label}>Reps:</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={reps}
              onChangeText={setReps}
            />
          ) : (
            <Text style={styles.text}>{reps}</Text>
          )}
        </View>
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionLabel}>Description:</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={description}
              onChangeText={setDescription}
            />
          ) : (
            <Text style={styles.text}>{description}</Text>
          )}
        </View>
        <View style={styles.buttonContainer}>
          {isEditing ? (
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                handleUpdateMedication();
                setIsEditing(false);
              }}
            >
              <FontAwesomeIcon icon={faCheck} size={20} color="white" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.button}
              onPress={() => setIsEditing(true)}
            >
              <FontAwesomeIcon icon={faEdit} size={20} color="white" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "white",
  },
  contentContainer: {
    width: "100%",
    marginTop: 50,
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  detailContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  descriptionContainer: {
    flexDirection: "column",
    alignItems: "left",
    marginBottom: 10,
  },
  descriptionLabel: {
    fontSize: 18,
    fontWeight: "bold",
    width: "100%",
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    width: "30%",
  },
  text: {
    fontSize: 16,
    width: "70%",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    width: "70%",
  },
  reminderContainer: {
    marginTop: 20,
  },
  reminderList: {
    marginTop: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
  },
});

export default ExerciseDetailScreen;
