import React from "react";
import { View, StyleSheet } from "react-native";
import Toast, { BaseToast } from "react-native-toast-message";
import { CheckCircle, XCircle, Info } from "lucide-react-native";
import CustomText from "./CustomText";

const SnaphiveToast = {
  success: (props) => (
    <View style={[styles.toastContainer, styles.success]}>
      <CheckCircle size={22} color="#FFFFFF" />
      <View style={styles.textWrapper}>
        <CustomText weight="bold" style={styles.title}>
          {props.text1}
        </CustomText>
        {props.text2 && (
          <CustomText weight="medium" style={styles.message}>
            {props.text2}
          </CustomText>
        )}
      </View>
    </View>
  ),

  error: (props) => (
    <View style={[styles.toastContainer, styles.error]}>
      <XCircle size={22} color="#FFFFFF" />
      <View style={styles.textWrapper}>
        <CustomText weight="bold" style={styles.title}>
          {props.text1}
        </CustomText>
        {props.text2 && (
          <CustomText weight="medium" style={styles.message}>
            {props.text2}
          </CustomText>
        )}
      </View>
    </View>
  ),

  info: (props) => (
    <View style={[styles.toastContainer, styles.info]}>
      <Info size={22} color="#FFFFFF" />
      <View style={styles.textWrapper}>
        <CustomText weight="bold" style={styles.title}>
          {props.text1}
        </CustomText>
        {props.text2 && (
          <CustomText weight="medium" style={styles.message}>
            {props.text2}
          </CustomText>
        )}
      </View>
    </View>
  ),
};

export default SnaphiveToast;

const styles = StyleSheet.create({
  toastContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 14,
    marginHorizontal: 16,
    marginTop: 10,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  textWrapper: {
    marginLeft: 10,
    flex: 1,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 14,
  },
  message: {
    color: "#FDECEF",
    fontSize: 12,
    marginTop: 2,
  },
  success: {
    backgroundColor: "#DA3C84", // Snaphive pink
  },
  error: {
    backgroundColor: "#E11D48", // Red
  },
  info: {
    backgroundColor: "#F98935", // Orange
  },
});
