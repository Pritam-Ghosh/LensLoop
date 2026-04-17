import React, { useState } from "react";
import { View, Text, Alert, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
 
// svg
import QR from "../../assets/svg/qr.svg";
import Language from "../../assets/svg/language.svg";
import Premium from "../../assets/svg/premium.svg";
import RightArrow from "../../assets/svg/rightArrow.svg";
import NavMessage from "../../assets/svg/navMessage.svg";
import Heart from "../../assets/svg/heart.svg";
import Share from "../../assets/svg/share.svg";
import Pencil from "../../assets/svg/pencil.svg";
import AsyncStorage from "@react-native-async-storage/async-storage";
// components
import FolderLayout from "../components/FolderLayout";
import PremiumModal from "../components/PremiumModal";
import CustomText from '../components/CustomText';
const createEvent = require("../../assets/profile.jpg");
const beforeImage = require("../../assets/selfie.jpg");
const afterImage = require("../../assets/dp3.jpg");
 
const CreateEventFive = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");
      Alert.alert("Logout", "You have been logged out.", [
        { text: "OK", onPress: () => navigation.navigate("Landing") },
      ]);
    } catch (err) {
      Alert.alert("Error", "Failed to logout. Please try again.");
    }
  };

 
  return (
    <FolderLayout
      navigation={navigation}
      image={createEvent}
      folderName="Janifer Danis"
      date="+91 1841 510 1450"
      RightIcon={<Pencil height={16} width={16} onPress={() => navigation.navigate("EditProfile")} />}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Account Section */}
        <CustomText weight="medium" style={styles.category}>Account</CustomText>
        <TouchableOpacity style={styles.rowProfile} onPress={() => navigation.navigate("Language")}>
          <View style={styles.iconBox}><Language width={20} height={20} /></View>
          <View style={styles.textBox}>
            <CustomText weight="bold" style={styles.title}>Language</CustomText>
            <CustomText weight="medium" style={styles.subtitle}>English</CustomText>
          </View>
          <RightArrow />
        </TouchableOpacity>
 
 
 
        <TouchableOpacity style={styles.rowProfile} onPress={handleLogout}>
          <View style={styles.iconBox}><QR width={20} height={20} /></View>
          <View style={styles.textBox}>
            <CustomText weight="bold" style={styles.title}>Logout</CustomText>
            <CustomText weight="medium" style={styles.subtitle}>redirect to landing page</CustomText>
          </View>
          <RightArrow />
        </TouchableOpacity>
 
        {/* Benefit Section */}
        <CustomText weight="medium" style={styles.category}>Benefit</CustomText>
        <TouchableOpacity style={styles.rowProfile} onPress={() => setModalVisible(true)}>
          <View style={styles.iconBox}><Premium width={20} height={20} /></View>
          <View style={styles.textBox}>
            <CustomText weight="bold" style={styles.title}>Premium</CustomText>
            <CustomText weight="medium" style={styles.subtitle}>Unlock all features</CustomText>
          </View>
          <RightArrow />
        </TouchableOpacity>
 
        {/* Other Section */}
        <CustomText weight="medium" style={styles.category}>Other</CustomText>
        <TouchableOpacity style={styles.rowProfile} onPress={() => navigation.navigate("ContactUs")}>
          <View style={styles.iconBox}><NavMessage width={20} height={20} /></View>
          <View style={styles.textBox}>
            <CustomText weight="bold" style={styles.title}>Contact Us</CustomText>
            <CustomText weight="medium" style={styles.subtitle}>Get support anytime</CustomText>
          </View>
          <RightArrow />
        </TouchableOpacity>
 
        <TouchableOpacity style={styles.rowProfile} onPress={() => navigation.navigate("YourOpinion")}>
          <View style={styles.iconBox}><Heart width={20} height={20} /></View>
          <View style={styles.textBox}>
            <CustomText weight="bold" style={styles.title}>Give us feedback</CustomText>
            <CustomText weight="medium" style={styles.subtitle}>Love the app? Leave us a review</CustomText>
          </View>
          <RightArrow />
        </TouchableOpacity>
 
        <TouchableOpacity style={styles.rowProfile} onPress={() => navigation.navigate("NewPage")}>
          <View style={styles.iconBox}><Share width={20} height={20} /></View>
          <View style={styles.textBox}>
            <CustomText weight="bold" style={styles.title}>Share the app</CustomText>
            <CustomText weight="medium" style={styles.subtitle}>Invite your friends to try snaphive</CustomText>
          </View>
          <RightArrow />
        </TouchableOpacity>
 
 
 
 
        {/* Modal */}
        <PremiumModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          beforeImage={beforeImage}
          afterImage={afterImage}
        />
 
      </ScrollView>
    </FolderLayout>
  );
};
 
const styles = StyleSheet.create({
  scrollContainer: { padding: 20, paddingBottom: 80 },
  category: { fontSize: 14, fontWeight: "600", color: "#666", marginBottom: 12, marginTop: 20, textTransform: "uppercase" },
  rowProfile: { flexDirection: "row", alignItems: "center", paddingVertical: 14, borderRadius: 12, marginBottom: 15 },
  iconBox: { width: 32, height: 32, borderRadius: 16, justifyContent: "center", alignItems: "center", marginRight: 12 },
  textBox: { flex: 1 },
  title: { fontSize: 16, fontWeight: "500", color: "#1C1C1C" },
  subtitle: { fontSize: 13, color: "#888", marginTop: 2 },
});
 
export default CreateEventFive;