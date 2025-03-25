import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
} from 'react-native';
import CustomInput from '@/components/CustomInput';
import CustomButton from '@/components/CustomButton';
import GradientBackground from '@/components/GradientBackground';
import Colors from '@/constants/Colors';
import { signInWithEmail } from '@/services/authService';

// @ts-ignore
export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        const result = await signInWithEmail(email, password);
        if (result.error) {
            alert('Erreur : ' + result.error.message);
        }
    };

    return (
        <GradientBackground startColor={Colors.secondary} endColor={Colors.background} locations={[0, 0.4]}>
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
                    <Text style={styles.title}>Connexion</Text>
                    <Text style={styles.subtitle}>Entrez votre email pour vous connecter</Text>

                    {/* Champs de saisie */}
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

                    {/* Bouton de connexion */}
                    <CustomButton title="Connexion avec email" onPress={handleLogin} />

                    {/* Lien vers l'inscription */}
                    <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                        <Text style={styles.link}>
                            Pas encore de compte ? <Text style={styles.linkBold}>S’inscrire</Text>
                        </Text>
                    </TouchableOpacity>

                    {/* Terms & Privacy */}
                    <Text style={styles.terms}>
                        En cliquant sur connexion vous acceptez les{' '}
                        <Text style={styles.linkBold}>Terms of Service</Text> &{' '}
                        <Text style={styles.linkBold}>Privacy Policy</Text>
                    </Text>
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
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: 5,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        color: Colors.textSecondary,
        textAlign: 'center',
        marginBottom: 20,
    },
    link: {
        marginTop: 15,
        color: Colors.textSecondary,
        textAlign: 'right',
    },
    linkBold: {
        fontWeight: 'bold',
        color: Colors.secondary,
    },
    terms: {
        marginTop: 30,
        fontSize: 12,
        color: Colors.textSecondary,
        textAlign: 'center',
    },
});
