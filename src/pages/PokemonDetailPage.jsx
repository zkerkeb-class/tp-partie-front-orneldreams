import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getPokemonById } from '../utils/api';
import PokeDetail from '../components/pokeDetail';

const PokemonDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: pokemon, isLoading, error } = useQuery({
    queryKey: ['pokemon', id],
    queryFn: () => getPokemonById(id),
  });

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <div className="loading-spinner">Chargement...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <h2>❌ Erreur</h2>
        <p>{error.message}</p>
        <button onClick={() => navigate('/')}>Retour à la liste</button>
      </div>
    );
  }

  return (
    <PokeDetail 
      pokemon={pokemon} 
      onBack={() => navigate(-1)}
      onPokemonDeleted={() => navigate('/')}
      onRefresh={() => {
        queryClient.invalidateQueries({ queryKey: ['pokemon', id] });
        queryClient.invalidateQueries({ queryKey: ['pokemons'] });
      }}
    />
  );
};

export default PokemonDetailPage;
