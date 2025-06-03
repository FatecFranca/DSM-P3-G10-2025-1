import React from "react";
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
    nome: "The Elder Scrolls IV OBLIVION",
    capa: "./assets/3.jpg",
    avaliacao: "9.2"
  },
  {
    nome: "Doom The Dark Ages",
    capa: "./assets/2.jpg",
    avaliacao: "11"
  },
  {
    nome: "GTA VI",
    capa: "./assets/1.jpg",
    avaliacao: "9.0"
  }
];


const Home = () => {
  return (
    <div className={styles.page}>
      {/* Banner */}
      <BannerCarousel />
      <section className={styles.banner}>
        <h1>Bem-vindo ao <span>GameReview</span></h1>
        <p>Seu portal de análises sinceras e conteúdo gamer!</p>
      </section>

      {/* Categorias */}
      <section className={styles.categorias}>
        <ul className={styles.listaCategorias}>
          {categorias.map((categoria, index) => (
            <li key={index}>
              <Link
                to={`/genero/${categoria.toLowerCase().replace(/\s+/g, '-')}`}
                className={styles.categoriaItem}
              >
                {categoria}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Jogos em Destaque */}
      <section className={styles.jogos}>
        <h2>Jogos em Destaque</h2>
        <div className={styles.jogosGrid}>
          {jogosDestaque.map((jogo, index) => (
            <div key={index} className={styles.jogoCard}>
              <img src={jogo.capa} alt={`Capa do jogo ${jogo.nome}`} />
              <h3>{jogo.nome}</h3>
              <p className={styles.avaliacao}>
                Avaliação: <strong>{jogo.avaliacao}</strong> <span>⭐</span>
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
