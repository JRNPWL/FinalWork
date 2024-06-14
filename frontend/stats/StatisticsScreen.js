// USER IS REQUIRED TO INSTALL HEALTH CONNECT

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  Image,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import {
  initialize,
  requestPermission,
  readRecords,
} from "react-native-health-connect";

const StatisticsScreen = () => {
  const [steps, setSteps] = useState(0);
  const [calories, setCalories] = useState(0);
  const [weight, setWeight] = useState(0);
  const [nutrition, setNutrition] = useState({});
  const [heartRate, setHeartRate] = useState([]);
  const [heartRateAverage, setHeartRateAverage] = useState([]);
  const [bloodGlucose, setBloodGlucose] = useState([]);
  const [bloodGlucoseAverage, setBloodGlucoseAverage] = useState([]);
  const [bloodPressure, setBloodPressure] = useState([]);
  const [bloodPressureSystolic, setBloodPressureSystolic] = useState(0);
  const [systolicBloodPressureAverage, setSystolicBloodPressureAverage] =
    useState(0);
  const [bloodPressureDiastolic, setBloodPressureDiastolic] = useState(0);
  const [diastolicBloodPressureAverage, setDiastolicBloodPressureAverage] =
    useState(0);
  const [oxygenSaturation, setOxygenSaturation] = useState([]);
  const [oxygenSaturationAverage, setOxygenSaturationAverage] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const Icon = {
    fire: require("../assets/statIcons/fire.png"),
    weight: require("../assets/statIcons/weight.png"),
    nutrition: require("../assets/statIcons/nutrition.png"),
    heart: require("../assets/statIcons/heart.png"),
    glucose: require("../assets/statIcons/glucose.png"),
    pressure: require("../assets/statIcons/pressure.png"),
    oxygen: require("../assets/statIcons/oxygen.png"),
  };

  const setupHealthConnect = async () => {
    try {
      const initialized = await initialize();
      if (!initialized) {
        console.error("Failed to initialize Health Connect");
        setIsLoading(false);
        return;
      }

      // TotalCaloriesBurned
      // Weight
      // Nutrition

      // HeartRate
      // BloodGlucose
      // BloodPressure
      // OxygenSaturation

      // SleepSession

      const permissions = [
        { accessType: "read", recordType: "ActiveCaloriesBurned" },
        { accessType: "read", recordType: "Steps" },
        { accessType: "read", recordType: "TotalCaloriesBurned" },
        { accessType: "read", recordType: "Weight" },
        { accessType: "read", recordType: "Nutrition" },
        { accessType: "read", recordType: "HeartRate" },
        { accessType: "read", recordType: "BloodGlucose" },
        { accessType: "read", recordType: "BloodPressure" },
        { accessType: "read", recordType: "OxygenSaturation" },
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

  const calculateHeartRateAverage = (heartRateData) => {
    let sum = 0;

    for (let entry of heartRateData) {
      sum += entry.bpm;
    }

    const numOfEntries = heartRateData.length;
    const average = numOfEntries > 0 ? sum / numOfEntries : 0;

    return average;
  };
  const calculateBloodPressureAverage = (bloodPressureData) => {
    let systolicSum = 0;
    let diastolicSum = 0;

    for (let entry of bloodPressureData) {
      systolicSum += entry.systolic;
      diastolicSum += entry.diastolic;
    }

    const numOfEntries = bloodPressureData.length;
    const systolicAverage = numOfEntries > 0 ? systolicSum / numOfEntries : 0;
    const diastolicAverage = numOfEntries > 0 ? diastolicSum / numOfEntries : 0;

    return { systolicAverage, diastolicAverage };
  };
  const calculateBloodGlucoseAverage = (bloodGlucoseData) => {
    let sum = 0;

    for (let entry of bloodGlucoseData) {
      sum += entry.level;
    }

    const numOfEntries = bloodGlucoseData.length;
    const average = numOfEntries > 0 ? sum / numOfEntries : 0;

    return average;
  };
  const calculateOxygenSaturationAverage = (oxygenSaturationData) => {
    let sum = 0;

    for (let entry of oxygenSaturationData) {
      sum += entry.saturation;
    }

    const numOfEntries = oxygenSaturationData.length;
    const average = numOfEntries > 0 ? sum / numOfEntries : 0;

    return average;
  };

  const fetchHealthData = async () => {
    // setIsLoading(true);

    // Mock data examples
    // const mockData = {
    //   ActiveCaloriesBurned: [
    //     {
    //       startTime: "2023-06-09T07:30:00Z",
    //       endTime: "2023-06-09T08:00:00Z",
    //       energyBurned: 120,
    //     },
    //     {
    //       startTime: "2023-06-09T12:00:00Z",
    //       endTime: "2023-06-09T12:30:00Z",
    //       energyBurned: 100,
    //     },
    //   ],
    //   Steps: [
    //     {
    //       startTime: "2023-06-09T07:30:00Z",
    //       endTime: "2023-06-09T08:00:00Z",
    //       count: 1500,
    //     },
    //     {
    //       startTime: "2023-06-09T12:00:00Z",
    //       endTime: "2023-06-09T12:30:00Z",
    //       count: 2000,
    //     },
    //   ],
    //   TotalCaloriesBurned: [
    //     {
    //       startTime: "2023-06-09T00:00:00Z",
    //       endTime: "2023-06-09T23:59:59Z",
    //       energyBurned: 2500,
    //     },
    //   ],
    //   Weight: [{ time: "2023-06-09T08:00:00Z", weight: 70.5 }],
    //   Nutrition: [
    //     {
    //       time: "2023-06-09T08:00:00Z",
    //       calories: 300,
    //       protein: 20,
    //       fat: 10,
    //       carbohydrates: 50,
    //     },
    //   ],
    //   HeartRate: [
    //     { time: "2023-06-09T07:30:00Z", bpm: 70 },
    //     { time: "2023-06-09T12:00:00Z", bpm: 85 },
    //   ],
    //   BloodGlucose: [
    //     { time: "2023-06-09T07:30:00Z", level: 90 },
    //     { time: "2023-06-09T12:00:00Z", level: 100 },
    //   ],
    //   BloodPressure: [
    //     { time: "2023-06-09T07:30:00Z", systolic: 120, diastolic: 80 },
    //     { time: "2023-06-09T12:00:00Z", systolic: 130, diastolic: 85 },
    //   ],
    //   OxygenSaturation: [
    //     { time: "2023-06-09T07:30:00Z", saturation: 98 },
    //     { time: "2023-06-09T12:00:00Z", saturation: 97 },
    //   ],
    // };

    // // Simulate fetching data with mock data
    // const steps = mockData["Steps"];
    // const totalSteps = steps.reduce((sum, cur) => sum + cur.count, 0);
    // setSteps(totalSteps);

    // const calories = mockData["TotalCaloriesBurned"][0].energyBurned;
    // setCalories(calories);

    // const weight = mockData["Weight"][0].weight;
    // setWeight(weight);

    // const nutrition = mockData["Nutrition"][0];
    // setNutrition(nutrition);

    // const heartRateData = mockData["HeartRate"];
    // setHeartRate(heartRateData);
    // const heartRateAverage = calculateHeartRateAverage(heartRateData);
    // setHeartRateAverage(heartRateAverage);

    // // Set blood glucose data and calculate average
    // const bloodGlucoseData = mockData["BloodGlucose"];
    // setBloodGlucose(bloodGlucoseData);
    // const bloodGlucoseAverage = calculateBloodGlucoseAverage(bloodGlucoseData);
    // setBloodGlucoseAverage(bloodGlucoseAverage);

    // // Set blood pressure data and calculate average
    // const bloodPressureData = mockData["BloodPressure"];
    // setBloodPressure(bloodPressureData);
    // const { systolicAverage, diastolicAverage } =
    //   calculateBloodPressureAverage(bloodPressureData);
    // setSystolicBloodPressureAverage(systolicAverage);
    // setDiastolicBloodPressureAverage(diastolicAverage);

    // // Set oxygen saturation data and calculate average
    // const oxygenSaturationData = mockData["OxygenSaturation"];
    // setOxygenSaturation(oxygenSaturationData);
    // const oxygenSaturationAverage =
    //   calculateOxygenSaturationAverage(oxygenSaturationData);
    // setOxygenSaturationAverage(oxygenSaturationAverage);

    if (!isInitialized) return;

    const startTime = new Date();
    startTime.setHours(0, 0, 0, 0);

    const endTime = new Date();
    endTime.setHours(23, 59, 59, 999);

    // Fetch the data with a minimum loading time of 500ms
    // const fetchData = async () => {
    //   const caloriesPromise = readRecords("ActiveCaloriesBurned", {
    //     timeRangeFilter: {
    //       operator: "between",
    //       startTime: startTime.toISOString(),
    //       endTime: endTime.toISOString(),
    //     },
    //   }).then((result) => {
    //     console.log(
    //       "Calories Retrieved record: ",
    //       JSON.stringify({ result }, null, 2)
    //     );
    //   });
    //   const stepsPromise = readRecords("Steps", {
    //     timeRangeFilter: {
    //       operator: "between",
    //       startTime: startTime.toISOString(),
    //       endTime: endTime.toISOString(),
    //     },
    //   }).then((steps) => {
    //     console.log(
    //       "Steps Retrieved record: ",
    //       JSON.stringify({ steps }, null, 2)
    //     );
    //     const totalSteps = steps.reduce((sum, cur) => sum + cur.count, 0);
    //     setSteps(totalSteps);
    //   });
    //   await Promise.all([caloriesPromise, stepsPromise]);
    // };
    try {
      const [
        activeCalories,
        steps,
        weight,
        nutrition,
        heartRate,
        bloodGlucose,
        bloodPressure,
        oxygenSaturation,
      ] = await Promise.all([
        readRecords("ActiveCaloriesBurned", {
          timeRangeFilter: {
            operator: "between",
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
          },
        }),
        readRecords("Steps", {
          timeRangeFilter: {
            operator: "between",
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
          },
        }),
        readRecords("Weight", {
          timeRangeFilter: {
            operator: "between",
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
          },
        }),
        readRecords("Nutrition", {
          timeRangeFilter: {
            operator: "between",
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
          },
        }),
        readRecords("HeartRate", {
          timeRangeFilter: {
            operator: "between",
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
          },
        }),
        readRecords("BloodGlucose", {
          timeRangeFilter: {
            operator: "between",
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
          },
        }),
        readRecords("BloodPressure", {
          timeRangeFilter: {
            operator: "between",
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
          },
        }),
        readRecords("OxygenSaturation", {
          timeRangeFilter: {
            operator: "between",
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
          },
        }),
      ]);

      setSteps(steps.reduce((sum, cur) => sum + cur.count, 0));
      setCalories(
        activeCalories.reduce((sum, cur) => sum + cur.energyBurned, 0)
      );
      if (weight.length > 0) setWeight(weight[0].weight);
      if (nutrition.length > 0) setNutrition(nutrition[0]);

      const heartRateAverage = calculateAverage(
        heartRate.map((entry) => entry.bpm)
      );
      const bloodGlucoseAverage = calculateAverage(
        bloodGlucose.map((entry) => entry.level)
      );
      const systolicAverage = calculateAverage(
        bloodPressure.map((entry) => entry.systolic)
      );
      const diastolicAverage = calculateAverage(
        bloodPressure.map((entry) => entry.diastolic)
      );
      const saturationAverage = calculateAverage(
        oxygenSaturation.map((entry) => entry.saturation)
      );

      setHeartRate(heartRateAverage);
      setBloodGlucose(bloodGlucoseAverage);
      setBloodPressureSystolic(systolicAverage);
      setBloodPressureDiastolic(diastolicAverage);
      setOxygenSaturation(saturationAverage);
    } catch (error) {
      console.error("Error fetching records:", error);
    } finally {
      setIsLoading(false);
    }

    const minimumLoadingTime = new Promise((resolve) => {
      setTimeout(resolve, 500);
    });

    await Promise.all([fetchData(), minimumLoadingTime]);

    setIsLoading(false);
  };

  useEffect(() => {
    setupHealthConnect();
  }, []);

  useEffect(() => {
    fetchHealthData();

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
        <Text style={styles.screenTitle}>Statistics</Text>
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
        {/* Activity */}
        <TouchableOpacity style={styles.itemContainerButton}>
          <View style={styles.cardContainer}>
            {/* TotalCaloriesBurned */}
            <Text style={styles.pageTitle}>Activity</Text>
            <View style={styles.itemContainer}>
              <View style={styles.detailsContainer}>
                <Text style={styles.pageTitleSub}>Total Calories Burned</Text>

                <View style={styles.detailsDirectionContainer}>
                  <Text style={styles.dataText}>{calories}</Text>
                  <Text style={styles.text}>kcal</Text>
                </View>
              </View>
              <View style={styles.iconContainer}>
                <Image source={Icon["fire"]} style={styles.icon} />
              </View>
            </View>
            {/* Weight */}
            <View style={styles.itemContainer}>
              <View style={styles.detailsContainer}>
                <Text style={styles.pageTitleSub}>Weight</Text>

                <View style={styles.detailsDirectionContainer}>
                  <Text style={styles.dataText}>{weight}</Text>
                  <Text style={styles.text}>kg</Text>
                </View>
              </View>
              <View style={styles.iconContainer}>
                <Image source={Icon["weight"]} style={styles.icon} />
              </View>
            </View>
            <View style={styles.itemContainer}>
              <View style={styles.detailsContainer}>
                <Text style={styles.pageTitleSub}>Steps</Text>

                <View style={styles.detailsDirectionContainer}>
                  <Text style={styles.dataText}>{steps}</Text>
                  <Text style={styles.text}>steps</Text>
                </View>
              </View>
              <View style={styles.iconContainer}>
                <Image source={Icon["weight"]} style={styles.icon} />
              </View>
            </View>
            {/* Nutrition */}
            {/* <Text style={styles.pageTitle}>Nutrition</Text>
            <View style={styles.itemContainer}>
              <View style={styles.detailsContainer}>
                <View style={styles.detailsDirectionContainer}>
                  <Text style={styles.dataText}>{nutrition.calories}</Text>
                  <Text style={styles.text}>Calories</Text>
                </View>
                <View style={styles.detailsDirectionContainer}>
                  <Text style={styles.dataText}>{nutrition.protein}</Text>
                  <Text style={styles.text}>Protein</Text>
                </View>
                <View style={styles.detailsDirectionContainer}>
                  <Text style={styles.dataText}>{nutrition.fat}</Text>
                  <Text style={styles.text}>Fat</Text>
                </View>
                <View style={styles.detailsDirectionContainer}>
                  <Text style={styles.dataText}>{nutrition.carbohydrates}</Text>
                  <Text style={styles.text}>Carbohydrates</Text>
                </View>
              </View>
              <View style={styles.iconContainer}>
                <Image source={Icon["nutrition"]} style={styles.icon} />
              </View>
            </View> */}
          </View>
        </TouchableOpacity>

        {/* Heart */}
        <TouchableOpacity style={styles.itemContainerButton}>
          {/* HeartRate */}
          <View style={styles.cardContainer}>
            <Text style={styles.pageTitle}>Heart</Text>
            <View style={styles.itemContainer}>
              <View style={styles.detailsContainer}>
                <View style={styles.detailsDirectionContainer}>
                  <Text style={styles.dataText}>{heartRateAverage}</Text>
                  <Text style={styles.text}>Heartrate</Text>
                </View>
              </View>
              <View style={styles.iconContainer}>
                <Image source={Icon["heart"]} style={styles.icon} />
              </View>
            </View>
            {/* BloodGlucose */}
            <Text style={styles.pageTitle}>Blood</Text>
            <View style={styles.itemContainer}>
              <View style={styles.detailsContainer}>
                <Text style={styles.pageTitleSub}>Blood Glucose</Text>
                <View style={styles.detailsDirectionContainer}>
                  <Text style={styles.dataText}>{bloodGlucoseAverage}</Text>
                  <Text style={styles.text}>mmol/L Average</Text>
                </View>
              </View>
              <View style={styles.iconContainer}>
                <Image source={Icon["glucose"]} style={styles.icon} />
              </View>
            </View>
            {/* BloodPressure */}
            <View style={styles.itemContainer}>
              <View style={styles.detailsContainer}>
                <Text style={styles.pageTitleSub}>Blood Pressure</Text>
                <View style={styles.detailsDirectionContainer}>
                  <Text style={styles.dataText}>
                    {systolicBloodPressureAverage}
                  </Text>
                  <Text style={styles.text}>Systolic Average</Text>
                </View>
                <View style={styles.detailsDirectionContainer}>
                  <Text style={styles.dataText}>
                    {diastolicBloodPressureAverage}
                  </Text>
                  <Text style={styles.text}>Diastolic Average</Text>
                </View>
              </View>
              <View style={styles.iconContainer}>
                <Image source={Icon["pressure"]} style={styles.icon} />
              </View>
            </View>
            {/* OxygenSaturation */}

            <View style={styles.itemContainer}>
              <View style={styles.detailsContainer}>
                <Text style={styles.pageTitleSub}>Blood Oxygen</Text>
                <View style={styles.detailsDirectionContainer}>
                  <Text style={styles.dataText}>
                    {oxygenSaturationAverage}%
                  </Text>
                  <Text style={styles.text}>Average</Text>
                </View>
              </View>
              <View style={styles.iconContainer}>
                <Image source={Icon["oxygen"]} style={styles.icon} />
              </View>
            </View>
          </View>
        </TouchableOpacity>

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
  screenTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    // paddingLeft: "10%",
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "bold",
    paddingLeft: "10%",
  },
  pageTitleSub: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 5,
  },
  itemContainerButton: {
    alignItems: "center",
    width: "95%",
    marginBottom: 5,
    marginTop: 5,
    paddingBottom: 10,
    paddingTop: 10,
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
  itemContainer: {
    alignItems: "center",
    width: "100%",
    flexDirection: "row",
    marginBottom: 10,
  },
  iconContainer: {
    width: "30%",
    alignItems: "center",
    justifyContent: "left",
  },
  icon: {
    width: 32,
    height: 32,
  },
  cardContainer: {
    justifyContent: "left",
    alignItems: "baseline",
    flexDirection: "column",
  },
  detailsContainer: {
    justifyContent: "left",
    alignItems: "baseline",
    flexDirection: "column",
    width: "70%",
    paddingLeft: "10%",
  },

  detailsDirectionContainer: {
    // justifyContent: "left",
    alignItems: "baseline",
    flexDirection: "row",
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
  dataText: {
    fontSize: 26,
    marginRight: 5,
  },
  text: {
    fontSize: 16,
  },
});

export default StatisticsScreen;
