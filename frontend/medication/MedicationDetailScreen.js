import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
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

const MedicationDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { medication } = route.params;

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(medication.name);
  const [dosage, setDosage] = useState(medication.dosage);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);

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
            icon: medication.icon,
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
        <Text style={styles.title}>Medication Details</Text>
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
            <View>
              <TouchableOpacity
                style={styles.dateTimePicker}
                onPress={showDatePicker}
              >
                <Text style={styles.dateTimePickerText}>Open Date Picker</Text>
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
            <View>
              <TouchableOpacity
                style={styles.dateTimePicker}
                onPress={showTimePicker}
              >
                <Text style={styles.dateTimePickerText}>Open Time Picker</Text>
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
    // fontWeight: "bold",
    fontWeight: "500",
  },
});

export default MedicationDetailScreen;
