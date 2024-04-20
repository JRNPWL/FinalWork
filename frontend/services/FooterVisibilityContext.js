// FooterVisibilityContext.js
import React, { createContext, useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";

const FooterVisibilityContext = createContext();

export const FooterVisibilityProvider = ({ children }) => {
  const [isFooterVisible, setIsFooterVisible] = useState(true); // Initial visibility state
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = navigation.addListener("state", () => {
      const routeName = navigation.getCurrentRoute().name;
      // Define the screens where the footer should be visible
      const visibleScreens = [
        "HomeScreen",
        "UserProfile",
        "EditUserProfile",
        "JournalScreen",
        "MedicationScreen",
        "AddMedicationScreen",
        "ExercisesScreen",
        "AddExercisesScreen",
      ];
      setIsFooterVisible(visibleScreens.includes(routeName));
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <FooterVisibilityContext.Provider value={{ isFooterVisible }}>
      {children}
    </FooterVisibilityContext.Provider>
  );
};

export default FooterVisibilityContext;
