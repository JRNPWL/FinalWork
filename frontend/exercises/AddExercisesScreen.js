import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Button,
  TouchableOpacity,
  Text,
  Modal,
  FlatList,
  StyleSheet,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faArrowLeft,
  faDumbbell,
  faRunning,
  faBicycle,
} from "@fortawesome/free-solid-svg-icons"; // Import Font Awesome icons
import { getUserId } from "../services/authService";
import { addExercise } from "../services/dataService";

const CustomDropdown = ({ options, selectedOption, onSelect }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleSelect = (option) => {
    onSelect(option);
    setModalVisible(false);
  };

  return (
    <View>
      <Text style={styles.modalTitle}>Select an icon</Text>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={[styles.modalTrigger, { alignSelf: "center" }]}
      >
        <FontAwesomeIcon
          icon={selectedOption.icon}
          size={40}
          style={styles.modalIcon}
        />
      </TouchableOpacity>
      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalBackground}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <Text style={styles.title}>Select an icon</Text>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleSelect(item)}
                  style={styles.optionItem}
                >
                  <FontAwesomeIcon
                    icon={item.icon}
                    size={20}
                    style={styles.icon}
                  />
                  <Text style={styles.optionText}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const AddMedicationScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [reps, setReps] = useState("");
  const [sets, setSets] = useState("");
  const [icon, setIcon] = useState(null); // State to hold the selected icon

  const options = [
    { value: "faDumbbell", label: "Dumbbell", icon: faDumbbell },
    { value: "faRunning", label: "Running", icon: faRunning },
    { value: "faBicycle", label: "Bicycle", icon: faBicycle },
    /* Add more options as needed */
  ];

  useEffect(() => {
    // Set the default selected option to the first option in the list if icon is null
    if (!icon) {
      setIcon(options[0]);
    }
  }, []);

  const handleIconSelect = (selectedOption) => {
    setIcon(selectedOption);
  };

  const handleSubmit = async () => {
    try {
      // if (!icon) {
      //   // If no icon is selected, display an error message or handle it appropriately
      //   console.error("Please select an icon.");
      //   return;
      // }
      const userId = await getUserId();
      const iconName = icon.value;
      const response = await addExercise(userId, name, sets, reps, iconName);
      console.log("Exercise added successfully:", response.data);
      // Handle success, maybe redirect or show a success message
    } catch (error) {
      console.error("Error adding exercise:", error);
      // Handle error, show error message to user
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
      <View style={styles.inputContainer}>
        <View style={styles.inputTitleContainer}>
          <Text style={[styles.title, styles.inputTitle]}>Exercise Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Exercise Name"
          />
        </View>
        <View style={styles.inputTitleContainer}>
          <Text style={[styles.title, styles.inputTitle]}>Sets</Text>
          <TextInput
            style={styles.input}
            value={sets}
            onChangeText={setSets}
            placeholder="Sets"
            keyboardType="numeric"
          />
        </View>
        <View style={styles.inputTitleContainer}>
          <Text style={[styles.title, styles.inputTitle]}>Repetitions</Text>
          <TextInput
            style={styles.input}
            value={reps}
            onChangeText={setReps}
            placeholder="Reps"
            keyboardType="numeric"
          />
        </View>
      </View>
      <CustomDropdown
        options={options}
        selectedOption={icon || options[0]} // If no icon is selected, default to first option
        onSelect={handleIconSelect}
      />
      <Button title="Add Exercise" onPress={handleSubmit} disabled={!name} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "white",
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
  },
  inputContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  inputTitleContainer: {
    width: "100%",
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
    borderRadius: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  inputTitle: {
    alignSelf: "flex-start",
  },
  modalTrigger: {
    alignItems: "center",
    justifyContent: "center",
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "lightgray",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalIcon: {
    color: "black",
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    alignItems: "center",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    margin: 20,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  icon: {
    marginRight: 10,
  },
  optionText: {
    fontSize: 16,
  },
});

export default AddMedicationScreen;
