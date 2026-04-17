import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Text, Platform, PermissionsAndroid, Alert } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Camera, useCameraDevice, useCameraPermission, useMicrophonePermission } from 'react-native-vision-camera';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import { Contrast as ContrastFilter, Brightness as BrightnessFilter, ColorMatrix } from 'react-native-color-matrix-image-filters';
import PhotoCropModal from '../components/PhotoCropModal';
import Video from "react-native-video";
import RNFS from 'react-native-fs';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { useIsFocused } from '@react-navigation/native';

import ViewShot from "react-native-view-shot";
import axios from "axios";
import { uploadImageToFirebase } from '../utils/firebaseUpload';
import AsyncStorage from "@react-native-async-storage/async-storage";
// Components
import TopNav from '../components/TopNavbar';
import PhotoEditMenu from '../components/PhotoEditMenu';
import PhotoEditOriginalvsEnhanced from '../components/PhotoEditOriginalvsEnhanced';
import PhotoEditSideIcons from '../components/PhotoEditSideIcons';

// SVG icons
import Gallery from '../../assets/svg/gallery.svg';
import Settings from '../../assets/svg/settings.svg';
import Adjustment from '../../assets/svg/adjustment.svg';
import CameraSwitch from '../../assets/svg/cameraswitch.svg';
import Undo from '../../assets/svg/undo.svg';
import Crop from '../../assets/svg/crop.svg';

const ClickPhoto = ({ navigation, route }) => {
    const hiveId = route?.params?.hiveId || null;

    const [photo, setPhoto] = useState(null);
    const [showCamera, setShowCamera] = useState(true);
    const [recordSeconds, setRecordSeconds] = useState(0);
    const timerRef = useRef(null);

    const [isSaving, setIsSaving] = useState(false);
    const [isEditingUI, setIsEditingUI] = useState(false);
    const [brightness, setBrightness] = useState(50);
    const [contrast, setContrast] = useState(50);
    const [activeIcon, setActiveIcon] = useState('brightness');
    const [cameraPosition, setCameraPosition] = useState('back');

    const [showCropModal, setShowCropModal] = useState(false);
    const [croppedPhoto, setCroppedPhoto] = useState(null);
    const [originalPhoto, setOriginalPhoto] = useState(null);
    const [cropData, setCropData] = useState(null);
    const [activeFilter, setActiveFilter] = useState(null);

    const [isRecording, setIsRecording] = useState(false);
    const [videoPath, setVideoPath] = useState(null);
    const [isCameraReady, setIsCameraReady] = useState(false);
    const [mode, setMode] = useState("photo");
    const cameraRef = useRef(null);
    const device = useCameraDevice(cameraPosition);

    const { hasPermission, requestPermission } = useCameraPermission();
    const { hasPermission: hasMicPermission, requestPermission: requestMicPermission } = useMicrophonePermission();
    const viewShotRef = useRef(null);

    const isMounted = useRef(true);

useEffect(() => {
    return () => {
        isMounted.current = false;
    };
}, []);

    useEffect(() => {
        if (isFocused) {
            setShowCamera(true);
            setVideoPath(null);
            setPhoto(null);
        }
    }, [isFocused]);
    const isFocused = useIsFocused();

    const requestAudioPermission = async () => {
        if (Platform.OS !== "android") return true;

        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
        );

        return granted === PermissionsAndroid.RESULTS.GRANTED;
    };

    const startRecording = async () => {
        if (!cameraRef.current || isRecording) return;

        try {
            const micGranted = await requestAudioPermission();
            if (!micGranted) return;

            setIsRecording(true);
            setRecordSeconds(0);

            timerRef.current = setInterval(() => {
                setRecordSeconds((prev) => prev + 1);
            }, 1000);

            await cameraRef.current.startRecording({
                flash: "off",

        onRecordingFinished: (video) => {
    clearInterval(timerRef.current);

    if (!isMounted.current) return; // ✅ prevent crash

    const uri =
        Platform.OS === "ios"
            ? video.path.startsWith("file://")
                ? video.path
                : `file://${video.path}`
            : `file://${video.path}`;

    setVideoPath(uri);
    setShowCamera(false);
    setIsRecording(false);
},

  onRecordingError: (error) => {
    clearInterval(timerRef.current);

    if (!isMounted.current) return;

    console.log("❌ Record error:", error);
    setIsRecording(false);
},
            });
        } catch (e) {
            console.log("❌ Start record error:", e);
            setIsRecording(false);
        }
    };

    /*const stopRecording = async () => {
        if (!cameraRef.current) return;

        clearInterval(timerRef.current);
        await cameraRef.current.stopRecording();
    };*/

