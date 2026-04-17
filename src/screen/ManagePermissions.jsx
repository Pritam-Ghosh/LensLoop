// import React, { useState } from "react";
// import { View, TextInput, StyleSheet, Text, Switch, TouchableOpacity, ScrollView } from "react-native";
// import FolderLayout from "./FolderLayout";
// import Pencil from "../../assets/svg/pencil.svg";
// import ThemeButton from "../components/ThemeButton";


// const folderImage = require("../../assets/folderImage.png");

// const CreateEvent = ({ navigation, route }) => {
//     const [email, setEmail] = useState("");
//     const [isEnabled, setIsEnabled] = useState(false);
//     const [selected, setSelected] = useState("left"); // 'left' or 'right'
//     const { folderName, date, owner } = route.params || {
//         folderName: "Untitled Folder",
//         date: "Unknown Date",
//         owner: "NA",
//     };

//     return (
//         <FolderLayout
//             navigation={navigation}
//             image={folderImage}
//             folderName="Manage Permissions"
//             date="Sep 19"
//             owner="A"
//             inviteText="+ invite a friend"
//             RightIcon={<Pencil height={16} width={16} />}
//         >
//             <ScrollView style={{ paddingInline: 20, marginTop: 40 }}>
//                 {/* Left label (OFF) */}
//                 <View style={{ marginTop: 30 }}>
//                     <Text style={styles.heading}>Add item</Text>
//                     <Text style={styles.subText}>Who can add new items to the folder?</Text>


//                     <View style={styles.container}>
//                         <TouchableOpacity
//                             style={[
//                                 styles.toggleOption,
//                                 selected === "left" && styles.selectedOption,
//                                 { borderTopLeftRadius: 8, borderBottomLeftRadius: 8 }
//                             ]}
//                             onPress={() => setSelected("left")}
//                             activeOpacity={0.8}
//                         >
//                             <Text style={[
//                                 styles.optionText,
//                                 selected === "left" && styles.selectedText
//                             ]}>
//                                 Only Admin
//                             </Text>
//                         </TouchableOpacity>

//                         <TouchableOpacity
//                             style={[
//                                 styles.toggleOption,
//                                 selected === "right" && styles.selectedOption,
//                                 { borderTopRightRadius: 8, borderBottomRightRadius: 8 }
//                             ]}
//                             onPress={() => setSelected("right")}
//                             activeOpacity={0.8}
//                         >
//                             <Text style={[
//                                 styles.optionText,
//                                 selected === "right" && styles.selectedText
//                             ]}>
//                                 Only Admin
//                             </Text>
//                         </TouchableOpacity>
//                     </View>
//                 </View>
//                 <View style={{ marginTop: 30 }}>
//                     <Text style={styles.heading}>Add item</Text>
//                     <Text style={styles.subText}>Who can add new items to the folder?</Text>


//                     <View style={styles.container}>
//                         <TouchableOpacity
//                             style={[
//                                 styles.toggleOption,
//                                 selected === "left" && styles.selectedOption,
//                                 { borderTopLeftRadius: 8, borderBottomLeftRadius: 8 }
//                             ]}
//                             onPress={() => setSelected("left")}
//                             activeOpacity={0.8}
//                         >
//                             <Text style={[
//                                 styles.optionText,
//                                 selected === "left" && styles.selectedText
//                             ]}>
//                                 Only Admin
//                             </Text>
//                         </TouchableOpacity>

//                         <TouchableOpacity
//                             style={[
//                                 styles.toggleOption,
//                                 selected === "right" && styles.selectedOption,
//                                 { borderTopRightRadius: 8, borderBottomRightRadius: 8 }
//                             ]}
//                             onPress={() => setSelected("right")}
//                             activeOpacity={0.8}
//                         >
//                             <Text style={[
//                                 styles.optionText,
//                                 selected === "right" && styles.selectedText
//                             ]}>
//                                 Only Admin
//                             </Text>
//                         </TouchableOpacity>
//                     </View>
//                 </View>
//                 <View style={{ marginTop: 30 }}>
//                     <Text style={styles.heading}>Add item</Text>
//                     <Text style={styles.subText}>Who can add new items to the folder?</Text>


//                     <View style={styles.container}>
//                         <TouchableOpacity
//                             style={[
//                                 styles.toggleOption,
//                                 selected === "left" && styles.selectedOption,
//                                 { borderTopLeftRadius: 8, borderBottomLeftRadius: 8 }
//                             ]}
//                             onPress={() => setSelected("left")}
//                             activeOpacity={0.8}
//                         >
//                             <Text style={[
//                                 styles.optionText,
//                                 selected === "left" && styles.selectedText
//                             ]}>
//                                 Only Admin
//                             </Text>
//                         </TouchableOpacity>

