import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
} from "react-native";
import { getUserId, editProfile } from "../services/authService";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

const EditUserProfile = () => {
  const navigation = useNavigation();

  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

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
      <Text style={styles.label}>Name</Text>
      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <Text style={styles.label}>Email</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <Text style={styles.label}>Password</Text>
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={editProfile} style={styles.button}>
          <Text style={styles.buttonText}>Update</Text>
        </TouchableOpacity>
      </View>
      {error && <Text style={{ color: "red" }}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    alignSelf: "flex-start",
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: "100%",
  },
  buttonContainer: {
    width: "100%",
    marginTop: 10,
  },
  button: {
    width: "100%",
    backgroundColor: "grey", // Example background color
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15, // Border radius
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
