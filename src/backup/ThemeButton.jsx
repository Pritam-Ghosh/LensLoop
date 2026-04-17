import { View, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native'
import React from 'react'

const ThemeButton = ({ text, onPress }) => {
  return (
    <TouchableWithoutFeedback onPress={onPress} >
      <View style={styles.continueBtn}>
        <Text style={styles.continueTxt}>{text}</Text>
      </View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  continueBtn: {
    backgroundColor: '#FDD32E',
    paddingVertical: 21,
    paddingHorizontal: 30,
    borderRadius: 12,
    alignItems: 'center',
    width: "100%",
    marginVertical: 21, // use marginVertical instead of marginBlock
  },

  continueTxt: {
    fontSize: 16,
    color: '#000',
    fontWeight: '600', // must be string
  },
})

export default ThemeButton
