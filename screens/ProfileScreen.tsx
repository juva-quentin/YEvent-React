import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Colors from '@/constants/Colors';
// @ts-ignore
import Icon from 'react-native-vector-icons/Ionicons';
import GradientBackground from "@/components/GradientBackground";
import { signOut } from '@/services/authService';
import { getCurrentUser } from '@/services/userService';
import { getUserReservations } from '@/services/reservationService';
import { getEventById } from '@/services/eventService';
import ConfirmationMessage from '@/components/ConfirmationMessage';
import EventCard from "@/components/EventCard";
import { formatDate } from "@/utils/dateUtils";

export default function ProfileScreen({ navigation }: { navigation: any }) {
    const [user, setUser] = useState<any>(null);
    const [reservations, setReservations] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [refreshing, setRefreshing] = useState<boolean>(false); // État pour le pull-to-refresh
    const [showConfirmLogout, setShowConfirmLogout] = useState<boolean>(false);

    // Fonction pour récupérer les données de l'utilisateur et des réservations
    const fetchUserData = async () => {
        setLoading(true); // Active le chargement
        const { data: userData, error: userError } = await getCurrentUser();
        if (userError) {
            Alert.alert('Erreur', 'Impossible de récupérer vos informations.');
            setLoading(false);
            return;
        }
        setUser(userData);

        const { data: reservationsData, error: reservationsError } = await getUserReservations(userData.id);
        if (reservationsError) {
            Alert.alert('Erreur', 'Impossible de récupérer vos réservations.');
            setLoading(false);
            return;
        }

        // Enrichir chaque réservation avec les détails de l'événement
        const enrichedReservations = await Promise.all(
            reservationsData!.map(async (reservation: any) => {
                const { data: eventData, error: eventError } = await getEventById(reservation.evenement_id);
                if (eventError) {
                    console.error(`Erreur pour l'événement ${reservation.evenement_id}:`, eventError.message);
                    return null;
                }
                return {
                    ...reservation,
                    event: eventData,
                };
            })
        );

        setReservations(enrichedReservations.filter(Boolean)); // Filtrer les erreurs
        setLoading(false); // Désactive le chargement
        setRefreshing(false); // Désactive le rafraîchissement
    };

    // Exécute la récupération des données à l'initialisation
    useEffect(() => {
        fetchUserData();
    }, []);

    // Réécoute les focus pour réactualiser les données
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', fetchUserData);
        return unsubscribe;
    }, [navigation]);

    // Déconnexion
    const handleSignOut = async () => {
        const { error } = await signOut();
        if (error) {
            Alert.alert('Erreur', 'Impossible de se déconnecter.');
        } else {
            navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.secondary} />
            </View>
        );
    }

    return (
        <GradientBackground startColor={Colors.primary} endColor={Colors.background} locations={[0, 0.4]}>
            <SafeAreaView style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.profilePictureContainer}>
                        <Icon name="person-outline" size={70} color="#fff" />
                    </View>
                    <Text style={styles.name}>{user?.nom || 'Nom inconnu'}</Text>
                    <Text style={styles.email}>{user?.email || 'Email inconnu'}</Text>
                    <View style={styles.headerButtons}>
                        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('QRCodeScanner')}>
                            <Icon name="qr-code-outline" size={24} color="#fff" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconButton} onPress={() => setShowConfirmLogout(true)}>
                            <Icon name="log-out-outline" size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Liste des réservations */}
                <View style={styles.reservationSection}>
                    <Text style={styles.sectionTitle}>Vos réservations</Text>
                    {reservations.length > 0 ? (
                        <FlatList
                            data={reservations}
                            keyExtractor={(item) => item.id}
                            contentContainerStyle={styles.flatList}
                            onRefresh={() => {
                                setRefreshing(true);
                                fetchUserData();
                            }} // Fonction de rafraîchissement
                            refreshing={refreshing} // État de rafraîchissement
                            renderItem={({ item }) => (
                                <EventCard
                                    image="https://placehold.co/400x200.png"
                                    price={`${item.event.prix * item.nb_billets + '€' || 'Gratuit'}`}
                                    title={item.event.titre}
                                    date={formatDate(item.event.date)}
                                    places={item.nb_billets}
                                    location={item.event.lieu}
                                    isPassed={new Date(item.event.date) < new Date()}
                                    isComplete={item.places_restantes === 0}
                                    onPress={() => navigation.navigate('TicketDetails', { reservation: item })}
                                    isTicket={true}
                                />
                            )}
                        />
                    ) : (
                        <Text style={styles.noReservation}>Vous n'avez aucune réservation pour le moment.</Text>
                    )}
                </View>

                {/* Confirmation de déconnexion */}
                <ConfirmationMessage
                    visible={showConfirmLogout}
                    title="Déconnexion"
                    message="Êtes-vous sûr de vouloir vous déconnecter ?"
                    onConfirm={handleSignOut}
                    onCancel={() => setShowConfirmLogout(false)}
                    confirmText="Déconnexion"
                    cancelText="Annuler"
                />
            </SafeAreaView>
        </GradientBackground>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' , backgroundColor: Colors.background },
    header: { alignItems: 'center', paddingTop: 50, paddingBottom: 20 },
    profilePictureContainer: {
        backgroundColor: Colors.card,
        width: 160,
        height: 160,
        borderRadius: 90,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    name: { fontSize: 22, fontWeight: 'bold', color: Colors.text, marginTop: 10 },
    email: { marginTop: 5, fontSize: 16, color: Colors.textSecondary },
    settingsButton: { position: 'absolute', top: 20, right: 20 },
    reservationSection: { flex: 1, marginTop: 10 },
    sectionTitle: { fontSize: 18, fontWeight: '600', paddingHorizontal: 20, marginBottom: 10, color: Colors.text },
    noReservation: { fontSize: 16, color: Colors.textSecondary, textAlign: 'center', marginTop: 20 },
    flatList: {
        paddingBottom: 70,
    },
    headerButtons: {
        flexDirection: 'row',
        position: 'absolute',
        top: 20,
        right: 20,
    },
    iconButton: {
        marginLeft: 10,
    },
});
