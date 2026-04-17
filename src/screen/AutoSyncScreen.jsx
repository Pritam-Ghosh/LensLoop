// import React from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   ScrollView,
//   Image,
// } from 'react-native';
// import { useNavigation, useRoute } from '@react-navigation/native';
// import { colors } from '../Theme/theme';

// export default function SnapHiveAutoSyncScreen() {
//   const navigation = useNavigation();
//   const route = useRoute();

//   const {
//     photoCount = 0,
//     thumbnails = [],
//     onCreateKey,
//     onSkipKey,
//   } = route.params || {};

//   // Safe fallback (avoid blank UI)
//   const image1 = thumbnails[0] || null;
//   const image2 = thumbnails[1] || thumbnails[0] || null;
//   const image3 = thumbnails[2] || thumbnails[1] || thumbnails[0] || null;

//   const handleCreate = () => {
//     global.AutoSyncHandlers?.[onCreateKey]?.();
//     navigation.goBack();
//   };

//   const handleSkip = () => {
//     global.AutoSyncHandlers?.[onSkipKey]?.();
//     navigation.goBack();
//   };

//   return (
//     <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>

//       {/* Photo Stack */}
//       <View style={styles.photoStackContainer}>
//         <View style={styles.photoStack}>

//           {/* Left */}
//           <View style={[styles.photoCard, styles.photoLeft]}>
//             {image1 && (
//               <Image source={{ uri: image1 }} style={styles.photoPlaceholderBlue} />
//             )}
//           </View>

//           {/* Right */}
//           <View style={[styles.photoCard, styles.photoRight]}>
//             {image2 && (
//               <Image source={{ uri: image2 }} style={styles.photoSmallOrange} />
//             )}
//             {image3 && (
//               <Image source={{ uri: image3 }} style={styles.photoSmallGroup} />
//             )}
//           </View>

//           {/* Main */}
//           <View style={[styles.photoCard, styles.photoMain]}>
//             {image1 && (
//               <Image source={{ uri: image1 }} style={styles.mainPhotoPlaceholder} />
//             )}
//           </View>

//         </View>
//       </View>

//       {/* Title */}
//       <Text style={styles.title}>Auto Sync Photos</Text>
//       <Text style={styles.subtitle}>Photos Found!</Text>

//       {/* Description */}
//       <Text style={styles.description}>
//         We found new photos on your device.{'\n'}
//         Create a Hive to auto sync and share them!
//       </Text>

//       {/* Action Card */}
//       <View style={styles.actionCard}>
//         <View style={styles.thumbnailContainer}>
//           {image1 && <Image source={{ uri: image1 }} style={styles.thumbnailBlue} />}
//           {image2 && <Image source={{ uri: image2 }} style={styles.thumbnailGreen} />}
//           {image3 && <Image source={{ uri: image3 }} style={styles.thumbnailOrange} />}
//         </View>

//         <Text style={styles.actionText}>
//           Create Hive with {photoCount} new {photoCount === 1 ? 'photo' : 'photos'}?
//         </Text>

//         <TouchableOpacity style={styles.createButton} onPress={handleCreate}>
//           <Text style={styles.createButtonText}>Create Hive</Text>
//         </TouchableOpacity>

//         <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
//           <Text style={styles.skipButtonText}>Skip for now</Text>
//         </TouchableOpacity>
//       </View>
//     </ScrollView>
//   );
// }

// /* ===== STYLES (UNCHANGED) ===== */

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#fff' },
//   contentContainer: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 40 },

//   photoStackContainer: { alignItems: 'center', marginBottom: 30, paddingTop: 20 },
//   photoStack: { width: 300, height: 220, position: 'relative' },

//   photoCard: {
//     position: 'absolute',
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.15,
//     shadowRadius: 12,
//     elevation: 8,
//     padding: 8,
//   },

//   photoLeft: {
//     width: 100,
//     height: 140,
//     left: 20,
//     top: 40,
//     transform: [{ rotate: '-12deg' }],
//   },
//   photoRight: {
//     width: 90,
//     height: 140,
//     right: 20,
//     top: 40,
//     transform: [{ rotate: '12deg' }],
//     justifyContent: 'space-between',
//   },
//   photoMain: {
//     width: 180,
//     height: 220,
//     left: 60,
//     top: 0,
//     zIndex: 10,
//   },

//   photoPlaceholderBlue: { flex: 1, borderRadius: 8 },
//   mainPhotoPlaceholder: { flex: 1, borderRadius: 8 },
//   photoSmallOrange: { height: 62, borderRadius: 6 },
//   photoSmallGroup: { height: 62, borderRadius: 6 },

//   title: { fontSize: 32, fontWeight: '700', textAlign: 'center' },
//   subtitle: { fontSize: 32, fontWeight: '700', textAlign: 'center', marginBottom: 16 },
//   description: { fontSize: 16, textAlign: 'center', color: '#666', marginBottom: 30 },

//   actionCard: {
//     backgroundColor: '#f8f9fa',
//     borderRadius: 20,
//     padding: 24,
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#e9ecef',
//   },

//   thumbnailContainer: { flexDirection: 'row', marginBottom: 20, gap: 8 },
//   thumbnailBlue: { width: 80, height: 80, borderRadius: 8 },
//   thumbnailGreen: { width: 80, height: 80, borderRadius: 8 },
//   thumbnailOrange: { width: 80, height: 80, borderRadius: 8 },

//   actionText: { fontSize: 18, fontWeight: '600', marginBottom: 20 },

//   createButton: {
//     backgroundColor: colors.primary,
//     paddingVertical: 16,
//     borderRadius: 12,
//     width: '100%',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   createButtonText: { color: '#fff', fontSize: 18, fontWeight: '600' },

//   skipButton: { paddingVertical: 12 },
//   skipButtonText: { color: colors.primary, fontSize: 16, fontWeight: '500' },
// });


import { View, Text } from 'react-native'
import React from 'react'

const AutoSyncScreen = () => {
  return (
    <View>
      <Text>AutoSyncScreen</Text>
    </View>
  )
}

export default AutoSyncScreen