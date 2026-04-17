import React, { useState, useContext } from "react";
import { View, Text, TextInput, ScrollView, StyleSheet, Platform, TouchableOpacity, Alert } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import CheckBox from '@react-native-community/checkbox';
//svg
import QR from "../../assets/svg/qr.svg";
import Calender from "../../assets/svg/calender.svg";
import Timer from "../../assets/svg/timer.svg";

//components
import FolderLayout from "../screen/FolderLayout";
import ThemeButton from "../components/ThemeButton";
import { EventContext } from "../context/EventContext";

const createEvent = require("../../assets/createEvent.png");

const CreateEventThree = ({ navigation, route }) => {

    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date());
    const [isSelected, setSelection] = useState(false);
    const [showStartDate, setShowStartDate] = useState(false);
    const [showEndDate, setShowEndDate] = useState(false);
    const [showStartTime, setShowStartTime] = useState(false);
    const [showEndTime, setShowEndTime] = useState(false);


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
                    <Text style={{ fontSize: 18, fontWeight: "600" }}>Event Date & Times</Text>
                </View>

                {/* Start Date */}
                <View>
                    <Text style={{ marginBottom: 10 }}>Start Date *</Text>
                    <TouchableOpacity onPress={() => setShowStartDate(true)}>
                        <TextInput
                            value={startDate.toDateString()}
                            style={[styles.input, {marginBottom: 18}]}
                            editable={false} 
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
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 35 }}>
                        <CheckBox
                            value={isSelected}
                            onValueChange={setSelection}
                            tintColors={{ true: "#4CAF50", false: "#ccc" }}
                        />
                        <Text>No ending date</Text>
                    </View>
                </View>



                {/* End Date */}
                <View>
                    <Text style={{ marginBottom: 10 }}>End Date *</Text>
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


                {/* Start Date */}
                <View>
                    <Text style={{ marginBottom: 10 }}>Start Date *</Text>
                    <TouchableOpacity onPress={() => setShowStartDate(true)}>
                        <TextInput
                            value={startDate.toDateString()}
                            style={styles.input}
                            editable={false} // disable typing
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

                {/* Start Time */}
                <View style={styles.inputContainer}>
                    <Text style={{ marginBottom: 10 }}>Start Time *</Text>
                    <TouchableOpacity onPress={() => setShowStartTime(true)}>
                        <TextInput
                            value={startTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            style={styles.input}
                            editable={false}
                        />
                        <Timer width={24} height={24} style={styles.timerIcon} />
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

                {/* End Time */}
                <View style={styles.inputContainer}>
                    <Text style={{ marginBottom: 10 }}>End Time *</Text>
                    <TouchableOpacity onPress={() => setShowEndTime(true)}>
                        <TextInput
                            value={endTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            style={styles.input}
                            editable={false}
                        />
                        <Timer width={24} height={24} style={styles.timerIcon} />
                    </TouchableOpacity>
                    {showEndTime && (
                        <DateTimePicker
                            value={endTime}
                            mode="time"
                            display="default"
                            onChange={onChangeEndTime}
                        />
                    )}
                </View>


                {/* Continue Button */}
<ThemeButton
          text="Continue"
          onPress={() => {
            if (newEvent) {

              navigation.navigate("CreateEventFour", { newEvent });
            } else {
              Alert.alert("Something went wrong, try again!");
            }
          }}
          style={{ width: "100%" }}
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

export default CreateEventThree;