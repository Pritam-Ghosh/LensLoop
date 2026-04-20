import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableWithoutFeedback, useWindowDimensions, ActivityIndicator, Dimensions, ScrollView, Keyboard, Pressable } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLoader } from "../context/LoaderContext";
import AppModal from "../components/AppModal";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import Logo from '../components/Logo';
import ThemeButton from '../components/ThemeButton';
import CustomText from '../components/CustomText';
import PrivacyPolicyModal from '../components/PrivacyPolicyModal'; //
const logo = require("../../assets/logo.png");
// svg
import Igoogle from "../../assets/Igoogle.svg";
import Iapple from "../../assets/apple2.svg";

import { PermissionsAndroid, Platform } from "react-native";




const { width, height } = Dimensions.get("window");

const scale = width / 390;     // baseline width
const vscale = height / 844;   // baseline height

function rs(value) {
    return Math.round(value * scale);
}

function rvs(value) {
    return Math.round(value * vscale);
}


const Login = ({ navigation }) => {
    const { showLoader, hideLoader } = useLoader();
    const { width, height } = useWindowDimensions();
    const [userID, setUserID] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const [showPrivacyModal, setShowPrivacyModal] = useState(false);

    const [modalVisible, setModalVisible] = useState(false);
    const [modalData, setModalData] = useState({
        title: "",
        message: "",
        type: "info",
    });
    const showModal = ({ title, message, type = "info" }) => {
        setModalData({ title, message, type });
        setModalVisible(true);
    };





    const handleContinue = async () => {
        Keyboard.dismiss();

        if (!userID.trim()) {
            showModal({
                title: "Missing Information",
                message: "Please enter your email or phone number",
                type: "warning",
            });
            return;
        }
        navigation.navigate("MyTabs")
        if (!password.trim()) {
            showModal({
                title: "Password Required",
                message: "Please enter your password",
                type: "warning",
            });
            return;
        }


    };






    return (
        <SafeAreaProvider style={styles.safeArea}>
            <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
                <ScrollView
                    contentContainerStyle={[styles.container, { paddingHorizontal: 20, paddingBottom: 40 }]}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >


                    <Logo />
                    <CustomText weight='medium' style={[styles.description, { paddingInline: 32 }]}>
                        Login to your account in Snaphive to start Photo and video share
                    </CustomText>

                    <TextInput style={styles.emailInput}
                        value={userID}
                        onChangeText={setUserID}
                        placeholder='Enter your email or phone number'
                        keyboardType='default'
                        autoCapitalize='none' />
                    <TextInput style={styles.emailInput}
                        value={password}
                        onChangeText={setPassword}
                        placeholder='Enter your password'
                        secureTextEntry={true} />

                    <View style={{ width: '100%', marginTop: 10 }}>
                        <TouchableWithoutFeedback>
                            <CustomText weight='medium' style={{ color: '#111a94ff', textAlign: 'left' }} onPress={() => navigation.navigate("ForgotPassword")}>
                                Forgot your password ?
                            </CustomText>
                        </TouchableWithoutFeedback>
                    </View>


                    <ThemeButton
                        text={loading ? "" : "Login →"}
                        onPress={handleContinue}
                        style={{ width: "100%", marginTop: 15 }}
                    />

                    {/* Continue with Google */}
                    <TouchableWithoutFeedback>
                        <View style={[styles.outlineBtn, { paddingVertical: height * 0.02 }]}>
                            <View style={styles.iconContainer}>
                                <Igoogle width={width * 0.06} height={width * 0.06} />
                            </View>
                            <CustomText
                                style={[
                                    styles.continueTxt,
                                    {
                                        fontSize: width * 0.03, fontFamily: 'Montserrat-Medium', fontWeight: '600', color: '#000', // White text
                                    },
                                ]}
                            >
                                Continue with Google
                            </CustomText>
                        </View>
                    </TouchableWithoutFeedback>

                    {/* Continue with Apple */}
                    <TouchableWithoutFeedback >
                        <View
                            style={[
                                styles.outlineBtn,
                                {
                                    paddingVertical: height * 0.02,
                                    backgroundColor: '#000000',
                                    marginTop: 15,
                                    marginBottom: 8,
                                    borderWidth: 1,
                                    borderColor: '#000',
                                }
                            ]}
                        >
                            <View style={styles.iconContainer}>
                                <Iapple width={width * 0.06} height={width * 0.06} />
                            </View>
                            <CustomText
                                style={[
                                    styles.continueTxt,
                                    {
                                        fontSize: width * 0.03,
                                        fontFamily: 'Montserrat-Medium',
                                        fontWeight: '600',
                                        color: '#fff', // White text
                                    },
                                ]}
                            >
                                Continue with Apple
                            </CustomText>
                        </View>
                    </TouchableWithoutFeedback>


                    {/* <TouchableWithoutFeedback onPress={() => setShowPrivacyModal(true)}>
                        <CustomText weight='medium' style={[styles.description, { position: 'absolute', bottom: 20, textAlign: 'center', fontSize: 14 }]}>
                            By continuing I accept Selfso's Terms of Use
                            and
                            <CustomText weight='medium' style={[styles.continueTxt, { fontWeight: 600, textDecorationLine: "underline", color: "#000000ff" }]}> Privacy Policy</CustomText>
                        </CustomText>
                    </TouchableWithoutFeedback>
                    <PrivacyPolicyModal
                        visible={showPrivacyModal}
                        onClose={() => setShowPrivacyModal(false)}
                    /> */}



                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <CustomText weight='medium' style={{ color: '#000000ff' }}>Don’t have an account ?  </CustomText>
                        <TouchableWithoutFeedback >
                            <TouchableWithoutFeedback onPress={() => navigation.navigate('Signup')}>
                                <CustomText weight="bold" style={[styles.continueTxt, { color: '#111a94ff' }]}>Sign up</CustomText>
                            </TouchableWithoutFeedback>
                        </TouchableWithoutFeedback>
                    </View>

                    <Pressable
                        style={[styles.description, { position: 'absolute', bottom: 20, textAlign: 'center', fontSize: 14 }]}
                        onPress={() => setShowPrivacyModal(true)}
                    >
                        <CustomText
                            weight="medium"
                            style={{ color: '#646464', textAlign: 'center', fontSize: 14 }}
                        >
                            By continuing I accept Selfso's Terms of Use and{" "}
                            <CustomText weight="bold" style={{ textDecorationLine: 'underline' }}>
                                Privacy Policy
                            </CustomText>
                        </CustomText>
                    </Pressable>



                </ScrollView>
                <PrivacyPolicyModal
                    visible={showPrivacyModal}
                    onClose={() => setShowPrivacyModal(false)}
                />
                <AppModal
                    visible={modalVisible}
                    title={modalData.title}
                    message={modalData.message}
                    type={modalData.type}
                    onClose={() => setModalVisible(false)}
                />
            </SafeAreaView>
        </SafeAreaProvider>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#fff",
        paddingTop: rvs(20),
        paddingBottom: rvs(40),
    },

    flex: { flexDirection: "row", justifyContent: "center", alignItems: 'center', marginBottom: 24 },
    logo: { width: 50, height: 50, resizeMode: "contain", marginRight: 10 },
    title: { fontSize: 35, color: '#000', fontWeight: '700', textAlign: 'center', },
    description: {
        fontSize: rs(14),
        color: '#646464',
        textAlign: 'center',
        width: '100%',
        marginTop: rvs(10),
    },


    emailInput: {
        marginTop: rvs(20),
        width: "100%",
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 7,
        paddingHorizontal: rs(20),
        paddingVertical: rs(18),
        fontSize: rs(16),
        textAlign: 'left',
        paddingLeft: rs(27),
    },

    inputType: {
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 16,
        paddingLeft: 10,
        paddingVertical: 16,
        fontSize: 16,
    },
    outlineBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderRadius: rs(12),
        width: '100%',
borderRadius: 50,
        marginTop: rvs(0),
        paddingVertical: rvs(18),
    },

    iconContainer: {
        position: 'absolute',
        left: rs(22),
    },

    orLine: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },

    continueTxt: {
        fontSize: rs(14),
    },




});

export default Login;