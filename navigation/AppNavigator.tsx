import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CustomTabBar from '@/components/CustomTapBar';

// Import des écrans
import HomeScreen from '@/screens/HomeScreen';
import EventDetailsScreen from '@/screens/EventDetailsScreen';
import BookingScreen from '@/screens/BookingScreen';
import ConfirmationScreen from '@/screens/ConfirmationScreen';
import ProfileScreen from '@/screens/ProfileScreen';
import MapsScreen from '@/screens/MapScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Navigation des onglets
function BottomTabNavigator() {
    return (
        <Tab.Navigator
            tabBar={(props) => <CustomTabBar {...props} />} // Barre d'onglets personnalisée
            screenOptions={{ headerShown: false }}
        >
            <Tab.Screen name="Cartes" component={MapsScreen} />
            <Tab.Screen name="Accueil" component={HomeScreen} />
            <Tab.Screen name="Profil" component={ProfileScreen} />
        </Tab.Navigator>
    );
}

// Navigation principale avec Stack
export default function AppNavigator() {
    return (
        <Stack.Navigator>
            {/* Onglets principaux */}
            <Stack.Screen
                name="MainTabs"
                component={BottomTabNavigator}
                options={{ headerShown: false }}
            />

            {/* Autres écrans */}
            <Stack.Screen
                name="EventDetails"
                component={EventDetailsScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Booking"
                component={BookingScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Confirmation"
                component={ConfirmationScreen}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
}
