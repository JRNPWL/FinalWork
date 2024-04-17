// App.js

import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, Text, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { isLoggedIn } from "./services/authService";
import LoginScreen from "./user/LoginScreen";
import RegisterScreen from "./user/RegisterScreen";
import HomeScreen from "./HomeScreen";
import UserProfile from "./user/UserProfile";
import EditUserProfile from "./user/EditUserProfile";
import MenuScreen from "./MenuScreen";
import MedicationScreen from "./medication/MedicationScreen";
import AddMedicationScreen from "./medication/AddMedicationScreen";
import JournalScreen from "./journal/JournalScreen";
import ExercisesScreen from "./exercises/ExercisesScreen";
import AddExercisesScreen from "./exercises/AddExercisesScreen";

import * as Notifications from "expo-notifications";
import { fetchMedicationData, fetchJournalData } from "./services/dataService";

const Stack = createStackNavigator();

function SplashScreen() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Getting token...</Text>
      <ActivityIndicator size="large" />
    </View>
  );
}

const App = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [loggedIn, setLoggedIn] = useState(false);

  const [medications, setMedications] = useState([]);
  const [journalEntries, setJournalEntries] = useState([]);

  const checkLoggedIn = async () => {
    try {
      const logged = await isLoggedIn();
      setLoggedIn(logged);
      console.log(logged);
    } finally {
      setIsLoading(false);
    }
  };

  // React.useEffect(() => {
  //   checkLoggedIn();
  // }, []);

  useEffect(() => {
    checkLoggedIn();

    // Fetch medications data
    const fetchMedications = async () => {
      try {
        const meds = await fetchMedicationData();
        console.log(meds);
        setMedications(meds);
      } catch (error) {
        console.error("Error fetching medications:", error);
      }
    };

    // Fetch journal entries data
    const fetchJournal = async () => {
      try {
        const entries = await fetchJournalData();
        console.log(entries);
        setJournalEntries(entries);
      } catch (error) {
        console.error("Error fetching journal entries:", error);
      }
    };

    // Fetch data when the component mounts
    fetchMedications();
    fetchJournal();
  }, []);

  const handleLoginSuccess = () => {
    checkLoggedIn(); // Recheck login status after successful login
    console.log(loggedIn);
  };

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {loggedIn ? (
          <>
            <Stack.Screen name="HomeScreen">
              {(props) => (
                <HomeScreen
                  {...props}
                  onLogoutSuccess={handleLoginSuccess}
                  medications={medications}
                  journalEntries={journalEntries}
                />
              )}
            </Stack.Screen>
            <Stack.Screen name="UserProfile" component={UserProfile} />
            <Stack.Screen name="EditUserProfile" component={EditUserProfile} />
            <Stack.Screen name="JournalScreen" component={JournalScreen} />
            <Stack.Screen
              name="MedicationScreen"
              component={MedicationScreen}
            />
            <Stack.Screen
              name="AddMedicationScreen"
              component={AddMedicationScreen}
            />
            <Stack.Screen name="ExercisesScreen" component={ExercisesScreen} />
            <Stack.Screen
              name="AddExercisesScreen"
              component={AddExercisesScreen}
            />
            <Stack.Screen name="MenuScreen" component={MenuScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login">
              {(props) => (
                <LoginScreen {...props} onLoginSuccess={handleLoginSuccess} />
              )}
            </Stack.Screen>
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
        {/* <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            headerShown: false,
          }}
        /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
