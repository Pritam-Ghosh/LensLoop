import React, { useEffect, useState, useContext, useCallback, useRef } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  Modal,
  FlatList,
  Animated,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import Video from "react-native-video";

import { useFocusEffect } from '@react-navigation/native';
import { BlurView } from "@react-native-community/blur";

import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Plus,
  Users,
  SmilePlus,
  Images,

  MessagesSquare,
  Share,
  EllipsisVertical,
  CameraIcon,
  ImagePlus,
  SendHorizonal,
  Send,
  ImagePlusIcon,
  PlusCircle,
  Camera,
  FlagOff,
  Flag,
  MessageCircle,
  BrainCircuit,
  Heart,
  MessageCircleMore,
} from "lucide-react-native";
import { launchImageLibrary } from "react-native-image-picker";
import { Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");
import { useLoader } from "../context/LoaderContext";
import { useTranslation } from 'react-i18next';
import axios from "axios";
import Toast from 'react-native-toast-message';

// SVGs
import QR from "../../assets/svg/qr.svg";

// Components
import ScreenLayout from "../components/ScreenLayout";
import CustomText from "../components/CustomText";
import SearchBar from "../components/SearchBar";
import MembersModal from "../components/MembersModal";
import { colors } from "../Theme/theme";
import { EventContext } from '../context/EventContext';

// Images
const createEvent = require("../../assets/background.png");
const profilePic = require("../../assets/profile.jpg");
const dp = require("../../assets/dp.jpg");
const dp2 = require("../../assets/dp2.webp");
const dp3 = require("../../assets/dp3.jpg");
const dp4 = require("../../assets/dp4.jpg");
const dp5 = require("../../assets/dp5.jpg");
const dp6 = require("../../assets/dp6.jpg");
const dp7 = require("../../assets/dp7.jpg");
const dp8 = require("../../assets/dp8.jpg");


const FolderLayout = ({ navigation, route }) => {

  const {
    image,
    folderName,
    date,
    hiveId,
    owner,
    photos = [],
    eventTitle,
    eventDescription,
    eventEndTime,
    eventExpiryDate,
    membersCount = 0,
  } = route.params || {};

  const [selectedTab, setSelectedTab] = useState("Gallery");
  const [uploadedImages, setUploadedImages] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [membersList, setMembersList] = useState([]);
  const flatListRef = useRef(null);
  const [aiMessages, setAiMessages] = useState([]);
  const [messages, setMessages] = useState([]);
  const [textMessage, setTextMessage] = useState("");
  const [showGalleryPicker, setShowGalleryPicker] = useState(false);
  const [selectedGalleryImage, setSelectedGalleryImage] = useState(null);
  const { showLoader, hideLoader } = useLoader();
  const { t } = useTranslation();
  const { events, setEvents } = useContext(EventContext);
  const [viewerVisible, setViewerVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const { updateHivePhotos, updateHiveMembers } = useContext(EventContext);
  const [galleryLoading, setGalleryLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const [flaggedImages, setFlaggedImages] = useState({});
  const [loggedUser, setLoggedUser] = useState(null);
  const [hiveInfo, setHiveInfo] = useState(null);

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(12);
  const handleLike = () => {
    if (liked) {
      setLikeCount(likeCount - 1);
    } else {
      setLikeCount(likeCount + 1);
    }
    setLiked(!liked);
  };

  const blinkAnim = useRef(new Animated.Value(0.4)).current;

  console.log("hive id:" + hiveId);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(blinkAnim, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(blinkAnim, {
          toValue: 0.4,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const fetchHive = useCallback(async () => {
    try {
      setGalleryLoading(true);

      const stored = await AsyncStorage.getItem("HIVES");
      const hives = stored ? JSON.parse(stored) : [];

      const hive = hives.find(h => h.id === hiveId);

      if (!hive) return;

      setHiveInfo(hive);

      // merge images + videos
      const mergedMedia = [
        ...(hive.images || []).map(img => ({
          ...img,
          type: "image",
        })),
        ...(hive.videos || []).map(video => ({
          ...video,
          type: "video",
          blurred: false,
        })),
      ];

      setUploadedImages(mergedMedia);
      setMembersList(hive.members || []);

    } catch (err) {
      console.error("Local fetch error:", err);
    } finally {
      setGalleryLoading(false);
    }
  }, [hiveId]);

  useFocusEffect(
    useCallback(() => {
      if (hiveId) fetchHive();
    }, [fetchHive, hiveId])
  );

  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      await fetchHive(); // ONLY re-fetch this screen
    } finally {
      setRefreshing(false);
    }
  }, [fetchHive]);

  const handleUpload = async () => {
    launchImageLibrary(
      {
        mediaType: "mixed",
        selectionLimit: 0,
      },
      async (response) => {
        if (response.didCancel || !response.assets?.length) return;

        try {
          const stored = await AsyncStorage.getItem("HIVES");
          let hives = stored ? JSON.parse(stored) : [];

          const newMedia = response.assets.map(asset => ({
            url: asset.uri,
            type: asset.type?.startsWith("video") ? "video" : "image",
            blurred: false,
          }));

          hives = hives.map(h => {
            if (h.id !== hiveId) return h;

            return {
              ...h,
              images: [...(h.images || []), ...newMedia.filter(m => m.type === "image")],
              videos: [...(h.videos || []), ...newMedia.filter(m => m.type === "video")],
            };
          });

          await AsyncStorage.setItem("HIVES", JSON.stringify(hives));

          fetchHive(); // refresh UI

        } catch (e) {
          console.log("Upload error:", e);
        }
      }
    );
  };



  const toggleFlag = async (index, currentBlur) => {
    try {


      await axios.put(
        `https://snaphive-node.vercel.app/api/hives/${hiveId}/blur-image`,
        {
          index,
          blurred: !currentBlur,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchHive(); // reload images

    } catch (e) {
      console.log("Blur error:", e);
    }
  };



  const members = [
    { id: 1, name: "Demola Aoki", dp: dp },
    { id: 2, name: "Sofia Carrington", dp: dp3 },
  ];


  // AI MAGIC — PICK IMAGE & SHOW IN CHAT
  const handleAiImagePick = () => {
    launchImageLibrary({ mediaType: "photo", quality: 0.8 }, (response) => {
      if (response.didCancel || !response.assets) return;

      const imageUri = response.assets[0].uri;

      const userImg = {
        id: Date.now(),
        type: "image",
        uri: imageUri,
        time: "01:00 am",
        side: "user",
      };

      const aiImg = {
        id: Date.now() + 1,
        type: "image",
        uri: imageUri,
        time: "01:00 am",
        side: "ai",
      };

      setAiMessages((prev) => [...prev, userImg, aiImg]);
    });
  };


  // AI MAGIC — SEND TEXT MESSAGE
  const handleAiTextSend = () => {
    if (!textMessage.trim()) return;

    const userMsg = {
      id: Date.now(),
      type: "text",
      text: textMessage,
      time: "01:00 am",
      side: "user",
    };

    const aiReply = {
      id: Date.now() + 1,
      type: "text",
      text: textMessage, // AI echoes same message
      time: "01:00 am",
      side: "ai",
    };

    setAiMessages((prev) => [...prev, userMsg, aiReply]);
    setTextMessage("");
  };


  const handleGalleryImageSelect = (uri) => {
    setSelectedGalleryImage(uri);
    setShowGalleryPicker(false);

    // Add selected image to AI chat
    const userImg = {
      id: Date.now(),
      type: "image",
      uri: uri,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
      side: "user",
    };

    const aiImg = {
      id: Date.now() + 1,
      type: "image",
      uri: uri,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
      side: "ai",
    };

    setAiMessages((prev) => [...prev, userImg, aiImg]);
  };








  const DemoGalleryBoxes = () => {
    return (
      <View style={styles.galleryPickerGrid}>
        {Array.from({ length: 9 }).map((_, index) => (
          <Animated.View
            key={`demo-${index}`}
            style={[
              styles.galleryPickerImageWrapper,
              styles.demoBox,
              { opacity: blinkAnim },
            ]}
          />
        ))}
      </View>
    );
  };

  useEffect(() => {
    const fakeUser = {
      id: "user123",
      name: "You",
      email: "you@mail.com",
    };

    AsyncStorage.setItem("user", JSON.stringify(fakeUser));
    setLoggedUser(fakeUser);
  }, []);

  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) {
        setLoggedUser(JSON.parse(storedUser));
      }
    };

    loadUser();
  }, []);

  const isHiveMember =
    membersList?.some(
      m =>
        (m.email === loggedUser?.email ||
          m.phone === loggedUser?.phone) &&
        m.status === "accepted"
    ) || loggedUser?._id === hiveInfo?.user?._id;

  const canBlur = !isHiveMember;

  const isHiveOwner = loggedUser?._id === hiveInfo?.user?._id;


  const chatUsers = [
    ...(hiveInfo?.user
      ? [
        {
          memberId: hiveInfo.user,
          status: "accepted",
          isOwner: true,
        },
      ]
      : []),

    ...membersList,
  ].filter(
    (m) =>
      m.memberId &&
      m.memberId._id !== loggedUser?._id &&
      m.status === "accepted"
  );




  return (
    <ScreenLayout
      navigation={navigation}

      image={createEvent}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor="#DA3C84"
        />
      }
      folderName="Janifer Danis"
      date="+91 1841 510 1450"
      RightIcon={
        <View style={{ flexDirection: "row", alignItems: "center", gap: width * 0.025 }}>
          <TouchableOpacity onPress={() => navigation.navigate("ClickPhoto", { hiveId })} >
            <View style={{
              padding: 10,
              borderRadius: 50,
              backgroundColor: "rgba(255,255,255,0.3)",
            }}>
              <Camera height={width * 0.04} width={width * 0.04} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setMenuVisible(!menuVisible)} >
            <View style={{
              padding: 10,
              borderRadius: 50,
              backgroundColor: "rgba(255,255,255,0.3)",
            }}>

              <EllipsisVertical height={width * 0.04} width={width * 0.04} />
            </View>
          </TouchableOpacity>

        </View>
      }
      OverlayContent={
        <View style={styles.profileOverlay}>
          {isUploading && (
            <View
              style={{
                position: "absolute",
                top: 0,
                width: "100%",
                backgroundColor: "#D83B7D",
                paddingVertical: 12,
                paddingHorizontal: 16,
                zIndex: 999,
                shadowColor: "#000",
                shadowOpacity: 0.2,
                shadowRadius: 6,
                elevation: 6,
                borderRadius: 12
              }}
            >
              {/* TEXT */}
              <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 6 }}>
                <CustomText weight="bold" style={{ color: "#fff", fontSize: 14 }}> Uploading... </CustomText>
                <CustomText style={{ color: "#FDE2F0", fontSize: 12 }}>
                  {Math.round(uploadProgress)}%
                </CustomText>
              </View>
              {/* PROGRESS BAR */}
              <View
                style={{
                  height: 6,
                  backgroundColor: "#F9D2E3",
                  borderRadius: 6,
                  overflow: "hidden",
                }}
              >
                <View
                  style={{
                    width: `${uploadProgress}%`,
                    height: "100%",
                    backgroundColor: "#fc0069",
                  }}
                />
              </View>
            </View>
          )}
          <CustomText weight="bold" style={{ color: colors.primary, fontSize: width * 0.075 }}>
            {hiveInfo?.hiveName || "Loading..."}
          </CustomText>
          <CustomText weight="medium" style={{ color: colors.primary, fontSize: width * 0.035, marginBottom: height * 0.025, textAlign: 'center' }}>
            {hiveInfo?.description || ""}

          </CustomText>

          <View style={styles.rowBetween}>
            <TouchableOpacity
              style={styles.importBtnWhite}
              onPress={handleUpload}
            >
              <View>
                <Plus color="#DA3C84" size={width * 0.05} />
              </View>
              <CustomText weight="bold" style={{ color: '#DA3C84', fontSize: width * 0.035 }}>
                {t('myImages')}
              </CustomText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.importBtnWhite, { backgroundColor: '#000000ff' }]}
              onPress={() => setModalVisible(true)}
            >
              <Users color="#ffffff" size={width * 0.05} />
              <CustomText weight="bold" style={{ color: '#ffffff', fontSize: width * 0.035 }}>
                {chatUsers.length} {t('members')}
              </CustomText>
            </TouchableOpacity>
          </View>

          {menuVisible && (
            <View
              style={{
                position: 'absolute',
                top: height * 0.01,
                right: -width * 0.00,
                backgroundColor: '#fff',
                paddingVertical: height * 0.012,
                borderRadius: width * 0.025,
                width: width * 0.45,
                elevation: 10,
                shadowColor: '#000',
                shadowOpacity: 0.2,
                shadowRadius: 4,
                shadowOffset: { width: 0, height: 2 },
                zIndex: 999,
              }}
            >

              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("InviteMember", {
                    hiveId: hiveId,
                  })
                }
                style={{ paddingVertical: height * 0.015, paddingHorizontal: width * 0.04 }}
              >
                <CustomText weight="medium">{t('inviteMember')}</CustomText>
              </TouchableOpacity>

              <View style={{ height: 1, backgroundColor: '#E5E7EB' }} />


              {isHiveOwner && (
                <>
                  <View style={{ height: 1, backgroundColor: '#E5E7EB' }} />

                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("EditHive", {
                        hiveId: hiveId,
                      })
                    }
                    style={{ paddingVertical: height * 0.015, paddingHorizontal: width * 0.04 }}
                  >
                    <CustomText weight="medium">{t('Edit Hive')}</CustomText>
                  </TouchableOpacity>
                </>
              )}

            </View>
          )}
        </View>
      }
      onPress={() => setMenuVisible(!menuVisible)} >
      <View style={styles.scrollContainer}>
        <View style={styles.container}>
          {/* Tabs */}
          <View style={styles.tabsContainer}>
            {[
              { key: "Gallery", label: t('gallery'), icon: <Images width={width * 0.04} height={width * 0.04} stroke={selectedTab === "Gallery" ? "#fff" : "#000"} /> },
              { key: "Chat", label: t('chat'), icon: <MessageCircle width={width * 0.04} height={width * 0.04} stroke={selectedTab === "Chat" ? "#fff" : "#000"} /> },
              { key: "AiMagic", label: t('aiMagic'), icon: <BrainCircuit width={width * 0.04} height={width * 0.04} stroke={selectedTab === "AiMagic" ? "#fff" : "#000"} /> },
            ].map((tab, i) => (
              <TouchableOpacity
                key={i}
                style={[styles.tabButton, selectedTab === tab.key && styles.tabButtonActive]}
                onPress={() => setSelectedTab(tab.key)}
              >
                {tab.icon}
                <CustomText
                  weight="medium"
                  style={[styles.tabText, selectedTab === tab.key && styles.tabTextActive]}
                >
                  {tab.label}
                </CustomText>
              </TouchableOpacity>
            ))}
          </View>

          <View
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={false}>
            {selectedTab === "Gallery" && (
              <View style={styles.grid}>
                {galleryLoading ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#DA3C84" />
                  </View>
                ) : uploadedImages.length === 0 ? (
                  <CustomText style={styles.infoText}>
                    {t('noPhotos')}
                  </CustomText>
                ) : (
                  <View style={styles.imageWrapperRow}>
                    {uploadedImages.map((img, index) => {
                      if (!img?.url) return null;

                      let styleToApply = {};
                      const pos = index % 4;

                      if (pos === 0) styleToApply = styles.imageGridOne;
                      else if (pos === 1) styleToApply = styles.imageGridTwo;
                      else if (pos === 2) styleToApply = styles.imageGridThree;
                      else if (pos === 3) styleToApply = styles.imageGridFour;

                      return (
                        <View key={`uploaded-${index}`} style={styleToApply}>
                          <TouchableOpacity
                            activeOpacity={0.9}
                            onPress={() => {
                              setActiveIndex(index);
                              setViewerVisible(true);
                            }}
                          >

                            <View style={{ position: 'relative' }}>

                              {img.type === "video" ? (
                                <View pointerEvents="none">
                                  <Video
                                    source={{ uri: img.url }}
                                    style={styles.photo}
                                    resizeMode="cover"
                                    paused={false}
                                    repeat
                                    muted
                                  />
                                </View>
                              ) : (
                                <Image
                                  source={{ uri: img.url }}
                                  style={styles.photo}
                                  resizeMode="cover"
                                />
                              )}



                              {/* BLUR FOR EVERYONE */}
                              {img.blurred && (
                                <BlurView
                                  style={StyleSheet.absoluteFill}
                                  blurType="light"
                                  blurAmount={10}
                                />
                              )}
                              {/* FLAG BUTTON ONLY FOR OWNER */}
                              {canBlur && (
                                <View style={{ position: 'absolute', bottom: 0, height: 40, color: 'white', zIndex: 10, backgroundColor: '#ffffff46', width: '100%', justifyContent: 'center' }}>

                                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10 }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                                      <TouchableWithoutFeedback onPress={handleLike}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                                          <Heart
                                            size={22}
                                            color={liked ? "#ff3040" : "#fff"}
                                            fill={liked ? "#ff3040" : "none"}
                                          />
                                          <CustomText weight="medium" style={{ color: '#fff' }}>
                                            {likeCount}
                                          </CustomText>
                                        </View>
                                      </TouchableWithoutFeedback>
                                      <TouchableWithoutFeedback>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                                          <MessageCircleMore size={22} color='#fff' />
                                          <CustomText weight="medium" style={{ color: '#fff' }}>12</CustomText>
                                        </View>
                                      </TouchableWithoutFeedback>

                                    </View>
                                    <TouchableOpacity
                                      onPress={() => toggleFlag(index, img.blurred)}
                                      style={styles.flagButton}
                                    >
                                      <Text style={{ color: '#b6b6b6', fontSize: 12 }}>
                                        {img.blurred ? <FlagOff color="white" size={20} /> : <Flag color="white" size={20} />}
                                      </Text>
                                    </TouchableOpacity>

                                  </View>
                                </View>
                              )}




                            </View>

                          </TouchableOpacity>
                        </View>

                      );
                    })}
                  </View>
                )}
              </View>
            )}


            {selectedTab === "Chat" && (
              <>
                <SearchBar />
                <View style={styles.chatList}>
                  {chatUsers.map((m, i) => (
                    <TouchableOpacity
                      key={i}
                      onPress={() =>
                        navigation.navigate("Chat", {
                          user: m.memberId,
                          hiveId: hiveId,
                        })
                      }
                    >
                      <View style={styles.shadowWrapper}>
                        <View style={styles.chatListItem}>

                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: width * 0.0375 }}>
                            <Image source={
                              m.memberId.profileImage
                                ? { uri: m.memberId.profileImage }
                                : dp
                            } style={styles.dp} />

                            <View>
                              <CustomText weight="bold">{m.memberId.name}</CustomText>

                              <CustomText
                                weight="medium"
                                numberOfLines={1}
                                ellipsizeMode="tail"
                                style={{
                                  maxWidth: width * 0.4,
                                  fontSize: width * 0.03,
                                  color: '#888'
                                }}
                              >
                                Start chatting with {m.memberId.name}
                              </CustomText>
                            </View>
                          </View>

                          <View style={{ alignItems: 'flex-end', minWidth: width * 0.15 }}>
                            <CustomText weight="medium" style={{ fontSize: width * 0.03 }}>
                              Online
                            </CustomText>
                          </View>

                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>

              </>
            )}
          </View>

          {selectedTab === "AiMagic" && (
            <View style={styles.aiMagicContainer}>
              <ScrollView
                style={styles.aiMagicScrollView}
                contentContainerStyle={styles.aiMagicContent}
                showsVerticalScrollIndicator={false}
              >
                <View style={styles.messagesContainer}>

                  {/* ----  STATIC USER MESSAGE ---- */}
                  <View style={styles.userTwoMessageBox}>
                    <View style={styles.messageText}>
                      <CustomText weight="medium" style={[styles.text, { color: '#3d3d3dff', fontSize: width * 0.03 }]}>
                        Hey! Turn this photo into a Pixar-style 3D character with a futuristic neon city!
                      </CustomText>
                    </View>
                    <CustomText weight="medium" style={{ fontSize: width * 0.025, color: '#888' }}>01:00 am</CustomText>
                  </View>

                  {/* ---- STATIC AI IMAGE ---- */}
                  <View style={styles.userOneMessageBox}>
                    <View style={styles.ImageTextLeft}>
                      {/* <Image source={picnic1} style={styles.msgImage} /> */}
                    </View>
                    <CustomText weight="medium" style={{ fontSize: width * 0.025, color: '#888' }}>
                      01:00 am
                    </CustomText>
                  </View>

                  {/* ---- STATIC AI TEXT ---- */}
                  <View style={styles.userOneMessageBox}>
                    <View style={styles.messageTextLeft}>
                      <CustomText weight="medium" style={[styles.textLeft, { color: '#ffffffff', fontSize: width * 0.03 }]}>
                        Sure! Upload your image — I can turn it into Pixar, Anime, Cyberpunk, Cartoon or Realistic styles!
                      </CustomText>
                    </View>
                    <CustomText weight="medium" style={{ fontSize: width * 0.025, color: '#888' }}>01:00 am</CustomText>
                  </View>

                  {/* ---- DYNAMIC AI MESSAGES ---- */}
                  {aiMessages.map((msg) => {
                    // USER MESSAGE (RIGHT SIDE)
                    if (msg.side === "user") {
                      return (
                        <View key={msg.id} style={styles.userTwoMessageBox}>
                          {/* IF USER IMAGE */}
                          {msg.type === "image" && (
                            <View style={styles.ImageTextRight}>
                              <Image source={{ uri: msg.uri }} style={styles.msgImage} />
                            </View>
                          )}

                          {/* IF USER TEXT */}
                          {msg.type === "text" && (
                            <View style={styles.messageText}>
                              <CustomText weight="medium" style={[styles.text, { color: '#3d3d3dff', fontSize: width * 0.03 }]}>
                                {msg.text}
                              </CustomText>
                            </View>
                          )}

                          <CustomText weight="medium" style={{ fontSize: width * 0.025, color: '#888' }}>
                            {msg.time}
                          </CustomText>
                        </View>
                      );
                    }

                    // AI MESSAGE (LEFT SIDE)
                    else {
                      return (
                        <View key={msg.id} style={styles.userOneMessageBox}>
                          {/* IF AI IMAGE */}
                          {msg.type === "image" && (
                            <View style={styles.ImageTextLeft}>
                              <Image source={{ uri: msg.uri }} style={styles.msgImage} />
                            </View>
                          )}

                          {/* IF AI TEXT */}
                          {msg.type === "text" && (
                            <View style={styles.messageTextLeft}>
                              <CustomText weight="medium" style={[styles.textLeft, { color: '#ffffffff', fontSize: width * 0.03 }]}>
                                {msg.text}
                              </CustomText>
                            </View>
                          )}

                          <CustomText weight="medium" style={{ fontSize: width * 0.025, color: '#888' }}>
                            {msg.time}
                          </CustomText>
                        </View>
                      );
                    }
                  })}

                </View>

              </ScrollView>

              {/* Input Box - Fixed at bottom */}
              <View style={styles.aiMagicInputContainer}>
                <View style={styles.aiMagicInputWrapper}>
                  <TouchableOpacity
                    style={{ marginRight: width * 0.025 }}
                    onPress={handleAiImagePick}
                  >
                    <ImagePlus size={width * 0.055} color="#6B7280" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{ marginRight: width * 0.025 }}
                    onPress={() => setShowGalleryPicker(!showGalleryPicker)}>
                    <PlusCircle size={width * 0.055} color="#6B7280" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{ marginRight: width * 0.025 }}
                    onPress={() => navigation.navigate('ClickPhoto', { hiveId })}>
                    <Camera size={width * 0.055} color="#6B7280" />
                  </TouchableOpacity>

                  <TextInput
                    placeholder={t('askAnything')}
                    placeholderTextColor="#9CA3AF"
                    style={styles.aiMagicInput}
                    value={textMessage}
                    onChangeText={setTextMessage}
                  />

                  <TouchableOpacity
                    style={styles.aiMagicSendButton}
                    onPress={handleAiTextSend}
                  >
                    <SendHorizonal size={width * 0.05} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

          <MembersModal
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
            members={chatUsers}
          />

          {showGalleryPicker && (
            <TouchableWithoutFeedback onPress={() => setShowGalleryPicker(false)}>
              <View style={styles.galleryPickerOverlay}>
                <TouchableWithoutFeedback>
                  <View style={styles.galleryPickerModal}>
                    <View style={styles.galleryPickerHeader}>
                      <CustomText weight="bold" style={{ fontSize: width * 0.045 }}>
                        Select from Gallery
                      </CustomText>
                      <TouchableOpacity onPress={() => setShowGalleryPicker(false)}>
                        <CustomText weight="bold" style={{ fontSize: width * 0.04, color: '#DA3C84' }}>
                          Cancel
                        </CustomText>
                      </TouchableOpacity>
                    </View>

                    <ScrollView
                      style={styles.galleryPickerScroll}
                      showsVerticalScrollIndicator={false}
                    >
                      {galleryLoading ? (
                        <DemoGalleryBoxes />
                      ) : uploadedImages.length === 0 ? (
                        <Text style={styles.infoText}>No photos available</Text>
                      ) : (
                        <View style={styles.galleryPickerGrid}>
                          {uploadedImages.map((img, index) => {
                            if (!img?.url) return null;

                            return (
                              <TouchableOpacity
                                key={`gallery-select-${index}`}
                                style={styles.galleryPickerImageWrapper}
                                onPress={() => handleGalleryImageSelect(img.url)}   // ✅ FIXED
                              >
                                <Image
                                  source={{ uri: img.url }}                          // ✅ FIXED
                                  style={styles.galleryPickerImage}
                                />
                              </TouchableOpacity>

                            );
                          })}

                        </View>
                      )}
                    </ScrollView>

                  </View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
          )}

        </View>
      </View>

      <Modal
        visible={viewerVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setViewerVisible(false)}
      >
        <View style={{ flex: 1 }}>
          <BlurView
            style={StyleSheet.absoluteFill}
            blurType="light"
            blurAmount={100}
            reducedTransparencyFallbackColor="rgba(255,255,255,0.85)"
          />

          <View style={styles.viewerContainer}>

            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setViewerVisible(false)}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "rgba(255,255,255,0.6)",
                }}
              >
                <CustomText style={{ fontSize: 18 }}>✕</CustomText>
              </View>
            </TouchableOpacity>
            <FlatList
              ref={flatListRef}
              data={uploadedImages}
              horizontal
              pagingEnabled
              initialScrollIndex={activeIndex}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(_, i) => i.toString()}
              getItemLayout={(data, index) => ({
                length: width,
                offset: width * index,
                index,
              })}
              onScrollToIndexFailed={(info) => {
                setTimeout(() => {
                  flatListRef.current?.scrollToIndex({
                    index: info.index,
                    animated: false,
                  });
                }, 300);
              }}
              renderItem={({ item, index }) => {
                if (!item?.url) return null;

                return (
                  <View
                    style={{
                      width: width,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <View
                      style={{
                        width: width * 0.9,
                        height: height * 0.65,
                        borderRadius: 20,
                        overflow: "hidden",
                        backgroundColor: "#000",
                      }}
                    >
                      {item.type === "video" ? (
                        <Video
                          source={{ uri: item.url }}
                          style={{ width: "100%", height: "100%" }}
                          resizeMode="cover"
                          controls
                          paused={activeIndex !== index}
                        />
                      ) : (
                        <Image
                          source={{ uri: item.url }}
                          style={{ width: "100%", height: "100%" }}
                          resizeMode="cover"
                        />
                      )}
                    </View>
                  </View>
                );
              }}
            />
          </View>
        </View>
      </Modal>


    </ScreenLayout>
  );
};
const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    paddingHorizontal: width * 0.05,
    paddingBottom: height * 0.10,
    // backgroundColor: "#FAFAF9",
  },

  textBox: {
    flex: 1,
  },

  profileOverlay: {
    alignItems: "center",
  },

  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    gap: width * 0.05,
    justifyContent: "space-between",
  },

  bottomOverlay: {
    position: "absolute",
    bottom: height * 0.1125,
    left: width * 0.05,
    right: width * 0.05,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },

  tabsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginTop: height * 0.025,
    borderRadius: width * 0.1,
    paddingVertical: height * 0.01,
  },
  tabButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: width * 0.015,
    paddingHorizontal: width * 0.053,
    paddingVertical: height * 0.0075,
    borderWidth: 1,
    borderColor: '#D0CACA',
    borderRadius: width * 0.01,
  },
  tabButtonActive: {
    backgroundColor: "#DA3C84",
    borderWidth: 1,
    borderColor: '#DA3C84',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
  },
  tabText: {
    color: "#888888",
    fontSize: width * 0.0375,
    fontWeight: "500",
  },
  tabTextActive: {
    color: '#ffffff',
    fontWeight: "700",
  },
  iconInactive: {
    color: '#000'
  },
  iconActive: {
    color: '#fff'
  },

  grid: {
    width: '100%',
    marginTop: height * 0.0125,
    alignItems: 'center',

  },

  imageWrapperRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
  },

  imageGridOne: {
    width: '48%',
    height: height * 0.2,
    borderRadius: width * 0.025,
    overflow: 'hidden',
    backgroundColor: '#e5e7eb',
    marginBottom: height * 0.0187,
  },
  imageGridTwo: {
    width: '48%',
    height: height * 0.3,
    borderRadius: width * 0.025,
    overflow: 'hidden',
    backgroundColor: '#e5e7eb',
    marginBottom: height * 0.0187,
  },
  imageGridThree: {
    width: '48%',
    height: height * 0.3,
    borderRadius: width * 0.025,
    overflow: 'hidden',
    backgroundColor: '#e5e7eb',
    marginBottom: height * 0.0187,
    marginTop: height * -0.1,
  },
  imageGridFour: {
    width: '48%',
    height: height * 0.2,
    borderRadius: width * 0.025,
    overflow: 'hidden',
    backgroundColor: '#e5e7eb',
    marginBottom: height * 0.0187,
  },
  photo: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  infoText: {
    textAlign: "center",
    color: "#888888",
    marginTop: height * 0.025,
  },
  importBtnWhite: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: width * 0.02,
    backgroundColor: '#FFFFFF',
    paddingVertical: height * 0.012,
    paddingHorizontal: width * 0.050,
    borderRadius: width * 0.035,
    marginVertical: height * 0.0125,
  },
  chatList: {
    marginTop: height * 0.025,
  },
  chatListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: height * 0.025,
    borderBottomWidth: 1,
    borderBottomColor: '#EDEDED',
    paddingVertical: height * 0.0187,
    paddingHorizontal: width * 0.03,
    backgroundColor: '#fff',
    borderRadius: width * 0.015,
    shadowColor: '#acacacff',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 12,
  },

  dp: {
    width: width * 0.1275,
    height: width * 0.1275,
    borderRadius: width * 0.06375,
    resizeMode: "cover",
  },
  allMembarDp: {
    width: width * 0.1375,
    height: width * 0.1375,
    borderRadius: width * 0.06875,
    resizeMode: "cover",
    borderWidth: 2,
    borderColor: '#ffffff',
  },

  allMembarShadowWrapper: {
    width: width * 0.15,
    height: width * 0.15,
    borderRadius: width * 0.075,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#7a7979ff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.20,
    shadowRadius: 6,
    elevation: 6,
  },

  aiMagicContainer: {
    height: height * 0.47
  },
  aiMagicContent: {
    paddingBottom: height * 0.10,
  },
  userOneMessageBox: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: width * 0.025,
    marginVertical: height * 0.015,
    maxWidth: '80%',
  },
  userTwoMessageBox: {
    flexDirection: 'row-reverse',
    alignItems: 'flex-end',
    gap: width * 0.025,
    marginVertical: height * 0.010,
    maxWidth: '80%',
    alignSelf: 'flex-end',
  },
  messageText: {
    borderRadius: width * 0.025,
    backgroundColor: '#fee8a3',
    paddingVertical: height * 0.0137,
    paddingHorizontal: width * 0.04,
    maxWidth: width * 0.6625,
    height: 'auto',
    shadowColor: '#acacacff',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 12,
  },
  messageTextLeft: {
    borderRadius: width * 0.025,
    backgroundColor: '#cc4faa',
    paddingVertical: height * 0.0137,
    paddingHorizontal: width * 0.04,
    maxWidth: width * 0.6625,
    height: 'auto',
    shadowColor: '#acacacff',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 12,
  },
  ImageTextLeft: {
    borderWidth: 5,
    borderColor: '#cc4faa',
    borderRadius: width * 0.025,
    overflow: 'hidden',
    width: width * 0.55,
    height: height * 0.2,
    shadowColor: '#acacacff',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 12,
  },

  msgImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  text: {
    color: '#ffffff',
    fontWeight: '600',
  },
  textLeft: {
    color: '#636363',
    fontWeight: '600',
  },
  aiMagicInputContainer: {
    position: 'absolute',
    bottom: -10,
    left: 0,
    right: 0,
    paddingHorizontal: 0,
    paddingBottom: height * 0.015,
    paddingTop: height * 0.01,
    backgroundColor: 'transparent',
  },
  aiMagicInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: width * 0.075,
    paddingVertical: height * 0.008,
    paddingHorizontal: width * 0.035,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#888888ff',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 3,
  },
  aiMagicInput: {
    flex: 1,
    fontSize: width * 0.04,
    color: '#111827',
    paddingHorizontal: width * 0.015,
  },
  aiMagicSendButton: {
    backgroundColor: '#DA3C84',
    width: width * 0.105,
    height: width * 0.105,
    borderRadius: width * 0.0525,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: width * 0.02,
  },
  ImageTextRight: {
    borderWidth: 5,
    borderColor: '#fee8a3',
    borderRadius: width * 0.025,
    overflow: 'hidden',
    width: width * 0.55,
    height: height * 0.2,
    shadowColor: '#acacacff',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 12,
  },
  galleryPickerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    zIndex: 1000,
  },
  galleryPickerModal: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: width * 0.05,
    borderTopRightRadius: width * 0.05,
    maxHeight: height * 0.7,
    paddingBottom: height * 0.02,
  },
  galleryPickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.02,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  galleryPickerScroll: {
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.02,
  },
  galleryPickerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: width * 0.025,
  },
  galleryPickerImageWrapper: {
    width: (width * 0.9 - width * 0.1 - width * 0.05) / 3,
    aspectRatio: 1,
    borderRadius: width * 0.02,
    overflow: 'hidden',
    backgroundColor: '#e5e7eb',
  },
  galleryPickerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },



  viewerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  fullImage: {
    width: "100%",
    height: "100%",
  },
  closeBtn: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 10,
  },

  demoBox: {
    backgroundColor: '#E5E7EB',
    opacity: 0.7,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: height * 0.2,
  },
  flagButton: {
    borderWidth: 1,
    borderColor: '#fff',
    backgroundColor: 'rgba(216, 216, 216, 0.43)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },





});

export default FolderLayout;