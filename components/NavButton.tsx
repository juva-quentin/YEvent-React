import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';

interface NavButtonProps {
    name: string;
    label: string;
    isActive?: boolean;
    onPress: () => void;
}

export default function NavButton({ name, label, isActive, onPress }: NavButtonProps) {
    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <Text style={[styles.label, isActive && { color: Colors.secondary }]}>{label}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    label: {
        fontSize: 12,
        color: Colors.textSecondary,
    },
});
