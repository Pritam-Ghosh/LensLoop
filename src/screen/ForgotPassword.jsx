import React, { useState } from 'react';
import { View, StyleSheet, TextInput, TouchableWithoutFeedback, SafeAreaView, Pressable, ScrollView, } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from 'react-native-toast-message';
import { ChevronLeft } from 'lucide-react-native';

// component
import Logo from '../components/Logo';
import ThemeButton from '../components/ThemeButton';
import CustomText from '../components/CustomText';
import PrivacyPolicyModal from '../components/PrivacyPolicyModal';

const Login = ({ navigation }) => {
  const [userID, setUserID] = useState('');
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const handleSendOTP = async () => {
    if (!userID.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Missing Email',
        text2: 'Please enter your registered email',
      });
      return;
    }

    try {
      // 🔥 fake delay like API
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 🔥 generate fake OTP
      const fakeOTP = "1234";

      // 💾 store locally
      await AsyncStorage.setItem("RESET_EMAIL", userID);
      await AsyncStorage.setItem("RESET_OTP", fakeOTP);

      Toast.show({
        type: 'success',
        text1: 'OTP Sent',
        text2: 'Use 1234 as OTP',
        visibilityTime: 2000,
      });

      navigation.navigate("NewPassword", { email: userID });

    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Something went wrong',
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



          <View style={styles.backButton}>
            <TouchableWithoutFeedback onPress={() => navigation.goBack()} style={{ alignSelf: 'flex-start', marginBottom: 20 }}>
              <ChevronLeft width={30} height={30} />
            </TouchableWithoutFeedback>
          </View>

          <Logo />
          <CustomText weight='medium' style={styles.description}>
            Reset your password to regain access to your account
          </CustomText>

          <TextInput
            style={styles.emailInput}
            value={userID}
            onChangeText={setUserID}
            placeholder='Enter your email'
            keyboardType='email-address'
            autoCapitalize='none'
          />

          <ThemeButton
            text="Get OTP →"
            style={{ width: "100%", marginTop: 20 }}
            onPress={handleSendOTP}
          />


          <Pressable
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
  description: { paddingInline: 32, fontSize: 16, color: '#646464', textAlign: 'center', width: '100%' },
  emailInput: {
    marginTop: 36,
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
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
  },
});

export default Login;
