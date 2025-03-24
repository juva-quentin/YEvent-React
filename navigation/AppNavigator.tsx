import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '@/screens/HomeScreen';
import EventDetailsScreen from '@/screens/EventDetailsScreen';
import BookingScreen from '@/screens/BookingScreen';
import ConfirmationScreen from '@/screens/ConfirmationScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    return (
        <Stack.Navigator initialRouteName="Home">
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="EventDetails" component={EventDetailsScreen} />
            <Stack.Screen name="Booking" component={BookingScreen} />
            <Stack.Screen name="Confirmation" component={ConfirmationScreen} />
        </Stack.Navigator>
    );
}
