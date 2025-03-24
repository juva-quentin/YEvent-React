import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import Colors from '@/constants/Colors';
// @ts-ignore
import Icon from 'react-native-vector-icons/Ionicons';
import { Picker } from '@react-native-picker/picker';

interface SeatSelectorProps {
    onValueChange: (value: number) => void;
    maxSeats: number; // Nombre maximum de places disponibles
}

export default function SeatSelector({ onValueChange, maxSeats }: SeatSelectorProps) {
    const [quantity, setQuantity] = useState<number>(1);
    const [showPicker, setShowPicker] = useState<boolean>(false); // Contrôle pour afficher le picker

    const handleValueChange = (value: string) => {
        const parsedValue = parseInt(value, 10);
        setQuantity(parsedValue);
        onValueChange(parsedValue);
    };

    return (
        <View>
            {/* Affichage principal du sélecteur */}
            <TouchableOpacity style={styles.container} onPress={() => setShowPicker(true)}>
                <View style={styles.innerContainer}>
                    <Text style={styles.quantity}>{quantity}</Text>
                    <Icon name="chevron-down" size={18} color="#9E9E9E" />
                </View>
            </TouchableOpacity>

            {/* Modale pour le Picker */}
            <Modal visible={showPicker} transparent animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.pickerWrapper}>
                        <Text style={styles.pickerTitle}>Sélectionner le nombre de places</Text>
                        <Picker
                            selectedValue={quantity.toString()}
                            onValueChange={(itemValue: string) => handleValueChange(itemValue)}
                            style={styles.picker}
                        >
                            {[...Array(maxSeats)].map((_, i) => (
                                <Picker.Item key={i + 1} label={`${i + 1}`} value={`${i + 1}`} />
                            ))}
                        </Picker>
                        <TouchableOpacity
                            style={styles.doneButton}
                            onPress={() => setShowPicker(false)}
                        >
                            <Text style={styles.doneText}>Valider</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.variant,
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 8,
        width: 80,
        minWidth: 60,
        alignItems: 'center',
        justifyContent: 'center',
    },
    innerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    quantity: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.text,
        marginRight: 5,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    pickerWrapper: {
        backgroundColor: Colors.text,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        paddingTop: 20,
        paddingBottom: 30,
    },
    pickerTitle: {
        textAlign: 'center',
        fontSize: 18,
        fontWeight: '600',
        color: Colors.textSecondary,
    },
    picker: {
        width: '100%',
    },
    doneButton: {
        backgroundColor: Colors.secondary,
        paddingVertical: 10,
        marginHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
    },
    doneText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
