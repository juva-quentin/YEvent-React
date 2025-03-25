import React from 'react';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface GradientBackgroundProps {
    children: React.ReactNode;
    startColor: string;
    endColor: string;
    locations?: readonly [number, number, ...number[]];
}

export default function GradientBackground({
                                               children,
                                               startColor,
                                               endColor,
    locations = [0, 1],
                                           }: GradientBackgroundProps) {
    return (
        <LinearGradient
            colors={[startColor, endColor]}
            locations={locations}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.gradient}
        >
            {children}
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    gradient: {
        flex: 1,
    },
});
