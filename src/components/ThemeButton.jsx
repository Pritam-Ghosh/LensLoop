import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import CustomText from './CustomText';

const ThemeButton = ({
  text,
  icon,
  onPress,
  style,
  textStyle,
  iconPosition = 'left'
}) => {
  return (
    <LinearGradient
      //  Updated gradient like your image
      colors={['#264b2b', '#52AB5E']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={[styles.continueBtn, style]}
    >
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.85}
        style={styles.touchable}
      >
        <View style={styles.content}>

          {/* Left Icon */}
          {icon && iconPosition === 'left' && (
            <View style={styles.icon}>{icon}</View>
          )}

          {/* Text */}
          <CustomText
            weight="Bold"
            style={[styles.continueTxt, textStyle]}
          >
            {text}
          </CustomText>

          {/* Right Icon */}
          {icon && iconPosition === 'right' && (
            <View style={styles.icon}>{icon}</View>
          )}

        </View>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  continueBtn: {
    borderRadius: 50, // 👈 pill shape
    width: '100%',
    marginVertical: 15,
    overflow: 'hidden',
  },

  touchable: {
    paddingVertical: 14,
    paddingHorizontal: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },

  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },

  icon: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  continueTxt: {
    fontSize: 17,
    fontWeight: '700',
    color: '#ffffff',
  },
});

export default ThemeButton;