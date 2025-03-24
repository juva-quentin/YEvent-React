import React, { useEffect, useState } from "react";
import { View, Text, SafeAreaView, TouchableOpacity, StyleSheet, FlatList, Dimensions, ActivityIndicator, Alert } from "react-native";
import Colors from "@/constants/Colors";
import GradientBackground from "@/components/GradientBackground";
// @ts-ignore
import Icon from "react-native-vector-icons/Ionicons";
import { formatDate } from "@/utils/dateUtils";
import QRCode from "react-native-qrcode-svg";
import { getBilletsByReservationId } from "@/services/billetService";

const { width: screenWidth } = Dimensions.get("window");

export default function TicketDetailsScreen({ route, navigation }: any) {
    const { reservation } = route.params;
    const [billets, setBillets] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchBillets = async () => {
            const { data, error } = await getBilletsByReservationId(reservation.id);
            if (error) {
                Alert.alert("Erreur", "Impossible de charger les billets.");
            } else {
                setBillets(data || []);
            }
            setLoading(false);
        };

        fetchBillets();
    }, [reservation.id]);

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
                {/* AppBar */}
                <View style={styles.appBar}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Icon name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.appBarTitle}>Ma réservation</Text>
                </View>

                {/* Section de la réservation */}
                <View style={styles.reservationInfo}>
                    <Text style={styles.sectionTitle}>Détails de la réservation</Text>
                    <Text style={styles.text}>{`${reservation.event.titre}`}</Text>
                    <Text style={styles.textHighlight}>{`${formatDate(reservation.event.date)}`}</Text>
                    <Text style={styles.text}>{`Nombre de billets : ${reservation.nb_billets}`}</Text>
                    <Text style={styles.textHighlight}>{`Numéro de confirmation : ${reservation.numero_conf}`}</Text>
                </View>

                {/* Liste des billets */}
                <View style={styles.ticketList}>
                    <Text style={styles.billetTitle}>Vos billets</Text>
                    <FlatList
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        data={billets}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item, index }) => (
                            <View style={styles.ticketCard}>
                                <Text style={styles.ticketTitle}>Billet {index + 1}</Text>
                                <Text style={styles.ticketNumber}>{`Numéro : ${item.numero_billet}`}</Text>
                                <View style={styles.qrCodeContainer}>
                                    <QRCode value={item.numero_billet} size={150} />
                                </View>
                            </View>
                        )}
                        snapToInterval={screenWidth * 0.8 + 20} // Taille de la carte + marge
                        decelerationRate="fast"
                        contentContainerStyle={{ paddingHorizontal: (screenWidth - screenWidth * 0.8) / 2 }}
                        pagingEnabled
                    />
                </View>
            </SafeAreaView>
        </GradientBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    appBar: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        height: 60,
        elevation: 5,
    },
    backButton: {
        position: "absolute",
        left: 20,
        zIndex: 1,
    },
    appBarTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#fff",
    },
    reservationInfo: {
        padding: 20,
        backgroundColor: Colors.card,
        borderRadius: 10,
        marginHorizontal: 20,
        marginTop: 20,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 17,
        fontWeight: "bold",
        color: Colors.text,
        marginBottom: 10,
    },
    text: {
        fontSize: 14,
        color: Colors.textSecondary,
        marginBottom: 5,
    },
    textHighlight: {
        fontSize: 14,
        color: Colors.primary,
        marginBottom: 5,
    },
    ticketList: {
        marginTop: 20,
    },
    ticketCard: {
        width: screenWidth * 0.8, // Largeur de la carte (80% de l'écran)
        marginHorizontal: 10,
        padding: 20,
        backgroundColor: Colors.card,
        borderRadius: 10,
        elevation: 3,
        alignItems: "center",
        justifyContent: "center",
    },
    ticketTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: Colors.text,
        marginBottom: 10,
    },
    ticketNumber: {
        fontSize: 16,
        color: Colors.textSecondary,
        marginBottom: 10,
    },
    billetTitle: {
        fontSize: 17,
        fontWeight: "bold",
        color: Colors.text,
        marginBottom: 10,
        marginLeft: 20,
    },
    qrCodeContainer: {
        padding: 20, // Ajout de padding autour du QRCode
        backgroundColor: Colors.text, // Optionnel, pour contraster
        borderRadius: 10,
    },
});
