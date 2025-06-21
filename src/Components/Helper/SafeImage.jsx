import React, { useState } from "react";
import styles from "./SafeImage.module.css";

const SafeImage = ({
  src,
  alt,
  fallbackSrc = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDMwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNTAgMTcwQzE2MC40NiAxNzAgMTY5IDE2MS40NiAxNjkgMTUxQzE2OSAxNDAuNTQgMTYwLjQ2IDEzMiAxNTAgMTMyQzEzOS41NCAxMzIgMTMxIDE0MC41NCAxMzEgMTUxQzEzMSAxNjEuNDYgMTM5LjU0IDE3MCAxNTAgMTcwWiIgZmlsbD0iIzk3QTNBRiIvPgo8cGF0aCBkPSJNMjEwIDI2OEMxODUgMjU4IDE0NSAyMDAgMTQ1IDI1OEMxNDUgMjU4IDkwIDI1OCA5MCAyNjhIMjEwWiIgZmlsbD0iIzk3QTNBRiIvPgo8dGV4dCB4PSIxNTAiIHk9IjMwMCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE2IiBmaWxsPSIjOTdBM0FGIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5KT0dPPC90ZXh0Pgo8L3N2Zz4K",
  className = "",
  ...props
}) => {
  const [imageSrc, setImageSrc] = useState(src || fallbackSrc);
  const [isLoading, setIsLoading] = useState(!!src);
  const [hasTriedFallback, setHasTriedFallback] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    console.log("Erro ao carregar imagem:", imageSrc);
    setIsLoading(false);

    // Se ainda não tentamos o fallback e a imagem atual não é o fallback
    if (!hasTriedFallback && imageSrc !== fallbackSrc) {
      console.log("Tentando fallback:", fallbackSrc);
      setHasTriedFallback(true);
      setImageSrc(fallbackSrc);
      setIsLoading(true);
    }
  };
  // Atualizar src quando a prop src mudar
  React.useEffect(() => {
    if (src && src !== imageSrc) {
      setImageSrc(src);
      setIsLoading(true);
      setHasTriedFallback(false);
    } else if (!src && imageSrc !== fallbackSrc) {
      setImageSrc(fallbackSrc);
      setIsLoading(false);
      setHasTriedFallback(true);
    }
  }, [src, fallbackSrc]);

  return (
    <div className={`${styles.imageContainer} ${className}`}>
      {isLoading && (
        <div className={styles.loadingPlaceholder}>
          <div className={styles.spinner}></div>
        </div>
      )}
      <img
        src={imageSrc}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        className={`${styles.image} ${isLoading ? styles.loading : ""}`}
        style={{ display: isLoading ? "none" : "block" }}
        {...props}
      />
    </div>
  );
};

export default SafeImage;

