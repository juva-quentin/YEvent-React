import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CustomTabBar from '@/components/CustomTapBar';

import HomeScreen from '@/screens/HomeScreen';
import EventDetailsScreen from '@/screens/EventDetailsScreen';
import ConfirmationScreen from '@/screens/ConfirmationScreen';
import ProfileScreen from '@/screens/ProfileScreen';
import MapsScreen from '@/screens/MapScreen';
import TicketDetailsScreen from "@/screens/TicketDetailsScreen";
import QRCodeScannerScreen from "@/screens/QRScannerScreen";
import QRResultScreen from "@/screens/QRResultScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();


function BottomTabNavigator() {
    return (
        <Tab.Navigator
            tabBar={(props) => <CustomTabBar {...props} />}
            screenOptions={{ headerShown: false }}
            initialRouteName="Accueil"
        >
            <Tab.Screen name="Cartes" component={MapsScreen} />
            <Tab.Screen name="Accueil" component={HomeScreen} />
            <Tab.Screen name="Profil" component={ProfileScreen} />
        </Tab.Navigator>
    );
}


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
                name="Confirmation"
                component={ConfirmationScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="TicketDetails"
                component={TicketDetailsScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="QRCodeScanner"
                component={QRCodeScannerScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="QRResultScreen"
                component={QRResultScreen}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
}
