import React, { useState } from "react";
import { View, Text, Image, StyleSheet, TextInput, ScrollView } from "react-native";
import FolderLayout from "../components/FolderLayout";
import Cloud from "../../assets/svg/cloud.svg";
import QR from "../../assets/svg/qr.svg";
import Utility from "../../assets/svg/utility.svg";
import ThemeButton from "../components/ThemeButton";
const createEvent = require("../../assets/createEvent.png");


const CreateEvent = ({ navigation, route }) => {
    const [code, setCode] = useState("");

    const { folderName, date, owner } = route.params || {
        folderName: "Untitled Folder",
        date: "Unknown Date",
        owner: "NA",
    };

    return (
        <FolderLayout
            navigation={navigation}
            image={createEvent}
            folderName="Create Event"
            date="Sep 19"
            owner="A"
            inviteText="+ invite a friend"   onInvitePress={() => navigation.navigate("InviteHiveMember")}
            RightIcon={<QR height={16} width={16} />}
        >
            {/*  unique screen content */}
            <ScrollView style={{ padding: 20, flex: 1 }}>
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 20,

                    }}
                >
                    <Utility width={24} height={24} />
                    {/*  fixed fontWeight */}
                    <Text style={{ fontSize: 18, fontWeight: "600" }}>Event Details</Text>
                </View>

                <Text style={{ marginTop: 24, }}>Event Type *</Text>
                <View
                    style={{
                        flexDirection: "row",
                        flexWrap: "wrap",
                        gap: 10,
                        marginTop: 27,
                    }}
                >
                    <View style={styles.badge}>
                        <Text>Corporate</Text>
                    </View>
                    <View style={styles.badge}>
                        <Text>Birthday Party</Text>
                    </View>
                    <View style={styles.badge}>
                        <Text>Wedding</Text>
                    </View>
                    <View style={styles.badge}>
                        <Text>Reunion</Text>
                    </View>
                    <View style={styles.badge}>
                        <Text>Others..</Text>
                    </View>
                </View>

                {/*  fixed TextInput */}
                <TextInput
                    value={code}
                    onChangeText={setCode}
                    placeholder="Enter Your Event name"
                    style={styles.input}
                    keyboardType="default"
                    autoCapitalize="none"
                    placeholderTextColor="#000"
                    autoCorrect={false}
                />

                <ThemeButton
                    text="Continue"
                    onPress={() => navigation.navigate("CreateEventTwo")}
                    style={{ marginTop: 31 }}
                />
            </ScrollView>
        </FolderLayout>
    );
};

const styles = StyleSheet.create({
    photoFolder: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 15,
    },
    folderImageList: {
        width: 80,
        height: 80,
        marginRight: 12,
        borderRadius: 12,
    },
    folderText: { fontSize: 16, fontWeight: "500" },
    uploadBtn: {
        marginTop: 20,
        backgroundColor: "#f2f2f2",
        padding: 12,
        borderRadius: 50,
        alignSelf: "center",
    },
    badge: {
        backgroundColor: "#FAFAFA",
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 6,
        alignSelf: "flex-start",
        borderWidth: 1,
        borderColor: "#EDEDED",
        borderStyle: "solid",
        marginTop: 10,
    },
    input: {
        borderBottomWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 16,
        marginTop: 41,
        fontWeight: "600",
    },
});

export default CreateEvent;
