import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  PermissionsAndroid,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import { useFocusEffect } from '@react-navigation/native';
import TopNav from '../components/TopNavbar';
import ThemeButton from '../components/ThemeButton';
import { colors } from '../Theme/theme';
import eventBus from '../utils/eventBus';

const { width, height } = Dimensions.get('window');

const AutoCreateHive = ({ navigation }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasPermission, setHasPermission] = useState(false);

  // ────────────────────────────────────────────────
  // PERMISSIONS
  // ────────────────────────────────────────────────
  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      const apiLevel = Platform.Version;

      if (apiLevel >= 33) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
    }

    return true; // iOS auto-granted
  };

  // ────────────────────────────────────────────────
  // LOAD ONLY CAMERA ROLL PHOTOS (FROM DEVICE CAMERA APP)
  // ────────────────────────────────────────────────
// LOAD ONLY CAMERA ROLL PHOTOS (FROM DEVICE CAMERA APP)
const loadPhotos = useCallback(async () => {
  try {
    // If photos were passed from AutoSync, don't reload
    if (route?.params?.cameraPhotos && route?.params?.fromAutoSync) {
      console.log('📸 Using photos from AutoSync, skipping reload');
      setImages(route.params.cameraPhotos);
      setLoading(false);
      return;
    }

    setLoading(true);

    const params = {
      first: 5000,
      assetType: 'Photos',
      include: ['filename', 'timestamp'],
    };

    if (Platform.OS === 'ios') {
      params.groupTypes = 'SavedPhotos';
    } else {
      params.groupName = 'Camera';
    }

    const photos = await CameraRoll.getPhotos(params);

    // Today's date at 00:00
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const cameraPhotos = photos.edges
      .map(edge => ({
        uri: edge.node.image.uri,
        timestamp: edge.node.timestamp,
        filename: edge.node.image.filename,
      }))
      .filter(photo => {
        const d = new Date(photo.timestamp * 1000);
        d.setHours(0, 0, 0, 0);

        return d.getTime() === today.getTime(); // only today's photos
      })
      .sort((a, b) => b.timestamp - a.timestamp);

    setImages(cameraPhotos);

  } catch (error) {
    console.log("Error loading gallery:", error);
  } finally {
    setLoading(false);
  }
}, [route?.params]);


  // ────────────────────────────────────────────────
  // EVENT LISTENER (OPTIONAL: REMOVE IF NOT NEEDED FOR DEFAULT CAMERA)
  // ────────────────────────────────────────────────


useEffect(() => {
  console.log('📸 AutoCreateHive mounted');
  console.log('📦 Route params:', route?.params);
  
  if (route?.params?.cameraPhotos) {
    console.log('✅ Received camera photos:', route.params.cameraPhotos.length);
    console.log('🔍 First photo:', route.params.cameraPhotos[0]);
    setImages(route.params.cameraPhotos);
  } else {
    console.log('⚠️ No camera photos in params');
  }
  
  if (route?.params?.fromAutoSync) {
    console.log('✅ Came from AutoSync modal');
  }
}, [route?.params]);


  useEffect(() => {
    const listener = (data) => {
      console.log("📸 New photo detected → refreshing gallery", data);
      loadPhotos();
    };

    const subscription = eventBus.addListener("photo_saved", listener);

    return () => subscription.remove();
  }, [loadPhotos]);

  // ────────────────────────────────────────────────
  // INITIAL LOAD
  // ────────────────────────────────────────────────
  useEffect(() => {
    const init = async () => {
      const permission = await requestPermissions();
      setHasPermission(permission);

      if (permission) loadPhotos();
      else setLoading(false);
    };

    init();
  }, []);

  // ────────────────────────────────────────────────
  // RELOAD ON SCREEN FOCUS
  // ────────────────────────────────────────────────
  useFocusEffect(
    useCallback(() => {
      if (hasPermission) loadPhotos();
    }, [hasPermission, loadPhotos])
  );

  // ────────────────────────────────────────────────
  // LOADING UI
  // ────────────────────────────────────────────────
  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <TopNav />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
          <Text style={styles.loadingText}>Loading photos...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // ────────────────────────────────────────────────
  // PERMISSION DENIED UI
  // ────────────────────────────────────────────────
  if (!hasPermission) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <TopNav />
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>Permission denied</Text>

          <TouchableOpacity
            style={styles.retryButton}
            onPress={async () => {
              const permission = await requestPermissions();
              setHasPermission(permission);
              if (permission) loadPhotos();
            }}
          >
            <Text style={styles.retryButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ────────────────────────────────────────────────
  // MAIN GALLERY UI
  // ────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safeArea}>
      <TopNav />

      <ScrollView
        contentContainerStyle={[styles.container, { paddingBottom: 80 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View style={styles.headerRow}>
          <Text style={styles.selectedText}>
            Camera Photos ({images.length})
          </Text>

          <TouchableOpacity onPress={() => navigation.goBack()}>
            <View style={styles.cancelButton}>
              <Text style={styles.cancelText}>Back</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* GRID */}
        <View style={styles.gridContainer}>
          {images.map((img, index) => (
            <View
              key={img.uri}
              style={[
                styles.imgContainer,
                { marginRight: (index + 1) % 3 === 0 ? 0 : width * 0.015 },
              ]}
            >
              <Image source={{ uri: img.uri }} style={styles.img} />
            </View>
          ))}
        </View>
      </ScrollView>

      <ThemeButton
        style={styles.continueBtn}
        text="Next →"
        onPress={() => navigation.navigate('CreateHive', {
          cameraPhotos: images // Pass the images array
        })}
      />
    </SafeAreaView>
  );
};

// ────────────────────────────────────────────────
// STYLES
// ────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },

  container: {
    paddingHorizontal: width * 0.03,
    paddingVertical: height * 0.02,
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: height * 0.02,
  },

  selectedText: {
    fontWeight: '600',
    fontSize: width * 0.045,
    color: '#000',
  },

  cancelButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.01,
    borderRadius: 6,
  },

  cancelText: {
    color: '#FFF',
    fontSize: width * 0.04,
    fontWeight: '500',
  },

  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  imgContainer: {
    width: (width - width * 0.09) / 3,
    height: (width - width * 0.09) / 3,
    marginBottom: width * 0.015,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
  },

  img: { width: '100%', height: '100%' },

  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  loadingText: { marginTop: 10, fontSize: width * 0.04 },

  errorText: { fontSize: width * 0.045, marginBottom: 20 },

  retryButton: {
    backgroundColor: '#000',
    paddingHorizontal: width * 0.08,
    paddingVertical: height * 0.015,
    borderRadius: 8,
  },

  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
  },

  continueBtn: {
    width: '85%',
    alignSelf: 'center',
    marginBottom: 10,
  },
});

export default AutoCreateHive;