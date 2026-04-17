import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Text, Platform, PermissionsAndroid, Alert } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import TopNav from '../components/TopNavbar';
import CustomText from '../components/CustomText';
import ThemeButton from '../components/ThemeButton';
import Portrait from '../../assets/svg/portrait.svg';
import Hdr from '../../assets/svg/hdr.svg';
import Filter from '../../assets/svg/filter.svg';

//svg
import Gallery from '../../assets/svg/gallery.svg';
import Settings from '../../assets/svg/settings.svg';

const selfie = require("../../assets/selfie.jpg");

const ClickPhoto = ({ navigation }) => {
    const [photo, setPhoto] = useState(null);
    const [showCamera, setShowCamera] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isEditingUI, setIsEditingUI] = useState(false);
    const cameraRef = useRef(null);


    const device = useCameraDevice('back');
    const { hasPermission, requestPermission } = useCameraPermission();

    useEffect(() => {
        if (!hasPermission) {
            requestPermission();
        }
    }, [hasPermission]);


    const handleEditToggle = () => {
        setIsEditingUI(!isEditingUI);
    }

    const savePhotoToGallery = async (photoPath) => {
        try {
            setIsSaving(true);

            // Request permission to save to gallery
            if (Platform.OS === 'android') {
                const apiLevel = Platform.Version;
                let granted = false;

                if (apiLevel >= 33) {
                    // Android 13+ doesn't need permission to save to gallery
                    granted = true;
                } else if (apiLevel >= 29) {
                    // Android 10-12
                    granted = true;
                } else {
                    // Android 9 and below
                    granted = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                        {
                            title: 'Save Photo Permission',
                            message: 'This app needs permission to save photos to your gallery.',
                            buttonNeutral: 'Ask Me Later',
                            buttonNegative: 'Cancel',
                            buttonPositive: 'OK',
                        }
                    );
                    granted = granted === PermissionsAndroid.RESULTS.GRANTED;
                }

                if (!granted && apiLevel < 29) {
                    Alert.alert('Permission Denied', 'Cannot save photo without permission.');
                    setIsSaving(false);
                    return null;
                }
            }

            // Save photo to camera roll
            const savedPhoto = await CameraRoll.save(photoPath, { type: 'photo' });
            console.log('Photo saved to gallery:', savedPhoto);
            setIsSaving(false);
            return savedPhoto;
        } catch (error) {
            console.error('Failed to save photo:', error);
            Alert.alert('Error', 'Failed to save photo to gallery');
            setIsSaving(false);
            return null;
        }
    };

    const takePhoto = async () => {
        if (cameraRef.current) {
            try {
                const photo = await cameraRef.current.takePhoto({
                    qualityPrioritization: 'balanced',
                    flash: 'off',
                });

                const photoUri = `file://${photo.path}`;
                setPhoto(photoUri);
                setShowCamera(false);

                // Save to gallery immediately
                await savePhotoToGallery(photoUri);

                console.log('Photo taken:', photo.path);
            } catch (error) {
                console.error('Failed to take photo:', error);
                Alert.alert('Error', 'Failed to capture photo');
            }
        }
    };

    const retakePhoto = () => {
        setPhoto(null);
        setShowCamera(true);
    };

    const usePhoto = () => {
        // Navigate to PhotoShare screen after photo is taken and saved
        navigation.navigate("PhotoShare");
    };

    if (!hasPermission) {
        return (
            <SafeAreaProvider>
                <SafeAreaView style={styles.safeArea}>
                    <TopNav />
                    <View style={styles.container}>
                        <Text style={styles.permissionText}>Camera permission required</Text>
                    </View>
                </SafeAreaView>
            </SafeAreaProvider>
        );
    }

    if (!device) {
        return (
            <SafeAreaProvider>
                <SafeAreaView style={styles.safeArea}>
                    <TopNav />
                    <View style={styles.container}>
                        <Text style={styles.permissionText}>Camera not available</Text>
                    </View>
                </SafeAreaView>
            </SafeAreaProvider>
        );
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.safeArea}>
                <TopNav />
                <View style={styles.container}>
                    {showCamera ? (
                        <Camera
                            ref={cameraRef}
                            style={styles.camera}
                            device={device}
                            isActive={showCamera}
                            photo={true}
                        />
                    ) : (
                        <Image
                            source={{ uri: photo }}
                            style={styles.image}
                            resizeMode="cover"
                        />
                    )}

                    {!showCamera && (
                        <View style={styles.photoActions}>
                            <TouchableOpacity
                                style={styles.actionButton}
                                onPress={retakePhoto}
                            >
                                <Text style={styles.actionButtonText}>Retake</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.actionButton, styles.usePhotoButton]}
                                onPress={usePhoto}
                                disabled={isSaving}
                            >
                                <Text style={styles.actionButtonText}>
                                    {isSaving ? 'Saving...' : 'Use Photo'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    <TouchableOpacity
                        style={styles.shutter}
                        onPress={showCamera ? takePhoto : retakePhoto}
                        activeOpacity={0.7}
                    >
                        <View style={styles.shutterBtn} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.settingsBtn}
                        onPress={handleEditToggle}
                    >
                        <Settings />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.galleryBtn}
                        onPress={() => navigation.navigate("PhotoShare")}
                    >
                        <Gallery />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.closeBtn}
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={styles.closeText}>X</Text>
                    </TouchableOpacity>
                </View>

       {isEditingUI && (
    <View style={styles.bottomPanel}>
        {/* Brightness Control */}
        <View style={styles.brightnessSection}>
            <CustomText weight="medium" style={styles.brightnessLabel}>Brightness • 10</CustomText>
            <View style={styles.sliderContainer}>
                <View style={styles.customSlider}>
                    <View style={styles.sliderTrack}>
                        <View style={[styles.sliderFill, { width: `${brightness}%` }]} />
                        <TouchableOpacity
                            style={[styles.sliderThumb, { left: `${brightness}%` }]}
                            onPressIn={() => { }}
                        />
                    </View>
                </View>
                <CustomText weight="semiBold" style={styles.brightnessValue}>50%</CustomText>
            </View>
        </View>

        {/* Premium Tools */}
        <View style={styles.premiumSection}>
            <CustomText weight="medium" style={styles.premiumTitle}>Premium Tools</CustomText>
            <View style={styles.toolsContainer}>
                {/* Tool 1 */}
                <TouchableOpacity style={styles.premiumTool}>
                    <View style={styles.toolIcon}>
                        <Portrait />
                    </View>
                    <CustomText weight="semiBold" style={styles.toolText}>Portrait Retouch</CustomText>
                    <View style={styles.crownIcon}>
                        <CustomText weight="semiBold" style={styles.crownText}>👑</CustomText>
                    </View>
                </TouchableOpacity>

                {/* Tool 2 - REMOVE (opens modal) */}
                <TouchableOpacity
                    style={styles.premiumTool}
                    onPress={() => setModalVisible(true)}
                >
                    <View style={styles.toolIcon}>
                        <Hdr />
                    </View>
                    <CustomText weight="semiBold" style={styles.toolText}>Advanced Filters</CustomText>
                    <View style={styles.crownIcon}>
                        <CustomText weight="semiBold" style={styles.crownText}>👑</CustomText>
                    </View>
                </TouchableOpacity>

                {/* Tool 3 */}
                <TouchableOpacity style={styles.premiumTool}>
                    <View style={styles.toolIcon}>
                        <Filter />
                    </View>
                    <CustomText weight="semiBold" style={styles.toolText}>HDR Boost</CustomText>
                    <View style={styles.crownIcon}>
                        <CustomText weight="semiBold" style={styles.crownText}>👑</CustomText>
                    </View>
                </TouchableOpacity>
            </View>
        </View>

        {/* Continue Button */}
        <ThemeButton
            text="Continue"
            onPress={() => navigation.navigate("ClickPhotoThree")}
            style={{ width: "100%" }}
        />
    </View>
)}

            </SafeAreaView>
        </SafeAreaProvider >
    );
};

