import { useState, useEffect, useRef } from "react";
import { getPokemonTypeColors } from "../../utils/typeColors";
import { toggleFavorite, isFavorite } from "../../utils/favorites";
import "./pokecard.css";

const PokeCard = ({ pokemon, onFavoriteRemoved }) => {
    const [imageError, setImageError] = useState(false);
    const [isFav, setIsFav] = useState(false);
    const [isPlayingSound, setIsPlayingSound] = useState(false);
    const hoverTimerRef = useRef(null);
    const audioRef = useRef(null);

    useEffect(() => {
        setIsFav(isFavorite(pokemon.id));
    }, [pokemon.id]);

    const typeColors = getPokemonTypeColors(pokemon.type);

    const handleFavoriteToggle = (e) => {
        e.stopPropagation();
        const newState = toggleFavorite(pokemon.id);
        setIsFav(newState);
        if (!newState && onFavoriteRemoved) {
            onFavoriteRemoved(pokemon.id);
        }
    };

    const playSound = (e) => {
        if (e) e.stopPropagation();
        if (isPlayingSound) return;

        const soundUrl = pokemon.sound || `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${pokemon.id}.ogg`;
        const audio = new Audio(soundUrl);
        audioRef.current = audio;

        setIsPlayingSound(true);
        audio.play().catch(err => {
            console.error('Erreur lecture audio:', err);
            setIsPlayingSound(false);
        });

        audio.onended = () => {
            setIsPlayingSound(false);
        };
    };

    const handleMouseEnter = () => {
        if (isPlayingSound) return;
        if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
        hoverTimerRef.current = setTimeout(() => {
            playSound();
        }, 300);
    };

    const handleMouseLeave = () => {
        if (hoverTimerRef.current) {
            clearTimeout(hoverTimerRef.current);
            hoverTimerRef.current = null;
        }
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            audioRef.current = null;
            setIsPlayingSound(false);
        }
    };

    const getTypeColor = (type) => {
        const typeColorsMap = {
            'fire': '#F08030',
            'water': '#6890F0',
            'grass': '#78C850',
            'electric': '#F8D030',
            'ice': '#98D8D8',
            'fighting': '#C03028',
            'poison': '#A040A0',
            'ground': '#E0C068',
            'flying': '#A890F0',
            'psychic': '#F85888',
            'bug': '#A8B820',
            'rock': '#B8A038',
            'ghost': '#705898',
            'dragon': '#7038F8',
            'dark': '#705848',
            'steel': '#B8B8D0',
            'fairy': '#EE99AC',
            'normal': '#A8A878'
        };
        return typeColorsMap[type?.toLowerCase()] || '#999999';
    };

    return (
        <div 
            className="pokecard" 
            style={{ borderTopColor: typeColors.primary, borderTopWidth: '4px' }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className="sound-btn-card" onClick={playSound} title="Écouter le cri">
                <span className={`sound-icon-card ${isPlayingSound ? 'playing' : ''}`}>🔊</span>
            </div>
            <div className="favorite-btn" onClick={handleFavoriteToggle} title={isFav ? "Supprimer des favoris" : "Ajouter aux favoris"}>
                <span className={`heart-icon ${isFav ? 'filled' : ''}`}>❤️</span>
            </div>

            <div className="pokecard-image" style={{ background: typeColors.gradient }}>
                {!imageError && pokemon.image ? (
                    <img 
                        src={pokemon.image} 
                        alt={pokemon.name?.english || 'Pokemon'}
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <div className="pokecard-image-placeholder">
                        No Image
                    </div>
                )}
            </div>

            <div className="pokecard-content">
                <h3 className="pokecard-name">
                    {pokemon.name?.english || pokemon.name || 'Unknown'}
                </h3>

                <div className="pokecard-types">
                    {pokemon.type && pokemon.type.map((t) => (
                        <span 
                            key={t} 
                            className="pokecard-type"
                            style={{ backgroundColor: getTypeColor(t) }}
                        >
                            {t}
                        </span>
                    ))}
                </div>

                <div className="pokecard-stats">
                    <div className="stat">
                        <span className="stat-label">HP:</span>
                        <span className="stat-value">{pokemon.base?.HP || 0}</span>
                    </div>
                    <div className="stat">
                        <span className="stat-label">ATK:</span>
                        <span className="stat-value">{pokemon.base?.Attack || 0}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PokeCard;