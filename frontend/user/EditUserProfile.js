import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  TextInput,
  ScrollView,
  Button,
  TouchableOpacity,
} from "react-native";
import { getUserId, editProfile } from "../services/authService";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { fetchUserData } from "../services/dataService";

const EditUserProfile = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);

  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await fetchUserData();
        console.log(user);
        setUserData(user);
        console.log(userData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);

  const editProfile = async () => {
    try {
      setError(null); // Reset error state before attempting login
      const userId = await getUserId();

      const apiUrl = `http://localhost:3000/api/users/${userId}`;

      const putData = {};

      // Only add fields to putData if they are not empty
      if (name.trim() !== "") {
        putData.name = name;
      }
      if (email.trim() !== "") {
        putData.email = email;
      }
      if (password.trim() !== "") {
        putData.password = password;
      }

      setLoading(true);
      const response = await axios.put(apiUrl, putData);
      console.log(response);
      if (response) {
        setLoading(false);
      }
    } catch {
      console.error("Error fetching user data:", error);
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
          <View style={styles.personalInfoContainer}>
            <Text style={styles.title}>Personal Info</Text>
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
              <TextInput
                placeholder={userData?.dob || "DOB"}
                value={email}
                onChangeText={setEmail}
                style={styles.input}
              />
            </View>
            <View style={styles.inputTitleContainer}>
              <Text style={styles.label}>Age</Text>
              <TextInput
                placeholder={userData?.age || "Age"}
                value={email}
                onChangeText={setEmail}
                style={styles.input}
              />
            </View>
            <View style={styles.inputTitleContainer}>
              <Text style={styles.label}>Sex</Text>
              <TextInput
                placeholder={userData?.sex || "Sex"}
                value={email}
                onChangeText={setEmail}
                style={styles.input}
              />
            </View>
          </View>
          <View style={styles.medicalInfoContainer}>
            <Text style={styles.title}>Medical Info</Text>
            <View style={styles.inputTitleContainer}>
              <Text style={styles.label}>Blood Type</Text>
              <TextInput
                placeholder={userData?.bloodType || "Blood Type"}
                value={email}
                onChangeText={setEmail}
                style={styles.input}
              />
            </View>
            <View style={styles.inputTitleContainer}>
              <Text style={styles.label}>Doctor</Text>
              <TextInput
                placeholder={userData?.doctor || "Doctor"}
                value={email}
                onChangeText={setEmail}
                style={styles.input}
              />
            </View>
            <View style={styles.inputTitleContainer}>
              <Text style={styles.label}>Emergency Contact</Text>
              <TextInput
                placeholder={userData?.emergencyContact || "Emergency Contact"}
                value={email}
                onChangeText={setEmail}
                style={styles.input}
              />
            </View>
            <View style={styles.inputTitleContainer}>
              <Text style={styles.label}>Medical History</Text>
              <TextInput
                placeholder={userData?.medicalHistory || "Medical History"}
                value={email}
                onChangeText={setEmail}
                style={styles.input}
              />
            </View>
          </View>

          {/* <Text style={styles.label}>Password</Text>
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      /> */}
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
    // paddingHorizontal: 20,
    paddingBottom: 60, // Keep same number as footer+20
  },
  // scrollContainer: {
  //   width: "100%",
  // },
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
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 6,
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
