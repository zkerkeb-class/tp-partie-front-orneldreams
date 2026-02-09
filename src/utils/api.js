// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// Helper pour les requêtes API
const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Erreur ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Récupérer les pokemons avec pagination
export const getPokemons = (page = 1, limit = 20) => {
  return apiCall(`/pokemons?page=${page}&limit=${limit}`);
};

// Récupérer un pokemon par ID
export const getPokemonById = (id) => {
  return apiCall(`/pokemons/${id}`);
};

// Rechercher un pokemon par nom
export const searchPokemon = (name) => {
  return apiCall(`/pokemons/search/${encodeURIComponent(name)}`);
};

// Créer un nouveau pokemon
export const createPokemon = (pokemonData) => {
  return apiCall('/pokemons', {
    method: 'POST',
    body: JSON.stringify(pokemonData)
  });
};

// Modifier un pokemon
export const updatePokemon = (id, updates) => {
  return apiCall(`/pokemons/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates)
  });
};

// Supprimer un pokemon
export const deletePokemon = (id) => {
  return apiCall(`/pokemons/${id}`, {
    method: 'DELETE'
  });
};
