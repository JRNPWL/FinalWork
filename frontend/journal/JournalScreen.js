import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  TextInput,
  Button,
  FlatList,
} from "react-native";
import { getUserId } from "../services/authService";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

const JournalScreen = () => {
  const navigation = useNavigation();

  const [journalData, setJournalData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newEntryText, setNewEntryText] = useState("");
  const [displayedJournalData, setDisplayedJournalData] = useState([]);

  const navigateToEditProfile = async () => {
    navigation.navigate("EditUserProfile");
  };

  useEffect(() => {
    const fetchJournalData = async () => {
      try {
        const userId = await getUserId();

        if (!userId) {
          throw new Error("User is not logged in");
        }

        const apiUrl = `http://192.168.0.119:3000/api/journal/${userId}`;

        const response = await axios.get(apiUrl);
        setJournalData(response.data);
        setDisplayedJournalData(response.data.reverse()); // Reverse the order for display
        setLoading(false);
      } catch (error) {
        console.error("Error fetching journal data:", error);
        setLoading(false);
      }
    };

    fetchJournalData();
  }, []);

  const handleAddEntry = async () => {
    try {
      const userId = await getUserId();

      if (!userId) {
        throw new Error("User is not logged in");
      }

      const apiUrl = `http://192.168.0.119:3000/api/journal/${userId}`;
      const response = await axios.post(apiUrl, {
        journalMessage: newEntryText,
      });

      setJournalData((prevData) => [response.data, ...prevData]);
      setDisplayedJournalData((prevData) => [
        { ...response.data, journalMessage: newEntryText }, // Include the new entry's message
        ...prevData,
      ]);
      setNewEntryText("");
    } catch (error) {
      console.error("Error adding journal entry:", error);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={displayedJournalData}
        renderItem={({ item }) => (
          <View style={styles.entryContainer}>
            <Text style={styles.label}>Entry</Text>
            <View style={styles.entryTextContainer}>
              <Text style={styles.text}>{item.journalMessage}</Text>
            </View>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
        inverted={true} // Display newest entries at the top
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newEntryText}
          onChangeText={setNewEntryText}
          placeholder="Add a new journal entry..."
          onSubmitEditing={handleAddEntry}
        />
        <Button title="Add Entry" onPress={handleAddEntry} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  entryContainer: {
    marginBottom: 20,
  },
  entryTextContainer: {
    backgroundColor: "lightgrey",
    padding: 10,
    borderRadius: 15,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  input: {
    flex: 1,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "lightgrey",
    borderRadius: 10,
    padding: 10,
  },
});

export default JournalScreen;
