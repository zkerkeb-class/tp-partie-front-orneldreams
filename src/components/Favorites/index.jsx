import { useState, useEffect } from "react";
import PokeCard from "../pokeCard";
import { getFavorites } from "../../utils/favorites";
import { getPokemons, searchPokemon } from "../../utils/api";
import "./favorites.css";

const Favorites = ({ onSelectPokemon, onBack }) => {
    const [favoritePokemons, setFavoritePokemons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalFavorites, setTotalFavorites] = useState(0);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    useEffect(() => {
        fetchFavorites();
        
        // Écouter les changements de storage
        const handleStorageChange = () => {
            setRefreshTrigger(prev => prev + 1);
        };
        
        window.addEventListener('storage', handleStorageChange);
        
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [refreshTrigger]);

    const fetchFavorites = async () => {
        try {
            setLoading(true);
            const favoriteIds = getFavorites();
            setTotalFavorites(favoriteIds.length);

            if (favoriteIds.length === 0) {
                setFavoritePokemons([]);
                setLoading(false);
                return;
            }

            // Récupérer TOUS les pokémons (151 au total)
            const allPokemons = [];
            let currentPage = 1;
            let hasMore = true;

            while (hasMore && currentPage <= 10) { // Max 10 pages pour sécurité
                const data = await getPokemons(currentPage, 50);
                allPokemons.push(...data.data);
                hasMore = currentPage < data.pagination.totalPages;
                currentPage++;
            }

            // Filtrer par les IDs favoris
            const favorites = allPokemons.filter(pokemon => 
                favoriteIds.includes(pokemon.id)
            );

            console.log('Favoris IDs:', favoriteIds);
            console.log('Pokémons trouvés:', favorites);

            setFavoritePokemons(favorites);
            setLoading(false);
        } catch (error) {
            console.error("Erreur lors de la récupération des favoris:", error);
            setLoading(false);
        }
    };

    const handleRefresh = () => {
        fetchFavorites();
    };

    const handleFavoriteRemoved = (pokemonId) => {
        setFavoritePokemons(prev => prev.filter(p => p.id !== pokemonId));
        setTotalFavorites(prev => Math.max(prev - 1, 0));
    };

    if (loading) {
        return <p className="loading">Chargement des favoris...</p>;
    }

    return (
        <div className="favorites-container">
            <div className="favorites-header">
                <div className="favorites-title-section">
                    <button className="btn-back-favorites" onClick={onBack}>
                        ← Retour
                    </button>
                    <h2>❤️ Mes Pokémons Favoris</h2>
                    <span className="favorites-count">{totalFavorites}</span>
                </div>
                <button className="btn-refresh-favorites" onClick={handleRefresh} title="Rafraîchir">
                    🔄
                </button>
            </div>

            {favoritePokemons.length === 0 ? (
                <div className="favorites-empty">
                    <div className="empty-icon">💔</div>
                    <p>Aucun pokémon en favoris pour le moment!</p>
                    <p className="empty-hint">Clique sur le ❤️ pour ajouter des pokémons à tes favoris</p>
                </div>
            ) : (
                <>
                    <div className="favorites-stats">
                        <span>Affichage de {favoritePokemons.length} pokémons favoris</span>
                    </div>
                    
                    <div className="favorites-grid">
                        {favoritePokemons.map((pokemon) => (
                            <div
                                key={pokemon._id}
                                onClick={() => onSelectPokemon(pokemon)}
                                className="favorites-card-wrapper"
                            >
                                <PokeCard
                                    pokemon={pokemon}
                                    onFavoriteRemoved={handleFavoriteRemoved}
                                />
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default Favorites;
