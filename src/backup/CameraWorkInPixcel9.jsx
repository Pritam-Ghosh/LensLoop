import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Text } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import TopNav from '../components/TopNavbar';
import Gallery from '../../assets/svg/gallery.svg';
import Settings from '../../assets/svg/settings.svg';
import { launchCamera } from 'react-native-image-picker';

const selfie = require("../../assets/selfie.jpg");

const ClickPhoto = ({ navigation }) => {
    const [photo, setPhoto] = useState(selfie);

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
                    <Image source={photo} style={styles.image} resizeMode="cover" />


                    <TouchableOpacity style={styles.settingsBtn} onPress={() => navigation.navigate("ClickPhotoTwo")}>
                        <Settings width={30} height={30} fill="#fff" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.shutter} onPress={openCamera}>
                        <View style={styles.shutterBtn}></View>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.galleryBtn}>
                        <Gallery width={30} height={30} fill="#fff" />
                    </TouchableOpacity>


                    <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.goBack()}>
                        <Text style={{ fontSize: 18 }}>X</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

export default ClickPhoto;

const styles = StyleSheet.create({
    safeArea: { flex: 1 },
    container: { flex: 1, position: 'relative' },
    image: { width: '100%', height: '100%' },

    // Shutter button
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

    // Settings button top-right
    settingsBtn: {
        width: 100,
        height: 100,
        backgroundColor: '#030303B2',
        borderRadius: 50,
        position: 'absolute',
        bottom: 30,
        right: 70,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 15,
    },

    // Gallery button bottom-left
    galleryBtn: {
        width: 100,
        height: 100,
        backgroundColor: '#030303B2',
        borderRadius: 50,
        position: 'absolute',
        bottom: 30,
        left: 70,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 15,

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
