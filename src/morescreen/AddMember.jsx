import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import QR from "../../assets/svg/qr.svg";
import LeftArrow from "../../assets/svg/leftArrow.svg";
import ThemeButton from '../components/ThemeButton';
import TopNav from '../components/TopNavbar';

const AddMember = ({ navigation }) => {
    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <TopNav />
                <LeftArrow width={24} height={24} style={{ marginLeft: 20, marginTop: 20 }} onPress={() => navigation.goBack()} />
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 30, fontWeight: 600 }}>Add Member</Text>
                    <Text style={{ width: '60%', textAlign: 'center', marginTop: 10 }}>Scan QR code or copy link to share and invite members</Text>
                    <QR width={300} height={300} />
                </View>

                {/* Footer */}
                <View style={styles.footer}>

                    <ThemeButton
                        text="Copy to link code"
                        onPress={() => navigation.navigate("Subscribe")}
                    />
                </View>
            </SafeAreaView>
        </SafeAreaProvider>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    footer: {
        borderTopWidth: 1,
        borderColor: '#C6C6C6',
        borderStyle: 'solid',
        paddingInline: 34,
        alignItems: "center",
    },

})
export default AddMember