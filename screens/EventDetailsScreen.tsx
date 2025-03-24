import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function EventDetailsScreen({ route }: any) {
    const { eventId } = route.params;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Détails de l'événement</Text>
            <Text style={styles.text}>ID de l'événement : {eventId}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    text: {
        fontSize: 16,
    },
});
