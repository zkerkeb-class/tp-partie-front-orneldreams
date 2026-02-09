import { useState } from "react";
import { createPokemon } from "../../utils/api";
import "./createpokemon.css";

const CreatePokemon = ({ onPokemonCreated, onCancel }) => {
    const [formData, setFormData] = useState({
        id: '',
        name: {
            english: '',
            french: '',
            japanese: '',
            chinese: ''
        },
        type: ['', ''],
        base: {
            HP: 45,
            Attack: 49,
            Defense: 49,
            SpecialAttack: 65,
            SpecialDefense: 65,
            Speed: 45
        },
        image: ''
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleInputChange = (field, value, nestedField = null) => {
        setError(null);

        if (nestedField) {
            setFormData({
                ...formData,
                [field]: {
                    ...formData[field],
                    [nestedField]: value
                }
            });
        } else if (field === 'type') {
            setFormData({
                ...formData,
                type: value
            });
        } else {
            setFormData({
                ...formData,
                [field]: value
            });
        }
    };

    const handleTypeChange = (index, value) => {
        const newTypes = [...formData.type];
        newTypes[index] = value;
        setFormData({ ...formData, type: newTypes });
    };

    const handleStatChange = (stat, value) => {
        setFormData({
            ...formData,
            base: {
                ...formData.base,
                [stat]: Number(value)
            }
        });
    };

    const validateForm = () => {
        if (!formData.id || formData.id <= 0) {
            setError('L\'ID doit être un nombre positif');
            return false;
        }

        if (!formData.name.english || !formData.name.english.trim()) {
            setError('Le nom anglais est obligatoire');
            return false;
        }

        if (formData.name.english.length > 50) {
            setError('Le nom anglais ne peut pas dépasser 50 caractères');
            return false;
        }

        if (!formData.type[0] || !formData.type[0].trim()) {
            setError('Au moins un type est obligatoire');
            return false;
        }

        if (formData.type[0].length > 20) {
            setError('Le type ne peut pas dépasser 20 caractères');
            return false;
        }

        if (!formData.image || !formData.image.trim()) {
            setError('L\'URL de l\'image est obligatoire');
            return false;
        }

        try {
            new URL(formData.image);
        } catch (e) {
            setError('L\'URL de l\'image n\'est pas valide');
            return false;
        }

        // Vérifier que les stats sont dans les bonnes limites
        for (const [key, value] of Object.entries(formData.base)) {
            if (value < 1 || value > 255) {
                setError(`${key} doit être entre 1 et 255`);
                return false;
            }
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            setIsLoading(true);
            
            // Filter out empty types
            const filteredTypes = formData.type.filter(t => t.trim() !== '');
            const submitData = {
                ...formData,
                id: Number(formData.id),
                type: filteredTypes,
                name: {
                    english: formData.name.english || '',
                    french: formData.name.french || '',
                    japanese: formData.name.japanese || '',
                    chinese: formData.name.chinese || ''
                }
            };

            await createPokemon(submitData);

            setSuccess('Pokémon créé avec succès!');
            setTimeout(() => {
                onPokemonCreated();
            }, 1500);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        onCancel();
    };

    return (
        <div className="create-pokemon-container">
            <button className="btn-back" onClick={handleCancel}>← Retour</button>

            <div className="create-pokemon-card">
                <h1>Créer un nouveau Pokémon</h1>

                {error && <div className="alert alert-error">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}

                <form onSubmit={handleSubmit} className="create-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label>ID *</label>
                            <input
                                type="number"
                                required
                                value={formData.id}
                                onChange={(e) => handleInputChange('id', e.target.value)}
                                placeholder="ex: 999"
                            />
                        </div>
                    </div>

                    <h3>Noms</h3>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Nom Anglais *</label>
                            <input
                                type="text"
                                required
                                value={formData.name.english}
                                onChange={(e) => handleInputChange('name', e.target.value, 'english')}
                                placeholder="ex: Pikachu"
                            />
                        </div>
                        <div className="form-group">
                            <label>Nom Français</label>
                            <input
                                type="text"
                                value={formData.name.french}
                                onChange={(e) => handleInputChange('name', e.target.value, 'french')}
                                placeholder="ex: Pikachu"
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Nom Japonais</label>
                            <input
                                type="text"
                                value={formData.name.japanese}
                                onChange={(e) => handleInputChange('name', e.target.value, 'japanese')}
                                placeholder="ex: ピカチュウ"
                            />
                        </div>
                        <div className="form-group">
                            <label>Nom Chinois</label>
                            <input
                                type="text"
                                value={formData.name.chinese}
                                onChange={(e) => handleInputChange('name', e.target.value, 'chinese')}
                                placeholder="ex: 皮卡丘"
                            />
                        </div>
                    </div>

                    <h3>Types</h3>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Type 1 *</label>
                            <input
                                type="text"
                                required
                                value={formData.type[0]}
                                onChange={(e) => handleTypeChange(0, e.target.value)}
                                placeholder="ex: Electric"
                            />
                        </div>
                        <div className="form-group">
                            <label>Type 2 (optionnel)</label>
                            <input
                                type="text"
                                value={formData.type[1]}
                                onChange={(e) => handleTypeChange(1, e.target.value)}
                                placeholder="ex: Fire"
                            />
                        </div>
                    </div>

                    <h3>Image</h3>
                    <div className="form-row">
                        <div className="form-group">
                            <label>URL de l'image *</label>
                            <input
                                type="url"
                                required
                                value={formData.image}
                                onChange={(e) => handleInputChange('image', e.target.value)}
                                placeholder="https://..."
                            />
                        </div>
                    </div>

                    {formData.image && (
                        <div className="image-preview">
                            <img src={formData.image} alt="Preview" onError={(e) => {
                                e.target.style.display = 'none';
                            }} />
                        </div>
                    )}

                    <h3>Statistiques</h3>
                    <div className="stats-grid-form">
                        {Object.entries(formData.base).map(([stat, value]) => (
                            <div key={stat} className="stat-slider-group">
                                <div className="stat-header">
                                    <label>{stat}</label>
                                    <span className="stat-value">{value}</span>
                                </div>
                                <input
                                    type="range"
                                    min="1"
                                    max="255"
                                    value={value}
                                    onChange={(e) => handleStatChange(stat, e.target.value)}
                                    className="stat-slider"
                                />
                                <div className="stat-bar">
                                    <div 
                                        className="stat-bar-fill" 
                                        style={{ 
                                            width: `${(value / 255) * 100}%`,
                                            backgroundColor: value < 50 ? '#ff6b6b' : value < 100 ? '#ffd93d' : '#6bcf7f'
                                        }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="form-actions">
                        <button 
                            type="submit" 
                            className="btn btn-success"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Création...' : '✓ Créer le Pokémon'}
                        </button>
                        <button 
                            type="button" 
                            className="btn btn-secondary"
                            onClick={handleCancel}
                            disabled={isLoading}
                        >
                            Annuler
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreatePokemon;
