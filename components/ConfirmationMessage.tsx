import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import Colors from '@/constants/Colors';

interface ConfirmationMessageProps {
    visible: boolean;
    title?: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
}

const ConfirmationMessage: React.FC<ConfirmationMessageProps> = ({
                                                                     visible,
                                                                     title = 'Confirmation',
                                                                     message,
                                                                     onConfirm,
                                                                     onCancel,
                                                                     confirmText = 'Confirmer',
                                                                     cancelText = 'Annuler',
                                                                 }) => {
    return (
        <Modal
            visible={visible}
            animationType="fade"
            transparent={true}
            onRequestClose={onCancel}
        >
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.message}>{message}</Text>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
                            <Text style={styles.cancelText}>{cancelText}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
                            <Text style={styles.confirmText}>{confirmText}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    container: {
        width: '80%',
        padding: 20,
        borderRadius: 10,
        backgroundColor: Colors.background,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.text,
        textAlign: 'center',
        marginBottom: 10,
    },
    message: {
        fontSize: 16,
        color: Colors.textSecondary,
        textAlign: 'center',
        marginBottom: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    cancelButton: {
        flex: 1,
        marginRight: 10,
        paddingVertical: 10,
        paddingHorizontal: 5,
        backgroundColor: Colors.card,
        borderRadius: 8,
        alignItems: 'center',
    },
    cancelText: {
        color: Colors.textSecondary,
        fontSize: 16,
        fontWeight: 'bold',
    },
    confirmButton: {
        flex: 1,
        marginLeft: 10,
        paddingVertical: 10,
        backgroundColor: Colors.secondary,
        borderRadius: 8,
        alignItems: 'center',
    },
    confirmText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ConfirmationMessage;
