import React, { useState } from "react";
import { View, TextInput, StyleSheet, Text } from "react-native";
import FolderLayout from "../screen/FolderLayout";
import Swtich from '../components/Swtich'
import QR from "../../assets/svg/qr.svg";
import Pencil from "../../assets/svg/pencil.svg";
import Lock from "../../assets/svg/lock.svg";
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
            inviteText="+ invite a friend" onInvitePress={() => navigation.navigate("InviteHiveMember")}
            RightIcon={<Pencil height={16} width={16} />}
        >
            {/* unique screen content */}
            <View style={{ paddingInline: 20, marginTop: 40 }}>
                {/* Label + Lock */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: "center" }}>
                    <Text style={{fontWeight: 60, fontSize: 16}}>Not protected</Text>
                    <Lock width={20} height={20} />
                </View>

                {/* Switch aligned left */}
                <View style={{ alignItems: "flex-start", marginTop: 20 }}>
                    <Swtich />
                </View>

                <ThemeButton
                    text="Member Share page"
                    onPress={() => navigation.navigate("MemberShare")}
                    style={{ width: "100%", marginTop: 90 }}
                />
            </View>


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
