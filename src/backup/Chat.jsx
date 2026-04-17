import { View, ScrollView, Image, StyleSheet, TouchableOpacity, TextInput, Dimensions, KeyboardAvoidingView, Platform, Keyboard } from 'react-native'; 
import React, { useEffect, useState, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  setDoc,
  doc
} from "firebase/firestore";

import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomText from '../components/CustomText';
import { ArrowLeft, Ellipsis, SendHorizonal } from "lucide-react-native";
import { db } from "../firebaseConfig";
import { generateChatId } from "../utils/chatUtils";

const { width, height } = Dimensions.get("window");

const dp = require("../../assets/dp.jpg");

const Chat = ({ route, navigation }) => {

  const { user } = route.params; 
  const [loggedUser, setLoggedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const scrollRef = useRef();

  // Load logged in user
  useEffect(() => {
    const loadUser = async () => {
      const u = JSON.parse(await AsyncStorage.getItem("user"));
      setLoggedUser(u);
    };
    loadUser();
  }, []);

  // Listen to Firestore messages
  useEffect(() => {
    if (!loggedUser) return;

    const chatId = generateChatId(loggedUser.id, user._id);
    const msgRef = collection(db, "chats", chatId, "messages");

    const q = query(msgRef, orderBy("createdAt", "asc"));

    const unsub = onSnapshot(q, (snap) => {
      const msgs = snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          ...data,
          createdAt: data.createdAt ? data.createdAt.toDate() : new Date(),
        };
      });

      setMessages(msgs);

      setTimeout(() => {
        if (scrollRef.current) scrollRef.current.scrollToEnd({ animated: true });
      }, 100);
    });

    return unsub;
  }, [loggedUser]);


  // Send message
  const sendMessage = async () => {
    if (!text.trim()) return;

    const chatId = generateChatId(loggedUser.id, user._id);

    await addDoc(collection(db, "chats", chatId, "messages"), {
      text,
      senderId: loggedUser.id,
      createdAt: new Date(),
    });

    await setDoc(
      doc(db, "chats", chatId),
      {
        users: [loggedUser.id, user._id],
        lastMessage: text,
        updatedAt: new Date(),
      },
      { merge: true }
    );

    setText("");
    Keyboard.dismiss();
  };

  if (!loggedUser) return null;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: width * 0.025 }} >
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <ArrowLeft size={width * 0.06} />
            </TouchableOpacity>

            <View style={styles.profileContainer}>
              <View style={styles.displayPictureContainer}>
                <Image source={dp} style={styles.displayPicture} />
              </View>
              <View>
                <CustomText weight="bold" style={styles.userName}>{user.email}</CustomText>
                <CustomText weight="medium" style={{ fontSize: width * 0.03, color: '#00A236' }}>Online</CustomText>
              </View>
            </View>
          </View>
          <Ellipsis size={width * 0.06} />
        </View>

        {/* Messages */}
        <ScrollView 
          ref={scrollRef} 
          contentContainerStyle={{ paddingHorizontal: width * 0.0625, flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.messagesContainer}>

            {messages.map((msg) => {
              const isMe = msg.senderId === loggedUser.id;

              return (
                <View
                  key={msg.id}
                  style={isMe ? styles.userTwoMessageBox : styles.userOneMessageBox}
                >
                  <View style={isMe ? styles.messageText : styles.messageTextLeft}>
                    <CustomText weight="medium" style={{ fontSize: width * 0.033 }}>
                      {msg.text}
                    </CustomText>

                    <View style={isMe ? styles.messageArrowRight : styles.messageArrowLeft} />
                  </View>

                  <CustomText weight="medium" style={{ fontSize: width * 0.025 }}>
                    {msg.createdAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </CustomText>
                </View>
              );
            })}

          </View>
        </ScrollView>

        {/* Input Bar */}
        <View style={styles.inputBar}>
          <TextInput
            style={styles.inputType}
            placeholder="Type here.."
            placeholderTextColor="#AAAAAA"
            value={text}
            onChangeText={setText}
            multiline={false}
            returnKeyType="send"
            onSubmitEditing={sendMessage}
            blurOnSubmit={false}
            autoCapitalize="sentences"
            autoCorrect={true}
          />

          <TouchableOpacity onPress={sendMessage} style={styles.sendBtn}>
            <SendHorizonal size={width * 0.06} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Chat;


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFAF9" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.0625,
    marginBottom: height * 0.01,
    backgroundColor: "#FAFAF9",
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

  messagesContainer: { paddingTop: height * 0.01, paddingBottom: height * 0.02 },

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
    paddingVertical: height * 0.013,
    paddingHorizontal: width * 0.07,
    maxWidth: width * 0.65,
    position: "relative",
  },

  messageTextLeft: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: height * 0.013,
    paddingHorizontal: width * 0.07,
    maxWidth: width * 0.65,
    position: "relative",
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

  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.05,
    backgroundColor: "#FAFAF9",
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
  },

  inputType: {
    borderWidth: 1,
    borderColor: "#D9D9D9",
    borderRadius: 50,
    paddingLeft: width * 0.05,
    paddingRight: width * 0.03,
    width: width * 0.70,
    height: width * 0.11,
    backgroundColor: "#fff",
    fontSize: width * 0.04,
    color: "#000",
  },

  sendBtn: {
    width: width * 0.13,
    height: width * 0.13,
    backgroundColor: "#DA3C84",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
});