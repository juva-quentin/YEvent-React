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
import { Event } from '@/models/event';
import { formatDate } from '@/utils/dateUtils';

const ITEMS_PER_PAGE = 10; // Nombre d'événements chargés par page

export default function HomeScreen() {
    const [events, setEvents] = useState<Event[]>([]);
    const [allEvents, setAllEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [loadingMore, setLoadingMore] = useState<boolean>(false);
    const [page, setPage] = useState<number>(0);
    const [hasMore, setHasMore] = useState<boolean>(true);

    const [filtersVisible, setFiltersVisible] = useState<boolean>(false);
    const [appliedFilters, setAppliedFilters] = useState<any>({});

    // Chargement initial des événements
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

    return (
        <GradientBackground startColor={Colors.secondary} endColor={Colors.background} locations={[0, 0.2]}>
            <SafeAreaView style={styles.container}>
                {/* Barre de Recherche */}
                <SearchBar placeholder="Rechercher..." />

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
                                image={'https://via.placeholder.com/400x200'}
                                price={`${item.capacite}€`}
                                title={item.titre}
                                date={formatDate(item.date)}
                                places={item.places_restantes}
                                location={item.lieu}
                                onPress={() => console.log(`Détails de l'événement : ${item.titre}`)}
                            />
                        )}
                        onEndReached={loadMoreEvents}
                        onEndReachedThreshold={0.5}
                        ListFooterComponent={() =>
                            loadingMore ? <ActivityIndicator size="small" color={Colors.secondary} /> : null
                        }
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
});
