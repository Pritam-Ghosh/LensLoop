import { View, Text, ScrollView, StyleSheet, Dimensions, Animated, Image, TouchableWithoutFeedback, Modal, TextInput, RefreshControl } from 'react-native'
import React, { useCallback, useState, useEffect } from 'react'

//component
import TopNav from '../components/TopNavbar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Bookmark, Ellipsis, Heart, LayoutDashboard, MessageCircle, Plus, Search, SendHorizontal, SendHorizontalIcon, Sparkles } from 'lucide-react-native';
import CustomText from '../components/CustomText';
import StatItem from '../components/StatItem';

import { colors } from '../Theme/theme';
import { useContext } from "react";
import { EventContext } from "../context/EventContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AutoSyncModal from '../components/AutoSyncModal';
import { checkForNewCameraPhotos } from '../utils/photoDetector';

import { ImageResizer } from "react-native-image-resizer";
import BackgroungUI from '../components/BackgroundUI';
import { t } from 'i18next';

const { width, height } = Dimensions.get('window');
const selfie = require("../../assets/selfie.jpg");
const dp3 = require("../../assets/dp3.jpg");
const dp4 = require("../../assets/dp4.jpg");
const dp5 = require("../../assets/dp5.jpg");
const dp7 = require("../../assets/dp7.jpg");
const dp6 = require("../../assets/dp6.jpg");

