import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';
import CustomButton from '@/components/CustomButton';

interface EventCardProps {
    image: string;
    price: string;
    title: string;
    date: string;
    places: number;
    location: string;
    isComplete: boolean; // Événement complet
    isPassed: boolean;   // Événement passé
    onPress: () => void;
    isTicket?: boolean;
}

export default function EventCard({
                                      image,
                                      price,
                                      title,
                                      date,
                                      places,
                                      location,
                                      isComplete,
                                      isPassed,
                                      isTicket = false,
                                      onPress
                                  }: EventCardProps) {
    return (
        <View style={[styles.card, isPassed && styles.passedCard]}>
            <View style={styles.imageContainer}>
                <Image source={{ uri: image }} style={styles.image} />
                {/* Prix flottant */}
                <View style={styles.priceTag}>
                    <Text style={styles.price}>{price}</Text>
                </View>
            </View>
            <View style={styles.infoContainer}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.date}>
                    {date}{' '}
                    {isPassed ? (
                        <Text style={styles.passedText}>● Événement passé</Text>
                    ) : isComplete ? (
                        <Text style={styles.completeText}>● Événement complet</Text>
                    ) : isTicket ? (
                        <Text style={styles.places}>● {places} billets réservés</Text>
                    ) : (
                        <Text style={styles.places}>● {places} places restantes</Text>
                    )}
                </Text>
                {/* Afficher le lieu uniquement pour les événements normaux */}
                {!isPassed && <Text style={styles.location}>{location}</Text>}
                {/* Trait de séparation */}
                <View style={styles.separator} />
                {isPassed ? (
                    <Text style={styles.passedMessage}>Cet événement est passé</Text>
                ) : isComplete ? (
                    <Text style={styles.completeMessage}>Événement complet</Text>
                ) : (
                    <CustomButton
                        title={isTicket ? 'Voir ma réservation' : 'En savoir plus sur l\'événement'}
                        onPress={onPress}
                        color={isTicket ? Colors.primary : Colors.secondary}
                    />
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.card,
        borderRadius: 10,
        marginHorizontal: 15,
        marginBottom: 15,
        overflow: 'hidden',
    },
    passedCard: {
        backgroundColor: Colors.card, // Couleur légèrement grisée pour les événements passés
    },
    imageContainer: {
        position: 'relative',
    },
    image: {
        height: 150,
        width: '100%',
    },
    priceTag: {
        position: 'absolute',
        bottom: 10,
        left: 10,
        backgroundColor: Colors.border,
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 15,
    },
    price: {
        fontSize: 12,
        color: Colors.text,
        fontWeight: 'bold',
    },
    infoContainer: {
        padding: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: 5,
    },
    date: {
        fontSize: 14,
        color: Colors.secondary,
        marginBottom: 5,
    },
    places: {
        color: Colors.secondary,
    },
    location: {
        fontSize: 12,
        color: Colors.textSecondary,
        marginBottom: 10,
    },
    separator: {
        height: 1,
        backgroundColor: Colors.variant,
        marginVertical: 5,
    },
    completeText: {
        color: Colors.error, // Rouge pour signaler complet
        fontWeight: 'bold',
    },
    passedText: {
        color: Colors.error, // Orange pour événement passé
        fontWeight: 'bold',
    },
    completeMessage: {
        textAlign: 'center',
        color: Colors.error,
        fontSize: 16,
        fontWeight: 'bold',
    },
    passedMessage: {
        textAlign: 'center',
        color: Colors.error,
        fontSize: 16,
        fontWeight: 'bold',
    },
});
