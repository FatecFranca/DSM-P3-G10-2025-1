import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./Footer.module.css";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const currentYear = new Date().getFullYear();

  // Controla a exibição do botão de voltar ao topo
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    
    // Simular chamada API
    setTimeout(() => {
      setIsSubscribed(true);
      setEmail("");
      setIsLoading(false);
      
      // Reset message after 3 seconds
      setTimeout(() => setIsSubscribed(false), 3000);
    }, 1000);
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.footerGlow}></div>
      
      <div className={styles.container}>
        <div className={styles.topSection}>
          <div className={styles.footerGrid}>
            {/* Logo e Descrição */}
            <div className={styles.logoSection}>
              <Link to="/" className={styles.logoLink} aria-label="Ir para página inicial">
                <div className={styles.logoIcon}>
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path 
                      d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                      fill="currentColor"
                      fillOpacity="0.1"
                    />
                    <circle 
                      cx="12" 
                      cy="12" 
                      r="3" 
                      stroke="currentColor" 
                      strokeWidth="2"
                      fill="none"
                    />
                  </svg>
                </div>
                <span className={styles.logoText}>GameReviews</span>
              </Link>
              
              <p className={styles.description}>
                Sua fonte confiável para reviews honestos e detalhados dos melhores
                jogos. Descubra sua próxima aventura gaming conosco.
              </p>
              
              <div className={styles.socialLinks} role="list">
                <a 
                  href="https://facebook.com" 
                  className={styles.socialIcon} 
                  aria-label="Siga-nos no Facebook"
                  target="_blank"
                  rel="noopener noreferrer"
                  role="listitem"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </a>
                
                <a 
                  href="https://twitter.com" 
                  className={styles.socialIcon} 
                  aria-label="Siga-nos no Twitter"
                  target="_blank"
                  rel="noopener noreferrer"
                  role="listitem"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                  </svg>
                </a>
                
                <a 
                  href="https://instagram.com" 
                  className={styles.socialIcon} 
                  aria-label="Siga-nos no Instagram"
                  target="_blank"
                  rel="noopener noreferrer"
                  role="listitem"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </a>
                
                <a 
                  href="https://youtube.com" 
                  className={styles.socialIcon} 
                  aria-label="Inscreva-se no nosso canal"
                  target="_blank"
                  rel="noopener noreferrer"
                  role="listitem"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
                    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
                  </svg>
                </a>

                <a 
                  href="https://discord.com" 
                  className={styles.socialIcon} 
                  aria-label="Junte-se ao nosso Discord"
                  target="_blank"
                  rel="noopener noreferrer"
                  role="listitem"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M9.593 10.971c-.542 0-.969.475-.969 1.055 0 .578.437 1.055.969 1.055.541 0 .968-.477.968-1.055.011-.581-.427-1.055-.968-1.055zm4.814 0c-.542 0-.969.475-.969 1.055 0 .578.437 1.055.969 1.055.541 0 .968-.477.968-1.055-.001-.581-.427-1.055-.968-1.055z"/>
                    <path d="M18.384 3.408c.95.42 1.858.972 2.659 1.634.206 1.488.206 4.862.206 4.862s-.3 2.596-1.215 3.716c-.732.897-1.976 1.397-3.077 1.621l-.617-.74c1.077-.325 2.16-.869 2.888-1.513-.629.325-1.285.594-1.944.789-.659.195-1.334.325-2.037.39-.703.065-1.434.065-2.186 0-.703-.065-1.378-.195-2.037-.39-.659-.195-1.315-.464-1.944-.789.728.644 1.811 1.188 2.888 1.513l-.617.74c-1.101-.224-2.345-.724-3.077-1.621C2.5 11.728 2.2 9.132 2.2 9.132s0-3.374.206-4.862c.801-.662 1.709-1.214 2.659-1.634.206.26.411.553.593.845 1.328-.195 2.707-.195 4.069 0 .182-.292.387-.585.593-.845z"/>
                  </svg>
                </a>
              </div>
            </div>

            <div className={styles.footerLinksWrapper}>
              {/* Navegação Principal */}
              <nav className={styles.linksSection} aria-labelledby="main-navigation">
                <h4 id="main-navigation" className={styles.linkTitle}>Navegação</h4>
                <ul className={styles.linksList} role="list">
                  <li role="listitem">
                    <Link to="/" className={styles.footerLink}>
                      Home
                    </Link>
                  </li>
                  <li role="listitem">
                    <Link to="/reviews" className={styles.footerLink}>
                      Reviews
                    </Link>
                  </li>
                  <li role="listitem">
                    <Link to="/noticias" className={styles.footerLink}>
                      Notícias
                    </Link>
                  </li>
                  <li role="listitem">
                    <Link to="/top-games" className={styles.footerLink}>
                      Top Games
                    </Link>
                  </li>
                  <li role="listitem">
                    <Link to="/lancamentos" className={styles.footerLink}>
                      Lançamentos
                    </Link>
                  </li>
                  <li role="listitem">
                    <Link to="/sobre" className={styles.footerLink}>
                      Sobre Nós
                    </Link>
                  </li>
                </ul>
              </nav>

              {/* Categorias de Jogos */}
              <nav className={styles.linksSection} aria-labelledby="game-categories">
                <h4 id="game-categories" className={styles.linkTitle}>Categorias</h4>
                <ul className={styles.linksList} role="list">
                  <li role="listitem">
                    <Link to="/categoria/acao" className={styles.footerLink}>
                      Ação & Aventura
                    </Link>
                  </li>
                  <li role="listitem">
                    <Link to="/categoria/rpg" className={styles.footerLink}>
                      RPG & MMO
                    </Link>
                  </li>
                  <li role="listitem">
                    <Link to="/categoria/fps" className={styles.footerLink}>
                      FPS & Shooter
                    </Link>
                  </li>
                  <li role="listitem">
                    <Link to="/categoria/estrategia" className={styles.footerLink}>
                      Estratégia
                    </Link>
                  </li>
                  <li role="listitem">
                    <Link to="/categoria/indie" className={styles.footerLink}>
                      Indie Games
                    </Link>
                  </li>
                  <li role="listitem">
                    <Link to="/categoria/mobile" className={styles.footerLink}>
                      Mobile Games
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>

            {/* Newsletter Melhorada */}
            <div className={styles.newsletterSection}>
              <h4 className={styles.linkTitle}>Newsletter</h4>
              <p className={styles.newsletterText}>
                Receba reviews exclusivos e notícias dos games diretamente no seu email.
              </p>
              
              {isSubscribed ? (
                <div className={styles.successMessage}>
                  <svg className={styles.checkIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <p>Inscrição realizada com sucesso!</p>
                </div>
              ) : (
                <form className={styles.subscribeForm} onSubmit={handleSubscribe}>
                  <div className={styles.inputGroup}>
                    <input 
                      type="email" 
                      placeholder="seu@email.com" 
                      required 
                      className={styles.emailInput}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      aria-label="Digite seu endereço de email"
                      disabled={isLoading}
                    />
                    <button 
                      type="submit" 
                      className={styles.subscribeButton}
                      disabled={isLoading || !email}
                      aria-label="Inscrever-se na newsletter"
                    >
                      {isLoading ? (
                        <svg className={styles.loadingSpinner} viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="30 60" />
                        </svg>
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      )}
                    </button>
                  </div>
                  <small className={styles.privacyNote}>
                    Respeitamos sua privacidade. Cancele a qualquer momento.
                  </small>
                </form>
              )}
            </div>
          </div>
        </div>

        <div className={styles.divider} role="separator" aria-hidden="true"></div>

        <div className={styles.bottomSection}>
          <div className={styles.copyright}>
            <span>© {currentYear} GameReviews</span>
            <span className={styles.separator}>•</span>
            <span>Feito com <span className={styles.heart}>❤️</span> para gamers</span>
          </div>
          
          <nav className={styles.bottomLinks} aria-label="Links legais">
            <Link to="/privacidade" className={styles.bottomLink}>Privacidade</Link>
            <Link to="/termos" className={styles.bottomLink}>Termos</Link>
            <Link to="/cookies" className={styles.bottomLink}>Cookies</Link>
            <Link to="/contato" className={styles.bottomLink}>Contato</Link>
            <Link to="/suporte" className={styles.bottomLink}>Suporte</Link>
          </nav>
        </div>

        {/* Scroll to Top Button */}
        <button 
          className={`${styles.scrollToTop} ${showScrollTop ? styles.visible : ''}`}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Voltar ao topo da página"
          aria-hidden={!showScrollTop}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        </button>
      </div>
    </footer>
  );
};

export default Footer;