import React, { useState, useEffect, useRef } from "react";

import Clipboard from "@react-native-clipboard/clipboard";
import { View, TextInput, StyleSheet, Text, TouchableOpacity, Image, ScrollView, Dimensions, KeyboardAvoidingView } from "react-native";
import QR from "../../assets/svg/qr.svg";
import Pencil from "../../assets/svg/pencil.svg";
import People from "../../assets/svg/people.svg";
import Download from "../../assets/svg/download.svg";
import Mail from "../../assets/svg/mail.svg";
import ThemeButton from "../components/ThemeButton";
import CustomText from "../components/CustomText";
import ScreenLayout from "../components/ScreenLayout";
import { Check, CopyIcon, Link, MailCheck, QrCode, QrCodeIcon, Share2, Smartphone, Users } from "lucide-react-native";
import QRCodeModal from "../components/QRCodeModal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLoader } from "../context/LoaderContext";
import Toast from 'react-native-toast-message';
import QRCode from "react-native-qrcode-svg";
import Share from "react-native-share";
import { colors } from "../Theme/theme";


const { width, height } = Dimensions.get("window");

const flag1 = require("../../assets/flag1.png");
const flag2 = require("../../assets/flag2.png");
const flag3 = require("../../assets/flag3.png");
const flag4 = require("../../assets/flag4.png");

const createEvent = require("../../assets/background.png");

