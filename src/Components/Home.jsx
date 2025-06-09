import React, { useState, useEffect } from "react";
import styles from "./Home.module.css";
import Detail from "./Detail";
import BannerCarousel from './BannerCarousel';
import { Link } from "react-router-dom";

const categorias = [
  "Ação", "Aventura", "RPG", "Simulação", "Estratégia",
  "Casual", "Indie", "Corrida", "Esportes", "Terror",
  "Plataforma", "Puzzle", "FPS", "TPS", "MMORPG",
  "Mundo Aberto", "Sobrevivência", "Hack and Slash",
  "Metroidvania", "Roguelike"
];

const jogosDestaque = [
  {
    id: 1,
    nome: "The Elder Scrolls IV OBLIVION",
    capa: "./assets/3.jpg",
    avaliacao: "9.2",
    descricao: "Um épico RPG medieval de mundo aberto onde você pode forjar seu próprio destino.",
    genero: ["RPG", "Mundo Aberto", "Aventura"]
  },
  {
    id: 2,
    nome: "Doom The Dark Ages",
    capa: "./assets/2.jpg",
    avaliacao: "11",
    descricao: "Brutal, rápido e intenso - o retorno do FPS icônico com uma ambientação medieval.",
    genero: ["FPS", "Ação", "Terror"]
  },
  {
    id: 3,
    nome: "GTA VI",
    capa: "./assets/1.jpg",
    avaliacao: "9.0",
    descricao: "A aguardada sequência que promete revolucionar a experiência de mundo aberto mais uma vez.",
    genero: ["Ação", "Mundo Aberto", "Aventura"]
  },
  {
    id: 4,
    nome: "Assassin's Creed Shadows",
    capa: "./assets/2.jpg",
    avaliacao: "8.8",
    descricao: "Um novo capítulo da saga que nos leva às sombras feudais do Japão.",
    genero: ["Ação", "Aventura", "Stealth"]
  }
];

const novosLancamentos = [
  {
    id: 5,
    nome: "Starfield",
    capa: "./assets/1.jpg",
    data: "11/05/2025",
    plataformas: ["PC", "Xbox Series X/S"]
  },
  {
    id: 6,
    nome: "Dragon Age: Dreadwolf",
    capa: "./assets/3.jpg",
    data: "15/06/2025",
    plataformas: ["PC", "PS5", "Xbox Series X/S"]
  },
  {
    id: 7,
    nome: "Silksong",
    capa: "./assets/2.jpg", 
    data: "07/07/2025",
    plataformas: ["PC", "Switch", "PS5", "Xbox Series X/S"]
  }
];

const Home = () => {
  const [categoriaAtiva, setCategoriaAtiva] = useState(null);
  const [mostrarMais, setMostrarMais] = useState(false);
  
  const handleCategoriaClick = (categoria) => {
    setCategoriaAtiva(categoria === categoriaAtiva ? null : categoria);
  };
  
  const categoriasVisíveis = mostrarMais ? categorias : categorias.slice(0, 10);
  
  return (
    <main className={styles.page}>
      {/* Banner */}
      <section className={styles.heroSection}>
        <BannerCarousel />
        <div className={styles.banner}>
          <h1 className={styles.mainTitle}>Bem-vindo ao <span>GameReview</span></h1>
          <p className={styles.slogan}>Seu portal de análises sinceras e conteúdo gamer exclusivo!</p>
          <div className={styles.ctaButtons}>
            <Link to="/reviews" className={styles.ctaPrimary}>Últimas Reviews</Link>
            <Link to="/top-games" className={styles.ctaSecondary}>Top Games 2025</Link>
          </div>
        </div>
      </section>

      {/* Categorias */}
      <section className={styles.categoriasSection}>
        <div className={styles.sectionHeader}>
          <h2>Explore por Categorias</h2>
          <Detail />
        </div>
        <div className={styles.categoriasFlex}>
          {categoriasVisíveis.map((categoria, index) => (
            <Link
              key={index}
              to={`/genero/${categoria.toLowerCase().replace(/\s+/g, '-')}`}
              className={`${styles.categoriaItem} ${categoriaAtiva === categoria ? styles.ativo : ''}`}
              onClick={(e) => {
                e.preventDefault();
                handleCategoriaClick(categoria);
              }}
            >
              {categoria}
            </Link>
          ))}
          {categorias.length > 10 && (
            <button 
              className={styles.mostrarMais} 
              onClick={() => setMostrarMais(!mostrarMais)}
            >
              {mostrarMais ? 'Mostrar menos' : 'Mostrar mais'}
            </button>
          )}
        </div>
      </section>

      {/* Jogos em Destaque */}
      <section className={styles.destaquesSection}>
        <div className={styles.sectionHeader}>
          <h2>Jogos em Destaque</h2>
          <Detail />
        </div>
        <div className={styles.jogosGrid}>
          {jogosDestaque.map((jogo, index) => (
            <Link to={`/jogo/${jogo.id}`} key={index} className={styles.jogoCard}>
              <div className={styles.cardImageWrapper}>
                <img src={jogo.capa} alt={`Capa do jogo ${jogo.nome}`} className={styles.cardImage} />
                <div className={styles.avaliacaoTag}>
                  <span>{jogo.avaliacao}</span>
                  <span className={styles.starIcon}>⭐</span>
                </div>
              </div>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{jogo.nome}</h3>
                <p className={styles.cardDesc}>{jogo.descricao}</p>
                <div className={styles.cardGenres}>
                  {jogo.genero.map((gen, i) => (
                    <span key={i} className={styles.genreTag}>{gen}</span>
                  ))}
                </div>
              </div>
              <div className={styles.cardOverlay}>
                <span className={styles.viewDetails}>Ver Detalhes</span>
              </div>
            </Link>
          ))}
        </div>
        <div className={styles.sectionFooter}>
          <Link to="/reviews" className={styles.viewMoreBtn}>
            Ver Mais Reviews
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>
      </section>

      {/* Lançamentos */}
      <section className={styles.lancamentosSection}>
        <div className={styles.sectionHeader}>
          <h2>Próximos Lançamentos</h2>
          <Detail />
        </div>
        <div className={styles.lancamentosGrid}>
          {novosLancamentos.map((jogo, index) => (
            <div key={index} className={styles.lancamentoCard}>
              <div className={styles.lancCardImage}>
                <img src={jogo.capa} alt={`Capa do jogo ${jogo.nome}`} />
                <div className={styles.dataLancamento}>{jogo.data}</div>
              </div>
              <div className={styles.lancCardContent}>
                <h3>{jogo.nome}</h3>
                <div className={styles.plataformas}>
                  {jogo.plataformas.map((plat, i) => (
                    <span key={i} className={styles.plataformaTag}>{plat}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    
      {/* Call to Action */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContent}>
          <h2>Quer ficar por dentro de tudo?</h2>
          <p>Cadastre-se agora para receber as últimas notícias, reviews exclusivas e acompanhar seus jogos favoritos!</p>
          <div className={styles.ctaButtons}>
            <Link to="/login/cadastro" className={styles.ctaRegister}>Criar Conta</Link>
            <Link to="/login" className={styles.ctaLogin}>Já tem conta? Entrar</Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;