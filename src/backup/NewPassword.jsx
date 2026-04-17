import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableWithoutFeedback, TouchableHighlight, Alert } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Logo from '../components/Logo';
import ThemeButton from '../components/ThemeButton';
import CustomText from '../components/CustomText';

const logo = require("../../assets/logo.png");

const Login = ({ navigation }) => {

    const [OTP, setOTP] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const isValidEmail = (text) => /\S+@\S+\.\S+/.test(text);
    const isValidPhone = (text) => /^[0-9]{10,15}$/.test(text);

    const handleContinue = () => {
        if (!userID.trim()) {
            Alert.alert("Error", "Please enter your email or phone number");
            return;
        }

        if (!isValidEmail(userID) && !isValidPhone(userID)) {
            Alert.alert("Error", "Please enter your password");
            return;
        }

        if (!password.trim()) {
            Alert.alert("login guide", "Please create a password");
            return;
        }
        navigation.navigate('MyTabs');
    };

    return (
        <SafeAreaProvider style={styles.container}>
            <Logo />
  

            <TextInput style={styles.emailInput}
                value={OTP}
                onChangeText={setOTP}
                placeholder='OTP sent to your email or phone number'
                keyboardType='email-address'
                autoCapitalize='none' />


            <View style={{ width: '97%', marginTop: 10 }}>
                <TouchableWithoutFeedback>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <CustomText weight='medium' style={{ color: '#5e5e5eff', textAlign: 'left' }} >
                            Didn't get a code ?
                        </CustomText>
                        <CustomText weight='medium' style={{ color: '#111a94ff', textAlign: 'left', marginLeft: 4 }} >
                            Resend
                        </CustomText>
                    </View>

                </TouchableWithoutFeedback>
            </View>


            <TextInput
                style={styles.emailInput}
                value={password}
                onChangeText={setPassword}
                placeholder='New Password'
                secureTextEntry={true} 
                autoCapitalize='none'
            />



            <ThemeButton
                text="Login →"

                style={{ width: "100%", marginTop: 20 }}
                onPress={() => navigation.navigate("Login")}
            />


            <CustomText weight='medium' style={[styles.description, { position: 'absolute', bottom: 20, textAlign: 'center', fontSize: 14 }]}>
                By continuing I accept Selfso's Terms of Use
                and
                <TouchableWithoutFeedback >
                    <CustomText weight='medium' style={[styles.continueTxt, { fontWeight: 600, textDecorationLine: "underline", color: "#000000ff" }]}> Privacy Policy</CustomText>
                </TouchableWithoutFeedback>
            </CustomText>

        </SafeAreaProvider>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "#ffffff", padding: 20 },
    flex: { flexDirection: "row", justifyContent: "center", alignItems: 'center', marginBottom: 24 },
    logo: { width: 50, height: 50, resizeMode: "contain", marginRight: 10 },
    title: { fontSize: 35, color: '#000', fontWeight: '700', textAlign: 'center', },
    description: { fontSize: 16, color: '#646464', textAlign: 'center', width: '100%' },

    emailInput: {
        marginTop: 32,
        width: "100%",
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 21,
        fontSize: 16,
        textAlign: 'left',
        paddingLeft: 27,

    },
});

export default Login;