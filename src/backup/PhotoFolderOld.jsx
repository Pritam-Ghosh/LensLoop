import React from "react";
import { View, Text, StyleSheet, Image, ScrollView, TouchableWithoutFeedback, } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Back from "../../assets/svg/back.svg";
import ThreeDot from "../../assets/svg/threeDot.svg";
import Cloud from "../../assets/svg/cloud.svg";

// Example images
const folderImage = require("../../assets/folderImage.png");
const folderImageList = require("../../assets/folderImageList.webp");

const PhotoFolder = ({ navigation, route }) => {
  // Get dynamic params
  const { folderName, date, owner } = route.params || {
    folderName: "Untitled Folder",
    date: "Unknown Date",
    owner: "NA",
  };

  return (
    <SafeAreaView>
      {/* Header image section */}
      <View style={styles.imageWrapper}>
        <Image source={folderImage} style={styles.folderImage} />

        {/* Top bar with back & menu */}
        <View style={styles.topBar}>
          <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
            <View style={styles.iconButton}>
              <Back height={16} width={16} />
            </View>
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback
            onPress={() => console.log("3 dots pressed")}
          >
            <View style={styles.iconButton}>
              <ThreeDot height={16} width={16} />
            </View>
          </TouchableWithoutFeedback>
        </View>

        {/* Bottom overlay (left + right) */}
        <View style={styles.bottomOverlay}>
          {/* Left side */}
          <View>
            <Text style={styles.folderHeading}>{folderName}</Text>
            <Text style={styles.folderHeadingDate}>{date}</Text>
            <View style={styles.profileIcon}>
              <Text style={{ color: "#FFFFFF" }}>{owner}</Text>
            </View>
          </View>

          {/* Right side */}
          <TouchableWithoutFeedback>
            <View style={styles.inviteButton}>
              <Text style={styles.inviteText}>+ invite a friend</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>

      {/* Content list */}
      <ScrollView style={styles.container}>
        <View>
          <Text style={styles.folderText}>Photo Folder</Text>
        </View>

        <View style={styles.photoFolder}>
          <Image source={folderImageList} style={styles.folderImageList} />
          <View>
            <Text style={styles.folderText}>Tour</Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                width: 120,
                marginTop: 6,
              }}
            >
              <Text>10 items</Text>
              <Text>Sep 15</Text>
            </View>
          </View>
        </View>

        <TouchableWithoutFeedback>
          <View style={styles.uploadBtn}>
            <Cloud height={22} width={22} />
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    top: -60,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 40,
    height: "100%",
  },

  /* Top icons */
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

  /* Header image */
  imageWrapper: {
    position: "relative",
  },
  folderImage: {
    width: "100%",
    height: 250,
    resizeMode: "cover",
  },

  /* Bottom overlay */
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
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#ED3C50",
    justifyContent: "center",
    alignItems: "center",
  },
    inviteButton: {
        backgroundColor: "rgba(0,0,0,0.4)",
        paddingVertical: 6,
        paddingHorizontal: 13,
        borderRadius: 15,
    },
    inviteText: {
        color: "#fff",
        fontSize: 15,
        fontWeight: "600",
    },

  /* Folder list */
  photoFolder: {
    borderWidth: 1,
    borderColor: "#E9E9E9",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    marginTop: 20,
  },
  folderText: {
    fontSize: 17,
    fontWeight: "600",
  },
  folderImageList: {
    width: 104,
    height: 84,
    resizeMode: "cover",
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  uploadBtn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    right: 30,
    top: 250,
    backgroundColor: "#000000",
    width: 60,
    height: 60,
    borderRadius: 30,
  },
});

export default PhotoFolder;
