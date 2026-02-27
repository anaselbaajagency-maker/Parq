import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '../theme';

const Button = ({
    title,
    onPress,
    variant = 'primary',
    loading = false,
    disabled = false,
    style
}) => {
    const isSecondary = variant === 'secondary';
    const isOutline = variant === 'outline';

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.7}
            style={[
                styles.button,
                styles[variant],
                disabled && styles.disabled,
                style
            ]}
        >
            {loading ? (
                <ActivityIndicator color={isOutline ? COLORS.primary : COLORS.white} />
            ) : (
                <Text style={[
                    styles.text,
                    isOutline && styles.outlineText,
                    isSecondary && styles.secondaryText
                ]}>
                    {title}
                </Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        paddingVertical: SPACING.md,
        paddingHorizontal: SPACING.lg,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 52,
    },
    primary: {
        backgroundColor: COLORS.primary,
    },
    secondary: {
        backgroundColor: COLORS.secondary,
    },
    outline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: COLORS.primary,
    },
    text: {
        ...TYPOGRAPHY.button,
        color: COLORS.white,
    },
    secondaryText: {
        color: COLORS.white,
    },
    outlineText: {
        color: COLORS.primary,
    },
    disabled: {
        opacity: 0.5,
    },
});

export default Button;
