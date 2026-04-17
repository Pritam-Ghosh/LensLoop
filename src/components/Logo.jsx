import { View, Image, StyleSheet } from 'react-native'

const logo = require("../../assets/snaphive-logo.png");

const Logo = ({ width = 150, height = 60, style }) => {
  return (
    <View style={[styles.container, { width, height }, style]}>
      <Image source={logo} style={styles.logo} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: "center",  
    justifyContent: "center",
    alignItems: "center",
  },

  logo: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
});

export default Logo;
