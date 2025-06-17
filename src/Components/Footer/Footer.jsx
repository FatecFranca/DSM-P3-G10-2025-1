import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./Footer.module.css";

const Footer = () => {
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

  const scrollToTop = () => {
    window.scrollTo({ 
      top: 0, 
      behavior: 'smooth' 
    });
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.topSection}>
          <div className={styles.footerGrid}>
            {/* Logo e Redes Sociais */}
            <div className={styles.logoSection}>
              <Link to="/" className={styles.logoLink}>
                <div className={styles.logoIcon}>
                  🎮
                </div>
                <span className={styles.logoText}>GameReviews</span>
              </Link>
              
              <p style={{ color: '#9ca3af', marginBottom: '1rem', lineHeight: '1.6' }}>
                Sua plataforma completa para descobrir, avaliar e compartilhar experiências com os melhores jogos.
              </p>
              
              <div className={styles.socialLinks}>
                <a 
                  href="https://facebook.com" 
                  className={styles.socialIcon} 
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Facebook"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </a>
                
                <a 
                  href="https://twitter.com" 
                  className={styles.socialIcon} 
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Twitter"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                  </svg>
                </a>
                
                <a 
                  href="https://instagram.com" 
                  className={styles.socialIcon} 
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Instagram"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </a>
                
                <a 
                  href="https://discord.com" 
                  className={styles.socialIcon} 
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Discord"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </a>
              </div>
            </div>

            <div className={styles.footerLinksWrapper}>
              {/* Navegação Principal */}
              <div className={styles.linksSection}>
                <h4 className={styles.linkTitle}>Explorar</h4>
                <ul className={styles.linksList}>
                  <li><Link to="/" className={styles.footerLink}>Home</Link></li>
                  <li><Link to="/jogos" className={styles.footerLink}>Jogos</Link></li>
                  <li><Link to="/reviews" className={styles.footerLink}>Reviews</Link></li>
                  <li><Link to="/generos" className={styles.footerLink}>Gêneros</Link></li>
                  <li><Link to="/sobre" className={styles.footerLink}>Sobre</Link></li>
                </ul>
              </div>

              {/* Categorias */}
              <div className={styles.linksSection}>
                <h4 className={styles.linkTitle}>Categorias</h4>
                <ul className={styles.linksList}>
                  <li><Link to="/genero/acao" className={styles.footerLink}>Ação</Link></li>
                  <li><Link to="/genero/rpg" className={styles.footerLink}>RPG</Link></li>
                  <li><Link to="/genero/fps" className={styles.footerLink}>FPS</Link></li>
                  <li><Link to="/genero/estrategia" className={styles.footerLink}>Estratégia</Link></li>
                  <li><Link to="/genero/indie" className={styles.footerLink}>Indie</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.divider}></div>

        <div className={styles.bottomSection}>
          <div className={styles.copyright}>
            <span>© {currentYear} GameReviews</span>
            <span className={styles.separator}>•</span>
            <span>Feito com <span className={styles.heart}>❤️</span> para gamers</span>
          </div>
          
          <div className={styles.bottomLinks}>
            <Link to="/privacidade" className={styles.bottomLink}>Privacidade</Link>
            <Link to="/termos" className={styles.bottomLink}>Termos</Link>
            <Link to="/contato" className={styles.bottomLink}>Contato</Link>
          </div>
        </div>

        {/* Botão Voltar ao Topo */}
        <button 
          className={`${styles.scrollToTop} ${showScrollTop ? styles.visible : ''}`}
          onClick={scrollToTop}
          title="Voltar ao topo"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        </button>
      </div>
    </footer>
  );
};

export default Footer;