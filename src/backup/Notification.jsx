import React, { useEffect } from "react";
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useNotification } from "../context/NotificationContext"; // Import context
import TopNav from "../components/TopNavbar";
import BackNavigator from "../../assets/svg/backNavigator.svg";
import CreateAlbum from "../../assets/svg/createAlbum.svg";
import CreateFolder from "../../assets/svg/createFolder.svg";

// Local images
const dp = require("../../assets/dp.jpg");
const dp2 = require("../../assets/dp2.webp");

const NotificationScreen = ({ navigation }) => {
  const { notifications, setNotifications } = useNotification(); // Use global context

  useEffect(() => {
    const fetchNotifications = async () => {
      const data = [
        { id: 1, name: "Demola Aoki", time: "4hrs", image: dp, iconType: "album" },
        { id: 2, name: "Quency Demola", time: "4hrs", image: dp2, iconType: "folder" },

      ];
      setNotifications(data); //  Update global notifications
    };
    fetchNotifications();
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <TopNav />

        <ScrollView style={styles.scrollContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <BackNavigator width={20} height={20} style={{ marginTop: 10 }} />
          </TouchableOpacity>
          <Text style={{ fontSize: 18, fontWeight: "600", marginTop: 10 }}>Notifications</Text>

          <View style={{ flexDirection: "row", gap: 10, marginVertical: 20 }}>
            <View style={[styles.badge, styles.badgeActive]}>
              <Text style={styles.badgeText}>Today</Text>
            </View>
          </View>

          <View style={styles.chatList}>
            {notifications.map((item) => (
              <View key={item.id} style={styles.chatListItem}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 15 }}>
                  <Image source={item.image} style={styles.dp} />
                  <View>
                    <Text style={{ fontSize: 15, fontWeight: "500" }}>{item.name}</Text>
                    <Text style={{ color: "#A8A8A8", fontSize: 12 }}>{item.time}</Text>
                  </View>
                </View>

                {item.iconType === "album" ? (
                  <CreateAlbum width={30} height={30} />
                ) : (
                  <CreateFolder width={30} height={30} />
                )}
              </View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scrollContainer: { paddingHorizontal: 20, paddingVertical: 10 },
  badge: { backgroundColor: "gray", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 5 },
  badgeText: { color: "white", fontSize: 14, fontWeight: "600" },
  badgeActive: { backgroundColor: "black" },
  chatList: { marginBottom: 20 },
  chatListItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FAFAFA",
    gap: 15,
    marginBottom: 20,
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 10,
  },
  dp: { width: 51, height: 51, borderRadius: 25, resizeMode: "cover" },
});

export default NotificationScreen;
