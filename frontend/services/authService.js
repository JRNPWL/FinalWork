import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const AUTH_TOKEN_KEY = "@auth_token";
const DEV_IP = "192.168.0.119:3000";

export const register = async (name, email, password, profilePicture) => {
  try {
    console.log(profilePicture);
    const apiUrl = "http://192.168.0.119:3000/api/users";

    const postData = {
      name: name,
      email: email,
      password: password,
      profilePicture: profilePicture,
    };

    const response = await axios.post(apiUrl, postData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    // const token = response.data.userId;
    // console.log(token)
    // await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
    console.log(response);
    return true;
  } catch (error) {
    console.error("Error registering user:", error);
    return false;
  }
};

export const login = async (email, password) => {
  try {
    const apiUrl = `http://${DEV_IP}/api/login`;

    const postData = {
      email: email,
      password: password,
    };

    const response = await axios.post(apiUrl, postData);
    const token = response.data.userId;
    await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
    return true;
  } catch (error) {
    console.error("Error logging in:", error);
    return false;
  }
};

export const logout = async () => {
  try {
    await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
    console.log(token);
  } catch (error) {
    console.error("Error logging out:", error);
  }
};

export const isLoggedIn = async () => {
  try {
    const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
    return token !== null;
  } catch (error) {
    console.error("Error checking if user is logged in:", error);
    return false;
  }
};

export const getUserId = async () => {
  try {
    const userId = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
    return userId;
  } catch (error) {
    console.error("Error getting userId:", error);
    return null;
  }
};
