import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, ActivityIndicator, Alert, TouchableOpacity, Text, Button } from 'react-native';
import MapView, { Marker, MapType, Callout } from 'react-native-maps';
import Colors from '@/constants/Colors';
// @ts-ignore
import Icon from 'react-native-vector-icons/Ionicons';
import { getCurrentLocation, startLocationUpdates } from '@/services/locationService';
import { fetchEvents } from '@/services/eventService';
import { Event } from '@/models/event';

export default function MapsScreen({ navigation }: any) {
    const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [mapType, setMapType] = useState<MapType>('standard');
    const [events, setEvents] = useState<Event[]>([]);

    const mapRef = useRef<MapView>(null);

    // Récupérer la localisation et les événements
    const fetchData = async () => {
        setLoading(true);
        try {

            const currentLocation = await getCurrentLocation();
            setLocation(currentLocation);


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
                                onCalloutPress={() => navigation.navigate('EventDetails', { eventId: event.id })}
                            >
                                <Callout tooltip>
                                    <View style={styles.calloutContainer}>
                                        <Text style={styles.calloutTitle}>{event.titre}</Text>
                                        <Text style={styles.calloutSubtitle}>{event.lieu}</Text>
                                    </View>
                                </Callout>
                            </Marker>
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
    callout: {
        width: 150,
        alignItems: 'center',
    },
    calloutTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    calloutSubtitle: {
        fontSize: 12,
        color: Colors.textSecondary,
        marginBottom: 8,
    },
    detailButton: {
        backgroundColor: Colors.secondary,
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 8,
    },
    detailButtonText: {
        color: '#fff',
        fontWeight: 'bold',
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
    calloutContainer: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 8,
        width: 160,
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
});
