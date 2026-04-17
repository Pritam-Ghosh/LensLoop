import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Image,
    Text,
    Modal
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import TopNav from '../components/TopNavbar';
import { launchCamera } from 'react-native-image-picker';
import ThemeButton from '../components/ThemeButton';
import PremiumModal from '../components/PremiumModal'
import Brightness from '../../assets/svg/brightness.svg'
import Contrast from '../../assets/svg/contrast.svg'
import Undo from '../../assets/svg/undo.svg'
import Crop from '../../assets/svg/crop.svg'

import Portrait from '../../assets/svg/portrait.svg'
import Hdr from '../../assets/svg/hdr.svg'
import Filter from '../../assets/svg/filter.svg'
import CustomText from '../components/CustomText';

const selfie = require("../../assets/selfie.jpg");
const dpthree = require("../../assets/dp3.jpg");

// Define before/after images for modal
const beforeImage = require("../../assets/selfie.jpg");
const afterImage = require("../../assets/dp3.jpg");

const PhotoEnhancement = ({ navigation }) => {
    const [photo, setPhoto] = useState(selfie);
    const [brightness, setBrightness] = useState(50);
    const [activeTab, setActiveTab] = useState('Enhanced');
    const [modalVisible, setModalVisible] = useState(false);

    const openCamera = () => {
        launchCamera(
            { mediaType: 'photo', saveToPhotos: true },
            (response) => {
                if (!response.didCancel && !response.errorCode) {
                    setPhoto({ uri: response.assets[0].uri });
                }
            }
        );
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.safeArea}>
                <TopNav />
                <View style={styles.container}>
                    {/* Photo Display */}
                    <View style={styles.photoContainer}>
                        <Image source={photo} style={styles.image} resizeMode="cover" />

                        {/* Top Tabs */}
                        <View style={styles.topTabs}>
                            <TouchableOpacity
                                style={[styles.tab, activeTab === 'Original' && styles.activeTab]}
                                onPress={() => setActiveTab('Original')}
                            >
                                <CustomText weight="semiBold" style={[styles.tabText, activeTab === 'Original' && styles.activeTabText]}>
                                    Original
                                </CustomText>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.tab, activeTab === 'Enhanced' && styles.activeTab]}
                                onPress={() => setActiveTab('Enhanced')}
                            >
                                <CustomText weight="semiBold" style={[styles.tabText, activeTab === 'Enhanced' && styles.activeTabText]}>
                                    Enhanced
                                </CustomText>
                            </TouchableOpacity>

                        </View>
                        <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.goBack()}>
                            <CustomText weight="semiBold" style={{ fontSize: 18 }}>X</CustomText>
                        </TouchableOpacity>
                        {/* Side Icons */}
                        <View style={styles.sideIcons}>
                            <TouchableOpacity style={[styles.sideIcon, { backgroundColor: '#ffffff' }]}>
                                <Undo />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.sideIcon}>
                                <Crop />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.sideIcon}>
                                <Contrast />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.sideIcon}>
                                <Brightness />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Bottom Control Panel */}
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
                </View>

                {/* Modal */}
                <PremiumModal
                    visible={modalVisible}
                    onClose={() => setModalVisible(false)}
                    beforeImage={beforeImage}
                    afterImage={afterImage}
                />
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

export default PhotoEnhancement;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#000'
    },
    container: {
        flex: 1
    },
    photoContainer: {
        flex: 1,
        position: 'relative'
    },
    image: {
        width: '100%',
        height: '100%',
        alignSelf: 'center'
    },

    // Top Tabs
    topTabs: {
        position: 'absolute',
        top: 20,
        left: '50%',
        flexDirection: 'row',
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 25,
        padding: 4,
        transform: [{ translateX: -100 }]
    },
    tab: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20
    },
    activeTab: {
        backgroundColor: '#fff'
    },
    tabText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500'
    },
    activeTabText: {
        color: '#000'
    },

    // Side Icons
    sideIcons: {
        position: 'absolute',
        right: 20,
        top: '50%',
        marginTop: -80,
        gap: 15
    },
    sideIcon: {
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 20,
        padding: 10,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center'
    },

    // Bottom Panel
    bottomPanel: {
        backgroundColor: '#000000CC',
        padding: 20,
        paddingBottom: 40
    },

    // Brightness Section
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

    // Premium Tools
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