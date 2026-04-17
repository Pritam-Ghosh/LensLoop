

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
  Alert,
} from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import { useFocusEffect } from '@react-navigation/native';
import TopNav from '../components/TopNavbar';
import ThemeButton from '../components/ThemeButton';
import Toast from 'react-native-toast-message';


const { width, height } = Dimensions.get('window');

const PhotoShare = ({ navigation, route }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasPermission, setHasPermission] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);


  const handleLongPress = (img) => {
    setSelectedImages((prevSelected) => {
      if (prevSelected.some((i) => i.uri === img.uri)) {
        // Deselect if already selected
        return prevSelected.filter((i) => i.uri !== img.uri);
      } else {
        // Select new image
        return [...prevSelected, img];
      }
    });
  };

  // Request permissions
  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        const apiLevel = Platform.Version;

        if (apiLevel >= 33) {
          // Android 13+ requires READ_MEDIA_IMAGES
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
            {
              title: 'Photo Gallery Permission',
              message: 'This app needs access to your photos to display them.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            }
          );
          return granted === PermissionsAndroid.RESULTS.GRANTED;
        } else {
          // Android 12 and below use READ_EXTERNAL_STORAGE
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            {
              title: 'Photo Gallery Permission',
              message: 'This app needs access to your photos to display them.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            }
          );
          return granted === PermissionsAndroid.RESULTS.GRANTED;
        }
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    // iOS permissions are handled automatically
    return true;
  };

  // Load photos from camera roll
  const loadPhotos = async () => {
    try {
      setLoading(true);

      const photos = await CameraRoll.getPhotos({
        first: 999999,
        assetType: 'Photos',
        include: ['filename', 'imageSize', 'playableDuration'],
      });

      const photoUris = photos.edges.map((edge) => ({
        uri: edge.node.image.uri,
        timestamp: edge.node.timestamp,
      }));

      photoUris.sort((a, b) => b.timestamp - a.timestamp);

      setImages(photoUris);
    } catch (error) {
      console.error('Error loading photos:', error);
      Toast.show({
        type: 'error',
        text1: 'Gallery Error',
        text2: 'Failed to load photos from your device',
      });
    } finally {
      setLoading(false);
    }
  };


  // Initial permission check
  useEffect(() => {
    const initializeGallery = async () => {
      const permission = await requestPermissions();
      setHasPermission(permission);

      if (permission) {
        await loadPhotos();
      } else {
        setLoading(false);
        Toast.show({
          type: 'error',
          text1: 'Permission Required',
          text2: 'Please allow photo access to view your gallery',
        });

      }
    };

    initializeGallery();
  }, []);

  // Reload photos when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      if (hasPermission) {
        loadPhotos();
      }
    }, [hasPermission])
  );

  // Render loading state
  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <TopNav />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#000" />
          <Text style={styles.loadingText}>Loading photos...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Render permission denied state
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
              if (permission) {
                await loadPhotos();
              }
            }}
          >
            <Text style={styles.retryButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <TopNav />

      {/* Scrollable Gallery */}
      <ScrollView
        contentContainerStyle={[styles.container, { paddingBottom: height * 0.12 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header row */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.selectedText}>
              Recent Images ({images.length})
            </Text>
            <Text>Selected ({selectedImages.length})</Text>
          </View>

          <TouchableOpacity onPress={() => navigation.goBack()}>
            <View style={styles.cancelButton}>
              <Text style={styles.cancelText}>back</Text>
            </View>
          </TouchableOpacity>
        </View>


        {/* Image Grid */}
        {images.length > 0 ? (
          <View style={styles.gridContainer}>
            {images.map((img, index) => (
              <TouchableOpacity
                key={img.uri}
                style={[
                  styles.imgContainer,
                  {
                    marginRight: (index + 1) % 3 === 0 ? 0 : width * 0.015, // no gap after 3rd image
                    borderWidth: 4,
                    borderColor: selectedImages.some((i) => i.uri === img.uri)
                      ? '#007AFF'
                      : 'transparent',
                  },
                ]}
                onPress={() => {
                  if (selectedImages.some((i) => i.uri === img.uri)) {
                    setSelectedImages((prevSelected) =>
                      prevSelected.filter((i) => i.uri !== img.uri)
                    );
                  }
                }}
                onLongPress={() => handleLongPress(img)}
              >
                <Image source={{ uri: img.uri }} style={styles.img} />
              </TouchableOpacity>
            ))}

          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No photos found</Text>
          </View>
        )}


      </ScrollView>
      <ThemeButton
        style={styles.continueBtn}

        text={`Continue → (${selectedImages.length})`}
      // onPress={() =>
      //   navigation.navigate('CreateEvent', { selectedImages })
      // }
      />


    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    paddingHorizontal: width * 0.03,
    paddingVertical: height * 0.02,
    flexGrow: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: height * 0.02,
    alignItems: 'center',
  },
  selectedText: {
    fontWeight: '600',
    fontSize: width * 0.045,
    color: '#000',
  },
  cancelButton: {
    backgroundColor: '#E1711C',
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
    justifyContent: 'flex-start',
  },

  imgContainer: {
    width: (width - width * 0.09) / 3,
    height: (width - width * 0.09) / 3,
    marginBottom: width * 0.015,
    marginRight: width * 0.015,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
  },




  img: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: width * 0.04,
    color: '#666',
  },
  errorText: {
    fontSize: width * 0.045,
    color: '#ff0000',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#000',
    paddingHorizontal: width * 0.08,
    paddingVertical: height * 0.015,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: width * 0.04,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: height * 0.1,
  },
  emptyText: {
    fontSize: width * 0.045,
    color: '#666',
  },
  continueBtn: {
    width: '85%',
    alignSelf: 'center',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    paddingHorizontal: width * 0.03,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: height * 0.015,
  },
});

export default PhotoShare;
