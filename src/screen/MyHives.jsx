import React, { useState, useCallback, useEffect, useContext, useRef, } from 'react';
import { colors } from '../Theme/theme';
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    View,
    Image,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    Animated,
    Text,
    TextInput,
    RefreshControl,
    TouchableWithoutFeedback,
    ActivityIndicator
} from 'react-native';
import {
    Sparkles,
    Users,
    FileImage,
    Clock5,
    ImagePlus,
    MoveRight,
    Brush,
    Image as Photo,
    Search,
    CirclePlus,
    Plus,
    Package,
    Aperture,
    ImagePlay,
    UserRound,

} from 'lucide-react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';


import { EventContext } from '../context/EventContext';
import { useNavigation } from '@react-navigation/native';
import { ImageBackground } from "react-native";
// components
import TopNav from '../components/TopNavbar';
import CustomText from '../components/CustomText';
import BackgroundUI from '../components/BackgroundUI';
import { useTranslation } from 'react-i18next';
import SearchBar from '../components/SearchBar';
// assets
import { Alert } from "react-native";
import { Trash2 } from "lucide-react-native";


import { useFocusEffect } from '@react-navigation/native';
const { width, height } = Dimensions.get('window');

const MyHives = ({ navigation, route }) => {
    const hiveId = route?.params?.hiveId;
    const [menuVisible, setMenuVisible] = useState(false);

    const [user, setUser] = useState(null);

    const [refreshing, setRefreshing] = useState(false);
    const { hives, setHives } = useContext(EventContext);
    const { t, i18n } = useTranslation();
    const [searchText, setSearchText] = useState("");
    const [loggedUser, setLoggedUser] = useState(null);
    const [loading, setLoading] = useState(true);




    const fetchHives = async () => {
        try {
            const stored = await AsyncStorage.getItem("HIVES");
            const localHives = stored ? JSON.parse(stored) : [];

            setHives(localHives);
        } catch (e) {
            console.log("Local fetch error:", e);
        }
    };




    const onRefresh = async () => {
        try {
            setRefreshing(true);
            await fetchHives();   // 🔥 THIS was missing
        } catch (e) {
            console.log("Refresh error:", e);
        } finally {
            setRefreshing(false);
        }
    };


    const getHivePhotos = (hive) => {
        if (Array.isArray(hive.images) && hive.images.length > 0) {
            return hive.images;
        }
        if (Array.isArray(hive.photos) && hive.photos.length > 0) {
            return hive.photos;
        }
        return [];
    };



    const getHiveMembersCount = (hive) => {
        // Best case: backend already sends count
        if (typeof hive.memberCount === "number") {
            return hive.memberCount;
        }

        // Common cases: members array
        if (Array.isArray(hive.members)) {
            return hive.members.length;
        }

        if (Array.isArray(hive.participants)) {
            return hive.participants.length;
        }

        if (Array.isArray(hive.invitedUsers)) {
            return hive.invitedUsers.length;
        }

        // Owner only
        return 1;
    };

    const filteredHives = hives.filter(hive =>
        hive.hiveName?.toLowerCase().includes(searchText.toLowerCase())
    );


    useFocusEffect(
        useCallback(() => {
            const load = async () => {
                try {
                    setLoading(true);
                    await fetchHives();
                } catch (e) {
                    console.log("Fetch error:", e);
                } finally {
                    setLoading(false);
                }
            };

            load();
        }, [])
    );

    const handleDeleteHive = async (hiveId) => {

        try {
            const stored = await AsyncStorage.getItem("HIVES");
            let hives = stored ? JSON.parse(stored) : [];

            hives = hives.filter(h => h.id !== hiveId);

            await AsyncStorage.setItem("HIVES", JSON.stringify(hives));

            setHives(hives);

        } catch (error) {
            console.log("Delete error:", error);

        };
    };
    useEffect(() => {
        const loadUser = async () => {
            const storedUser = await AsyncStorage.getItem("user");
            if (storedUser) {
                setLoggedUser(JSON.parse(storedUser));
            }
        };

        loadUser();
    }, []);
    const isHiveMember = (hive) =>
        hive.members?.some(
            m =>
                m.email === loggedUser?.email &&
                m.status === "accepted"
        );



    useEffect(() => {
        const fetchUser = async () => {
            try {
                const storedUser = await AsyncStorage.getItem("user");
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                    console.log("Loaded user:", JSON.parse(storedUser));
                }
            } catch (error) {
                console.log("Error loading user:", error);
            }
        };
        fetchUser();
    }, []);

    const getGreeting = () => {
        const hour = new Date().getHours();

        if (hour < 12) {
            return "Good Morning";
        } else if (hour < 17) {
            return "Good Afternoon";
        } else {
            return "Good Evening";
        }
    };


    return (
        <BackgroundUI>

            <TopNav />
            <ScrollView
                style={styles.container}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }>
                {/* Header Section */}

                <View style={styles.headerSection}>
                    <CustomText weight="semiBold" style={{ marginBottom: 10, fontSize: 22 }}> {getGreeting()}!</CustomText>

                    <CustomText style={styles.subtitle}>
                        {t('allSharedMemories')}
                    </CustomText>
                    <View
                        style={{
                            position: "relative",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 8,
                        }}
                    >

                        <View style={styles.searchWrapper}>

                            {/* Search Input */}
                            <View style={styles.searchInputContainer}>

                                <TextInput
                                    value={searchText}
                                    onChangeText={setSearchText}
                                    placeholder={t("searchHive")}
                                    placeholderTextColor="#9CA3AF"
                                    style={styles.searchInput}
                                />

                                {/* Search Icon */}
                                <Search
                                    size={26}
                                    color="#6B7280"
                                    style={{ marginRight: 0 }}
                                />

                            </View>

                            {/* Plus Button Attached */}
                            <TouchableOpacity
                                onPress={() => navigation.navigate('CreateHive')}
                                activeOpacity={0.8}
                                style={styles.plusButton}
                            >
                                <Plus size={26} color="#fff" />
                            </TouchableOpacity>

                        </View>



                    </View>
                </View>



                {/* Event Row Section */}
                <View style={{ paddingBottom: 100 }}>

                    <CustomText weight="bold" style={styles.title}>{t('myHives')}</CustomText>
                    {loading ? (
                        <View style={{ marginTop: 100, alignItems: "center", justifyContent: 'center' }}>
                            <ActivityIndicator size="large" color={colors.primary} />
                        </View>
                    ) : filteredHives.length > 0 ? (
                        filteredHives.map((item, index) => (
                            <TouchableWithoutFeedback
                                key={index}
                                onPress={() =>
                                    navigation.navigate("FolderLayout", {
                                        image: { uri: item.coverImage },
                                        folderName: item.hiveName,
                                        hiveId: item._id,
                                        date: item.createdAt,
                                        owner: item.ownerName,
                                        eventDescription: item.description,
                                        photos: item.photos || [],
                                    })
                                }
                            >
                                <ImageBackground
                                    source={{ uri: item.coverImage }}
                                    style={styles.eventImg}
                                    imageStyle={{ borderRadius: 14 }}
                                >
                                    <View style={{ flex: 1, justifyContent: "space-between", padding: 10, paddingLeft: 15 }}>

                                        <View>
                                            <CustomText weight="bold" style={[styles.eventTitle, { color: "#fff" }]}>
                                                {item.hiveName}
                                            </CustomText>

                                            <CustomText weight="medium" style={[styles.mtop, { color: "#fff" }]}>
                                                {item.description || "No description"}
                                            </CustomText>
                                        </View>

                                        <View style={{ flexDirection: "row", gap: 20 }}>
                                            <View style={{ flexDirection: "row", gap: 4, alignItems: "center" }}>
                                                <Users width={14} height={14} color="#fff" />
                                                <CustomText style={{ color: "#fff" }}>
                                                    {getHiveMembersCount(item)}
                                                </CustomText>
                                            </View>

                                            <View style={{ flexDirection: "row", gap: 4, alignItems: "center" }}>
                                                <FileImage width={14} height={14} color="#fff" />
                                                <CustomText style={{ color: "#fff" }}>
                                                    {getHivePhotos(item).length}
                                                </CustomText>
                                            </View>
                                            <TouchableOpacity
                                                onPress={() =>
                                                    navigation.navigate("FolderLayout", {
                                                        image: { uri: item.coverImage },
                                                        folderName: item.hiveName,
                                                        date: item.createdAt,
                                                        hiveId: item._id,
                                                        owner: item.user?.name,
                                                        photos: item.images || [],
                                                        eventTitle: item.hiveName,
                                                        eventDescription: item.description,
                                                        eventEndTime: item.endTime,
                                                        eventExpiryDate: item.expiryDate,
                                                        membersCount: item.members?.length || 0,
                                                    })
                                                } style={{ position: 'absolute', right: 4, bottom: 4 }}>
                                                <View style={{ backgroundColor: '#ffffffa6', justifyContent: "center", alignItems: "center", borderRadius: 50, alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 4 }}>
                                                    <CustomText weight="semiBold" style={{ color: "#000000" }}>Open Hive </CustomText>
                                                </View>
                                            </TouchableOpacity>

                                            {!isHiveMember(item) && (
                                                <TouchableOpacity
                                                    onPress={() => handleDeleteHive(item.id)}
                                                    style={{ position: 'absolute', right: 4, bottom: 70 }}
                                                >
                                                    <View style={{ width: 30, height: 30, backgroundColor: '#d30e0ea6', justifyContent: "center", alignItems: "center", borderRadius: 50 }}>
                                                        <Trash2 size={18} color="#fff" />
                                                    </View>
                                                </TouchableOpacity>
                                            )}
                                        </View>

                                    </View>
                                </ImageBackground>
                            </TouchableWithoutFeedback>
                        ))
                    ) : (

                        <View
                            style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 10,
                                marginTop: 60,
                                marginBottom: 80,
                            }}
                        >
                            <View
                                style={{
                                    width: 60,
                                    height: 60,
                                    backgroundColor: '#c2beffff',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: 50,
                                }}
                            >
                                <ImagePlus color="#fff" size={28} />
                            </View>

                            <CustomText weight="medium" style={{ color: '#da3c84' }}>
                                {t('noHivesYet')}
                            </CustomText>
                            <TouchableOpacity onPress={() => navigation.navigate('CreateHive')}>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        gap: 6,
                                        backgroundColor: '#f7a481',
                                        padding: 15,
                                        borderRadius: 12,
                                        marginTop: 8,
                                    }}
                                >
                                    <CustomText weight="bold" style={{ color: '#ffffff' }}>
                                        {t('createYourFirstHive')}
                                    </CustomText>
                                    <CirclePlus color="#ffffff" />
                                </View>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>


            </ScrollView>

        </BackgroundUI >
    );
};



