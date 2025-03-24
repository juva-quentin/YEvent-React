import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AppNavigator from '@/navigation/AppNavigator';
import AuthNavigator from '@/navigation/AuthNavigator';
import { ActivityIndicator, View } from 'react-native';

function RootNavigator() {
    const { user, loading } = useAuth();

    // Affiche un loader pendant le chargement initial
    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <NavigationContainer>
            {user ? <AppNavigator /> : <AuthNavigator />}
        </NavigationContainer>
    );
}

export default function App() {
    return (
        <AuthProvider>
            <RootNavigator />
        </AuthProvider>
    );
}
