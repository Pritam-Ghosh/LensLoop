import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Modal,
  Dimensions,
  PanResponder,
  Image,
} from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const PhotoCropModal = ({ visible, photoUri, onClose, onCropComplete }) => {
  const [cropArea, setCropArea] = useState({
    x: SCREEN_WIDTH * 0.1,
    y: SCREEN_HEIGHT * 0.2,
    width: SCREEN_WIDTH * 0.8,
    height: SCREEN_HEIGHT * 0.4,
  });

  const [imageLayout, setImageLayout] = useState(null);
  const cropPositionRef = useRef({ x: SCREEN_WIDTH * 0.1, y: SCREEN_HEIGHT * 0.2 });
  const cropSizeRef = useRef({ width: SCREEN_WIDTH * 0.8, height: SCREEN_HEIGHT * 0.4 });

  // MOVE CROP AREA
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        cropPositionRef.current = { x: cropArea.x, y: cropArea.y };
      },
      onPanResponderMove: (_, gesture) => {
        const maxX = SCREEN_WIDTH - cropArea.width;
        const maxY = SCREEN_HEIGHT - cropArea.height;

        const newX = Math.max(0, Math.min(cropPositionRef.current.x + gesture.dx, maxX));
        const newY = Math.max(0, Math.min(cropPositionRef.current.y + gesture.dy, maxY));

        setCropArea({
          ...cropArea,
          x: newX,
          y: newY,
        });
      },
      onPanResponderRelease: () => {
        cropPositionRef.current = { x: cropArea.x, y: cropArea.y };
      },
    })
  ).current;

  // RESIZE HANDLE
  const resizeResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        cropSizeRef.current = { width: cropArea.width, height: cropArea.height };
        cropPositionRef.current = { x: cropArea.x, y: cropArea.y };
      },
      onPanResponderMove: (_, gesture) => {
        // resizing from bottom-right corner
        const newWidth = Math.max(
          100,
          Math.min(cropSizeRef.current.width + gesture.dx, SCREEN_WIDTH - cropPositionRef.current.x)
        );
        const newHeight = Math.max(
          100,
          Math.min(cropSizeRef.current.height + gesture.dy, SCREEN_HEIGHT - cropPositionRef.current.y)
        );

        setCropArea({
          ...cropArea,
          width: newWidth,
          height: newHeight,
        });
      },
      onPanResponderRelease: () => {
        cropSizeRef.current = { width: cropArea.width, height: cropArea.height };
      },
    })
  ).current;

  const handleCrop = () => {
    if (!imageLayout) {
      onCropComplete(cropArea);
      return;
    }

    const cropData = {
      x: cropArea.x - imageLayout.x,
      y: cropArea.y - imageLayout.y,
      width: cropArea.width,
      height: cropArea.height,
      imageWidth: imageLayout.width,
      imageHeight: imageLayout.height,
    };

    onCropComplete(cropData);
  };

  const handleReset = () => {
    const resetArea = {
      x: SCREEN_WIDTH * 0.1,
      y: SCREEN_HEIGHT * 0.2,
      width: SCREEN_WIDTH * 0.8,
      height: SCREEN_HEIGHT * 0.4,
    };
    setCropArea(resetArea);
    cropPositionRef.current = { x: resetArea.x, y: resetArea.y };
    cropSizeRef.current = { width: resetArea.width, height: resetArea.height };
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.headerButtonText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Crop Photo</Text>
          <TouchableOpacity onPress={handleReset}>
            <Text style={styles.headerButtonText}>Reset</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.imageWrapper}>
          <Image
            source={{ uri: photoUri }}
            style={styles.image}
            resizeMode="contain"
            onLayout={(e) => {
              const { x, y, width, height } = e.nativeEvent.layout;
              setImageLayout({ x, y, width, height });
            }}
          />

          {/* Overlay */}
          <View style={styles.overlay} pointerEvents="box-none">
            <View
              style={[
                styles.cropArea,
                {
                  top: cropArea.y,
                  left: cropArea.x,
                  width: cropArea.width,
                  height: cropArea.height,
                },
              ]}
            >
              {/* Border + move */}
              <View style={styles.cropBorder} {...panResponder.panHandlers}>
                {/* Grid */}
                <View style={[styles.gridLine, styles.gridVertical1]} />
                <View style={[styles.gridLine, styles.gridVertical2]} />
                <View style={[styles.gridLine, styles.gridHorizontal1]} />
                <View style={[styles.gridLine, styles.gridHorizontal2]} />

                {/* Corners */}
                <View style={[styles.corner, styles.topLeft]} />
                <View style={[styles.corner, styles.topRight]} />
                <View style={[styles.corner, styles.bottomLeft]} />
                <View style={[styles.corner, styles.bottomRight]} />
              </View>

              {/* Resize handle */}
              <View style={styles.resizeHandle} {...resizeResponder.panHandlers}>
                <View style={styles.resizeIcon} />
              </View>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity onPress={handleCrop} style={styles.cropButton}>
            <Text style={styles.cropButtonText}>Apply Crop</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#1a1a1a',
  },
  headerButtonText: { color: '#fff', fontSize: 16 },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  imageWrapper: { flex: 1, position: 'relative' },
  image: { width: '100%', height: '100%' },
  overlay: { ...StyleSheet.absoluteFillObject },
  cropArea: {
    position: 'absolute',
  },
  cropBorder: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#fff',
  },
  gridLine: { position: 'absolute', backgroundColor: 'rgba(255,255,255,0.3)' },
  gridVertical1: { left: '33.33%', width: 1, height: '100%' },
  gridVertical2: { left: '66.66%', width: 1, height: '100%' },
  gridHorizontal1: { top: '33.33%', width: '100%', height: 1 },
  gridHorizontal2: { top: '66.66%', width: '100%', height: 1 },
  corner: { position: 'absolute', width: 20, height: 20, borderColor: '#fff', borderWidth: 3 },
  topLeft: { top: -2, left: -2, borderRightWidth: 0, borderBottomWidth: 0 },
  topRight: { top: -2, right: -2, borderLeftWidth: 0, borderBottomWidth: 0 },
  bottomLeft: { bottom: -2, left: -2, borderRightWidth: 0, borderTopWidth: 0 },
  bottomRight: { bottom: -2, right: -2, borderLeftWidth: 0, borderTopWidth: 0 },
  resizeHandle: {
    position: 'absolute',
    bottom: -15,
    right: -15,
    width: 40,
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resizeIcon: {
    width: 12,
    height: 12,
    borderRightWidth: 3,
    borderBottomWidth: 3,
    borderColor: '#000',
    transform: [{ rotate: '-45deg' }],
  },
  footer: { padding: 20, backgroundColor: '#1a1a1a' },
  cropButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  cropButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default PhotoCropModal;
