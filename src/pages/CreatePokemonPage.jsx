import { useNavigate } from 'react-router-dom';
import CreatePokemon from '../components/createPokemon';

const CreatePokemonPage = () => {
  const navigate = useNavigate();

  return (
    <CreatePokemon 
      onPokemonCreated={() => navigate('/')}
      onCancel={() => navigate('/')}
    />
  );
};

export default CreatePokemonPage;
