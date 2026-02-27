import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { COLORS } from '../theme';

const Loading = ({ size = 'large', color = COLORS.primary }) => {
    return (
        <View style={styles.container}>
            <ActivityIndicator size={size} color={color} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
});

export default Loading;
