import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUserId } from "./authService";
import axios from "axios";

const DEV_IP = "192.168.0.119:3000";

export const fetchMedicationData = async () => {
  try {
    const userId = await getUserId();

    // Extra Check, routes are protected. User schouldnt even be able to see the page without already being logged in.
    if (!userId) {
      throw new Error("User is not logged in");
    }

    const apiUrl = `http://${DEV_IP}/api/medications/${userId}`;

    const response = await axios.get(apiUrl);
    if (Array.isArray(response.data)) {
      const formattedData = response.data.map((medication) => ({
        ...medication,
        time: new Date(medication.time).toLocaleTimeString([], {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
        }),
      }));
      return formattedData;
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    setLoading(false);
  }
};

export const addMedication = async (
  name,
  dosage,
  frequency,
  selectedDate,
  selectedTime
) => {
  try {
    const userId = await getUserId();

    const apiUrl = `http://${DEV_IP}/api/medications/${userId}`;

    const formattedTime = selectedTime.toLocaleTimeString([], {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    });

    const postData = {
      userId: userId,
      name: name,
      dosage: dosage,
      frequency: frequency,
      time: formattedTime,
    };

    const response = await axios.post(apiUrl, postData);

    console.log(response);
    return true;
  } catch (error) {
    console.error("Error adding exercise:", error);
    return false;
  }
};

export const fetchExercisesData = async () => {
  try {
    const userId = await getUserId();

    // Extra Check, routes are protected. User schouldnt even be able to see the page without already being logged in.
    if (!userId) {
      throw new Error("User is not logged in");
    }

    const apiUrl = `http://192.168.0.119:3000/api/exercises/${userId}`;

    const response = await axios.get(apiUrl);
    if (Array.isArray(response.data)) {
      return response.data; // Set medicationData to the array of medication objects
      //   console.log(response.data);

      //   response.data.forEach((medication) => {
      //     console.log(medication);
      //     scheduleNotificationsForReminders(
      //       medication.reminders,
      //       medication.name
      //     );
      //   });
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    setLoading(false);
  }
};

export const addExercise = async (userId, name, sets, reps, iconName) => {
  try {
    const userId = await getUserId();

    const apiUrl = `http://${DEV_IP}/api/exercises/${userId}`;

    const postData = {
      name: name,
      sets: sets,
      reps: reps,
      icon: iconName,
    };

    const response = await axios.post(apiUrl, postData);

    console.log(response);
    return true;
  } catch (error) {
    console.error("Error adding exercise:", error);
    return false;
  }
};

export const fetchJournalData = async () => {
  try {
    const userId = await getUserId();

    if (!userId) {
      throw new Error("User is not logged in");
    }

    const apiUrl = `http://${DEV_IP}/api/journal/${userId}`;

    const response = await axios.get(apiUrl);
    return response.data;
    setDisplayedJournalData(response.data.reverse()); // Reverse the order for display
    setLoading(false);
  } catch (error) {
    console.error("Error fetching journal data:", error);
    setLoading(false);
  }
};

export const fetchUserData = async () => {
  try {
    const userId = await getUserId();

    // Extra Check, routes are protected. User schouldnt even be able to see the page without already being logged in.
    if (!userId) {
      throw new Error("User is not logged in");
    }

    const apiUrl = `http://${DEV_IP}/api/users/${userId}`;

    const response = await axios.get(apiUrl);
    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    setLoading(false);
  }
};

export const fetchUserProfilePic = async () => {
  try {
    const userId = await getUserId();

    // Extra Check, routes are protected. User schouldnt even be able to see the page without already being logged in.
    if (!userId) {
      throw new Error("User is not logged in");
    }

    const photoApiUrl = `http://${DEV_IP}/api/users/${userId}/profilePicture`;
    const response = await axios.get(photoApiUrl);
    return response;
  } catch {
    console.error("Error fetching user profile picture:", error);
  }
};
