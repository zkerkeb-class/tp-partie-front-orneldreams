import { useEffect, useState } from 'react';
import logoImg from '../../assets/logo.png';
import './splash.css';

const SplashScreen = ({ onFinish }) => {
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setFadeOut(true);
        }, 2500);

        const finishTimer = setTimeout(() => {
            onFinish();
        }, 3000);

        return () => {
            clearTimeout(timer);
            clearTimeout(finishTimer);
        };
    }, [onFinish]);

    return (
        <div className={`splash-screen ${fadeOut ? 'fade-out' : ''}`}>
            <div className="splash-content">
                <div className="splash-logo-container">
                    <img 
                        src={logoImg} 
                        alt="Logo Pokédex" 
                        className="splash-logo"
                    />
                </div>
                
                <h2 className="splash-text">Pokédex Ornel</h2>
            </div>
        </div>
    );
};

export default SplashScreen;
