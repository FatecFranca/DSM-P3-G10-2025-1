import React from "react";
import styles from "./Footer.module.css";
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from 'react-icons/fa6';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <h2 className="logo">GameReview</h2>
        <p className={styles.tagline}>Avaliações honestas. Jogabilidade real. Sem enrolação.</p>
        <div className={styles.socials}>
          <a href="#"><FaFacebookF /></a>
          <a href="#"><FaXTwitter /></a>
          <a href="#"><FaInstagram /></a>
          <a href="#"><FaYoutube /></a>
        </div>
      </div>
      <div className={styles.copy}>
        © {new Date().getFullYear()} GameReview 🎮 Todos os direitos reservados.
      </div>
    </footer>
  );
};

export default Footer;