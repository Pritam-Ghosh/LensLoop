import React from "react";
import { View, Text, StyleSheet, Image, ScrollView, TouchableWithoutFeedback, } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Back from "../../assets/svg/back.svg";
import ThreeDot from "../../assets/svg/threeDot.svg";
import Cloud from "../../assets/svg/cloud.svg";
import EmptyFolder from "../../assets/svg/emptyFolder.svg";
// Example images
const folderImage = require("../../assets/folderImage.png");
const folderImageList = require("../../assets/folderImageList.webp");

const Folder = ({ navigation, route }) => {
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

                <View style={styles.emptyFolder}>
                    <EmptyFolder width={164} height={131} />
                    <Text style={styles.emptyFolderHead}>Great! Your folder is ready</Text>
                    <Text style={styles.emptyFolderText}>Start by creating your first iteam: album, expense, or note.</Text>
                </View>
                <TouchableWithoutFeedback onPress={() => navigation.navigate("AddExpenseBlock")}>
                    <View style={styles.uploadBtn}>
                   <Text style={styles.plus}>+</Text>
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





    uploadBtn: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        right: 30,
        top: 430,
        backgroundColor: "#000000",
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    emptyFolder: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        height: 500,
    },
    emptyFolderHead: {
        fontSize: 15,
        fontWeight: "600", 
           marginTop: 22,    
     },
    emptyFolderText: {
        fontSize: 14,
        fontWeight: "400",
        color: "#8E8E8E",
        width: 280,
        textAlign: "center",
        marginTop: 17,
    },
    plus: {
color: "#FFFFFF",
fontSize: 30,
fontWeight: "600",
    },
});

export default Folder;
