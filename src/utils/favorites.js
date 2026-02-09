// Utilitaire pour gérer les favoris avec localStorage
const FAVORITES_KEY = 'pokemon_favorites';
const FAVORITES_EVENT = 'favorites-updated';

const notifyFavoritesUpdated = () => {
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent(FAVORITES_EVENT));
    }
};

export const getFavorites = () => {
    try {
        const stored = localStorage.getItem(FAVORITES_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error('Erreur lors de la lecture des favoris:', error);
        return [];
    }
};

export const addFavorite = (pokemonId) => {
    try {
        const favorites = getFavorites();
        if (!favorites.includes(pokemonId)) {
            favorites.push(pokemonId);
            localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
            notifyFavoritesUpdated();
            return true;
        }
        return false;
    } catch (error) {
        console.error('Erreur lors de l\'ajout aux favoris:', error);
        return false;
    }
};

export const removeFavorite = (pokemonId) => {
    try {
        const favorites = getFavorites();
        const filtered = favorites.filter(id => id !== pokemonId);
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(filtered));
        notifyFavoritesUpdated();
        return true;
    } catch (error) {
        console.error('Erreur lors de la suppression des favoris:', error);
        return false;
    }
};

export const toggleFavorite = (pokemonId) => {
    const favorites = getFavorites();
    if (favorites.includes(pokemonId)) {
        removeFavorite(pokemonId);
        return false;
    } else {
        addFavorite(pokemonId);
        return true;
    }
};

export const isFavorite = (pokemonId) => {
    return getFavorites().includes(pokemonId);
};