const wp = (percentage) => (width * percentage) / 100;
const hp = (percentage) => (height * percentage) / 100;
const MainScreen = ({ navigation }) => {
  const [userId, setUserId] = useState(null);
  const [showAutoSyncModal, setShowAutoSyncModal] = useState(false);
  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        setUserId(parsed._id || parsed.id);
      }
    };
    loadUser();
  }, []);

  const { publicHives, fetchPublicHives, setPublicHives } = useContext(EventContext);
  const [selectedHive, setSelectedHive] = useState(null);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [commentVisible, setCommentVisible] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [newPhotosData, setNewPhotosData] = useState({
    count: 0,
    photos: [],
    previewImage: null,
    dateString: null, // Add this
  });
  const { hives, setHives } = useContext(EventContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const { events, setEvents } = useContext(EventContext);

  const handleSendComment = async () => {
    if (!commentText.trim()) return;

    await handleAddComment(selectedHive.id, commentText);

    setCommentText("");
    fetchPublicHives();
  };

  const insertDemoPosts = async () => {
    try {
      const existing = await AsyncStorage.getItem("HIVES");

      // 🚫 if already exists → do nothing
      if (existing) return;

      const demo = [
        {
          id: "1",
          hiveName: "Goa Trip 🌴",
          description: "Beach vibes",
          coverImage: "https://picsum.photos/500/300?1",
          createdAt: new Date(),
          privacyMode: "public",

          user: {
            _id: "u1",
            name: "Rahul",
            profileImage: "https://i.pravatar.cc/150?img=1",
          },

          likes: [],
          comments: [],
          members: [],
          images: [],
          videos: [],
        },
        {
          id: "2",
          hiveName: "Birthday Party 🎉",
          description: "Crazy night",
          coverImage: "https://picsum.photos/500/300?2",
          createdAt: new Date(),
          privacyMode: "public",

          user: {
            _id: "u2",
            name: "Amit",
            profileImage: "https://i.pravatar.cc/150?img=2",
          },

          likes: [],
          comments: [],
          members: [],
          images: [],
          videos: [],
        }
      ];

      await AsyncStorage.setItem("HIVES", JSON.stringify(demo));

      console.log("✅ Demo posts inserted");

    } catch (err) {
      console.log("Demo insert error:", err);
    }
  };
  useEffect(() => {
    const init = async () => {
      await insertDemoPosts();   // ✅ ADD THIS
      await fetchHives();        // already in your code
    };

    init();
  }, []);



  useFocusEffect(
    useCallback(() => {
      fetchHives();

      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }).start();

      // AutoSync logic stays
    }, [fadeAnim])
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




  useEffect(() => {
    removeExpiredEvents();
    const interval = setInterval(removeExpiredEvents, 30 * 1000);
    return () => clearInterval(interval);
  }, [removeExpiredEvents]);

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

  const fetchHives = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem("HIVES");
      const localHives = stored ? JSON.parse(stored) : [];

      const sortedHives = [...localHives].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setHives(sortedHives);

      // 🔥 IMPORTANT FIX
      const publicOnly = sortedHives.filter(
        hive => hive.privacyMode === "public"
      );

      setPublicHives(publicOnly);

    } catch (err) {
      console.error("Local fetch error:", err);
    }
  }, []);


  useEffect(() => {
    fetchHives();
  }, [fetchHives]);



  useFocusEffect(
    useCallback(() => {
      const fetchPublicHives = async () => {
        const stored = await AsyncStorage.getItem("HIVES");
        const data = stored ? JSON.parse(stored) : [];

        setPublicHives(data);
      };
      fetchHives(); // ✅ ADD THIS

      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }).start();

      // AutoSync logic...
    }, [fadeAnim])
  );

  useFocusEffect(
    useCallback(() => {
      const fetchPublicHives = async () => {
        const stored = await AsyncStorage.getItem("HIVES");
        const data = stored ? JSON.parse(stored) : [];

        setPublicHives(data);
      };

      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }).start();

      // 🔥 AUTO SYNC LOGIC (ADD THIS)
      const checkPhotos = async () => {
        try {
          const result = await checkForNewCameraPhotos();

          if (result.hasNewPhotos && result.photoCount > 0) {

            const handledPhotosJson = await AsyncStorage.getItem('AUTO_SYNC_HANDLED_PHOTOS');
            const handledPhotoUris = handledPhotosJson ? JSON.parse(handledPhotosJson) : [];

            const availableDates = Object.keys(result.photosByDate).sort().reverse();

            let unhandledPhotos = [];

            for (const date of availableDates) {
              const datePhotos = result.photosByDate[date] || [];
              const newPhotos = datePhotos.filter(photo => !handledPhotoUris.includes(photo.uri));

              if (newPhotos.length > 0) {
                unhandledPhotos = newPhotos;
                break;
              }
            }

            if (unhandledPhotos.length === 0) return;

            const previewUri = unhandledPhotos[0]?.uri;

            setNewPhotosData({
              count: unhandledPhotos.length,
              photos: unhandledPhotos,
              previewImage: previewUri || null,
              dateString: null,
            });

            setTimeout(() => {
              setShowAutoSyncModal(true);
            }, 500);
          }
        } catch (error) {
          console.log("AutoSync error:", error);
        }
      };

      checkPhotos();

    }, [fadeAnim])
  );

  // 🔥 STORY STATES
  const [storyVisible, setStoryVisible] = useState(false);
  const [selectedUserHives, setSelectedUserHives] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);


  const today = new Date();

  const todayHives = publicHives.filter(hive => {
    const hiveDate = new Date(hive.createdAt);

    return (
      hiveDate.getDate() === today.getDate() &&
      hiveDate.getMonth() === today.getMonth() &&
      hiveDate.getFullYear() === today.getFullYear()
    );
  });
  const uniqueTodayUsers = Array.from(
    new Map(
      todayHives
        .filter(hive => hive.user && hive.user._id) // ✅ FILTER FIX
        .map(hive => [hive.user._id, hive.user])
    ).values()
  );

  const openUserStory = (userId) => {
    const userHives = todayHives.filter(
      hive => hive.user?._id === userId
    );

    setSelectedUserHives(userHives);
    setCurrentIndex(0);
    setStoryVisible(true);
  };

  const handleLike = async (hiveId) => {
    if (!userId) return;

    const stored = await AsyncStorage.getItem("HIVES");
    let hives = stored ? JSON.parse(stored) : [];

    hives = hives.map(h => {
      if (h.id !== hiveId) return h;

      const isLiked = h.likes?.includes(userId);

      return {
        ...h,
        likes: isLiked
          ? h.likes.filter(id => id !== userId)
          : [...(h.likes || []), userId],
      };
    });

    await AsyncStorage.setItem("HIVES", JSON.stringify(hives));

    setHives(hives);
    setPublicHives(hives);
  };

  const handleAddComment = async (hiveId, text) => {
    const stored = await AsyncStorage.getItem("HIVES");
    let hives = stored ? JSON.parse(stored) : [];

    hives = hives.map(h => {
      if (h.id !== hiveId) return h;

      const newComment = {
        text,
        user: {
          name: "You",
          profileImage: null,
        },
        createdAt: new Date(),
      };

      return {
        ...h,
        comments: [newComment, ...(h.comments || [])],
      };
    });

    await AsyncStorage.setItem("HIVES", JSON.stringify(hives));

    setHives(hives);
    setPublicHives(hives);
  };

  const filteredHives = hives
    ? hives.filter(hive =>
      hive.hiveName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hive.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : [];
  return (

    <BackgroungUI>
      <TopNav />
      <ScrollView style={{ marginBottom: 65 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >

        {/* status */}
        <View style={[styles.ImportSection, { overflow: 'hidden' }]}>


          <View
            style={{
              flex: 1,
              justifyContent: 'center',
            }} >

            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TouchableWithoutFeedback onPress={() => navigation.navigate('InviteMember')}>

                <View style={{ alignItems: 'center' }}>
                  <View
                    style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: 70, height: 70, backgroundColor: '#ffffff', borderRadius: 50, borderWidth: 0.4, borderColor: '#70707082', }} >
                    <Plus color="#000000" />
                  </View>
                  <CustomText weight='medium' style={{ fontSize: 10 }}>Add new</CustomText>
                </View>
              </TouchableWithoutFeedback>

              {uniqueTodayUsers?.map(user => (
                <TouchableWithoutFeedback
                  key={user._id}
                  onPress={() => openUserStory(user._id)}
                >
                  <View style={{ alignItems: 'center' }}>
                    <View style={{
                      width: 70,
                      height: 70,
                      borderRadius: 50,
                      borderWidth: 3,
                      borderColor: colors.primary,
                      padding: 2,
                    }}>
                      <Image
                        source={{
                          uri: user?.profileImage || "https://via.placeholder.com/150"
                        }}
                        style={{ width: '100%', height: '100%', borderRadius: 50 }}
                      />
                    </View>

                    <CustomText weight='medium' style={{ fontSize: 10 }}>
                      {user?.name || "User"}
                    </CustomText>
                  </View>
                </TouchableWithoutFeedback>
              ))}



            </View>
          </View>
        </View>

        {publicHives.map((hive) => {
          const isLiked = hive.likes?.some(
            id => id?.toString() === userId
          );

          return (
            <View
              key={hive.id}
              style={{
                margin: 10,
                paddingHorizontal: 12,
                borderRadius: 20,
                marginBottom: 10,
              }}
            >

              {/* header */}
              <TouchableWithoutFeedback
                onPress={() =>
                  navigation.navigate("FolderLayout", { hiveId: hive.id })
                }
              >
                <View style={{ flexDirection: "row", gap: 8, justifyContent: 'space-between', alignItems: 'center' }}>
                  <View style={{ flexDirection: "row", gap: 8, }}>
                    <View
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: 50,
                        overflow: "hidden",
                      }}
                    >
                      <Image
                        source={{
                          uri: hive.user?.profileImage || "https://via.placeholder.com/150"
                        }}
                        style={{ width: "100%", height: "100%" }}
                      />
                    </View>

                    <View>
                      <CustomText weight="semiBold" style={{ fontSize: 17 }}>
                        {hive.hiveName}
                      </CustomText>

                      <CustomText
                        weight="regular"
                        style={{ fontSize: 13, color: "#696969" }}
                      >
                        {hive.user?.name} created this hive
                      </CustomText>
                    </View>
                  </View>
                  <View style={{ marginRight: 8 }}>
                    <Ellipsis size={20} color={"#4b4b4b"} />
                  </View>
                </View>
              </TouchableWithoutFeedback>

              {/* cover image */}
              {hive.coverImage && (
                <TouchableWithoutFeedback
                  onPress={() =>
                    navigation.navigate("FolderLayout", { hiveId: hive.id })
                  }
                >
                  <View style={{ marginTop: 18 }}>
                    <Image
                      source={{ uri: hive.coverImage }}
                      style={{
                        width: "100%",
                        height: 220,
                        borderRadius: 16,
                      }}
                      resizeMode="cover"
                    />
                  </View>
                </TouchableWithoutFeedback>
              )}
              <View style={{ marginTop: 10 }}>
                <CustomText
                  weight="bold"
                  style={{ fontSize: 16, color: "#000000" }}
                >
                  Moement
                </CustomText>
                <CustomText
                  weight="semiBold"
                  style={{ fontSize: 14, color: "#0c0c0c" }}
                >
                  {hive.user?.name} created this hive
                </CustomText>
              </View>
              {/* actions */}
              <View
                style={{
                  flexDirection: "row",
                  marginTop: 12,
                  justifyContent: "space-between",
                }}
              >

                <View style={{ flexDirection: "row", gap: 12 }}>
                  <StatItem
                    icon={Heart}
                    value={hive.likes?.length || 0}
                    liked={isLiked}   // 🔥 ADD THIS
                    onPress={() => handleLike(hive.id)}
                  />
                  <StatItem
                    icon={MessageCircle}
                    value={hive.comments?.length || 0}
                    onPress={() => {
                      setSelectedHive(hive);
                      setCommentVisible(true);
                    }}
                  />
                </View>

                <StatItem icon={Bookmark} />
              </View>


              <View style={{ borderWidth: 0.3, borderColor: "#57575785", marginTop: 18 }} />
            </View>

          );
        })}
      </ScrollView>

      <Modal visible={storyVisible} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: "#000" }}>

        
          <View style={{
            position: "absolute",
            top: 50,
            width: "100%",
            flexDirection: "row",
            paddingHorizontal: 10,
            zIndex: 10
          }}>
            {selectedUserHives.map((_, index) => (
              <View
                key={index}
                style={{
                  flex: 1,
                  height: 3,
                  marginHorizontal: 2,
                  backgroundColor:
                    index <= currentIndex ? "#fff" : "rgba(255,255,255,0.3)",
                  borderRadius: 2,
                }}
              />
            ))}
          </View>

          {/* 🔥 USER HEADER */}
          <View style={{
            position: "absolute",
            top: 70,
            left: 15,
            right: 15,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            zIndex: 10
          }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image
                source={{
                  uri: selectedUserHives[0]?.user?.profileImage || "https://via.placeholder.com/150"
                }}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  marginRight: 10
                }}
              />
              <CustomText style={{ color: "#fff", fontSize: 16 }}>
                {selectedUserHives[0]?.user?.name}
              </CustomText>
            </View>

            <TouchableWithoutFeedback onPress={() => setStoryVisible(false)}>
              <Text style={{ color: "#fff", fontSize: 20 }}>✕</Text>
            </TouchableWithoutFeedback>
          </View>

          {/* 🔥 IMAGE */}
          {selectedUserHives.length > 0 && (
            <Image
              source={{ uri: selectedUserHives[currentIndex]?.coverImage }}
              style={{ width: "100%", height: "100%" }}
              resizeMode="cover"
            />
          )}

          {/* 🔥 GRADIENT OVERLAY (TOP) */}
          <View style={{
            position: "absolute",
            top: 0,
            width: "100%",
            height: 120,
            backgroundColor: "rgba(0,0,0,0.4)"
          }} />

          {/* 🔥 TAP AREAS */}
          <View style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            flexDirection: "row"
          }}>

            {/* LEFT */}
            <TouchableWithoutFeedback
              onPress={() => {
                if (currentIndex > 0) {
                  setCurrentIndex(currentIndex - 1);
                }
              }}
            >
              <View style={{ flex: 1 }} />
            </TouchableWithoutFeedback>

            {/* RIGHT */}
            <TouchableWithoutFeedback
              onPress={() => {
                if (currentIndex < selectedUserHives.length - 1) {
                  setCurrentIndex(currentIndex + 1);
                } else {
                  setStoryVisible(false);
                }
              }}
            >
              <View style={{ flex: 1 }} />
            </TouchableWithoutFeedback>

          </View>

        </View>
      </Modal>
      <Modal visible={commentVisible} animationType="slide" transparent onRequestClose={() => setCommentVisible(false)}>
        <View style={{ flex: 1, justifyContent: "flex-end" }}>

          <TouchableWithoutFeedback onPress={() => setCommentVisible(false)}>
            <View style={{ ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.35)" }} />
          </TouchableWithoutFeedback>

          <View style={{ backgroundColor: "#fff", borderTopLeftRadius: 25, borderTopRightRadius: 25, height: 400, padding: 20 }}>
            <View style={{ flex: 1 }}>

              <View style={{ borderBottomWidth: 1, borderColor: "#ddd", paddingBottom: 14 }}>
                <CustomText weight="semiBold" style={{ fontSize: 18 }}>Comments</CustomText>
              </View>

              <View style={{ flex: 1, marginTop: 20 }}>

                <ScrollView showsVerticalScrollIndicator={false}>
                  {selectedHive?.comments?.map((item, index) => (
                    <View key={index} style={{ flexDirection: "row", marginBottom: 15 }}>

                      <Image
                        source={{
                          uri: item.user?.profileImage || "https://via.placeholder.com/150"
                        }}
                        style={{ width: 36, height: 36, borderRadius: 18, marginRight: 10 }}
                      />

                      <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                          <CustomText weight="semiBold" style={{ marginRight: 6 }}>
                            {item.user?.name || "User"}
                          </CustomText>

                          <CustomText style={{ color: "#888", fontSize: 12 }}>
                            {new Date(item.createdAt).toLocaleTimeString()}
                          </CustomText>
                        </View>

                        <CustomText style={{ marginTop: 2 }}>
                          {item.text}
                        </CustomText>
                      </View>

                    </View>
                  ))}
                </ScrollView>

              </View>

              <View style={{ flexDirection: "row", alignItems: "center", borderTopWidth: 1, borderColor: "#eee", paddingTop: 10 }}>
                <Image source={dp5} style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10 }} />

                <View style={{ flex: 1, borderWidth: 1, borderColor: "#ddd", borderRadius: 25, paddingHorizontal: 12, paddingVertical: 6, marginRight: 10 }}>
                  <TextInput placeholder="Write a comment..." value={commentText} onChangeText={setCommentText} style={{ width: "100%" }} />
                </View>

                <TouchableWithoutFeedback onPress={handleSendComment}>
                  <View style={{ padding: 10, backgroundColor: colors.primary, borderRadius: 25, alignItems: "center", justifyContent: "center" }}>
                    <SendHorizontalIcon color="#fff" />
                  </View>
                </TouchableWithoutFeedback>

              </View>

            </View>
          </View>

        </View>
      </Modal>


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


    </BackgroungUI>

  )
}

export default MainScreen

const styles = StyleSheet.create({

  // status
  ImportSection: {
    paddingRight: 20,
    paddingLeft: 20,
    paddingBottom: 10,
    paddingTop: 8,
    overflow: 'hidden',
  },

  // Feed
  multiImagePosts: {
    width: 120,
    height: 200,
    overflow: "hidden",
  },
  singleImagePosts: {
    width: "100%",
    height: 200,
    overflow: "hidden",
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff75',
    borderRadius: 50,
    paddingHorizontal: 14,
    paddingVertical: 5,

    marginBottom: 8,
    width: '90%',
    margin: 'auto',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: "#e9b793"
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

})