import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, TouchableWithoutFeedback, TextInput } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
//component
import ThemeButton from '../components/ThemeButton';

//svg
import Back from '../../assets/svg/back.svg';
import ThreeDot from '../../assets/svg/threeDot.svg';
import CreateFolder from '../../assets/svg/createFolder.svg';

// Images
const createFolder = require("../../assets/createFolder.png");

const PeopleTab = ({ navigation }) => {
  const [code, setCode] = useState("");

  return (
    <SafeAreaProvider>
      <SafeAreaView>
        {/* Header image section */}
        <View style={styles.imageWrapper}>
          <Image source={createFolder} style={styles.folderImage} />

          {/* Top bar with back & menu */}
          <View style={styles.topBar}>
            <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
              <View style={styles.iconButton}>
                <Back height={16} width={16} />
              </View>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback onPress={() => console.log("3 dots pressed")}>
              <View style={styles.iconButton}>
                <ThreeDot height={16} width={16} />
              </View>
            </TouchableWithoutFeedback>
          </View>

          {/* Bottom overlay (left + right) */}
          <View style={styles.bottomOverlay}>
            {/* Left side */}
            <View>
              <Text style={styles.folderHeading}>Create folder</Text>
            </View>
          </View>
        </View>

        {/* Content list */}
        <ScrollView style={styles.container}>
          <View style={styles.qrcodeContainer}>
            <View style={styles.qrcode}>
              <CreateFolder width={62} height={62} />
            </View>
          </View>

          {/* Email Input */}
          <TextInput
            value={code}
            onChangeText={setCode}
            placeholder="Folder Name "
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#000"
            autoCorrect={false}
          />


               <ThemeButton
        text="Create Folder"
        onPress={() => navigation.navigate("Folder")}
      />
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    top: -60,
    padding: 20,
    backgroundColor: "#fff",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    height: "100%"
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

  qrcodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 300,
  },
  qrcode: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#D5D5D5',
    borderStyle: 'dotted',
    borderRadius: 12,
    width: 170,
    height: 170,
    backgroundColor: '#F8F8F8'
  },

  /* Input field */
  input: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginTop: 20,
    fontWeight: "600",
    fontSize: 16,
  },

  continueBtn: {
    backgroundColor: '#FDD32E',
    paddingVertical: 21,
    paddingHorizontal: 30,
    borderRadius: 12,
    alignItems: 'center',
    width: "100%",
    marginBlock: 21,
  },

  continueTxt: {
    fontSize: 16,
    color: '#000',
    fontWeight: 600,
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
  
});

export default PeopleTab;
