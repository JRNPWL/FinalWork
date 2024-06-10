import React, { useState, useEffect, useCallback } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import {
  fetchMedicationData,
  fetchJournalData,
  fetchUserData,
} from "./services/dataService";
import MedicationSnippet from "./snippets/MedicationSnippet";
import JournalSnippet from "./snippets/JournalSnippet";
import UserSnippet from "./snippets/UserSnippet";

const HomeScreen = ({
  // onLogoutSuccess,
  navigation,
  // medications,
  // journalEntries,
  // userData,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [medications, setMedications] = useState([]);
  const [journalEntries, setJournalEntries] = useState([]);
  const [userData, setUserData] = useState([]);

  const currentDate = new Date();
  // Format the date as "Month Day" (e.g., "January 8")
  const formattedDate = currentDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });

  const fetchData = async () => {
    const meds = await fetchMedicationData();
    const entries = await fetchJournalData();
    const user = await fetchUserData();
    setMedications(meds);
    setJournalEntries(entries);
    setUserData(user);
  };

  useEffect(() => {
    fetchData();
    setIsLoading(false); //
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        <View style={styles.contentContainer}>
          <View style={styles.dateContainer}>
            <Text style={styles.dateTitle}>Today</Text>
            <Text style={styles.dateText}>{formattedDate}</Text>
          </View>
          <View style={styles.titleContainer}>
            <Text style={styles.pageAlign}>text</Text>
            <Text style={styles.pageTitle}>Dashboard</Text>
          </View>
        </View>

        <UserSnippet navigation={navigation} userData={userData} />
        <MedicationSnippet navigation={navigation} medications={medications} />
        <JournalSnippet
          navigation={navigation}
          journalEntries={journalEntries}
        />
      </ScrollView>
      {/* )} */}
      {/* <CustomFooter /> */}
      {/* {isFooterVisible && <CustomFooter />} */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    backgroundColor: "white",
    paddingBottom: 40, // Keep same number as footer+20
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContainer: {
    // padding: 20,
    paddingTop: 15,
  },
  contentContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  titleContainer: {
    width: "60%",
    alignItems: "flex-end",
    paddingRight: 20,
  },
  dateContainer: {
    width: "40%",
    flexDirection: "column",
    alignItems: "flex-start",
    paddingLeft: 20,
  },
  dateTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "grey",
  },
  dateText: {
    fontSize: 28,
    fontWeight: "bold",
  },
  pageAlign: {
    fontSize: 14,
    fontWeight: "bold",
    color: "white",
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: "bold",
  },
});

export default HomeScreen;
