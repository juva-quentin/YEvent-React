import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

export default function ConfirmationScreen({ route }) {
    const { event } = route.params;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Réservation Confirmée !</Text>
            <Text>{event.titre}</Text>
            <QRCode value={`Event: ${event.id}`} size={200} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { alignItems: 'center', justifyContent: 'center', flex: 1 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
});