const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: width * 0.05,
        backgroundColor: '#faf2f831',
    },
    headerSection: {
        marginTop: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        color: colors.primary,
        marginBottom: 15,
    },
    subtitle: {
        fontSize: 14,
        color: '#6B7280',

    },
    searchWrapper: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#ffffff17",
        borderWidth: 1,
        borderColor: '#cfcfcf',
        borderRadius: 40,
        padding: 6,
        marginBlock: 12,
    },

    searchInputContainer: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
    },

    searchInput: {
        flex: 1,
        fontSize: 18,
        color: "#111827",
        paddingVertical: 12,
    },

    plusButton: {
        backgroundColor: 'rgba(243, 92, 142, 0.9)',
        paddingHorizontal: 20,
        paddingBlock: 10,
        borderRadius: 25,
        alignItems: "center",
        justifyContent: "center",
        marginLeft: 6,
        borderWidth: 1,
        borderColor: '#ffffff',
    },
    eventRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 14,
        padding: 14,
        marginTop: 18,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#f3f4f6',
    },
    eventImg: {
        width: "100%",
        height: 120,
        borderRadius: 14,
        overflow: "hidden",
        marginBottom: 20,
    },
    eventTitle: {
        fontSize: 16,
        color: '#111827',
        fontWeight: '600',
    },
    mtop: {
        marginTop: 6,
        color: '#6B7280',
    },

    profileIcon: {
        position: 'absolute',
        right: -10,
        bottom: -5,
        backgroundColor: '#ec4899',
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
    },

});

export default MyHives;
