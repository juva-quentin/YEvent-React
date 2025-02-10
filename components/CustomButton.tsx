import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';

interface CustomButtonProps {
    title: string;
    onPress: () => void;
}

export default function CustomButton({ title, onPress }: CustomButtonProps) {
    return (
        <TouchableOpacity style={styles.button} onPress={onPress}>
            <Text style={styles.buttonText}>{title}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: Colors.secondary,
        marginTop: 10,
        borderRadius: 5,
        paddingVertical: 8,
        paddingHorizontal: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: Colors.text,
        fontWeight: '600',
        fontSize: 14,
    },
});
