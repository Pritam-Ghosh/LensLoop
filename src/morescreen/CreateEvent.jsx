import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import FolderLayout from "../screen/FolderLayout";
import Cloud from "../../assets/svg/cloud.svg";
import QR from "../../assets/svg/qr.svg";
import Utility from "../../assets/svg/utility.svg";
import ThemeButton from "../components/ThemeButton";
import { EventContext } from "../context/EventContext"; // ✅ import context
const createEvent = require("../../assets/createEvent.png");

const CreateEvent = ({ navigation, route }) => {
  const [code, setCode] = useState("");
  const [selectedEventType, setSelectedEventType] = useState("");
  const { addEvent } = useContext(EventContext); // ✅ use context

  const eventTypes = [
    "Corporate",
    "Birthday Party",
    "Wedding",
    "Reunion",
    "Others..",
  ];

  // Photos passed from PhotoShare (if any)
  const selectedPhotos = route.params?.selectedImages || [];

const handleCreateEvent = () => {
  if (!code.trim() || !selectedEventType) {
    Alert.alert("Please fill all fields");
    return;
  }

  if (selectedPhotos.length === 0) {
    Alert.alert("Please select at least one photo for your event");
    return;
  }

  const newEvent = {
    img: { uri: selectedPhotos[0].uri },
    title: code,
    count: `${selectedPhotos.length} Photos`,
    photos: selectedPhotos,
    type: selectedEventType,
  };

  //  Go to CreateEventTwo and pass newEvent
  navigation.navigate("CreateEventTwo", { newEvent });
};


  return (
    <FolderLayout
      navigation={navigation}
      image={createEvent}
      folderName="Create Event"
      date="Sep 19"
      owner="A"
      inviteText="+ invite a friend"
      onInvitePress={() => navigation.navigate("InviteHiveMember")}
      RightIcon={<QR height={16} width={16} />}
    >
      <ScrollView style={{ padding: 20, flex: 1 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            marginBottom: 20,
          }}
        >
          <Utility width={24} height={24} />
          <Text style={{ fontSize: 18, fontWeight: "600" }}>Event Details</Text>
        </View>

        <Text style={{ marginTop: 24 }}>Event Type *</Text>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 10,
            marginTop: 27,
          }}
        >
          {eventTypes.map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.badge,
                {
                  backgroundColor:
                    selectedEventType === type ? "#FDD32E" : "#ffffffff",
                },
              ]}
              onPress={() => setSelectedEventType(type)}
            >
              <Text>{type}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TextInput
          value={code}
          onChangeText={setCode}
          placeholder="Enter Your Event name"
          style={styles.input}
          keyboardType="default"
          autoCapitalize="none"
          placeholderTextColor="#000"
          autoCorrect={false}
        />

        <ThemeButton
          text="Continue"
          style={{ marginTop: 31 }}
          onPress={handleCreateEvent}
        />
      </ScrollView>
    </FolderLayout>
  );
};

const styles = StyleSheet.create({
  badge: {
    backgroundColor: "#FAFAFA",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 6,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "#EDEDED",
    borderStyle: "solid",
    marginTop: 10,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: "#ccccccb4",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginTop: 41,
    fontWeight: "600",
  },
});

export default CreateEvent;
