// LoginScreen.js
import React, { useState, useEffect } from "react";
import { View, TextInput, Button, TouchableOpacity, Text } from "react-native";
import { login } from "../services/authService";
import { useNavigation } from "@react-navigation/native";

const LoginScreen = ({ onLoginSuccess }) => {
  const navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    setError(null); // Reset error state before attempting login

    const response = await login(email, password);

    console.log(response);
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
    <View>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} />
      {error && <Text style={{ color: "red" }}>{error}</Text>}
      <TouchableOpacity onPress={navigateToRegister}>
        <Text>Register</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;

// ADD LOGIN INTO APP.JS
