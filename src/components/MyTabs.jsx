import React from "react";
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import LinearGradient from "react-native-linear-gradient";

// Screens
import HomeStack from "../navigation/HomeStack";
import MemberList from "../screen/MyHives";
import ClickPhoto from "../screen/ClickPhoto";
import Profile from "../screen/Profile";
import CreateHive from "../screen/CreateHive";

// Icons
import { Camera, CirclePlus, House, MessageCircle, UserRound, Image as ImagePhoto } from "lucide-react-native";
import CustomText from "./CustomText";

// responsive
import { Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");
const scale = width / 390;
const vscale = height / 844;
const rs = (value) => Math.round(value * scale);
const rvs = (value) => Math.round(value * vscale);


//image
const createHiveLogo = require("../../assets/createHiveLogo.png");

const Tab = createBottomTabNavigator();

function CustomTabBar({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets();
  const currentRoute = state.routes[state.index].name;

  // Hide bottom tab bar on Camera screen
  if (currentRoute === "Camera" || currentRoute === "PhotoShare") {
    return null;
  }

  return (
    <View style={[styles.wrapper, { paddingBottom: insets.bottom }]}>
      {/* Bottom Navigation Bar */}
      <View style={styles.container}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          let Icon;
          switch (route.name) {
            case "HomeScreen":
              Icon = (
                <View style={{ alignItems: 'center', gap: 2 }}>
                  {isFocused ? (
                    <View
                      style={{ padding: 10, borderRadius: 16, }}
                    >
                      <House width={rs(26)} height={rs(26)} color='#F442A5' strokeWidth={1.2} />
                    </View>
                  ) : (
                    <View style={{ padding: 10, borderRadius: 16 }}>
                      <House width={rs(26)} height={rs(26)} color='#6B7280' strokeWidth={1.2} />
                    </View>
                  )}
                  {/* <CustomText weight="mideum" style={{ color: '#6B7280' }}>Home</CustomText> */}
                </View>
              );
              break;

            case "Profile":
              Icon = (
                <View style={{ alignItems: 'center', gap: 2 }}>
                  {isFocused ? (
                    <View

                      style={{ padding: 10, borderRadius: 16 }}
                    >
                      <UserRound width={rs(26)} height={rs(26)} color='#F442A5' strokeWidth={1.2} />
                    </View>
                  ) : (
                    <View style={{ padding: 10, borderRadius: 16 }}>
                      <UserRound width={rs(26)} height={rs(26)} color='#6B7280' strokeWidth={1.2} />
                    </View>
                  )}
                  {/* <CustomText weight="mideum" style={{ color: '#6B7280' }}>Profile</CustomText> */}
                </View>
              );
              break;

            case "CreateHive":
              Icon = (
                <View style={{ alignItems: "center", width: 70 }}>

                  {/* Floating Button Wrapper */}
                  <View
                    style={{


                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >

                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={onPress}
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: 35,
                        backgroundColor: "#fff",

                        borderWidth: 3,
                        borderColor: "#F441A5",

                        alignItems: "center",
                        justifyContent: "center",


                      }}
                    >
                      <Image
                        source={createHiveLogo}
                        resizeMode="contain"
                        style={{
                          width: 38,
                          height: 38,
                        }}
                      />
                    </TouchableOpacity>

                  </View>
                </View>
              );
              break;
            case "Messages":
              Icon = (
                <View style={{ alignItems: 'center', gap: 2 }}>
                  {isFocused ? (
                    <View

                      style={{ padding: 10, borderRadius: 16 }}
                    >
                      <ImagePhoto width={rs(26)} height={rs(26)} color='#F442A5' strokeWidth={1.2} />
                    </View>
                  ) : (
                    <View style={{ padding: 10, borderRadius: 16 }}>
                      <ImagePhoto width={rs(26)} height={rs(26)} color='#6B7280' strokeWidth={1.2} />
                    </View>
                  )}
                  {/* <CustomText weight="mideum" style={{ color: '#6B7280' }}>My Hives</CustomText> */}
                </View>
              );
              break;

            case "Camera":
              Icon = (
                <View style={{ alignItems: 'center', gap: 2 }}>
                  {isFocused ? (
                    <View

                      style={{ padding: 10, borderRadius: 16 }}
                    >
                      <Camera width={rs(26)} height={rs(26)} color='#F442A5' strokeWidth={1.2} />
                    </View>
                  ) : (
                    <View style={{ padding: 10, borderRadius: 16 }}>
                      <Camera width={rs(26)} height={rs(26)} color='#6B7280' strokeWidth={1.2} />
                    </View>
                  )}
                  {/* <CustomText weight="mideum" style={{ color: '#6B7280' }}>Camera</CustomText> */}
                </View>
              );
              break;

            default:
              Icon = <CustomText>{route.name}</CustomText>;
          }
          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={styles.tabButton}
              activeOpacity={0.8}
            >
              {Icon}
              {isFocused && <View style={styles.underline} />}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen name="HomeScreen" component={HomeStack} />
      <Tab.Screen name="Messages" component={MemberList} />
      <Tab.Screen name="CreateHive" component={CreateHive} />
      <Tab.Screen name="Camera" component={ClickPhoto} />
      <Tab.Screen name="Profile" component={Profile} />


    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    backgroundColor: "#fff",
    borderTopWidth: 0.3,
    borderTopColor: '#e0e0e0'
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 80,
    borderTopWidth: 0.3,
    borderTopColor: "#f5f4f3",
    width: "100%",
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});