import React from 'react';
import { View, Text, Button, StyleSheet, Image } from 'react-native';

// @ts-ignore
export default function EventDetailsScreen({ route, navigation }) {
    const { event } = route.params;

    return (
        <View style={styles.container}>
            <Image source={{ uri: 'https://via.placeholder.com/400x200' }} style={styles.image} />
            <Text style={styles.title}>{event.titre}</Text>
            <Text>{event.description}</Text>
            <Text>Lieu : {event.lieu}</Text>
            <Text>Date : {new Date(event.date).toLocaleDateString()}</Text>
            <Text>Places restantes : {event.places_restantes}</Text>
            <Button
                title="Réserver"
                onPress={() => navigation.navigate('Booking', { event })}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { padding: 20 },
    image: { width: '100%', height: 200, marginBottom: 20 },
    title: { fontSize: 24, fontWeight: 'bold' },
});
