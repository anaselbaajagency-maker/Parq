import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/Loading';

// Screens
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return <Loading />;
    }

    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: '#ffffff',
                    elevation: 0,
                    shadowOpacity: 0,
                    borderBottomWidth: 1,
                    borderBottomColor: '#ebebeb',
                },
                headerTitleStyle: {
                    fontWeight: '700',
                    fontSize: 18,
                },
                headerTintColor: '#222222',
                headerBackTitleVisible: false,
            }}
        >
            {!user ? (
                // Auth Flow
                <>
                    <Stack.Screen
                        name="Login"
                        component={LoginScreen}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="Register"
                        component={RegisterScreen}
                        options={{ title: 'Create Account' }}
                    />
                </>
            ) : (
                // Main Flow
                <Stack.Screen
                    name="Home"
                    component={HomeScreen}
                    options={{ title: 'Parq Listings' }}
                />
            )}
        </Stack.Navigator>
    );
};

export default AppNavigator;