const InviteMember = ({ navigation, route }) => {
  const { showLoader, hideLoader } = useLoader();

  const hiveId = route.params?.hiveId;
  console.log("Hive ID in InviteMember:", hiveId);

  const [modalVisible, setModalVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [copied, setCopied] = useState(false);
  const [triggerInvite, setTriggerInvite] = useState(false);
  const [phone, setPhone] = useState("");
const inviteLink = `snaphive://hive/${hiveId}`;


  const scrollRef = useRef(null);
  const phoneInputRef = useRef(null);



  const copyInviteLink = () => {
    Clipboard.setString(inviteLink);

    Toast.show({
      type: "success",
      text1: "Link Copied",
      text2: "Invite link copied to clipboard",
    });
  };

  const shareQR = async () => {
    try {
      await Share.open({
        message: inviteLink,
      });
    } catch (err) { }
  };


  // -------------------------------
  // USE EFFECT FOR INVITATION API
  // -------------------------------
  // useEffect(() => {
  //   if (!triggerInvite) return;

  //   const inviteMember = async () => {
  //     showLoader();

  //     try {
  //       const token = await AsyncStorage.getItem("token");

  //       if (!token) {
  //         Toast.show({
  //           type: 'error',
  //           text1: 'Session Expired',
  //           text2: 'Please log in again',
  //         });
  //         return;
  //       }

  //       const response = await axios.post(
  //         `https://snaphive-node.vercel.app/api/hives/${hiveId}/invite`,
  //         {
  //           email: email || null,
  //           phone: phone ? `+91${phone}` : null
  //         },
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //         }
  //       );

  //       Toast.show({
  //         type: 'success',
  //         text1: 'Invitation Sent',
  //         text2: 'Member invited successfully',
  //       });

  //       setEmail("");
  //       setPhone("");

  //     } catch (error) {
  //       Toast.show({
  //         type: 'error',
  //         text1: 'Invite Failed',
  //         text2: error.response?.data?.message || 'Failed to send invitation',
  //       });
  //     } finally {
  //       hideLoader();
  //       setTriggerInvite(false);
  //     }
  //   };

  //   inviteMember();
  // }, [triggerInvite]);



const sendInvite = async () => {
  if (!email && !phone) {
    Toast.show({
      type: "error",
      text1: "Input Required",
      text2: "Please enter email or phone number",
    });
    return;
  }

  if (email && phone) {
    Toast.show({
      type: "error",
      text1: "Choose one method",
      text2: "Enter either email or phone",
    });
    return;
  }

  try {
    showLoader();

    // 🔥 simulate delay (like API)
    await new Promise(resolve => setTimeout(resolve, 1000));

    Toast.show({
      type: "success",
      text1: "Invitation Sent",
      text2: "Invite simulated successfully 🎉",
    });

    setEmail("");
    setPhone("");

  } catch (error) {
    Toast.show({
      type: "error",
      text1: "Invite Failed",
      text2: "Something went wrong",
    });
  } finally {
    hideLoader();
  }
};

  return (


    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >


      <ScreenLayout
        navigation={navigation}
        image={createEvent}
        folderName="Janifer Danis"
        date="+91 1841 510 1450"
        OverlayContent={
          <View style={styles.profileOverlay}>
            <View>
              <CustomText weight="bold" style={{ fontSize: 24, color: colors.primary, textAlign: "center" }}>
                Invite Member
              </CustomText>
              <CustomText
                weight="medium"
                style={{ fontSize: 14, color: colors.primary, textAlign: "center", opacity: 0.9, marginTop: 6 }}
              >
                Share this hive with friends
              </CustomText>
            </View>
          </View>
        }
      >


        <ScrollView
          style={{ paddingHorizontal: 24, paddingTop: 30, paddingBottom: 100 }}
          keyboardShouldPersistTaps="handled"
        >

          {/* Info Card */}
          <View style={styles.infoCard}>
            <View style={styles.infoIconWrapper}>
              <Share2 color="#DA3C84" size={20} />
            </View>
            <CustomText weight="medium" style={styles.infoText}>
              Invite members to collaborate and share photos in this hive
            </CustomText>
          </View>

          {/* Email Input */}
          <View style={{ backgroundColor: '#fff', elevation: 5, paddingHorizontal: 18, paddingVertical: 16, borderRadius: 16, marginBottom: 20 }}>
            <View>
              <CustomText weight="bold" style={styles.emailLabel}>
                Invite via email
              </CustomText>

              <View style={styles.inputWrapper}>
                <MailCheck width={20} height={20} color="#9CA3AF" />
                <TextInput
                  style={styles.inviteMember}
                  placeholder="example@gmail.com"
                  placeholderTextColor="#9CA3AF"
                  value={email}
                  onChangeText={setEmail}
                  onFocus={() => {
                    setTimeout(() => {
                      scrollRef.current?.scrollTo({ y: 100, animated: true });
                    }, 300);
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Button */}
            <View style={styles.buttonRow}>
              <ThemeButton text="Send Invitation" onPress={sendInvite} style={{ width: "100%", margin: 0 }} />
            </View>
          </View>

          {/* OR */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 15
            }}
          >
            <View
              style={{
                flex: 1,
                height: 1,
                backgroundColor: "#D1D5DB",
              }}
            />


            <CustomText
              style={{
                marginHorizontal: 10,
                color: "#9CA3AF",
                fontWeight: "600",
                letterSpacing: 2,
              }}
            >
              OR
            </CustomText>


            <View
              style={{
                flex: 1,
                height: 1,
                backgroundColor: "#D1D5DB",
              }}
            />
          </View>


          <View style={{ backgroundColor: '#fff', elevation: 5, paddingHorizontal: 18, paddingVertical: 16, borderRadius: 16, marginBottom: 20 }}>
            <View>
              <CustomText weight="bold" style={styles.emailLabel}>
                Invite via Phone Number
              </CustomText>

              <View style={styles.inputWrapper}>
                <Smartphone width={20} height={20} color="#9CA3AF" />

                <TextInput
                  style={styles.inviteMember}
                  placeholder="Enter phone number"
                  placeholderTextColor="#9CA3AF"
                  value={phone}
                  onChangeText={(text) => {
                    const cleaned = text.replace(/[^0-9]/g, "");
                    setPhone(cleaned);
                  }}
                  onFocus={() => {
                    setTimeout(() => {
                      scrollRef.current?.scrollToEnd({ animated: true });
                    }, 300);
                  }}
                  keyboardType="phone-pad"
                  maxLength={10}
                />

              </View>
            </View>

            {/* Button */}
            <View style={styles.buttonRow}>
              <ThemeButton
                text="Send Invitation"
                onPress={sendInvite}
                style={{ width: "100%", margin: 0 }}
              />
            </View>

          </View>


          {/* OR */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 15
            }}
          >
            <View
              style={{
                flex: 1,
                height: 1,
                backgroundColor: "#D1D5DB",
              }}
            />


            <CustomText
              style={{
                marginHorizontal: 10,
                color: "#9CA3AF",
                fontWeight: "600",
                letterSpacing: 2,
              }}
            >
              Join via QR Code
            </CustomText>


            <View
              style={{
                flex: 1,
                height: 1,
                backgroundColor: "#D1D5DB",
              }}
            />
          </View>


          <View
            style={{
              backgroundColor: "#fff",
              elevation: 5,
              paddingHorizontal: 18,
              paddingVertical: 16,
              borderRadius: 16,
              marginBottom: 30,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              {/* Left Section */}
              <View style={{ flex: 1 }}>
                <CustomText weight="bold" style={{ fontSize: 16, marginBottom: 10 }}>
                  Join via QR Code
                </CustomText>

                <TouchableOpacity
                  onPress={shareQR}
                  style={{
                    backgroundColor: "#F3F4F6",
                    paddingVertical: 10,
                    paddingHorizontal: 16,
                    borderRadius: 30,
                    marginBottom: 10,
                    borderWidth: 1,
                    borderColor: '#9c9c9c9d',

                  }}
                >
                  <CustomText style={{ color: "#374151", textAlign: 'center' }}>
                    Share QR Code
                  </CustomText>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={copyInviteLink}
                  style={{
                    backgroundColor: "#F3F4F6",
                    paddingVertical: 10,
                    paddingHorizontal: 16,
                    borderRadius: 30,
                    borderWidth: 1,
                    borderColor: '#9c9c9c9d',
                  }}
                >
                  <CustomText style={{ color: "#374151", textAlign: 'center' }}>
                    Copy Invite Link
                  </CustomText>
                </TouchableOpacity>
              </View>

              {/* Right Section */}
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  marginLeft: 10,
                }}
              >
                <QRCode
                  value={inviteLink}
                  size={150}
                />
              </View>
            </View>
          </View>




        </ScrollView>




        <QRCodeModal visible={modalVisible} onClose={() => setModalVisible(false)} />
      </ScreenLayout>
    </KeyboardAvoidingView>
  );
};




