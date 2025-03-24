import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import Colors from '@/constants/Colors';
// @ts-ignore
import Icon from 'react-native-vector-icons/Ionicons';
import GradientBackground from "@/components/GradientBackground";
import { signOut } from '@/services/authService';
import { getCurrentUser } from '@/services/userService';
import ConfirmationMessage from '@/components/ConfirmationMessage';

export default function ProfileScreen({ navigation }: { navigation: any }) {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [showConfirmLogout, setShowConfirmLogout] = useState<boolean>(false);

    // Récupération des informations de l'utilisateur
    useEffect(() => {
        const fetchUserData = async () => {
            const { data, error } = await getCurrentUser();
            if (error) {
                console.error('Erreur lors de la récupération des informations utilisateur :', error.message);
                Alert.alert('Erreur', 'Impossible de récupérer les informations de votre profil.');
            } else {
                setUser(data);
            }
            setLoading(false);
        };

        fetchUserData();
    }, []);

    // Déconnexion
    const handleSignOut = async () => {
        const { error } = await signOut();
        if (error) {
            Alert.alert('Erreur', 'Impossible de se déconnecter. Réessayez.');
        } else {
            navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }], // Redirection vers la page Login
            });
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
            <SafeAreaView>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.profilePictureContainer}>
                        <Icon name="person-outline" size={70} color="#fff" />
                    </View>
                    <Text style={styles.name}>{user?.nom || 'Nom inconnu'}</Text>
                    <Text style={styles.email}>{user?.email || 'Email inconnu'}</Text>
                    <TouchableOpacity
                        style={styles.settingsButton}
                        onPress={() => setShowConfirmLogout(true)} // Affiche le message de confirmation
                    >
                        <Icon name="log-out-outline" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>

            {/* Modal de confirmation */}
            <ConfirmationMessage
                visible={showConfirmLogout}
                title="Déconnexion"
                message="Êtes-vous sûr de vouloir vous déconnecter ?"
                onConfirm={handleSignOut}
                onCancel={() => setShowConfirmLogout(false)}
                confirmText="Déconnexion"
                cancelText="Annuler"
            />
        </GradientBackground>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.background,
    },
    header: {
        alignItems: 'center',
        paddingTop: 50,
        paddingBottom: 20,
    },
    profilePictureContainer: {
        backgroundColor: Colors.card,
        width: 160,
        height: 160,
        borderRadius: 90,
        elevation: 5,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    name: {
        fontSize: 22,
        fontWeight: 'bold',
        color: Colors.text,
        marginTop: 10,
    },
    email: {
        marginTop: 5,
        fontSize: 16,
        color: Colors.textSecondary,
    },
    settingsButton: {
        position: 'absolute',
        top: 20,
        right: 20,
    },
});