//                         <TouchableOpacity
//                             style={[
//                                 styles.toggleOption,
//                                 selected === "right" && styles.selectedOption,
//                                 { borderTopRightRadius: 8, borderBottomRightRadius: 8 }
//                             ]}
//                             onPress={() => setSelected("right")}
//                             activeOpacity={0.8}
//                         >
//                             <Text style={[
//                                 styles.optionText,
//                                 selected === "right" && styles.selectedText
//                             ]}>
//                                 Only Admin
//                             </Text>
//                         </TouchableOpacity>
//                     </View>
//                 </View>
//                 <ThemeButton
//                     text="Send Message"
//                     onPress={() => navigation.navigate("Language")}
//                     style={{ width: "100%", marginTop: 90 }}
//                 />
//             </ScrollView>


//         </FolderLayout>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flexDirection: "row",
//         borderWidth: 1,
//         borderColor: "#f0f0f0",
//         backgroundColor: '#f0f0f0',
//         borderRadius: 8,
//         overflow: "hidden",
//         width: '100%',
//         height: 50,
//         padding: 5,
//     },
//     toggleOption: {
//         flex: 1,
//         justifyContent: "center",
//         alignItems: "center",
//         backgroundColor: "#f0f0f0",
//     },
//     selectedOption: {
//         backgroundColor: "#FFA500", // active color (orange/yellow)
//     },
//     optionText: {
//         fontSize: 14,
//         fontWeight: "500",
//         color: "#888",
//     },
//     selectedText: {
//         color: "#fff",
//         fontWeight: "700",
//     },

//     heading: {
//         fontSize: 16,
//         fontWeight: 600,
//     },
//     subText: {
//         marginTop: 14,
//         marginBottom: 10,
//         color: '#7D7D7D',
//     }
// });

// export default CreateEvent;






















// -------------------------------------------------------------------------------






