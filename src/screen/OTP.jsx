import React, { useState, useRef } from 'react';
import { View, StyleSheet, TextInput, TouchableWithoutFeedback, Text, ScrollView, Pressable } from 'react-native';
import Toast from 'react-native-toast-message';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ThemeButton from '../components/ThemeButton';
import Logo from '../components/Logo';
import CustomText from '../components/CustomText';
import { verifyOtp } from '../API/API';
import { resendOtp } from '../API/API';
import { useLoader } from '../context/LoaderContext';
import AppModal from "../components/AppModal";
import { ChevronLeft } from 'lucide-react-native';
import PrivacyPolicyModal from '../components/PrivacyPolicyModal';
const OTP = ({ navigation, route }) => {
  const { email, phone } = route.params || {};
  const formattedPhone = phone && !phone.startsWith("+")
    ? `+91${phone}`
    : phone;
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);
  const { showLoader, hideLoader } = useLoader();
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

  const handleChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text.slice(-1);
    setOtp(newOtp);

    if (text && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (!text && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };
const handleVerify = async () => {
  const finalOtp = otp.join('');

  if (finalOtp.length < 6) {
    showModal({
      title: "Invalid Code",
      message: "Please enter the complete 6-digit OTP",
      type: "warning",
    });
    return;
  }

  showLoader();

  try {
    // 🔥 simulate delay like API
    await new Promise(resolve => setTimeout(resolve, 1200));

    // 🔥 get existing user (from Signup)
    const storedUser = await AsyncStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;

    if (!user) throw new Error("User not found");

    // 🔥 fake token
    const fakeToken = "demo_token_" + Date.now();

    await AsyncStorage.setItem("token", fakeToken);
    await AsyncStorage.setItem("user", JSON.stringify(user));

    hideLoader();

    Toast.show({
      type: "success",
      text1: "Verified 🎉",
      text2: "OTP verified successfully",
    });

    setTimeout(() => {
      navigation.replace("MyTabs");
    }, 500);

  } catch (err) {
    hideLoader();

    showModal({
      title: "Verification Failed",
      message: "Something went wrong",
      type: "error",
    });
  }
};


  return (
    <SafeAreaProvider style={styles.safeArea} >
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <ScrollView
          contentContainerStyle={[styles.container, { paddingHorizontal: 20, paddingBottom: 40 }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* <Logo /> */}
          <View style={styles.backButton}>
            <TouchableWithoutFeedback onPress={() => navigation.goBack()} style={{ alignSelf: 'flex-start', marginBottom: 20 }}>
              <ChevronLeft width={30} height={30} />
            </TouchableWithoutFeedback>
          </View>
          <View style={styles.flex}>
            <CustomText weight="medium" style={styles.title}>Enter Code</CustomText>
          </View>

          <CustomText weight="medium" style={styles.description}>
            Enter the 6-digit code sent to your {email ? "email" : "phone"}.
          </CustomText>

          <View style={styles.otpRow}>
            {otp.map((value, index) => (
              <TextInput
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                style={styles.emailInput}
                keyboardType="numeric"
                maxLength={1}
                value={value}
                onChangeText={(text) => handleChange(text, index)}
              />
            ))}
          </View>

          <ThemeButton
            text="Confirm →"
            onPress={handleVerify}
            style={{ width: '100%', marginTop: 20 }}
          />

          <View style={styles.resendRow}>
            <CustomText weight="medium">Didn’t receive a code? </CustomText>
            <TouchableWithoutFeedback onPress={async () => {
  Toast.show({
    type: "success",
    text1: "OTP Sent",
    text2: "New OTP sent successfully",
  });
}}>
              <View>
                <CustomText weight="Bold" style={[styles.continueTxt, { fontWeight: 600 }]}>
                  Resend
                </CustomText>
              </View>
            </TouchableWithoutFeedback>
          </View>

          <Pressable
            style={{ marginTop: 40 }}
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

          <AppModal
            visible={modalVisible}
            title={modalData.title}
            message={modalData.message}
            type={modalData.type}
            onClose={() => setModalVisible(false)}
          />
        </ScrollView>


        <PrivacyPolicyModal
          visible={showPrivacyModal}
          onClose={() => setShowPrivacyModal(false)}
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
    backgroundColor: '#ffffff',
    padding: 20,
  },
  flex: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 25,
    color: '#000',
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 40,
  },
  description: {
    fontSize: 16,
    color: '#646464',
    textAlign: 'center',
    width: '100%',
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginTop: 20,
    marginBottom: 20,
  },
  emailInput: {
    width: 50,
    borderColor: '#ccc',
    backgroundColor: '#F0F5F5',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 18,
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '600',
  },
  resendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
  },

});

export default OTP;