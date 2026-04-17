import React, { useContext, useState } from "react";
import { View, Text, TextInput, ScrollView, StyleSheet, Platform, TouchableOpacity } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

//svg
import QR from "../../assets/svg/qr.svg";
import Calender from "../../assets/svg/calender.svg";
import BackArrow from "../../assets/svg/backArrow.svg";

//components
import FolderLayout from "../screen/FolderLayout";
import ThemeButton from "../components/ThemeButton";
import { EventContext } from "../context/EventContext";

const createEvent = require("../../assets/createEvent.png");

const CreateEventFour = ({ navigation, route }) => {
    // separate states for each field
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date());

    const [showStartDate, setShowStartDate] = useState(false);
    const [showEndDate, setShowEndDate] = useState(false);
    const [showStartTime, setShowStartTime] = useState(false);
    const [showEndTime, setShowEndTime] = useState(false);

    const [uploadedImage, setUploadedImage] = useState(null);


    const [inputData, setInputData] = useState("");

    const newEvent = route.params?.newEvent;


    const { addEvent } = useContext(EventContext);






    const onChangeStartDate = (event, selectedDate) => {
        setShowStartDate(Platform.OS === "ios");
        if (selectedDate) setStartDate(selectedDate);
    };

    const onChangeEndDate = (event, selectedDate) => {
        setShowEndDate(Platform.OS === "ios");
        if (selectedDate) setEndDate(selectedDate);
    };

    const onChangeStartTime = (event, selectedTime) => {
        setShowStartTime(Platform.OS === "ios");
        if (selectedTime) setStartTime(selectedTime);
    };

    const onChangeEndTime = (event, selectedTime) => {
        setShowEndTime(Platform.OS === "ios");
        if (selectedTime) setEndTime(selectedTime);
    };

    const { folderName, owner } = route.params || {
        folderName: "Untitled Folder",
        owner: "NA",
    };

    return (
        <FolderLayout
            navigation={navigation}
            image={createEvent}
            folderName="Create Event"
            date="Sep 19"
            owner="A"
            inviteText="+ invite a friend" onInvitePress={() => navigation.navigate("InviteHiveMember")}
            RightIcon={<QR height={16} width={16} />}
        >
            <ScrollView style={{ padding: 20, flex: 1 }}>
                {/* Header */}
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 20 }}>
                    <Calender width={24} height={24} />
                    <Text style={{ fontSize: 18, fontWeight: "600" }}>Upload Approval</Text>
                </View>

                {/* Start Date */}
                <View>
                    <Text style={{ marginBottom: 10 }}>Auto upload Upload Approval</Text>
                    <TouchableOpacity onPress={() => setShowStartDate(true)}>
                        <TextInput
                            value={inputData}
                            style={styles.input}
                            editable={false}
                            placeholder="Auto-upload & share"
                        />
                    </TouchableOpacity>
                    {showStartDate && (
                        <DateTimePicker
                            value={startDate}
                            mode="date"
                            display="default"
                            onChange={onChangeStartDate}
                        />
                    )}
                </View>

                {/* End Date */}
                <View>
                    <Text style={{ marginBottom: 10 }}>Require approval</Text>
                    <TouchableOpacity onPress={() => setShowEndDate(true)}>
                        <TextInput
                            value={endDate.toDateString()}
                            style={styles.input}
                            editable={false}
                        />
                    </TouchableOpacity>
                    {showEndDate && (
                        <DateTimePicker
                            value={endDate}
                            mode="date"
                            display="default"
                            onChange={onChangeEndDate}
                        />
                    )}
                </View>


                <View style={styles.inputContainer}>
                    <Text style={{ marginBottom: 10 }}>Access Control</Text>
                    <TouchableOpacity onPress={() => setShowStartTime(true)}>
                        <TextInput
                            value={startTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            style={styles.input}
                            editable={false}
                        />
                        <BackArrow width={24} height={24} style={styles.timerIcon} />
                    </TouchableOpacity>
                    {showStartTime && (
                        <DateTimePicker
                            value={startTime}
                            mode="time"
                            display="default"
                            onChange={onChangeStartTime}
                        />
                    )}
                </View>

                <Text style={{ color: '#A8A8A8' }}>You can now create events with complete control over media sharing, dates, times, and attendee access. The QR code and passcode system makes it easy for attendees to join and share media at your events.</Text>


                {/* Continue Button */}
                <ThemeButton
                    text="Create event"
                    onPress={() => {
                        if (newEvent) {
                            addEvent(newEvent);
                            navigation.navigate("Home");
                        } else {
                            Alert.alert("Something went wrong, try again!");
                        }
                    }}
                    style={{ marginTop: 40 }}
                />
            </ScrollView>
        </FolderLayout>
    );
};

const styles = StyleSheet.create({
    input: {
        borderWidth: 1,
        borderColor: "#EDEDED",
        borderRadius: 6,
        marginBottom: 20,
        backgroundColor: "#FAFAFA",
        paddingVertical: 18,
        paddingHorizontal: 14,
    },
    inputContainer: {
        position: "relative",
    },
    timerIcon: {
        position: "absolute",
        top: 20,
        right: 20,
    },
});

export default CreateEventFour;
