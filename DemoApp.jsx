import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import MemberShare from './src/screen/FolderTitle';

const DemoApp = () => {
  return (
    <SafeAreaView style={styles.container}>
      <MemberShare />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default DemoApp;
