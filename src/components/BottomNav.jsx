import { View, Text, StyleSheet, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import React from 'react';
// icons
import NavCamera from '../../assets/svg/navCamera.svg';
import NavHome from '../../assets/svg/navHome.svg';
import NavMessage from '../../assets/svg/navMessage.svg';
import NavPeople from '../../assets/svg/navPeople.svg';
import { useNavigation } from '@react-navigation/native';

const BottomNav = () => {

  const navigation = useNavigation();
  return (
    <View style={styles.wrapper}>
      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      {/* Bottom Bar */}
      <View style={styles.container}>
        {/* Left Icons */}
        <TouchableWithoutFeedback onPress={() => navigation.navigate("HomeScreen")}>
          <NavHome width={32} height={32} />
        </TouchableWithoutFeedback>
        <TouchableOpacity style={{ position: 'relative' }}>
          <NavMessage width={32} height={32} />
          {/* Notification Badge */}
          {/* <View style={styles.badge}>
            <Text style={styles.badgeText}>3</Text>
          </View> */}
        </TouchableOpacity>

        {/* Spacer for FAB */}
        <View style={{ width: 70 }} />

        {/* Right Icons */}
        <TouchableOpacity>
          <NavCamera width={32} height={32} />
        </TouchableOpacity>
        <TouchableOpacity>
          <NavPeople width={32} height={32} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    
    position: 'absolute',
    bottom: -120,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  container: {

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 70,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    width: '100%',
    paddingHorizontal: 20,
  },
  badge: {
    position: 'absolute',
    right: -8,
    top: -4,
    backgroundColor: 'gold',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#000',
  },
  fab: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 20, // sits above navbar
    zIndex: 10,
    elevation: 6, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  fabText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
});

export default BottomNav;
