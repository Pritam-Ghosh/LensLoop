import React from "react";
import {
    Modal,
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Dimensions,
    SafeAreaView,
    Platform,
    StatusBar,
    ScrollView,
    ActivityIndicator
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Toast from 'react-native-toast-message';
import { uploadImageToFirebase } from '../utils/firebaseUpload';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const scale = SCREEN_WIDTH / 375; // iPhone baseline

const normalize = (size) => Math.round(size * scale);

// Get status bar height for Android
const getStatusBarHeight = () => {
    return Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;
};

const profile = require("../../assets/profile.jpg");
const snaphive = require("../../assets/snaphive-logo.png");

import { colors } from '../Theme/theme';
import { Images } from "lucide-react-native";
import CustomText from '../components/CustomText';

const AutoSyncModal = ({ visible, onCreate, onSkip, photoCount = 0, previewImage, photos = [], hives = [], }) => {
    const [showHiveModal, setShowHiveModal] = React.useState(false);
    const [selectedHive, setSelectedHive] = React.useState(null);
    const [isUploading, setIsUploading] = React.useState(false);

    // Get last 3 photos (most recent)
    const last3Photos = photos.slice(0, 3);

    const renderStackImages = () => {
        return last3Photos.map((photo, index) => {
            if (!photo?.uri) return null;

            // iOS-specific URI validation
            const isValidUri = photo.uri.startsWith('file://') ||
                photo.uri.startsWith('ph://') ||
                photo.uri.startsWith('content://') ||
                photo.uri.startsWith('http://') ||
                photo.uri.startsWith('https://');

            if (!isValidUri) {
                console.warn('⚠️ Invalid photo URI:', photo.uri);
                return null;
            }

            let imageStyle = styles.mainImage;

            if (last3Photos.length === 2) {
                imageStyle = index === 0
                    ? [styles.smallImage, styles.leftImage]
                    : styles.mainImage;
            }

            if (last3Photos.length >= 3) {
                if (index === 0) imageStyle = [styles.smallImage, styles.leftImage];
                if (index === 1) imageStyle = styles.mainImage;
                if (index === 2) imageStyle = [styles.smallImage, styles.rightImage];
            }

            return (
                <Image
                    key={`stack-${index}`}
                    source={{ uri: photo.uri }}
                    style={imageStyle}
                    // iOS-specific props
                    resizeMode="cover"
                    onError={(error) => {
                        console.error('❌ Image load error:', error.nativeEvent.error);
                    }}
                />
            );
        });
    };

    // 🔥 NEW: Handle upload to existing hive
    const handleUploadToExistingHive = async () => {
        if (!selectedHive) {
            Toast.show({
                type: "info",
                text1: "Select a Hive",
                text2: "Please select a hive to upload photos",
                position: "top",
            });
            return;
        }

        if (!photos || photos.length === 0) {
            Toast.show({
                type: "error",
                text1: "No Photos",
                text2: "No photos available to upload",
                position: "top",
            });
            return;
        }

        setIsUploading(true);

        // Show uploading toast
        Toast.show({
            type: "info",
            text1: "Uploading Photos",
            text2: `0% - ${photos.length} photo(s)`,
            autoHide: false,
            position: "top",
        });

        try {
            const token = await AsyncStorage.getItem("token");
            const storedUser = await AsyncStorage.getItem("user");

            if (!token || !storedUser) {
                throw new Error("Authentication required");
            }

            const userId = JSON.parse(storedUser)._id;
            const hiveId = selectedHive._id;
            const totalImages = photos.length;
            let completedImages = 0;

            console.log(`🔥 Starting upload of ${totalImages} photos to hive: ${selectedHive.hiveName}`);

            const imageUrls = [];

            for (const photo of photos) {
                try {
                    const imageUrl = await uploadImageToFirebase(photo, userId, hiveId);

                    imageUrls.push(imageUrl);
                    completedImages++;

                    const progress = Math.round((completedImages / totalImages) * 100);

                    Toast.show({
                        type: "info",
                        text1: "Uploading Photos",
                        text2: `${progress}% - ${completedImages}/${totalImages} uploaded`,
                        autoHide: false,
                        position: "top",
                    });

                } catch (error) {
                    console.error("❌ Failed to upload photo:", error);
                }
            }

            // Filter out failed uploads
            const successfulUrls = imageUrls.filter(url => url !== null);

            if (successfulUrls.length === 0) {
                throw new Error("All uploads failed");
            }

            console.log(`✅ Successfully uploaded ${successfulUrls.length} photos to Firebase`);

            // 🔥 Send URLs to backend API
            const res = await axios.post(
                `https://snaphive-node.vercel.app/api/hives/${hiveId}/images`,
                { images: successfulUrls },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            console.log('✅ Photos added to hive successfully');

            // Hide uploading toast
            Toast.hide();

            // Show success toast
            Toast.show({
                type: "success",
                text1: "Upload Complete!",
                text2: `${successfulUrls.length} photo(s) uploaded to ${selectedHive.hiveName}`,
                visibilityTime: 4000,
                position: "top",
            });

            // 🔥 Mark photos as handled so they won't show again
            try {
                const handledPhotosJson = await AsyncStorage.getItem('AUTO_SYNC_HANDLED_PHOTOS');
                const handledPhotoUris = handledPhotosJson ? JSON.parse(handledPhotosJson) : [];

                const uploadedPhotoUris = photos.map(photo => photo.uri);
                const updatedHandledUris = [...handledPhotoUris, ...uploadedPhotoUris];

                await AsyncStorage.setItem(
                    'AUTO_SYNC_HANDLED_PHOTOS',
                    JSON.stringify(updatedHandledUris)
                );

                console.log('✅ Marked photos as handled');
            } catch (error) {
                console.error('❌ Error marking photos as handled:', error);
            }

            // Close both modals
            setShowHiveModal(false);
            setSelectedHive(null);

            // Call onSkip to close main modal and check for next photos
            if (onSkip) {
                setTimeout(() => {
                    onSkip();
                }, 500);
            }

        } catch (error) {
            console.error("❌ Upload error:", error);

            // Hide uploading toast
            Toast.hide();

            // Show error toast
            Toast.show({
                type: "error",
                text1: "Upload Failed",
                text2: error.message || "Please try again",
                visibilityTime: 3000,
                position: "top",
            });
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            statusBarTranslucent
        >
            <ScrollView style={styles.overlay}>
                <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
                    <View style={styles.container}>
                        <View
                            style={{
                                width: '100%',
                                height: normalize(50),
                                justifyContent: "center",
                                alignItems: "center",
                                marginBottom: normalize(20),
                            }}
                        >
                            <Image
                                source={snaphive}
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    resizeMode: "contain",
                                }}
                            />
                        </View>
                        {/* hide from here */}
                        {/* Top Image Stack */}
                        <View style={styles.imageStack}>
                            {renderStackImages()}
                        </View>

                        {/* Title */}
                        <Text style={styles.title}>Hello Snaphive{'\n'}Photos Found!</Text>
                        {/* Description */}
                        <Text style={styles.description}>
                            We found new photos on your device.{'\n'}
                            Create a Hive to auto sync and share them!
                        </Text>

                        <View style={styles.codeImag}>
                            {/* Preview Card with 3 photos */}
                            {/* <View style={styles.previewCard}>
                                {last3Photos.map((photo, index) => {
                                    if (!photo?.uri) return null;

                                    return (
                                        <Image
                                            key={`preview-${index}`}
                                            source={{ uri: photo.uri }}
                                            style={[
                                                styles.previewThumb,
                                                index === 1 && last3Photos.length > 1 && {
                                                    width: normalize(120),
                                                    height: normalize(100),
                                                    zIndex: 3,
                                                    transform: [{ scale: 1.05 }],
                                                },
                                            ]}
                                            resizeMode="cover"
                                            onError={(error) => {
                                                console.error('❌ Preview image error:', error.nativeEvent.error);
                                            }}
                                        />
                                    );
                                })}
                            </View> */}

                            <View style={styles.groupOftext}>
                                {/* Preview Text */}
                                <Text style={styles.previewText}>
                                    Create Hive with {photoCount} new {photoCount === 1 ? 'photo' : 'photos'}?
                                </Text>

                                {/* Primary Button */}
                                <TouchableOpacity style={styles.primaryButton} onPress={onCreate}>
                                    <Text style={styles.primaryText}>Create Hive</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => setShowHiveModal(true)}>
                                    <View style={styles.existingHiveButton}>
                                        <View style={styles.autoHiveLogo}>
                                            <Images style={styles.autoHiveLogoIcon} />
                                        </View>
                                        <View style={{ width: '70%' }}>
                                            <CustomText weight="bold">Upload to Existing Hive</CustomText>
                                            <CustomText weight="Regular">
                                                Select an existing hive to upload your {photoCount} new {photoCount === 1 ? 'photo' : 'photos'}
                                            </CustomText>
                                        </View>
                                    </View>
                                </TouchableOpacity>

                                {/* Skip */}
                                <TouchableOpacity onPress={onSkip} style={styles.skipButton}>
                                    <Text style={styles.skipText}>Skip for now</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* From here */}
                    </View>
                </SafeAreaView>
            </ScrollView>
            {showHiveModal && (
                <Modal transparent animationType="slide">
                    <ScrollView
                        style={styles.hiveModalOverlay}
                        contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }}
                    >
                        <View style={styles.hiveModal}>

                            {/* Header */}
                            <CustomText weight="bold" style={styles.hiveTitle}>
                                Upload to Existing Hive
                            </CustomText>

                            <CustomText style={styles.hiveSub}>
                                Please select a Hive to upload your {photoCount} new {photoCount === 1 ? 'photo' : 'photos'} into.
                            </CustomText>

                            {/* Search */}
                            <View style={styles.searchBox}>
                                <Text style={{ color: '#999' }}> Search Hives</Text>
                            </View>

                            {/* Hive List */}
                            <ScrollView
                                style={{ width: '100%', marginTop: 10, maxHeight: SCREEN_HEIGHT * 0.4 }}
                                showsVerticalScrollIndicator={false}
                            >
                                {hives.length === 0 ? (
                                    <View style={{ padding: 20, alignItems: 'center' }}>
                                        <CustomText style={{ color: '#999', textAlign: 'center' }}>
                                            No hives available. Create a new hive first!
                                        </CustomText>
                                    </View>
                                ) : (
                                    hives.map((item, i) => (
                                        <TouchableOpacity
                                            key={item._id}
                                            onPress={() => setSelectedHive(item)}
                                            style={[
                                                styles.hiveRow,
                                                selectedHive?._id === item._id && styles.selectedHive
                                            ]}
                                            disabled={isUploading}
                                        >

                                            <Image
                                                source={{ uri: item.coverImage }}
                                                style={styles.hiveThumb}
                                            />

                                            <View style={{ flex: 1 }}>
                                                <CustomText weight="bold">{item.hiveName}</CustomText>

                                                <CustomText size={12} style={{ color: '#999' }}>
                                                    {item.endTime || 'N/A'} - {item.expiryDate || 'N/A'}
                                                </CustomText>

                                                <CustomText size={12} style={{ color: '#999' }}>
                                                    {item.members?.length || 0} Members
                                                </CustomText>
                                            </View>

                                            {selectedHive?._id === item._id && (
                                                <View style={styles.tick}>
                                                    <Text style={{ color: '#fff' }}>✓</Text>
                                                </View>
                                            )}

                                        </TouchableOpacity>
                                    ))
                                )}
                            </ScrollView>

                            {/* Upload Button */}
                            <TouchableOpacity
                                style={[
                                    styles.uploadBtn,
                                    (!selectedHive || isUploading) && styles.uploadBtnDisabled
                                ]}
                                onPress={handleUploadToExistingHive}
                                disabled={!selectedHive || isUploading}
                            >
                                {isUploading ? (
                                    <ActivityIndicator color="#fff" size="small" />
                                ) : (
                                    <Text style={{ color: '#fff', fontWeight: '700' }}>
                                        Upload to Hive
                                    </Text>
                                )}
                            </TouchableOpacity>

                            {/* Cancel */}
                            <TouchableOpacity
                                onPress={() => {
                                    setShowHiveModal(false);
                                    setSelectedHive(null);
                                }}
                                disabled={isUploading}
                            >
                                <CustomText style={{ marginTop: 10, color: isUploading ? '#ccc' : '#999' }}>
                                    Cancel
                                </CustomText>
                            </TouchableOpacity>

                        </View>
                    </ScrollView>
                </Modal>
            )}
        </Modal>
    );
};

