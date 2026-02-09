import { useNavigate } from 'react-router-dom';
import Favorites from '../components/Favorites';

const FavoritesPage = () => {
  const navigate = useNavigate();

  return (
    <Favorites 
      onSelectPokemon={(pokemon) => navigate(`/pokemon/${pokemon.id}`)}
      onBack={() => navigate('/')}
    />
  );
};

export default FavoritesPage;
