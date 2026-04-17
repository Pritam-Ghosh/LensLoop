import React, { useState } from "react";
import {
  View,
  Image,
  ScrollView,
  StyleSheet,
  Dimensions,
} from "react-native";
import ScreenLayout from "../components/ScreenLayout";
import CustomText from "../components/CustomText";

const { width, height } = Dimensions.get("window");

const createEvent = require("../../assets/background.png");
const profilePic = require("../../assets/profile.jpg");

const MemberStatus = ({ navigation }) => {
  const [members, setMembers] = useState([
    { id: 1, name: "Sarah Johnson", image: profilePic, status: "pending" },
    { id: 2, name: "Michael Chen", image: profilePic, status: "approved" },
    { id: 3, name: "Emily Rodriguez", image: profilePic, status: "pending" },
    { id: 4, name: "David Kim", image: profilePic, status: "approved" },
  ]);

  return (
    <View style={{ flex: 1, backgroundColor: "#FAFAF9" }}>
      <ScreenLayout
        navigation={navigation}
        image={createEvent}
        folderName="Member Status"
        date="+91 1841 510 1450"
        OverlayContent={
          <View style={styles.profileOverlay}>
            <CustomText weight="bold" style={styles.headerText}>
              Member Status
            </CustomText>
            <CustomText weight="medium" style={styles.subHeaderText}>
              Check membership approval status
            </CustomText>
          </View>
        }
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerSection}>
            <CustomText weight="bold" style={styles.headerTitle}>
              All Members
            </CustomText>
            <CustomText weight="regular" style={styles.headerSubtitle}>
              {members.length} total members
            </CustomText>
          </View>

          {/* Member List */}
          {members.map((member) => (
            <View key={member.id} style={styles.memberCard}>
              {/* Profile Image */}
              <Image source={member.image} style={styles.profileImage} />

              {/* Info */}
              <View style={styles.memberInfo}>
                <CustomText weight="bold" style={styles.memberName}>
                  {member.name}
                </CustomText>

                {/* Status Badge */}
                <View style={styles.statusWrapper}>
                  <CustomText
                    weight="semibold"
                    style={[
                      styles.statusBadge,
                      member.status === "approved"
                        ? styles.approved
                        : styles.pending,
                    ]}
                  >
                    {member.status === "approved" ? "Approved" : "Pending"}
                  </CustomText>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </ScreenLayout>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "#FAFAF9",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },

  profileOverlay: {
    position: "absolute",
    top: -100,
    alignItems: "center",
  },

  headerText: {
    fontSize: 24,
    color: "#FFFFFF",
    textAlign: "center",
  },

  subHeaderText: {
    fontSize: 14,
    color: "#FFFFFF",
    opacity: 0.9,
    marginTop: 6,
    textAlign: "center",
  },

  headerSection: {
    marginBottom: 24,
  },

  headerTitle: {
    fontSize: 22,
    color: "#1F2937",
    marginBottom: 4,
  },

  headerSubtitle: {
    fontSize: 14,
    color: "#6B7280",
  },

  memberCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },

  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 14,
  },

  memberInfo: {
    flex: 1,
    justifyContent: "center",
  },

  memberName: {
    fontSize: 17,
    color: "#1F2937",
    marginBottom: 8,
  },

  statusWrapper: {
    marginTop: 4,
  },

  statusBadge: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    fontSize: 13,
    alignSelf: "flex-start",
  },

  approved: {
    backgroundColor: "#D1FAE5",
    color: "#065F46",
  },

  pending: {
    backgroundColor: "#F3F4F6",
    color: "#6B7280",
  },
});

export default MemberStatus;
