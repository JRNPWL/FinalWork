import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text,
} from "react-native";
import { register } from "../services/authService";
import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";

const RegisterScreen = () => {
  const navigation = useNavigation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [error, setError] = useState(null);

  const handleRegister = async () => {
    const success = await register(name, email, password, profilePicture);
    if (success) {
      navigation.navigate("Login");
    } else {
      setError("A user with this email already exists!");
    }
  };

  const handleChooseProfilePicture = (event) => {
    const selectedFile = event.target.files[0];
    setProfilePicture(selectedFile);
  };

  const navigateToLogin = () => {
    navigation.navigate("Login");
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.loginContainer}>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Name"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />
        </View>
        <TouchableOpacity onPress={handleChooseProfilePicture}>
          <Text>Choose Profile Picture</Text>
        </TouchableOpacity>
        {/* <input
          type="file"
          accept="image/*"
          onChange={handleChooseProfilePicture}
        /> */}
        <TouchableOpacity style={styles.loginButton} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
        {error && <Text style={styles.errorText}>{error}</Text>}
        <TouchableOpacity
          onPress={navigateToLogin}
          style={styles.registerButton}
        >
          <Text style={styles.registerText}>Already have an account?</Text>
          <Text style={styles.registerText2}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#4facfe",
    width: "100%",
  },
  loginContainer: {
    width: "70%",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  inputContainer: {
    marginBottom: 10,
    width: "100%",
  },
  input: {
    backgroundColor: "white",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
    width: "100%",
  },
  loginButton: {
    backgroundColor: "#4facfe",
    borderRadius: 10,
    padding: 15,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  registerButton: {
    alignItems: "center",
  },
  registerText: {
    color: "black",
    marginTop: 10,
  },
  registerText2: {
    color: "black",
    fontWeight: "bold",
    marginTop: 5,
  },
});
export default RegisterScreen;
