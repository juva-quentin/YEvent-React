import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Alert,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
} from 'react-native';
import CustomInput from '@/components/CustomInput';
import CustomButton from '@/components/CustomButton';
import GradientBackground from '@/components/GradientBackground';
import Colors from '@/constants/Colors';
import { signUpWithEmail } from '@/services/authService';

export default function RegisterScreen({ navigation } : { navigation: any }) {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleRegister = async () => {
        if (password !== confirmPassword) {
            Alert.alert('Erreur', 'Les mots de passe ne correspondent pas.');
            return;
        }

        const result = await signUpWithEmail(email, password, `${firstName} ${lastName}`);
        if (result.error) {
            Alert.alert('Erreur', result.error.message);
        } else {
            Alert.alert('Succès', 'Votre compte a bien été créé !');
            navigation.navigate('Login');
        }
    };

    return (
        <GradientBackground startColor={Colors.primary} endColor={Colors.background} locations={[0, 0.4]}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <KeyboardAvoidingView
                    style={styles.container}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                >
                    {/* Logo */}
                    <Image
                        source={require('@/assets/images/Logo-YEvent.png')}
                        style={{ width: 150, height: 150, alignSelf: 'center' }}
                    />
                    <Text style={styles.logo}>YEvent</Text>
                    <Text style={styles.title}>Créer un compte</Text>
                    <Text style={styles.subtitle}>Entrez vos informations pour vous inscrire</Text>

                    {/* Champs de saisie */}
                    <CustomInput
                        placeholder="Prénom"
                        value={firstName}
                        onChangeText={setFirstName}
                        autoComplete={'off'}
                        autoCorrect={false}
                    />
                    <CustomInput
                        placeholder="Nom"
                        value={lastName}
                        onChangeText={setLastName}
                        autoCorrect={false}
                        autoComplete={'off'}
                    />
                    <CustomInput
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        autoComplete="email"
                        autoCorrect={false}
                    />
                    <CustomInput
                        placeholder="Mot de passe"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={true}
                        autoComplete="password"
                        autoCorrect={false}
                    />
                    <CustomInput
                        placeholder="Confirmer le mot de passe"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry={true}
                        autoComplete="password"
                        autoCorrect={false}
                    />

                    {/* Bouton d'inscription */}
                    <CustomButton title="S'inscrire" onPress={handleRegister} color={Colors.primary} />

                    {/* Lien vers la connexion */}
                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                        <Text style={styles.link}>
                            Déjà un compte ? <Text style={styles.linkBold}>Se connecter</Text>
                        </Text>
                    </TouchableOpacity>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </GradientBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    logo: {
        fontSize: 32,
        fontWeight: 'bold',
        color: Colors.text,
        textAlign: 'center',
        marginBottom: 40,
    },
    subtitle: {
        fontSize: 14,
        color: Colors.textSecondary,
        textAlign: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: 10,
        textAlign: 'center',
    },
    link: {
        marginTop: 15,
        color: Colors.textSecondary,
        textAlign: 'right',
    },
    linkBold: {
        fontWeight: 'bold',
        color: Colors.primary,
    },
});
