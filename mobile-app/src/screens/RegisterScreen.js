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

const RegisterScreen = ({ navigation }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { register } = useAuth();

    const handleRegister = async () => {
        if (!name || !email || !password || !passwordConfirm) {
            setError('Please fill in all fields');
            return;
        }

        if (password !== passwordConfirm) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        setError('');

        const result = await register(name, email, password, passwordConfirm);
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
                        <Text style={styles.title}>Create Account</Text>
                        <Text style={styles.subtitle}>Join Parq today</Text>
                    </View>

                    <ErrorMessage message={error} />

                    <Input
                        label="Full Name"
                        placeholder="John Doe"
                        value={name}
                        onChangeText={setName}
                    />

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

                    <Input
                        label="Confirm Password"
                        placeholder="••••••••"
                        value={passwordConfirm}
                        onChangeText={setPasswordConfirm}
                        secureTextEntry
                    />

                    <Button
                        title="Register"
                        onPress={handleRegister}
                        loading={loading}
                        style={styles.btn}
                    />

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Already have an account? </Text>
                        <Button
                            title="Sign in here"
                            variant="outline"
                            onPress={() => navigation.navigate('Login')}
                            style={styles.link}
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
    btn: {
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
    link: {
        borderWidth: 0,
        minHeight: 0,
        paddingVertical: 0,
    },
});

export default RegisterScreen;
