import React, { useEffect } from "react";
import { Modal, View, StyleSheet, TouchableWithoutFeedback } from "react-native";
import { AlertCircle, CheckCircle } from "lucide-react-native";
import CustomText from "./CustomText";

const AppModal = ({
  visible,
  title,
  message,
  type = "info", // success | error | warning | info
  onClose,
  autoClose = true,
  duration = 1800,
}) => {
  const config = {
    success: {
      color: "#DA3C84",
      icon: <CheckCircle size={22} color="#DA3C84" />,
    },
    error: {
      color: "#EF4444",
      icon: <AlertCircle size={22} color="#EF4444" />,
    },
    warning: {
      color: "#F59E0B",
      icon: <AlertCircle size={22} color="#F59E0B" />,
    },
    info: {
      color: "#DA3C84",
      icon: <AlertCircle size={22} color="#DA3C84" />,
    },
  };

  const current = config[type];

  useEffect(() => {
    if (visible && autoClose) {
      const timer = setTimeout(() => {
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Modal transparent animationType="fade">
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modal}>
              <View style={styles.header}>
                {current.icon}
                <CustomText
                  weight="bold"
                  style={[styles.title, { color: current.color }]}
                >
                  {title}
                </CustomText>
              </View>

              <CustomText weight="medium" style={styles.message}>
                {message}
              </CustomText>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default AppModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.15)", // 👈 very light overlay
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    width: "88%",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 22,

    // very soft shadow (same feel as cards)
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
  },
  message: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 22,
  },
});
