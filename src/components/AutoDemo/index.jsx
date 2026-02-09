import { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './autodemo.css';

const AutoDemo = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState(0);
  const [message, setMessage] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [highlightElement, setHighlightElement] = useState(null);
  const [tooltip, setTooltip] = useState(null);
  const [scrimPosition, setScrimPosition] = useState(null);

  useEffect(() => {
    // Vérifier si ?demo=true est dans l'URL
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get('demo') === 'true') {
      setIsActive(true);
      startDemo();
    }
  }, []);

  const highlightAndShowTooltip = (selector, tooltipText, scrollToElement = true) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const element = document.querySelector(selector);
        if (element) {
          if (scrollToElement) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
          
          // Ajouter la classe highlight
          element.classList.add('demo-highlight');
          
          // Calculer la position du tooltip
          const rect = element.getBoundingClientRect();
          const tooltipX = rect.left + rect.width / 2;
          const tooltipY = rect.top - 50;
          
          setHighlightElement(element);
          setScrimPosition({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
          setTooltip({ text: tooltipText, x: tooltipX, y: tooltipY });
          
          setTimeout(resolve, 800);
        } else {
          setTimeout(resolve, 500);
        }
      }, 100);
    });
  };

  const clearHighlights = () => {
    if (highlightElement) {
      highlightElement.classList.remove('demo-highlight');
      setHighlightElement(null);
      setTooltip(null);
      setScrimPosition(null);
    }
  };

  const startDemo = () => {
    setTimeout(() => runStep(0), 1000);
  };

  const runStep = async (currentStep) => {
    const steps = [
      {
        message: "🎮 Bienvenue dans le Pokédex Ornel !\nLaissez-moi vous faire visiter...",
        duration: 3000,
        action: async () => {
          clearHighlights();
          if (location.pathname !== '/') {
            navigate('/');
          }
        }
      },
      {
        message: "📋 Voici la liste complète des Pokémon\nScrollez pour en découvrir d'autres",
        duration: 2500,
        action: async () => {
          clearHighlights();
          window.scrollTo({ top: 0, behavior: 'smooth' });
          await new Promise(r => setTimeout(r, 300));
          for (let i = 0; i < 2; i++) {
            window.scrollBy({ top: 150, behavior: 'smooth' });
            await new Promise(r => setTimeout(r, 300));
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
          await new Promise(r => setTimeout(r, 200));
        }
      },
      {
        message: "🔍 Cherchons 'Pikachu' avec la recherche",
        duration: 2000,
        action: async () => {
          const searchInput = document.querySelector('.search-input');
          if (searchInput) {
            searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
            await new Promise(r => setTimeout(r, 200));
            
            await highlightAndShowTooltip('.search-input', '⬅️ Tapez ici');
            
            searchInput.focus();
            searchInput.value = 'Pika';
            searchInput.dispatchEvent(new Event('input', { bubbles: true }));
            await new Promise(r => setTimeout(r, 300));
          }
        }
      },
      {
        message: "💡 Pikachu apparaît dans les suggestions\nCliquez pour voir les détails",
        duration: 2500,
        action: async () => {
          const suggestionsElement = document.querySelector('.search-suggestions');
          
          if (suggestionsElement) {
            await highlightAndShowTooltip('.search-suggestions', '📝 Sélectionnez');
            await new Promise(r => setTimeout(r, 600));
            
            const firstSuggestion = suggestionsElement.querySelector('.suggestion-item');
            if (firstSuggestion) {
              firstSuggestion.click();
              await new Promise(r => setTimeout(r, 300));
            }
          }
          
          // Effacer la recherche
          const searchInput = document.querySelector('.search-input');
          if (searchInput) {
            searchInput.value = '';
            searchInput.dispatchEvent(new Event('input', { bubbles: true }));
          }
        }
      },
      {
        message: "🎨 Filtrage par type de Pokémon",
        duration: 1500,
        action: async () => {
          const filterBtn = document.querySelector('.type-filter-btn');
          if (filterBtn) {
            filterBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
            await new Promise(r => setTimeout(r, 200));
          }
          await highlightAndShowTooltip('.type-filter-btn', '🔥 Filtres');
          setTimeout(() => {
            const fireTypeBtn = Array.from(document.querySelectorAll('.type-filter-btn'))
              .find(btn => btn.textContent.toLowerCase().includes('fire'));
            if (fireTypeBtn) {
              fireTypeBtn.click();
            }
          }, 200);
        }
      },
      {
        message: "✨ Multi-sélection",
        duration: 1200,
        action: async () => {
          await new Promise(r => setTimeout(r, 200));
          const waterTypeBtn = Array.from(document.querySelectorAll('.type-filter-btn'))
            .find(btn => btn.textContent.toLowerCase().includes('water'));
          if (waterTypeBtn) {
            waterTypeBtn.click();
          }
          await new Promise(r => setTimeout(r, 200));
        }
      },
      {
        message: "🔄 Réinitialiser",
        duration: 1000,
        action: async () => {
          await highlightAndShowTooltip('.clear-filters-btn', '✨ Effacer');
          setTimeout(() => {
            const clearBtn = document.querySelector('.clear-filters-btn');
            if (clearBtn) {
              clearBtn.click();
            }
          }, 200);
        }
      },
      {
        message: "📊 Pagination",
        duration: 1300,
        action: async () => {
          const select = document.querySelector('.page-size-select');
          if (select) {
            select.scrollIntoView({ behavior: 'smooth', block: 'center' });
            await new Promise(r => setTimeout(r, 200));
          }
          await highlightAndShowTooltip('.page-size-select', '📐 Items/page');
          setTimeout(() => {
            const select = document.querySelector('.page-size-select');
            if (select) {
              select.value = '10';
              select.dispatchEvent(new Event('change', { bubbles: true }));
            }
          }, 200);
        }
      },
      {
        message: "▶️ Page suivante",
        duration: 1800,
        action: async () => {
          await new Promise(r => setTimeout(r, 200));
          window.scrollTo({ top: 0, behavior: 'smooth' });
          await new Promise(r => setTimeout(r, 200));
          const nextBtn = document.querySelector('.nav-arrow-right');
          if (nextBtn) {
            nextBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
            await new Promise(r => setTimeout(r, 200));
          }
          await highlightAndShowTooltip('.nav-arrow-right', '➡️ Suivant');
          setTimeout(() => {
            const nextBtn = document.querySelector('.nav-arrow-right');
            if (nextBtn && !nextBtn.disabled) {
              nextBtn.click();
            }
          }, 200);
        }
      },
      {
        message: "◀️ Page précédente",
        duration: 1500,
        action: async () => {
          await new Promise(r => setTimeout(r, 300));
          window.scrollTo({ top: 0, behavior: 'smooth' });
          await new Promise(r => setTimeout(r, 200));
          for (let i = 0; i < 1; i++) {
            window.scrollBy({ top: 200, behavior: 'smooth' });
            await new Promise(r => setTimeout(r, 200));
          }
          const prevBtn = document.querySelector('.nav-arrow-left');
          if (prevBtn) {
            prevBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
            await new Promise(r => setTimeout(r, 200));
          }
          await highlightAndShowTooltip('.nav-arrow-left', '⬅️ Précédent');
          setTimeout(() => {
            const prevBtn = document.querySelector('.nav-arrow-left');
            if (prevBtn && !prevBtn.disabled) {
              prevBtn.click();
            }
            const select = document.querySelector('.page-size-select');
            if (select) {
              select.value = '20';
              select.dispatchEvent(new Event('change', { bubbles: true }));
            }
          }, 200);
        }
      },
      {
        message: "👆 Clic sur un Pokémon",
        duration: 2000,
        action: async () => {
          await new Promise(r => setTimeout(r, 300));
          window.scrollTo({ top: 0, behavior: 'smooth' });
          await new Promise(r => setTimeout(r, 200));
          window.scrollBy({ top: 100, behavior: 'smooth' });
          await new Promise(r => setTimeout(r, 200));
          
          const firstCard = document.querySelector('.poke-card');
          if (firstCard) {
            firstCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            await new Promise(r => setTimeout(r, 200));
            await highlightAndShowTooltip('.poke-card', '👆 Détails');
            setTimeout(() => {
              firstCard.click();
            }, 200);
          } else {
            navigate('/pokemon/1');
          }
        }
      },
      {
        message: "✨ Page de détails",
        duration: 2000,
        action: async () => {
          clearHighlights();
          window.scrollTo({ top: 0, behavior: 'smooth' });
          await new Promise(r => setTimeout(r, 300));
          for (let i = 0; i < 2; i++) {
            window.scrollBy({ top: 150, behavior: 'smooth' });
            await new Promise(r => setTimeout(r, 250));
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
          await new Promise(r => setTimeout(r, 200));
        }
      },
      {
        message: "🔊 Son",
        duration: 1300,
        action: async () => {
          const soundBtn = document.querySelector('.sound-btn-detail');
          if (soundBtn) {
            soundBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
            await new Promise(r => setTimeout(r, 200));
            await highlightAndShowTooltip('.sound-btn-detail', '🔊');
            setTimeout(() => {
              soundBtn.click();
            }, 200);
          }
        }
      },
      {
        message: "❤️ Favoris",
        duration: 1300,
        action: async () => {
          const favBtn = document.querySelector('.favorite-btn-detail');
          if (favBtn) {
            favBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
            await new Promise(r => setTimeout(r, 200));
            await highlightAndShowTooltip('.favorite-btn-detail', '💖');
            setTimeout(() => {
              favBtn.click();
            }, 200);
          }
        }
      },
      {
        message: "✏️ Édition",
        duration: 1000,
        action: async () => {
          clearHighlights();
          window.scrollBy({ top: 200, behavior: 'smooth' });
          await new Promise(r => setTimeout(r, 300));
        }
      },
      {
        message: "🗑️ Suppression",
        duration: 1200,
        action: async () => {
          await new Promise(r => setTimeout(r, 200));
          const deleteBtn = document.querySelector('.delete-btn-detail');
          if (deleteBtn) {
            deleteBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
            await new Promise(r => setTimeout(r, 200));
            await highlightAndShowTooltip('.delete-btn-detail', '🗑️');
          }
        }
      },
      {
        message: "⭐ Favoris",
        duration: 1500,
        action: async () => {
          clearHighlights();
          setTimeout(() => {
            navigate('/favorites');
          }, 800);
        }
      },
      {
        message: "💖 Page Favoris",
        duration: 2000,
        action: async () => {
          clearHighlights();
          window.scrollTo({ top: 0, behavior: 'smooth' });
          await new Promise(r => setTimeout(r, 300));
          for (let i = 0; i < 2; i++) {
            window.scrollBy({ top: 200, behavior: 'smooth' });
            await new Promise(r => setTimeout(r, 350));
          }
        }
      },
      {
        message: "➕ Création",
        duration: 1500,
        action: async () => {
          clearHighlights();
          setTimeout(() => {
            navigate('/create');
          }, 800);
        }
      },
      {
        message: "🎨 Formulaire",
        duration: 2000,
        action: async () => {
          clearHighlights();
          window.scrollTo({ top: 0, behavior: 'smooth' });
          await new Promise(r => setTimeout(r, 300));
          for (let i = 0; i < 2; i++) {
            window.scrollBy({ top: 150, behavior: 'smooth' });
            await new Promise(r => setTimeout(r, 300));
          }
        }
      },
      {
        message: "🏠 Accueil",
        duration: 1200,
        action: async () => {
          clearHighlights();
          window.scrollTo({ top: 0, behavior: 'smooth' });
          setTimeout(() => {
            navigate('/');
          }, 800);
        }
      },
      {
        message: "✅ Démo terminée !\n🎉",
        duration: 3000,
        action: async () => {
          clearHighlights();
          setTimeout(() => {
            setIsActive(false);
            const url = new URL(window.location);
            url.searchParams.delete('demo');
            window.history.replaceState({}, '', url);
          }, 3000);
        }
      }
    ];

    if (currentStep < steps.length) {
      const currentStepData = steps[currentStep];
      setMessage(currentStepData.message);
      setStep(currentStep);
      
      await currentStepData.action();

      setTimeout(() => {
        runStep(currentStep + 1);
      }, currentStepData.duration);
    }
  };

  if (!isActive) return null;

  return (
    <>
      {/* Scrim semi-transparent avec focus */}
      {scrimPosition && (
        <div 
          className="demo-scrim"
          style={{
            '--x': `${scrimPosition.x}px`,
            '--y': `${scrimPosition.y}px`
          }}
        />
      )}

      {/* Tooltip avec annotation */}
      {tooltip && (
        <div 
          className="demo-tooltip"
          style={{
            left: `${tooltip.x}px`,
            top: `${tooltip.y}px`,
            transform: 'translate(-50%, -100%)'
          }}
        >
          {tooltip.text}
        </div>
      )}

      {/* Message principal */}
      <div className="auto-demo-overlay">
        <div className="auto-demo-message">
          <div className="demo-icon">🤖</div>
          <p className="demo-text">{message}</p>
          <div className="demo-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${(step / 20) * 100}%` }}
              ></div>
            </div>
            <span className="progress-text">Étape {step + 1} / 20</span>
          </div>
          <button 
            className="demo-skip"
            onClick={() => {
              clearHighlights();
              setIsActive(false);
              const url = new URL(window.location);
              url.searchParams.delete('demo');
              window.history.replaceState({}, '', url);
            }}
          >
            Passer la démo
          </button>
        </div>
      </div>
    </>
  );
};

export default AutoDemo;
