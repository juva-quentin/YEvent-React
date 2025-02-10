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
    onPress: () => void;
}

export default function EventCard({ image, price, title, date, places, location, onPress }: EventCardProps) {
    return (
        <View style={styles.card}>
            <Image source={{ uri: image }} style={styles.image} />
            <View style={styles.infoContainer}>
                <Text style={styles.price}>{price}</Text>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.date}>
                    {date} <Text style={styles.places}>● {places} places restantes</Text>
                </Text>
                <Text style={styles.location}>{location}</Text>
                <CustomButton title="En savoir plus sur l'évènement" onPress={onPress} />
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
    image: {
        height: 150,
        width: '100%',
    },
    infoContainer: {
        padding: 10,
    },
    price: {
        fontSize: 14,
        color: Colors.textSecondary,
        marginBottom: 5,
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
    },
});
