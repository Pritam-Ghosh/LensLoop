import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Logo from './Logo'


// Import your SVGs

import Bell from '../../assets/svg/bell.svg';
const TopNav = () => {

    const navigation = useNavigation();
    return (

        <View style={styles.container}>
            {/* Left Section: Logo + Text */}
            <View style={styles.leftSection}>
                <Logo style={{ width: 120, height: 30 }} />
            </View>
            {/* Right Section: Notification */}
            <TouchableOpacity style={styles.bellWrapper} onPress={() => navigation.navigate("Notification")}>
                <Bell width={28} height={28} />
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>1</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 70,
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',

    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    logoText: {
        fontSize: 20,
        fontWeight: '700',
        color: '#000',
    },
    bellWrapper: {
        position: 'relative',
    },
    badge: {
        position: 'absolute',
        top: -4,
        right: -6,
        backgroundColor: 'red',
        borderRadius: 10,
        paddingHorizontal: 5,
        paddingVertical: 1,
        minWidth: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    badgeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
});

export default TopNav;
