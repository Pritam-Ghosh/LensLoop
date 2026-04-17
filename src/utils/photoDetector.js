import { Platform, PermissionsAndroid } from 'react-native';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';

// Helper function to get date string in format "YYYY-MM-DD"
const getDateString = (timestamp) => {
  // iOS timestamps are already in seconds, Android might be in milliseconds
  const timestampInMs = timestamp > 10000000000 ? timestamp : timestamp * 1000;
  const date = new Date(timestampInMs);
  
  // Validate date
  if (isNaN(date.getTime())) {
    console.warn('⚠️ Invalid timestamp:', timestamp);
    return null;
  }
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// iOS-specific permission check
const checkIOSPermission = async () => {
  try {
    // On iOS, we need to check if we have permission first
    const { CameraRoll } = require('@react-native-camera-roll/camera-roll');
    
    // Try to fetch 1 photo to check permission
    const testFetch = await CameraRoll.getPhotos({
      first: 1,
      assetType: 'Photos',
    });
    
    return true;
  } catch (error) {
    console.log('❌ iOS permission denied:', error);
    return false;
  }
};

export const checkForNewCameraPhotos = async () => {
  try {
    // Request permissions
    let hasPermission = false;
    
    if (Platform.OS === 'android') {
      const apiLevel = Platform.Version;
      if (apiLevel >= 33) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
        );
        hasPermission = granted === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
        );
        hasPermission = granted === PermissionsAndroid.RESULTS.GRANTED;
      }
    } else {
      // iOS permission check
      hasPermission = await checkIOSPermission();
    }

    if (!hasPermission) {
      console.log('❌ No permission for photos');
      return { hasNewPhotos: false, photoCount: 0, photos: [], latestDate: null };
    }

    console.log('✅ Permission granted, fetching photos...');

    // Fetch photos with iOS-specific parameters
    const params = {
      first: 5000,
      assetType: 'Photos',
      include: ['filename', 'imageSize', 'playableDuration'],
    };

    if (Platform.OS === 'ios') {
      // iOS uses 'SmartAlbums' for Camera Roll
      params.groupTypes = 'All'; // Changed from 'SavedPhotos' to 'All'
      params.include.push('location'); // iOS specific
    } else {
      params.groupName = 'Camera';
    }

    const photos = await CameraRoll.getPhotos(params);
    console.log('📸 Total photos fetched:', photos.edges.length);

    // Get dates for last 3 days
    const today = new Date();
    const threeDaysAgo = new Date(today);
    threeDaysAgo.setDate(today.getDate() - 2);
    threeDaysAgo.setHours(0, 0, 0, 0);

    console.log('📅 Looking for photos from:', threeDaysAgo.toISOString());

    // Filter photos from last 3 days
    const recentPhotos = photos.edges
      .map(edge => {
        try {
          // iOS uses different timestamp property
          const timestamp = edge.node.timestamp || edge.node.image.timestamp;
          
          if (!timestamp) {
            console.warn('⚠️ Photo missing timestamp:', edge.node);
            return null;
          }

          const dateString = getDateString(timestamp);
          
          if (!dateString) {
            return null;
          }

          // iOS URI handling - ensure proper format
          let uri = edge.node.image.uri;
          
          // iOS file URIs might need ph:// scheme handling
          if (Platform.OS === 'ios' && !uri.startsWith('file://') && !uri.startsWith('ph://')) {
            console.warn('⚠️ Unexpected URI format on iOS:', uri);
          }

          return {
            uri: uri,
            timestamp: timestamp,
            filename: edge.node.image.filename || `photo_${timestamp}.jpg`,
            dateString: dateString,
            fileSize: edge.node.image.fileSize || 0,
          };
        } catch (err) {
          console.log('⚠️ Error mapping photo:', err);
          return null;
        }
      })
      .filter(photo => {
        if (!photo || !photo.dateString) return false;
        
        try {
          const timestampInMs = photo.timestamp > 10000000000 ? photo.timestamp : photo.timestamp * 1000;
          const photoDate = new Date(timestampInMs);
          
          // Validate date
          if (isNaN(photoDate.getTime())) {
            console.warn('⚠️ Invalid photo date:', photo);
            return false;
          }
          
          const isRecent = photoDate >= threeDaysAgo;
          
          if (isRecent) {
            console.log('✅ Found recent photo:', photo.filename, photoDate.toISOString());
          }
          
          return isRecent;
        } catch (err) {
          console.log('⚠️ Error filtering photo:', err);
          return false;
        }
      })
      .sort((a, b) => b.timestamp - a.timestamp); // Newest first

    console.log('📸 Recent photos (last 3 days):', recentPhotos.length);

    // Group photos by date and limit to 5 photos per date
    const photosByDate = {};
    recentPhotos.forEach(photo => {
      if (!photosByDate[photo.dateString]) {
        photosByDate[photo.dateString] = [];
      }
      
      // Only add photo if we haven't reached the limit of 5 for this date
      if (photosByDate[photo.dateString].length < 5) {
        photosByDate[photo.dateString].push(photo);
      }
    });

    // Log photos per date for debugging
    Object.keys(photosByDate).forEach(date => {
      console.log(`📅 ${date}: ${photosByDate[date].length} photos (limited to 5)`);
    });

    // Get the latest date that has photos
    const latestDate = recentPhotos.length > 0 ? recentPhotos[0].dateString : null;

    // Calculate total photos
    const totalPhotosAfterLimit = Object.values(photosByDate).reduce(
      (sum, datePhotos) => sum + datePhotos.length, 
      0
    );

    console.log('📅 Photos grouped by date:', Object.keys(photosByDate));
    console.log('📅 Latest date with photos:', latestDate);
    console.log('📸 Total photos after limiting to 5 per date:', totalPhotosAfterLimit);

    // Flatten photosByDate back into a single array
    const limitedPhotos = Object.values(photosByDate).flat();

    return {
      hasNewPhotos: limitedPhotos.length > 0,
      photoCount: totalPhotosAfterLimit,
      photos: limitedPhotos,
      photosByDate: photosByDate,
      latestDate: latestDate,
    };

  } catch (error) {
    console.error('❌ Error in checkForNewCameraPhotos:', error);
    console.error('Error stack:', error.stack);
    return { 
      hasNewPhotos: false, 
      photoCount: 0, 
      photos: [], 
      photosByDate: {},
      latestDate: null 
    };
  }
};