import React, { useState } from "react";
import { View, TextInput, StyleSheet, Text, TouchableOpacity, Image, ScrollView, Dimensions } from "react-native";
import FolderLayout from "../screen/FolderLayout";
import Swtich from "../components/Swtich";
import QR from "../../assets/svg/qr.svg";
import Pencil from "../../assets/svg/pencil.svg";
import People from "../../assets/svg/people.svg";
import Download from "../../assets/svg/download.svg";
import Mail from "../../assets/svg/mail.svg";
import ThemeButton from "../components/ThemeButton";
import CustomText from "../components/CustomText";
import ScreenLayout from "../components/ScreenLayout";
import { Check, CopyIcon, Link, QrCode, Share2, Users, X, UserPlus } from "lucide-react-native";
import QRCodeModal from "../components/QRCodeModal";

const { width, height } = Dimensions.get('window');

const folderImage = require("../../assets/folderImage.png");
const flag1 = require("../../assets/flag1.png");
const flag2 = require("../../assets/flag2.png");
const flag3 = require("../../assets/flag3.png");
const flag4 = require("../../assets/flag4.png");
const createEvent = require("../../assets/background.png");
const profilePic = require("../../assets/profile.jpg");

const PendingRequest = ({ navigation, route }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [copied, setCopied] = useState(false);
  const { folderName, date, owner } = route.params || {
    folderName: "Untitled Folder",
    date: "Unknown Date",
    owner: "NA",
  };

  // Sample pending requests data
  const [requests, setRequests] = useState([
    {
      id: 1,
      name: "Sarah Johnson",
      image: profilePic,
    },
    {
      id: 2,
      name: "Michael Chen",
      image: profilePic,
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      image: profilePic,
    },
    {
      id: 4,
      name: "David Kim",
      image: profilePic,
    },
  ]);

  const handleAccept = (id) => {

    setRequests(requests.filter(req => req.id !== id));
    console.log("Accepted request:", id);
  };

  const handleReject = (id) => {

    setRequests(requests.filter(req => req.id !== id));
    console.log("Rejected request:", id);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#FAFAF9" }}>
      <ScreenLayout
        navigation={navigation}
        image={createEvent}
        folderName="Janifer Danis"
        date="+91 1841 510 1450"
        OverlayContent={
          <View style={styles.profileOverlay}>
            <View>
              <CustomText weight="bold" style={{ fontSize: 24, color: '#FFFFFF', textAlign: 'center' }}>
                Invite Member
              </CustomText>
              <CustomText weight="medium" style={{ fontSize: 14, color: '#FFFFFF', textAlign: 'center', opacity: 0.9, marginTop: 6 }}>
                Share this hive with friends
              </CustomText>
            </View>
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
              Pending Requests
            </CustomText>
            <CustomText weight="regular" style={styles.headerSubtitle}>
              {requests.length} {requests.length === 1 ? 'person' : 'people'} want to join your hive
            </CustomText>
          </View>

          {/* Requests List */}
          {requests.length > 0 ? (
            requests.map((request) => (
              <View key={request.id} style={styles.requestCard}>
                {/* Profile Image */}
                <Image source={request.image} style={styles.profileImage} />

                {/* Request Info */}
                <View style={styles.requestInfo}>
                  <CustomText weight="bold" style={styles.requestName}>
                    {request.name}
                  </CustomText>


                  {/* Action Buttons */}
                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      style={styles.acceptButton}
                      onPress={() => handleAccept(request.id)}
                      activeOpacity={0.8}
                    >
                      <Check color="#FFFFFF" size={18} strokeWidth={2.5} />
                      <CustomText weight="semibold" style={styles.acceptButtonText}>
                        Accept
                      </CustomText>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.rejectButton}
                      onPress={() => handleReject(request.id)}
                      activeOpacity={0.8}
                    >
                      <X color="#6B7280" size={18} strokeWidth={2.5} />
                      <CustomText weight="semibold" style={styles.rejectButtonText}>
                        Reject
                      </CustomText>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))
          ) : (
            // Empty State
            <View style={styles.emptyState}>
              <View style={styles.emptyIconWrapper}>
                <UserPlus color="#D1D5DB" size={48} strokeWidth={1.5} />
              </View>
              <CustomText weight="bold" style={styles.emptyTitle}>
                No Pending Requests
              </CustomText>
              <CustomText weight="regular" style={styles.emptySubtitle}>
                You don't have any pending friend requests at the moment
              </CustomText>
            </View>
          )}


        </ScrollView>

        <QRCodeModal visible={modalVisible} onClose={() => setModalVisible(false)} />
      </ScreenLayout>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#FAFAF9',
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },

  profileOverlay: {
    position: 'absolute',
    top: -100,
    alignItems: "center",
  },

  // Header Section
  headerSection: {
    marginBottom: 24,
  },

  headerTitle: {
    fontSize: 22,
    color: '#1F2937',
    marginBottom: 4,
  },

  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },

  // Request Card
  requestCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },

  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 14,
    borderWidth: 2,
    borderColor: '#F3F4F6',
  },

  requestInfo: {
    flex: 1,
    justifyContent: 'center',
  },

  requestName: {
    fontSize: 17,
    color: '#1F2937',
    marginBottom: 4,
  },

  mutualFriends: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 2,
  },

  requestTime: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 12,
  },

  // Action Buttons
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
  },

  acceptButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DA3C84',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    gap: 6,
  },

  acceptButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
  },

  rejectButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    gap: 6,
  },

  rejectButtonText: {
    color: '#6B7280',
    fontSize: 14,
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },

  emptyIconWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },

  emptyTitle: {
    fontSize: 20,
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },

  emptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },

  // Invite Section
  inviteSection: {
    backgroundColor: '#FFF5F8',
    borderRadius: 16,
    padding: 24,
    marginTop: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFE5EE',
  },

  inviteIconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: "#DA3C84",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },

  inviteTitle: {
    fontSize: 18,
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },

  inviteSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },

  inviteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DA3C84',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
    gap: 8,
    shadowColor: "#DA3C84",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },

  inviteButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
  },
});

export default PendingRequest;