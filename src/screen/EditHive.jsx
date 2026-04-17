import React, { useState, useCallback, useEffect, useContext, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, ScrollView, Dimensions, Platform, Animated, Text, TextInput, TouchableWithoutFeedback, Switch, Keyboard } from 'react-native';
import { navigate } from '../navigation/RootNavigation';
import { Sparkles, Users, FileImage, Clock5, RotateCwSquare, Image as LucidImage, LockOpen, Lock, Calendar, Timer, TimerOff, CalendarOff, Plus, Upload, CalendarDays, Shield, Info, Check, BadgeInfo } from 'lucide-react-native';
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
import CustomText from '../components/CustomText';
import ThemeButton from '../components/ThemeButton';
import BackgroundUI from '../components/BackgroundUI';
import { colors } from '../Theme/theme';
import PrivacyPolicyModal from '../components/PrivacyPolicyModal';
import AppModal from "../components/AppModal";

import AsyncStorage from '@react-native-async-storage/async-storage';
import { uploadImageToFirebase } from '../utils/firebaseUpload';

// assets
const hero = require('../../assets/hero.png');

const { width, height } = Dimensions.get('window');

const EditHive = ({ navigation, route }) => {
    const { hiveId } = route.params || {};
    const { t } = useTranslation();
    const { showLoader, hideLoader } = useLoader();
    const [uploadedImage, setUploadedImage] = useState(null);
    const [selectedStockImage, setSelectedStockImage] = useState(null);



    const [hiveName, setHiveName] = useState("");
    const [selectedOption, setSelectedOption] = useState('enable')
    const [hiveDescription, setHiveDescription] = useState("");
    const { addEvent } = useContext(EventContext);
    const [isEnabled, setIsEnabled] = useState(false);
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

    const categories = [
        { key: "corporate", label: t("corporate") },
        { key: "event", label: t("event") },
        { key: "people", label: t("people") },
        { key: "nature", label: t("nature") },
        { key: "other", label: t("other") },
    ];


    const fetchHive = async () => {
    try {
        const token = await AsyncStorage.getItem("token");

        const res = await fetch(
            `https://snaphive-node.vercel.app/api/hives/${hiveId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const data = await res.json();

        if (data.success) {
            const hive = data.data;

            setHiveName(hive.hiveName || "");
            setHiveDescription(hive.description || "");
            setUploadType(hive.privacyMode || "automatic");

            if (hive.coverImage) {
                setSelectedStockImage(hive.coverImage);
            }

            if (hive.eventDate) setStartDate(new Date(hive.eventDate));
            if (hive.expiryDate) setEndDate(new Date(hive.expiryDate));
        }

    } catch (err) {
        console.log("Fetch hive error:", err);
    }
};

useEffect(() => {
    if (hiveId) {
        fetchHive();
    }
}, [hiveId]);



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
        { label: t('inviteOnly'), value: '1' },
        { label: t('public'), value: '2' },
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
        !uploadType ||                      // Media upload settings
        !selectedOption ||                  // Messaging settings
        !checked;
const handleEditHive = async () => {
    try {

        showLoader();

        const token = await AsyncStorage.getItem("token");

        let coverImageUrl = selectedStockImage;

        const payload = {
            hiveName,
            description: hiveDescription,
            privacyMode: uploadType,
            eventDate: isEnabled ? formatAPIDate(startDate) : "",
            startTime: isEnabled ? formatAPITime(startTime) : "",
            endTime: isEnabled ? formatAPITime(endTime) : "",
            expiryDate: isEnabled ? formatAPIDate(endDate) : "",
            coverImage: coverImageUrl,
        };

        const res = await fetch(
            `https://snaphive-node.vercel.app/api/hives/${hiveId}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            }
        );

        const data = await res.json();

        if (!res.ok) throw new Error(data.message);

        Toast.show({
            type: "success",
            text1: "Hive updated successfully",
        });

        navigation.goBack();

    } catch (err) {

        Toast.show({
            type: "error",
            text1: "Update failed",
            text2: err.message,
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



    useFocusEffect(
        React.useCallback(() => {
            const fetchStockImages = async () => {
                try {
                    const res = await fetch("https://snaphive-node.vercel.app/api/stock-images");
                    const data = await res.json();

                    if (data.success) {
                        setStockImages(data.images);
                    }
                } catch (err) {
                    console.log(err);
                }
            };

            fetchStockImages();
        }, [])
    );



    const getImageByCategory = (categoryKey) => {
        const found = stockImages.find(img => img.category === categoryKey);
        return found ? found.file : null;
    };

    return (
        <BackgroundUI>
        
                <TopNav />
                <ScrollView
                    style={styles.container}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={{ alignItems: 'flex-start', marginTop: 12 }}>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                alignSelf: 'flex-start',
                                gap: 8,
                                backgroundColor: 'rgba(255, 237, 186, 0.7)',
                                borderRadius: 25,
                                paddingHorizontal: 16,
                                paddingVertical: 6,
                            }}
                        >
                            <Sparkles color="#FFAD60" size={14} />
                            <CustomText weight="medium" style={styles.importHeading}>
                                {t('Edit')}
                            </CustomText>
                            <CustomText weight="bold" style={styles.importHeading}>
                                {t('hive')}
                            </CustomText>
                        </View>
                    </View>

                    <View>
                        <CustomText weight="bold" style={styles.snapText}>
                            {t('startSharingMemories')}
                        </CustomText>
                    </View>
                    <CustomText weight='regular' style={{ color: '#374151' }}>{t('setupPhotoCollection')}</CustomText>

                    <View style={[styles.createHiveCard, { marginBottom: 120, }]}>
                        <LinearGradient
                            colors={['#DA3C84', '#FEE8A3']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1.6, y: 0 }}
                            style={styles.continueBtn}
                        >
                            <View style={styles.touchable}>
                                <View style={styles.content}>

                                    <CustomText weight="Bold" style={styles.continueTxt}>
                                        {t('hiveDetails')}
                                    </CustomText>
                                </View>
                            </View>
                        </LinearGradient>

                        <View style={{ paddingHorizontal: 20, }}>
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
                                    style={[styles.inputType, { textAlignVertical: 'top', height: 100 }]}
                                    multiline={true}
                                    numberOfLines={4}
                                    value={hiveDescription}
                                    onChangeText={setHiveDescription}
                                    onSubmitEditing={() => Keyboard.dismiss()}
                                    maxLength={50}
                                />
                            </View>

                            <CustomText weight='bold' style={{ marginBottom: 0, color: '#374151' }}>{t('coverImage')}</CustomText>


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


                            <CustomText weight="medium" style={{ marginBottom: 15, color: colors.textGray, marginTop: 16, }}>
                                {t('chooseFromStock')}
                            </CustomText>
                            <View style={styles.imageGrid}>
                                {categories.map((cat) => {
                                    const imageUrl = getImageByCategory(cat.key);

                                    return (
                                        <TouchableOpacity
                                            key={cat.key}
                                            style={styles.imageContainer}
                                            onPress={() => {
                                                setSelectedStockImage(imageUrl);
                                                setUploadedImage(null);
                                            }}

                                            activeOpacity={0.7}
                                        >
                                            <Image
                                                source={{
                                                    uri: imageUrl || "https://via.placeholder.com/300"
                                                }}
                                                style={styles.image}
                                            />

                                            <View style={styles.overlay}>
                                                <Text style={styles.imageText}>{cat.label}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                            <View style={{ marginBottom: 12, }}>
                                <View style={{}}>
                                    <ThemeButton
                                        text={t('Update Hive')}
                                        onPress={handleEditHive}
                                        disabled={isCreateDisabled}
                                        style={{ width: "100%" }}
                                    />

                                </View>
                            </View>
                        </View>
                    </View>

                </ScrollView>


   
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
        height: 200,
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
        backgroundColor: '#F6F6F6',
        borderRadius: 10,
        paddingLeft: 18,
        paddingVertical: 16,
        fontSize: 16,
    },

    privacyContainer: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        marginVertical: 30,
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
        backgroundColor: '#fff',
        borderRadius: 16,
        overflow: 'hidden',
        marginTop: 20,
        paddingBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 6,
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
        flexWrap: "wrap",
        justifyContent: "space-between",
        gap: 10,
        marginBottom: 20,
    },
    imageContainer: {
        position: "relative",
        width: width * 0.38,  // 42% of screen width
        height: height * 0.12, // 12% of screen height
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

export default EditHive;