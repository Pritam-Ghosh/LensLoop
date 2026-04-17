import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet, Image, TextInput, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FolderLayout from "../components/FolderLayout";
import ThemeButton from "../components/ThemeButton";
import CustomText from "../components/CustomText";
import Pencil from "../../assets/svg/pencil.svg";
import { updateProfile } from '../API/API';
const profileImage = require("../../assets/profile.jpg");

const EditScreen = ({ navigation }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
  try {
    if (!firstName && !lastName && !email) {
      Alert.alert("Error", "Please fill at least one field to update");
      return;
    }

    setLoading(true);

    const token = await AsyncStorage.getItem("token");
    if (!token) {
      Alert.alert("Error", "User not logged in");
      return;
    }
    const name = `${firstName} ${lastName}`.trim();
    const response = await updateProfile({ name, email }, token);
    await AsyncStorage.setItem("user", JSON.stringify(response.data.user));
    Alert.alert("Success", response.data.message);
    navigation.navigate("MyTabs");
  } catch (error) {
    Alert.alert("Error", error.response?.data?.message || "Failed to update profile");
  } finally {
    setLoading(false);
  }
  };


  return (
    <FolderLayout
      navigation={navigation}
      image={profileImage}
      folderName="Edit Profile"
      date="+91 1841 510 1450"
      RightIcon={<Pencil height={16} width={16} onPress={() => {}} />}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.photoContainer}>
          <Image source={profileImage} style={styles.photo} />
        </View>

        <View style={styles.inputWrapper}>
          <CustomText weight="medium" style={styles.blockText}>First Name</CustomText>
          <TextInput
            style={styles.input}
            value={firstName}
            onChangeText={setFirstName}
            placeholder="e.g. Danis"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputWrapper}>
          <CustomText weight="medium" style={styles.blockText}>Last Name</CustomText>
          <TextInput
            style={styles.input}
            value={lastName}
            onChangeText={setLastName}
            placeholder="e.g. Jennifer"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputWrapper}>
          <CustomText weight="medium" style={styles.blockText}>Email</CustomText>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="e.g. danis@gmail.com"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <ThemeButton
          text={loading ? "Saving..." : "Save Changes"}
          onPress={handleSave}
          style={{ marginTop: 50 }}
          disabled={loading}
        />
      </ScrollView>
    </FolderLayout>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 20,
    alignItems: "center",
  },
  photoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 0,
    marginBottom: 15,
    borderWidth: 6,
    borderColor: "#F2F2F2",
  },
  photo: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  inputWrapper: {
    width: "100%",
    marginTop: 10,
  },
  blockText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1C1C1C",
    marginBottom: 8,
  },
  input: {
    borderColor: "#F7F7F7",
    backgroundColor: "#EFEFEF",
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#000",
  },
});

export default EditScreen;
