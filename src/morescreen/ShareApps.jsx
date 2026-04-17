import React from "react";
import { View, Text, Image, StyleSheet, TouchableWithoutFeedback } from "react-native";
import FolderLayout from "../screen/FolderLayout";
import Cloud from "../../assets/svg/cloud.svg";
import QR from "../../assets/svg/qr.svg";
import ShareApp from "../../assets/svg/shareApp.svg";
import ThemeButton from "../components/ThemeButton";
const folderImage = require("../../assets/folderImage.png");
const folderImageList = require("../../assets/folderImageList.webp");

const NewPage = ({ navigation, route }) => {
  const { folderName, date, owner } = route.params || {
    folderName: "Untitled Folder",
    date: "Unknown Date",
    owner: "NA",
  };

  return (
    <FolderLayout
      navigation={navigation}
      image={folderImage}
      folderName="My Folder"
      date="Sep 19"
      owner="A"
      inviteText="+ invite a friend"
      RightIcon={<QR height={16} width={16} />}
    >
      {/*  unique screen content */}
      <View style={{ flex: "1", alignItems: "center",marginTop: 55, marginBottom: 15, justifyContent: 'center',paddingInline: 20 }}>
        <ShareApp width={106} height={140} />

      <Text style={styles.shareText}>Send this link to your friends to give them a preview of snaphive and its centralization and sharing features. They will be redirected to the App Store or Play Store.</Text>

      <ThemeButton
        text="Copy the link"
        onPress={() => navigation.navigate("Listing")}
        style={{marginTop: 10}}
      />
      
      </View>
    </FolderLayout>
  );
};

const styles = StyleSheet.create({
  photoFolder: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  folderImageList: { width: 80, height: 80, marginRight: 12, borderRadius: 12 },
  folderText: { fontSize: 16, fontWeight: "500" },
  uploadBtn: {
    marginTop: 20,
    backgroundColor: "#f2f2f2",
    padding: 12,
    borderRadius: 50,
    alignSelf: "center",
  },
  shareText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#000000",
    textAlign: "center",
    marginVertical: 30,
    lineHeight: 18,
  }
});

export default NewPage;
