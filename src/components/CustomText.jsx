// src/components/CustomText.js
import React from 'react';
import { Text } from 'react-native';
import { useTranslation } from 'react-i18next';

// Map font weights to your Montserrat font files
const fontMap = {
  thin: 'Montserrat-Thin',
  thinItalic: 'Montserrat-ThinItalic',
  extraLight: 'Montserrat-ExtraLight',
  extraLightItalic: 'Montserrat-ExtraLightItalic',
  light: 'Montserrat-Light',
  lightItalic: 'Montserrat-LightItalic',
  regular: 'Montserrat-Regular',
  italic: 'Montserrat-Italic',
  medium: 'Montserrat-Medium',
  mediumItalic: 'Montserrat-MediumItalic',
  semiBold: 'Montserrat-SemiBold',
  semiBoldItalic: 'Montserrat-SemiBoldItalic',
  bold: 'Montserrat-Bold',
  boldItalic: 'Montserrat-BoldItalic',
  extraBold: 'Montserrat-ExtraBold',
  extraBoldItalic: 'Montserrat-ExtraBoldItalic',
  black: 'Montserrat-Black',
  blackItalic: 'Montserrat-BlackItalic',
  variable: 'Montserrat-VariableFont_wght',
};

const CustomText = ({ style, weight = 'regular', children, ...props }) => {
  // 🔥 This line makes CustomText re-render on language change
  const { i18n } = useTranslation();

  return (
    <Text
      {...props}
      style={[{ fontFamily: fontMap[weight] }, style]}
    >
      {children}
    </Text>
  );
};

export default CustomText;
