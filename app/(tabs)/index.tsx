import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, SafeAreaView, ActivityIndicator, Text } from 'react-native';
import SearchBar from '@/components/SearchBar';
import EventCard from '@/components/EventCard';
import Colors from '@/constants/Colors';
import { fetchEvents } from '@/app/services/eventService'; // Import du service
import { Event } from '@/app/models/event';

export default function HomeScreen() {
    const [events, setEvents] = useState<Event[]>([]); // État pour stocker les événements
    const [loading, setLoading] = useState<boolean>(true); // État pour gérer le chargement

    // Appel du service pour récupérer les événements
    useEffect(() => {
        const loadEvents = async () => {
            setLoading(true);
            const data = await fetchEvents();
            setEvents(data);
            setLoading(false);
        };

        loadEvents().then(r => console.log('Events loaded'));
    }, []);

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                {/* Barre de Recherche */}
                <SearchBar placeholder="Rechercher..." />

                {/* Affichage du chargement */}
                {loading ? (
                    <ActivityIndicator size="large" color={Colors.secondary} />
                ) : events.length > 0 ? (
                    // Liste des événements
                    <FlatList
                        data={events}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <EventCard
                                image={'https://via.placeholder.com/400x200'} // Valeur par défaut si image non dispo
                                price={`${item.capacite}€`}
                                title={item.titre}
                                date={new Date(item.date).toLocaleDateString()} // Conversion de la date
                                places={item.places_restantes}
                                location={item.lieu}
                                onPress={() => console.log(`Détails de l'événement : ${item.titre}`)}
                            />
                        )}
                    />
                ) : (
                    <Text style={styles.emptyText}>Aucun événement trouvé.</Text>
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    container: {
        flex: 1,
    },
    emptyText: {
        color: Colors.textSecondary,
        fontSize: 16,
        textAlign: 'center',
        marginTop: 20,
    },
});
