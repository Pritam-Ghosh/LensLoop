import { View, ScrollView, Image, StyleSheet, TouchableOpacity, TextInput, Dimensions, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';



import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomText from '../components/CustomText';
import { ArrowLeft, Ellipsis, SendHorizonal } from "lucide-react-native";


import BackgroungUI from '../components/BackgroundUI';

const { width, height } = Dimensions.get("window");

const dp = require("../../assets/dp.jpg");

const Chat = ({ route, navigation }) => {

  const { user, hiveId } = route.params;
  const [loggedUser, setLoggedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [deleteModal, setDeleteModal] = useState(false);


  const [isTyping, setIsTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);


  const scrollRef = useRef();

  // Load logged in user
  useEffect(() => {
    const loadUser = async () => {
      const u = JSON.parse(await AsyncStorage.getItem("user"));
      setLoggedUser(u);
    };
    loadUser();
  }, []);





  // Send message
  const sendMessage = async () => {
    if (!text.trim()) return;

    const newMsg = {
      id: Date.now().toString(),
      text,
      senderId: loggedUser._id,
      createdAt: new Date(),
      deletedFor: [],
      isDeleted: false,
    };

    const key = `CHAT_${hiveId}_${loggedUser._id}_${user._id}`;

    const stored = await AsyncStorage.getItem(key);
    let msgs = stored ? JSON.parse(stored) : [];

    msgs.push(newMsg);

    await AsyncStorage.setItem(key, JSON.stringify(msgs));

    setMessages(msgs);
    setText("");
    Keyboard.dismiss();

    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };



  const toggleSelect = (id) => {
    setSelectedMessages(prev =>
      prev.includes(id)
        ? prev.filter(x => x !== id)
        : [...prev, id]
    );
  };
  const deleteForMe = async () => {
    const key = `CHAT_${hiveId}_${loggedUser._id}_${user._id}`;

    const stored = await AsyncStorage.getItem(key);
    let msgs = stored ? JSON.parse(stored) : [];

    msgs = msgs.map(m =>
      selectedMessages.includes(m.id)
        ? { ...m, deletedFor: [...(m.deletedFor || []), loggedUser._id] }
        : m
    );

    await AsyncStorage.setItem(key, JSON.stringify(msgs));
    setMessages(msgs);

    setSelectedMessages([]);
    setDeleteModal(false);
  };

  const deleteForEveryone = async () => {
    const key = `CHAT_${hiveId}_${loggedUser._id}_${user._id}`;

    const stored = await AsyncStorage.getItem(key);
    let msgs = stored ? JSON.parse(stored) : [];

    msgs = msgs.map(m =>
      selectedMessages.includes(m.id)
        ? { ...m, text: "", isDeleted: true }
        : m
    );

    await AsyncStorage.setItem(key, JSON.stringify(msgs));
    setMessages(msgs);

    setSelectedMessages([]);
    setDeleteModal(false);
  };



  if (!loggedUser) return null;

  return (
    <BackgroungUI style={styles.container}>
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
                <Image
                  source={
                    user.profileImage
                      ? { uri: user.profileImage }
                      : dp
                  }
                  style={styles.displayPicture}
                />
              </View>
              <View>
                <CustomText weight="bold" style={styles.userName}>{user.name}</CustomText>
                <CustomText
                  weight="medium"
                  style={{
                    fontSize: width * 0.03,
                    color: otherUserTyping ? "#DA3C84" : "#00A236"
                  }}
                >
                  Online
                </CustomText>

              </View>
            </View>
          </View>
          {/* <Ellipsis size={width * 0.06} /> */}
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

              if (msg.deletedFor?.includes(loggedUser._id)) return null;

              const isMe = msg.senderId === loggedUser._id;
              const isSelected = selectedMessages.includes(msg.id);

              return (
                <TouchableOpacity
                  key={msg.id}
                  onLongPress={() => {
                    toggleSelect(msg.id);
                    setDeleteModal(true);
                  }}
                  onPress={() => selectedMessages.length && toggleSelect(msg.id)}
                  activeOpacity={0.8}
                >

                  <View
                    style={[
                      isMe ? styles.userTwoMessageBox : styles.userOneMessageBox,
                      isSelected && { backgroundColor: "#E5F0FF" }
                    ]}
                  >
                    <View style={isMe ? styles.messageText : styles.messageTextLeft}>
                      <CustomText weight="medium" style={{ fontSize: width * 0.033 }}>
                        {msg.isDeleted ? "This message was deleted" : msg.text}
                      </CustomText>

                      <View style={isMe ? styles.messageArrowRight : styles.messageArrowLeft} />
                    </View>

                    <CustomText weight="medium" style={{ fontSize: width * 0.025 }}>
                      {msg.createdAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </CustomText>

                  </View>

                </TouchableOpacity>
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
      {deleteModal && (
        <View style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          backgroundColor: "#fff",
          padding: 20,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20
        }}>

          <TouchableOpacity onPress={deleteForEveryone}>
            <CustomText weight="bold">Delete for Everyone</CustomText>
          </TouchableOpacity>

          <TouchableOpacity onPress={deleteForMe} style={{ marginTop: 15 }}>
            <CustomText weight="bold">Delete for Me</CustomText>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setDeleteModal(false);
              setSelectedMessages([]);
            }}
            style={{ marginTop: 15 }}
          >
            <CustomText>Cancel</CustomText>
          </TouchableOpacity>

        </View>
      )}

    </BackgroungUI>
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
    backgroundColor: "#fafaf948",
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
    backgroundColor: "#fafaf962",
    borderTopWidth: 1,
    borderTopColor: "#e5e5e5",
  },

  inputType: {
    borderWidth: 1,
    borderColor: "#D9D9D9",
    borderRadius: 50,
    paddingLeft: width * 0.05,
    paddingRight: width * 0.03,
    width: width * 0.70,
    height: width * 0.11,
    backgroundColor: "#ffffffec",
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