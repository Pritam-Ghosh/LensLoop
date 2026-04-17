import React, { useState } from 'react';
import { View, StyleSheet, TextInput, TouchableWithoutFeedback, } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Logo from '../components/Logo';
import ThemeButton from '../components/ThemeButton';
import CustomText from '../components/CustomText';
import { resetpassword } from '../API/API';
import { resendOtp } from '../API/API';
import Toast from 'react-native-toast-message';
import { ChevronLeft } from 'lucide-react-native';

const NewPassword = ({ navigation, route }) => {
  const { email } = route.params;
  const [OTP, setOTP] = useState('');
  const [password, setPassword] = useState('');

  const handleResetPassword = async () => {
    if (!OTP.trim()) {
      Toast.show({
        type: 'error',
        text1: 'OTP Required',
        text2: 'Please enter the OTP sent to your email',
      });
      return;
    }

    if (!password.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Password Required',
        text2: 'Please enter a new password',
      });
      return;
    }

    try {
      const { data } = await resetpassword({
        email,
        otp: OTP,
        newPassword: password,
      });

      Toast.show({
        type: 'success',
        text1: 'Password Reset',
        text2: data.message || 'Password reset successfully',
      });

      // 👇 Let toast show, then navigate
      setTimeout(() => {
        navigation.navigate('Login');
      }, 1000);

    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Reset Failed',
        text2: err.response?.data?.message || 'Something went wrong',
      });
    }
  };


  return (
    <SafeAreaProvider style={styles.container}>

      <View style={styles.backButton}>
        <TouchableWithoutFeedback onPress={() => navigation.goBack()} style={{ alignSelf: 'flex-start', marginBottom: 20 }}>
          <ChevronLeft width={30} height={30} />
        </TouchableWithoutFeedback>
      </View>
      <Logo />

      <TextInput
        style={styles.emailInput}
        value={OTP}
        onChangeText={setOTP}
        placeholder='Enter OTP sent to your email'
        keyboardType='number-pad'
        autoCapitalize='none'
      />

      <View style={{ width: '97%', marginTop: 10 }}>
        <TouchableWithoutFeedback
          onPress={async () => {
            try {
              const { data } = await resendOtp({ email });

              Toast.show({
                type: 'success',
                text1: 'OTP Resent',
                text2: data.message || 'Check your email',
              });

            } catch (err) {
              Toast.show({
                type: 'error',
                text1: 'Failed',
                text2: err.response?.data?.message || 'Failed to resend OTP',
              });
            }
          }}
        >

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <CustomText weight='medium' style={{ color: '#5e5e5e' }}>
              Didn't get a code?
            </CustomText>
            <CustomText weight='medium' style={{ color: '#111a94', marginLeft: 4 }}>
              Resend
            </CustomText>
          </View>
        </TouchableWithoutFeedback>
      </View>



      <TextInput
        style={styles.emailInput}
        value={password}
        onChangeText={setPassword}
        placeholder='Enter new password'
        secureTextEntry={true}
        autoCapitalize='none'
      />

      <ThemeButton
        text="Reset Password →"
        style={{ width: "100%", marginTop: 20 }}
        onPress={handleResetPassword}
      />

      <CustomText
        weight='medium'
        style={[styles.description, { position: 'absolute', bottom: 20, textAlign: 'center', fontSize: 14 }]}
      >
        By continuing I accept Selfso's Terms of Use and
        <TouchableWithoutFeedback>
          <CustomText
            weight='medium'
            style={[styles.continueTxt, { fontWeight: '600', textDecorationLine: "underline", color: "#000" }]}
          >
            {" "}Privacy Policy
          </CustomText>
        </TouchableWithoutFeedback>
      </CustomText>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "#fff", padding: 20 },
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
  description: { fontSize: 16, color: '#646464', textAlign: 'center', width: '100%' },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
  },
});

export default NewPassword;
