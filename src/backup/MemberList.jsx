import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native'
import React from 'react'
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import BottomNav from "../components/BottomNav";
import TopNavbar from "../components/TopNavbar";


//Image
const dp = require("../../assets/dp.jpg");
const dp2 = require("../../assets/dp2.webp");
const dp3 = require("../../assets/dp3.jpg");
const dp4 = require("../../assets/dp4.jpg");
const dp5 = require("../../assets/dp5.jpg");
const dp6 = require("../../assets/dp6.jpg");
const dp7 = require("../../assets/dp7.jpg");
const dp8 = require("../../assets/dp8.jpg");




const MemberList = ({ navigation }) => {
    return (
        <SafeAreaProvider>
            <SafeAreaView >
                <TopNavbar />
                <ScrollView contentContainerStyle={{ paddingBottom: 200, backgroundColor: '#ffffff' }}>


                    {/* ---Tabs Navigation---- */}
                    <View style={{ display: 'flex', flexDirection: 'row', gap: 10, marginTop: 20, paddingLeft: 20 }}>
                        <View style={[styles.badge, styles.badgeActive]}>
                            <Text style={styles.badgeText}>Member</Text>
                        </View>
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>Group</Text>
                        </View>

                    </View>
                    {/* ---Tabs Navigation---- */}

                    {/* Member List Screen */}
                    <View style={styles.chatList}>
                        <TouchableOpacity style={styles.chatListItem} onPress={() => navigation.navigate("Chat")}>
                            <Image source={dp} style={styles.dp} />
                            <Text>Demola Aoki</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.chatListItem}>
                            <Image source={dp3} style={styles.dp} />
                            <Text>Sofia Carrington</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.chatListItem}>
                            <Image source={dp4} style={styles.dp} />
                            <Text>Quincy Thoreau</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.chatListItem}>
                            <Image source={dp5} style={styles.dp} />
                            <Text>Demola Aoki</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.chatListItem}>
                            <Image source={dp2} style={styles.dp} />
                            <Text>Emma Andreas</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.chatListItem}>
                            <Image source={dp6} style={styles.dp} />
                            <Text>Sofia Carrington </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.chatListItem}>
                            <Image source={dp7} style={styles.dp} />
                            <Text>Chloe Dumont</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.chatListItem}>
                            <Image source={dp8} style={styles.dp} />
                            <Text>Quincy Thoreau </Text>
                        </TouchableOpacity>
                    </View>


                </ScrollView>

            </SafeAreaView>
        </SafeAreaProvider>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },


    scrollContainer: {
        paddingBottom: 200,
    },
    // ---Tabs Navigation----
    badge: {

        backgroundColor: 'gray',
        paddingHorizontal: 12,   // horizontal padding for spacing around text
        paddingVertical: 6,      // vertical padding
        borderRadius: 5,
        alignSelf: 'flex-start', // makes View wrap content instead of stretching full width
        borderRadius: 5,
    },
    badgeText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 14,
        fontWeight: '600',
    },
    badgeActive: {
        color: 'white',
        backgroundColor: 'black',
    },
    // ---Tabs Navigation----

    // Member List

    chatList: {
        marginTop: 20,
    },

    chatListItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingBottom: 10,
        paddingHorizontal: 10,
        paddingLeft: 20,
    },

    dp: {
        width: 51,
        height: 51,
        borderRadius: 80 / 2,
        resizeMode: "cover",
    },
    bottomNav: {
        marginTop: 20,
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: 60, // adjust height
        backgroundColor: "#fff",
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        borderTopWidth: 1,
        borderTopColor: "#ddd",
    }

})

export default MemberList