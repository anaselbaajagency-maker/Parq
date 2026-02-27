import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '../theme';

const ErrorMessage = ({ message }) => {
    if (!message) return null;

    return (
        <View style={styles.container}>
            <Text style={styles.text}>{message}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff5f5',
        padding: SPACING.md,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.error + '20', // Add transparency
        marginBottom: SPACING.md,
    },
    text: {
        color: COLORS.error,
        fontSize: 14,
        textAlign: 'center',
    },
});

export default ErrorMessage;