export default ClickPhoto;

const styles = StyleSheet.create({
    safeArea: { flex: 1 },
    container: { flex: 1, position: 'relative' },
    camera: {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
    image: { width: '100%', height: '100%' },

    shutter: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'red',
        position: 'absolute',
        bottom: 30,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    shutterBtn: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: 'white',
    },

    settingsBtn: {
        width: 40,
        height: 40,
        backgroundColor: '#030303B2',
        borderRadius: 20,
        position: 'absolute',
        bottom: 30,
        right: 70,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 15,
    },

    galleryBtn: {
        width: 40,
        height: 40,
        backgroundColor: '#030303B2',
        borderRadius: 20,
        position: 'absolute',
        bottom: 30,
        left: 70,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 15,
    },

    closeBtn: {
        width: 40,
        height: 40,
        backgroundColor: '#FFFFFF4D',
        borderRadius: 20,
        position: 'absolute',
        top: 30,
        left: 20,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 15,
    },

    closeText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold'
    },

    permissionText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 50,
    },

    photoActions: {
        position: 'absolute',
        top: 100,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 20,
        zIndex: 20,
    },

    actionButton: {
        backgroundColor: '#030303B2',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },

    usePhotoButton: {
        backgroundColor: '#4CAF50',
    },

    actionButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
bottomPanelOne:{
    position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#000000CC',
        padding: 20,
        paddingBottom: 40,
        zIndex: 15,
        

},

    // bottom bar
    bottomPanel: {
        backgroundColor: '#000000CC',
        padding: 20,
        paddingBottom: 40
    },
    brightnessSection: {
        marginBottom: 25
    },
    brightnessLabel: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 15
    },
    sliderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15
    },
    customSlider: {
        flex: 1,
        height: 40,
        justifyContent: 'center'
    },
    sliderTrack: {
        height: 4,
        backgroundColor: '#333',
        borderRadius: 2,
        position: 'relative'
    },
    sliderFill: {
        height: 4,
        backgroundColor: '#4CAF50',
        borderRadius: 2
    },
    sliderThumb: {
        width: 20,
        height: 20,
        backgroundColor: '#4CAF50',
        borderRadius: 10,
        position: 'absolute',
        top: -8,
        marginLeft: -10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5
    },
    brightnessValue: {
        color: '#fff',
        fontSize: 14,
        minWidth: 35
    },

    premiumSection: {
        marginBottom: 25
    },
    premiumTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 15
    },
    toolsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10
    },
    premiumTool: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 15,
        alignItems: 'center',
        position: 'relative'
    },
    toolIcon: {
        width: 40,
        height: 40,
        backgroundColor: '#fff',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8
    },
    toolText: {
        color: '#000',
        fontSize: 12,
        fontWeight: '500',
        textAlign: 'center'
    },
    crownIcon: {
        position: 'absolute',
        top: 8,
        right: 10
    },
    crownText: {
        fontSize: 14
    },
    closeBtn: {
        width: 100,
        height: 100,
        backgroundColor: '#FFFFFF4D',
        borderRadius: 50,
        position: 'absolute',
        top: 30,
        left: 20,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 15,
    }
});