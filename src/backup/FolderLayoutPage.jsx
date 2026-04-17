import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Back from "../../assets/svg/back.svg";
import { Upload, UserPlus, Users, MessageCircle, Settings } from "lucide-react-native";
import ThemeButton from "../components/ThemeButton";
import { launchImageLibrary } from "react-native-image-picker";
const profile = require('../../assets/profile.jpg');



const FolderLayout = ({ navigation, route }) => {
  const { image, folderName, date, owner, photos = [] } = route.params || {};
  const [selectedTab, setSelectedTab] = useState("Gallery");
  const [uploadedImages, setUploadedImages] = useState([]);

  const handleUpload = () => {
    const options = {
      mediaType: "photo",
      includeBase64: false,
      quality: 0.8,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.errorCode) {
        console.log("ImagePicker Error: ", response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const selectedImage = response.assets[0];
        console.log("Selected image:", selectedImage.uri);
        setUploadedImages((prev) => [...prev, selectedImage.uri]);
      }
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Header Image */}
      <View style={styles.imageWrapper}>
        <Image source={image ? image : profile} style={styles.folderImage} />

        {/* Top Bar (Back & Settings) */}
        <View style={styles.topBar}>
          <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
            <View style={styles.iconButton}>
              <Back height={16} width={16} />
            </View>
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
            <View style={styles.iconButton}>
              <Settings size={18} />
            </View>
          </TouchableWithoutFeedback>
        </View>

        {/* Bottom Overlay */}
        <View style={styles.bottomOverlay}>
          <View>
            {folderName && <Text style={styles.folderHeading}>{folderName}</Text>}
            {date && (
              <Text style={styles.folderHeadingDate}>
                {new Date(date).toDateString()}
              </Text>
            )}
            {owner && (
              <View style={styles.profileIcon}>
                <Users color="#FFFFFF" width={16} height={16} />
                <Text style={{ color: "#FFFFFF" }}>{owner}</Text>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* Content Area */}
      <View style={styles.container}>
        {/* Upload + Add Member */}
        <View style={styles.rowBetween}>
          <ThemeButton
            text="Upload"
            icon={<Upload color="#fff" size={18} />}
            onPress={handleUpload}
            style={{ width: "78%" }}
          />
          <TouchableOpacity>
            <View style={styles.addMemberBtn}>
              <UserPlus width={20} height={20} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          {[
            { label: "Gallery", icon: <Upload width={16} height={16} color="#000" /> },
            { label: "Chat", icon: <MessageCircle width={16} height={16} color="#000" /> },
            { label: "Members", icon: <UserPlus width={16} height={16} color="#000" /> },
          ].map((tab, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.tabButton, selectedTab === tab.label && styles.tabButtonActive]}
              onPress={() => setSelectedTab(tab.label)}
            >
              {tab.icon}
              <Text
                style={[styles.tabText, selectedTab === tab.label && styles.tabTextActive]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab Content */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {selectedTab === "Gallery" && (
            <View style={styles.grid}>
              {uploadedImages.length === 0 ? (
                <Text style={styles.infoText}>No photos</Text>
              ) : (
                <View style={styles.imageWrapperRow}>


                  {/* Uploaded images - same grid style */}
                  {uploadedImages.map((uri, index) => (
                    <View key={`uploaded-${index}`} style={styles.imageGrid}>
                      <Image source={{ uri }} style={styles.photo} />
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}

          {selectedTab === "Chat" && (
            
            <Text style={styles.infoText}>Chat feature coming soon 💬</Text>
          )}

          {selectedTab === "Members" && (
            <Text style={styles.infoText}>Members list will appear here 👥</Text>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: -60,
    padding: 20,
    backgroundColor: "#FDF2F6",
  },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  topBar: {
    position: "absolute",
    top: 20,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    zIndex: 10,
  },
  iconButton: {
    backgroundColor: "#D9D9D9C7",
    padding: 8,
    borderRadius: 20,
  },
  imageWrapper: {
    position: "relative",
  },
  folderImage: {
    width: "100%",
    height: 250,
    resizeMode: "cover",
  },
  bottomOverlay: {
    position: "absolute",
    bottom: 90,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  folderHeading: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
  },
  folderHeadingDate: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "400",
    marginBottom: 8,
  },
  profileIcon: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  addMemberBtn: {
    paddingVertical: 21,
    paddingHorizontal: 25,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  tabsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginTop: 20,
    backgroundColor: "#F3F4F6",
    borderRadius: 40,
    paddingVertical: 8,
  },
  tabButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 22,
    paddingVertical: 6,
    borderRadius: 25,
  },
  tabButtonActive: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
  },
  tabText: {
    color: "#6B7280",
    fontSize: 15,
    fontWeight: "500",
  },
  tabTextActive: {
    color: "#000",
    fontWeight: "700",
  },
  scrollContainer: {
    padding: 20,
  },

  grid: {
    width: '100%',
    marginTop: 10,
    alignItems: 'center',
  },

  imageWrapperRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    gap: 15,
    width: '100%',
  },

  imageGrid: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#e5e7eb',
  },
  photo: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },


  infoText: {
    textAlign: "center",
    color: "#6B7280",
    marginTop: 20,
  },
});

export default FolderLayout;
