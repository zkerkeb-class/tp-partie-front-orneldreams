import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PokeList from '../components/pokelist';

const HomePage = () => {
  const navigate = useNavigate();
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div>
      <button 
        className="btn-create-pokemon"
        onClick={() => navigate('/create')}
      >
        + Ajouter un nouveau Pokémon
      </button>
      <PokeList 
        onSelectPokemon={(pokemon) => navigate(`/pokemon/${pokemon.id}`)}
        refreshKey={refreshKey}
      />
    </div>
  );
};

export default HomePage;
