import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'

//svg icons
import Brightness from '../../assets/svg/brightness.svg'
import Contrast from '../../assets/svg/contrast.svg'
import Undo from '../../assets/svg/undo.svg'
import Crop from '../../assets/svg/crop.svg'

const PhotoEditSideIcons = () => {

    const [activeIcon, setActiveIcon] = useState('brightness');


    return (
        <View style={styles.sideIcons}>
            <TouchableOpacity style={[styles.sideIcon,
            activeIcon == 'brightness' && styles.activeTab
            ]} onPress={() => { setActiveIcon('brightness') }}>
                <Brightness />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.sideIcon,
            activeIcon == 'contrast' && styles.activeTab
            ]} onPress={() => { setActiveIcon('contrast') }}>
                <Contrast />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.sideIcon,
            activeIcon == 'Crop' && styles.activeTab
            ]} onPress={() => { setActiveIcon('Crop') }}>
                <Crop />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.sideIcon,
            activeIcon == 'Undo' && styles.activeTab
            ]} onPress={() => { setActiveIcon('Undo') }}>
                <Undo />
            </TouchableOpacity>
        </View>
    )
}

export default PhotoEditSideIcons

const styles = StyleSheet.create({
    // side icon
    sideIcons: {
        position: 'absolute',
        right: 20,
        top: 100,
        marginTop: -80,
        gap: 15
    },
    sideIcon: {
        backgroundColor: 'rgba(255,255,255,0.3)',
        borderRadius: 20,
        padding: 10,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center'
    },

    activeTab: {
        backgroundColor: '#ffffff',
    }
})