// USER IS REQUIRED TO INSTALL HEALTH CONNECT

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import {
  initialize,
  requestPermission,
  readRecords,
} from "react-native-health-connect";

const StatisticsScreen = () => {
  const [steps, setSteps] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const setupHealthConnect = async () => {
    try {
      const initialized = await initialize();
      if (!initialized) {
        console.error("Failed to initialize Health Connect");
        setIsLoading(false);
        return;
      }

      const permissions = [
        { accessType: "read", recordType: "ActiveCaloriesBurned" },
        { accessType: "read", recordType: "Steps" },
      ];

      const grantedPermissions = await requestPermission(permissions);
      if (!grantedPermissions) {
        console.error("Failed to grant permissions");
        setIsLoading(false);
        return;
      }

      setIsInitialized(true);
      setIsLoading(false);
    } catch (error) {
      console.error("Error during setup:", error);
      setIsLoading(false);
    }
  };

  // const requestPermissionsAgain = async () => {
  //   try {
  //     const permissions = [
  //       { accessType: "read", recordType: "ActiveCaloriesBurned" },
  //       { accessType: "read", recordType: "Steps" },
  //     ];

  //     const grantedPermissions = await requestPermission(permissions);
  //     if (!grantedPermissions) {
  //       console.error("Failed to grant permissions");
  //       return;
  //     }

  //     // If permissions are granted, re-fetch the data
  //     fetchHealthData();
  //   } catch (error) {
  //     console.error("Error requesting permissions again:", error);
  //   }
  // };

  const fetchHealthData = async () => {
    setIsLoading(true);

    if (!isInitialized) return;

    const startTime = new Date();
    startTime.setHours(0, 0, 0, 0);

    const endTime = new Date();
    endTime.setHours(23, 59, 59, 999);

    // Fetch the data with a minimum loading time of 500ms
    const fetchData = async () => {
      const caloriesPromise = readRecords("ActiveCaloriesBurned", {
        timeRangeFilter: {
          operator: "between",
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
        },
      }).then((result) => {
        console.log(
          "Calories Retrieved record: ",
          JSON.stringify({ result }, null, 2)
        );
      });

      const stepsPromise = readRecords("Steps", {
        timeRangeFilter: {
          operator: "between",
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
        },
      }).then((steps) => {
        console.log(
          "Steps Retrieved record: ",
          JSON.stringify({ steps }, null, 2)
        );
        const totalSteps = steps.reduce((sum, cur) => sum + cur.count, 0);
        setSteps(totalSteps);
      });

      await Promise.all([caloriesPromise, stepsPromise]);
    };

    const minimumLoadingTime = new Promise((resolve) => {
      setTimeout(resolve, 500);
    });

    await Promise.all([fetchData(), minimumLoadingTime]);

    setIsLoading(false);

    // console.log(steps);

    // const totalSteps = steps.reduce((sum, cur) => sum + cur.count, 0);
    // setSteps(totalSteps);
    // if (steps && steps.result) {
    //   const totalSteps = steps.reduce((sum, cur) => sum + cur.count, 0);
    //   setSteps(totalSteps);
    // } else {
    //   console.error("No records found");
    //   setSteps(0);
    // }
    // } catch (error) {
    //   console.error("Error fetching records:", error);
    // }
  };

  useEffect(() => {
    setupHealthConnect();
  }, []);

  useEffect(() => {
    if (isInitialized) {
      fetchHealthData();
    }
  }, [isInitialized]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Text style={styles.pageTitle}>Medication</Text>
      </View>
      <ScrollView
        contentContainerStyle={{
          justifyContent: "center",
          width: "100%",
          paddingLeft: 10,
          paddingRight: 10,
        }}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        <Text style={styles.text}>Steps: {steps}</Text>
        <Button title="Refresh Data" onPress={fetchHealthData} />
      </ScrollView>
      {/* </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 65, // Keep same number as footer+20
    paddingTop: 10, // Keep same number as header+20
    backgroundColor: "white",
    paddingLeft: 0,
    marginLeft: 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  topContainer: {
    width: "90%",
    marginLeft: "7%",
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  addMeds: {
    flexDirection: "row",
    marginBottom: 20,
    alignItems: "center",
  },
  addMedsText: {
    fontSize: 16,
    marginRight: 3,
  },
  // alignContainer: {
  //   // width: "100%",
  //   alignItems: "center",
  //   // marginBottom: 20,
  // },
  dateGroup: {
    width: "95%",
    // marginBottom: 20,
  },
  dateText: {
    marginLeft: "4%",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  medicationContainerButton: {
    alignItems: "center",
    width: "100%",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 6,
    backgroundColor: "#F8F8F8",
    borderRadius: 15,
  },
  medicationContainer: {
    alignItems: "center",
    width: "100%",
    marginBottom: 10,
  },
  infoContainer: {
    width: "100%",
    flexDirection: "row",
    // backgroundColor: "#F8F8F8",
    padding: 15,
    // borderRadius: 15,
  },
  iconContainer: {
    width: "30%",
    alignItems: "center",
    justifyContent: "center",
  },
  detailsContainer: {
    justifyContent: "center",
    width: "40%",
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "right",
    width: "30%",
  },
  infoBottomContainer: {
    flexDirection: "column",
  },
  label: {
    fontSize: 17,
    fontWeight: "bold",
  },
  timeText: {
    fontSize: 26,
  },
  text: {
    fontSize: 16,
  },
});

export default StatisticsScreen;
