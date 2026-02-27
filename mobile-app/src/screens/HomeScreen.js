import React, { useState, useEffect } from 'react';
import {
    View,
    FlatList,
    Text,
    StyleSheet,
    RefreshControl,
    SafeAreaView
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import ListingCard from '../components/ListingCard';
import Loading from '../components/Loading';
import Button from '../components/Button';
import { COLORS, SPACING, TYPOGRAPHY } from '../theme';

const HomeScreen = () => {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);

    const { logout, user } = useAuth();

    const fetchListings = async () => {
        try {
            setError(null);
            const response = await api.get('/listings');
            // Format listings for mobile (similar to web helper)
            const data = Array.isArray(response.data) ? response.data : (response.data.data || []);

            const formatted = data.map(item => ({
                ...item,
                price: `${item.price} €`, // Assuming currency for now
                location: item.city?.name || 'Location',
                rating: item.rating || 4.5,
            }));

            setListings(formatted);
        } catch (err) {
            console.error('Fetch listings error:', err);
            setError('Failed to load listings. Please try again later.');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchListings();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchListings();
    };

    if (loading && !refreshing) {
        return <Loading />;
    }

    const renderEmpty = () => (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No listings found</Text>
            <Button
                title="Retry"
                variant="outline"
                onPress={fetchListings}
                style={styles.retryBtn}
            />
        </View>
    );

    const renderHeader = () => (
        <View style={styles.header}>
            <Text style={styles.welcome}>Hello, {user?.name || 'User'}</Text>
            <Button
                title="Logout"
                variant="outline"
                onPress={logout}
                style={styles.logoutBtn}
            />
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            {error && (
                <View style={styles.errorBanner}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            )}
            <FlatList
                data={listings}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <ListingCard listing={item} onPress={() => { }} />
                )}
                contentContainerStyle={styles.listContent}
                ListHeaderComponent={renderHeader}
                ListEmptyComponent={renderEmpty}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[COLORS.primary]}
                    />
                }
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    listContent: {
        padding: SPACING.md,
        paddingBottom: SPACING.xxl,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.lg,
    },
    welcome: {
        ...TYPOGRAPHY.h2,
        color: COLORS.text,
    },
    logoutBtn: {
        minHeight: 36,
        paddingVertical: 4,
        paddingHorizontal: 12,
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 50,
    },
    emptyText: {
        ...TYPOGRAPHY.body,
        color: COLORS.textLight,
        marginBottom: SPACING.md,
    },
    retryBtn: {
        width: 120,
    },
    errorBanner: {
        backgroundColor: COLORS.error,
        padding: SPACING.sm,
        alignItems: 'center',
    },
    errorText: {
        color: COLORS.white,
        fontSize: 12,
        fontWeight: '600',
    },
});

export default HomeScreen;
