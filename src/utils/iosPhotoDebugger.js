// Create this file: utils/iosPhotoDebugger.js
// Use this to debug iOS photo issues

import { Platform } from 'react-native';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const debugIOSPhotos = async () => {
  if (Platform.OS !== 'ios') {
    console.log('⚠️ This is only for iOS debugging');
    return;
  }

  try {
    console.log('=== iOS Photo Library Debug ===');
    
    // 1. Check permission
    console.log('1️⃣ Checking permission...');
    try {
      const testFetch = await CameraRoll.getPhotos({
        first: 1,
        assetType: 'Photos',
      });
      console.log('✅ Permission granted');
    } catch (error) {
      console.log('❌ Permission denied:', error);
      return;
    }

    // 2. Fetch recent photos
    console.log('2️⃣ Fetching recent photos...');
    const photos = await CameraRoll.getPhotos({
      first: 10,
      assetType: 'Photos',
      include: ['filename', 'imageSize', 'playableDuration'],
      groupTypes: 'All',
    });

    console.log(`📸 Found ${photos.edges.length} photos`);

    // 3. Inspect first photo
    if (photos.edges.length > 0) {
      const firstPhoto = photos.edges[0];
      console.log('3️⃣ First photo details:');
      console.log('  URI:', firstPhoto.node.image.uri);
      console.log('  Filename:', firstPhoto.node.image.filename);
      console.log('  Timestamp:', firstPhoto.node.timestamp);
      console.log('  Size:', firstPhoto.node.image.fileSize);
      
      // Check timestamp format
      const timestamp = firstPhoto.node.timestamp;
      console.log('  Timestamp (raw):', timestamp);
      console.log('  Timestamp (as Date):', new Date(timestamp * 1000).toISOString());
    }

    // 4. Check AsyncStorage
    console.log('4️⃣ Checking AsyncStorage...');
    const handledPhotos = await AsyncStorage.getItem('AUTO_SYNC_HANDLED_PHOTOS');
    const skippedDates = await AsyncStorage.getItem('AUTO_SYNC_SKIPPED_DATES_KEY');
    const autoSyncPhotos = await AsyncStorage.getItem('AUTO_SYNC_PHOTOS');

    console.log('  Handled photos count:', handledPhotos ? JSON.parse(handledPhotos).length : 0);
    console.log('  Skipped dates:', skippedDates ? JSON.parse(skippedDates) : []);
    console.log('  Auto-sync photos:', autoSyncPhotos ? JSON.parse(autoSyncPhotos).length : 0);

    // 5. Test date filtering
    console.log('5️⃣ Testing date filtering...');
    const today = new Date();
    const threeDaysAgo = new Date(today);
    threeDaysAgo.setDate(today.getDate() - 2);
    console.log('  Looking for photos after:', threeDaysAgo.toISOString());

    const recentCount = photos.edges.filter(edge => {
      const timestamp = edge.node.timestamp;
      const photoDate = new Date(timestamp * 1000);
      return photoDate >= threeDaysAgo;
    }).length;

    console.log(`  Found ${recentCount} photos in last 3 days`);

    console.log('=== Debug Complete ===');
    
    return {
      totalPhotos: photos.edges.length,
      recentPhotos: recentCount,
      firstPhotoUri: photos.edges[0]?.node.image.uri,
    };

  } catch (error) {
    console.error('❌ Debug error:', error);
    console.error('Stack:', error.stack);
  }
};

// Usage: Add a button in your app to call this during development
// import { debugIOSPhotos } from './utils/iosPhotoDebugger';
// <Button title="Debug iOS Photos" onPress={debugIOSPhotos} />