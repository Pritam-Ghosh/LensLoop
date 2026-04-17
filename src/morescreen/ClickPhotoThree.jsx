import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Text } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import TopNav from '../components/TopNavbar';
import Gallery from '../../assets/svg/gallery.svg';
import Settings from '../../assets/svg/settings.svg';
import { launchCamera } from 'react-native-image-picker';
import ThemeButton from '../components/ThemeButton';
import Brightness from '../../assets/svg/brightness.svg'
import Contrast from '../../assets/svg/contrast.svg'
import Undo from '../../assets/svg/undo.svg'
import Crop from '../../assets/svg/crop.svg'
const selfie = require("../../assets/selfie.jpg");

const ClickPhoto = ({ navigation }) => {
    const [photo, setPhoto] = useState(selfie);
    const [selectedFilter, setSelectedFilter] = useState('Original');
    const [activeTab, setActiveTab] = useState('Enhanced');
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

    const filters = [
        { name: 'Original', selected: selectedFilter === 'Original' },
        { name: 'Enhanced', selected: selectedFilter === 'Enhanced' },
    ];

    const colorFilters = [
        { id: 1, color: '#FF69B4' }, // Pink
        { id: 2, color: '#DDA0DD' }, // Plum
        { id: 3, color: '#98FB98' }, // Pale Green
        { id: 4, color: '#FF1493' }, // Deep Pink
    ];

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.safeArea}>
                <TopNav />
                <View style={styles.container}>
                    <Image source={photo} style={styles.image} resizeMode="cover" />

                    {/* Top buttons */}
                    <View style={styles.topTabs}>
                        <TouchableOpacity
                            style={[styles.tab, activeTab === 'Original' && styles.activeTab]}
                            onPress={() => setActiveTab('Original')}
                        >
                            <Text style={[styles.tabText, activeTab === 'Original' && styles.activeTabText]}>
                                Original
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.tab, activeTab === 'Enhanced' && styles.activeTab]}
                            onPress={() => setActiveTab('Enhanced')}
                        >
                            <Text style={[styles.tabText, activeTab === 'Enhanced' && styles.activeTabText]}>
                                Enhanced
                            </Text>
                        </TouchableOpacity>
                    </View>

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

                    {/* Close button */}
                    <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.goBack()}>
                        <Text style={styles.closeBtnText}>X</Text>
                    </TouchableOpacity>

                    {/* Filter Controls */}
                    <View style={styles.filterContainer}>
                        {/* Filter Type Selector */}


                        {/* Filters Label */}
                        <View style={styles.filtersHeader}>
                            <Text style={styles.filtersText}>X</Text>
                            <Text style={styles.filtersText}>Filters</Text>
                            <TouchableOpacity>
                                <Text style={styles.checkmarkText}>✓</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Color Filter Options */}
                        <View style={styles.colorFiltersContainer}>
                            <View style={styles.colorFiltersRow}>
                                <Text style={styles.colorLabel}>Color 1</Text>
                                <Text style={styles.colorLabel}>Color 2</Text>
                                <Text style={styles.colorLabel}>Color 3</Text>
                                <Text style={styles.colorLabel}>Color 4</Text>
                            </View>
                            <View style={styles.colorCirclesRow}>
                                {colorFilters.map((filter, index) => (
                                    <TouchableOpacity
                                        key={filter.id}
                                        style={[styles.colorCircle, { backgroundColor: filter.color }]}
                                    />
                                ))}
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
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

export default ClickPhoto;

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#000' },
    container: { flex: 1, position: 'relative' },
    image: { width: '100%', height: '100%' },

    // Top buttons
    topButtons: {
        position: 'absolute',
        top: 50,
        right: 20,
        flexDirection: 'column',
        zIndex: 20,
    },
    topBtn: {
        width: 36,
        height: 36,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    topBtnText: {
        fontSize: 16,
        color: '#fff',
    },

    // Close button
    closeBtn: {
        position: 'absolute',
        top: 50,
        left: 20,
        width: 36,
        height: 36,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 20,
    },
    closeBtnText: {
        fontSize: 20,
        color: '#000000', 
    },

    // Filter Container
    filterContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 40,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },

    // Filter Type Selector
    filterTypeContainer: {
        flexDirection: 'row',
        marginBottom: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 25,
        padding: 4,
    },
    filterTypeBtn: {
        flex: 1,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        alignItems: 'center',
    },
    filterTypeBtnSelected: {
        backgroundColor: '#fff',
    },
    filterTypeText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
    },
    filterTypeTextSelected: {
        color: '#000',
    },

    // Filters Header
    filtersHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    filtersText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    checkmarkText: {
        color: '#fff',
        fontSize: 18,
    },

    // Color Filters
    colorFiltersContainer: {
        marginBottom: 20,
    },
    colorFiltersRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    colorLabel: {
        color: '#fff',
        fontSize: 12,
        flex: 1,
        textAlign: 'center',
    },
    colorCirclesRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
    },
    colorCircle: {
        width: 50,
        height: 50,
        borderRadius: 10,
        marginHorizontal: 5,
    },

    // Continue Button
    continueBtn: {
        backgroundColor: '#FFA500',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    continueBtnText: {
        color: '#000',
        fontSize: 16,
        fontWeight: '600',
    },

    // Settings button
    settingsBtn: {
        position: 'absolute',
        bottom: 200,
        right: 20,
        width: 40,
        height: 40,
        backgroundColor: 'rgba(3, 3, 3, 0.7)',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 15,
    },

    // Gallery button
    galleryBtn: {
        position: 'absolute',
        bottom: 200,
        left: 20,
        width: 40,
        height: 40,
        backgroundColor: 'rgba(3, 3, 3, 0.7)',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 15,
    },

    // Side Icons
    sideIcons: {
        position: 'absolute',
        right: 20,
        top: '20%',
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

    // Top Tabs
    topTabs: {
        position: 'absolute',
        top: 20,
        left: '50%',
        flexDirection: 'row',
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 25,
        padding: 4,
        transform: [{ translateX: -100 }] // adjust value based on your tab width
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

});