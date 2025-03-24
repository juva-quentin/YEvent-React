import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';
import { supabase } from '@/utils/supabase';

export default function BookingScreen({ route, navigation }) {
    const { event } = route.params;
    const [nom, setNom] = useState('');
    const [email, setEmail] = useState('');
    const [nbBillets, setNbBillets] = useState('1');

    const handleBooking = async () => {
        const { error } = await supabase.from('reservations').insert([
            {
                utilisateur_id: email,
                evenement_id: event.id,
                nb_billets: parseInt(nbBillets, 10),
                numero_conf: Math.random().toString(36).substring(2, 10),
            },
        ]);

        if (error) {
            Alert.alert('Erreur', 'Impossible de réserver.');
        } else {
            Alert.alert('Succès', 'Réservation confirmée.');
            navigation.navigate('Confirmation', { event });
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Réserver des billets pour {event.titre}</Text>
            <TextInput placeholder="Nom" onChangeText={setNom} style={styles.input} />
            <TextInput placeholder="Email" onChangeText={setEmail} style={styles.input} />
            <TextInput
                placeholder="Nombre de billets"
                keyboardType="numeric"
                onChangeText={setNbBillets}
                style={styles.input}
            />
            <Button title="Confirmer" onPress={handleBooking} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { padding: 20 },
    title: { fontSize: 20, marginBottom: 10 },
    input: { borderBottomWidth: 1, marginBottom: 20, padding: 10 },
});
