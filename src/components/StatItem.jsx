import { View, TouchableWithoutFeedback } from 'react-native'
import React from 'react'
import CustomText from './CustomText';

const StatItem = ({ icon: Icon, value, liked, onPress }) => {
    return (
        <TouchableWithoutFeedback onPress={onPress}>
            <View style={{ flexDirection: 'row', gap: 4, alignItems: 'center' }}>
                <Icon
                    size={25}
                    color={liked ? "#E83084" : "#000"}
                    fill={liked ? "#E83084" : "none"}
                />
                <CustomText weight="regular">{value}</CustomText>
            </View>
        </TouchableWithoutFeedback>
    );
};

export default StatItem;