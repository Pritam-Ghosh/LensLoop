import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { updateProfile } from "../API/API"
import { launchImageLibrary } from "react-native-image-picker";
import { uploadImageToFirebase } from "../utils/firebaseUpload";

import {
  ChevronRight, Crown, Languages, LogOut, Share2,
  QrCode,
  MessageCircle,
  Heart,
} from "lucide-react-native";
import Toast from "react-native-toast-message";
// SVGs
import Pencil from "../../assets/svg/pencil.svg";

// Components
import ScreenLayout from "../components/ScreenLayout";
import CustomText from "../components/CustomText";
import PremiumModal from "../components/PremiumModal";
import ThemeButton from "../components/ThemeButton";
import { colors } from "../Theme/theme";

// Images
const createEvent = require("../../assets/background.png");
const profilePic = require("../../assets/profile.jpg");

const EditScreen = ({ navigation, }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);
  // Load user info from AsyncStorage

  useEffect(() => {
    (async () => {
      const userData = await AsyncStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        const nameParts = user.name ? user.name.split(" ") : [];
        setFirstName(nameParts[0] || "");
        setLastName(nameParts.slice(1).join(" ") || "");
        setEmail(user.email || "");
        setProfileImage(user.profileImage || null);
      }
    })();
  }, []);

  const handlePickImage = async () => {
    const options = {
      mediaType: "photo",
      quality: 1,
      includeBase64: false,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) return;
      if (response.errorMessage) {
        Toast.show({
          type: "error",
          text1: "Image Picker Error",
          text2: response.errorMessage,
        });
        return;
      }


      const uri = response.assets && response.assets[0]?.uri;
      if (uri) {
        setProfileImage(uri);
      }
    });
  };

  const handleSave = async () => {
    try {
      if (!firstName && !lastName && !email && !profileImage) {
        Toast.show({
          type: "info",
          text1: "Nothing to Update",
          text2: "Please update at least one field or change image",
        });
        return;
      }

      setLoading(true);

      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Toast.show({
          type: "error",
          text1: "Session Expired",
          text2: "Please login again",
        });
        return;
      }

      const name = `${firstName} ${lastName}`.trim();

      // ✅ JSON payload (NOT FormData)
      const payload = {
        name,
        email,
      };

      if (profileImage && profileImage.startsWith("file")) {
        const storedUser = await AsyncStorage.getItem("user");
        if (!storedUser) throw new Error("User missing");

        const userId = JSON.parse(storedUser)._id;

        Toast.show({
          type: "info",
          text1: "Uploading Profile Photo",
          autoHide: false,
          position: "top",
        });

        const firebaseUrl = await uploadImageToFirebase(
          { uri: profileImage },
          userId,
          "profile"
        );

        Toast.hide();

        payload.profileImage = firebaseUrl;
      }

      const response = await updateProfile(payload, token);

      await AsyncStorage.setItem("user", JSON.stringify(response.data.user));

      Toast.show({
        type: "success",
        text1: "Profile Updated",
        text2: response.data.message || "Your profile was updated successfully",
      });

      navigation.navigate("MyTabs");

    } catch (error) {
      console.log("❌ Error updating profile:", error);

      Toast.show({
        type: "error",
        text1: "Update Failed",
        text2: error.response?.data?.message || "Failed to update profile",
      });

    } finally {
      setLoading(false);
    }
  };



  return (
    <ScreenLayout
      navigation={navigation}
      image={createEvent}
      folderName="Janifer Danis"
      date="+91 1841 510 1450"


      OverlayContent={
        <View style={styles.profileOverlay}>
          <View style={styles.photoContainer}>
            <TouchableOpacity onPress={handlePickImage}>
              <Image
                source={
                  profileImage
                    ? { uri: profileImage }
                    : require("../../assets/profile.jpg")
                }
                style={styles.profileImage}
              />
            </TouchableOpacity>
          </View>
          <View>
            <CustomText weight="semiBold" style={styles.profileName}>
              {firstName} {lastName}
            </CustomText>
            <CustomText style={styles.profileNumber}>
              {email}
            </CustomText>
          </View>
        </View>
      }
    >

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >


        <View style={styles.inputWrapper}>
          <CustomText weight="medium" style={styles.blockText}>
            First Name
          </CustomText>
          <TextInput
            style={styles.input}
            value={firstName}
            onChangeText={setFirstName}
            placeholder="e.g. Danis"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputWrapper}>
          <CustomText weight="medium" style={styles.blockText}>
            Last Name
          </CustomText>
          <TextInput
            style={styles.input}
            value={lastName}
            onChangeText={setLastName}
            placeholder="e.g. Janifer (optinoal)"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputWrapper}>
          <CustomText weight="medium" style={styles.blockText}>
            Email
          </CustomText>
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
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    marginTop: 70,
    paddingHorizontal: 33,
    paddingBottom: 120,
  },

  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  profileName: {
    textAlign: "center",
    color: colors.primary,
    fontSize: 20,
  },
  profileNumber: {
    color: colors.primary,
    fontSize: 14,
  },



  photoContainer: { alignItems: "center" },
  photo: { width: 120, height: 120, borderRadius: 60 },
  inputWrapper: { marginBottom: 20 },
  blockText: { marginBottom: 6, color: "#333" },
  input: {
    borderWidth: 1,
    borderColor: "#EFEFEF",
    backgroundColor: '#F7F7F7',
    borderRadius: 8,
    padding: 10,
    paddingVertical: 18,
    color: "#000",
  },
});

export default EditScreen;
