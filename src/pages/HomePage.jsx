import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PokeList from '../components/pokelist';

const HomePage = () => {
  const navigate = useNavigate();
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div>
      <div className="welcome-message">
        <h2>Bienvenue dans le monde Pokémon! 🌍</h2>
        <p>Découvrez et explorez la collection complète de Pokémons</p>
      </div>
      <PokeList 
        onSelectPokemon={(pokemon) => navigate(`/pokemon/${pokemon.id}`)}
        refreshKey={refreshKey}
      />
    </div>
  );
};

export default HomePage;
