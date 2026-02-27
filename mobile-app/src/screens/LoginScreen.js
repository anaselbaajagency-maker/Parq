import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    SafeAreaView
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Input from '../components/Input';
import ErrorMessage from '../components/ErrorMessage';
import { COLORS, SPACING, TYPOGRAPHY } from '../theme';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { login } = useAuth();

    const handleLogin = async () => {
        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }

        setLoading(true);
        setError('');

        const result = await login(email, password);
        setLoading(false);

        if (!result.success) {
            setError(result.message);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.flex}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Welcome back</Text>
                        <Text style={styles.subtitle}>Sign in to your Parq account</Text>
                    </View>

                    <ErrorMessage message={error} />

                    <Input
                        label="Email Address"
                        placeholder="example@mail.com"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />

                    <Input
                        label="Password"
                        placeholder="••••••••"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />

                    <Button
                        title="Sign In"
                        onPress={handleLogin}
                        loading={loading}
                        style={styles.loginBtn}
                    />

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Don't have an account? </Text>
                        <Button
                            title="Register here"
                            variant="outline"
                            onPress={() => navigation.navigate('Register')}
                            style={styles.registerLink}
                        />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    flex: {
        flex: 1,
    },
    scrollContent: {
        padding: SPACING.lg,
        flexGrow: 1,
        justifyContent: 'center',
    },
    header: {
        marginBottom: SPACING.xl,
    },
    title: {
        ...TYPOGRAPHY.h1,
        color: COLORS.text,
        marginBottom: SPACING.xs,
    },
    subtitle: {
        ...TYPOGRAPHY.body,
        color: COLORS.textLight,
    },
    loginBtn: {
        marginTop: SPACING.md,
    },
    footer: {
        marginTop: SPACING.xl,
        alignItems: 'center',
    },
    footerText: {
        ...TYPOGRAPHY.caption,
        marginBottom: SPACING.sm,
    },
    registerLink: {
        borderWidth: 0,
        minHeight: 0,
        paddingVertical: 0,
    },
});

export default LoginScreen;
