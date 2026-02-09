import { useState, useMemo } from "react";
import { searchPokemon } from "../../utils/api";
import "./pokesearch.css";

const PokeSearch = ({ allPokemons, onSearchResult, onSearchQueryChange, onClear }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [searchPerformed, setSearchPerformed] = useState(false);
    const [error, setError] = useState(null);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const suggestions = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        if (!query || !allPokemons?.length) return [];

        return allPokemons
            .filter((pokemon) => {
                const nameFr = pokemon.name?.french || '';
                return nameFr.toLowerCase().startsWith(query);
            })
            .slice(0, 8);
    }, [allPokemons, searchQuery]);

    const handleSearch = async (e) => {
        e.preventDefault();
        
        const query = searchQuery.trim();
        if (!query) {
            setError('Veuillez entrer un nom de pokémon');
            return;
        }

        if (query.length > 50) {
            setError('La recherche ne peut pas dépasser 50 caractères');
            return;
        }

        try {
            setIsLoading(true);
            setError(null);
            setSearchPerformed(true);

            const pokemon = await searchPokemon(query);
            onSearchResult(pokemon);
        } catch (err) {
            setError(err.message);
            onSearchResult(null);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelectSuggestion = (pokemon) => {
        const nameFr = pokemon.name?.french || pokemon.name?.english || '';
        setSearchQuery(nameFr);
        onSearchQueryChange(nameFr);
        setSearchPerformed(true);
        setError(null);
        setShowSuggestions(false);
        onSearchResult(pokemon);
    };

    const handleClear = () => {
        setSearchQuery('');
        setSearchPerformed(false);
        setError(null);
        setShowSuggestions(false);
        onSearchQueryChange('');
        onClear();
    };

    return (
        <div className="pokesearch-container">
            <form className="pokesearch-form" onSubmit={handleSearch}>
                <div className="search-input-group">
                    <input
                        type="text"
                        placeholder="Rechercher un pokémon (FR)..."
                        value={searchQuery}
                        onChange={(e) => {
                            const next = e.target.value;
                            setSearchQuery(next);
                            onSearchQueryChange(next);
                        }}
                        onFocus={() => setShowSuggestions(true)}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                        disabled={isLoading}
                        className="search-input"
                    />
                    <button 
                        type="submit"
                        disabled={isLoading}
                        className="search-btn"
                    >
                        {isLoading ? '🔍 Recherche...' : '🔍 Rechercher'}
                    </button>
                </div>
                {searchPerformed && (
                    <button 
                        type="button"
                        onClick={handleClear}
                        className="clear-btn"
                    >
                        ✕ Effacer
                    </button>
                )}
            </form>
            {showSuggestions && suggestions.length > 0 && (
                <div className="search-suggestions">
                    {suggestions.map((pokemon) => (
                        <button
                            key={pokemon._id}
                            type="button"
                            className="suggestion-item"
                            onClick={() => handleSelectSuggestion(pokemon)}
                        >
                            <span className="suggestion-name">{pokemon.name?.french}</span>
                            <span className="suggestion-id">#{pokemon.id}</span>
                        </button>
                    ))}
                </div>
            )}
            {error && <div className="search-error">{error}</div>}
        </div>
    );
};

export default PokeSearch;
