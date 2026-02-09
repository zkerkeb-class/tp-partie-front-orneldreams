import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getFavorites } from '../../utils/favorites';
import logoImg from '../../assets/logo.png';
import './layout.css';

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [favoritesCount, setFavoritesCount] = useState(0);

  useEffect(() => {
    const updateCount = () => {
      setFavoritesCount(getFavorites().length);
    };

    updateCount();
    window.addEventListener('favorites-updated', updateCount);
    window.addEventListener('storage', updateCount);

    return () => {
      window.removeEventListener('favorites-updated', updateCount);
      window.removeEventListener('storage', updateCount);
    };
  }, []);

  const isHome = location.pathname === '/';

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <img src={logoImg} alt="Logo Ornel" className="header-logo" />
          <h1 onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>Pokédex Ornel</h1>
          <div className="header-buttons">
            <Link to="/create" className="btn-create-header">
              ✨ Ajouter un Pokémon
            </Link>
            <Link to="/favorites" className="btn-favorites-header">
              ❤️ Favoris
              {isHome && (
                <span className="favorites-count" aria-label={`${favoritesCount} favoris`}>
                  {favoritesCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
