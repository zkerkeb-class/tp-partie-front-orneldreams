import { useState, useEffect } from "react";
import PokeCard from "../pokeCard";
import PokeSearch from "../pokeSearch";
import TypeFilter from "../typeFilter";
import { getPokemons } from "../../utils/api";
import "./pokelist.css";

const PokeList = ({ onSelectPokemon, refreshKey }) => {
    const [pokemons, setPokemons] = useState([]);
    const [allPokemons, setAllPokemons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalPokemons, setTotalPokemons] = useState(0);
    const [searchResult, setSearchResult] = useState(null);
    const [isSearchMode, setIsSearchMode] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [itemsPerPage, setItemsPerPage] = useState(20);
    const [selectedTypes, setSelectedTypes] = useState([]);

    useEffect(() => {
        if (searchQuery.trim()) {
            applyLiveSearch();
            return;
        }

        if (!isSearchMode) {
            fetchPokemons(currentPage);
        }
    }, [currentPage, refreshKey, isSearchMode, itemsPerPage, selectedTypes, searchQuery, allPokemons]);

    useEffect(() => {
        fetchAllPokemons();
    }, [refreshKey]);

    const fetchPokemons = async (page) => {
        try {
            setLoading(true);
            const data = await getPokemons(page, itemsPerPage);
            
            let filteredPokemons = data.data;
            
            if (selectedTypes.length > 0) {
                filteredPokemons = filteredPokemons.filter(pokemon => 
                    pokemon.type && pokemon.type.some(t => 
                        selectedTypes.includes(t.toLowerCase())
                    )
                );
            }
            
            setPokemons(filteredPokemons);
            setTotalPages(data.pagination.totalPages);
            setTotalPokemons(data.pagination.totalPokemons);
            setLoading(false);
        } catch (error) {
            console.error("Erreur lors de la récupération des pokemons:", error);
            setLoading(false);
        }
    };

    const applyLiveSearch = () => {
        const query = searchQuery.trim().toLowerCase();
        if (!query) return;

        let filtered = allPokemons.filter((pokemon) => {
            const nameFr = pokemon.name?.french || '';
            return nameFr.toLowerCase().startsWith(query);
        });

        if (selectedTypes.length > 0) {
            filtered = filtered.filter(pokemon => 
                pokemon.type && pokemon.type.some(t => 
                    selectedTypes.includes(t.toLowerCase())
                )
            );
        }

        const total = filtered.length;
        const pages = Math.max(1, Math.ceil(total / itemsPerPage));
        const safePage = Math.min(currentPage, pages);
        const startIndex = (safePage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;

        setTotalPokemons(total);
        setTotalPages(pages);
        setCurrentPage(safePage);
        setPokemons(filtered.slice(startIndex, endIndex));
    };

    const fetchAllPokemons = async () => {
        try {
            const all = [];
            let page = 1;
            let hasMore = true;

            while (hasMore && page <= 10) {
                const data = await getPokemons(page, 50);
                all.push(...data.data);
                hasMore = page < data.pagination.totalPages;
                page++;
            }

            setAllPokemons(all);
        } catch (error) {
            console.error("Erreur lors de la récupération complète:", error);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleSearchResult = (pokemon) => {
        setSearchResult(pokemon);
        setIsSearchMode(Boolean(pokemon));
    };

    const handleClearSearch = () => {
        setSearchResult(null);
        setIsSearchMode(false);
    };

    const handleSearchQueryChange = (value) => {
        setSearchQuery(value);
        setCurrentPage(1);
        setSearchResult(null);
        setIsSearchMode(false);
    };

    const handleTypeFilterChange = (types) => {
        setSelectedTypes(types);
        setCurrentPage(1);
    };

    if (loading) {
        return <p className="loading">Chargement...</p>;
    }

    return (
        <div className="pokelist-container">
            <h2>Liste des Pokémons</h2>

            <PokeSearch
                allPokemons={allPokemons}
                onSearchResult={handleSearchResult}
                onSearchQueryChange={handleSearchQueryChange}
                onClear={handleClearSearch}
            />

            {!isSearchMode && (
                <TypeFilter 
                    selectedTypes={selectedTypes}
                    onTypeChange={handleTypeFilterChange}
                />
            )}

            <div className="pokelist-grid">
                {(isSearchMode && searchResult ? [searchResult] : pokemons).map((pokemon) => (
                    <div
                        key={pokemon._id}
                        onClick={() => onSelectPokemon(pokemon)}
                        className="pokelist-card-wrapper"
                    >
                        <PokeCard pokemon={pokemon} />
                    </div>
                ))}
            </div>

            {!isSearchMode && (
                <>
                    <button 
                        onClick={handlePreviousPage} 
                        disabled={currentPage === 1}
                        className="nav-arrow nav-arrow-left"
                        aria-label="Page précédente"
                    >
                        ←
                    </button>
                    
                    <button 
                        onClick={handleNextPage} 
                        disabled={currentPage === totalPages}
                        className="nav-arrow nav-arrow-right"
                        aria-label="Page suivante"
                    >
                        →
                    </button>

                    <div className="pagination">
                        <div className="pagination-info">
                            Page {currentPage} / {totalPages} ({totalPokemons} pokémons)
                        </div>
                        
                        <div className="items-per-page">
                            <label>Afficher: </label>
                            <select 
                                value={itemsPerPage} 
                                onChange={(e) => {
                                    setItemsPerPage(Number(e.target.value));
                                    setCurrentPage(1);
                                }}
                                className="page-size-select"
                            >
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={30}>30</option>
                                <option value={50}>50</option>
                            </select>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default PokeList;
