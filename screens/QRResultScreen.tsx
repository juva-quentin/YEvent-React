import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import GradientBackground from '@/components/GradientBackground';
import Colors from '@/constants/Colors';
import ConfirmationMessage from '@/components/ConfirmationMessage';
import { verifierBillet, validerBillet } from '@/services/billetService';

export default function QRResultScreen({ route, navigation }: { route: any; navigation: any }) {
    const { qrData } = route.params;

    const [qrValid, setQrValid] = useState<boolean | null>(null); // true = valide, false = déjà utilisé/invalide
    const [validationMessage, setValidationMessage] = useState<string>(''); // message si non valide
    const [showConfirmationPopup, setShowConfirmationPopup] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);

    // ⚡ Vérifie si le billet est valide ou non
    useEffect(() => {
        const verifierQR = async () => {
            const result = await verifierBillet(qrData); // Ne valide que si on le veut

            if (!result.success) {
                setQrValid(false);
                setValidationMessage(result.message);
            } else {
                setQrValid(true); // QR valide mais non encore validé (pas encore confirmé)
            }
        };

        verifierQR();
    }, []);

    const handleConfirmValidation = async () => {
        const result = await verifierBillet(qrData);

        if (!result.success || !result.billet) {
            setQrValid(false);
            setValidationMessage(result.message);
            setShowConfirmationPopup(false);
            return;
        }

        const validation = await validerBillet(result.billet.id);

        if (validation.success) {
            setShowSuccessPopup(true);
        } else {
            setQrValid(false);
            setValidationMessage(validation.message);
        }

        setShowConfirmationPopup(false);
    };

    return (
        <GradientBackground startColor={Colors.primary} endColor={Colors.background} locations={[0, 0.4]}>
            <View style={styles.centeredContainer}>
                {/* Bouton retour */}
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.backButtonText}>← Retour</Text>
                </TouchableOpacity>

                {/* Contenu principal */}
                <Text style={styles.title}>Données du QR Code</Text>
                <Text style={styles.qrData}>{qrData}</Text>

                {/* Message ou bouton selon état du QR */}
                {qrValid === false && (
                    <Text style={styles.message}>{validationMessage}</Text>
                )}

                {qrValid === true && (
                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: Colors.secondary }]}
                        onPress={() => setShowConfirmationPopup(true)}
                    >
                        <Text style={styles.buttonText}>Valider ce QR Code</Text>
                    </TouchableOpacity>
                )}

                {/* Bouton retour scanner */}
                <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
                    <Text style={styles.buttonText}>Revenir au Scanner</Text>
                </TouchableOpacity>
            </View>

            {/* Pop-up de confirmation avant validation */}
            <ConfirmationMessage
                visible={showConfirmationPopup}
                title="Confirmer la validation"
                message="Souhaitez-vous valider ce QR Code ? Cette action est irréversible."
                onConfirm={handleConfirmValidation}
                onCancel={() => setShowConfirmationPopup(false)}
                confirmText="Oui, valider"
                cancelText="Annuler"
            />

            {/* Pop-up de validation réussie */}
            <ConfirmationMessage
                visible={showSuccessPopup}
                title="Succès"
                message="✅ QR Code validé avec succès !"
                onConfirm={() => {
                    setShowSuccessPopup(false);
                    navigation.goBack();
                }}
                onCancel={() => setShowSuccessPopup(false)}
                confirmText="OK"
            />
        </GradientBackground>
    );
}

const styles = StyleSheet.create({
    centeredContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: 'white',
        textAlign: 'center',
    },
    qrData: {
        fontSize: 18,
        color: 'white',
        textAlign: 'center',
        marginBottom: 20,
    },
    message: {
        fontSize: 16,
        color: 'white',
        marginBottom: 20,
        textAlign: 'center',
    },
    button: {
        backgroundColor: Colors.primary,
        padding: 10,
        borderRadius: 8,
        marginTop: 10,
        minWidth: '60%',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    backButton: {
        position: 'absolute',
        top: 50,
        left: 20,
        padding: 10,
        borderRadius: 8,
    },
    backButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
