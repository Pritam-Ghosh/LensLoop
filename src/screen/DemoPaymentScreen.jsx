// import React from "react";
// import {
//     View,
//     Text,
//     StyleSheet,
//     TouchableOpacity,
//     SafeAreaView,
// } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// const DemoPaymentScreen = ({ navigation }) => {
//     return (
//         <SafeAreaView style={styles.container}>
//             <View style={styles.card}>
//                 <Text style={styles.title}>Demo Payment Screen</Text>
//                 <TouchableOpacity
//                     style={[styles.button, styles.doneButton]}
//                     onPress={async () => {
//                         await AsyncStorage.setItem("isPremium", "true");

//                         alert("Premium Activated 🎉");

//                         navigation.goBack();
//                     }}
//                 >

//                     <Text style={styles.buttonText}>Payment Done</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                     style={[styles.button, styles.backButton]}
//                     onPress={async () => {
//                         await AsyncStorage.setItem("isPremium", "false");
//                         alert("Unsubscribed");
//                         navigation.goBack();
//                     }}
//                 >
//                     <Text style={styles.buttonText}>unsubscribe</Text>
//                 </TouchableOpacity>

//                 <TouchableOpacity
//                     style={[styles.button, styles.backButton]}
//                     onPress={() => navigation.goBack()}
//                 >
//                     <Text style={styles.buttonText}>back</Text>
//                 </TouchableOpacity>
//             </View>
//         </SafeAreaView>
//     );
// };

// export default DemoPaymentScreen;

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: "#f2f2f2",
//         justifyContent: "center",
//         alignItems: "center",
//     },

//     card: {
//         width: "85%",
//         backgroundColor: "#fff",
//         borderRadius: 12,
//         padding: 24,
//         elevation: 4,
//     },

//     title: {
//         fontSize: 20,
//         fontWeight: "600",
//         textAlign: "center",
//         marginBottom: 30,
//     },

//     button: {
//         height: 48,
//         borderRadius: 8,
//         justifyContent: "center",
//         alignItems: "center",
//         marginBottom: 15,
//     },

//     doneButton: {
//         backgroundColor: "#4CAF50",
//     },

//     backButton: {
//         backgroundColor: "#444",
//     },

//     buttonText: {
//         color: "#fff",
//         fontSize: 16,
//         fontWeight: "500",
//     },
// });



import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { color, colors } from '../Theme/theme';
import { CardField, useStripe } from '@stripe/stripe-react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Logo from '../components/Logo';

const DemoPaymentScreen = ({ navigation }) => {
  const { confirmPayment } = useStripe();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    try {
      setLoading(true);
      // 🔥 Call your backend to create PaymentIntent
      const response = await fetch('https://your-backend.com/create-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const { clientSecret } = await response.json();

      const { error, paymentIntent } = await confirmPayment(clientSecret, {
        paymentMethodType: 'Card',
      });

      if (error) {
        Alert.alert('Payment Failed', error.message);
      } else if (paymentIntent) {
        Alert.alert('Success 🎉', 'Premium Unlocked!');
      }
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <SafeAreaProvider style={styles.safeArea}>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.logoWrapper}>
            <Logo width={150} height={80} />
          </View>
          <Text style={styles.secure}>Secure Payment</Text>

          {/* <Text style={styles.logo}>SnapHive</Text>
          <Text style={styles.secure}>Secure Payment</Text> */}

          <View style={styles.cardBox}>
            <Text style={styles.title}>SnapHive Premium</Text>
            <Text style={styles.price}>$9.99 USD / month</Text>

            <Text style={styles.label}>Card Details</Text>
            <CardField
              postalCodeEnabled={false}
              placeholder={{ number: '1234 1234 1234 1234' }}
              cardStyle={{
                backgroundColor: '#F5F5F5',
                textColor: '#000000',

              }}
              style={styles.cardField}
            />

            <Text style={styles.trial}>
              1-week free trial, then $9.99 USD / month
            </Text>

            <TouchableOpacity
              style={styles.subscribeBtn}
              onPress={handleSubscribe}
              disabled={loading}
            >
              <Text style={styles.subscribeText}>
                {loading ? 'Processing...' : 'Subscribe'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.doneButton]}
              onPress={async () => {
                await AsyncStorage.setItem("isPremium", "true");
                alert("Premium Activated 🎉");
                navigation.goBack();
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "600" }}>Payment Done</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.backButton]}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.buttonText}>back</Text>
            </TouchableOpacity>

            <Text style={styles.powered}>Powered by Stripe</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}
const styles = StyleSheet.create({



  logoWrapper: {
    alignItems: "center",
    marginBottom: 4,
  },

  button: {
    height: 48,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },

  doneButton: {
    marginTop: 10,
    backgroundColor: "#4CAF50",
  },

  container: {
    flexGrow: 1,
    backgroundColor: '#F8F8F8',
    padding: 20,
    justifyContent: 'center',
  },
  logo: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#E44C93',
  },
  secure: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#777',
  },
  cardBox: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,

  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: colors.primary

  },
  price: {
    fontSize: 18,
    marginBottom: 20,
    color: '#555',
  },
  label: {
    marginBottom: 5,
    color: '#555',
  },
  cardField: {
    width: '100%',
    height: 50,
    marginBottom: 15,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
  },
  trial: {
    fontSize: 13,
    color: '#777',
    marginBottom: 20,
  },
  subscribeBtn: {
    backgroundColor: '#E44C93',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
  },
  subscribeText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 16,
  },
  powered: {
    textAlign: 'center',
    marginTop: 15,
    color: '#999',
    fontSize: 12,
  },
});

export default DemoPaymentScreen