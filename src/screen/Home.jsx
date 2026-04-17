import React, { useState, useCallback, useEffect, useContext, useRef } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Platform, Animated, TextInput, TouchableWithoutFeedback, Text } from 'react-native';
import { RefreshControl } from 'react-native';
import { Sparkles, Users, FileImage, Clock5, ImagePlus, MoveRight, Plus, FolderOpen, CalendarDays, Search, EllipsisVertical, Share2, Lock, LockKeyhole, Heart, ChevronRight } from 'lucide-react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { EventContext } from '../context/EventContext';
import { colors } from '../Theme/theme';
import Icon from "react-native-remix-icon";
// components
import TopNav from '../components/TopNavbar';
import CustomText from '../components/CustomText';
import BackgroundUI from '../components/BackgroundUI';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import { useTranslation } from 'react-i18next';
import { useFocusEffect } from '@react-navigation/native';
import AutoSyncModal from '../components/AutoSyncModal';
import { checkForNewCameraPhotos } from '../utils/photoDetector';
import { ImageResizer } from "react-native-image-resizer";
import RNRestart from 'react-native-restart';
import { debugIOSPhotos } from '../utils/iosPhotoDebugger';
import ThemeButton from '../components/ThemeButton';
import LinearGradient from 'react-native-linear-gradient';


//AutoSync Dependencies
const safeGetItem = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value;
  } catch (error) {
    console.error(`Error reading ${key}:`, error);
    return null;
  }
};

const safeSetItem = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.error(`Error writing ${key}:`, error);
    return false;
  }
};

