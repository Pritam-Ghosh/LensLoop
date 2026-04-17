
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// screens
import MainScreen from "../screen/MainScreen";
import FolderLayout from "../screen/FolderLayout";
import Notification from "../screen/Notification";
import InviteMember from "../screen/InviteMember";
import EditHive from "../screen/EditHive";
import Home from "../screen/Home";
const Stack = createNativeStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainScreen" component={MainScreen} />
      <Stack.Screen name="FolderLayout" component={FolderLayout} />
      <Stack.Screen name="Notification" component={Notification} />
      <Stack.Screen name="InviteMember" component={InviteMember} />
      <Stack.Screen name="EditHive" component={EditHive} />
            <Stack.Screen name="Home" component={Home} />
    </Stack.Navigator>
  );
}
