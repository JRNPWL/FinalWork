import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  TouchableOpacity,
  Text,
  Modal,
  FlatList,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
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
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Text>{selectedOption.label}</Text>
      </TouchableOpacity>
      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <View
            style={{ backgroundColor: "white", padding: 20, borderRadius: 10 }}
          >
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleSelect(item)}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: 10,
                  }}
                >
                  <FontAwesomeIcon
                    icon={item.icon}
                    size={20}
                    style={{ marginRight: 10 }}
                  />
                  <Text>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const AddMedicationScreen = () => {
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

  const handleIconSelect = (selectedOption) => {
    setIcon(selectedOption);
  };

  const handleSubmit = async () => {
    try {
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
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Exercise Name"
      />
      <TextInput
        value={reps}
        onChangeText={setReps}
        placeholder="Reps"
        keyboardType="numeric"
      />
      <TextInput
        value={sets}
        onChangeText={setSets}
        placeholder="Sets"
        keyboardType="numeric"
      />
      <CustomDropdown
        options={options}
        selectedOption={icon || options[0]} // If no icon is selected, default to first option
        onSelect={handleIconSelect}
      />
      <Button title="Add Exercise" onPress={handleSubmit} />
    </View>
  );
};

export default AddMedicationScreen;
