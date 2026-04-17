import CheckBox from '@react-native-community/checkbox'; // <-- use this instead

// inside your component
<View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
  <CheckBox
    value={isSelected}
    onValueChange={setSelection}
    tintColors={{ true: "#bd1919", false: "#ccc" }} // checkbox color
  />
  <Text style={{ marginLeft: 8 }}>All Day Event</Text>
</View>
