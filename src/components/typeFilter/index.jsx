import { getAllTypes, getPrimaryTypeColor } from '../../utils/typeColors';
import './typefilter.css';

const TypeFilter = ({ selectedTypes, onTypeChange }) => {
    const types = getAllTypes();

    const handleTypeClick = (type) => {
        if (selectedTypes.includes(type)) {
            onTypeChange(selectedTypes.filter(t => t !== type));
        } else {
            onTypeChange([...selectedTypes, type]);
        }
    };

    const handleClearAll = () => {
        onTypeChange([]);
    };

    return (
        <div className="type-filter-container">
            <div className="type-filter-header">
                <h3>Filtrer par type</h3>
                {selectedTypes.length > 0 && (
                    <button className="clear-filters-btn" onClick={handleClearAll}>
                        Réinitialiser
                    </button>
                )}
            </div>
            
            <div className="type-filter-grid">
                {types.map(type => {
                    const colors = getPrimaryTypeColor(type);
                    const isSelected = selectedTypes.includes(type);
                    
                    return (
                        <button
                            key={type}
                            className={`type-filter-btn ${isSelected ? 'selected' : ''}`}
                            style={{
                                backgroundColor: isSelected ? colors.primary : 'rgba(0, 0, 0, 0.05)',
                                borderColor: colors.primary,
                                color: isSelected ? 'white' : '#2d3436'
                            }}
                            onClick={() => handleTypeClick(type)}
                            title={`Filtrer par ${type}`}
                        >
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                        </button>
                    );
                })}
            </div>

            {selectedTypes.length > 0 && (
                <div className="selected-types-display">
                    <span className="selected-label">Filtres actifs:</span>
                    <div className="selected-types-list">
                        {selectedTypes.map(type => (
                            <span 
                                key={type} 
                                className="selected-type-tag"
                                style={{ backgroundColor: getPrimaryTypeColor(type).primary }}
                            >
                                {type}
                                <button 
                                    className="remove-type-btn"
                                    onClick={() => handleTypeClick(type)}
                                >
                                    ✕
                                </button>
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TypeFilter;
