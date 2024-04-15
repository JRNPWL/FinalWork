import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Assuming you're using Expo for icons
import { useNavigation } from "@react-navigation/native";

function CustomHeader({ title, iconName, onMenuPress }) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        height: 60,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
      }}
    >
      <Text>{title}</Text>
      <TouchableOpacity onPress={onMenuPress}>
        <Ionicons name={iconName} size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
}

export default CustomHeader;
