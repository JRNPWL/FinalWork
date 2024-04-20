import React, { useState } from "react";
import { View, StyleSheet, Text, TextInput, Button } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

import { addMedication } from "../services/dataService";

const AddMedicationScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);

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
      await addMedication(name, dosage, frequency, selectedDate, selectedTime);
      navigation.goBack();
    } catch (error) {
      console.error("Error adding medication:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Name:</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Enter medication name"
      />

      <Text style={styles.label}>Dosage:</Text>
      <TextInput
        style={styles.input}
        value={dosage}
        onChangeText={setDosage}
        placeholder="Enter dosage"
      />

      <Text style={styles.label}>Frequency:</Text>
      <TextInput
        style={styles.input}
        value={frequency}
        onChangeText={setFrequency}
        placeholder="Enter frequency"
      />

      <Button title="Select Date" onPress={showDatePicker} />
      {selectedDate && <Text>Date: {selectedDate.toDateString()}</Text>}

      <Button title="Select Time" onPress={showTimePicker} />
      {selectedTime && <Text>Time: {selectedTime.toLocaleTimeString()}</Text>}

      <Button title="Add Medication" onPress={handleSubmit} />

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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    fontSize: 16,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    marginBottom: 10,
    padding: 10,
  },
});

export default AddMedicationScreen;
