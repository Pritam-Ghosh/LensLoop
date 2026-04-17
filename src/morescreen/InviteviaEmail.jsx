import React, { useState } from "react";
import { View, TextInput, StyleSheet, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import FolderLayout from "../screen/FolderLayout";
import Swtich from "../components/Swtich";
import QR from "../../assets/svg/qr.svg";
import Pencil from "../../assets/svg/pencil.svg";
import People from "../../assets/svg/people.svg";
import Download from "../../assets/svg/download.svg";
import Mail from "../../assets/svg/mail.svg";
import ThemeButton from "../components/ThemeButton";
import CustomText from "../components/CustomText";
import ScreenLayout from "../components/ScreenLayout";
import { Check } from "lucide-react-native";

const folderImage = require("../../assets/folderImage.png");

const flag1 = require("../../assets/flag1.png");
const flag2 = require("../../assets/flag2.png");
const flag3 = require("../../assets/flag3.png");
const flag4 = require("../../assets/flag4.png");
// Images
const createEvent = require("../../assets/background.png");
const profilePic = require("../../assets/profile.jpg");
const ContactUs = ({ navigation, route }) => {

    const [email, setEmail] = useState("");
    const [selectedLanguage, setSelectedLanguage] = useState("English");
    const { folderName, date, owner } = route.params || {
        folderName: "Untitled Folder",
        date: "Unknown Date",
        owner: "NA",
    };

    const languages = [
        { name: "English", flag: flag1 },
        { name: "Spanish", flag: flag2 },
        { name: "French", flag: flag3 },
        { name: "German", flag: flag4 },
    ];

    return (
        <ScreenLayout
            navigation={navigation}
            image={createEvent}
            folderName="Janifer Danis"
            date="+91 1841 510 1450"


            OverlayContent={
                <View style={styles.profileOverlay}>

                    <View>
                        <CustomText weight="bold" style={{fontSize: 24, color: '#FFFFFF'}}>
                    Invite Member
                        </CustomText>

                    </View>
                </View>
            }
        >


            <ScrollView style={{ paddingHorizontal: 20, paddingTop: 40, backgroundColor: '#FAFAF9' }}>

               {/* unique screen content */}
            <View style={{ paddingInline: 20, marginTop: 40 }}>
                <Text style={{
                    fontSize: 16, fontWeight: 600, lineHeight: 25, textAlign: 'center'
                }}>We'd love to know how we can improve. Feel free if you have any suggestions, ideas or comment!</Text>


                <View style={styles.inputRow}>
                    <Mail width={18} height={18} style={{ marginRight: 8 }} />

                    <TextInput
                        style={styles.emailInput}
                        value={email}
                        onChangeText={setEmail}
                        placeholder="exmaple@gmail.com"
                    />

                    <TouchableOpacity>
                        <View style={styles.copyButton}>
                            <Text style={{color: '#000000', fontWeight: 500}}>Copy</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <TextInput
                    style={styles.textArea}
                    multiline={true}
                    numberOfLines={5}
                    placeholder="Write your message here..."
                />

                <ThemeButton
                    text="Send Message"
                    onPress={() => navigation.navigate("InviteHiveMember")}
                    style={{ width: "100%", marginTop:28 }}
                />
            </View>
            </ScrollView>


        </ScreenLayout>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        paddingHorizontal: 20,
        paddingBottom: 120,

    },

    profileOverlay: {
        position: 'absolute',
        top: -80,
        alignItems: "center",
    },
    profileImage: {
        width: 70,
        height: 70,
        borderRadius: 35,
        borderWidth: 2,
        borderColor: "#fff",
    },
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

    // emailInput: {
    //     marginTop: 36,
    //     width: "100%",
    //     borderColor: '#EEEEEE',
    //     borderWidth: 1,
    //     borderRadius: 12,
    //     paddingHorizontal: 10,
    //     paddingVertical: 21,
    //     fontSize: 16,
    //     textAlign: 'left',
    //     paddingLeft: 27,

    // },
    inputRow: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        paddingHorizontal: 15,
        marginTop: 30,

    },

    emailInput: {
        flex: 1, // makes input take all remaining space
        fontSize: 14,
        paddingVertical: 17,
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
    },
});


export default InviteviaEmail;