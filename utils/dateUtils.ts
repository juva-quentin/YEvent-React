export const formatDate = (dateString: string): string => {
    if (!dateString) return 'Date invalide'; // Gestion des cas null ou undefined

    const date = new Date(dateString);

    if (isNaN(date.getTime())) return 'Date invalide'; // Gestion des dates invalides

    // Utilise Intl.DateTimeFormat pour formater la date
    const formattedDate = new Intl.DateTimeFormat('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Europe/Paris',
        hour12: false, // Assure un format 24 heures
    }).format(date);

    // Remplace les ":" par "h"
    return formattedDate.replace(/(\d{2}):(\d{2})/, '$1h$2');
};
