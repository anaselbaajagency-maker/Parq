import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '../theme';

const Input = ({
    label,
    error,
    containerStyle,
    ...props
}) => {
    return (
        <View style={[styles.container, containerStyle]}>
            {label && <Text style={styles.label}>{label}</Text>}
            <TextInput
                style={[
                    styles.input,
                    error && styles.inputError
                ]}
                placeholderTextColor={COLORS.textLight}
                {...props}
            />
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: SPACING.md,
        width: '100%',
    },
    label: {
        ...TYPOGRAPHY.caption,
        color: COLORS.text,
        marginBottom: SPACING.xs,
        fontWeight: '600',
    },
    input: {
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 12,
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        fontSize: 16,
        color: COLORS.text,
        minHeight: 52,
    },
    inputError: {
        borderColor: COLORS.error,
    },
    errorText: {
        color: COLORS.error,
        fontSize: 12,
        marginTop: 4,
    },
});

export default Input;
