import * as Location from 'expo-location';

// Fonction pour récupérer la localisation actuelle
export const getCurrentLocation = async () => {
    try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            throw new Error('Permission de localisation refusée');
        }
        const location = await Location.getCurrentPositionAsync({});
        return {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
        };
    } catch (error) {
        console.error('Erreur de localisation :', error);
        throw error;
    }
};

// Fonction pour démarrer la mise à jour continue de la localisation
export const startLocationUpdates = async (
    callback: (location: { latitude: number; longitude: number }) => void
) => {
    try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            throw new Error('Permission de localisation refusée');
        }
        await Location.watchPositionAsync(
            {
                accuracy: Location.Accuracy.High,
                timeInterval: 5000, // Mise à jour toutes les 5 secondes
                distanceInterval: 10, // Ou lorsque l'utilisateur se déplace de 10m
            },
            (location) => {
                callback({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                });
            }
        );
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la localisation :', error);
    }
};
