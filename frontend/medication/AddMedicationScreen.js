import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Modal,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { addMedication } from "../services/dataService";

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
        <Image source={options[selectedOption]} style={styles.modalIcon} />
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
              data={Object.keys(options)}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleSelect(item)}
                  style={styles.optionItem}
                >
                  <Image source={options[item]} style={styles.icon} />
                  {/* <Text style={styles.optionText}>{item}</Text> */}
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
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [icon, setIcon] = useState(null); // State to hold the selected icon

  const Icon = {
    Pill1: require("../assets/Pill1.png"),
    Pill2: require("../assets/Pill2.png"),
    Pill3: require("../assets/Pill3.png"),
    Pill4: require("../assets/Pill4.png"),
    Pill5: require("../assets/Pill5.png"),
    Pill6: require("../assets/Pill6.png"),
  };

  useEffect(() => {
    // Set the default selected option to the first option in the list if icon is null
    if (!icon) {
      setIcon(Object.keys(Icon)[0]);
    }
  }, []);

  const handleIconSelect = (selectedOption) => {
    setIcon(selectedOption);
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirmDate = (date) => {
    setSelectedDate(date);
    hideDatePicker();
  };

  const showTimePicker = () => {
    setTimePickerVisibility(true);
  };

  const hideTimePicker = () => {
    setTimePickerVisibility(false);
  };

  const handleConfirmTime = (time) => {
    setSelectedTime(time);
    hideTimePicker();
  };

  const handleSubmit = async () => {
    try {
      await addMedication(
        name,
        dosage,
        frequency,
        selectedDate,
        selectedTime,
        icon
      );
      navigation.goBack();
    } catch (error) {
      console.error("Error adding medication:", error);
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
        <Text style={styles.title}>Add new Medication</Text>
        <View style={styles.inputContainer}>
          <View style={styles.inputTitleContainer}>
            <Text style={styles.inputTitle}>Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter medication name"
            />
          </View>

          <View style={styles.inputTitleContainer}>
            <Text style={styles.inputTitle}>Dosage</Text>
            <TextInput
              style={styles.input}
              value={dosage}
              onChangeText={setDosage}
              placeholder="Enter dosage"
            />
          </View>

          <View style={styles.inputTitleContainer}>
            <Text style={styles.inputTitle}>Select Date</Text>
            <TouchableOpacity
              style={styles.dateTimePicker}
              onPress={showDatePicker}
            >
              <Text style={styles.dateTimePickerText}>Open Calander</Text>
            </TouchableOpacity>
            {selectedDate && <Text>Date: {selectedDate.toDateString()}</Text>}
          </View>

          <View style={styles.inputTitleContainer}>
            <Text style={styles.inputTitle}>Select Time</Text>
            <TouchableOpacity
              style={styles.dateTimePicker}
              onPress={showTimePicker}
            >
              <Text style={styles.dateTimePickerText}>Open Clock</Text>
            </TouchableOpacity>

            {selectedTime && (
              <Text>Time: {selectedTime.toLocaleTimeString()}</Text>
            )}
          </View>

          <CustomDropdown
            options={Icon}
            selectedOption={icon || Object.keys(Icon)[0]} // If no icon is selected, default to first option
            onSelect={handleIconSelect}
          />

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Add Medication</Text>
          </TouchableOpacity>

          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirmDate}
            onCancel={hideDatePicker}
          />

          <DateTimePickerModal
            isVisible={isTimePickerVisible}
            mode="time"
            onConfirm={handleConfirmTime}
            onCancel={hideTimePicker}
          />
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
  inputContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  inputTitleContainer: {
    width: "100%",
    alignSelf: "flex-start",
    marginBottom: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    marginLeft: 10,
  },
  inputTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    marginLeft: 10,
  },
  input: {
    fontSize: 16,
    borderWidth: 1,
    borderColor: "lightgrey",
    borderRadius: 25,
    marginBottom: 5,
    padding: 10,
    // shadowColor: "#000",
    // shadowOffset: {
    //   width: 2,
    //   height: 3,
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 5,
    // elevation: 6,
  },
  dateTimePicker: {
    alignItems: "center",
    width: "100%",
    backgroundColor: "#F8F8F8",
    borderWidth: 1,
    borderColor: "lightgrey",
    borderRadius: 15,
    paddingTop: 6,
    paddingBottom: 6,
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 6,
    marginBottom: 10,
  },
  dateTimePickerText: {
    color: "black",
    fontSize: 17,
    fontWeight: "500",
  },
  button: {
    alignItems: "center",
    width: "100%",
    backgroundColor: "#4facfe",
    borderRadius: 25,

    padding: 15,
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
    alignSelf: "center",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalIcon: {
    width: 70,
    height: 70,
    color: "black",
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    alignItems: "center",
    backgroundColor: "#F8F8F8",
    padding: 20,
    borderRadius: 20,
    margin: 20,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  icon: {
    width: 80,
    height: 80,
    marginRight: 10,
  },
  optionText: {
    fontSize: 16,
  },
});

export default AddMedicationScreen;
