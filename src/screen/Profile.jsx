import React, { useContext, useEffect, useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  Dimensions
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { launchImageLibrary } from "react-native-image-picker";
import {
  ChevronRight, Crown, Languages, LogOut, Share2,
  QrCode,
  MessageCircle,
  Heart,
  PencilLine,
  FolderOpen,
  FileImage,
  Users,
} from "lucide-react-native";
import { Linking } from "react-native";
import { Share } from "react-native";
import { useLoader } from "../context/LoaderContext";
import { useTranslation } from 'react-i18next';
// Components
import ScreenLayout from "../components/ScreenLayout";
import CustomText from "../components/CustomText";
import PremiumModal from "../components/PremiumModal";
import Toast from 'react-native-toast-message';
import { EventContext } from "../context/EventContext";
const { width, height } = Dimensions.get('window');
import { colors } from '../Theme/theme';
// Images
const beforeImage = require("../../assets/selfie.jpg");
const afterImage = require("../../assets/dp3.jpg");
const createEvent = require("../../assets/background.png");
const profilePic = require("../../assets/profile.jpg");

const Profile = ({ navigation, }) => {
  const { t, i18n } = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);
  const { showLoader, hideLoader } = useLoader();
  const { events, setEvents } = useContext(EventContext);
  const { hives, setHives } = useContext(EventContext);
  const [hivesLoading, setHivesLoading] = useState(true);
  const openStore = () => {
    const playStoreUrl = "https://play.google.com/store/apps/details?id=com.snaphive";
    const appStoreUrl = "https://apps.apple.com/app/id1234567890";

    const url = Platform.OS === "ios" ? appStoreUrl : playStoreUrl;

    Linking.openURL(url).catch(() => {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Unable to open the store',
      });
    });
  };

  const [user, setUser] = useState(null);

  useEffect(() => {
    (async () => {
      const data = await AsyncStorage.getItem("user");
      if (data) {
        setUser(JSON.parse(data));
      }
    })();
  }, []);

  const shareApp = async () => {
    try {
      const message =
        "Try the snaphive app! Download now:\n\n" +
        "Android: https://play.google.com/store/apps/details?id=com.snaphive\n" +
        "iOS: https://apps.apple.com/app/id1234567890";

      await Share.share({ message });
    } catch (error) {
      console.log("Share Error:", error);
    }
  };


  const handleLogout = async () => {
    try {
      showLoader();

      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");

      Toast.show({
        type: 'success',
        text1: 'Logged Out',
        text2: 'See you again 👋',
      });

      setTimeout(() => {
        navigation.replace("Login");
      }, 500);

    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Logout Failed',
        text2: 'Please try again',
      });
      console.error("Logout error:", err);
    } finally {
      hideLoader();
    }
  };




  return (
    <ScreenLayout
      navigation={navigation}
      image={createEvent}
      folderName={user?.name || t('userName')}
      date={user?.email || t('noEmail')}
      // RightIcon={
      //   <TouchableOpacity onPress={() => navigation.navigate("EditProfile")}>
      //     <View style={{ padding: 10, borderRadius: 50, backgroundColor: "rgba(255,255,255,0.3)", }}>
      //       <PencilLine width={16} height={16} />
      //     </View>
      //   </TouchableOpacity>
      // }

      OverlayContent={
        <View style={styles.profileOverlay}>
          <Image
            source={
              user?.profileImage
                ? { uri: user.profileImage }
                : require("../../assets/profile.jpg")
            }
            style={styles.profileImage}
          />
          <View>
            <CustomText weight="medium" style={styles.profileName}>
              {user?.name || t('userName')}
            </CustomText>

            <CustomText weight="medium" style={styles.profileNumber}>
              {user?.email || t('noEmail')}
            </CustomText>
          </View>
        </View>
      }
    >
      <View style={{
        backgroundColor: "#FBF3F9", paddingVertical: 12,
      }}>



        <TouchableOpacity
          style={{
            backgroundColor: "#F3F3F6",
            paddingVertical: 8,
            paddingHorizontal: 60,
            borderRadius: 30,
            alignSelf: "center",
            marginTop: -30,
            borderWidth: 1,
            borderColor: '#fff',
            backgroundColor: 'rgba(243, 92, 142, 0.5)',
            elevation: 5,
            shadowColor: "#d6d6d6",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 6,
          }}
          onPress={() => navigation.navigate("EditProfile")}
        >
          <View style={{ alignItems: "center" }}>
            <CustomText weight="semiBold" style={{ fontSize: 16, color: "#ffffff" }}>
              Edit Profile
            </CustomText>
          </View>
        </TouchableOpacity>

      </View>




      {/* <View style={{ paddingHorizontal: width * 0.09, backgroundColor: '#FDF4F9' }}>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            marginTop: height * 0.01,
            marginTop: 20
          }}
        >
          <View>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',

              }}
            >
              <CustomText
                weight="bold"
                style={[styles.cardText, { textAlign: 'center' }]}
              >
                {events.length}
              </CustomText>

              <CustomText
                weight="medium"
                style={[styles.dashText, { textAlign: 'center' }]}
              >
                {t('totalHives')}
              </CustomText>
            </View>

          </View>
          <View style={{ height: 50, width: 1, backgroundColor: '#7e7e7e52' }} />
          <View >
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CustomText
                weight="bold"
                style={[styles.cardText, { textAlign: 'center' }]}
              >
                {events.reduce((total, event) => {
                  const imageCount = event.images?.length || event.photos?.length || 0;
                  return total + imageCount;
                }, 0)}
              </CustomText>

              <CustomText
                weight="medium"
                style={[styles.dashText, { textAlign: 'center' }]}
              >
                {t('photos')}
              </CustomText>
            </View>
          </View>
          <View style={{ height: 50, width: 1, backgroundColor: '#7e7e7e52' }} />
          <View >
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <CustomText
                weight="bold"
                style={[styles.cardText, { textAlign: 'center' }]}
              >
                {hives.reduce((total, hive) => total + (hive.members?.length || 0), 0)}
              </CustomText>

              <CustomText
                weight="medium"
                style={[styles.dashText, { textAlign: 'center' }]}
              >
                {t('members')}
              </CustomText>
            </View>
          </View>
        </View>


      </View> */}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >


        <View style={{
          paddingHorizontal: 20,
          backgroundColor: '#fff',
          marginTop: 20,
          borderRadius: 12,

          // Android shadow
          elevation: 5,

          // iOS shadow
          shadowColor: "#0000004d",
          shadowOffset: {
            width: 0,
            height: 3,
          },
          shadowOpacity: 0.25,
          shadowRadius: 4,
        }}>


          <TouchableOpacity
            style={styles.rowProfile}
            onPress={() => navigation.navigate('Language')}
          >
            <View style={styles.iconBox}>
              <Languages size={20} color="#F98935" />
            </View>
            <View style={styles.textBox}>
              <CustomText weight="medium" style={styles.title}>
                {t('language')}
              </CustomText>
              {/* <CustomText weight="medium" style={styles.subtitle}>
         {t('english')}
            </CustomText> */}
            </View>
            <ChevronRight color="#B0B0B0" size={18} />
          </TouchableOpacity>



          <TouchableOpacity
            style={styles.rowProfile}
            onPress={() => setModalVisible(true)}
          >
            <View style={styles.iconBox}>
              <Crown size={20} color="#F98935" />
            </View>
            <View style={styles.textBox}>
              <CustomText weight="medium" style={styles.title}>
                {t('premium')}
              </CustomText>

            </View>
            <ChevronRight color="#B0B0B0" size={18} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.rowProfile}
            onPress={() => navigation.navigate('ContactUs')}
          >
            <View style={styles.iconBox}>
              <MessageCircle size={20} color="#F98935" />
            </View>
            <View style={styles.textBox}>
              <CustomText weight="medium" style={styles.title}>
                {t('contactUs')}
              </CustomText>

            </View>
            <ChevronRight color="#B0B0B0" size={18} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.rowProfile}
            onPress={openStore}
          >
            <View style={styles.iconBox}>
              <Heart size={20} color="#F98935" />
            </View>
            <View style={styles.textBox}>
              <CustomText weight="medium" style={styles.title}>
                {t('giveUsFeedback')}
              </CustomText>

            </View>
            <ChevronRight color="#B0B0B0" size={18} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.rowProfile}
            onPress={shareApp}
          >
            <View style={styles.iconBox}>
              <Share2 size={20} color="#F98935" />
            </View>
            <View style={styles.textBox}>
              <CustomText weight="medium" style={styles.title}>
                {t('shareTheApp')}
              </CustomText>

            </View>
            <ChevronRight color="#B0B0B0" size={18} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.rowProfile, { borderBottomWidth: 0 }]}
            onPress={handleLogout}
          >
            <View style={[styles.iconBox, { backgroundColor: "#ffe2e2ff" }]}>
              <LogOut size={20} color="#ff1f1fff" />
            </View>
            <View style={styles.textBox}>
              <CustomText weight="medium" style={styles.title}>
                {t('logout')}
              </CustomText>
            </View>
          </TouchableOpacity>

        </View>

        <PremiumModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          beforeImage={beforeImage}
          afterImage={afterImage}
        />
      </ScrollView>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  scrollContainer: { paddingHorizontal: 20, paddingBottom: 220, elevation: 5, backgroundColor: '#FAF2F8', },
  category: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    marginBottom: 12,
    marginTop: 0,
    textTransform: "uppercase",
  },
  rowProfile: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 15,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  textBox: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1C1C1C",
  },
  profileOverlay: {
    alignItems: "center",
    marginBottom: 12,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  profileName: {
    textAlign: "center",
    color: colors.primary,
    fontSize: 20,
  },
  profileNumber: {
    color: colors.primary,
    fontSize: 14,
  },

  category: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F98935',
    marginTop: 25,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  rowProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F2',
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFF3E6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textBox: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    color: '#111',
  },
  subtitle: {
    fontSize: 13,
    color: '#777',
    marginTop: 2,
  },
  logoutButton: {
    marginTop: 40,
    marginBottom: 60,
    width: '60%',
    alignSelf: 'center',
  },
  dashCard: {
    flexDirection: 'row',
    alignItem: 'center',
    justifyContent: 'center',
    width: "30%",
    padding: width * 0.045,
    backgroundColor: '#fff',
    borderRadius: 12,
    alignItems: 'center',
    marginTop: height * 0.02,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 4 },
      },
      android: {
        elevation: 3,
      },
    }),
  },

  cardText: {
    color: '#2b2b2b',
    fontSize: 24
  },
  dashText: {
    color: '#5c5c5c',
    fontSize: 14
  }
});

export default Profile;