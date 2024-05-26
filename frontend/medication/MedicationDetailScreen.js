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

const MedicationDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { medication } = route.params;

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(medication.name);
  const [dosage, setDosage] = useState(medication.dosage);
  //   const [frequency, setFrequency] = useState(medication.frequency);
  const [date, setDate] = useState(medication.date);
  const [time, setTime] = useState(medication.time);
  const [reminders, setReminders] = useState(medication.reminders || []);
  const [newReminderDate, setNewReminderDate] = useState("");
  const [newReminderTime, setNewReminderTime] = useState("");

  const handleAddReminder = () => {
    if (newReminderDate && newReminderTime) {
      setReminders([
        ...reminders,
        { date: newReminderDate, time: newReminderTime },
      ]);
      setNewReminderDate("");
      setNewReminderTime("");
    }
  };

  const handleUpdateMedication = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/medications/${medication.userId}/${medication.medicationId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            dosage,
            // frequency,
            date,
            time,
            reminders,
            icon: medication.icon,
          }),
        }
      );

      if (response.ok) {
        alert("Medication updated successfully");
        navigation.goBack(); // Navigate back to the previous screen
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
        {/* <View style={styles.detailContainer}>
        <Text style={styles.label}>Frequency:</Text>
        {isEditing ? (
          <TextInput
            style={styles.input}
            value={frequency}
            onChangeText={setFrequency}
          />
        ) : (
          <Text style={styles.text}>{frequency}</Text>
        )}
      </View> */}
        <View style={styles.detailContainer}>
          <Text style={styles.label}>Date:</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={date}
              onChangeText={setDate}
            />
          ) : (
            <Text style={styles.text}>
              {new Date(date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
              })}
            </Text>
          )}
        </View>
        <View style={styles.detailContainer}>
          <Text style={styles.label}>Time:</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={time}
              onChangeText={setTime}
            />
          ) : (
            <Text style={styles.text}>{time}</Text>
          )}
        </View>
        {/* <View style={styles.reminderContainer}>
          <TextInput
            style={styles.input}
            value={newReminderDate}
            onChangeText={setNewReminderDate}
            placeholder="Reminder Date"
          />
          <TextInput
            style={styles.input}
            value={newReminderTime}
            onChangeText={setNewReminderTime}
            placeholder="Reminder Time"
          />
          <Button title="Add Reminder" onPress={handleAddReminder} />
        </View>
        <View style={styles.reminderList}>
          <Text style={styles.label}>Reminders:</Text>
          {reminders.map((reminder, index) => (
            <Text key={index} style={styles.text}>{`${new Date(
              reminder
            ).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
            })} ${new Date(reminder).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}`}</Text>
          ))}
        </View> */}
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

export default MedicationDetailScreen;
