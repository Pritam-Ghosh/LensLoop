import { View, Text, StyleSheet, Image, ScrollView, TouchableWithoutFeedback } from 'react-native'
 import React from 'react';
  import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context"; 
  import Back from '../../assets/svg/back.svg';
   import ThreeDot from '../../assets/svg/threeDot.svg'
    //Image const folderImage = require("../../assets/folderImage.png");
    //  const folderImageList = require("../../assets/folderImageList.webp"); 
    // const PeopleTab = ({ navigation }) => { 
    // return (
    //  <SafeAreaProvider> 
    // <SafeAreaView > 
    // <View style={styles.imageWrapper}>
    //  <Image source={folderImage} style={styles.folderImage} /> 
    // <View style={styles.topBar}> 
    // <TouchableWithoutFeedback onPress={() => navigation.goBack()}> 
    // <View style={styles.iconButton}> <Back height={16} width={16} />
    //  </View> </TouchableWithoutFeedback> <TouchableWithoutFeedback onPress={() =>
    //  console.log("3 dots pressed")}> <View style={styles.iconButton}> 
    // <ThreeDot height={16} width={16} /> </View> </TouchableWithoutFeedback> 
    // </View> <View style={styles.imageWrapper}> <Text style={styles.folderHeading}>Japan Tour</Text>
    //  </View> <View style={styles.imageWrapper}> <Text style={styles.folderHeadingDate}>Sep 2025</Text> </View> <View style={styles.imageWrapper}> <View style={styles.profileIcon}> <Text style={{ color: "#FFFFFF" }}>PG</Text> </View> </View> <TouchableWithoutFeedback style={styles.imageWrapper}> <View > <Text>+ invite a friend</Text> </View> </TouchableWithoutFeedback> </View> <ScrollView style={styles.container}> <View> <Text style={styles.folderText}>Photo Folder</Text> </View> <View style={styles.photoFolder}> <Image source={folderImageList} style={styles.folderImageList} /> <View> <Text style={styles.folderText}>Tour</Text> <View style={{ flexDirection: "row", justifyContent: "space-between", width: 120, marginTop: 6 }}> <Text>10 items</Text> <Text>Sep 15</Text> </View> </View> </View> </ScrollView> </SafeAreaView> </SafeAreaProvider> ) } const styles = StyleSheet.create({ container: { position: "relative", top: -60, padding: 20, backgroundColor: "#fff", borderRadius: 40, height: "100%" }, backButton: { width: 40, height: 40, backgroundColor: "#fff", borderRadius: 25, }, topBar: { position: "absolute", top: 20, left: 0, right: 0, flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 20, zIndex: 10, }, iconButton: { backgroundColor: "#D9D9D9C7", padding: 8, borderRadius: 20, }, folderImage: { width: '100%', }, photoFolder: { borderWidth: 1, borderColor: "#E9E9E9", borderRadius: 10, flexDirection: "row", alignItems: "center", gap: 20, marginTop: 20, }, folderText: { fontSize: 17, fontWeight: "600", }, folderImageList: { width: 104, height: 84, objectFit: "cover", borderTopLeftRadius: 10, borderBottomLeftRadius: 10, }, imageWrapper: { position: "relative", // parent must be relative for child absolute }, folderImage: { width: "100%", height: 250, resizeMode: "cover", }, backButton: { position: "absolute", top: 20, // adjust for safe area left: 20, backgroundColor: "#D9D9D9C7", // optional circle background padding: 8, borderRadius: 20, }, folderHeading: { position: "absolute", bottom: 150, left: 20, color: "#fff", fontSize: 24, fontWeight: "700", }, folderHeadingDate: { position: "absolute", bottom: 120, left: 20, color: "#fff", fontSize: 16, fontWeight: "400", }, profileIcon: { position: "absolute", bottom: 80, left: 20, width: 30, height: 30, borderRadius: 15, backgroundColor: "#ED3C50", justifyContent: "center", alignItems: "center", marginTop: 6, }, }) export default PeopleTab