import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text,
} from "react-native";
import { login } from "../services/authService";
import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";

const LoginScreen = ({ onLoginSuccess }) => {
  const navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    setError(null); // Reset error state before attempting login

    const response = await login(email, password);

    if (response) {
      onLoginSuccess();
    } else {
      setError("Incorrect email or password");
    }
  };

  const navigateToRegister = () => {
    navigation.navigate("Register");
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.loginContainer}>
        <View style={styles.inputContainer}>
          {/* <Text style={styles.inputText}>Email</Text> */}
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            // placeholderTextColor="#ffffff"
            style={styles.input}
          />
        </View>
        <View style={styles.inputContainer}>
          {/* <Text style={styles.inputText}>Password</Text> */}
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            // placeholderTextColor="#ffffff"
            style={styles.input}
          />
        </View>
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        {error && <Text style={styles.errorText}>{error}</Text>}
        <TouchableOpacity
          onPress={navigateToRegister}
          style={styles.registerButton}
        >
          <Text style={styles.registerText}>Dont have an account yet?</Text>
          <Text style={styles.registerText2}>Register</Text>
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
  inputText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 18,
    alignSelf: "flex-start",
    marginBottom: 10,
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
  registerButton: {
    alignItems: "center",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
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

export default LoginScreen;