const safeRemoveItem = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing ${key}:`, error);
    return false;
  }
};


// assets
const hero = require('../../assets/hero.png');
const profile = require('../../assets/profile.jpg');
const AUTO_SYNC_HANDLED_DATES_KEY = "AUTO_SYNC_HANDLED_DATES";
const AUTO_SYNC_SKIPPED_DATES_KEY = "AUTO_SYNC_SKIPPED_DATES"; // Add this line

const createbtn = require('../../assets/createbtn.png');

const { width, height } = Dimensions.get('window');

const Home = ({ navigation, route }) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [refreshing, setRefreshing] = useState(false);
  const [showImportBanner, setShowImportBanner] = useState(true);
  const { events, setEvents } = useContext(EventContext);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState(null);
  const { hives, setHives } = useContext(EventContext);
  const { t, i18n } = useTranslation();
  const [showAutoSyncModal, setShowAutoSyncModal] = useState(false);
  const [hivesLoading, setHivesLoading] = useState(true);
  const [newPhotosData, setNewPhotosData] = useState({
    count: 0,
    photos: [],
    previewImage: null,
    dateString: null, // Add this
  });

  // Start background transition animation
  useFocusEffect(
    useCallback(() => {
      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }).start();
    }, [fadeAnim])
  );

  // Format date → DD/MM/YYYY
  const formatDisplayDate = (date) => {
    if (!date) return 'N/A';
    const dateObj = date instanceof Date ? date : new Date(date);

    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = monthNames[dateObj.getMonth()];
    const year = String(dateObj.getFullYear()).slice(-2);

    return `${month} ${day}`;
  };

  // Format time → HH:MM AM/PM
  const formatTimeRemaining = (endTime, expiryDate) => {
    if (!expiryDate) return 'N/A';

    try {
      const now = new Date();
      const expiryDateTime = new Date(expiryDate);

      if (endTime) {
        const timeStr = endTime.toLowerCase();
        const [time, period] = timeStr.split(' ');
        const [hours, minutes] = time.split(':').map(Number);

        let hour24 = hours;
        if (period === 'pm' && hours !== 12) {
          hour24 = hours + 12;
        } else if (period === 'am' && hours === 12) {
          hour24 = 0;
        }

        expiryDateTime.setHours(hour24, minutes, 0, 0);
      } else {
        expiryDateTime.setHours(23, 59, 59, 999);
      }

      const timeDiff = expiryDateTime - now;

      if (timeDiff <= 0) {
        return 'Expired';
      }

      const hoursLeft = Math.floor(timeDiff / (1000 * 60 * 60));
      const daysLeft = Math.floor(hoursLeft / 24);
      const remainingHours = hoursLeft % 24;
      const minutesLeft = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

      if (daysLeft > 0) {
        if (remainingHours > 0) {
          return `${daysLeft}d ${remainingHours}h `;
        }
        return `${daysLeft}d `;
      } else if (hoursLeft > 0) {
        if (minutesLeft > 0) {
          return `${hoursLeft}h ${minutesLeft}m `;
        }
        return `${hoursLeft}h `;
      } else {
        return `${minutesLeft}m `;
      }
    } catch (error) {
      return 'N/A';
    }
  };

  const removeExpiredEvents = useCallback(() => {
    const now = new Date();

    setHives(prevHives =>
      prevHives.filter(hive => {
        if (!hive.isTemporary) return true;
        if (!hive.expiryDate) return true;

        const expiryDate = new Date(hive.expiryDate);

        if (hive.endTime) {
          const timeStr = hive.endTime.toLowerCase();
          const [time, period] = timeStr.split(' ');
          const [hours, minutes] = time.split(':').map(Number);

          let hour24 = hours;
          if (period === 'pm' && hours !== 12) {
            hour24 = hours + 12;
          } else if (period === 'am' && hours === 12) {
            hour24 = 0;
          }

          expiryDate.setHours(hour24, minutes, 0, 0);
        } else {
          expiryDate.setHours(23, 59, 59, 999);
        }

        const hasExpired = expiryDate < now;

        if (hasExpired) {
          console.log(`Removing expired hive: ${hive.hiveName}, expired at: ${expiryDate.toISOString()}`);
        }

        return !hasExpired;
      })
    );

    setEvents(prevEvents =>
      prevEvents.filter(event => {
        if (!event.isTemporary) return true;
        if (!event.expiryDate) return true;

        const expiryDate = new Date(event.expiryDate);

        if (event.endTime) {
          const timeStr = event.endTime.toLowerCase();
          const [time, period] = timeStr.split(' ');
          const [hours, minutes] = time.split(':').map(Number);

          let hour24 = hours;
          if (period === 'pm' && hours !== 12) {
            hour24 = hours + 12;
          } else if (period === 'am' && hours === 12) {
            hour24 = 0;
          }

          expiryDate.setHours(hour24, minutes, 0, 0);
        } else {
          expiryDate.setHours(23, 59, 59, 999);
        }

        return expiryDate >= now;
      })
    );
  }, [setHives, setEvents]);



  const clearSkippedDatesIfNeeded = async (latestDate) => {
    try {
      const skippedDatesJson = await safeGetItem(AUTO_SYNC_SKIPPED_DATES_KEY);
      const skippedDates = skippedDatesJson ? JSON.parse(skippedDatesJson) : [];

      if (skippedDates.length > 0) {
        const latestSkippedDate = skippedDates.sort().reverse()[0];

        if (latestDate > latestSkippedDate) {
          await safeRemoveItem(AUTO_SYNC_SKIPPED_DATES_KEY);
          console.log('🔄 Cleared skipped dates - new photos detected');
        }
      }
    } catch (error) {
      console.error('❌ Error clearing skipped dates:', error);
    }
  };




  // Check for new camera photos on mount and focus
  // Check for new camera photos on mount and focus
  // Replace the useFocusEffect hook that checks for photos in your Home.jsx
  // This updated version tracks photo URIs instead of just dates

  useFocusEffect(
    useCallback(() => {
      const checkPhotos = async () => {
        try {
          console.log('🔍 Checking for new photos on iOS...');

          // Add a small delay on iOS to ensure app is fully focused
          if (Platform.OS === 'ios') {
            await new Promise(resolve => setTimeout(resolve, 300));
          }

          const result = await checkForNewCameraPhotos();

          console.log('📊 Result:', {
            hasNewPhotos: result.hasNewPhotos,
            count: result.photoCount,
            photosLength: result.photos.length,
            latestDate: result.latestDate
          });

          if (result.hasNewPhotos && result.photoCount > 0 && result.latestDate) {
            await clearSkippedDatesIfNeeded(result.latestDate);

            // iOS-safe AsyncStorage read
            const handledPhotosJson = await safeGetItem('AUTO_SYNC_HANDLED_PHOTOS');
            const handledPhotoUris = handledPhotosJson ? JSON.parse(handledPhotosJson) : [];

            const skippedDatesJson = await safeGetItem(AUTO_SYNC_SKIPPED_DATES_KEY);
            const skippedDates = skippedDatesJson ? JSON.parse(skippedDatesJson) : [];

            console.log('📸 Already handled photo count:', handledPhotoUris.length);
            console.log('📅 Already skipped dates:', skippedDates);

            const availableDates = Object.keys(result.photosByDate).sort().reverse();
            console.log('📅 Available dates:', availableDates);

            let dateToShow = null;
            let unhandledPhotos = [];

            for (const date of availableDates) {
              if (skippedDates.includes(date)) {
                console.log(`⏭️ Skipping date ${date} - user skipped it`);
                continue;
              }

              const datePhotos = result.photosByDate[date] || [];
              const newPhotos = datePhotos.filter(photo => !handledPhotoUris.includes(photo.uri));

              if (newPhotos.length > 0) {
                dateToShow = date;
                unhandledPhotos = newPhotos;
                console.log(`✅ Found ${newPhotos.length} new photos for date ${date}`);
                break;
              } else {
                console.log(`ℹ️ All photos for ${date} have been handled`);
              }
            }

            console.log('📅 Date to show modal for:', dateToShow);

            if (!dateToShow || unhandledPhotos.length === 0) {
              console.log('ℹ️ All photos have been handled or skipped');
              return;
            }

            const previewUri = unhandledPhotos[0]?.uri;
            setNewPhotosData({
              count: unhandledPhotos.length,
              photos: unhandledPhotos,
              previewImage: previewUri || null,
              dateString: dateToShow,
            });

            // iOS needs slightly longer delay for modal animation
            const modalDelay = Platform.OS === 'ios' ? 800 : 500;
            setTimeout(() => {
              setShowAutoSyncModal(true);
            }, modalDelay);
          } else {
            console.log('ℹ️ No new photos found');
          }
        } catch (error) {
          console.error('❌ Error checking photos:', error);
          console.error('Error stack:', error.stack);
        }
      };

      checkPhotos();
    }, [])
  );




  const compressPhoto = async (photo) => {
    try {
      const resized = await ImageResizer.createResizedImage(
        photo.uri,
        1600,     // max width
        1600,     // max height
        "JPEG",
        80        // quality (KEY)
      );

      return {
        ...photo,
        uri: resized.uri,
        type: "image/jpeg",
        fileName: photo.fileName || "auto_sync.jpg",
      };
    } catch (err) {
      console.log("❌ Compression failed, using original:", err);
      return photo; // fallback
    }
  };

  useEffect(() => {
    removeExpiredEvents();
    const interval = setInterval(removeExpiredEvents, 30 * 1000);
    return () => clearInterval(interval);
  }, [removeExpiredEvents]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
          console.log("Loaded user:", JSON.parse(storedUser));
        }
      } catch (error) {
        console.log("Error loading user:", error);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (route?.params?.newEvent) {
      const { name, photos } = route.params.newEvent;

      const newEvent = {
        img: { uri: uploadedImage },
        title: hiveName,
        description: hiveDescription || 'No description',
        count: '0 Photos',
        photos: [],
        createdAt: new Date().toISOString(),
      };

      setEvents(prevEvents => [newEventObj, ...prevEvents]);
      navigation.setParams({ newEvent: null });
    }
  }, [route?.params?.newEvent]);

  // Fetch hives function
  // Fetch hives function
  const fetchHives = useCallback(async () => {
    try {
      setHivesLoading(true); // ✅ ADD THIS LINE
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        console.log("No auth token found. Please login first.");
        setHivesLoading(false); // ✅ ADD THIS LINE
        return;
      }

      const res = await axios.get(
        "https://snaphive-node.vercel.app/api/hives",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setHives(res.data.hives);
      setEvents(res.data.hives);
      console.log("User Hives:", res.data.hives);

    } catch (err) {
      console.error("Error loading hives:", err.response?.data || err);
    } finally {
      setHivesLoading(false); // ✅ ADD THIS LINE
    }
  }, [setHives, setEvents]);

  // Fetch hives on mount
  useEffect(() => {
    fetchHives();
  }, [fetchHives]);

  // Refresh handler
  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true);

      // Re-fetch only Home screen data
      await fetchHives();
      removeExpiredEvents();

    } catch (error) {
      console.error('Refresh error:', error);
    } finally {
      setRefreshing(false);
    }
  }, [fetchHives, removeExpiredEvents]);



  const handleLater = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: width,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => setShowImportBanner(false));
  };

  const filteredHives = hives
    ? hives.filter(hive =>
      hive.hiveName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hive.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : [];

  return (


    <>

      <BackgroundUI>

        <TopNav />

        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >




          {/* <View style={[styles.searchContainer, { marginHorizontal: width * 0.05 }]}>
            <TextInput
              style={styles.searchInput}
              placeholder={t('search')}
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <Search color="#6B7280" size={20} style={styles.searchIcon} />
          </View> */}

          {/* Background Transition Section */}
          {/* Background Banner Section */}
          <View style={styles.ImportSection}>



            {/* Content */}
            <View style={styles.bannerContent}>
              {/* Welcome Badge */}
              <View style={styles.welcomeBadge}>
                {/* <Sparkles color="#DA3C84" size={18} /> */}
                {/* <CustomText weight="medium" style={styles.importHeading}>
                  {t('welcome')}
                </CustomText>

                <CustomText weight="bold" style={styles.importHeading}>
                  {user ? user.name : t('loading')}!
                </CustomText> */}
              </View>

              {/* Title */}
              <CustomText
                weight="bold"
                style={styles.importSub}
              >
                {t('captureYourMoments')}
              </CustomText>

              {/* Subtitle */}
              <CustomText
                weight="medium"
                style={styles.importSubLine}
              >
                {t('letMemoriesFlow')}
              </CustomText>

              {/* <TouchableOpacity
                style={styles.importBtnWrapper}
                onPress={() => navigation.navigate('CreateHive')}
              >
                <LinearGradient
                  colors={['#F35C8E', '#F7A97A']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.importBtnWhite}
                >
                  <Plus color="#ffffff" size={20} />
                  <Text
         
   
                    style={{ color: '#fff', fontWeight: '600', fontSize: 18 }}
                  >
                    Create Hive
                  </Text>
                </LinearGradient>
              </TouchableOpacity> */}
<TouchableOpacity
           
                onPress={() => navigation.navigate('CreateHive')}>
              <View style={{width:"100%"}}>
                <Image source={createbtn} style={{ maxWidth: "100%" }} resizeMode="contain" />
              </View>
</TouchableOpacity>

            </View>

          </View>

          <View style={{ paddingHorizontal: width * 0.05 }}>
            {/* Dashboard Cards */}

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                marginTop: height * 0.01,
              }}
            >

              {/* Hives Card */}
              <View style={styles.dashCard}>
                <View style={{ alignItems: 'center' }}>

                  <CustomText
                    weight="bold"
                    style={[styles.cardText, { color: '#F97316' }]}
                  >
                    {events.length}
                  </CustomText>

                  <CustomText
                    weight="medium"
                    style={styles.dashText}
                  >
                    Hive
                  </CustomText>

                </View>
              </View>



              {/* Photos Card */}
              <View style={styles.dashCard}>
                <View style={{ alignItems: 'center' }}>

                  <CustomText
                    weight="bold"
                    style={[styles.cardText, { color: '#EC4899' }]}
                  >
                    {events.reduce((total, event) => {
                      const imageCount =
                        event.images?.length ||
                        event.photos?.length ||
                        0;
                      return total + imageCount;
                    }, 0)}
                  </CustomText>

                  <CustomText
                    weight="medium"
                    style={styles.dashText}
                  >
                    {t('photos')}
                  </CustomText>

                </View>
              </View>



              {/* Members Card */}
              <View style={styles.dashCard}>
                <View style={{ alignItems: 'center' }}>

                  <CustomText
                    weight="bold"
                    style={[styles.cardText, { color: '#7C3AED' }]}
                  >
                    {hives.reduce(
                      (total, hive) =>
                        total + (hive.members?.length || 0),
                      0
                    )}
                  </CustomText>

                  <CustomText
                    weight="medium"
                    style={styles.dashText}
                  >
                    {t('members')}
                  </CustomText>

                </View>
              </View>

            </View>
            <View style={{ paddingBottom: 100 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginTop: 20 }}>
                <View style={styles.eventHeader}>
                  <CustomText weight="medium" style={styles.eventSection}>
                    {t('yourHives')}
                  </CustomText>
                  <CustomText weight="medium" style={{ color: colors.textGray, marginTop: 4 }}>
                    {t('managePhotoCollections')}
                  </CustomText>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
                  <CustomText weight="medium" style={{ fontSize: 14 }}>
                    All
                  </CustomText>
                  <ChevronRight size={16} />

                </View>
              </View>



              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                  marginTop: 16,
                }}
              >
                {hivesLoading ? (
                  // ✅ LOADING STATE - Show 4 skeleton cards
                  <>
                    {[1, 2, 3, 4].map((item) => (
                      <View key={item} style={[styles.eventCard, { width: "48%" }]}>
                        <View style={[styles.eventImage, { backgroundColor: '#E5E7EB' }]} />
                        <View style={styles.eventInfo}>
                          <View style={{ backgroundColor: '#E5E7EB', height: 16, borderRadius: 4, marginBottom: 12, width: '70%' }} />
                        </View>
                      </View>
                    ))}
                  </>
                ) : filteredHives.length > 0 ? (
                  filteredHives.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      style={{ width: "48%" }}
                      onPress={() =>
                        navigation.navigate("FolderLayout", {
                          image: { uri: item.coverImage },
                          folderName: item.hiveName,
                          date: item.createdAt,
                          hiveId: item._id,
                          owner: item.user?.name,
                          photos: item.images || [],
                          eventTitle: item.hiveName,
                          eventDescription: item.description,
                          eventEndTime: item.endTime,
                          eventExpiryDate: item.expiryDate,
                          membersCount: item.members?.length || 0,
                        })
                      }
                    >
                      {/* Shadow Wrapper */}
                      <View style={styles.cardWrapper}>

                        {/* Actual Card */}
                        <View style={styles.eventCard}>

                          <Image
                            source={{ uri: item.coverImage }}
                            style={styles.eventImage}
                          />

                          {/* LOCK ICON */}
                          <View
                            style={{
                              position: "absolute",
                              right: 12,
                              top: 12,
                              padding: 6,
                              borderRadius: 20,
                            }}
                          >
                            <Icon
                              name="lock-fill"
                              size={22}
                              color="#fff"
                              fallback={null}
                            />
                          </View>

                          {/* BOTTOM GRADIENT */}
                          <LinearGradient
                            colors={["transparent", "rgba(0,0,0,0.9)"]}
                            style={styles.overlay}
                          >
                            <View style={{ flex: 1 }}>
                              <CustomText
                                weight="bold"
                                style={styles.overlayTitle}
                              >
                                {item.hiveName.length > 12
                                  ? item.hiveName.substring(0, 12) + "..."
                                  : item.hiveName}
                              </CustomText>

                              <View
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                  gap: 4
                                }}
                              >
                                <Heart
                                  fill={"#fff"}
                                  color={"#fff"}
                                  size={15}
                                />

                                <CustomText style={styles.overlayMembers}>
                                  {item.members?.length || 0}
                                </CustomText>
                              </View>
                            </View>
                          </LinearGradient>

                        </View>

                      </View>
                    </TouchableOpacity>
                  ))
                ) : (
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 10,
                      marginTop: 60,
                      marginBottom: 80,
                      width: '100%',
                    }}
                  >
                    <View
                      style={{
                        width: 60,
                        height: 60,
                        backgroundColor: '#f7a0c7ff',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 50,
                      }}
                    >
                      <ImagePlus color="#ffffff" size={28} />
                    </View>

                    <CustomText weight="medium" style={{ color: '#6B7280' }}>
                      {searchQuery ? t('noHivesFound') : t('noHivesYet')}
                    </CustomText>

                    {!searchQuery && (
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <CustomText
                          weight="bold"
                          style={{ color: '#DA3C84' }}
                          onPress={() => navigation.navigate('CreateHive')}
                        >
                          {t('createYourFirstHive')}
                        </CustomText>
                        <MoveRight color="#DA3C84" />
                      </View>
                    )}
                  </View>
                )}
              </View>
            </View>
          </View>
        </ScrollView>
      </BackgroundUI>


      <AutoSyncModal
        visible={showAutoSyncModal}
        photoCount={newPhotosData.count}
        previewImage={newPhotosData.previewImage}
        photos={newPhotosData.photos}
        hives={filteredHives}
        onCreate={async () => {
          setShowAutoSyncModal(false);

          // 🔥 COMPRESS PHOTOS HERE (CRITICAL)
          const compressedPhotos = [];

          for (const photo of newPhotosData.photos) {
            const compressed = await compressPhoto(photo);
            compressedPhotos.push(compressed);
          }

          console.log(
            "📦 AutoSync photos compressed:",
            compressedPhotos.map(p => p.uri)
          );

          // ✅ STORE COMPRESSED PHOTOS ONLY
          await AsyncStorage.setItem(
            "AUTO_SYNC_PHOTOS",
            JSON.stringify(compressedPhotos)
          );

          navigation.navigate("CreateHive");
        }}
        onSkip={async () => {
          console.log('⏭️ Skip clicked');

          // Save the photo URIs as handled (so they won't show again)
          try {
            const handledPhotosJson = await AsyncStorage.getItem('AUTO_SYNC_HANDLED_PHOTOS');
            const handledPhotoUris = handledPhotosJson ? JSON.parse(handledPhotosJson) : [];

            const skippedPhotoUris = newPhotosData.photos.map(photo => photo.uri);
            const updatedHandledUris = [...handledPhotoUris, ...skippedPhotoUris];

            await AsyncStorage.setItem(
              'AUTO_SYNC_HANDLED_PHOTOS',
              JSON.stringify(updatedHandledUris)
            );

            console.log('✅ Marked photos as skipped (added to handled):', skippedPhotoUris.length);
          } catch (error) {
            console.error('❌ Error saving skipped photos:', error);
          }

          setShowAutoSyncModal(false);

          // Immediately check for next available photos
          setTimeout(async () => {
            try {
              console.log('🔄 Checking for next photos...');
              const result = await checkForNewCameraPhotos();

              if (result.hasNewPhotos && result.photoCount > 0) {
                const handledPhotosJson = await AsyncStorage.getItem('AUTO_SYNC_HANDLED_PHOTOS');
                const handledPhotoUris = handledPhotosJson ? JSON.parse(handledPhotosJson) : [];

                const skippedDatesJson = await AsyncStorage.getItem(AUTO_SYNC_SKIPPED_DATES_KEY);
                const skippedDates = skippedDatesJson ? JSON.parse(skippedDatesJson) : [];

                const availableDates = Object.keys(result.photosByDate).sort().reverse();

                let nextDateToShow = null;
                let unhandledPhotos = [];

                for (const date of availableDates) {
                  if (skippedDates.includes(date)) {
                    continue;
                  }

                  const datePhotos = result.photosByDate[date] || [];
                  const newPhotos = datePhotos.filter(photo => !handledPhotoUris.includes(photo.uri));

                  if (newPhotos.length > 0) {
                    nextDateToShow = date;
                    unhandledPhotos = newPhotos;
                    break;
                  }
                }

                console.log('📅 Next date to show:', nextDateToShow);

                if (nextDateToShow && unhandledPhotos.length > 0) {
                  const previewUri = unhandledPhotos[0]?.uri;

                  setNewPhotosData({
                    count: unhandledPhotos.length,
                    photos: unhandledPhotos,
                    previewImage: previewUri || null,
                    dateString: nextDateToShow,
                  });

                  setTimeout(() => {
                    setShowAutoSyncModal(true);
                  }, 300);
                } else {
                  console.log('ℹ️ No more unhandled photos to show');
                }
              }
            } catch (error) {
              console.error('❌ Error checking next photos:', error);
            }
          }, 500);
        }}
      />



    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

  },
  heroSection: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: height * 0.02,
    gap: height * 0.02,
  },
  heroImg: {
    width: width * 0.9,
    height: height * 0.28,
    resizeMode: 'contain',
  },
  HeroHeading: {
    fontSize: width * 0.06,
    fontWeight: '600',
    color: '#fff',
    position: 'absolute',
    top: height * 0.05,
  },
  HeroSubText: {
    fontSize: width * 0.035,
    fontWeight: '500',
    color: '#fff',
    position: 'absolute',
    top: height * 0.11,
    textAlign: 'center',
    paddingHorizontal: width * 0.15,
  },
  importBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: width * 0.025,
    position: 'absolute',
    top: height * 0.18,
    backgroundColor: '#FDD32E',
    paddingVertical: height * 0.012,
    paddingHorizontal: width * 0.08,
    borderRadius: 6,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 3,
        shadowOffset: { width: 0, height: 2 },
      },
      android: {
        elevation: 3,
      },
    }),
  },
  continueTxt: {
    fontSize: width * 0.04,
    color: '#000',
    fontWeight: '600',
  },
  ImportSection: {


    // height: height * 0.28,

    overflow: 'hidden',

    justifyContent: 'center',


  },

  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },

  bannerContent: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: width * 0.06,
  },

  welcomeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: "flex-start",
    gap: 6,

    backgroundColor: 'rgba(243, 92, 142, 0.1)',
    borderRadius: 25,

    paddingHorizontal: 16,
    paddingVertical: 6,
  },

  importHeading: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },

  importSub: {
    marginTop: 10,
    fontSize: 22,
    color: '#ffffff',
    textAlign: 'center',
  },

  importSubLine: {
    marginTop: 6,
    fontSize: 14,
    color: '#ffffff',
    textAlign: 'center',
  },

  importBtnWhite: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    gap: 8,

    backgroundColor: '#FFFFFF',

    paddingVertical: 12,
    paddingHorizontal: 30,

    borderRadius: 14,

    marginTop: 14,

    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 3,
        shadowOffset: { width: 0, height: 1 },
      },
      android: {
        elevation: 2,
      },
    }),
  },
  cameraIcon: {
    width: width * 0.13,
    height: width * 0.13,
    borderRadius: (width * 0.13) / 2,
    backgroundColor: '#FFE891',
    justifyContent: 'center',
    alignItems: 'center',
  },
  importHeading: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 4,
    lineHeight: 20,
  },
  importSub: {
    marginTop: 10,
    fontSize: 28,
    color: colors.primary,
  },
  importSubLine: {
    marginTop: 10,
    fontSize: 14,
    color: '#000',
  },
  importBtnWhite: {
    width: "100%",
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: width * 0.025,
    borderWidth: 13,
    borderColor: '#ffffffd2',
    // 👇 semi-transparent background
    backgroundColor: 'rgba(243, 92, 142, 0.5)',
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.1,
    borderRadius: 50,
    marginVertical: 10,
    // ⭐ Cross-platform shadow
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.10,
        shadowRadius: 10,
        shadowOffset: {
          width: 0,
          height: 5,
        },
      },
      android: {
        elevation: 3,
      },
    }),

  },
  laterBtn: {
    alignItems: 'center',
    backgroundColor: '#000',
    paddingVertical: height * 0.015,
    borderRadius: 6,
    marginVertical: 10,
  },

  dashCard: {
    width: "30%",
    backgroundColor: "#ffffff59",
    paddingVertical: height * 0.01,
    paddingHorizontal: width * 0.03,

    borderRadius: 18,

    alignItems: 'center',
    justifyContent: 'center',



    borderWidth: 1,
    borderColor: '#ffffff',


  },
  dashText: {
    color: '#6B7280',
    fontSize: 15,
  },
  icon: {
    width: width * 0.12,
    height: width * 0.12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardText: {
    fontSize: width * 0.07,
    fontWeight: '600',
    color: '#000',
    lineHeight: 35,
  },
  newEvent: {
    fontSize: 14,
    fontWeight: '600',
    color: '#feaa00',
  },
  eventSection: {
    fontSize: 20,
    fontWeight: '800',
  },

  eventRow: {
    marginTop: 16,
    width: '100%',
    height: 280,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 1,
  },
  cardImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  eventRowInformation: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#ffffffff',
    width: '100%',
    padding: 16,
  },
  eventCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    // overflow: 'hidden',
    // padding: 12,
    marginBottom: 16,
    shadowColor: '#7a7979',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.20,
    shadowRadius: 6,
    elevation: 6,
  },
  eventImage: {
    width: '100%',
    height: 140,
    resizeMode: 'cover',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
  },
  eventInfo: {
    paddingTop: 14,
    paddingBottom: 14,
    paddingLeft: 14,
    paddingRight: 14,
    backgroundColor: '#fff',
  },
  eventTitle: {
    fontSize: 16,
    color: '#000',
    marginBottom: 12,
  },
  eventTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  eventTimeText: {
    fontSize: 12,
    color: '#6B7280',
    paddingBottom: 0,
    marginBottom: 0,
  },
  eventDescription: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 12,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    height: 28,
  },
  memberAvatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    overflow: 'hidden',
    zIndex: 2,
  },
  memberDP: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  memberBadge: {
    position: 'absolute',
    left: 16,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#F98935',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3,
  },
  memberCount: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 25,
    paddingHorizontal: 24,
    paddingVertical: 18,
    marginTop: 16,
    marginBottom: 8,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    padding: 0,
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
  },

  overlayTitle: {
    color: "#fff",
    fontSize: 16,
  },

  overlayMembers: {
    color: "#ddd",
    fontSize: 12,
  },
  cardWrapper: {
    width: "100%",
    marginBottom: 16,
    borderRadius: 12,

    // iOS Shadow
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.18,
    shadowRadius: 6,

    // Android Shadow
    elevation: 6,
  },

  eventCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden', // Safe here now
  },

});

export default Home;