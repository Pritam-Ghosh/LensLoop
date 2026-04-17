import React, { useState } from "react";
import { View, TextInput, StyleSheet, Text, Image } from "react-native";
import FolderLayout from "../screen/FolderLayout";
import Swtich from '../components/Swtich'
import QR from "../../assets/svg/qr.svg";
import Pencil from "../../assets/svg/pencil.svg";
import Lock from "../../assets/svg/lock.svg";
import ThemeButton from "../components/ThemeButton";
const createEvent = require("../../assets/createEvent.png");
const folderImage = require("../../assets/folderImage.png");
const dp = require("../../assets/dp.jpg");
const dp6 = require("../../assets/dp6.jpg");
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
            <View style={{ paddingInline: 20, marginTop: 40 }}>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: "center" }}>
                    <Text style={{ fontWeight: 600, fontSize: 16 }}>Member</Text>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 26 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
                        <View style={styles.imageContainer}>
                            <Image source={dp} style={styles.image} />
                        </View>
                        <Text style={{ fontSize: 14, fontWeight: "600" }}>James Danis</Text>
                    </View>
                    <View style={styles.badge}>
                        <Text style={{ textAlign: "center", fontSize: 13, fontWeight: "600" }}>Owner</Text>
                    </View>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 26 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
                        <View style={styles.imageContainer}>
                            <Image source={dp6} style={styles.image} />
                        </View>
                        <Text style={{ fontSize: 14, fontWeight: "600" }}>James Danis</Text>
                    </View>

                </View>


                <ThemeButton
                    text="Your Opinion"
                    onPress={() => navigation.navigate("YourOpinion")}
                    style={{ width: "100%", marginTop: 90 }}
                />
            </View>


        </FolderLayout>
    );
};

const styles = StyleSheet.create({
    imageContainer: {
        width: 47,
        height: 47,
        borderRadius: 23.5,
        overflow: "hidden",
    },

    image: {
        width: '100%',
        height: '100%',
    },

    badge: {
        backgroundColor: '#FFC240',
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 18,
        paddingVertical: 9,
        borderRadius: 12,
    }
});

export default CreateEvent;
