import React, { useEffect, useState } from "react";
import {
  View,
  ActivityIndicator,
  Text,
  SafeAreaView,
  // StatusBar,
  Platform,
} from "react-native";
import { StatusBar } from "expo-status-bar";
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
import MedicationDetailScreen from "./medication/MedicationDetailScreen";
import AddMedicationScreen from "./medication/AddMedicationScreen";
import JournalScreen from "./journal/JournalScreen";
import ExercisesScreen from "./exercises/ExercisesScreen";
import AddExercisesScreen from "./exercises/AddExercisesScreen";
import StatisticsScreen from "./stats/StatisticsScreen";
import AboutScreen from "./AboutScreen";
import CustomFooter from "./snippets/CustomFooter";
import CustomHeader from "./snippets/CustomHeader";
import { FooterVisibilityProvider } from "./services/FooterVisibilityContext";

import * as Notifications from "expo-notifications";
import {
  fetchMedicationData,
  fetchJournalData,
  fetchUserData,
} from "./services/dataService";

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
  const [isLoading, setIsLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [medications, setMedications] = useState([]);
  const [journalEntries, setJournalEntries] = useState([]);
  const [userData, setUserData] = useState([]);

  const checkLoggedIn = async () => {
    try {
      const logged = await isLoggedIn();
      console.log(logged);
      setLoggedIn(logged);
    } finally {
      // fetchData();
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkLoggedIn();
    if (loggedIn) {
      fetchData(); // Fetch data after the loggedIn state has been updated
    }
  }, [loggedIn]);

  const fetchData = async () => {
    console.log(loggedIn);
    if (loggedIn) {
      try {
        const meds = await fetchMedicationData();
        const entries = await fetchJournalData();
        const user = await fetchUserData();
        setMedications(meds);
        setJournalEntries(entries);
        setUserData(user);
      } catch (error) {
        console.error("Error fetching data:", error);
        // Handle error (e.g., show error message, redirect to login screen, etc.)
      }
    }
  };

  const handleLoginSuccess = async () => {
    console.log("handleLoginSuccess called");
    await checkLoggedIn(); // Recheck login status after successful login
    // fetchData(); // Fetch data after successful login
  };

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    // <NavigationContainer>
    //   {loggedIn ? (
    //     <>
    //       <SafeAreaView style={{ flex: 1 }}>
    //         <Stack.Navigator screenOptions={{ headerShown: false }}>
    //           <Stack.Screen
    //             name="HomeScreen"
    //             options={{ unmountOnBlur: false }}
    //           >
    //             {(props) => (
    //               <HomeScreen
    //                 {...props}
    //                 onLogoutSuccess={checkLoggedIn}
    //                 medications={medications}
    //                 journalEntries={journalEntries}
    //               />
    //             )}
    //           </Stack.Screen>
    //           <Stack.Screen name="UserProfile" component={UserProfile} />
    //           <Stack.Screen
    //             name="EditUserProfile"
    //             component={EditUserProfile}
    //           />
    //           <Stack.Screen name="JournalScreen" component={JournalScreen} />
    //           <Stack.Screen
    //             name="MedicationScreen"
    //             component={MedicationScreen}
    //           />
    //           <Stack.Screen
    //             name="AddMedicationScreen"
    //             component={AddMedicationScreen}
    //           />
    //           <Stack.Screen
    //             name="ExercisesScreen"
    //             component={ExercisesScreen}
    //           />
    //           <Stack.Screen
    //             name="AddExercisesScreen"
    //             component={AddExercisesScreen}
    //           />
    //         </Stack.Navigator>
    //       </SafeAreaView>
    //       <Stack.Screen name="MenuScreen" component={MenuScreen} />
    //       <CustomFooter />
    //     </>
    //   ) : (
    //     <SafeAreaView style={{ flex: 1 }}>
    //       <Stack.Navigator screenOptions={{ headerShown: false }}>
    //         <Stack.Screen name="Login">
    //           {(props) => (
    //             <LoginScreen {...props} onLoginSuccess={handleLoginSuccess} />
    //           )}
    //         </Stack.Screen>
    //         <Stack.Screen name="Register" component={RegisterScreen} />
    //       </Stack.Navigator>
    //     </SafeAreaView>
    //   )}
    // </NavigationContainer>
    <NavigationContainer>
      {loggedIn ? (
        <>
          <SafeAreaView
            style={{
              flex: 1,
              paddingTop: 0,
              // paddingTop:
              //   Platform.OS === "android" ? StatusBar.currentHeight : 0,
            }}
          >
            <StatusBar style="dark" translucent={false} hidden={false} />
            <CustomHeader />

            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen
                name="HomeScreen"
                options={{ unmountOnBlur: false }}
              >
                {(props) => (
                  <HomeScreen
                    {...props}
                    onLogoutSuccess={checkLoggedIn}
                    medications={medications}
                    journalEntries={journalEntries}
                    userData={userData}
                  />
                )}
              </Stack.Screen>
              <Stack.Screen name="AboutScreen" component={AboutScreen} />
              <Stack.Screen name="UserProfile">
                {(props) => (
                  <UserProfile {...props} onLogoutSuccess={checkLoggedIn} />
                )}
              </Stack.Screen>

              <Stack.Screen
                name="EditUserProfile"
                component={EditUserProfile}
              />
              <Stack.Screen name="JournalScreen" component={JournalScreen} />
              <Stack.Screen
                name="MedicationScreen"
                component={MedicationScreen}
              />
              <Stack.Screen
                name="MedicationDetailScreen"
                component={MedicationDetailScreen}
              />
              <Stack.Screen
                name="AddMedicationScreen"
                component={AddMedicationScreen}
              />
              <Stack.Screen
                name="ExercisesScreen"
                component={ExercisesScreen}
              />
              <Stack.Screen
                name="AddExercisesScreen"
                component={AddExercisesScreen}
              />
              <Stack.Screen
                name="StatisticsScreen"
                component={StatisticsScreen}
              />
            </Stack.Navigator>
            <CustomFooter />
          </SafeAreaView>
          <Stack.Screen name="MenuScreen" component={MenuScreen} />
        </>
      ) : (
        // <SafeAreaView
        //   style={{
        //     flex: 1,
        //     paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        //   }}
        // >
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login">
            {(props) => (
              <LoginScreen {...props} onLoginSuccess={handleLoginSuccess} />
            )}
          </Stack.Screen>
          <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Navigator>
        // </SafeAreaView>
      )}
    </NavigationContainer>
  );
};

export default App;