const stopRecording = async () => {
    if (!cameraRef.current || !isRecording) return;

    setIsRecording(false); // ✅ prevent double trigger
    clearInterval(timerRef.current);

    try {
        await cameraRef.current.stopRecording();
    } catch (e) {
        console.log("Stop recording error:", e);
    }
};


    // ✅ COMPLETELY REWRITTEN VIDEO SAVE FUNCTION
    const saveVideoToGallery = async (videoUri) => {
        try {
            console.log("====== STARTING VIDEO SAVE ======");
            console.log("1. Original videoUri:", videoUri);
            console.log("2. Platform:", Platform.OS);

            setIsSaving(true);

            // ✅ REQUEST PERMISSIONS FIRST
            if (Platform.OS === "ios") {
                console.log("3. Requesting iOS photo library permission...");

                const result = await request(PERMISSIONS.IOS.PHOTO_LIBRARY_ADD_ONLY);

                console.log("4. iOS permission result:", result);

                if (result !== RESULTS.GRANTED && result !== RESULTS.LIMITED) {
                    Alert.alert("Permission Denied", "Photo library permission is required to save videos");
                    setIsSaving(false);
                    return false;
                }
            }


            if (Platform.OS === "android") {
                console.log("3. Checking Android version:", Platform.Version);

                // Android 13+ (API 33+) doesn't need WRITE_EXTERNAL_STORAGE
                if (Platform.Version < 33) {
                    const result = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
                    );
                    console.log("4. Android permission result:", result);

                    if (result !== PermissionsAndroid.RESULTS.GRANTED) {
                        Alert.alert("Permission Denied", "Storage permission is required to save videos");
                        setIsSaving(false);
                        return false;
                    }
                }
            }

            // ✅ CHECK IF FILE EXISTS
            let finalUri = videoUri;

            // Remove file:// prefix for existence check
            const filePath = videoUri.replace('file://', '');
            console.log("5. Checking file existence:", filePath);

            const fileExists = await RNFS.exists(filePath);
            console.log("6. File exists:", fileExists);

            if (!fileExists) {
                console.error("❌ Video file does not exist!");
                Alert.alert("Error", "Video file not found");
                setIsSaving(false);
                return false;
            }

            // ✅ GET FILE INFO
            const fileInfo = await RNFS.stat(filePath);
            console.log("7. File info:", JSON.stringify(fileInfo, null, 2));

            // ✅ ENSURE PROPER URI FORMAT
            if (Platform.OS === "ios") {
                finalUri = filePath.startsWith("file://") ? filePath : `file://${filePath}`;
            } else {
                // Android - try both with and without file://
                finalUri = filePath;
            }

            console.log("8. Final URI for saving:", finalUri);

            // ✅ SAVE TO GALLERY
            console.log("9. Attempting to save to gallery...");
            const savedAsset = await CameraRoll.save(finalUri, {
                type: "video",
                album: Platform.OS === 'ios' ? 'SnapHive' : undefined // Optional: create album on iOS
            });

            console.log("10. ✅ Video saved successfully!");
            console.log("11. Saved asset:", savedAsset);

            Alert.alert("Success", "Video saved to gallery!");
            setIsSaving(false);
            return true;

        } catch (error) {
            console.error("====== VIDEO SAVE ERROR ======");
            console.error("Error name:", error.name);
            console.error("Error message:", error.message);
            console.error("Error stack:", error.stack);
            console.error("Full error:", JSON.stringify(error, null, 2));

            Alert.alert(
                "Save Failed",
                `Could not save video: ${error.message}\n\nCheck console for details.`
            );
            setIsSaving(false);
            return false;
        }
    };

    const renderFilteredImage = (imageUri) => {
        switch (activeFilter) {
            case 'normal':
                return (
                    <ContrastFilter amount={contrast / 50}>
                        <BrightnessFilter amount={brightness / 50}>
                            <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />
                        </BrightnessFilter>
                    </ContrastFilter>
                );

            case 'color boost':
                return (
                    <ColorMatrix
                        matrix={[
                            1.3, 0, 0, 0, 0,
                            0, 1.3, 0, 0, 0,
                            0, 0, 1.3, 0, 0,
                            0, 0, 0, 1, 0,
                        ]}
                    >
                        <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />
                    </ColorMatrix>
                );

            case 'b&w':
                return (
                    <ColorMatrix
                        matrix={[
                            0.299, 0.587, 0.114, 0, 0,
                            0.299, 0.587, 0.114, 0, 0,
                            0.299, 0.587, 0.114, 0, 0,
                            0, 0, 0, 1, 0,
                        ]}
                    >
                        <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />
                    </ColorMatrix>
                );

            case 'blue tone':
                return (
                    <ColorMatrix
                        matrix={[
                            0.9, 0, 0, 0, 0,
                            0, 0.95, 0, 0, 0,
                            0, 0, 1.2, 0, 0,
                            0, 0, 0, 1, 0,
                        ]}
                    >
                        <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />
                    </ColorMatrix>
                );

            case 'yellow tone':
                return (
                    <ColorMatrix
                        matrix={[
                            1.15, 0, 0, 0, 0,
                            0, 1.1, 0, 0, 0,
                            0, 0, 0.9, 0, 0,
                            0, 0, 0, 1, 0,
                        ]}
                    >
                        <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />
                    </ColorMatrix>
                );

            default:
                return (
                    <ContrastFilter amount={contrast / 50}>
                        <BrightnessFilter amount={brightness / 50}>
                            <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />
                        </BrightnessFilter>
                    </ContrastFilter>
                );
        }
    };

    useEffect(() => {
        const getPermissions = async () => {
            if (!hasPermission) await requestPermission();
            if (!hasMicPermission) await requestMicPermission();
        };

        getPermissions();
    }, [hasPermission, hasMicPermission]);


    const handleEditToggle = () => setIsEditingUI(!isEditingUI);

    const savePhotoToGallery = async (photoPath) => {
        try {
            setIsSaving(true);

            if (Platform.OS === 'ios') {
                const result = await request(PERMISSIONS.IOS.PHOTO_LIBRARY_ADD_ONLY);

                if (result !== RESULTS.GRANTED && result !== RESULTS.LIMITED) {
                    Alert.alert('Permission Denied', 'Photo library permission is required');
                    setIsSaving(false);
                    return null;
                }
            }

            if (Platform.OS === 'android') {
                const apiLevel = Platform.Version;
                let granted = true;

                if (apiLevel < 33) {
                    const result = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
                    );
                    granted = result === PermissionsAndroid.RESULTS.GRANTED;
                }

                if (!granted) {
                    Alert.alert('Permission Denied', 'Cannot save photo without permission');
                    setIsSaving(false);
                    return null;
                }
            }

            const uri =
                Platform.OS === 'ios'
                    ? photoPath.startsWith('file://')
                        ? photoPath
                        : `file://${photoPath}`
                    : photoPath;

            const savedPhoto = await CameraRoll.save(uri, {
                type: 'photo',
            });

            setIsSaving(false);
            return savedPhoto;
        } catch (error) {
            console.error('Failed to save photo:', error);
            Alert.alert('Save Failed', 'Failed to save photo to gallery');
            setIsSaving(false);
            return null;
        }
    };

    const takePhoto = async () => {
        if (!cameraRef.current || !isCameraReady) {
            console.log('Camera not ready');
            return;
        }

        try {
            if (Platform.OS === 'ios') {
                await new Promise(resolve => setTimeout(resolve, 100));
            }

            const photo = await cameraRef.current.takePhoto({
                flash: 'off',
                qualityPrioritization: 'balanced',
                ...(Platform.OS === 'android' ? { enableShutterSound: false } : {}),
            });


            const photoUri = Platform.OS === 'ios'
                ? photo.path.startsWith('file://') ? photo.path : `file://${photo.path}`
                : `file://${photo.path}`;

            console.log('Photo captured:', photoUri);

            setPhoto(photoUri);
            setVideoPath(null);
            setOriginalPhoto(photoUri);

            if (Platform.OS === 'android') {
                setShowCamera(false);
            }

        } catch (error) {
            console.error('Failed to take photo:', error);
            Alert.alert('Camera Error', 'Failed to capture photo');
        }
    };

    const retakePhoto = () => {
        setPhoto(null);
        setVideoPath(null);
        setOriginalPhoto(null);
        setShowCamera(true);
        setBrightness(50);
        setContrast(50);
        setIsEditingUI(false);
        setCroppedPhoto(null);
        setCropData(null);
    };

    const usePhoto = async () => {
        try {
            setIsSaving(true);

            // 🔥 Capture filtered image
            const localUri = await viewShotRef.current.capture();

            // 🔥 SAVE FILTERED IMAGE TO GALLERY (THIS WAS MISSING)
            await CameraRoll.save(localUri, { type: "photo" });

            // ---- EXISTING CODE BELOW (UNCHANGED) ----

            const token = await AsyncStorage.getItem("token");
            const storedUser = await AsyncStorage.getItem("user");

            if (!token || !storedUser) return;

            const userId = JSON.parse(storedUser)._id;

            const imageUrl = await uploadImageToFirebase(
                { uri: localUri },
                userId,
                hiveId
            );

            await axios.post(
                `https://snaphive-node.vercel.app/api/hives/${hiveId}/images`,
                { images: [imageUrl] },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            navigation.goBack();

        } catch (e) {
            console.log("camera upload error", e);
            Alert.alert("Upload Error", "Failed to upload photo");
        } finally {
            setIsSaving(false);
        }
    };


    // ✅ UPDATED USE MEDIA HANDLER
    const handleUseMedia = async () => {
        try {
            setIsSaving(true);

            const token = await AsyncStorage.getItem("token");
            const storedUser = await AsyncStorage.getItem("user");
            if (!token || !storedUser) throw new Error("Auth missing");

            const parsedUser = JSON.parse(storedUser);
            const userId = parsedUser._id || parsedUser.id;
            if (!userId) throw new Error("User ID missing");

            console.log("USER ID:", userId);
            console.log("HIVE ID:", hiveId);

            let localUri;

            // 📸 PHOTO FLOW
            if (!videoPath) {
                // capture filtered photo
                localUri = await viewShotRef.current.capture();

                // save to gallery
                await CameraRoll.save(localUri, { type: "photo" });
            }

            // 🎥 VIDEO FLOW
            const uploadResult = await uploadImageToFirebase(
                { uri: videoPath || localUri },
                userId,
                hiveId
            );

            // ✅ ALWAYS extract string URL
            const mediaUrl =
                typeof uploadResult === "string"
                    ? uploadResult
                    : uploadResult.url;

            const payload = videoPath
                ? {
                    videos: [
                        {
                            url: mediaUrl,
                            thumbnail: null,
                        },
                    ],
                }
                : {
                    images: [mediaUrl],
                };

            await axios.post(
                `https://snaphive-node.vercel.app/api/hives/${hiveId}/images`,
                payload,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            navigation.goBack();
        } catch (err) {
            console.log("Upload error:", err?.response?.data || err.message);
            Alert.alert("Upload Failed", "Failed to upload media");
        } finally {
            setIsSaving(false);
        }
    };
    const handleBrightnessChange = (value) => {
        setBrightness(value);
    };

    const handleContrastChange = (value) => {
        setContrast(value);
    };

    const handleUndo = () => {
        setBrightness(50);
        setContrast(50);
        setIsEditingUI(false);
        setActiveIcon(null);
        setCroppedPhoto(null);
        setCropData(null);
        if (originalPhoto) {
            setPhoto(originalPhoto);
        }
    };

    const handleCropComplete = (cropDataFromModal) => {
        try {
            setShowCropModal(false);
            setCropData(cropDataFromModal);
            setCroppedPhoto(cropDataFromModal);
            setActiveIcon('Crop');

            console.log('Crop applied:', cropDataFromModal);
        } catch (error) {
            console.error('Crop failed:', error);
            Alert.alert('Crop Failed', 'Failed to apply crop');
        }
    };
    // ⏱ Auto stop recording at 10 seconds
useEffect(() => {
    if (isRecording && recordSeconds >= 10) {
        stopRecording();
    }
}, [recordSeconds]);

    if (!hasPermission || !hasMicPermission) {

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

                    {videoPath && !showCamera && (
                        <View style={styles.videoContainer}>
                            <Video
                                source={{ uri: videoPath }}
                                style={styles.video}
                                resizeMode="cover"
                                repeat
                                controls
                            />
                        </View>
                    )}

                    {showCamera ? (
                        <Camera
                            key={device?.id + isFocused}
                            ref={cameraRef}
                            isActive={isFocused && showCamera}
                            style={styles.camera}
                            device={device}

                            photo={true}
                            video={true}
                            audio={true}   // ✅ Keep session stable
                            enableZoomGesture={false}
                            onInitialized={() => setIsCameraReady(true)}
                        />

                    ) : (
                        !videoPath && (
                            <ViewShot
                                ref={viewShotRef}
                                options={{
                                    format: "jpg",
                                    quality: 1,
                                }}
                                collapsable={false}
                            >
                                <View style={styles.imageContainer}>
                                    {cropData ? (
                                        <View style={styles.croppedContainer}>
                                            {renderFilteredImage(originalPhoto || photo)}
                                        </View>
                                    ) : (
                                        renderFilteredImage(photo)
                                    )}
                                </View>
                            </ViewShot>
                        )
                    )}

                    {!showCamera && (
                        <View style={styles.photoActions}>
                            <TouchableOpacity style={styles.actionButton} onPress={retakePhoto}>
                                <Text style={styles.actionButtonText}>Retake</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.actionButton, styles.usePhotoButton]}
                                disabled={isSaving}
                                onPress={handleUseMedia}
                            >
                                <Text style={styles.actionButtonText}>
                                    {isSaving
                                        ? "Saving..."
                                        : videoPath
                                            ? "Use Video"
                                            : "Use Photo"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {showCamera && (
                        <TouchableOpacity
                            style={[styles.shutter, isRecording && { backgroundColor: "#ff0000" }]}
                            onPress={() => mode === "photo" ? takePhoto() : (isRecording ? stopRecording() : startRecording())}
                            activeOpacity={0.7}
                        >
                            <View style={styles.shutterBtn} />
                        </TouchableOpacity>
                    )}

                    {!showCamera && !videoPath && (
                        <>
                            <PhotoEditOriginalvsEnhanced />
                            <TouchableOpacity style={styles.settingsBtn} onPress={handleEditToggle}>
                                <Settings />
                            </TouchableOpacity>

                            <View style={styles.sideIcons}>
                                <TouchableOpacity
                                    style={[styles.sideIcon, activeIcon === 'brightness' && styles.activeTab]}
                                    onPress={() => setActiveIcon('brightness')}
                                >
                                    <Adjustment />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.sideIcon, activeIcon === 'Crop' && styles.activeTab]}
                                    onPress={() => setShowCropModal(true)}
                                >
                                    <Crop />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.sideIcon, activeIcon === 'Undo' && styles.activeTab]}
                                    onPress={handleUndo}
                                >
                                    <Undo />
                                </TouchableOpacity>
                            </View>
                        </>
                    )}

                    <TouchableOpacity
                        style={styles.galleryBtn}
                        onPress={() => navigation.navigate('PhotoShare')}
                    >
                        <Gallery width={25} height={25} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.goBack()}>
                        <Text style={styles.closeText}>X</Text>
                    </TouchableOpacity>

                    {isRecording && (
                        <View style={styles.recordingHeader}>
                            <View style={styles.recDot} />
                            <Text style={styles.timerText}>
                                {new Date(recordSeconds * 1000).toISOString().substr(14, 5)}
                            </Text>
                        </View>
                    )}
                    {showCamera &&
                        <View style={{ position: "absolute", bottom: 110, alignSelf: "center", flexDirection: "row", gap: 20, backgroundColor: "rgba(0,0,0,0.4)", paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20 }}>
                            <TouchableOpacity onPress={() => setMode("photo")}>
                                <Text style={{ color: mode === "photo" ? "white" : "gray", fontSize: 14, fontWeight: "600" }}>PHOTO</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setMode("video")}>
                                <Text style={{ color: mode === "video" ? "white" : "gray", fontSize: 14, fontWeight: "600" }}>VIDEO</Text>
                            </TouchableOpacity>
                        </View>
                    }
                </View>

                {isEditingUI && (
                    <PhotoEditMenu
                        onClose={() => setIsEditingUI(false)}
                        brightness={brightness}
                        onBrightnessChange={handleBrightnessChange}
                        contrast={contrast}
                        onContrastChange={handleContrastChange}
                        photoUri={photo}
                        onFilterChange={setActiveFilter}
                    />
                )}

                <PhotoCropModal
                    visible={showCropModal}
                    photoUri={originalPhoto || photo}
                    onClose={() => setShowCropModal(false)}
                    onCropComplete={handleCropComplete}
                />

            </SafeAreaView>
        </SafeAreaProvider>
    );
};

