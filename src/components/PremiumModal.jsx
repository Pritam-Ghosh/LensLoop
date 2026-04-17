import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    Modal,
    Image,
    TouchableOpacity,
    StyleSheet,
} from "react-native";
import { colors } from "../Theme/theme";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PremiumModal = ({ visible, onClose, beforeImage, afterImage }) => {
    const navigation = useNavigation();

    const [isPremiumUser, setPremiumUser] = useState(false);

    useEffect(() => {
        if (visible) {
            checkPremium();
        }
    }, [visible]);

    const checkPremium = async () => {
        const premium = await AsyncStorage.getItem("isPremium");
        setPremiumUser(premium === "true");
    };

    const handlePremiumPress = () => {
        if (isPremiumUser) {
            console.log("Premium Feature Allowed");
            onClose();
        } else {
            navigation.navigate("DemoPaymentScreen");
        }
    };





    return (
        <Modal
            transparent={true}
            visible={visible}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalBox}>
                    {/* Close Button */}
                    <TouchableOpacity
                        onPress={onClose}
                        style={styles.closeIconButton}
                    >
                        <Text style={styles.closeIcon}>✕</Text>
                    </TouchableOpacity>

                    {/* Title */}
                    <Text style={styles.modalTitle}>Premium Features </Text>
                    <Text style={styles.modalSubtitle}>
                        Get professional-grade enhancements instantly
                    </Text>

                    {/* Before / After */}
                    <View style={styles.imagesRow}>
                        <View style={styles.textCenter}>
                            <View style={styles.imageContainer}>
                                <Image source={beforeImage} style={styles.imageView} />
                            </View>
                            <Text style={styles.imageLabel}>Before</Text>
                        </View>

                        <View style={styles.textCenter}>
                            <View style={styles.imageContainer}>
                                <Image source={afterImage} style={styles.imageView} />
                            </View>
                            <Text style={styles.imageLabel}>After</Text>
                        </View>
                    </View>

                    {/* Features */}
                    <View style={styles.featuresList}>
                        {[
                            "Portrait retouching & skin smoothing",
                            "20+ advanced filters & effects",
                            "HDR boost & lighting enhancement",
                        ].map((text, i) => (
                            <View key={i} style={styles.featureItem}>
                                <View style={styles.checkIcon}>
                                    <Text style={styles.checkText}>✓</Text>
                                </View>
                                <Text style={styles.featureText}>{text}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Buttons */}


                    <TouchableOpacity
                        style={styles.priceButton}
                        onPress={handlePremiumPress}
                    >
                        <Text style={styles.priceText}>$9.99/month</Text>
                        <Text style={styles.trialText}>7-day free trial</Text>
                    </TouchableOpacity>


                    <TouchableOpacity style={[styles.freeTrialButton, { marginBottom: 10 }]}
                        onPress={async () => {
                            await AsyncStorage.setItem("isPremium", "false");
                            alert("Unsubscribed");
                            navigation.goBack();
                        }}
                    >
                        <Text style={styles.freeTrialText}>unsubscribe</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.freeTrialButton}>
                        <Text style={styles.freeTrialText}>Start 7-days Free Trial</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default PremiumModal;

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.6)",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
    },
    modalBox: {
        backgroundColor: "#fff",
        borderRadius: 16,
        paddingVertical: 25,
        paddingHorizontal: 20,
        alignItems: "center",
        width: "100%",
        maxWidth: 360,
        position: "relative",
    },
    closeIconButton: {
        position: "absolute",
        top: 15,
        right: 15,
        width: 30,
        height: 30,
        justifyContent: "center",
        alignItems: "center",
        zIndex: 10,
    },
    closeIcon: {
        fontSize: 20,
        color: "#666",
        fontWeight: "400",
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 6,
        marginTop: 10,
        textAlign: "center",
        color: "#1C1C1C",
    },
    modalSubtitle: {
        fontSize: 13,
        fontWeight: "400",
        color: "#666",
        textAlign: "center",
        marginBottom: 20,
    },
    imagesRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        marginBottom: 20,
        gap: 12,
    },
    textCenter: {
        alignItems: "center",
        flex: 1,
    },
    imageContainer: {
        width: "100%",
        height: 140,
        borderRadius: 8,
        overflow: "hidden",
        marginBottom: 8,
    },
    imageView: {
        width: "100%",
        height: "100%",
        resizeMode: "cover",
    },
    imageLabel: {
        fontSize: 13,
        fontWeight: "500",
        color: "#333",
    },
    featuresList: {
        width: "100%",
        marginBottom: 20,
    },
    featureItem: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },
    checkIcon: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: "#4CAF50",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10,
    },
    checkText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "bold",
    },
    featureText: {
        fontSize: 13,
        color: "#333",
        flex: 1,
    },
    priceButton: {
        backgroundColor: "#000",
        width: "100%",
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: "center",
        marginBottom: 12,
    },
    priceText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "700",
    },
    trialText: {
        color: "#fff",
        fontSize: 12,
        marginTop: 2,
    },
    freeTrialButton: {
        backgroundColor: colors.primary,
        width: "100%",
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: "center",
    },
    freeTrialText: {
        color: "#ffffff",
        fontSize: 15,
        fontWeight: "700",
    },
});
