import { View, Text, ScrollView, StyleSheet, Dimensions, Animated, Image, TouchableWithoutFeedback, Modal, TextInput } from 'react-native'
import React, { useCallback, useState } from 'react'


//component
import TopNav from '../components/TopNavbar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Bookmark, Heart, MessageCircle, Plus, SendHorizontal, SendHorizontalIcon, Sparkles } from 'lucide-react-native';
import CustomText from '../components/CustomText';
import StatItem from '../components/StatItem';

import { t } from 'i18next';
import { colors } from '../Theme/theme';


const { width, height } = Dimensions.get('window');
const selfie = require("../../assets/selfie.jpg");
const dp3 = require("../../assets/dp3.jpg");
const dp4 = require("../../assets/dp4.jpg");
const dp5 = require("../../assets/dp5.jpg");




const MainScreen = ({ navigation }) => {

  const [fadeAnim] = useState(new Animated.Value(0));
  const [liked, setLiked] = useState(false);
  const [save, setSave] = useState(false);
  const [commentVisible, setCommentVisible] = useState(false);
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



  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }}>
        <TopNav />
        <ScrollView style={{ backgroundColor: '#f1f1f1', marginBottom: 85 }}>

          {/* status */}
          <View style={[styles.ImportSection, { overflow: 'hidden' }]}>
            <Animated.View
              style={{
                ...StyleSheet.absoluteFillObject,
                backgroundColor: '#db6abdff',
                opacity: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 0],
                }),
              }}
            />
            <Animated.Image
              source={require("../../assets/background.png")}
              style={{
                ...StyleSheet.absoluteFillObject,
                opacity: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 0.65],
                }),
              }}
              resizeMode="cover"
            />
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
              }}
            >
              <CustomText weight='semiBold' style={{ marginBottom: 12, color: '#fff' }}>Today in your hives ✨</CustomText>
              <View style={{ flexDirection: 'row', gap: 8 }}>

                <View style={{ alignItems: 'center' }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: width * 0.03,
                      backgroundColor: '#fff',
                      width: 70,
                      height: 70,
                      borderRadius: 50,
                    }}
                  >
                    <Plus color="#EA457F" />
                  </View>
                  <CustomText weight='medium' style={{ marginTop: 4, fontSize: 12, }}>Create</CustomText>
                </View>

                <View style={{ alignItems: 'center' }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: width * 0.03,
                      backgroundColor: '#fff',
                      width: 70,
                      height: 70,
                      borderRadius: 50,
                      borderWidth: 2,
                      borderColor: '#E83084',
                      padding: 2,
                    }}
                  >
                    <Image source={selfie} style={{ width: '100%', height: '100%', borderRadius: 50, }} resizeMode="cover" />
                  </View>
                  <CustomText weight='medium' style={{ marginTop: 4, fontSize: 12, }}>Ella</CustomText>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: width * 0.03,
                    backgroundColor: '#fff',
                    width: 70,
                    height: 70,
                    borderRadius: 50,
                    borderWidth: 2,
                    borderColor: '#dadada',
                    padding: 2,
                  }}
                >
                  <Image source={selfie} style={{ width: '100%', height: '100%', borderRadius: 50, }} resizeMode="cover" />
                </View>
              </View>
            </View>
          </View>




          {/* feed */}
          <View style={{ backgroundColor: "#fff", margin: 10, padding: 20, borderRadius: 20, marginTop: -20, marginBottom: 10, }}>

            {/* clickable header */}
            <TouchableWithoutFeedback onPress={() => navigation.navigate('FolderLayout')}>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <View style={{ width: 50, height: 50, borderWidth: 1, borderRadius: 50 }}>
                  <Image
                    source={selfie}
                    style={{ width: '100%', height: '100%', borderRadius: 50 }}
                    resizeMode="cover"
                  />
                </View>

                <View>
                  <CustomText weight='semiBold' style={{ fontSize: 17 }}>kasol trip</CustomText>
                  <CustomText weight='regular' style={{ fontSize: 13, color: '#696969' }}>
                    Laora Brown uploaded 4 photo · 2h
                  </CustomText>
                </View>
              </View>
            </TouchableWithoutFeedback>


            {/* image scroll */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ marginTop: 18 }}
            >
              <View style={{ flexDirection: "row", gap: 5 }}>

                <View style={styles.multiImagePosts}>
                  <Image
                    source={selfie}
                    style={{ width: "100%", height: "100%", borderRadius: 10 }}
                    resizeMode="cover"
                  />
                </View>

                <View style={styles.multiImagePosts}>
                  <Image
                    source={dp3}
                    style={{ width: "100%", height: "100%", borderRadius: 10 }}
                    resizeMode="cover"
                  />
                </View>

                <View style={styles.multiImagePosts}>
                  <Image
                    source={dp4}
                    style={{ width: "100%", height: "100%", borderRadius: 10 }}
                    resizeMode="cover"
                  />
                </View>

                <View style={styles.multiImagePosts}>
                  <Image
                    source={dp5}
                    style={{ width: "100%", height: "100%", borderRadius: 10 }}
                    resizeMode="cover"
                  />
                </View>

              </View>
            </ScrollView>


            {/* actions */}
            <View style={{ flexDirection: 'row', marginTop: 12, justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <StatItem
                  icon={Heart}
                  value={43}
                  liked={liked}
                  onPress={() => setLiked(!liked)}
                />
                <StatItem
                  icon={MessageCircle}
                  value={12}
                  onPress={() => setCommentVisible(true)}
                />
              </View>

              <StatItem icon={Bookmark} />
            </View>

          </View>

          <View style={{ backgroundColor: "#fff", margin: 10, padding: 20, borderRadius: 20, marginBottom: 10, }}>

            {/* clickable header */}
            <TouchableWithoutFeedback onPress={() => navigation.navigate('FolderLayout')}>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <View style={{ width: 50, height: 50, borderWidth: 1, borderRadius: 50 }}>
                  <Image
                    source={selfie}
                    style={{ width: '100%', height: '100%', borderRadius: 50 }}
                    resizeMode="cover"
                  />
                </View>

                <View>
                  <CustomText weight='semiBold' style={{ fontSize: 17 }}>kasol trip</CustomText>
                  <CustomText weight='regular' style={{ fontSize: 13, color: '#696969' }}>
                    Laora Brown uploaded 1 photo · 5h
                  </CustomText>
                </View>
              </View>
            </TouchableWithoutFeedback>

            <View
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ marginTop: 18 }}
            >
              <View style={{ flexDirection: "row", gap: 5 }}>

                <View style={styles.singleImagePosts}>
                  <Image
                    source={dp5}
                    style={{ width: "100%", height: "100%", borderRadius: 16 }}
                    resizeMode="cover"
                  />
                </View>

              </View>
            </View>


            {/* actions */}
            <View style={{ flexDirection: 'row', marginTop: 12, justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <StatItem
                  icon={Heart}
                  value={43}
                  liked={liked}
                  onPress={() => setLiked(!liked)}
                />
                <StatItem icon={MessageCircle} value={12} />
              </View>

              <StatItem icon={Bookmark} />
            </View>

          </View>
        </ScrollView>









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

                  <View style={{ flexDirection: "row", marginBottom: 15 }}>
                    <Image source={selfie} style={{ width: 36, height: 36, borderRadius: 18, marginRight: 10 }} />

                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <CustomText weight="semiBold" style={{ marginRight: 6 }}>Pritam</CustomText>
                        <CustomText style={{ color: "#888", fontSize: 12 }}>2m</CustomText>
                      </View>

                      <CustomText style={{ marginTop: 2 }}>This is a demo comment for SnapHive. Looks great! 🔥</CustomText>
                    </View>
                  </View>

                </View>

                <View style={{ flexDirection: "row", alignItems: "center", borderTopWidth: 1, borderColor: "#eee", paddingTop: 10 }}>
                  <Image source={selfie} style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10 }} />

                  <View style={{ flex: 1, borderWidth: 1, borderColor: "#ddd", borderRadius: 25, paddingHorizontal: 12, paddingVertical: 6, marginRight: 10 }}>
                    <TextInput placeholder="Write a comment..." style={{ width: "100%" }} />
                  </View>

                  <TouchableWithoutFeedback>
                    <View style={{ padding: 10, backgroundColor: colors.primary, borderRadius: 25, alignItems: "center", justifyContent: "center" }}>
                      <SendHorizontalIcon color="#fff" />
                    </View>
                  </TouchableWithoutFeedback>

                </View>

              </View>
            </View>

          </View>
        </Modal>
      </SafeAreaView>
    </SafeAreaProvider>

  )
}

export default MainScreen

const styles = StyleSheet.create({

  // status
  ImportSection: {
    paddingLeft: width * 0.06,
    paddingRight: width * 0.06,
    paddingBottom: width * 0.08,
    paddingTop: width * 0.04,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
      },
      android: {

      },
    }),
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
  }

})