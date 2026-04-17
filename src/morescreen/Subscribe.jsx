import { View, Text, StyleSheet, ScrollView } from 'react-native'
import React from 'react'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import TopNav from '../components/TopNavbar'

import Share from '../../assets/svg/share.svg';
import Download from '../../assets/svg/download.svg';

import LeftArrow from "../../assets/svg/leftArrow.svg";




import ThemeButton from '../components/ThemeButton';
const Subscribe = ({ navigation }) => {
    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <TopNav />

                <ScrollView contentContainerStyle={{ padding: 20 }}>
                    <LeftArrow width={24} height={24} onPress={() => navigation.goBack()} />
                    <Text style={{ fontSize: 30, fontWeight: 600, textAlign: 'center' }}>Join Premium now!</Text>
                    <Text style={{ fontSize: 16, fontWeight: 400, textAlign: 'center', marginTop: 15 }}>Start saving big by choosing the subscription package that fits your needs</Text>
                    {/* Active Card */}
                    <View style={styles.activeCard}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 13 }}>
                                <Text style={{ fontSize: 16, fontWeight: 500 }}>6 months</Text>
                                <View style={styles.activeBadge}>
                                    <Text style={{ color: '#ffffff' }}>Save 20%</Text>
                                </View>
                            </View>

                            <View style={styles.activeSelectB}>
                                <View style={styles.activeSelect}></View>
                            </View>
                        </View>

                        <Text style={{ fontSize: 14, color: '#323232', fontWeight: 400 }}>You'll begin paying the Regular Plus rate on 19 October 2025 once your current offer expires. </Text>

                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
                            <Text style={{ color: '#d61212', fontWeight: 400 }}>$150.00 / </Text>
                            <Text style={{ color: 'black' }}>months</Text>
                        </View>
                    </View>

                    {/* card detail */}
                    <View>
                        <Text style={{ fontSize: 20, fontWeight: 600, marginTop: 18 }}>Premium Benefits</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 15 }}>
                            <View style={[styles.iconBG]}>
                                <Share width={24} height={24} />
                            </View>
                            <Text style={{ fontSize: 16, fontWeight: 400 }}>Access 10 + expert insights</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 15 }}>
                            <View style={[styles.iconBG]}>
                                <Download width={24} height={24} />
                            </View>
                            <Text style={{ fontSize: 16, fontWeight: 400 }}>Explore trending topics and expert picks</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 15 }}>
                            <View style={[styles.iconBG]}>
                                <Share width={24} height={24} />
                            </View>
                            <Text style={{ fontSize: 16, fontWeight: 400 }}>Get tailored book recommendations</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 15 }}>
                            <View style={[styles.iconBG]}>
                                <Download width={24} height={24} />
                            </View>
                            <Text style={{ fontSize: 16, fontWeight: 400 }}>Save favorites to your personal library</Text>
                        </View>
                    </View>


                    <View style={styles.card}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 13 }}>
                                <Text style={{ fontSize: 16, fontWeight: 500 }}>12 months</Text>
                                <View style={styles.badge}>
                                    <Text style={{ color: '#ffffff' }}>Save 10%</Text>
                                </View>
                            </View>

                            <View style={styles.selectB}>
                                <View style={styles.select}></View>
                            </View>
                        </View>

                        <Text style={{ fontSize: 14, color: '#323232', fontWeight: 400 }}>You'll begin paying the Regular Plus rate on 19 October 2025 once your current offer expires. </Text>

                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
                            <Text style={{ color: '#d61212', fontWeight: 400 }}>$100.00 / </Text>
                            <Text style={{ color: 'black' }}>months</Text>
                        </View>
                    </View>



                    <View style={styles.card}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 13 }}>
                                <Text style={{ fontSize: 16, fontWeight: 500 }}>24 months</Text>
                                <View style={styles.badge}>
                                    <Text style={{ color: '#ffffff' }}>Save 10%</Text>
                                </View>
                            </View>

                            <View style={styles.selectB}>
                                <View style={styles.select}></View>
                            </View>
                        </View>

                        <Text style={{ fontSize: 14, color: '#323232', fontWeight: 400 }}>You'll begin paying the Regular Plus rate on 19 October 2025 once your current offer expires. </Text>

                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
                            <Text style={{ color: '#d61212', fontWeight: 400 }}>$100.00 / </Text>
                            <Text style={{ color: 'black' }}>months</Text>
                        </View>
                    </View>





                </ScrollView>

                {/* Footer */}
                <View style={styles.footer}>

                    <ThemeButton
                        text="Pay now"
                        onPress={() => navigation.navigate("CreateEvent")}
                    />
                </View>
            </SafeAreaView >
        </SafeAreaProvider >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",

    },


    activeCard: {
        marginTop: 20,
        backgroundColor: '#FFC240',
        padding: 20,
        borderRadius: 10,
    },
    activeBadge: {
        backgroundColor: '#000000',
        paddingHorizontal: 8,
        paddingVertical: 6,
        borderRadius: 25,
    },
    activeSelectB: {
        borderColor: '#ffffffff', borderWidth: 1, borderStyle: 'solid', padding: 4, borderRadius: 50
    },
    activeSelect: {
        height: 10, width: 10, borderRadius: 50, backgroundColor: '#ffffffff'
    },
    iconBG: {
        backgroundColor: '#FEEDD1',
        padding: 10,
        borderRadius: 50,
    },


    card: {
        marginTop: 20,
        borderWidth: 1,
        borderColor: '#E4E4E4',
        borderStyle: 'solid',
        padding: 20,
        borderRadius: 10,
    },
    badge: {
        backgroundColor: '#FF4800',
        paddingHorizontal: 8,
        paddingVertical: 6,
        borderRadius: 25,
    },
    selectB: {
        borderColor: '#CFCFCF', borderWidth: 1, borderStyle: 'solid', padding: 4, borderRadius: 50
    },
    select: {
        height: 10, width: 10, backgroundColor: '#CFCFCF', borderRadius: 50,
    },


    footer: {
        borderTopWidth: 1,
        borderColor: '#C6C6C6',
        borderStyle: 'solid',
        paddingInline: 34,
        alignItems: "center",
    },

})

export default Subscribe