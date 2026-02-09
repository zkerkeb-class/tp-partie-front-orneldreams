import { useState, useEffect } from "react";
import { getPokemonTypeColors } from "../../utils/typeColors";
import { toggleFavorite, isFavorite } from "../../utils/favorites";
import { updatePokemon, deletePokemon } from "../../utils/api";
import "./pokedetail.css";

const PokeDetail = ({ pokemon, onBack, onPokemonDeleted, onRefresh }) => {
    const [currentPokemon, setCurrentPokemon] = useState(pokemon);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        name: { ...pokemon.name },
        type: [...pokemon.type],
        base: { ...pokemon.base },
        image: pokemon.image
    });
    const [isSaving, setIsSaving] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [isFav, setIsFav] = useState(false);
        const [isPlayingSound, setIsPlayingSound] = useState(false);
    const typeColors = getPokemonTypeColors(currentPokemon.type);

    useEffect(() => {
        setCurrentPokemon(pokemon);
        setEditData({
            name: { ...pokemon.name },
            type: [...pokemon.type],
            base: { ...pokemon.base },
            image: pokemon.image
        });
        setIsFav(isFavorite(pokemon.id));
    }, [pokemon]);
    const playSound = () => {
        if (isPlayingSound) return;
        
        const soundUrl = currentPokemon.sound || `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${currentPokemon.id}.ogg`;
        const audio = new Audio(soundUrl);
        
        setIsPlayingSound(true);
        audio.play().catch(err => {
            console.error('Erreur lecture audio:', err);
            setIsPlayingSound(false);
        });
        
        audio.onended = () => {
            setIsPlayingSound(false);
        };
    };


    const handleFavoriteToggle = () => {
        const newState = toggleFavorite(currentPokemon.id);
        setIsFav(newState);
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

    const handleEditChange = (field, value, nestedField = null) => {
        setError(null);
        
        if (nestedField) {
            setEditData({
                ...editData,
                [field]: {
                    ...editData[field],
                    [nestedField]: value
                }
            });
        } else {
            setEditData({
                ...editData,
                [field]: value
            });
        }
    };

    const handleTypeChange = (index, newType) => {
        const newTypes = [...editData.type];
        newTypes[index] = newType;
        setEditData({ ...editData, type: newTypes });
    };

    const handleSave = async () => {
        try {
            setIsSaving(true);
            setError(null);
            
            const updatedPokemon = await updatePokemon(pokemon.id, editData);
            
            // Mettre à jour l'état local avec les nouvelles données
            setCurrentPokemon(updatedPokemon);

            setSuccess('Pokémon modifié avec succès!');
            setIsEditing(false);
            setTimeout(() => setSuccess(null), 3000);
            onRefresh();
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        try {
            setIsDeleting(true);
            setError(null);

            await deletePokemon(pokemon.id);

            setSuccess('Pokémon supprimé avec succès!');
            setTimeout(() => onPokemonDeleted(), 1500);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsDeleting(false);
            setShowDeleteModal(false);
        }
    };

    return (
        <div className="pokedetail-container">
            <button className="btn-back" onClick={onBack}>← Retour</button>

            {error && <div className="alert alert-error">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <div className="pokedetail-card">
                <div className="pokedetail-image">
                    <img 
                        src={currentPokemon.image} 
                        alt={currentPokemon.name?.english}
                    />
                </div>

                <div className="pokedetail-info" style={{ borderLeftColor: typeColors.primary }}>
                    <div className="detail-header">
                        <h1>{currentPokemon.name?.english}</h1>
                        <div className="action-buttons">
                            <button 
                                className={`sound-btn-detail ${isPlayingSound ? 'playing' : ''}`}
                                onClick={playSound}
                                disabled={isPlayingSound}
                                title="Écouter le cri"
                            >
                                <span className="sound-icon">🔊</span>
                            </button>
                            <button 
                                className={`favorite-btn-detail ${isFav ? 'filled' : ''}`}
                                onClick={handleFavoriteToggle}
                                title={isFav ? "Supprimer des favoris" : "Ajouter aux favoris"}
                            >
                                <span className="heart-icon-detail">❤️</span>
                            </button>
                        </div>
                    </div>
                    
                    <div className="detail-section">
                        <h3>Informations</h3>
                        <p><strong>ID:</strong> {currentPokemon.id}</p>
                        <p><strong>Nom Français:</strong> {currentPokemon.name?.french}</p>
                        <p><strong>Nom Japonais:</strong> {currentPokemon.name?.japanese}</p>
                    </div>

                    <div className="detail-section">
                        <h3>Types</h3>
                        <div className="types-display">
                            {currentPokemon.type.map((t) => (
                                <span 
                                    key={t} 
                                    className="type-badge"
                                    style={{ backgroundColor: getTypeColor(t) }}
                                >
                                    {t}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="detail-section">
                        <h3>Statistiques</h3>
                        <div className="stats-grid">
                            <div className="stat-item">
                                <span className="stat-name">HP</span>
                                <div className="stat-bar">
                                    <div 
                                        className="stat-fill" 
                                        style={{ width: `${(currentPokemon.base.HP / 255) * 100}%` }}
                                    ></div>
                                </div>
                                <span className="stat-value">{currentPokemon.base.HP}</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-name">Attack</span>
                                <div className="stat-bar">
                                    <div 
                                        className="stat-fill" 
                                        style={{ width: `${(currentPokemon.base.Attack / 255) * 100}%` }}
                                    ></div>
                                </div>
                                <span className="stat-value">{currentPokemon.base.Attack}</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-name">Defense</span>
                                <div className="stat-bar">
                                    <div 
                                        className="stat-fill" 
                                        style={{ width: `${(currentPokemon.base.Defense / 255) * 100}%` }}
                                    ></div>
                                </div>
                                <span className="stat-value">{currentPokemon.base.Defense}</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-name">Sp. Attack</span>
                                <div className="stat-bar">
                                    <div 
                                        className="stat-fill" 
                                        style={{ width: `${(currentPokemon.base.SpecialAttack / 255) * 100}%` }}
                                    ></div>
                                </div>
                                <span className="stat-value">{currentPokemon.base.SpecialAttack}</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-name">Sp. Defense</span>
                                <div className="stat-bar">
                                    <div 
                                        className="stat-fill" 
                                        style={{ width: `${(currentPokemon.base.SpecialDefense / 255) * 100}%` }}
                                    ></div>
                                </div>
                                <span className="stat-value">{currentPokemon.base.SpecialDefense}</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-name">Speed</span>
                                <div className="stat-bar">
                                    <div 
                                        className="stat-fill" 
                                        style={{ width: `${(currentPokemon.base.Speed / 255) * 100}%` }}
                                    ></div>
                                </div>
                                <span className="stat-value">{currentPokemon.base.Speed}</span>
                            </div>
                        </div>
                    </div>

                    <div className="detail-actions">
                        <button 
                            className="btn btn-primary"
                            onClick={() => setIsEditing(!isEditing)}
                        >
                            {isEditing ? 'Annuler' : '✏️ Modifier'}
                        </button>
                        <button 
                            className="btn btn-danger"
                            onClick={() => setShowDeleteModal(true)}
                        >
                            🗑️ Supprimer
                        </button>
                    </div>
                </div>
            </div>

            {isEditing && (
                <div className="pokedetail-edit">
                    <h2>Modifier le Pokémon</h2>

                    <div className="edit-section">
                        <label>Nom Anglais</label>
                        <input 
                            type="text"
                            value={editData.name.english}
                            onChange={(e) => handleEditChange('name', e.target.value, 'english')}
                            placeholder="Nom Anglais"
                        />
                    </div>

                    <div className="edit-section">
                        <label>Nom Français</label>
                        <input 
                            type="text"
                            value={editData.name.french}
                            onChange={(e) => handleEditChange('name', e.target.value, 'french')}
                            placeholder="Nom Français"
                        />
                    </div>

                    <div className="edit-section">
                        <label>URL de l'image</label>
                        <input 
                            type="text"
                            value={editData.image}
                            onChange={(e) => handleEditChange('image', e.target.value)}
                            placeholder="URL de l'image"
                        />
                    </div>

                    <div className="edit-section">
                        <label>Types</label>
                        <div className="types-edit">
                            {editData.type.map((type, idx) => (
                                <input 
                                    key={idx}
                                    type="text"
                                    value={type}
                                    onChange={(e) => handleTypeChange(idx, e.target.value)}
                                    placeholder={`Type ${idx + 1}`}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="edit-section">
                        <label>Statistiques</label>
                        <div className="stats-edit">
                            {Object.entries(editData.base).map(([key, value]) => (
                                <div key={key} className="stat-input">
                                    <label>
                                        <span>{key}</span>
                                        <span className="stat-value-display">{value}</span>
                                    </label>
                                    <input 
                                        type="range"
                                        min="1"
                                        max="255"
                                        value={value}
                                        onChange={(e) => handleEditChange('base', Number(e.target.value), key)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="edit-actions">
                        <button 
                            className="btn btn-success"
                            onClick={handleSave}
                            disabled={isSaving}
                        >
                            {isSaving ? 'Sauvegarde...' : '✓ Sauvegarder'}
                        </button>
                        <button 
                            className="btn btn-secondary"
                            onClick={() => setIsEditing(false)}
                            disabled={isSaving}
                        >
                            Annuler
                        </button>
                    </div>
                </div>
            )}

            {showDeleteModal && (
                <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2>Confirmer la suppression</h2>
                        <p>
                            Êtes-vous sûr de vouloir supprimer <strong>{currentPokemon.name?.english}</strong> ? 
                            Cette action est irréversible.
                        </p>
                        <div className="modal-actions">
                            <button 
                                className="btn btn-danger"
                                onClick={handleDelete}
                                disabled={isDeleting}
                            >
                                {isDeleting ? 'Suppression...' : '🗑️ Supprimer'}
                            </button>
                            <button 
                                className="btn btn-secondary"
                                onClick={() => setShowDeleteModal(false)}
                                disabled={isDeleting}
                            >
                                Annuler
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PokeDetail;
