import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  useWindowDimensions,
  Alert,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// components
import CustomText from '../components/CustomText';
import ThemeButton from '../components/ThemeButton';
import Logo from '../components/Logo';

// svg
import Igoogle from "../../assets/Igoogle.svg";

const Signup = ({ navigation }) => {
  const [userID, setUserID] = useState('');
  const [password, setPassword] = useState('');
  const { width, height } = useWindowDimensions();


  const isValidEmail = (text) => /\S+@\S+\.\S+/.test(text);
  const isValidPhone = (text) => /^[0-9]{10,15}$/.test(text);

  const handleContinue = () => {
    if (!userID.trim()) {
      Alert.alert("Create account guide", "Please enter your email or phone number");
      return;
    }

    if (!isValidEmail(userID) && !isValidPhone(userID)) {
      Alert.alert("Create account guide", "Please enter a valid email or phone number");
      return;
    }

    if (!password.trim()) {
      Alert.alert("Create account guide", "Please create a password");
      return;
    }
    navigation.navigate('OTP');
  };

  return (
    <SafeAreaProvider style={[styles.container, { padding: width * 0.05 }]}>

      <Logo />

      {/* Description */}
      <Text style={[styles.description, { fontSize: width * 0.04, paddingInline: 32 }]} onPress={() => navigation.navigate("Home")}>
        Automatically share photos taken by members of your group
      </Text>

      {/* Email or Phone Field */}
      <View style={{ width: '100%', marginTop: 36 }}>

        <TextInput
          style={[
            styles.input,
            {
              fontSize: width * 0.04,
              paddingVertical: height * 0.018,
            },
          ]}
          value={userID}
          onChangeText={setUserID}
          placeholder='Enter your email or phone number'
          keyboardType='email-address'
          autoCapitalize='none'
        />
      </View>

      {/* Password Field */}
      <View style={{ width: '100%', marginTop: 16 }}>
        <TextInput
          style={[
            styles.input,
            {
              fontSize: width * 0.04,
              paddingVertical: height * 0.018,
            },
          ]}
          value={password}
          onChangeText={setPassword}
          placeholder='Create your password'
          secureTextEntry={true}
        />
      </View>

      {/* Continue Button */}
      <ThemeButton
        text="Continue →"
        onPress={handleContinue}
        style={{ width: '100%', marginTop: 20 }}
      />

      {/* OR line */}
      <View style={styles.orLine}>
        <View style={[styles.line, { width: width * 0.35 }]} />
        <Text style={[styles.text, { fontSize: width * 0.04 }]}>Or</Text>
        <View style={[styles.line, { width: width * 0.35 }]} />
      </View>

      {/* Continue with Google */}
      <TouchableWithoutFeedback>
        <View style={[styles.outlineBtn, { paddingVertical: height * 0.02 }]}>
          <View style={styles.iconContainer}>
            <Igoogle width={width * 0.06} height={width * 0.06} />
          </View>
          <Text
            style={[
              styles.continueTxt,
              {
                fontSize: width * 0.04,
                fontFamily: 'Montserrat-Medium',
                fontWeight: '500',
                color: '#000',
              },
            ]}
          >
            Continue with Google
          </Text>
        </View>
      </TouchableWithoutFeedback>

      {/* Already a user */}
      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
        <CustomText style={{ fontSize: width * 0.04 }}>All ready have an account ? </CustomText>
        <TouchableWithoutFeedback onPress={() => navigation.navigate('Login')}>
          <View>
            <CustomText
              weight="bold"
              style={[styles.continueTxt, { fontWeight: '500', fontSize: width * 0.04 }]}
            >
              Log in
            </CustomText>
          </View>
        </TouchableWithoutFeedback>
      </View>

      {/* Terms & Privacy */}
      <CustomText style={[styles.description, { fontSize: width * 0.035 ,position:'fixed', top:100}]} onPress={() => navigation.navigate('MyTabs')}>
        By continuing I accept Selfso's Terms of Use and
        <TouchableWithoutFeedback>
          <CustomText
          weight='medium'
            style={[
              styles.continueTxt,
              {
                fontWeight: '600',
                textDecorationLine: 'underline',
                color: '#000',
                fontSize: width * 0.035,
              },
            ]}
          >
            {' '}Privacy Policy
          </CustomText>
        </TouchableWithoutFeedback>
      </CustomText>

    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  description: {
    color: '#646464',
    textAlign: 'center',
    width: '100%',

  },
  input: {
    width: '100%',
    borderColor: '#F0F5F5',
    backgroundColor: '#F0F5F5',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    textAlign: 'center',
  },
  outlineBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 12,
    width: '100%',
    marginVertical: 21,
    position: 'relative',
  },
  iconContainer: {
    position: 'absolute',
    left: 22,
  },
  orLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  line: {
    height: 1,
    backgroundColor: '#ccc',
  },
  text: {
    marginHorizontal: 10,
    color: '#000',
  },
});

export default Signup;
