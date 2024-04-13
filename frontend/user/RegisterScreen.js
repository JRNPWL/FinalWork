import React, { useState } from "react";
import { View, TextInput, Button, TouchableOpacity, Text } from "react-native";
import { register } from "../services/authService";
import { useNavigation } from "@react-navigation/native";

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

  const navigateToRegister = () => {
    navigation.navigate("Register");
  };

  return (
    <View>
      <TextInput placeholder="Name" value={name} onChangeText={setName} />
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <input
        type="file"
        accept="image/*"
        onChange={handleChooseProfilePicture}
      />
      <Button title="Login" onPress={handleRegister} />
      {error && <Text style={{ color: "red" }}>{error}</Text>}
      <TouchableOpacity onPress={navigateToRegister}>
        <Text>Register</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RegisterScreen;
