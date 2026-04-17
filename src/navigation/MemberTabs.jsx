// currenly this file is not using anywhare in the project

// src/navigation/MemberTabs.jsx
import React from 'react';
import { Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Import your actual screens (Members should be your existing MemberList UI)
import Members from '../screen/Members';
import Chats from '../screen/Chats';
import CameraTab from '../screen/CameraTab';
import Profile from '../screen/Profile';

// If you use SVG assets like before:
import NavPeople from '../../assets/svg/navPeople.svg';
import NavMessage from '../../assets/svg/navMessage.svg';
import NavCamera from '../../assets/svg/navCamera.svg';
import NavHome from '../../assets/svg/navHome.svg';

const Tab = createBottomTabNavigator();

export default function MemberTabs() {
  const insets = useSafeAreaInsets(); // keep tab above Android soft nav

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,            // hide stack header for each tab screen
        tabBarShowLabel: false,        // we'll use icons only (change to true to show labels)
        // customize tab bar style and respect safe area bottom inset
        tabBarStyle: {
          position: 'absolute',
          height: 56 + insets.bottom,
          paddingBottom: insets.bottom,
          paddingTop: 6,
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
          elevation: 10,
        },

        // Provide tabBarIcon using route.name
        tabBarIcon: ({ focused }) => {
          // You can change size or swap icons when focused
          const iconSize = route.name === 'Camera' ? 30 : 22;
          if (route.name === 'Members') {
            return <NavPeople width={iconSize} height={iconSize} />;
          }
          if (route.name === 'Chats') {
            return <NavMessage width={iconSize} height={iconSize} />;
          }
          if (route.name === 'Camera') {
            return <NavCamera width={iconSize} height={iconSize} />;
          }
          if (route.name === 'Profile') {
            return <NavHome width={iconSize} height={iconSize} />;
          }
          return null;
        },
      })}
    >
      <Tab.Screen name="Members" component={Members} />
      <Tab.Screen name="Chats" component={Chats} />
      <Tab.Screen name="Camera" component={CameraTab} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}
