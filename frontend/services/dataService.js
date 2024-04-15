import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUserId } from "./authService";
import axios from "axios";

export const fetchMedicationData = async () => {
  try {
    const userId = await getUserId();

    // Extra Check, routes are protected. User schouldnt even be able to see the page without already being logged in.
    if (!userId) {
      throw new Error("User is not logged in");
    }

    const apiUrl = `http://192.168.0.119:3000/api/medications/${userId}`;

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

export const fetchJournalData = async () => {
  try {
    const userId = await getUserId();

    if (!userId) {
      throw new Error("User is not logged in");
    }

    const apiUrl = `http://192.168.0.119:3000/api/journal/${userId}`;

    const response = await axios.get(apiUrl);
    return response.data;
    setDisplayedJournalData(response.data.reverse()); // Reverse the order for display
    setLoading(false);
  } catch (error) {
    console.error("Error fetching journal data:", error);
    setLoading(false);
  }
};
