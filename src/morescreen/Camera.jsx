import React from "react";
import { View, Button, StyleSheet } from "react-native";
import { launchCamera } from "react-native-image-picker";

export default function CameraExample() {
  const openCamera = () => {
    launchCamera(
      {
        mediaType: "photo", // or "video"
        cameraType: "back", // back or front
        saveToPhotos: true,
      },
      (response) => {
        if (response.didCancel) {
          console.log("User cancelled camera");
        } else if (response.errorCode) {
          console.log("Error: ", response.errorMessage);
        } else {
          console.log("Photo URI: ", response.assets[0].uri);
        }
      }
    );
  };

  return (
    <View style={styles.container}>
      <Button title="Open Camera" onPress={openCamera} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
