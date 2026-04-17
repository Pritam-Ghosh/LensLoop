import { View, StyleSheet, TextInput, Dimensions } from 'react-native'
import React from 'react'
import { Search } from 'lucide-react-native';
const { width, height } = Dimensions.get('window');
const SearchBar = ({ value, onChangeText, placeholder = "Search" }) => {
    return (
        <View style={styles.searchContainer}>
            <TextInput
                style={styles.searchInput}
                placeholder={placeholder}
                placeholderTextColor="#9CA3AF"
                value={value}
                onChangeText={onChangeText}
            />
            <Search color="#6B7280" size={20} />
        </View>
    );
};


const styles = StyleSheet.create({

searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 24,
    paddingVertical: 18,
    marginTop: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    width: "100%",
},
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#000',
        padding: 0,
    },

})

export default SearchBar