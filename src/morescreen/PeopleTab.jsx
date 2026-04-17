import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import React from 'react'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import TopNavbar from "../components/TopNavbar";
import Folder from '../../assets/svg/folder.svg'
import RightArrow from '../../assets/svg/rightArrow.svg'
import { useNavigation } from "@react-navigation/native";
const HomeScreen = () => {
  const navigation = useNavigation();


  // Dynamic folder data
  const folders = [
    {
      id: 1,
      name: "Japan Tour",
      description: "Various versions have evolved over the years, sometimes by accident",
      bgColor: "#ffd5e5ff",
    },
    {
      id: 2,
      name: "Work Project",
      description: "Meeting notes, documents, and resources",
      bgColor: "#d5f5e3",
    },
    {
      id: 3,
      name: "Personal Photos",
      description: "Family moments and travel pictures",
      bgColor: "#d6eaf8",
    },
  ];

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <TopNavbar />
        <ScrollView>
          <View style={{marginTop: 25}}>
            {folders.map((folder) => (
              <TouchableOpacity
                key={folder.id}
                style={styles.folderRow}
                onPress={() =>
                  navigation.navigate("PhotoFolder", {
                    folderName: folder.name,
                    description: folder.description,
                  })
                }
              >
                <View style={[styles.folderIconBg, { backgroundColor: folder.bgColor }]}>
                  <Folder width={31} height={31} />
                </View>

                {/* Text container */}
                <View style={styles.textContainer}>
                  <Text style={styles.folderName}>{folder.name}</Text>
                  <Text style={styles.folderDescription} numberOfLines={2}>
                    {folder.description}
                  </Text>
                </View>

                <RightArrow width={20} height={20} style={{ marginLeft: "auto" }} />
              </TouchableOpacity>
            ))}

          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({

  folderRow: {
    borderWidth: 1,
    borderColor: "#EFEFEF",
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    marginInline: 20,
    marginBottom: 25,
    paddingRight: 15,
  },
  folderIconBg: {
    width: 80,
    height: 80,
    backgroundColor: "#FEEDD1",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
    paddingInline: 10,
  },
  folderName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  folderDescription: {
    fontSize: 10,
    color: "#555",
    flexShrink: 1,
  },
})

export default HomeScreen