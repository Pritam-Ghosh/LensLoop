import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import CustomText from '../components/CustomText';

const PhotoEditOriginalvsEnhanced = () => {
  const [activeTab, setActiveTab] = useState('Original');

  return (
    <View style={styles.topTabs}>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'Original' && styles.activeTab]}
        onPress={() => setActiveTab('Original')}
      >
        <CustomText
          weight="semiBold"
          style={[styles.tabText, activeTab === 'Original' && styles.activeTabText]}
        >
          Original
        </CustomText>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tab, activeTab === 'Enhanced' && styles.activeTab]}
        onPress={() => setActiveTab('Enhanced')}
      >
        <CustomText
          weight="semiBold"
          style={[styles.tabText, activeTab === 'Enhanced' && styles.activeTabText]}
        >
          Enhanced
        </CustomText>
      </TouchableOpacity>
    </View>
  );
};

export default PhotoEditOriginalvsEnhanced;

const styles = StyleSheet.create({
  topTabs: {
    position: 'absolute',
    top: 20,
    left: '50%',
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderRadius: 25,
    padding: 4,
    transform: [{ translateX: -100 }],
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: '#fff',
  },
  tabText: {
    color: '#000000ff',
    fontSize: 14,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#000',
  },
});
