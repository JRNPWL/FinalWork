import React, { useState, useEffect, useContext, useRef } from "react";
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
import { fetchJournalData } from "../services/dataService";
import CustomHeader from "../snippets/CustomHeader";
import CustomFooter from "../snippets/CustomFooter";

import FooterVisibilityContext from "../services/FooterVisibilityContext";

const JournalScreen = () => {
  const navigation = useNavigation();

  const [journalData, setJournalData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newEntryText, setNewEntryText] = useState("");
  const [displayedJournalData, setDisplayedJournalData] = useState([]);
  // const { isFooterVisible } = useContext(FooterVisibilityContext);

  const handleMenuPress = () => {
    navigation.push("MenuScreen");
  };

  useEffect(() => {
    // const fetchJournalData = async () => {
    //   try {
    //     const userId = await getUserId();

    //     if (!userId) {
    //       throw new Error("User is not logged in");
    //     }

    //     const apiUrl = `http://192.168.0.119:3000/api/journal/${userId}`;

    //     const response = await axios.get(apiUrl);
    //     setJournalData(response.data);
    //     setDisplayedJournalData(response.data.reverse()); // Reverse the order for display
    //     setLoading(false);
    //   } catch (error) {
    //     console.error("Error fetching journal data:", error);
    //     setLoading(false);
    //   }
    // };

    // fetchJournalData();

    const fetchJournal = async () => {
      try {
        const entries = await fetchJournalData();
        console.log(entries);
        setJournalData(entries);
        setDisplayedJournalData(entries.reverse());
        setLoading(false);
      } catch (error) {
        console.error("Error fetching journal entries:", error);
      }
    };

    fetchJournal();
  }, []);

  const handleAddEntry = async () => {
    try {
      const userId = await getUserId();

      if (!userId) {
        throw new Error("User is not logged in");
      }

      const apiUrl = `http://192.168.0.119:3000/api/journal/${userId}`;
      const currentDate = new Date();
      const response = await axios.post(apiUrl, {
        journalMessage: newEntryText,
        journalDate: currentDate,
      });

      setJournalData((prevData) => [response.data, ...prevData]);
      setDisplayedJournalData((prevData) => [
        {
          ...response.data,
          journalMessage: newEntryText,
          journalDate: currentDate,
        }, // Include thes new entry's mesage
        ...prevData,
      ]);
      setNewEntryText("");
    } catch (error) {
      console.error("Error adding journal entry:", error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* <CustomHeader
        title="Home"
        iconName="menu"
        onMenuPress={handleMenuPress}
      /> */}
      {/* <View style={styles.contentContainer}> */}
      <FlatList
        style={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        data={displayedJournalData}
        renderItem={({ item }) => (
          <View style={styles.entryCenterContainer}>
            <View style={styles.entryContainer}>
              <Text style={styles.label}>
                {new Date(item.journalDate).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                })}
              </Text>
              <View style={styles.entryTextContainer}>
                <Text style={styles.text}>{item.journalMessage}</Text>
              </View>
            </View>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
        inverted={true} // Display newest entries at the top
      />
      <View style={styles.inputCenterContainer}>
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

      {/* </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    paddingBottom: 80, // Keep same number as footer+20
    backgroundColor: "white",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    paddingBottom: 20, // List is reversed, add padding to bottom to add to top
    width: "100%",
  },
  entryCenterContainer: {
    alignItems: "center",
  },
  entryContainer: {
    width: "90%",
    marginBottom: 20,
  },
  entryTextContainer: {
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 6,
    // backgroundColor: "lightgrey",
    // backgroundColor: "#F2f2f2",
    backgroundColor: "#F8F8F8",
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
  inputCenterContainer: {
    alignItems: "center",
  },
  inputContainer: {
    width: "90%",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
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
