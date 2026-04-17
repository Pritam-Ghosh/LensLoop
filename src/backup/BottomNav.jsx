import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
// icons
import NavCamera from '../../assets/svg/navCamera.svg';
import NavHome from '../../assets/svg/navHome.svg';
import NavMessage from '../../assets/svg/navMessage.svg';
import NavPeople from '../../assets/svg/navPeople.svg';


const BottomNav = () => {
  return (
    <View style={styles.container}>
      {/* Left Icons */}
      <TouchableOpacity>
      <NavHome width={32} height={32}/>
      </TouchableOpacity>
      <TouchableOpacity style={{ position: 'relative' }}>
          <NavMessage  width={32} height={32}/>
        {/* Notification Badge */}
        {/* <View style={styles.badge}>
          <Text style={styles.badgeText}></Text>
        </View> */}
      </TouchableOpacity>

      {/* Center Floating Button */}
      <TouchableOpacity style={styles.fab}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      {/* Right Icons */}
      <TouchableOpacity>
       <NavCamera  width={32} height={32}/>
      </TouchableOpacity>
      <TouchableOpacity>
         <NavPeople  width={32} height={32}/>
      </TouchableOpacity>
    </View>
  );
};



const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 70,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    position: 'absolute',
    bottom: -120,
    left: 0,
    right: 0,
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
    borderRadius: 70 / 2,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 20, // pushes it above navbar
    alignSelf: 'center',
    elevation: 6, // shadow for Android
    shadowColor: '#000', // shadow for iOS
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

