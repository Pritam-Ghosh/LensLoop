import React, { useState, useCallback, useEffect, useContext, useRef } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Platform, Animated, TextInput, TouchableWithoutFeedback, Text, Pressable } from 'react-native';
import { RefreshControl } from 'react-native';
import { Sparkles, Users, FileImage, Clock5, ImagePlus, MoveRight, Plus, FolderOpen, CalendarDays, Search, EllipsisVertical, Share2, Lock, LockKeyhole, Heart, ChevronRight, Grid, Play, Repeat, User } from 'lucide-react-native';
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
  const [tab, setTab] = useState("grid");
  const activeColor = "#000000";
  const inactiveColor = "#999";
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
  const fetchHives = useCallback(async () => {
    try {
      setHivesLoading(true);

      const stored = await AsyncStorage.getItem("HIVES");
      const localHives = stored ? JSON.parse(stored) : [];

      setHives(localHives);
      setEvents(localHives);

    } catch (err) {
      console.error("Local fetch error:", err);
    } finally {
      setHivesLoading(false);
    }
  }, []);

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
  const publicHives = filteredHives.filter(
    hive => hive.privacyMode === "public"
  );

  const inviteHives = filteredHives.filter(
    hive => hive.privacyMode === "invite"
  );

  return (


    <>

      <BackgroundUI>

        <TopNav />

        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>


          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: 20,
              marginTop: 10,
            }}
          >

            <CustomText weight="bold" style={{ fontSize: 24, color: "#2F3E46", }}>Dashboard</CustomText>

            <View
              style={{ width: 70, height: 70, borderRadius: 50, overflow: "hidden", borderWidth: 0, borderColor: "#EAF7EE", }}>
              <Image source={profile} style={{ width: "100%", height: "100%", }} />
            </View>
          </View>
          <View style={{}}>
            {/* Dashboard Cards */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', marginTop: height * 0.01, paddingHorizontal: width * 0.05 }}  >
              {/* Hives Card */}
              <View style={styles.dashCard}>
                <View style={{ alignItems: 'center' }}>

                  <CustomText
                    weight="bold"
                    style={[styles.cardText,]}
                  >
                    {events.length}
                  </CustomText>

                  <CustomText weight="medium" style={styles.dashText}  >Post </CustomText>

                </View>
              </View>



              {/* Photos Card */}
              <View style={styles.dashCard}>
                <View style={{ alignItems: 'center' }}>

                  <CustomText
                    weight="bold"
                    style={[styles.cardText,]}
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
                    style={[styles.cardText,]}
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


            <View style={{ marginTop: 20, paddingHorizontal: width * 0.05 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-around", alignItems: "center" }}>
                <Pressable onPress={() => setTab("grid")} style={{ flex: 1, alignItems: "center", paddingVertical: 10 }}>
                  <Grid size={22} color={tab === "grid" ? activeColor : inactiveColor} />
                </Pressable>
                <Pressable onPress={() => setTab("profile")} style={{ flex: 1, alignItems: "center", paddingVertical: 10 }}>
                  <User size={22} color={tab === "profile" ? activeColor : inactiveColor} />
                </Pressable>
              </View>
              <View style={{ flexDirection: "row", height: 2 }}>
                <View style={{ flex: 1, backgroundColor: tab === "grid" ? activeColor : "transparent" }} />
                <View style={{ flex: 1, backgroundColor: tab === "profile" ? activeColor : "transparent" }} />
              </View>
            </View>


            <View style={{ paddingBottom: 100 }}>
              {tab === "grid" && (
                <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 16 }}>

                  {hivesLoading ? (
                    [1, 2, 3, 4, 5, 6].map((item) => (
                      <View key={item} style={{ width: "33.33%", aspectRatio: 1, padding: 1 }}>
                        <View style={{ flex: 1, backgroundColor: "#E5E7EB" }} />
                      </View>
                    ))
                  ) : publicHives.length > 0 ? (

                    publicHives.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        style={{ width: "33.33%", aspectRatio: 1, padding: 1 }}
                        onPress={() =>
                          navigation.navigate("FolderLayout", {
                            image: { uri: item.coverImage },
                            folderName: item.hiveName,
                            hiveId: item._id,
                          })
                        }
                      >
                        <Image
                          source={{ uri: item.coverImage }}
                          style={{ width: "100%", height: "100%" }}
                        />
                      </TouchableOpacity>
                    ))

                  ) : (
                    <View style={{ width: "100%", alignItems: "center", marginTop: 60 }}>
                      <CustomText>No Public Posts</CustomText>
                    </View>
                  )}

                </View>
              )}

              {/* PROFILE TAB (INVITE ONLY) */}
              {tab === "profile" && (
                <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 16 }}>

                  {inviteHives.length > 0 ? (

                    inviteHives.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        style={{ width: "33.33%", aspectRatio: 1, padding: 1 }}
                        onPress={() =>
                          navigation.navigate("FolderLayout", {
                            image: { uri: item.coverImage },
                            folderName: item.hiveName,
                            hiveId: item._id,
                            
                          })
                        }
                      >
                        <Image
                          source={{ uri: item.coverImage }}
                          style={{ width: "100%", height: "100%" }}
                        />



                      </TouchableOpacity>
                    ))

                  ) : (
                    <View style={{ width: "100%", alignItems: "center", marginTop: 60 }}>
                      <CustomText>No Private Posts</CustomText>
                    </View>
                  )}

                </View>
              )}

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
    backgroundColor: "#F3F2F7",
    paddingVertical: height * 0.01,
    paddingHorizontal: width * 0.02,

    borderRadius: 8,

    alignItems: 'center',
    justifyContent: 'center',



    borderWidth: 1,
    borderColor: '#ffffff',


  },
  dashText: {
    color: colors.black,
    fontSize: 12,
  },
  icon: {
    width: width * 0.12,
    height: width * 0.12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardText: {
    fontSize: width * 0.06,
    fontWeight: '600',
    color: colors.black,
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

  eventImage: {
    width: '100%',
    height: 140,
    resizeMode: 'cover',

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
    // paddingHorizontal: 24,
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
    fontSize: 9,
  },

  overlayMembers: {
    color: "#ddd",
    fontSize: 12,
  },
  cardWrapper: {
    width: "100%",
  },

  eventCard: {
    backgroundColor: '#fff',
    overflow: 'hidden', // Safe here now
  },

});

export default Home;