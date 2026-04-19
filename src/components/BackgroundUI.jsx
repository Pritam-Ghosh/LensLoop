import React from 'react'
import {
  View,
  ImageBackground,
  StyleSheet,
  StatusBar
} from 'react-native'

import {
  SafeAreaProvider,
  SafeAreaView
} from 'react-native-safe-area-context'

const BackgroungUI = ({ children }) => {
  return (
    <SafeAreaProvider>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      <SafeAreaView
        style={{ flex: 1, backgroundColor: "#fff" }}
        edges={["top", "bottom"]}
      >
        {/* ✅ White background only */}
        <View style={styles.content}>
          {children}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};
export default BackgroungUI


const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  content: {
    flex: 1,
  }

})