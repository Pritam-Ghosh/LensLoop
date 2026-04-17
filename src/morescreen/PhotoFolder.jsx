import React, { useState } from "react";
import { View, Image, StyleSheet, ScrollView } from "react-native";
import FolderLayout from "../screen/FolderLayout";
import ThreeDot from "../../assets/svg/threeDot.svg";
import ThemeButton from "../components/ThemeButton";

// Images
const createEvent = require("../../assets/createEvent.png");


const PhotoFolder = ({ navigation, route }) => {
  const [code, setCode] = useState("");

  const { folderName, date, owner } = route.params || {
    folderName: "Untitled Folder",
    date: "Unknown Date",
    owner: "NA",
  };

  // Get photos from route params (selected from PhotoShare)
  const eventPhotos = route.params?.eventPhotos || [];
  
  // Fallback to default images if no photos selected
  const defaultImages = [picnic1, picnic2, picnic3, picnic4];
  const images = eventPhotos.length > 0 ? eventPhotos : defaultImages;

  return (
    <FolderLayout
      navigation={navigation}
      image={createEvent}
      folderName="Photo Folder"
      date="Sep 19"
      owner="A"
      inviteText="+ invite a friend"
      onInvitePress={() => navigation.navigate("InviteHiveMember")}
      RightIcon={<ThreeDot height={16} width={16} />}
    >
      {/*  Main Content */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.grid}>
          {images.map((img, index) => (
            <View key={index} style={styles.photoContainer}>
              <Image 
                source={typeof img === 'object' && img.uri ? { uri: img.uri } : img} 
                style={styles.photo} 
              />
            </View>
          ))}
        </View>
      </ScrollView>

      {/*  Continue button (optional) */}
      {/* 
      <ThemeButton
        text="Continue"
        onPress={() => navigation.navigate("CreateEventTwo")}
        style={{ marginTop: 31 }}
      /> 
      */}
    </FolderLayout>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 20,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    gap: 12,
  },
  photoContainer: {
    width: "30%", 
    aspectRatio: 1, 
    borderRadius: 6,
    overflow: "hidden",
    marginBottom: 15,
  },
  photo: {
    width: "100%",
    height: "100%",
  },
});

export default PhotoFolder;