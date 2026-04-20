import React, { useState, useCallback, useEffect, useContext, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, ScrollView, Dimensions, Platform, Animated, Text, TextInput, TouchableWithoutFeedback, Switch, Keyboard } from 'react-native';
import { navigate } from '../navigation/RootNavigation';
import { Sparkles, Users, FileImage, Clock5, RotateCwSquare, Image as LucidImage, LockOpen, Lock, Calendar, Timer, TimerOff, CalendarOff, Plus, Upload, CalendarDays, Shield, Info, Check, BadgeInfo, CircleDotDashed, MessageCircleWarning, ShieldAlert } from 'lucide-react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { EventContext } from '../context/EventContext';
import { launchImageLibrary } from 'react-native-image-picker';
import { Dropdown } from 'react-native-element-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useFocusEffect } from "@react-navigation/native";

import { useLoader } from "../context/LoaderContext";
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';
// components
import TopNav from '../components/TopNavbar';
import BackgroundUI from '../components/BackgroundUI';
import CustomText from '../components/CustomText';
import ThemeButton from '../components/ThemeButton';
import { colors } from '../Theme/theme';
import PrivacyPolicyModal from '../components/PrivacyPolicyModal';
import AppModal from "../components/AppModal";

import AsyncStorage from '@react-native-async-storage/async-storage';


// assets
const hero = require('../../assets/hero.png');

const { width, height } = Dimensions.get('window');

