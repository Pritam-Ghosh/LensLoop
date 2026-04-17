import React, { useState } from "react";
import { View, TextInput, StyleSheet, Text, TouchableOpacity, Image } from "react-native";
import FolderLayout from "../screen/FolderLayout";
import Swtich from "../components/Swtich";
import QR from "../../assets/svg/qr.svg";
import Pencil from "../../assets/svg/pencil.svg";
import People from "../../assets/svg/people.svg";
import Download from "../../assets/svg/download.svg";
import Mail from "../../assets/svg/mail.svg"; // ✅ FIX: Add this import
import ThemeButton from "../components/ThemeButton";

const folderImage = require("../../assets/folderImage.png");
const dp = require("../../assets/dp.jpg");
const dp6 = require("../../assets/dp6.jpg");
const CreateEvent = ({ navigation, route }) => {
    const [email, setEmail] = useState("");
    const { folderName, date, owner } = route.params || {
        folderName: "Untitled Folder",
        date: "Unknown Date",
        owner: "NA",
    };

    return (
        <FolderLayout
            navigation={navigation}
            image={folderImage}
            folderName="Create Event"
            date="Sep 19"
            owner="A"
            inviteText="+ invite a friend"
            RightIcon={<Pencil height={16} width={16} />}
        >
            {/* unique screen content */}
            <View style={{ paddingHorizontal: 20, marginTop: 40 }}>
                {/* Top Row */}
<Text style={{textAlign: 'center', fontSize: 12, fontWeight:  600}}>Here you will find all the people with whom
you share a common album</Text>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 26, borderWidth: 1, borderColor: "#E5E5E5",  padding: 15, borderRadius: 8}}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
                        <View style={styles.imageContainer}>
                            <Image source={dp6} style={styles.image} />
                        </View>
                        <View>
                            <Text style={{ fontSize: 14, fontWeight: "600" }}>James Danis</Text>
                            <Text>exmaple@gmail.com</Text>
                        </View>
                    </View>
                </View>

                {/* Send Button */}
                <ThemeButton
                    text="Invite"
                    onPress={() => navigation.navigate("ManagePermissions")}
                    style={{ width: "100%", marginTop: 100 }}
                />
            </View>
        </FolderLayout>
    );
};

const styles = StyleSheet.create({
    inputRow: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        paddingHorizontal: 10,
        marginTop: 30,
        backgroundColor: "#FAFAFA",
    },

    emailInput: {
        flex: 1,
        fontSize: 14,
        paddingVertical: 14,
    },

    copyButton: {
        backgroundColor: "#EEEEEE",
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 8,
        marginLeft: 8,
        alignItems: "center",
        justifyContent: "center",
    },

    textArea: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        paddingHorizontal: 18,
        paddingVertical: 12,
        fontSize: 14,
        textAlignVertical: "top",
        marginTop: 20,
        minHeight: 120,
        backgroundColor: "#FAFAFA",
    },
    imageContainer: {
        width: 47,
        height: 47,
        borderRadius: 23.5,
        overflow: "hidden",
    },
});

export default CreateEvent;
