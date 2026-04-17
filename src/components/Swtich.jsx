import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';

const ToggleSwitchExample = () => {
  const [isEnabled, setIsEnabled] = useState(false);

  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  return (
    <View>
      {/* <Text style={styles.label}>
        {isEnabled ? 'Switch is ON' : 'Switch is OFF'}
      </Text> */}
      <Switch
        trackColor={{ false: '#767577', true: '#81b0ff' }}
        thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleSwitch}
        value={isEnabled}
      />
    </View>
  );
};

export default ToggleSwitchExample;

const styles = StyleSheet.create({

  label: {
    marginBottom: 10,
    fontSize: 16,
  },
});
