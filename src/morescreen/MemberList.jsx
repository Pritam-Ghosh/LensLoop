
import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native'
import { RefreshControl } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import TopNavbar from "../components/TopNavbar";
import CustomText from '../components/CustomText';

// Images
const dp = require("../../assets/dp.jpg");
const dp2 = require("../../assets/dp2.webp");
const dp3 = require("../../assets/dp3.jpg");
const dp4 = require("../../assets/dp4.jpg");
const dp5 = require("../../assets/dp5.jpg");
const dp6 = require("../../assets/dp6.jpg");
const dp7 = require("../../assets/dp7.jpg");
const dp8 = require("../../assets/dp8.jpg");

// Member data array
const members = [
    { id: 1, name: "Demola Aoki", dp: dp },
    { id: 2, name: "Sofia Carrington", dp: dp3 },
    { id: 3, name: "Quincy Thoreau", dp: dp4 },
    { id: 4, name: "Demola Aoki", dp: dp5 },
    { id: 5, name: "Emma Andreas", dp: dp2 },
    { id: 6, name: "Sofia Carrington", dp: dp6 },
    { id: 7, name: "Chloe Dumont", dp: dp7 },
    { id: 8, name: "Quincy Thoreau", dp: dp8 },
    { id: 9, name: "Emma Andreas", dp: dp2 },
    { id: 10, name: "Sofia Carrington", dp: dp6 },
    { id: 11, name: "Chloe Dumont", dp: dp7 },
    { id: 12, name: "Quincy Thoreau", dp: dp8 },
];

const MemberList = ({ navigation }) => {
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 1500);
    }, []);
    return (
        <SafeAreaProvider>
            <SafeAreaView>
                <TopNavbar />
                <ScrollView contentContainerStyle={{ paddingBottom: 200, backgroundColor: '#ffffff' }} refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} /> // ✅ added
                }>

                    {/* ---Tabs Navigation---- */}
                    <View style={{ flexDirection: 'row', gap: 10, marginTop: 20, paddingLeft: 20 }}>
                        <View style={[styles.badge, styles.badgeActive]}>
                            <CustomText weight="medium" style={styles.badgeText}>Member</CustomText>
                        </View>
                        <View style={[styles.badge, { backgroundColor: '#ffffffff' }]}>
                            <CustomText weight="medium" style={[styles.badgeText, { color: '#000000' }]}>Group</CustomText>
                        </View>
                    </View>
                    {/* ---Tabs Navigation---- */}

                    {/* Member List Screen */}
                    <View style={styles.chatList}>
                        {members.map(member => (
                            <TouchableOpacity
                                key={member.id}
                                style={styles.chatListItem}
                                onPress={() => navigation.navigate("Chat", { memberId: member.id, memberName: member.name })}
                            >
                                <Image source={member.dp} style={styles.dp} />
                                <CustomText weight="bold">{member.name}</CustomText>
                            </TouchableOpacity>
                        ))}
                    </View>

                </ScrollView>
            </SafeAreaView>
        </SafeAreaProvider>
    )
}

const styles = StyleSheet.create({
    badge: {
        backgroundColor: 'gray',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 5,
        alignSelf: 'flex-start',
    },
    badgeText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 14,
        fontWeight: '600',
    },
    badgeActive: {
        backgroundColor: 'black',
    },
    chatList: {
        marginTop: 20,
    },
    chatListItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#EDEDED',
        paddingBottom: 10,
        paddingHorizontal: 10,
        paddingLeft: 20,
    },
    dp: {
        width: 51,
        height: 51,
        borderRadius: 25.5,
        resizeMode: "cover",
    },
});

export default MemberList;
