import React from "react";
import styles from "./GamePost.module.css";
import Input from "../Form/Input";
import Button from "../Form/Button";
import Select from "../Form/Select";
import Textarea from "../Form/TextArea";
import useForm from "../../Hooks/useForm";

const GamePost = () => {
  const title = useForm("");
  const developer = useForm("");
  const date = useForm("date");
  const [description, setDescription] = React.useState("");
  const [img, setImg] = React.useState({});
  const [genero, setGenero] = React.useState("");
  function handleImageChange({ target }) {
    setImg({
      preview: URL.createObjectURL(target.files[0]),
      raw: target.files[0],
    });
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    if (!title.validate() || !developer.validate() || !date.validate()) return;
    formData.append("img", img.raw);
    formData.append("titulo", title.value);
    formData.append("genero", genero);
    formData.append("descrição", description);
    formData.append("desenvolvedor", developer.value);
    formData.append("data", date.value);
    console.log("FormData enviado:");
    //Form data tem todos os dados pra criar o jogo
    // Aqui entra a lógica do backend para postar o jogo
  };

  return (
    <section className={`${styles.container} animeDown`}>
      <div className={styles.gamePost}>
        <h1 className="title">Postar Jogo</h1>
        <form className={styles.form} onSubmit={handleSubmit}>
          <Input label="Nome do Jogo" name="title" type="text" {...title} />
          <Textarea
            label="Descrição"
            name="description"
            value={description}
            onChange={({ target }) => setDescription(target.value)}
            required
          />
          <p style={{ paddingBottom: 8 }}>Gênero</p>
          <Select
            options={[
              "Ação",
              "Aventura",
              "RPG",
              "Tiro",
              "Estratégia",
              "Simulação",
              "Esporte",
              "Corrida",
              "Luta",
              "Puzzle",
              "Terror",
              "Plataforma",
              "Sobrevivência",
              "MOBA",
              "MMO",
            ]}
            value={genero}
            setValue={setGenero}
            required
          />
          <Input
            label="Desenvolvedor"
            name="developer"
            type="text"
            {...developer}
          />
          <Input
            label="Data de Lançamento"
            name="lancamento"
            type="date"
            {...date}
          />
          <input type="file" name="img" id="img" onChange={handleImageChange} required />
          <Button className={styles.button}>Postar</Button>
        </form>
      </div>
      <div>
        {img.preview && (
          <div className={styles.previewWrapper}>
            <h1>Preview: </h1>
            <div
              className={styles.preview}
              style={{ backgroundImage: `url('${img.preview}')` }}
            ></div>
          </div>
        )}
      </div>
    </section>
  );
};

export default GamePost;