import { useEffect, useState } from "react";
import {
    View,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Image,
    Text,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    Plus,
    Users,
    SmilePlus,
    Images,
    Video,
    MessagesSquare,
    Share,
    EllipsisVertical,
} from "lucide-react-native";
import { launchImageLibrary } from "react-native-image-picker";
import { Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");

// SVGs
import QR from "../../assets/svg/qr.svg";

// Components
import ScreenLayout from "../components/ScreenLayout";
import CustomText from "../components/CustomText";
import SearchBar from "../components/SearchBar";
import MembersModal from "../components/MembersModal";
import ThemeButton from "../components/ThemeButton";

// Images
const createEvent = require("../../assets/background.png");
const profilePic = require("../../assets/profile.jpg");
const dp = require("../../assets/dp.jpg");
const dp2 = require("../../assets/dp2.webp");
const dp3 = require("../../assets/dp3.jpg");
const dp4 = require("../../assets/dp4.jpg");
const dp5 = require("../../assets/dp5.jpg");
const dp6 = require("../../assets/dp6.jpg");
const dp7 = require("../../assets/dp7.jpg");
const dp8 = require("../../assets/dp8.jpg");

const CreateEvent = ({ navigation, route }) => {
    const [email, setEmail] = useState("");
    const [isEnabled, setIsEnabled] = useState(false);
    const [selected, setSelected] = useState("left");
    const [menuVisible, setMenuVisible] = useState('false')
    const { folderName, date, owner } = route.params || {
        folderName: "Untitled Folder",
        date: "Unknown Date",
        owner: "NA",
    };

    return (
        <ScreenLayout
            navigation={navigation}
            image={createEvent}
            folderName="Janifer Danis"
            date="+91 1841 510 1450"



            OverlayContent={
                <View style={styles.profileOverlay}>
                    <CustomText weight="bold" style={{ color: '#fff', fontSize: width * 0.075, marginBottom: 50 }}>Manage Permissions</CustomText>
                    <View style={styles.rowBetween}>

                    </View>


                </View>
            }
        >
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContainer}
            >




                {/* Left label (OFF) */}
                <View style={{ marginTop: 30 }}>
                    <Text style={styles.heading}>Add item</Text>
                    <Text style={styles.subText}>Who can add new items to the folder?</Text>


                    <View style={styles.container}>
                        <TouchableOpacity
                            style={[
                                styles.toggleOption,
                                selected === "left" && styles.selectedOption,
                                { borderTopLeftRadius: 8, borderBottomLeftRadius: 8 }
                            ]}
                            onPress={() => setSelected("left")}
                            activeOpacity={0.8}
                        >
                            <Text style={[
                                styles.optionText,
                                selected === "left" && styles.selectedText
                            ]}>
                                Only Admin
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.toggleOption,
                                selected === "right" && styles.selectedOption,
                                { borderTopRightRadius: 8, borderBottomRightRadius: 8 }
                            ]}
                            onPress={() => setSelected("right")}
                            activeOpacity={0.8}
                        >
                            <Text style={[
                                styles.optionText,
                                selected === "right" && styles.selectedText
                            ]}>
                                Only Admin
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ marginTop: 30 }}>
                    <Text style={styles.heading}>Add item</Text>
                    <Text style={styles.subText}>Who can add new items to the folder?</Text>


                    <View style={styles.container}>
                        <TouchableOpacity
                            style={[
                                styles.toggleOption,
                                selected === "left" && styles.selectedOption,
                                { borderTopLeftRadius: 8, borderBottomLeftRadius: 8 }
                            ]}
                            onPress={() => setSelected("left")}
                            activeOpacity={0.8}
                        >
                            <Text style={[
                                styles.optionText,
                                selected === "left" && styles.selectedText
                            ]}>
                                Only Admin
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.toggleOption,
                                selected === "right" && styles.selectedOption,
                                { borderTopRightRadius: 8, borderBottomRightRadius: 8 }
                            ]}
                            onPress={() => setSelected("right")}
                            activeOpacity={0.8}
                        >
                            <Text style={[
                                styles.optionText,
                                selected === "right" && styles.selectedText
                            ]}>
                                Only Admin
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ marginTop: 30 }}>
                    <Text style={styles.heading}>Add item</Text>
                    <Text style={styles.subText}>Who can add new items to the folder?</Text>


                    <View style={styles.container}>
                        <TouchableOpacity
                            style={[
                                styles.toggleOption,
                                selected === "left" && styles.selectedOption,
                                { borderTopLeftRadius: 8, borderBottomLeftRadius: 8 }
                            ]}
                            onPress={() => setSelected("left")}
                            activeOpacity={0.8}
                        >
                            <Text style={[
                                styles.optionText,
                                selected === "left" && styles.selectedText
                            ]}>
                                Only Admin
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.toggleOption,
                                selected === "right" && styles.selectedOption,
                                { borderTopRightRadius: 8, borderBottomRightRadius: 8 }
                            ]}
                            onPress={() => setSelected("right")}
                            activeOpacity={0.8}
                        >
                            <Text style={[
                                styles.optionText,
                                selected === "right" && styles.selectedText
                            ]}>
                                Only Admin
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <ThemeButton
                    text="Save"
                    onPress={() => navigation.navigate("Language")}
                    style={{ width: "100%", marginTop: 90 }}
                />

            </ScrollView>
        </ScreenLayout>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        paddingHorizontal: width * 0.05,
        paddingBottom: height * 0.15,
        backgroundColor: "#FAFAF9",
    },

    textBox: {
        flex: 1,
    },

    profileOverlay: {
        alignItems: "center",

    },

    rowBetween: {
        flexDirection: "row",
        alignItems: "center",
        gap: width * 0.05,
        justifyContent: "space-between",
    },

    bottomOverlay: {
        position: "absolute",
        bottom: height * 0.1125,
        left: width * 0.05,
        right: width * 0.05,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
    },

    tabsContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        marginTop: height * 0.025,
        borderRadius: 40,
        paddingVertical: height * 0.01,
    },
    tabButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: width * 0.015,
        paddingHorizontal: width * 0.055,
        paddingVertical: height * 0.0075,
        borderWidth: 1,
        borderColor: '#D0CACA',
        borderRadius: 4,
    },
    tabButtonActive: {
        backgroundColor: "#E1711C",
        borderWidth: 1,
        borderColor: '#E1711C',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 1,
    },
    tabText: {
        color: "#888888",
        fontSize: width * 0.0375,
        fontWeight: "500",
    },
    tabTextActive: {
        color: '#ffffff',
        fontWeight: "700",
    },
    container: {
        flexDirection: "row",
        borderWidth: 1,
        borderColor: "#f0f0f0",
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        overflow: "hidden",
        width: '100%',
        height: 50,
        padding: 5,
    },
    toggleOption: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f0f0f0",
    },
    selectedOption: {
        backgroundColor: "#DA3C84", // active color (orange/yellow)
    },
    optionText: {
        fontSize: 14,
        fontWeight: "500",
        color: "#888",
    },
    selectedText: {
        color: "#fff",
        fontWeight: "700",
    },

    heading: {
        fontSize: 16,
        fontWeight: 600,
    },
    subText: {
        marginTop: 14,
        marginBottom: 10,
        color: '#7D7D7D',
    }
});

export default CreateEvent;