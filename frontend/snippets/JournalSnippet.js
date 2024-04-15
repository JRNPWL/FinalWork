// JournalSnippet.js

import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const JournalSnippet = ({ navigation, journalEntries }) => {
  const navigateToJournalScreen = () => {
    navigation.navigate("JournalScreen");
  };

  return (
    <TouchableOpacity onPress={navigateToJournalScreen}>
      <View style={styles.container}>
        <Text style={styles.title}>Journal</Text>
        {journalEntries.slice(0, 3).map((entry, index) => (
          <View key={index} style={styles.entryContainer}>
            <Text>{entry.journalMessage}</Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f0f0f0",
    padding: 20,
    marginBottom: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  entryContainer: {
    marginBottom: 10,
  },
});

export default JournalSnippet;
