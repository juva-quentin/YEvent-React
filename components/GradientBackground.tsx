import React from 'react';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface GradientBackgroundProps {
    children: React.ReactNode;
    startColor: string; // Première couleur du dégradé
    endColor: string;   // Deuxième couleur du dégradé
    locations?: readonly [number, number, ...number[]]; // Emplacements des couleurs
}

export default function GradientBackground({
                                               children,
                                               startColor,
                                               endColor,
    locations = [0, 1],
                                           }: GradientBackgroundProps) {
    return (
        <LinearGradient
            colors={[startColor, endColor]} // Couleurs du dégradé
            locations={locations} // Emplacements des couleurs
            start={{ x: 0, y: 0 }} // Début en haut
            end={{ x: 0, y: 1 }}   // Fin en bas
            style={styles.gradient}
        >
            {children}
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    gradient: {
        flex: 1, // Prend tout l'espace disponible
    },
});
