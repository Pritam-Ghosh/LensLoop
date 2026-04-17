import React, { useState } from "react";
import { View, TextInput, StyleSheet, Text,ScrollView } from "react-native";
import FolderLayout from "../screen/FolderLayout";
import Swtich from '../components/Swtich'
import QR from "../../assets/svg/qr.svg";
import Pencil from "../../assets/svg/pencil.svg";
import ThemeButton from "../components/ThemeButton";
const createEvent = require("../../assets/createEvent.png");
const folderImage = require("../../assets/folderImage.png");

const CreateEvent = ({ navigation, route }) => {
    const [newTitle, setNewTitle] = useState("");

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
            <ScrollView style={{ paddingInline: 30, marginTop: 50 }}>
                <Text style={{ fontWeight: 600, fontSize: 16 }}>QR Code</Text>
                <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 90 }}>
                    <QR width={200} height={200} />
                </View>
                <ThemeButton
                    text="Download"
                    onPress={() => navigation.navigate("Locking")}
                    style={{ width: "100%", marginTop: 90 }}
                />
            </ScrollView>
        </FolderLayout>
    );
};

const styles = StyleSheet.create({
    newTitle: {
        borderColor: '#F7F7F7',
        backgroundColor: "#EFEFEF",
        marginTop: 11,
        width: "100%",
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 20,
        paddingVertical: 18,
        fontSize: 16,
        textAlign: 'left',
    },
});

export default CreateEvent;
