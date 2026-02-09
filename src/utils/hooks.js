import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from './api';

// Hook pour récupérer tous les pokemons avec pagination
export const usePokemons = (page = 1, limit = 20) => {
  return useQuery({
    queryKey: ['pokemons', page, limit],
    queryFn: () => api.getPokemons(page, limit),
    keepPreviousData: true,
  });
};

// Hook pour récupérer un pokemon par ID
export const usePokemon = (id) => {
  return useQuery({
    queryKey: ['pokemon', id],
    queryFn: () => api.getPokemonById(id),
    enabled: !!id,
  });
};

// Hook pour rechercher un pokemon par nom
export const useSearchPokemon = (name) => {
  return useQuery({
    queryKey: ['pokemon', 'search', name],
    queryFn: () => api.searchPokemon(name),
    enabled: !!name && name.length > 0,
  });
};

// Hook pour créer un pokemon
export const useCreatePokemon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.createPokemon,
    onSuccess: () => {
      // Invalider les queries pour rafraîchir les listes
      queryClient.invalidateQueries({ queryKey: ['pokemons'] });
    },
  });
};

// Hook pour mettre à jour un pokemon
export const useUpdatePokemon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => api.updatePokemon(id, data),
    onSuccess: (_, variables) => {
      // Invalider le pokemon spécifique et la liste
      queryClient.invalidateQueries({ queryKey: ['pokemon', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['pokemons'] });
    },
  });
};

// Hook pour supprimer un pokemon
export const useDeletePokemon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.deletePokemon,
    onSuccess: () => {
      // Invalider toutes les queries pokemons
      queryClient.invalidateQueries({ queryKey: ['pokemons'] });
    },
  });
};
