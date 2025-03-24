import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
// @ts-ignore
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '@/constants/Colors';

interface TabIconProps {
    name: string;
    label: string;
    focused: boolean;
    scale: Animated.Value; // Animation scale
}

const TabIcon = ({ name, label, focused, scale }: TabIconProps) => {
    const animatedStyle = {
        transform: [{ scale }],
    };

    return (
        <Animated.View style={[styles.iconContainer, animatedStyle]}>
            <Icon
                name={name}
                size={focused ? 27 : 24} // Taille de l'icône
                color={focused ? Colors.secondary : Colors.text} // Couleur de l'icône
            />
            <Text style={[styles.label, focused && styles.labelActive]}>{label}</Text>
        </Animated.View>
    );
};

export default function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
    const scaleAnimations = state.routes.map(() => new Animated.Value(1));

    const handlePress = (index: number, route: any, isFocused: boolean) => {
        const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
        });

        if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);

            // Animation de scale
            Animated.sequence([
                Animated.timing(scaleAnimations[index], {
                    toValue: 1.2,
                    duration: 150,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnimations[index], {
                    toValue: 1,
                    duration: 150,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    };

    return (
        <View style={styles.tabBarContainer}>
            <View style={styles.tabBar}>
                {state.routes.map((route, index) => {
                    const { options } = descriptors[route.key];
                    const label = options.tabBarLabel ?? route.name;

                    const isFocused = state.index === index;

                    return (
                        <TouchableOpacity
                            key={route.key}
                            onPress={() => handlePress(index, route, isFocused)}
                            style={styles.tabButton}
                            activeOpacity={0.8}
                        >
                            {route.name === 'Cartes' && (
                                <TabIcon
                                    name="map-outline"
                                    label="Cartes"
                                    focused={isFocused}
                                    scale={scaleAnimations[index]}
                                />
                            )}
                            {route.name === 'Accueil' && (
                                <TabIcon
                                    name="home-outline"
                                    label="Accueil"
                                    focused={isFocused}
                                    scale={scaleAnimations[index]}
                                />
                            )}
                            {route.name === 'Profil' && (
                                <TabIcon
                                    name="person-outline"
                                    label="Profil"
                                    focused={isFocused}
                                    scale={scaleAnimations[index]}
                                />
                            )}
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    tabBarContainer: {
        position: 'absolute',
        bottom: 30, // Hauteur au-dessus du bas de l'écran
        left: 25,
        right: 25,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        borderRadius: 30,
        backgroundColor: 'transparent',
    },
    tabBar: {
        flexDirection: 'row',
        backgroundColor: '#313131',
        borderRadius: 30,
        height: 70,
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    tabButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconContainer: {
        alignItems: 'center',
    },
    label: {
        fontSize: 12,
        color: Colors.text,
        marginTop: 4,
    },
    labelActive: {
        color: Colors.secondary,
        fontWeight: '700',
        fontSize: 14,
    },
});
