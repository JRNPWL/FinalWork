import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const JournalSnippet = ({ navigation, journalEntries }) => {
  const navigateToJournalScreen = () => {
    navigation.navigate("JournalScreen");
  };

  if (!journalEntries || journalEntries.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Journal</Text>
        <View style={styles.alignContainer}>
          <View style={styles.noJournalDetailsContainer}>
            <Text style={styles.noJournalDataText}>
              No Journal Data Available
            </Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Journal</Text>
      <View style={styles.alignContainer}>
        <TouchableOpacity
          onPress={navigateToJournalScreen}
          style={styles.medicationContainer}
        >
          {/* <View style={styles.medicationContainer}> */}
          {journalEntries.slice(0, 3).map((entry, index) => (
            <View key={index} style={styles.entryContainer}>
              <Text style={styles.label}>
                {new Date(entry.journalDate).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                })}
              </Text>
              <Text>{entry.journalMessage}</Text>
            </View>
          ))}
          {/* </View> */}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // backgroundColor: "#f0f0f0",
    backgroundColor: "white",
    // padding: 20,
    marginBottom: 20,
    // borderRadius: 10,
    width: "100%",
  },
  alignContainer: {
    alignItems: "center",
  },
  medicationContainer: {
    width: "90%",
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 6,
    borderRadius: 25,
    padding: 10,
    paddingTop: 15,
    paddingBottom: 15,
    // backgroundColor: "lightgrey",
    // backgroundColor: "#F2f2f2",
    backgroundColor: "#F6F6F6",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    paddingLeft: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    // marginRight: 10,
  },
  entryContainer: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 20,
    borderBottomWidth: 1,
    borderColor: "lightgrey",
  },
  noJournalDetailsContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "90%",
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 6,
    borderRadius: 25,
    padding: 10,
    paddingBottom: 20,
    backgroundColor: "#F6F6F6",
  },
  noJournalDataText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "grey",
  },
});

export default JournalSnippet;
