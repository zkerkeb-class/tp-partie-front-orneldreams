// Mapping des types de pokémon à leurs couleurs et gradients
export const typeColors = {
    normal: { primary: '#A8A878', secondary: '#C6C6A7', gradient: 'linear-gradient(135deg, #A8A878 0%, #C6C6A7 100%)' },
    fire: { primary: '#F08030', secondary: '#FF6347', gradient: 'linear-gradient(135deg, #F08030 0%, #FF6347 100%)' },
    water: { primary: '#6890F0', secondary: '#4A90E2', gradient: 'linear-gradient(135deg, #6890F0 0%, #4A90E2 100%)' },
    grass: { primary: '#78C850', secondary: '#76C96F', gradient: 'linear-gradient(135deg, #78C850 0%, #76C96F 100%)' },
    electric: { primary: '#F8D030', secondary: '#FFD700', gradient: 'linear-gradient(135deg, #F8D030 0%, #FFD700 100%)' },
    ice: { primary: '#98D8D8', secondary: '#7FD8BE', gradient: 'linear-gradient(135deg, #98D8D8 0%, #7FD8BE 100%)' },
    fighting: { primary: '#C03028', secondary: '#D84020', gradient: 'linear-gradient(135deg, #C03028 0%, #D84020 100%)' },
    poison: { primary: '#A040A0', secondary: '#C24FC0', gradient: 'linear-gradient(135deg, #A040A0 0%, #C24FC0 100%)' },
    ground: { primary: '#E0C068', secondary: '#E0C66B', gradient: 'linear-gradient(135deg, #E0C068 0%, #E0C66B 100%)' },
    flying: { primary: '#A890F0', secondary: '#B8A3F8', gradient: 'linear-gradient(135deg, #A890F0 0%, #B8A3F8 100%)' },
    psychic: { primary: '#F85888', secondary: '#F85888', gradient: 'linear-gradient(135deg, #F85888 0%, #FF6B9D 100%)' },
    bug: { primary: '#A8B820', secondary: '#B8CB34', gradient: 'linear-gradient(135deg, #A8B820 0%, #B8CB34 100%)' },
    rock: { primary: '#B8A038', secondary: '#C8B040', gradient: 'linear-gradient(135deg, #B8A038 0%, #C8B040 100%)' },
    ghost: { primary: '#705898', secondary: '#8568B0', gradient: 'linear-gradient(135deg, #705898 0%, #8568B0 100%)' },
    dragon: { primary: '#7038F8', secondary: '#7860F8', gradient: 'linear-gradient(135deg, #7038F8 0%, #7860F8 100%)' },
    dark: { primary: '#705848', secondary: '#7D5F4F', gradient: 'linear-gradient(135deg, #705848 0%, #7D5F4F 100%)' },
    steel: { primary: '#B8B8D0', secondary: '#C0C0D8', gradient: 'linear-gradient(135deg, #B8B8D0 0%, #C0C0D8 100%)' },
    fairy: { primary: '#EE99AC', secondary: '#F8B5D6', gradient: 'linear-gradient(135deg, #EE99AC 0%, #F8B5D6 100%)' }
};

// Fonction pour obtenir la couleur primaire d'un type
export const getPrimaryTypeColor = (type) => {
    return typeColors[type?.toLowerCase()] || typeColors.normal;
};

// Fonction pour obtenir les couleurs d'un pokémon (première couleur si plusieurs types)
export const getPokemonTypeColors = (types) => {
    if (!types || types.length === 0) return typeColors.normal;
    return getPrimaryTypeColor(types[0]);
};

// Fonction pour générer une couleur avec opacité
export const getTypeColorWithOpacity = (type, opacity = 0.2) => {
    const color = getPrimaryTypeColor(type);
    return `rgba(${hexToRgb(color.primary).join(',')}, ${opacity})`;
};

// Helper: convertir hex en RGB
const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
    ] : [168, 168, 120]; // fallback normal
};

// Obtenir tous les types uniques
export const getAllTypes = () => {
    return Object.keys(typeColors);
};
