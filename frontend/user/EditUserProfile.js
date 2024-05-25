import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Button,
} from "react-native";
import { getUserId, editProfile } from "../services/authService";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { fetchUserData } from "../services/dataService";
// import DatePicker from "@react-native-community/datetimepicker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Picker } from "@react-native-picker/picker";

const EditUserProfile = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dob, setDob] = useState("");
  const [sex, setSex] = useState("");
  const [bloodType, setBloodType] = useState("");
  const [doctor, setDoctor] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [newMedicalHistoryItem, setNewMedicalHistoryItem] = useState("");
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    console.log("A date has been picked: ", date);
    setSelectedDate(date);
    hideDatePicker();
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await fetchUserData();
        setUserData(user);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);

  const addMedicalHistoryItem = () => {
    if (newMedicalHistoryItem.trim() !== "") {
      setMedicalHistory([...medicalHistory, newMedicalHistoryItem]);
      setNewMedicalHistoryItem("");
    }
  };

  const removeMedicalHistoryItem = (index) => {
    const updatedMedicalHistory = [...medicalHistory];
    updatedMedicalHistory.splice(index, 1);
    setMedicalHistory(updatedMedicalHistory);
  };

  const editProfile = async () => {
    try {
      setError(null); // Reset error state before attempting login
      const userId = await getUserId();

      const apiUrl = `http://192.168.0.119:3000/api/users/${userId}`;

      const fields = [
        { field: "name", value: name },
        { field: "email", value: email },
        { field: "password", value: password },
        {
          field: "dob",
          value: selectedDate ? selectedDate.toISOString().split("T")[0] : null,
        },
        { field: "sex", value: sex },
        { field: "bloodType", value: bloodType },
        { field: "doctor", value: doctor },
        { field: "emergencyContact", value: emergencyContact },
        {
          field: "medicalHistory",
          value: medicalHistory.length > 0 ? medicalHistory : null,
        },
      ];

      const putData = fields.reduce((acc, { field, value }) => {
        if (
          (value && typeof value === "string" && value.trim() !== "") ||
          Array.isArray(value)
        ) {
          acc[field] = value;
        }
        return acc;
      }, {});

      console.log("putData:", putData); // Log the final putData object

      setLoading(true);
      const response = await axios.put(apiUrl, putData);
      setLoading(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <FontAwesomeIcon icon={faArrowLeft} size={20} color="black" />
        </TouchableOpacity>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>Add new Medication</Text>

          <View style={styles.personalInfoContainer}>
            <Text style={styles.subTitle}>Personal Info</Text>
            <View style={styles.inputTitleContainer}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                placeholder={userData?.name || "Name"}
                value={name}
                onChangeText={setName}
                style={styles.input}
              />
            </View>
            <View style={styles.inputTitleContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                placeholder={userData?.email || "Email"}
                value={email}
                onChangeText={setEmail}
                style={styles.input}
              />
            </View>
            <View style={styles.inputTitleContainer}>
              <Text style={styles.label}>Date Of Birth (DOB)</Text>
              {/* <Button title="Show Date Picker" onPress={showDatePicker} /> */}
              <Text
              // style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}
              >
                {selectedDate
                  ? selectedDate.toLocaleDateString()
                  : "No date selected"}
              </Text>
              <TouchableOpacity
                style={styles.dateTimePicker}
                onPress={showDatePicker}
              >
                <Text style={styles.dateTimePickerText}>Open Date Picker</Text>
              </TouchableOpacity>
              <DateTimePickerModal
                // date={selectedDate}
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
              />
            </View>
            <View style={styles.inputTitleContainer}>
              <Text style={styles.label}>Sex</Text>
              <Picker
                selectedValue={sex}
                style={styles.input}
                onValueChange={(itemValue) => setSex(itemValue)}
              >
                <Picker.Item label="Select Sex" value="" />
                <Picker.Item label="Male" value="M" />
                <Picker.Item label="Female" value="F" />
              </Picker>
            </View>
          </View>
          <View style={styles.medicalInfoContainer}>
            <Text style={styles.subTitle}>Medical Info</Text>
            <View style={styles.inputTitleContainer}>
              <Text style={styles.label}>Blood Type</Text>
              <TextInput
                placeholder={userData?.bloodType || "Blood Type"}
                value={bloodType}
                onChangeText={setBloodType}
                style={styles.input}
              />
            </View>
            <View style={styles.inputTitleContainer}>
              <Text style={styles.label}>Doctor</Text>
              <TextInput
                placeholder={userData?.doctor || "Doctor"}
                value={doctor}
                onChangeText={setDoctor}
                style={styles.input}
              />
            </View>
            <View style={styles.inputTitleContainer}>
              <Text style={styles.label}>Emergency Contact</Text>
              <TextInput
                placeholder={userData?.emergencyContact || "Emergency Contact"}
                value={emergencyContact}
                onChangeText={setEmergencyContact}
                style={styles.input}
                keyboardType="phone-pad"
              />
            </View>
            <View style={styles.inputTitleContainer}>
              <Text style={styles.label}>Medical History</Text>
              <View>
                {medicalHistory.map((item, index) => (
                  <View key={index} style={styles.medicalHistoryItem}>
                    <Text>{item}</Text>
                    {/* <TouchableOpacity
                      title="Remove"
                      onPress={() => removeMedicalHistoryItem(index)}
                    /> */}
                    <TouchableOpacity
                      style={styles.dateTimePicker}
                      onPress={() => removeMedicalHistoryItem(index)}
                    >
                      <Text style={styles.dateTimePickerText}>Remove</Text>
                    </TouchableOpacity>
                  </View>
                ))}
                <TextInput
                  placeholder="Add Medical History Item"
                  value={newMedicalHistoryItem}
                  onChangeText={setNewMedicalHistoryItem}
                  style={styles.input}
                />
                {/* <TouchableOpacity title="Add" onPress={addMedicalHistoryItem} /> */}
                <TouchableOpacity
                  style={styles.dateTimePicker}
                  onPress={addMedicalHistoryItem}
                >
                  <Text style={styles.dateTimePickerText}>Add item</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={editProfile} style={styles.button}>
              <Text style={styles.buttonText}>Update Profile</Text>
            </TouchableOpacity>
          </View>
          {error && <Text style={{ color: "red" }}>{error}</Text>}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "white",
    paddingBottom: 60, // Keep same number as footer+20
  },
  scrollContainer: {
    width: "100%",
  },
  contentContainer: {
    width: "100%",
    marginTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 40, // Keep same number as footer+20
  },
  personalInfoContainer: {
    marginBottom: 20,
  },
  medicalInfoContainer: {
    marginBottom: 20,
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
    marginLeft: 10,
  },
  subTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 5,
    marginLeft: 10,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    alignSelf: "flex-start",
    marginLeft: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "lightgrey",
    borderRadius: 25,
    padding: 10,
    marginBottom: 10,
    width: "100%",
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
    // shadowColor: "#000",
    // shadowOffset: {
    //   width: 2,
    //   height: 3,
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 5,
    // elevation: 6,
    marginBottom: 10,
  },
  dateTimePickerText: {
    color: "black",
    fontSize: 17,
    // fontWeight: "bold",
    fontWeight: "500",
  },
  medicalHistoryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  buttonContainer: {
    width: "100%",
    marginTop: 10,
  },
  button: {
    width: "100%",
    backgroundColor: "#4facfe",
    borderRadius: 15,
    paddingTop: 5,
    paddingBottom: 5,
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
    fontWeight: "600",
    fontSize: 18,
    textAlign: "center",
  },
  error: {
    color: "red",
    marginTop: 10,
    alignSelf: "flex-start",
  },
});

export default EditUserProfile;
