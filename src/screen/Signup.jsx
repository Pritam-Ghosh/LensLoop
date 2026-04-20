import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  useWindowDimensions,
  ScrollView,
  Dimensions,
  Keyboard,
  Pressable, // <-- Use RN built-in SafeAreaView
} from 'react-native';
import { useLoader } from "../context/LoaderContext";
import AppModal from "../components/AppModal";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import PhoneInput from "react-native-phone-number-input";
import AsyncStorage from "@react-native-async-storage/async-storage";


// components

import CustomText from '../components/CustomText';
import ThemeButton from '../components/ThemeButton';
import Logo from '../components/Logo';
import PrivacyPolicyModal from '../components/PrivacyPolicyModal';

// svg
import Igoogle from "../../assets/Igoogle.svg";
import Iapple from "../../assets/apple2.svg";
import { AtSign, Smartphone } from 'lucide-react-native';

const { width, height } = Dimensions.get("window");

const scale = width / 390;
const vscale = height / 844;

function rs(value) {
  return Math.round(value * scale);
}
function rvs(value) {
  return Math.round(value * vscale);
}

const Signup = ({ navigation }) => {
  const [userID, setUserID] = useState('');
  const [password, setPassword] = useState('');
  const { width, height } = useWindowDimensions();
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const phoneInput = useRef(null);
  const [phoneValue, setPhoneValue] = useState("");
  const [formattedPhone, setFormattedPhone] = useState("");
  const [signupType, setSignupType] = useState("phone");
  const { showLoader, hideLoader } = useLoader();

  const isValidEmail = (text) => /\S+@\S+\.\S+/.test(text);
  const isValidPhone = (text) => /^[0-9]{10,15}$/.test(text);


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
        title: "Create Account",
        message: "Please enter your email or phone number",
        type: "warning",
      });
      return;
    }

    if (!isValidEmail(userID) && !isValidPhone(userID)) {
      showModal({
        title: "Invalid Input",
        message: "Please enter a valid email or phone number",
        type: "error",
      });
      return;
    }

    if (!password.trim()) {
      showModal({
        title: "Password Required",
        message: "Please create a password",
        type: "warning",
      });
      return;
    }

    showLoader();

    try {
      // 🔥 CREATE LOCAL USER
      const newUser = {
        id: Date.now().toString(),
        name: isValidEmail(userID) ? userID.split("@")[0] : "User",
        email: isValidEmail(userID) ? userID : null,
        phone: !isValidEmail(userID) ? formattedPhone : null,
        profileImage: null,
      };

      // 💾 SAVE LOCALLY
      await AsyncStorage.setItem("user", JSON.stringify(newUser));

      hideLoader();

      // ✅ SAME UI EXPERIENCE (simulate OTP)
      showModal({
        title: "OTP Sent",
        message: isValidEmail(userID)
          ? "We’ve sent a verification code to your email"
          : "We’ve sent a verification code to your phone",
        type: "success",
      });

      setTimeout(() => {
        navigation.replace("OTP");
      }, 1200);

    } catch (err) {
      hideLoader();

      showModal({
        title: "Registration Failed",
        message: "Something went wrong",
        type: "error",
      });
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
            Automatically share photos taken by members of your group
          </CustomText>
          <View
            style={{
              flexDirection: "row",
              backgroundColor: "#F4FBF6",
              borderRadius: 50,
              padding: 5,
              marginTop: 20,
              alignSelf: "center",
            }}
          >
            {/* PHONE TAB */}
            <Pressable
              onPress={() => setSignupType("phone")}
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 50,
                backgroundColor:
                  signupType === "phone" ? "#52AB5E" : "transparent",
              }}
            >
              <Smartphone
                size={18}
                color={signupType === "phone" ? "#fff" : "#52AB5E"}
              />
            </Pressable>

            {/* EMAIL TAB */}
            <Pressable
              onPress={() => setSignupType("email")}
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 50,
                backgroundColor:
                  signupType === "email" ? "#52AB5E" : "transparent",
              }}
            >
              <AtSign
                size={18}
                color={signupType === "email" ? "#fff" : "#52AB5E"}
              />
            </Pressable>
          </View>
          <View style={{ width: "100%", marginTop: 20 }}>
            {signupType === "phone" ? (

              <View style={{ width: "100%", marginTop: 20 }}>
                <PhoneInput
                  ref={phoneInput}
                  defaultValue={phoneValue}
                  defaultCode="IN"
                  layout="first"
                  onChangeText={(text) => {
                    setPhoneValue(text);
                    setUserID(text);
                  }}
                  onChangeFormattedText={(text) => {
                    setFormattedPhone(text);
                  }}
                  containerStyle={{
                    width: "100%",
                    borderRadius: 7,
                    borderWidth: 1,
                    borderColor: "#ccc",
                  }}
                  textContainerStyle={{
                    borderRadius: 7,
                    backgroundColor: "#fff",
                  }}
                  textInputStyle={{
                    fontSize: 16,
                  }}
                />
              </View>

            ) : (

              <View style={{ width: "100%", marginTop: 20 }}>
                <TextInput
                  style={styles.emailInput}
                  placeholder="Enter your email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={userID}
                  onChangeText={setUserID}
                />
              </View>

            )}
          </View>

          <View style={{ width: '100%', marginTop: 20 }}>
            <TextInput
              style={styles.emailInput}
              value={password}
              onChangeText={setPassword}
              placeholder='Create your password'
              secureTextEntry={true}
            />
          </View>

          <ThemeButton
            text="Sign up →"
            onPress={handleContinue}
            style={{ width: '100%', marginTop: 20 }}
          />

          <View style={styles.orLine}>
            <View style={[styles.line, { width: width * 0.35 }]} />
            <CustomText weight='medium' style={[styles.text, { fontSize: 16 }]}>Or</CustomText>
            <View style={[styles.line, { width: width * 0.35 }]} />
          </View>

          <TouchableWithoutFeedback>
            <View style={[styles.outlineBtn, { paddingVertical: height * 0.02 }]}>
              <View style={styles.iconContainer}>
                <Igoogle width={width * 0.06} height={width * 0.06} />
              </View>
              <CustomText weight='bold'
                style={[
                  styles.continueTxt,
                  {
                    fontSize: width * 0.03,
                    fontFamily: 'Montserrat-Medium',
                    fontWeight: '500',
                    color: '#000',
                  },
                ]}
              >
                Continue with Google
              </CustomText>
            </View>
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback>
            <View
              style={[
                styles.outlineBtn,
                {
                  paddingVertical: height * 0.02,
                  backgroundColor: '#000000',
                  marginBottom: 10,
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
                    color: '#fff',
                  },
                ]}
              >
                Continue with Apple
              </CustomText>
            </View>
          </TouchableWithoutFeedback>

          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <CustomText weight='medium'>Already have an account ? </CustomText>
            <TouchableWithoutFeedback onPress={() => navigation.navigate('Login')}>
              <View>
                <CustomText
                  weight="bold"
                  style={[styles.continueTxt, { fontWeight: '500', color: '#111a94' }]}>
                  Log in
                </CustomText>
              </View>
            </TouchableWithoutFeedback>
          </View>

          {/* <CustomText weight='medium' style={[styles.description, { position: 'absolute', bottom: 20, textAlign: 'center', fontSize: 14 }]}>
            By continuing I accept Selfso's Terms of Use and
            <TouchableWithoutFeedback onPress={() => setShowPrivacyModal(true)}>
              <CustomText
                weight='medium'
                style={[
                  styles.continueTxt,
                  {
                    fontWeight: '600',
                    textDecorationLine: 'underline',
                    color: '#000',
                  },
                ]}
              >
                {' '}Privacy Policy
              </CustomText>
            </TouchableWithoutFeedback> */}

          {/* </CustomText> */}
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
  safeArea: {
    flex: 1,
    backgroundColor: "#fff"
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  description: {
    fontSize: rs(14),
    color: '#646464',
    textAlign: 'center',
    width: '100%',
    marginTop: rvs(10),
  },
  input: {
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: rs(16),
    paddingHorizontal: rs(20),
    paddingVertical: rs(18),
    fontSize: rs(16),
  },
  outlineBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: rs(12),
    width: '100%',
    marginTop: rvs(20),
    position: 'relative',
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
  line: {
    height: 1,
    backgroundColor: '#ccc',
    width: width * 0.35,
  },
  text: {
    marginHorizontal: rs(10),
    color: '#000',
    fontSize: rs(16),
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
});

export default Signup;
