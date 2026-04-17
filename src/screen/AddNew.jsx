import React from "react";
import {
    Modal,
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Dimensions,
    SafeAreaView, Platform
} from "react-native";

const { width } = Dimensions.get("window");

const profile = require("../../assets/profile.jpg");
const snaphive = require("../../assets/snaphive-logo.png");

import { colors } from '../Theme/theme';

const AutoSyncModal = ({ visible, onCreate, onSkip, photoCount = 0, previewImage, photos = [] }) => {
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
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            statusBarTranslucent
        >
            <View style={styles.overlay}>
                <SafeAreaView style={styles.container}>
                    <View
                        style={{
                            width: '100%',
                            height: 50,
                            justifyContent: "center",
                            alignItems: "center",
                            marginBottom: 20,
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
                        <View style={styles.previewCard}>
                            {last3Photos.map((photo, index) => {
                                if (!photo?.uri) return null;

                                return (
                                    <Image
                                        key={`preview-${index}`}
                                        source={{ uri: photo.uri }}
                                        style={[
                                            styles.previewThumb,
                                            index === 1 && last3Photos.length > 1 && {
                                                width: 120,
                                                height: 100,
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
                        </View>

                        <View style={styles.groupOftext}>
                            {/* Preview Text */}
                            <Text style={styles.previewText}>
                                Create Hive with {photoCount} new {photoCount === 1 ? 'photo' : 'photos'}?
                            </Text>

                            {/* Primary Button */}
                            <TouchableOpacity style={styles.primaryButton} onPress={onCreate}>
                                <Text style={styles.primaryText}>Create Hive</Text>
                            </TouchableOpacity>

                            {/* Skip */}
                            <TouchableOpacity onPress={onSkip} style={styles.skipButton}>
                                <Text style={styles.skipText}>Skip for now</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </SafeAreaView>
            </View>
        </Modal>
    );
};

export default AutoSyncModal;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "#fdfcfe",
        justifyContent: "center",
        alignItems: "center",
    },
    container: {
        flex: 1,
        width: '100%',
        backgroundColor: "#fff",
        padding: 10,
        paddingTop: 60,
        alignItems: "center",
        justifyContent: "center",
    },

    codeImag:{
     backgroundColor:'#ffffff',
     padding: 10,
     paddingBottom:0,
     paddingLeft:0,
     paddingRight:0,
     borderWidth: 2,
     borderColor: '#e1e4ee',
     borderRadius: 22,
     width:"98%",
     marginHorizontal: 'auto',
     alignItems: 'center',
     justifyContent:'center',
     ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    })
    },
    groupOftext:{
        backgroundColor:'#ffffff',
        borderRadius: 22,
        textAlign:'center',
padding: 10,
        width: '100%',
        alignItems: 'center',
     justifyContent:'center',
      borderWidth: 1,
     borderColor: '#e9e9e9',
    },
    /* Image Stack */

    imageStack: {
        height: 200,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },

    mainImage: {
        width: 170,
        height: 160,
        borderRadius: 22,
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
        width: 120,
        height: 145,
        borderRadius: 20,
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
        left: 12,
        top: 60,
        zIndex: 1,
        transform: [{ rotate: '-12deg' }],
    },

    rightImage: {
        right: 12,
        top: 60,
        zIndex: 2,
        transform: [{ rotate: '12deg' }],
    },

    /* Text */
    title: {
        fontSize: 22,
        fontWeight: "700",
        color: "#161a23",
        marginBottom: 12,
        textAlign: "center",
        lineHeight: 32,
    },
    description: {
        textAlign: "center",
        fontSize: 15,
        color: "#7a7a7a",
        lineHeight: 22,
        marginBottom: 24,
        paddingHorizontal: 8,
    },

    /* Preview Card with 3 photos */
    previewCard: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 28,
        width: "100%",
        marginBottom: 12,
        position: "relative",
    },

    previewThumb: {
        width: 90,
        height: 58,
        borderRadius: 14,
        marginHorizontal: -14, // 👈 overlap magic
        borderWidth: 3,
        borderColor: "#fff",

        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 6,
    },
    previewText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#2a2a2a",
        lineHeight: 24,
        marginBottom: 20,
        textAlign: "center",
    },

    /* Buttons */
    primaryButton: {
        width: "95%",
        backgroundColor: colors.primary,
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: "center",
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
        marginBottom: 8,
    },
    primaryText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
    },
    skipButton: {
        paddingVertical: 12,
    },
    skipText: {
        fontSize: 15,
        color: colors.primary,
        fontWeight: "600",
    },

});