const styles = StyleSheet.create({
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 120,

  },

  profileOverlay: {
    position: 'absolute',
    top: -100,
    alignItems: "center",
  },

  headerIconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },

  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#FFE5EE',
  },

  infoIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 20,
  },

  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    justifyContent: "space-between",
  },

  sectionTitle: {
    fontSize: 18,
    color: '#000',
    marginBottom: 4,
  },

  sectionSubtitle: {
    fontSize: 13,
    color: '#9CA3AF',
  },

  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFF5F8',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFE5EE',
  },

  copyButtonActive: {
    backgroundColor: '#F0FDF4',
    borderColor: '#D1FAE5',
  },

  copyButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#DA3C84',
  },

  codeBox: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#E5E7EB',
  },

  codeText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#da3c84',
    letterSpacing: 4,
  },

  quickShareSection: {
    marginBottom: 24,
  },

  quickShareTitle: {
    fontSize: 16,
    color: '#000',
    marginBottom: 12,
  },

  quickShareButtons: {
    flexDirection: 'row',
    gap: 12,
  },

  shareButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },

  shareIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFF5F8',
    alignItems: 'center',
    justifyContent: 'center',
  },

  shareButtonText: {
    fontSize: 14,
    color: '#1F2937',
  },

  buttonRow: {
    flexDirection: "row",
    gap: 30,
    alignItems: "center",
    justifyContent: "center",

  },

  orLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  line: {
    height: 1,
    backgroundColor: '#E5E7EB',
    flex: 1,
  },

  orText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: '#6B7280',
  },


  emailLabel: {
    fontSize: 15,
    color: '#000',
    marginBottom: 12,
  },

  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    gap: 12,
  },

  inviteMember: {
    flex: 1,
    color: "#000",
    paddingVertical: 14,
    fontSize: 15,
  }
});


export default InviteMember;