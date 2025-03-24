import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    ScrollView,
    SafeAreaView,
} from 'react-native';
import Colors from '@/constants/Colors';
import { getEventById } from '@/services/eventService';
import { createReservation } from '@/services/reservationService';
import GradientBackground from '@/components/GradientBackground';
import CustomButton from '@/components/CustomButton';
// @ts-ignore
import Icon from 'react-native-vector-icons/Ionicons';
import SeatSelector from "@/components/SeatSelector";
import ConfirmationMessage from '@/components/ConfirmationMessage';
import { formatDate } from "@/utils/dateUtils";

export default function EventDetailsScreen({ route, navigation }: any) {
    const { eventId } = route.params;
    const [event, setEvent] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedSeats, setSelectedSeats] = useState<number>(1); // État pour les places sélectionnées
    const [showConfirmReservation, setShowConfirmReservation] = useState<boolean>(false);

    useEffect(() => {
        const fetchEventDetails = async () => {
            const { data, error } = await getEventById(eventId);
            if (error) {
                Alert.alert('Erreur', 'Impossible de récupérer les détails de l\'événement.');
            } else {
                setEvent(data);
            }
            setLoading(false);
        };

        fetchEventDetails();
    }, [eventId]);

    const handleReservation = async () => {
        setShowConfirmReservation(false); // Ferme la boîte de confirmation
        try {
            const { error } = await createReservation(eventId, selectedSeats);

            if (error) {
                console.error('Erreur lors de la réservation :', error.message);
                Alert.alert('Erreur', 'Impossible d’effectuer la réservation. Veuillez réessayer.');
            } else {
                // Met à jour les places restantes localement
                setEvent((prev: any) => ({
                    ...prev,
                    places_restantes: prev.places_restantes - selectedSeats,
                }));

                Alert.alert('Réservation réussie', `Vous avez réservé ${selectedSeats} places pour cet événement.`);
            }
        } catch (err) {
            console.error('Erreur inattendue :', err);
            Alert.alert('Erreur', 'Une erreur inattendue est survenue.');
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <GradientBackground startColor={Colors.secondary} endColor={Colors.background} locations={[0, 0.2]}>
            <SafeAreaView style={styles.container}>
                {/* AppBar */}
                <View style={styles.appBar}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Icon name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.appBarTitle}>Réservation</Text>
                </View>

                {/* Card principale */}
                <ScrollView contentContainerStyle={styles.cardContainer}>
                    <View style={styles.card}>
                        {/* Image et titre */}
                        <View style={styles.header}>
                            <Image source={{ uri: 'https://via.placeholder.com/400x200' }} style={styles.image} />
                            <View style={styles.titleContainer}>
                                <Text style={styles.title}>{event.titre}</Text>
                                <Text style={styles.location}>{event.lieu}</Text>
                            </View>
                        </View>
                        <View style={styles.separator} />

                        {/* Description */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Description</Text>
                            <Text style={styles.description}>{event.description}</Text>
                        </View>

                        {/* Détails */}
                        <View style={styles.detailsContainer}>
                            <View style={styles.detailBox}>
                                <Text style={styles.sectionTitle}>Date</Text>
                                <Text style={styles.placesValue}>{formatDate(event.date)}</Text>
                            </View>
                            <View style={styles.detailBox}>
                                <Text style={styles.sectionTitle}>Capacité</Text>
                                <Text style={styles.placesValue}>{event.capacite} places</Text>
                            </View>
                        </View>

                        <View style={styles.detailsContainer}>
                            <View style={styles.detailBox}>
                                <Text style={styles.sectionTitle}>Places restantes</Text>
                                <Text style={styles.placesValue}>{event.places_restantes} places restantes</Text>
                            </View>
                            <View style={styles.detailBox}>
                                <Text style={styles.sectionTitle}>Prix total</Text>
                                <Text style={styles.placesValue}>{event.prix ? event.prix*selectedSeats+'€' : '0,00€'}</Text>
                            </View>
                        </View>

                        {/* Places restantes */}


                        <View style={styles.footer}>
                            {/* SeatSelector */}
                            <SeatSelector
                                onValueChange={(value) => setSelectedSeats(value)}
                                maxSeats={event.places_restantes}
                            />

                            {/* Bouton Réserver */}
                            <TouchableOpacity
                                style={[styles.button, { backgroundColor: Colors.secondary }]}
                                onPress={() => setShowConfirmReservation(true)}
                            >
                                <Text style={styles.buttonText}>Réserver</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>

                {/* ConfirmationDialog */}
                <ConfirmationMessage
                    visible={showConfirmReservation}
                    title="Confirmation de réservation"
                    message={`Voulez-vous réserver ${selectedSeats} place(s) pour cet événement ?`}
                    onConfirm={handleReservation}
                    onCancel={() => setShowConfirmReservation(false)}
                    confirmText="Confirmer"
                    cancelText="Annuler"
                />
            </SafeAreaView>
        </GradientBackground>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    appBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 60,
        elevation: 5,
    },
    backButton: { position: 'absolute', left: 20, zIndex: 1 },
    appBarTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
    cardContainer: { padding: 20, alignItems: 'center' },
    card: {
        backgroundColor: Colors.card,
        borderRadius: 10,
        padding: 15,
        elevation: 5,
        width: '100%',
    },
    header: { flexDirection: 'row', alignItems: 'center' },
    image: { width: 100, height: 100, borderRadius: 10 },
    titleContainer: { marginLeft: 15, flex: 1 },
    title: { fontSize: 17, fontWeight: 'bold', color: Colors.text },
    location: { fontSize: 13, color: Colors.textSecondary },
    section: { marginTop: 20 },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', color: Colors.text },
    description: { fontSize: 13, color: Colors.textSecondary, marginTop: 5, marginBottom: 10 },
    detailsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, marginBottom: 20 },
    detailBox: { alignItems: 'flex-start', flex: 1 },
    placesValue: { fontSize: 13, color: Colors.secondary },
    footer: {
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 10,
    },
    button: {
        flex: 1,
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: { color: '#fff', fontWeight: '600', fontSize: 15 },
    separator: { height: 1, backgroundColor: Colors.variant, marginVertical: 15 },
});