export default AutoSyncModal;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "#fdfcfe",
    },
    safeArea: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? getStatusBarHeight() : 0,
    },
    container: {
        flex: 1,
        width: '100%',
        backgroundColor: "#fff",
        padding: normalize(10),
        paddingTop: Platform.OS === 'ios' ? normalize(60) : normalize(20),
        paddingBottom: normalize(20),
        alignItems: "center",
        justifyContent: "center",
    },

    codeImag: {
        backgroundColor: '#ffffff',
        padding: normalize(10),
        paddingBottom: 0,
        paddingLeft: 0,
        paddingRight: 0,
        borderWidth: 2,
        borderColor: '#e1e4ee',
        borderRadius: normalize(0),
        width: "98%",
        marginHorizontal: 'auto',
        alignItems: 'center',
        justifyContent: 'center',
        // ...Platform.select({
        //     ios: {
        //         shadowColor: '#000',
        //         shadowOffset: { width: 0, height: 2 },
        //         shadowOpacity: 0.25,
        //         shadowRadius: 3.84,
        //     },
        //     android: {
        //         elevation: 5,
        //     },
        // })
    },
    groupOftext: {
        backgroundColor: '#ffffff',
        borderRadius: normalize(22),
        textAlign: 'center',
        padding: normalize(10),
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        // borderWidth: 1,
        borderColor: '#e9e9e9',
    },
    /* Image Stack */

    imageStack: {
        height: normalize(180),
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        marginBottom: normalize(10),
    },

    mainImage: {
        width: normalize(170),
        height: normalize(160),
        borderRadius: normalize(22),
        borderWidth: 4,
        borderColor: '#fff',
        zIndex: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 14 },
        shadowOpacity: 0.3,
        shadowRadius: 24,
        elevation: 14,
    },

    smallImage: {
        position: 'absolute',
        width: normalize(120),
        height: normalize(145),
        borderRadius: normalize(20),
        borderWidth: 4,
        borderColor: '#fff',
        opacity: 1,

        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 18,
        elevation: 10,
    },

    leftImage: {
        left: normalize(12),
        top: normalize(20),
        zIndex: 1,
        transform: [{ rotate: '-12deg' }],
    },

    rightImage: {
        right: normalize(12),
        top: normalize(20),
        zIndex: 2,
        transform: [{ rotate: '12deg' }],
    },

    /* Text */
    title: {
        fontSize: normalize(22),
        fontWeight: "700",
        color: "#161a23",
        marginBottom: normalize(12),
        textAlign: "center",
        lineHeight: normalize(32),
    },
    description: {
        textAlign: "center",
        fontSize: normalize(15),
        color: "#7a7a7a",
        lineHeight: normalize(22),
        marginBottom: normalize(24),
        paddingHorizontal: normalize(8),
    },

    /* Preview Card with 3 photos */
    previewCard: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: normalize(28),
        width: "100%",
        marginBottom: normalize(12),
        position: "relative",
    },

    previewThumb: {
        width: normalize(90),
        height: normalize(70),
        borderRadius: normalize(14),
        marginHorizontal: normalize(-14), // 👈 overlap magic
        borderWidth: 3,
        borderColor: "#fff",

        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 6,
    },
    previewText: {
        fontSize: normalize(16),
        fontWeight: "600",
        color: "#2a2a2a",
        lineHeight: normalize(24),
        marginBottom: normalize(20),
        textAlign: "center",
    },

    /* Buttons */
    primaryButton: {
        width: "95%",
        backgroundColor: colors.primary,
        paddingVertical: normalize(16),
        borderRadius: normalize(16),
        alignItems: "center",
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
        marginBottom: normalize(8),
    },
    primaryText: {
        color: "#fff",
        fontSize: normalize(16),
        fontWeight: "700",
    },
    existingHiveButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: normalize(8),
        gap: normalize(12),
        borderWidth: 1,
        borderColor: '#e9e9e9',
        padding: normalize(10),
        borderRadius: normalize(12),
    },
    skipButton: {
        paddingVertical: normalize(12),
    },
    skipText: {
        fontSize: normalize(15),
        color: colors.primary,
        fontWeight: "600",
    },
    autoHiveLogo: {
        width: normalize(40),
        height: normalize(40),
        borderRadius: normalize(6),
        backgroundColor: '#EFEEF4',
        marginBottom: normalize(4),
        alignItems: 'center',
        justifyContent: 'center',
    },
    autoHiveLogoIcon: {
        color: colors.primary,
    },
    hiveModalOverlay: {
        // flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',

        // justifyContent: 'flex-end',
    },
    hiveModal: {
        backgroundColor: '#fff',
        width: '100%',
        maxHeight: '90%',
        borderTopLeftRadius: normalize(26),
        borderTopRightRadius: normalize(26),
        padding: normalize(30),
        alignItems: 'center',
    },

    hiveTitle: {
        fontSize: normalize(18),
        marginBottom: normalize(6),
    },

    hiveSub: {
        color: '#888',
        textAlign: 'center',
        marginBottom: normalize(12),
    },

    searchBox: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#eee',
        borderRadius: normalize(12),
        padding: normalize(12),
    },

    hiveRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: normalize(10),
        borderRadius: normalize(14),
        marginBottom: normalize(10),
        borderWidth: 1,
        borderColor: '#eee',
    },

    selectedHive: {
        backgroundColor: '#FFE9F1',
        borderColor: colors.primary,
    },

    hiveThumb: {
        width: normalize(50),
        height: normalize(50),
        borderRadius: normalize(10),
        marginRight: normalize(10),
    },

    tick: {
        width: normalize(24),
        height: normalize(24),
        borderRadius: normalize(12),
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },

    uploadBtn: {
        width: '100%',
        backgroundColor: colors.primary,
        padding: normalize(16),
        borderRadius: normalize(16),
        alignItems: 'center',
        marginTop: normalize(10),
    },

    uploadBtnDisabled: {
        backgroundColor: '#ccc',
        opacity: 0.6,
    },
});