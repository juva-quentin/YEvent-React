import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import Colors from '@/constants/Colors';
// @ts-ignore
import Icon from 'react-native-vector-icons/Ionicons';

interface CustomInputProps {
    placeholder: string;
    value: string;
    onChangeText: (text: string) => void;
    secureTextEntry?: boolean;
    autoCorrect?: boolean;
    autoComplete?: 'off' | 'email' | 'password' | 'name' | 'username'; // Valeurs autorisées
}

export default function CustomInput({
                                        placeholder,
                                        value,
                                        onChangeText,
                                        secureTextEntry = false,
                                        autoCorrect = false,
                                        autoComplete = 'off',
                                    }: CustomInputProps) {
    const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(!secureTextEntry);

    const togglePasswordVisibility = () => {
        setIsPasswordVisible((prev) => !prev);
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder={placeholder}
                placeholderTextColor={Colors.textSecondary}
                value={value}
                onChangeText={onChangeText}
                secureTextEntry={secureTextEntry && !isPasswordVisible}
                autoCorrect={autoCorrect}
                autoComplete={autoComplete} // AutoComplete corrigé
                autoCapitalize={autoComplete === 'email' ? 'none' : 'sentences'} // Pas de majuscule pour email
                keyboardType={autoComplete === 'email' ? 'email-address' : 'default'}
            />
            {secureTextEntry && (
                <TouchableOpacity onPress={togglePasswordVisibility} style={styles.iconContainer}>
                    <Icon
                        name={isPasswordVisible ? 'eye' : 'eye-off'}
                        size={20}
                        color={Colors.textSecondary}
                    />
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        borderWidth: 1.5,
        borderRadius: 8,
        paddingVertical: 5,
        borderColor: Colors.text,
    },
    input: {
        flex: 1,
        marginHorizontal: 10,
        height: 40,
        fontSize: 16,
        color: Colors.text,
    },
    iconContainer: {
        paddingHorizontal: 10,
    },
});
