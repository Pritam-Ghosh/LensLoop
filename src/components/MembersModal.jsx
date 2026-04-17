import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    Modal,
    Image,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
} from "react-native";
import { Plus, Trash2, Users } from "lucide-react-native";
import CustomText from "./CustomText";
const dp = require("../../assets/dp.jpg");

const MembersModal = ({ visible, onClose, members = [] }) => {
    const [search, setSearch] = useState("");
    const [filteredMembers, setFilteredMembers] = useState(members);
    const [hideSearchbar, setHideSearchbar] = useState("false")

    useEffect(() => {
        setFilteredMembers(members);
        setSearch("");
    }, [members, visible]);


    const handleSearch = (text) => {
        setSearch(text);

        const query = text.toLowerCase();

        const results = members.filter((m) =>
            m.email?.toLowerCase().includes(query)
        );

        setFilteredMembers(results);
    };

    return (
        <Modal transparent visible={visible} animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.modalBox}>

                    {/* Close Button */}
                    <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                        <CustomText weight="medium" style={styles.closeTxt}>✕</CustomText>
                    </TouchableOpacity>

                    {/* Title */}
                    <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center', paddingHorizontal: 10 }}>
                        <Users color='#DA3C84' size={20} />
                        <CustomText weight="medium" style={styles.title}>Hive Members</CustomText>
                    </View>

                    {/* Search Input */}
                    {members.length > 2 && (
                        <View style={styles.inviteRow}>
                            <TextInput
                                placeholder="Search by email..."
                                placeholderTextColor="#A9A9A9"
                                value={search}
                                onChangeText={handleSearch}
                                style={styles.input}
                            />

                            <TouchableOpacity style={styles.inviteBtn}>
                                <CustomText weight="medium" style={styles.inviteText}>Search</CustomText>
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* Members List */}
                    <ScrollView
                        style={{ width: "100%", marginTop: 12 }}
                        contentContainerStyle={{ alignItems: "center" }}
                    >
                        {filteredMembers.length === 0 ? (
                            <CustomText style={{ marginTop: 20, color: "#777" }}>
                                No Members Found
                            </CustomText>
                        ) : (
                            filteredMembers.map((item, index) => (
                                <View key={index} style={styles.card}>
                                    <Image
                                        source={
                                            item.memberId?.profileImage
                                                ? { uri: item.memberId.profileImage }
                                                : dp
                                        }
                                        style={styles.profileImg}
                                    />

                                    <View style={{ flex: 1 }}>
                                        <CustomText weight="medium" style={styles.name}>
                                            {item.memberId?.name || item.name}
                                        </CustomText>
                                    </View>

                                    {/* Status Buttons */}
                                    {item.role === "owner" ? (

                                        <View style={styles.memberBox}>
                                            <CustomText weight="bold" style={styles.memberTxt}></CustomText>
                                        </View>
                                    ) : item.status === "pending" ? (

                                        <TouchableOpacity style={styles.addBtn}>
                                            <Plus size={16} color="#fff" />
                                            <CustomText weight="medium" style={styles.addTxt}>Pending</CustomText>
                                        </TouchableOpacity>
                                    ) : (

                                        <View style={styles.memberBox}>
                                            <CustomText weight="bold" style={styles.memberTxt}>Member</CustomText>
                                            <TouchableOpacity>
                                                <Trash2 size={18} color="#00051D" />
                                            </TouchableOpacity>
                                        </View>
                                    )}

                                </View>
                            ))
                        )}
                    </ScrollView>

                </View>
            </View>
        </Modal>
    );
};

export default MembersModal;

// -------------------- STYLES --------------------
const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalBox: {
        width: "100%",
        maxWidth: 380,
        backgroundColor: "#FAFAF9",
        borderRadius: 16,
        padding: 10,
        paddingTop: 35,
        minHeight: "22%",
    },
    closeBtn: { position: "absolute", top: 12, right: 12, padding: 5 },
    closeTxt: { fontSize: 20, color: "#666" },
    title: { fontSize: 16, fontWeight: "700", color: "#000", marginBottom: 15 },
    inviteRow: { flexDirection: "row", alignItems: "center", marginBottom: 10, paddingHorizontal: 5 },
    input: {
        flex: 1,
        height: 48,
        backgroundColor: "#F5F5F5",
        borderRadius: 10,
        paddingHorizontal: 14,
        color: "#000",
        marginRight: 10,
    },
    inviteBtn: {
        backgroundColor: "#DA3C84",
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 10,
    },
    inviteText: { color: "#fff", fontSize: 14 },
    card: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        padding: 12,
        borderRadius: 12,
        marginBottom: 12,
        width: "95%",
        shadowColor: "#7a7979ff",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.20,
        shadowRadius: 6,
        elevation: 6,
    },
    profileImg: { width: 45, height: 45, borderRadius: 40, marginRight: 12 },
    name: { fontSize: 12, color: "#000" },
    addBtn: { flexDirection: "row", alignItems: "center", backgroundColor: "#DA3C84", padding: 6, borderRadius: 10 },
    addTxt: { color: "#fff", fontSize: 12, marginLeft: 4 },
    memberBox: { flexDirection: "row", alignItems: "center", gap: 12 },
    memberTxt: { color: "#00051D", fontSize: 12 },
});
