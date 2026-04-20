// import React, { useEffect } from "react";
// import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, TouchableHighlight } from "react-native";
// import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
// import { useNotification } from "../context/NotificationContext";
// import TopNav from "../components/TopNavbar";
// import BackgroundUI from "../components/BackgroundUI";
// import BackNavigator from "../../assets/svg/backNavigator.svg";
// import CreateAlbum from "../../assets/svg/createAlbum.svg";
// import CreateFolder from "../../assets/svg/createFolder.svg";

// // Local images
// const NotificationScreen = ({ navigation }) => {
//   const { notifications, markAllAsRead } = useNotification();
//   useEffect(() => {
//     markAllAsRead();
//   }, []);
//   return (
//     <BackgroundUI>

//         <TopNav />
//         <ScrollView style={styles.scrollContainer}>
//           <TouchableOpacity onPress={() => navigation.goBack()}>
//             <BackNavigator width={20} height={20} style={{ marginTop: 10 }} />
//           </TouchableOpacity>
//           <Text style={{ fontSize: 18, fontWeight: "600", marginTop: 10 }}>Notifications</Text>

//           <View style={{ flexDirection: "row", gap: 10, marginVertical: 20 }}>
//             <View style={[styles.badge, styles.badgeActive]}>
//               <Text style={styles.badgeText}>Today</Text>
//             </View>
//           </View>

//           <View style={styles.chatList}>
//             {notifications.map((item) => (
//               <TouchableOpacity
//                 key={item.id}
//                 activeOpacity={0.7}
//                 onPress={() =>navigation.navigate('AutoCreateHive')}
//                 style={{ borderRadius: 10 }}
//               >
//                 <View style={styles.chatListItem}>
//                   <View style={{ flexDirection: "row", alignItems: "center", gap: 15 }}>
//                     <Image source={item.image} style={styles.dp} />
//                     <View>
//                       <Text style={{ fontSize: 15, fontWeight: "500" }}>{item.name}</Text>
//                       <Text style={{ color: "#A8A8A8", fontSize: 12 }}>{item.time}</Text>
//                     </View>
//                   </View>

//                   {item.iconType === "album" ? (
//                     <CreateAlbum width={30} height={30} />
//                   ) : (
//                     <CreateFolder width={30} height={30} />
//                   )}
//                 </View>
//               </TouchableOpacity>
//             ))}
//           </View>

//         </ScrollView>

//     </BackgroundUI>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#fff" },
//   scrollContainer: { paddingHorizontal: 20, paddingVertical: 10 },
//   badge: { backgroundColor: "gray", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 25 },
//   badgeText: { color: "white", fontSize: 14, fontWeight: "600" },
//   badgeActive: { backgroundColor: "#DA3C84", borderRadius: 25 },
//   chatList: { marginBottom: 20 },
//   chatListItem: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     backgroundColor: "#FAFAFA",
//     gap: 15,
//     marginBottom: 20,
//     paddingHorizontal: 20,
//     paddingVertical: 20,
//     borderRadius: 10,
//   },
//   dp: { width: 51, height: 51, borderRadius: 25, resizeMode: "cover" },
// });

// export default NotificationScreen;


// NotificationScreen.js

import React from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  StatusBar,
} from 'react-native';
import BackgroungUI from '../components/BackgroundUI';
import TopNav from '../components/TopNavbar';

const notifications = [
  {
    id: '1',
    username: 'john_doe',
    message: 'liked your photo',
    time: '2h',
    avatar: 'https://i.pravatar.cc/150?img=1',
    postImage: 'https://picsum.photos/200',
    unread: true,
  },
  {
    id: '2',
    username: 'sarah',
    message: 'started following you',
    time: '5h',
    avatar: 'https://i.pravatar.cc/150?img=2',
    unread: false,
  },
  {
    id: '3',
    username: 'alex',
    message: 'commented: Nice shot!',
    time: '1d',
    avatar: 'https://i.pravatar.cc/150?img=3',
    postImage: 'https://picsum.photos/201',
    unread: true,
  },
];

const NotificationItem = ({ item }) => {
  return (
    <View style={styles.itemContainer}>

      {/* Avatar */}
      <Image source={{ uri: item.avatar }} style={styles.avatar} />

      {/* Text */}
      <View style={styles.textContainer}>
        <Text style={styles.text}>
          <Text style={styles.username}>{item.username} </Text>
          {item.message}
        </Text>
        <Text style={styles.time}>{item.time}</Text>
      </View>

      {/* Post Preview */}
      {item.postImage && (
        <Image source={{ uri: item.postImage }} style={styles.postImage} />
      )}

      {/* Unread Dot */}
      {item.unread && <View style={styles.unreadDot} />}
    </View>
  );
};

const NotificationScreen = () => {
  return (

    <BackgroungUI>
<TopNav/>
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />

        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <NotificationItem item={item} />}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </View>


    </BackgroungUI>

  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
  },

  avatar: {
    width: 45,
    height: 45,
    borderRadius: 50,
  },

  textContainer: {
    flex: 1,
    marginHorizontal: 10,
  },

  text: {
    fontSize: 14,
    color: '#000',
  },

  username: {
    fontWeight: 'bold',
  },

  time: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },

  postImage: {
    width: 40,
    height: 40,
    borderRadius: 6,
  },

  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3897f0',
    marginLeft: 6,
  },

  separator: {
    height: 0.5,
    backgroundColor: '#eee',
    marginLeft: 70,
  },
});