export default ClickPhoto;

const styles = StyleSheet.create({
    safeArea: { flex: 1 },
    container: { flex: 1, position: 'relative' },
    camera: { width: '100%', height: '100%', position: 'absolute' },
    imageContainer: {
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
    },
    image: { width: '100%', height: '100%' },
    croppedContainer: {
        width: '100%',
        height: '100%',
        overflow: 'hidden',
    },
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
        zIndex: 50,
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
        top: 20,
        left: 20,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 15,
    },
    closeText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
    cameraSwitchBtn: {
        width: 40,
        height: 40,
        backgroundColor: '#FFFFFF4D',
        borderRadius: 20,
        position: 'absolute',
        top: 20,
        right: 20,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 15,
    },
    permissionText: { color: 'white', fontSize: 16, textAlign: 'center', marginTop: 50 },
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
    usePhotoButton: { backgroundColor: '#4CAF50' },
    actionButtonText: { color: 'white', fontSize: 14, fontWeight: '500' },
    sideIcons: {
        position: 'absolute',
        right: 20,
        top: 100,
        marginTop: -80,
        gap: 15,
    },
    sideIcon: {
        backgroundColor: 'rgba(255,255,255,0.3)',
        borderRadius: 20,
        padding: 10,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    activeTab: {
        backgroundColor: '#ffffff',
    },
    videoContainer: {
        position: "absolute",
        width: "100%",
        height: "100%",
        backgroundColor: "black",
    },
    video: {
        width: "100%",
        height: "100%",
    },
    recordingHeader: {
        position: "absolute",
        top: 50,
        alignSelf: "center",
        flexDirection: "row",
        alignItems: "center",
        zIndex: 100,
        backgroundColor: "rgba(0,0,0,0.4)",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    recDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "red",
        marginRight: 6,
    },
    timerText: {
        color: "white",
        fontSize: 14,
        fontWeight: "600",
    },
});