import React, { useState } from 'react';
import {
    Modal,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    FlatList,
} from 'react-native';
import Colors from '@/constants/Colors';

interface FilterModalProps {
    visible: boolean;
    onClose: () => void;
    onApply: (filters: any) => void;
    initialFilters: any;
}

const FILTER_OPTIONS = [
    { label: 'Date', key: 'date' },
    { label: 'Places restantes', key: 'places_restantes' },
    { label: 'Capacité', key: 'capacite' },
    { label: 'Lieu', key: 'lieu' },
];

export default function FilterModal({ visible, onClose, onApply, initialFilters }: FilterModalProps) {
    const [selectedFilters, setSelectedFilters] = useState<any>(initialFilters || {});

    const toggleFilter = (key: string) => {
        setSelectedFilters((prev: { [key: string]: any }) => ({
            ...prev,
            [key]: prev[key] === 'asc' ? 'desc' : 'asc',
        }));
    };

    const applyFilters = () => {
        onApply(selectedFilters);
        onClose();
    };

    const resetFilters = () => {
        setSelectedFilters({}); // Réinitialise tous les filtres
    };

    return (
        <Modal visible={visible} animationType="slide" transparent={true}>
            <SafeAreaView style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Filtres</Text>
                    <FlatList
                        data={FILTER_OPTIONS}
                        keyExtractor={(item) => item.key}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={[
                                    styles.filterOption,
                                    selectedFilters[item.key] && styles.filterOptionSelected,
                                ]}
                                onPress={() => toggleFilter(item.key)}
                            >
                                <Text
                                    style={[
                                        styles.filterText,
                                        selectedFilters[item.key] && styles.filterTextSelected,
                                    ]}
                                >
                                    {item.label} ({selectedFilters[item.key] === 'asc' ? '↑' : '↓'})
                                </Text>
                            </TouchableOpacity>
                        )}
                    />
                    {/* Boutons d'action */}
                    <View style={styles.actions}>
                        <TouchableOpacity onPress={resetFilters} style={styles.resetButton}>
                            <Text style={styles.resetText}>Réinitialiser</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
                            <Text style={styles.cancelText}>Annuler</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={applyFilters} style={styles.applyButton}>
                            <Text style={styles.applyText}>Appliquer</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '90%',
        backgroundColor: Colors.background,
        borderRadius: 12,
        padding: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: 10,
    },
    filterOption: {
        padding: 10,
        borderRadius: 8,
        marginVertical: 5,
        backgroundColor: Colors.card,
    },
    filterOptionSelected: {
        backgroundColor: Colors.secondary,
    },
    filterText: {
        fontSize: 16,
        color: Colors.text,
    },
    filterTextSelected: {
        color: '#fff',
        fontWeight: 'bold',
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
    },
    resetButton: {
        padding: 10,
    },
    resetText: {
        color: Colors.secondary,
        fontSize: 16,
        fontWeight: 'bold',
    },
    cancelButton: {
        padding: 10,
    },
    cancelText: {
        color: Colors.textSecondary,
        fontSize: 16,
    },
    applyButton: {
        backgroundColor: Colors.secondary,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    applyText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
