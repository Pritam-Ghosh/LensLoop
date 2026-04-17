import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Screens
import HomeStack from "../navigation/HomeStack";
import MemberList from "../screen/MemberList";
import ClickPhoto from "../screen/ClickPhoto";
import Profile from "../screen/Profile";
import PhotoShare from "../screen/PhotoShare";

// Icons
import CameraTab from "../../assets/svg/cameraTab.svg";
import NavHome from "../../assets/svg/navHome.svg";
import NavMessage from "../../assets/svg/navMessage.svg";
import NavPeople from "../../assets/svg/navPeople.svg";


const Tab = createBottomTabNavigator();

function CustomTabBar({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets();
  const currentRoute = state.routes[state.index].name;

  // Hide bottom tab bar on Camera screen
  if (currentRoute === "Camera" ||currentRoute === "PhotoShare" ) {
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
              Icon = <NavHome width={32} height={32} />;
              break;
            case "MemberList":
              Icon = <NavPeople width={32} height={32} />;
              break;
            case "PhotoShare":
              Icon = (
                <View style={styles.fabWhite}>
                  <View style={styles.fab}>
                    <Text style={styles.fabText}>+</Text>
                  </View>
                </View>
              );
              break;
            case "Messages":
              Icon = <NavMessage width={32} height={32} />;
              break;
            case "Camera":
              Icon = <CameraTab width={32} height={32} />;
              break;
            default:
              Icon = <Text>{route.name}</Text>;
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
      <Tab.Screen name="PhotoShare" component={PhotoShare} />
      <Tab.Screen name="Camera" component={ClickPhoto} />
      <Tab.Screen name="MemberList" component={Profile} />
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
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 70,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    width: "100%",
    paddingHorizontal: 40,
  },
  tabButton: {
    alignItems: "center",
    justifyContent: "center",
  },
  underline: {
    marginTop: 4,
    height: 3,
    width: 24,
    borderRadius: 2,
    backgroundColor: "black",
  },
  fabWhite: {
    width: 100,
    height: 100,
    backgroundColor: "#ffffffff",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: -80,
    zIndex: 10,
    
  },
  fab: {
    width: 70,
    height: 70,
    borderRadius: 50,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",

    borderWidth: 15,

    // iOS Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    // Android Shadow
    elevation: 8,
  },
  fabText: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "bold",
  },
});