const CreateHive = ({ navigation, route }) => {
    const { t } = useTranslation();
    const { showLoader, hideLoader } = useLoader();
    const [uploadedImage, setUploadedImage] = useState(null);
    const [selectedStockImage, setSelectedStockImage] = useState(null);



    const [hiveName, setHiveName] = useState("");
    const [selectedOption, setSelectedOption] = useState('enable')
    const [hiveDescription, setHiveDescription] = useState("");
    const { addEvent } = useContext(EventContext);
    const [isEnabled, setIsEnabled] = useState(false);
    const [isEnabledMessage, setIsEnabledMessage] = useState(true);
    const [isEnabledAdmin, setIsEnabledAdmin] = useState(false);
    const [selected, setSelected] = useState('automatic');
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);
    const [uploadType, setUploadType] = useState('');
    const [hiveType, setHiveType] = useState(null);
    const [checked, setChecked] = useState(false);
    const [showPrivacyModal, setShowPrivacyModal] = useState(false);
    const [startDate, setStartDate] = useState(new Date());
    const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [openStartDate, setOpenStartDate] = useState(false);
    const [openStartTime, setOpenStartTime] = useState(false);
    const [openEndTime, setOpenEndTime] = useState(false);
    const [openEndDate, setOpenEndDate] = useState(false);
    const [stockImages, setStockImages] = useState([]);

    const incomingPhotos = route.params?.photos || [];


    const categories = [
        { key: "corporate", label: t("corporate") },
        { key: "event", label: t("event") },
        { key: "people", label: t("people") },
        { key: "nature", label: t("nature") },
        { key: "other", label: t("other") },
    ];




    useEffect(() => {
        if (route?.params?.showCreateToast) {
            Toast.show({
                type: "success",
                text1: t('hiveCreatedSuccess'),
                text2: t('startSharingMemories'),
            });

            // 🔥 clear param so it doesn't show again
            navigation.setParams({ showCreateToast: false });
        }
    }, [route?.params?.showCreateToast]);

    const toggleMessageSwitch = () => {
        setIsEnabledMessage(previous => !previous);
    };

    const toggleAdminSwitch = () => {
        setIsEnabledAdmin(previous => !previous);
    };


    const [modalVisible, setModalVisible] = useState(false);
    const [modalData, setModalData] = useState({
        title: "",
        message: "",
        type: "info",
    });

    const showModal = ({ title, message, type = "info" }) => {
        setModalData({ title, message, type });
        setModalVisible(true);
    };


    // Format date → DD/MM/YYYY
    const formatDate = (date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    // Format time → HH:MM AM/PM
    const formatTime = (date) => {
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let ampm = hours >= 12 ? 'PM' : 'AM';

        hours = hours % 12;
        hours = hours ? hours : 12;
        minutes = minutes < 10 ? '0' + minutes : minutes;

        return `${hours}:${minutes} ${ampm}`;
    };

    const data = [
        { label: t('inviteOnly'), value: 'invite' },
        { label: t('public'), value: 'public' },
    ];



    // Convert JS Date → API format YYYY-MM-DD
    const formatAPIDate = (date) => {
        if (!date) return "";
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };


    // Convert JS Date → API format HH:mm AM/PM (12-hour format)
    const formatAPITime = (date) => {
        if (!date) return "";
        const d = new Date(date);
        let hours = d.getHours();
        let minutes = d.getMinutes();
        const ampm = hours >= 12 ? 'pm' : 'am';

        hours = hours % 12;
        hours = hours ? hours : 12; // Convert 0 to 12
        minutes = minutes < 10 ? '0' + minutes : minutes;

        return `${hours}:${minutes} ${ampm}`;
    };


    useEffect(() => {
        if (route?.params?.cameraPhotos) {
            console.log('Received camera photos:', route.params.cameraPhotos.length);
        }
    }, [route?.params?.cameraPhotos]);
    const isCreateDisabled =
        !hiveName.trim() ||                 // Hive name required
        (!uploadedImage && !selectedStockImage) || // Image required
        !hiveType ||                        // Privacy dropdown
        // !uploadType ||                      // Media upload settings
        // !selectedOption ||                  // Messaging settings
        !checked;
    // Privacy policy
    // const uploadAutoSyncPhotos = async (hiveId) => {
    //     const storedPhotos = await AsyncStorage.getItem("AUTO_SYNC_PHOTOS");
    //     if (!storedPhotos) return;

    //     const photos = JSON.parse(storedPhotos).slice(0, 20);
    //     const userId = await AsyncStorage.getItem("userId");
    //     const token = await AsyncStorage.getItem("token");

    //     const uploadedUrls = [];

    //     for (const photo of photos) {
    //         try {
    //             const url = await uploadImageToFirebase(photo, userId, hiveId);
    //             uploadedUrls.push(url);
    //         } catch (error) {
    //             console.log("❌ AutoSync upload failed:", error);
    //         }
    //     }

    //     await fetch(
    //         `https://snaphive-node.vercel.app/api/hives/${hiveId}/images`,
    //         {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json",
    //                 Authorization: `Bearer ${token}`,
    //             },
    //             body: JSON.stringify({ images: uploadedUrls }),
    //         }
    //     );

    //     await AsyncStorage.removeItem("AUTO_SYNC_PHOTOS");
    // };

    const handleCreateHive = async () => {
const storedUser = await AsyncStorage.getItem("user");
const parsedUser = storedUser ? JSON.parse(storedUser) : null;
        try {
            if (isCreateDisabled) {
                Toast.show({
                    type: "info",
                    text1: t('completeAllFields'),
                    text2: t('completeAllFields'),
                });
                return;
            }

            showLoader();


            // 📦 Create local hive object
            // ✅ FIRST
            const newImages = incomingPhotos.map(p => ({
                url: p.uri,
                type: "image",
                blurred: false,
            }));

            // ✅ THEN
 const newHive = {
  id: Date.now().toString(),
  hiveName,
  description: hiveDescription || "No description",
  privacyMode: hiveType,

  // ✅ ADD THIS
user: {
  _id: parsedUser?._id || parsedUser?.id || Date.now().toString(),
  name: parsedUser?.name || "You",
  profileImage: parsedUser?.profileImage || "https://via.placeholder.com/150",
},
  isTemporary: isEnabled,
  eventDate: isEnabled ? formatAPIDate(startDate) : "",
  startTime: isEnabled ? formatAPITime(startTime) : "",
  endTime: isEnabled ? formatAPITime(endTime) : "",
  expiryDate: isEnabled ? formatAPIDate(endDate) : "",

  coverImage: uploadedImage?.uri || selectedStockImage,
  createdAt: new Date().toISOString(),

  images: newImages,
  videos: [],
  likes: [],
  comments: [],
  members: [],
};

            // 💾 Save locally
            const existing = await AsyncStorage.getItem("HIVES");
            const hives = existing ? JSON.parse(existing) : [];
            hives.push(newHive);

            await AsyncStorage.setItem("HIVES", JSON.stringify(hives));

            Toast.show({
                type: "success",
                text1: t('hiveCreatedSuccess'),
                text2: t('startSharingMemories'),
            });

            navigation.navigate("HomeScreen", {
                showCreateToast: true,
                openTab: hiveType === "invite" ? "profile" : "grid",
            });

        } catch (error) {
            Toast.show({
                type: "error",
                text1: t('somethingWentWrong'),
                text2: error.message,
            });
        } finally {
            hideLoader();
        }
    };









    // ios date time picker

    const onStartDateChange = (event, selectedDate) => {
        if (Platform.OS === 'android') {
            setOpenStartDate(false);
        }
        if (event.type === 'set' && selectedDate) {
            setStartDate(selectedDate);
            if (Platform.OS === 'ios') {
                // Don't auto-close on iOS, let user press Done
            }
        } else if (event.type === 'dismissed') {
            setOpenStartDate(false);
        }
    };

    const onEndDateChange = (event, selectedDate) => {
        if (Platform.OS === 'android') {
            setOpenEndDate(false);
        }
        if (event.type === 'set' && selectedDate) {
            setEndDate(selectedDate);
        } else if (event.type === 'dismissed') {
            setOpenEndDate(false);
        }
    };

    const onStartTimeChange = (event, selectedTime) => {
        if (Platform.OS === 'android') {
            setOpenStartTime(false);
        }
        if (event.type === 'set' && selectedTime) {
            setStartTime(selectedTime);
        } else if (event.type === 'dismissed') {
            setOpenStartTime(false);
        }
    };

    const onEndTimeChange = (event, selectedTime) => {
        if (Platform.OS === 'android') {
            setOpenEndTime(false);
        }
        if (event.type === 'set' && selectedTime) {
            setEndTime(selectedTime);
        } else if (event.type === 'dismissed') {
            setOpenEndTime(false);
        }
    };



    useEffect(() => {
        const mockImages = [
            { category: "corporate", file: "https://picsum.photos/300/300?1" },
            { category: "event", file: "https://picsum.photos/300/300?2" },
            { category: "people", file: "https://picsum.photos/300/300?3" },
            { category: "nature", file: "https://picsum.photos/300/300?4" },
            { category: "other", file: "https://picsum.photos/300/300?5" },
        ];

        setStockImages(mockImages);
    }, []);


    const getImageByCategory = (categoryKey) => {
        const found = stockImages.find(img => img.category === categoryKey);
        return found ? found.file : null;
    };

    return (
        <BackgroundUI>

            <TopNav />
            <ScrollView
                style={styles.container}
                showsVerticalScrollIndicator={false}>
                <View>
                    <CustomText weight="bold" style={styles.snapText}>
                        Create a New Post
                    </CustomText>
                </View>
                <View style={[styles.createHiveCard, { marginBottom: 120, }]}>


                    <View style={{ paddingHorizontal: 14, backgroundColor: 'transparent', borderRadius: 16, overflow: 'hidden', backgroundColor: colors.secondary, width: "100%", margin: 'auto', borderWidth: 0, }}>
                        <View style={{ marginBottom: 16, marginTop: 16 }}>
                            <CustomText weight='bold' style={{ marginBottom: 4, color: '#374151' }}>{t('hiveName')} *</CustomText>
                            <TextInput
                                placeholder={t('hiveNamePlaceholder')}
                                style={styles.inputType}
                                keyboardType="default"
                                autoCapitalize="none"
                                autoCorrect={false}
                                value={hiveName}
                                onChangeText={setHiveName}
                                onSubmitEditing={() => Keyboard.dismiss()}
                                maxLength={23}
                            />
                        </View>

                        <View style={{ marginBottom: 16 }}>
                            <CustomText weight="bold" style={{ marginBottom: 4, color: '#374151' }}>
                                {t('description')}
                            </CustomText>
                            <TextInput
                                placeholder={t('descriptionPlaceholder')}
                                style={[styles.inputType, { textAlignVertical: 'top', height: 50 }]}
                                multiline={true}
                                numberOfLines={4}
                                value={hiveDescription}
                                onChangeText={setHiveDescription}
                                onSubmitEditing={() => Keyboard.dismiss()}
                                maxLength={50}
                            />
                        </View>

                        <CustomText weight='bold' style={{ marginBottom: 0, color: '#374151' }}>{t('coverImage')}*</CustomText>


                        <CustomText weight='mediumItalic' style={{ marginBottom: 8, color: '#777777ff', fontSize: 12 }}>{t('imageSizeWarning')}</CustomText>
                        <TouchableWithoutFeedback onPress={() => {
                            const options = {
                                mediaType: "photo",
                                quality: 1,
                                includeExtra: true,
                            };

                            launchImageLibrary(options, (response) => {
                                if (response.didCancel) {
                                    console.log("User cancelled image picker");
                                    return;
                                }

                                if (response.errorCode) {
                                    console.log("ImagePicker Error: ", response.errorMessage);
                                    return;
                                }

                                if (response.assets && response.assets.length > 0) {
                                    const selectedImage = response.assets[0];

                                    console.log("PICKED FILE INFO:", selectedImage);

                                    const MAX_SIZE = 10 * 1024 * 1024;

                                    if (selectedImage.fileSize && selectedImage.fileSize > MAX_SIZE) {
                                        showModal({
                                            title: t('imageExceedsSize'),
                                            message: t('imageExceedsSize'),
                                            type: "warning",
                                        });
                                        return;
                                    }

                                    setUploadedImage(selectedImage);
                                    setSelectedStockImage(null);

                                }
                            });

                        }}>
                            <View style={styles.uploadContainer}>
                                {(uploadedImage || selectedStockImage) ? (
                                    <View style={{ width: '100%', height: '100%', borderRadius: 8, overflow: 'hidden' }}>
                                        <Animated.Image
                                            source={{
                                                uri: uploadedImage
                                                    ? uploadedImage.uri
                                                    : selectedStockImage,

                                            }}
                                            style={{ width: '100%', height: '100%' }}
                                            resizeMode="cover"
                                        />
                                    </View>
                                ) : (
                                    <>
                                        <Upload color='#9B9B9B' width={28} height={28} />

                                        <CustomText weight='medium' style={{ marginTop: 4, color: '#67696b' }}>{t('uploadYourOwnImage')}</CustomText>
                                    </>
                                )}
                            </View>
                        </TouchableWithoutFeedback>


                        {/* <CustomText weight="medium" style={{ marginBottom: 15, color: colors.textGray, marginTop: 16, }}>
                            {t('chooseFromStock')}
                        </CustomText> */}
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{
                                paddingHorizontal: 10,
                            }}
                        >
                            {categories.map((cat) => {
                                const imageUrl = getImageByCategory(cat.key);

                                return (
                                    <TouchableOpacity
                                        key={cat.key}
                                        style={{
                                            width: 75,
                                            height: 75,
                                            marginRight: 8,
                                            borderRadius: 8,
                                            overflow: 'hidden',
                                        }}
                                        onPress={() => {
                                            setSelectedStockImage(imageUrl);
                                            setUploadedImage(null);
                                        }}
                                        activeOpacity={0.7}
                                    >
                                        <Image
                                            source={{
                                                uri: imageUrl || "https://via.placeholder.com/300",
                                            }}
                                            style={{
                                                width: '100%',
                                                height: '100%',

                                            }}
                                        />

                                        {/* Overlay */}
                                        <View
                                            style={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                bottom: 0,
                                                backgroundColor: 'rgba(0,0,0,0.4)',
                                            }}
                                        >
                                            <View style={{
                                                position: 'absolute',
                                                bottom: 5,
                                                width: '100%',
                                                alignItems: 'center',
                                            }}>

                                                <Text
                                                    style={{
                                                        position: 'absolute',

                                                        bottom: 5,
                                                        color: '#fff',
                                                        fontSize: 14,
                                                        textAlign: 'center',
                                                    }}
                                                >
                                                    {cat.label}
                                                </Text>

                                            </View>

                                        </View>

                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>

                        <View style={{ marginBottom: 0, marginTop: 16 }}>
                            <CustomText weight="bold" style={{ marginBottom: 4, color: '#374151' }}>
                                Privacy Settings*
                            </CustomText>
                            <Dropdown
                                style={[styles.inputType]}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                data={data}
                                search
                                maxHeight={300}
                                labelField="label"
                                valueField="value"
                                searchPlaceholder={t('search')}
                                placeholder={t('hiveType')}
                                value={hiveType}
                                onChange={item => {
                                    setHiveType(item.value);
                                }}
                            />
                        </View>

                        <View style={styles.privacyContainer}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBlock: 12 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                    <CircleDotDashed color={"#b8a816"} />
                                    <View style={{ marginLeft: 12 }}>
                                        <CustomText weight='bold' style={{ fontSize: 16 }}>Temporary Event Post</CustomText>
                                        {/* <CustomText weight='regular' style={{ color: '#374151', fontSize: 12 }}>{t('setDatesForEvent')}</CustomText> */}
                                    </View>
                                </View>
                                <Switch
                                    trackColor={{ false: '#767577', true: '#81b0ff' }}
                                    thumbColor={isEnabled ? '#4b5cf5ff' : '#f4f3f4'}
                                    ios_backgroundColor="#3e3e3e"
                                    onValueChange={toggleSwitch}
                                    value={isEnabled}
                                />
                            </View>
                            {/* that time only show this View */}
                            {isEnabled && (
                                <View>
                                    {/* Divider */}
                                    <View style={{ marginTop: 15 }}>
                                        <View style={{ backgroundColor: "#ccc", height: 0.4, width: "100%" }} />

                                        <View
                                            style={{
                                                flexDirection: "row",
                                                alignItems: "center",
                                                gap: 6,
                                                marginBottom: 5,
                                                marginTop: 15,
                                            }}
                                        >
                                            <Calendar width={16} />
                                            <CustomText weight="semiBold" color="#374151">
                                                {t('eventStartDate')}
                                            </CustomText>
                                        </View>

                                        <TouchableOpacity
                                            onPress={() => setOpenStartDate(true)}
                                            activeOpacity={0.7}
                                        >
                                            <View style={styles.input} pointerEvents="none">
                                                <TextInput
                                                    placeholder={t('selectDate')}
                                                    value={formatDate(startDate)}
                                                    editable={false}
                                                    style={{ color: '#000' }}
                                                />
                                            </View>
                                        </TouchableOpacity>

                                        {openStartDate && (
                                            <View>
                                                <DateTimePicker
                                                    value={startDate}
                                                    mode="date"
                                                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                                    onChange={onStartDateChange}
                                                    minimumDate={new Date()}
                                                />
                                                {Platform.OS === 'ios' && (
                                                    <TouchableOpacity
                                                        onPress={() => setOpenStartDate(false)}
                                                        style={{
                                                            padding: 12,
                                                            backgroundColor: '#007AFF',
                                                            borderRadius: 8,
                                                            alignItems: 'center',
                                                            marginTop: 8
                                                        }}
                                                    >
                                                        <CustomText weight="bold" style={{ color: '#fff' }}>{t('done')}</CustomText>
                                                    </TouchableOpacity>
                                                )}
                                            </View>
                                        )}
                                    </View>
                                    {/* --------------------- EVENT END DATE ---------------------- */}
                                    <View style={{ marginTop: 20 }}>
                                        <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 5 }}>
                                            <CalendarOff width={16} />
                                            <CustomText weight="semiBold" color="#374151">
                                                {t('eventEndDate')}
                                            </CustomText>
                                        </View>

                                        <TouchableOpacity
                                            onPress={() => setOpenEndDate(true)}
                                            activeOpacity={0.7}
                                        >
                                            <View style={styles.input} pointerEvents="none">
                                                <TextInput
                                                    placeholder={t('selectDate')}
                                                    value={formatDate(endDate)}
                                                    editable={false}
                                                    style={{ color: '#000' }}
                                                />
                                            </View>
                                        </TouchableOpacity>

                                        {openEndDate && (
                                            <View>
                                                <DateTimePicker
                                                    value={endDate}
                                                    mode="date"
                                                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                                    onChange={onEndDateChange}
                                                    minimumDate={startDate}
                                                />
                                                {Platform.OS === 'ios' && (
                                                    <TouchableOpacity
                                                        onPress={() => setOpenEndDate(false)}
                                                        style={{
                                                            padding: 12,
                                                            backgroundColor: '#007AFF',
                                                            borderRadius: 8,
                                                            alignItems: 'center',
                                                            marginTop: 8
                                                        }}
                                                    >
                                                        <CustomText weight="bold" style={{ color: '#fff' }}>{t('done')}</CustomText>
                                                    </TouchableOpacity>
                                                )}
                                            </View>
                                        )}
                                    </View>


                                    {/* --------------------- START TIME + END TIME ---------------------- */}
                                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                        {/* START TIME */}
                                        <View style={{ marginTop: 20, width: "48%" }}>
                                            <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 5 }}>
                                                <Timer width={16} />
                                                <CustomText weight="semiBold" color="#374151">
                                                    {t('startTime')}
                                                </CustomText>
                                            </View>

                                            <TouchableOpacity
                                                onPress={() => setOpenStartTime(true)}
                                                activeOpacity={0.7}
                                            >
                                                <View style={styles.input} pointerEvents="none">
                                                    <TextInput
                                                        placeholder={t('selectTime')}
                                                        value={formatTime(startTime)}
                                                        editable={false}
                                                        style={{ color: '#000' }}
                                                    />
                                                </View>
                                            </TouchableOpacity>

                                            {openStartTime && (
                                                <View>
                                                    <DateTimePicker
                                                        value={startTime}
                                                        mode="time"
                                                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                                        onChange={onStartTimeChange}
                                                    />
                                                    {Platform.OS === 'ios' && (
                                                        <TouchableOpacity
                                                            onPress={() => setOpenStartTime(false)}
                                                            style={{
                                                                padding: 12,
                                                                backgroundColor: '#007AFF',
                                                                borderRadius: 8,
                                                                alignItems: 'center',
                                                                marginTop: 8
                                                            }}
                                                        >
                                                            <CustomText weight="bold" style={{ color: '#fff' }}>{t('done')}</CustomText>
                                                        </TouchableOpacity>
                                                    )}
                                                </View>
                                            )}
                                        </View>

                                        {/* END TIME */}
                                        <View style={{ marginTop: 20, width: "48%" }}>
                                            <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 5 }}>
                                                <TimerOff width={16} />
                                                <CustomText weight="semiBold" color="#374151">
                                                    {t('endTime')}
                                                </CustomText>
                                            </View>

                                            <TouchableOpacity
                                                onPress={() => setOpenEndTime(true)}
                                                activeOpacity={0.7}
                                            >
                                                <View style={styles.input} pointerEvents="none">
                                                    <TextInput
                                                        placeholder={t('selectTime')}
                                                        value={formatTime(endTime)}
                                                        editable={false}
                                                        style={{ color: '#000' }}
                                                    />
                                                </View>
                                            </TouchableOpacity>

                                            {openEndTime && (
                                                <View>
                                                    <DateTimePicker
                                                        value={endTime}
                                                        mode="time"
                                                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                                        onChange={onEndTimeChange}
                                                    />
                                                    {Platform.OS === 'ios' && (
                                                        <TouchableOpacity
                                                            onPress={() => setOpenEndTime(false)}
                                                            style={{
                                                                padding: 12,
                                                                backgroundColor: '#007AFF',
                                                                borderRadius: 8,
                                                                alignItems: 'center',
                                                                marginTop: 8
                                                            }}
                                                        >
                                                            <CustomText weight="bold" style={{ color: '#fff' }}>{t('done')}</CustomText>
                                                        </TouchableOpacity>
                                                    )}
                                                </View>
                                            )}
                                        </View>
                                    </View>
                                </View>
                            )}


                        </View>


                        <View style={{ marginBottom: 12, }}>







                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <TouchableOpacity
                                    onPress={() => setChecked(!checked)}
                                    style={{
                                        height: 20,
                                        width: 20,
                                        borderRadius: 4,
                                        borderWidth: 2,
                                        borderColor: checked ? '#69ec48ff' : '#9CA3AF',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                    activeOpacity={0.7}
                                >
                                    {checked && (
                                        <View
                                            style={{
                                                height: 12,
                                                width: 12,
                                                backgroundColor: '#5bec48ff',
                                                borderRadius: 2,
                                            }}
                                        />
                                    )}
                                </TouchableOpacity>
                                <TouchableWithoutFeedback onPress={() => setShowPrivacyModal(true)}>
                                    <View style={{ paddingHorizontal: 20 }}>
                                        <CustomText weight="medium" style={{ color: '#646464', fontSize: 10 }}>
                                            I have read the Content Responsibility & Privacy Policy
                                            and agree to all content uploaded to my event hive
                                        </CustomText>
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>



                            <View style={{}}>
                                <ThemeButton
                                    text={t('createHive')}
                                    onPress={handleCreateHive}
                                    disabled={isCreateDisabled}
                                    style={{ width: "100%" }}
                                />

                            </View>
                        </View>
                    </View>
                </View>
                <PrivacyPolicyModal
                    visible={showPrivacyModal}
                    onClose={() => setShowPrivacyModal(false)}
                />
            </ScrollView>
            <AppModal
                visible={modalVisible}
                title={modalData.title}
                message={modalData.message}
                type={modalData.type}
                onClose={() => setModalVisible(false)}
            />


        </BackgroundUI>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: width * 0.05,
    },
    snapText: {
        fontSize: 30,
        marginTop: 10,
        color: '#000',
    },
    uploadContainer: {
        width: '100%',
        height: 150,
        borderWidth: 1.8,
        borderColor: '#E5E7EB',
        borderStyle: 'dashed',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },

    inputType: {
        borderWidth: 1,
        borderColor: '#F6F6F6',
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingLeft: 18,
        paddingVertical: 16,
        fontSize: 16,
    },

    privacyContainer: {

        borderRadius: 12,
        marginVertical: 20,
    },
    privacy: {
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: '#D9D9D9',
        marginTop: 8,
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        fontSize: 16,
        width: '100%'
    },

    importHeading: {
        fontSize: 14,
        fontWeight: '600',
        color: '#E3761B',
        marginBottom: 4,
        lineHeight: 20,
    },
    continueBtn: {
        width: '100%',

        overflow: 'hidden',
    },
    touchable: {
        paddingVertical: 21,
        paddingHorizontal: 20,

    },
    content: {
        flexDirection: 'row',
        gap: 8,
    },
    continueTxt: {
        fontSize: 16,
        fontWeight: '600',
        color: '#ffffff',
    },
    createHiveCard: {
        borderRadius: 16,
        overflow: 'hidden',
        marginTop: 20,
        paddingBottom: 16,
        borderWidth: 0,
        borderColor: "#e7e7e7"
        // shadowColor: '#000',
        // shadowOffset: { width: 0, height: 4 },
        // shadowOpacity: 0.1,
        // shadowRadius: 6,
        // elevation: 6,
    },
    dropdown: {
        borderWidth: 1,
        borderColor: '#F6F6F6',
        backgroundColor: '#F6F6F6',
        borderRadius: 10,
        paddingHorizontal: 18,
        paddingVertical: 16,
        fontSize: 16,
        color: '#800b0b',
    },
    placeholderStyle: {
        color: '#999',
        fontSize: 16,
    },
    selectedTextStyle: {
        color: '#000',
        fontSize: 16,
    },
    radiobuttonContainer: {
        borderWidth: 1,

        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 15,
        marginBottom: 16,
    },

    // Stock image
    imageGrid: {
        flexDirection: "row",
        flexWrap: "no-wrap",
        justifyContent: "space-between",
        gap: 10,
        marginBottom: 20,

    },
    imageContainer: {
        position: "relative",
        width: width * 0.18,
        height: height * 0.3,
        marginBottom: 10,
    },
    image: {
        width: "100%",
        height: "100%",
        borderRadius: 8,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.3)",
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
    },
    imageText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
});

export default CreateHive;