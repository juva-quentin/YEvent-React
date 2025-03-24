import React, { useEffect, useState } from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    Text,
    SafeAreaView,
    TouchableOpacity,
} from 'react-native';
import GradientBackground from '@/components/GradientBackground';
import SearchBar from '@/components/SearchBar';
import EventCard from '@/components/EventCard';
import FilterModal from '@/components/FilterModal';
import Colors from '@/constants/Colors';
import { fetchEvents } from '@/services/eventService';
import { getCurrentUser } from '@/services/userService';
import { Event } from '@/models/event';
import { formatDate } from '@/utils/dateUtils';

const ITEMS_PER_PAGE = 10;

export default function HomeScreen({ navigation }: any) {
    const [events, setEvents] = useState<Event[]>([]);
    const [allEvents, setAllEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [loadingMore, setLoadingMore] = useState<boolean>(false);
    const [page, setPage] = useState<number>(0);
    const [hasMore, setHasMore] = useState<boolean>(true);

    const [searchQuery, setSearchQuery] = useState<string>('');
    const [filtersVisible, setFiltersVisible] = useState<boolean>(false);
    const [appliedFilters, setAppliedFilters] = useState<any>({});
    const [user, setUser] = useState<{ nom: string } | null>(null);

    // Chargement des événements
    useEffect(() => {
        loadInitialEvents();
    }, [appliedFilters]);

    const loadInitialEvents = async () => {
        setLoading(true);
        const data = await fetchEvents();
        const filteredEvents = applyFilters(data, appliedFilters);
        setAllEvents(filteredEvents);
        setEvents(filteredEvents.slice(0, ITEMS_PER_PAGE));
        setPage(1);
        setHasMore(filteredEvents.length > ITEMS_PER_PAGE);
        setLoading(false);
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        if (query.trim() === '') {
            setEvents(allEvents.slice(0, ITEMS_PER_PAGE)); // Reset si la barre est vide
            setPage(1);
            setHasMore(allEvents.length > ITEMS_PER_PAGE);
        } else {
            const filteredEvents = allEvents.filter((event) =>
                event.titre.toLowerCase().includes(query.toLowerCase()) ||
                event.lieu.toLowerCase().includes(query.toLowerCase())
            );
            setEvents(filteredEvents);
            setHasMore(false); // Pas de pagination pour une recherche filtrée
        }
    };

    // Chargement des événements supplémentaires
    const loadMoreEvents = () => {
        if (loadingMore || !hasMore) return;

        setLoadingMore(true);
        const newEvents = allEvents.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);

        if (newEvents.length > 0) {
            setEvents((prev) => [...prev, ...newEvents]);
            setPage(page + 1);
        } else {
            setHasMore(false);
        }
        setLoadingMore(false);
    };

    // Fonction pour appliquer les filtres avec tri ascendant/descendant
    const applyFilters = (data: Event[], filters: any) => {
        let filteredData = [...data];

        Object.keys(filters).forEach((key) => {
            if (filters[key]) {
                if (key === 'date') {
                    filteredData = filteredData.sort((a, b) =>
                        filters[key] === 'asc' ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date)
                    );
                }
                if (key === 'places_restantes') {
                    filteredData = filteredData.sort((a, b) =>
                        filters[key] === 'asc' ? a.places_restantes - b.places_restantes : b.places_restantes - a.places_restantes
                    );
                }
                if (key === 'capacite') {
                    filteredData = filteredData.sort((a, b) =>
                        filters[key] === 'asc' ? a.capacite - b.capacite : b.capacite - a.capacite
                    );
                }
                if (key === 'lieu') {
                    filteredData = filteredData.sort((a, b) =>
                        filters[key] === 'asc' ? a.lieu.localeCompare(b.lieu) : b.lieu.localeCompare(a.lieu)
                    );
                }
            }
        });

        return filteredData;
    };

    // Récupération des infos utilisateur
    useEffect(() => {
        const fetchUserData = async () => {
            const { data, error } = await getCurrentUser();
            if (data) {
                setUser(data);
            } else {
                console.error('Erreur lors de la récupération de l\'utilisateur connecté :', error);
            }
        };

        fetchUserData();
    }, []);

    return (
        <GradientBackground startColor={Colors.secondary} endColor={Colors.background} locations={[0, 0.2]}>
            <SafeAreaView style={styles.container}>
                {/* Message de salutation */}
                {user && (
                    <View style={styles.welcomeContainer}>
                        <Text style={styles.welcomeText}>Bonjour, {user.nom} 👋</Text>
                    </View>
                )}


                {/* Barre de Recherche */}
                <SearchBar placeholder="Rechercher..." onChangeText={handleSearch} />

                {/* Bouton de filtres avec badge */}
                <TouchableOpacity style={styles.filterButton} onPress={() => setFiltersVisible(true)}>
                    <Text style={styles.filterButtonText}>
                        Filtres {Object.keys(appliedFilters).length > 0 && `(${Object.keys(appliedFilters).length})`}
                    </Text>
                </TouchableOpacity>

                {/* Liste des événements */}
                {loading ? (
                    <ActivityIndicator size="large" color={Colors.secondary} style={styles.loader} />
                ) : (
                    <FlatList
                        data={events}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <EventCard
                                image={'https://placehold.co/400x200.png'}
                                price={item.prix ? `${item.prix}€` : 'Gratuit'}
                                title={item.titre}
                                date={formatDate(item.date)}
                                places={item.places_restantes}
                                location={item.lieu}
                                isPassed={new Date(item.date) < new Date()}
                                isComplete={item.places_restantes === 0}
                                onPress={() => navigation.navigate('EventDetails', { eventId: item.id })}
                            />
                        )}
                        onEndReached={loadMoreEvents}
                        onEndReachedThreshold={0.5}
                        ListFooterComponent={() =>
                            loadingMore ? <ActivityIndicator size="small" color={Colors.secondary} /> : null
                        }
                        ListEmptyComponent={() => (
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>Aucun événement disponible pour le moment.</Text>
                            </View>
                        )}
                        contentContainerStyle={styles.flatList}
                        showsVerticalScrollIndicator={true}
                    />
                )}

                {/* Modal de filtres */}
                <FilterModal
                    visible={filtersVisible}
                    initialFilters={appliedFilters}
                    onClose={() => setFiltersVisible(false)}
                    onApply={(filters) => setAppliedFilters(filters)}
                />
            </SafeAreaView>
        </GradientBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    welcomeContainer: {
        paddingHorizontal: 20,
        marginVertical: 10,
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.text,
    },
    filterButton: {
        backgroundColor: Colors.secondary,
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 10,
        marginHorizontal: 20,
    },
    filterButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    loader: {
        marginTop: 20,
    },
    flatList: {
        paddingBottom: 70,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 20,
    },
    emptyText: {
        fontSize: 16,
        color: Colors.textSecondary,
        textAlign: 'center',
        paddingHorizontal: 20,
    },
});
