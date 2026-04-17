import React, { useState } from "react";
import { View, TextInput, StyleSheet, Text, Image, ScrollView } from "react-native";
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
            <ScrollView style={{ paddingInline: 20, marginTop: 40 }}>


                <Text style={{
                    fontSize: 16, fontWeight: 600, lineHeight: 25
                }}>Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature!</Text>


                <View style={styles.textContainer}>
                    <Text style={{ fontSize: 14, fontWeight: 400, color: '#000000' }}>Your support means more than you think.</Text>
                </View>

                <ThemeButton
                    text="Support the team"
                    onPress={() => navigation.navigate("ContactUs")}
                    style={{ width: "100%", marginTop: 20 }}
                />
            </ScrollView>


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
    },
    textContainer: {
        borderRadius: 10,
        marginTop: 220,
        paddingBlock: 20,
        paddingInline: 15,
        backgroundColor: '#FFF6D3',
    }
});

export default CreateEvent;
