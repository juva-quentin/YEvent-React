import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, ActivityIndicator, Alert, TouchableOpacity, Text } from 'react-native';
import MapView, { Marker, MapType } from 'react-native-maps';
import Colors from '@/constants/Colors';
import Icon from 'react-native-vector-icons/Ionicons';
import { getCurrentLocation, startLocationUpdates } from '@/services/locationService';
import { fetchEvents } from '@/services/eventService';
import { Event } from '@/models/event';

export default function MapsScreen() {
    const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [mapType, setMapType] = useState<MapType>('standard'); // État pour le type de carte
    const [events, setEvents] = useState<Event[]>([]); // État pour les événements

    const mapRef = useRef<MapView>(null);

    // Récupérer la localisation et les événements
    const fetchData = async () => {
        setLoading(true);
        try {
            // Récupération des coordonnées actuelles
            const currentLocation = await getCurrentLocation();
            setLocation(currentLocation);

            // Fetch des événements avec coordonnées
            const fetchedEvents = await fetchEvents();
            setEvents(fetchedEvents);
        } catch (error) {
            Alert.alert('Erreur', 'Impossible de récupérer les données.');
        } finally {
            setLoading(false);
        }
    };

    const recenterMap = async () => {
        try {
            const currentLocation = await getCurrentLocation();
            setLocation(currentLocation);
            mapRef.current?.animateToRegion({
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            });
        } catch (error) {
            Alert.alert('Erreur', 'Impossible de récupérer votre position.');
        }
    };

    const toggleMapType = () => {
        const types: MapType[] = ['standard', 'satellite', 'hybrid'];
        const currentIndex = types.indexOf(mapType);
        const nextType = types[(currentIndex + 1) % types.length];
        setMapType(nextType);
    };

    useEffect(() => {
        fetchData();
        startLocationUpdates((newLocation) => setLocation(newLocation));
    }, []);

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color={Colors.secondary} />
            ) : (
                <>
                    <MapView
                        ref={mapRef}
                        style={styles.map}
                        mapType={mapType}
                        region={{
                            latitude: location?.latitude || 0,
                            longitude: location?.longitude || 0,
                            latitudeDelta: 0.01,
                            longitudeDelta: 0.01,
                        }}
                        showsUserLocation={true}
                    >
                        {/* Affichage des marqueurs pour les événements */}
                        {events.map((event) => (
                            <Marker
                                key={event.id}
                                coordinate={{
                                    latitude: event.coordonnees.latitude,
                                    longitude: event.coordonnees.longitude,
                                }}
                                title={event.titre}
                                description={event.lieu}
                            />
                        ))}
                    </MapView>

                    {/* Bouton pour recentrer */}
                    <TouchableOpacity style={styles.floatingButton} onPress={recenterMap}>
                        <Icon name="locate" size={30} color="#fff" />
                    </TouchableOpacity>

                    {/* Bouton pour changer le type de carte */}
                    <TouchableOpacity style={styles.mapTypeButton} onPress={toggleMapType}>
                        <Text style={styles.mapTypeText}>
                            {mapType.charAt(0).toUpperCase() + mapType.slice(1)}
                        </Text>
                    </TouchableOpacity>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    floatingButton: {
        position: 'absolute',
        bottom: 120,
        right: 30,
        backgroundColor: Colors.secondary,
        borderRadius: 50,
        padding: 12,
        elevation: 5,
    },
    mapTypeButton: {
        position: 'absolute',
        bottom: 120,
        left: 30,
        backgroundColor: Colors.secondary,
        borderRadius: 10,
        paddingVertical: 8,
        paddingHorizontal: 12,
        elevation: 5,
    },
    mapTypeText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
});
