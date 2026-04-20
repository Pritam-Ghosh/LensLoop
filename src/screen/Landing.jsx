import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Dimensions, Animated } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Logo from "../components/Logo";

const { width, height } = Dimensions.get("window");

const Landing = ({ navigation }) => {
 
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {

    Animated.parallel([
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,   
        tension: 80,
        useNativeDriver: true,
      }),
    ]).start();


    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const user = await AsyncStorage.getItem("user");

        if (token && user) {
          navigation.replace("MyTabs");
        } else {
          navigation.replace("Signup");
        }
      } catch (error) {
        console.log("Auto-login check error:", error);
        navigation.replace("Signup");
      }
    };

   
    const timer = setTimeout(() => {
      checkLoginStatus();
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.centerContainer}>
          <Animated.View
            style={{
              opacity: opacityAnim,
              transform: [{ scale: scaleAnim }],
            }}
          >
            <Logo style={{ width: 260, height: 260 }} />
          </Animated.View>

        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Landing;