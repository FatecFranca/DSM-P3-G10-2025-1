import React from "react";
import { useParams } from "react-router-dom";
import styles from "./GamePage.module.css";
import Comments from "./Comments";
import Detail from "../Detail";

const GamePage = () => {
  const { id } = useParams();

  const [game, setGame] = React.useState(null);

  React.useEffect(() => {
    // Simulação de fetch
    const fetchGame = async () => {
      // Aqui entraria a chamada pro backend usando o ID
      //Isso aqui to so criando um exemplo pra testa a pagina
      const data = {
        id,
        titulo: "Nome do Jogo",
        descricao:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.  ",
        desenvolvedor: "Dev Company",
        genero: "Aventura",
        dataLancamento: "2025-08-09",
        imagem: "../../../Assets/testeLogin.jpg",
        avaliacoes: [
          { usuario: "Ana", nota: 4, comentario: "Muito divertido!" },
          { usuario: "Carlos", nota: 5, comentario: "Obra-prima." },
        ],
      };
      setGame(data);
    };

    fetchGame();
  }, [id]);

  if (!game) return <div className={styles.loading}></div>;

  return (
    <section className={`${styles.container} animeDown`}>
      <div className={styles.info}>
        <img src={game.imagem} alt={game.titulo} className={styles.image} />
        <div className={styles.details}>
          <h1 className="title">{game.titulo}</h1>
          <p>
            <strong>Gênero:</strong> {game.genero}
          </p>
          <p>
            <strong>Desenvolvedor:</strong> {game.desenvolvedor}
          </p>
          <p>
            <strong>Lançamento:</strong>{" "}
            {new Date(game.dataLancamento + "T00:00:00").toLocaleDateString()}
          </p>
          <p className={styles.description}>{game.descricao}</p>
        </div>
      </div>
      <Detail />
      <Comments avaliacoes={game.avaliacoes} />
    </section>
  );
};

export default GamePage;
