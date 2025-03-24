import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';

interface CustomButtonProps {
    title: string;
    onPress: () => void;
    color?: string; // Nouvelle prop pour la couleur (facultative)
}

export default function CustomButton({
                                         title,
                                         onPress,
                                         color = Colors.secondary, // Valeur par défaut : Colors.secondary
                                     }: CustomButtonProps) {
    return (
        <TouchableOpacity style={[styles.button, { backgroundColor: color }]} onPress={onPress}>
            <Text style={styles.buttonText}>{title}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        marginTop: 10,
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: Colors.text,
        fontWeight: '600',
        fontSize: 15,
    },
});
