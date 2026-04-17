import React, { useState } from "react";
import { View, TextInput, StyleSheet, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import FolderLayout from "./FolderLayout";
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
import { useTranslation } from 'react-i18next';
import { colors } from "../Theme/theme";

const folderImage = require("../../assets/folderImage.png");

const flag1 = require("../../assets/flag1.png");
const flag2 = require("../../assets/flag2.png");
const flag3 = require("../../assets/flag3.png");
const flag4 = require("../../assets/flag4.png");
// Images
const createEvent = require("../../assets/background.png");
const profilePic = require("../../assets/profile.jpg");

const Language = ({ navigation, route }) => {
    const { t, i18n } = useTranslation();
    const [email, setEmail] = useState("");
    const [selectedLanguage, setSelectedLanguage] = useState(i18n.language || "en");
    const { folderName, date, owner } = route.params || {
        folderName: "Untitled Folder",
        date: "Unknown Date",
        owner: "NA",
    };

    const languages = [
        { name: "English", flag: flag1, code: "en" },
        { name: "Spanish", flag: flag2, code: "es" },
        { name: "French", flag: flag3, code: "fr" },
        { name: "German", flag: flag4, code: "de" },
    ];

    const handleSaveLanguage = async () => {
        const selectedLang = languages.find(lang => lang.code === selectedLanguage);
        if (selectedLang) {

            await i18n.changeLanguage(selectedLanguage);

        }
    };

    return (
        <ScreenLayout
            navigation={navigation}
            image={createEvent}
            folderName="Janifer Danis"
            date="+91 1841 510 1450"
            OverlayContent={
                <View style={styles.profileOverlay}>
                    <View>
                        <CustomText weight="bold" style={styles.profileName}>
                            {t('selectLanguage')}
                        </CustomText>
                    </View>
                </View>
            }
        >
            <ScrollView style={{ paddingHorizontal: 20, paddingTop: 40, backgroundColor: '#FAFAF9' }}>
                {languages.map((lang, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => setSelectedLanguage(lang.code)}
                        style={[
                            styles.languageRow,
                            selectedLanguage === lang.code && { borderColor: "#FFA500", backgroundColor: "#FFF4E0" }
                        ]}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
                            <View style={styles.imageContainer}>
                                <Image source={lang.flag} style={styles.image} />
                            </View>
                            <View>
                                <CustomText weight="bold" style={{ fontSize: 14, fontWeight: "600" }}>{lang.name}</CustomText>
                                <CustomText weight="medium" >{lang.name}</CustomText>
                            </View>
                        </View>

                        {/* Conditional tick or placeholder */}
                        {selectedLanguage === lang.code ? (
                            <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: '#E1711C', alignItems: 'center', justifyContent: 'center' }}>
                                <Check color='#ffffffff' size={16} />
                            </View>
                        ) : (
                            <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#bebebeff' }} />
                        )}
                    </TouchableOpacity>
                ))}

                {/* Send Button */}
                <ThemeButton
                    text={t('save')}
                    onPress={handleSaveLanguage}
                    style={{ width: "100%", marginTop: 100 }}
                />
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
    profileName: {
        color: colors.primary,
        fontSize: 26,
    },
    profileNumber: {
        color: "#f0f0f0",
        fontSize: 14,
    },

    imageContainer: {
        width: 47,
        height: 47,
        borderRadius: 23.5,
        overflow: "hidden",
    },
    image: {
        width: "100%",
        height: "100%",
        resizeMode: "cover",
    },

    languageRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 26,
        borderWidth: 1,
        borderColor: "#E5E5E5",
        padding: 15,
        borderRadius: 8,
        backgroundColor: "#F7F7F7",

        shadowColor: '#7a7979ff',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.20,
        shadowRadius: 6,
        elevation: 1,
    },
});

export default Language;