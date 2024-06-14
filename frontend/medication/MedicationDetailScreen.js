import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useRoute, useNavigation } from "@react-navigation/native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faEdit,
  faCheck,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";

const CustomDropdown = ({ options, selectedOption, onSelect }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleSelect = (option) => {
    onSelect(option);
    setModalVisible(false);
  };

  return (
    <View>
      {/* <Text style={styles.modalTitle}>Select an icon</Text> */}
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

const MedicationDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { medication } = route.params;

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(medication.name);
  const [dosage, setDosage] = useState(medication.dosage);
  const [icon, setIcon] = useState(medication.icon);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);

  const Icon = {
    Pill1: require("../assets/Pill1.png"),
    Pill2: require("../assets/Pill2.png"),
    Pill3: require("../assets/Pill3.png"),
    Pill4: require("../assets/Pill4.png"),
    Pill5: require("../assets/Pill5.png"),
    Pill6: require("../assets/Pill6.png"),
  };

  const handleIconSelect = (selectedOption) => {
    setIcon(selectedOption);
  };
  // const handleAddReminder = () => {
  //   if (newReminderDate && newReminderTime) {
  //     setReminders([
  //       ...reminders,
  //       { date: newReminderDate, time: newReminderTime },
  //     ]);
  //     setNewReminderDate("");
  //     setNewReminderTime("");
  //   }
  // };

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

  const handleConfirmTime = (time) => {
    setSelectedTime(time);
    hideTimePicker();
  };

  const showTimePicker = () => {
    setTimePickerVisibility(true);
  };

  const hideTimePicker = () => {
    setTimePickerVisibility(false);
  };

  const handleUpdateMedication = async () => {
    try {
      console.log(selectedDate);
      const response = await fetch(
        `http://192.168.0.119:3000/api/medications/${medication.userId}/${medication.medicationId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            dosage,
            date: selectedDate,
            time: selectedTime,
            icon: icon,
          }),
        }
      );

      if (response.ok) {
        alert("Medication updated successfully");
        navigation.goBack();
      } else {
        alert("Failed to update medication");
      }
    } catch (error) {
      console.error("Error updating medication:", error);
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
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Medication Details</Text>
          <View style={styles.buttonContainer}>
            {isEditing ? (
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  handleUpdateMedication();
                  setIsEditing(false);
                }}
              >
                <FontAwesomeIcon
                  icon={faCheck}
                  size={20}
                  style={styles.buttonIcon}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.button}
                onPress={() => setIsEditing(true)}
              >
                <FontAwesomeIcon
                  icon={faEdit}
                  size={20}
                  style={styles.buttonIcon}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
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
          <Text style={styles.label}>Dosage:</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={dosage}
              onChangeText={setDosage}
            />
          ) : (
            <Text style={styles.text}>{dosage}</Text>
          )}
        </View>
        <View style={styles.detailContainer}>
          <Text style={styles.label}>Date:</Text>
          {isEditing ? (
            <View style={styles.dateTimePickerContainer}>
              <TouchableOpacity
                style={styles.dateTimePicker}
                onPress={showDatePicker}
              >
                <Text style={styles.dateTimePickerText}>Open Calander</Text>
              </TouchableOpacity>
              {selectedDate && <Text>Date: {selectedDate.toDateString()}</Text>}
            </View>
          ) : (
            <Text style={styles.text}>
              {new Date(medication.date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
              })}
            </Text>
          )}
        </View>
        <View style={styles.detailContainer}>
          <Text style={styles.label}>Time:</Text>
          {isEditing ? (
            <View style={styles.dateTimePickerContainer}>
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
          ) : (
            <Text style={styles.text}>
              {new Date(medication.time).toLocaleTimeString("en-US", {
                hour12: false,
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          )}
        </View>

        <View style={styles.detailContainer}>
          <Text style={styles.label}>Icon:</Text>
          {isEditing ? (
            <CustomDropdown
              options={Icon}
              selectedOption={icon || Object.keys(Icon)[0]} // If no icon is selected, default to first option
              onSelect={handleIconSelect}
            />
          ) : (
            <Image source={Icon[icon]} style={styles.icon} />
          )}
        </View>

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
  titleContainer: {
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 20,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  button: {
    padding: 10,
    borderRadius: 5,
  },
  buttonIcon: {
    color: "#4facfe",
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
  },
  detailContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
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
    borderRadius: 25,
    borderColor: "#ccc",
    padding: 10,
    width: "70%",
  },
  dateTimePickerContainer: {
    width: "70%",
  },
  dateTimePicker: {
    alignItems: "center",
    width: "100%",
    backgroundColor: "#F8F8F8",
    borderWidth: 1,
    borderColor: "lightgrey",
    borderRadius: 25,
    paddingTop: 10,
    paddingBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 6,
  },
  dateTimePickerText: {
    color: "black",
    fontSize: 17,
    fontWeight: "500",
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

export default MedicationDetailScreen;
