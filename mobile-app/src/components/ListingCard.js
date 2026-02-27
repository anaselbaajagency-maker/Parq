import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS } from '../theme';

const ListingCard = ({ listing, onPress }) => {
    // Use image_hero or a placeholder
    const imageUrl = listing.image_hero || 'https://via.placeholder.com/400x300?text=No+Image';

    return (
        <TouchableOpacity
            activeOpacity={0.9}
            style={styles.container}
            onPress={onPress}
        >
            <Image source={{ uri: imageUrl }} style={styles.image} />

            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.title} numberOfLines={1}>{listing.title}</Text>
                    <Text style={styles.price}>{listing.price}</Text>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.location} numberOfLines={1}>
                        📍 {listing.location || 'Location not specified'}
                    </Text>
                    {listing.rating && (
                        <Text style={styles.rating}>⭐ {listing.rating}</Text>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        marginBottom: SPACING.lg,
        overflow: 'hidden',
        ...SHADOWS.medium,
    },
    image: {
        width: '100%',
        height: 200,
        backgroundColor: COLORS.surface,
    },
    content: {
        padding: SPACING.md,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.xs,
    },
    title: {
        ...TYPOGRAPHY.h3,
        color: COLORS.text,
        flex: 1,
        marginRight: SPACING.sm,
    },
    price: {
        ...TYPOGRAPHY.h3,
        color: COLORS.primary,
        fontWeight: '700',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    location: {
        ...TYPOGRAPHY.caption,
        color: COLORS.textLight,
        flex: 1,
    },
    rating: {
        ...TYPOGRAPHY.caption,
        color: COLORS.text,
        fontWeight: '600',
    },
});

export default ListingCard;
