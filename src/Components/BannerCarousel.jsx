import React, { useEffect, useState, useRef } from 'react';
import styles from './BannerCarousel.module.css';

const imagens = [
  "./assets/1.jpg",
  "./assets/2.jpg",
  "./assets/3.jpg"
];

const BannerCarousel = () => {
  const [indice, setIndice] = useState(0);
  const startX = useRef(null);

  useEffect(() => {
    const intervalo = setInterval(() => {
      setIndice(prev => (prev + 1) % imagens.length);
    }, 10000); // 10 segundos

    return () => clearInterval(intervalo);
  }, []);

  const irParaSlide = (index) => {
    setIndice(index);
  };

  const onTouchStart = (e) => {
    startX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e) => {
    const endX = e.changedTouches[0].clientX;
    const delta = startX.current - endX;

    if (delta > 50) {
      setIndice(prev => (prev + 1) % imagens.length);
    } else if (delta < -50) {
      setIndice(prev => (prev - 1 + imagens.length) % imagens.length);
    }
  };

  return (
    <div className={styles.carousel}>
      <div
        className={styles.slides}
        style={{
          transform: `translateX(-${indice * 100}%)`,
        }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {imagens.map((src, i) => (
          <img key={i} src={src} alt={`Banner ${i + 1}`} className={styles.slide} />
        ))}
      </div>

      <div className={styles.indicadores}>
        {imagens.map((_, i) => (
          <button
            key={i}
            className={`${styles.indicador} ${i === indice ? styles.ativo : ''}`}
            onClick={() => irParaSlide(i)}
            aria-label={`Ir para banner ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default BannerCarousel;