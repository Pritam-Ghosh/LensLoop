import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, TouchableWithoutFeedback } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useNotification } from "../context/NotificationContext";
import MaskedView from "@react-native-masked-view/masked-view";
const logo = require("../../assets/logo.png");
import { colors } from '../Theme/theme';
import { Bell, Search } from "lucide-react-native";
import LinearGradient from "react-native-linear-gradient";
import CustomText from "./CustomText";




// responsive
import { Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");
const scale = width / 390;
const vscale = height / 844;
const rs = (value) => Math.round(value * scale);
const rvs = (value) => Math.round(value * vscale);

const TopNav = () => {
  const navigation = useNavigation();
  const { notifications, unreadCount } = useNotification();



  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <Image
          source={logo}
          style={{
            width: rs(90),
            height: rvs(40),
            resizeMode: "contain",
          }}
        />

      </View>

      <View style={{ flexDirection: 'row', gap: 18 }}>


        <TouchableOpacity
          style={styles.bellWrapper}
          onPress={() => navigation.navigate("Notification")}
        >
          <Bell width={rs(24)} height={rs(24)} color={'#D142BB'} strokeWidth={1.5} />
          {unreadCount > 0 && (
            <View
              style={styles.badge}
            >
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          )}
        </TouchableOpacity>



      </View>



    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 65,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: rs(14),
    borderBottomWidth: 0.3,
    borderBottomColor: "#f5f4f3",
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconGradient: {
    borderRadius: 12,
    padding: 8,
  },
  snapText: {
    fontSize: 22,
    fontWeight: "700",
  },
  bellWrapper: {
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -6,
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 1,
    minWidth: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
});

export default TopNav;
