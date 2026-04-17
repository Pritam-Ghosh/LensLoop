import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  getFirestore,
  collection,
  doc,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  setDoc,
} from "@react-native-firebase/firestore";

import { ArrowLeft, Ellipsis, ImagePlus, SendHorizonal } from "lucide-react-native";
import CustomText from "../components/CustomText";
import CameraIcon from "../../assets/svg/cameraIcon.svg";
import { generateChatId } from "../utils/chatUtils";

const { width, height } = Dimensions.get("window");

const dp = require("../../assets/dp.jpg"); // fallback DP

const Chat = ({ navigation, route }) => {
  const { user } = route.params; // user you are chatting with
  const [loggedUser, setLoggedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const scrollRef = useRef();
  const db = getFirestore();

  // Load logged In user
  useEffect(() => {
    const loadUser = async () => {
      const u = JSON.parse(await AsyncStorage.getItem("user"));
      setLoggedUser(u);
    };
    loadUser();
  }, []);

  // Listen to chat messages
  useEffect(() => {
    if (!loggedUser) return;

    const chatId = generateChatId(loggedUser._id, user._id);
    const msgRef = collection(db, "chats", chatId, "messages");

    const q = query(msgRef, orderBy("createdAt", "asc"));

    const unsub = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      setMessages(msgs);

      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      }, 100);
    });

    return unsub;
  }, [loggedUser]);

  // Send message
  const sendMessage = async () => {
    if (!text.trim()) return;

    const chatId = generateChatId(loggedUser._id, user._id);

    const messageData = {
      text,
      senderId: loggedUser._id,
      createdAt: new Date(),
    };

    await addDoc(collection(db, "chats", chatId, "messages"), messageData);

    await setDoc(
      doc(db, "chats", chatId),
      {
        users: [loggedUser._id, user._id],
        lastMessage: text,
        updatedAt: new Date(),
      },
      { merge: true }
    );

    setText("");
  };

  if (!loggedUser) return null;

  return (
    <SafeAreaView style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: width * 0.025 }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowLeft size={width * 0.06} />
          </TouchableOpacity>

          <View style={styles.profileContainer}>
            <View style={styles.displayPictureContainer}>
              <Image
                source={user.profileImage ? { uri: user.profileImage } : dp}
                style={styles.displayPicture}
              />
            </View>
            <View>
              <CustomText weight="bold" style={styles.userName}>
                {user.name || user.email}
              </CustomText>
              <CustomText weight="medium" style={{ fontSize: width * 0.03, color: "#00A236" }}>
                Online
              </CustomText>
            </View>
          </View>
        </View>

        <Ellipsis size={width * 0.06} />
      </View>

      {/* CHAT MESSAGES */}
      <ScrollView ref={scrollRef} contentContainerStyle={styles.scrollContainer}>
        <View style={styles.messagesContainer}>
          {messages.map((msg, i) => {
            const isMe = msg.senderId === loggedUser._id;

            return (
              <View
                key={i}
                style={isMe ? styles.userTwoMessageBox : styles.userOneMessageBox}
              >
                <View style={isMe ? styles.messageText : styles.messageTextLeft}>
                  <CustomText
                    weight="medium"
                    style={{
                      color: "#636363",
                      fontSize: width * 0.032,
                    }}
                  >
                    {msg.text}
                  </CustomText>

                  {isMe ? <View style={styles.messageArrowRight} /> : <View style={styles.messageArrowLeft} />}
                </View>

                <CustomText weight="medium" style={{ fontSize: width * 0.025 }}>
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </CustomText>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* SEND MESSAGE */}
      <View
        style={{
          flexDirection: "row",
          gap: width * 0.025,
          paddingVertical: height * 0.02,
          paddingHorizontal: width * 0.0625,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            backgroundColor: "#DA3C84",
            height: width * 0.1,
            width: width * 0.1,
            borderRadius: 50,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CameraIcon height={width * 0.06} width={width * 0.06} />
        </View>

        <View style={{ position: "relative" }}>
          <TextInput
            style={styles.inputType}
            placeholder="Type here.."
            placeholderTextColor="#AAAAAA"
            value={text}
            onChangeText={setText}
          />

          <ImagePlus size={width * 0.06} color="#575757" style={styles.send} />
        </View>

        <TouchableOpacity
          onPress={sendMessage}
          style={{
            width: width * 0.11,
            height: width * 0.11,
            backgroundColor: "#DA3C84",
            borderRadius: 50,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <SendHorizonal size={width * 0.06} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Chat;

/* --------------------------- STYLES --------------------------- */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFAF9" },
  scrollContainer: { paddingHorizontal: width * 0.0625 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: width * 0.03,
    marginBottom: height * 0.025,
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.0625,
  },
  profileContainer: { flexDirection: "row", alignItems: "center", gap: width * 0.025 },
  displayPictureContainer: {
    width: width * 0.11,
    height: width * 0.11,
    borderRadius: 50,
    overflow: "hidden",
  },
  displayPicture: { width: "100%", height: "100%", resizeMode: "cover" },
  userName: { fontSize: width * 0.04, fontWeight: "600", color: "#000" },
  messagesContainer: { flex: 1, paddingTop: height * 0.01 },
  userOneMessageBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: width * 0.045,
    marginVertical: height * 0.015,
  },
  userTwoMessageBox: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: width * 0.045,
    marginVertical: height * 0.015,
  },
  messageText: {
    backgroundColor: "#FFE49A",
    borderRadius: 10,
    paddingVertical: height * 0.0137,
    paddingHorizontal: width * 0.07,
    maxWidth: width * 0.65,
    elevation: 3,
  },
  messageTextLeft: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: height * 0.0137,
    paddingHorizontal: width * 0.07,
    maxWidth: width * 0.65,
    elevation: 3,
  },
  messageArrowRight: {
    position: "absolute",
    right: -5,
    bottom: 2,
    borderTopWidth: 8,
    borderTopColor: "transparent",
    borderBottomWidth: 8,
    borderBottomColor: "transparent",
    borderLeftWidth: 8,
    borderLeftColor: "#FFE49A",
  },
  messageArrowLeft: {
    position: "absolute",
    left: -5,
    bottom: 2,
    borderTopWidth: 8,
    borderTopColor: "transparent",
    borderBottomWidth: 8,
    borderBottomColor: "transparent",
    borderRightWidth: 8,
    borderRightColor: "#fff",
  },
  inputType: {
    borderWidth: 1,
    borderColor: "#D9D9D9",
    borderRadius: 50,
    paddingLeft: width * 0.05,
    width: width * 0.63,
    height: width * 0.11,
  },
  send: { position: "absolute", right: width * 0.03, top: "22%" },
});
