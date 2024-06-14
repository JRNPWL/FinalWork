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
  Image,
} from "react-native";
import { getUserId, editProfile } from "../services/authService";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { fetchUserData } from "../services/dataService";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

const EditUserProfile = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);

  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePictureId, setProfilePictureId] = useState(null);
  const [profilePictureType, setProfilePictureType] = useState(null);

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

  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  const handleChooseProfilePicture = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
        base64: true,
      });

      // console.log(result);
      if (!result.canceled) {
        const { base64, uri, mimeType } = result;
        const uuid = uuidv4(); // Generate UUID
        // const fileName = uri.split("/").pop(); // Extract filename from uri

        // console.log(uuid);
        console.log(result);
        console.log(result.assets[0].uri);

        // setProfilePictureId(uuid); // Set UUID as profilePictureId
        setProfilePicture(result);
        // setProfilePictureType(result.assets[0].mimeType); // Set image type
      }
    } catch (error) {
      console.error("Error picking image:", error);
    }
  };

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
        setName(user.name);
        setEmail(user.email);
        setSex(user.sex);
        setDob(user.dob);
        setBloodType(user.bloodType);
        setDoctor(user.doctor);
        setEmergencyContact(user.emergencyContact);
        setMedicalHistory(user.medicalHistory || []);
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

  const [removedItems, setRemovedItems] = useState([]);

  const removeMedicalHistoryItem = (index) => {
    const updatedMedicalHistory = [...medicalHistory];
    const removedItem = updatedMedicalHistory.splice(index, 1);
    setMedicalHistory(updatedMedicalHistory);
    setRemovedItems([...removedItems, removedItem[0]]);
  };

  const undoRemoveMedicalHistoryItem = (index) => {
    const updatedRemovedItems = [...removedItems];
    const restoredItem = updatedRemovedItems.splice(index, 1);
    setRemovedItems(updatedRemovedItems);
    setMedicalHistory([...medicalHistory, restoredItem[0]]);
  };

  const editProfile = async () => {
    try {
      setError(null); // Reset error state before attempting login
      const userId = await getUserId();

      const apiUrl = `http://192.168.0.119:3000/api/users/${userId}`;

      // Construct the putData object directly
      const putData = {
        // profilePictureId,
        profilePicture,
        // profilePictureType,
        name,
        email,
        dob: selectedDate ? selectedDate.toISOString().split("T")[0] : null,
        sex,
        bloodType,
        doctor,
        emergencyContact,
        medicalHistory,
      };

      console.log("putData:", putData); // Log the final putData object

      setLoading(true);
      const response = await axios.put(apiUrl, putData);
      console.log("User Updated successfully:", response.data);
      setLoading(false);
      navigation.goBack();
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
          <Text style={styles.title}>Update Profile</Text>

          <View style={styles.personalInfoContainer}>
            {/* <TouchableOpacity onPress={handleChooseProfilePicture}>
              <Text>Choose Profile Picture</Text>
            </TouchableOpacity> */}
            {profilePicture ? (
              <Image
                source={{ uri: profilePicture }}
                style={{ width: 100, height: 100 }}
              />
            ) : null}

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
              <Text style={styles.dateText}>
                {selectedDate
                  ? selectedDate.toLocaleDateString()
                  : "No date selected"}
              </Text>
              <TouchableOpacity
                style={styles.dateTimePicker}
                onPress={showDatePicker}
              >
                <Text style={styles.dateTimePickerText}>Open Calander</Text>
              </TouchableOpacity>
              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
              />
            </View>
            <View style={styles.inputTitleContainer}>
              <Text style={styles.label}>Sex</Text>
              <View style={styles.sexContainer}>
                <TouchableOpacity
                  style={[
                    styles.sexButton,
                    sex === "M" && styles.selectedSexButton,
                  ]}
                  onPress={() => setSex("M")}
                >
                  <Text
                    style={[
                      styles.sexButtonText,
                      sex === "M" && { color: "white" },
                    ]}
                  >
                    Male
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.sexButton,
                    sex === "F" && styles.selectedSexButton,
                  ]}
                  onPress={() => setSex("F")}
                >
                  <Text
                    style={[
                      styles.sexButtonText,
                      sex === "F" && { color: "white" },
                    ]}
                  >
                    Female
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={styles.medicalInfoContainer}>
            <Text style={styles.subTitle}>Medical Info</Text>
            <View style={styles.inputTitleContainer}>
              <Text style={styles.label}>Blood Type</Text>
              <Picker
                selectedValue={bloodType}
                style={styles.input}
                onValueChange={(itemValue) => setBloodType(itemValue)}
              >
                <Picker.Item label="Select Blood Type" value="" />
                {bloodTypes.map((type) => (
                  <Picker.Item label={type} value={type} key={type} />
                ))}
              </Picker>
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
                maxLength={10}
              />
            </View>
            <View style={styles.inputTitleContainer}>
              <Text style={styles.label}>Medical History</Text>
              <View>
                {medicalHistory.map((item, index) => (
                  <View key={index} style={styles.medicalHistoryItem}>
                    <Text style={styles.medicalHistoryText}>{item}</Text>
                    <TouchableOpacity
                      style={styles.undoButton}
                      onPress={() => removeMedicalHistoryItem(index)}
                    >
                      <Text style={styles.buttonText}>Remove</Text>
                    </TouchableOpacity>
                  </View>
                ))}
                {removedItems.map((item, index) => (
                  <View key={index} style={styles.medicalHistoryItem}>
                    <Text
                      style={[styles.medicalHistoryText, styles.removedText]}
                    >
                      {item}
                    </Text>
                    <TouchableOpacity
                      style={styles.undoButton}
                      onPress={() => undoRemoveMedicalHistoryItem(index)}
                    >
                      <Text style={styles.buttonText}>Undo</Text>
                    </TouchableOpacity>
                  </View>
                ))}
                <TextInput
                  placeholder="Add Medical History Item"
                  value={newMedicalHistoryItem}
                  onChangeText={setNewMedicalHistoryItem}
                  style={styles.input}
                />
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
    paddingBottom: 60,
  },
  scrollContainer: {
    width: "100%",
  },
  contentContainer: {
    width: "100%",
    marginTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 40,
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
  dateText: {
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
    marginBottom: 10,
  },
  dateTimePickerText: {
    color: "black",
    fontSize: 17,
    fontWeight: "500",
  },
  sexContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  sexButton: {
    alignItems: "center",
    width: "49%",
    borderWidth: 1,
    borderColor: "lightgrey",
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  selectedSexButton: {
    alignItems: "center",
    backgroundColor: "#4facfe",
    borderColor: "#4facfe",
  },
  sexButtonText: {
    color: "black",
    fontSize: 20,
    fontWeight: "500",
  },
  medicalHistoryItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  medicalHistoryText: {
    flex: 1,
    marginLeft: 10,
  },
  removedText: {
    color: "red",
    textDecorationLine: "line-through",
  },
  undoButton: {
    backgroundColor: "#4facfe",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
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
