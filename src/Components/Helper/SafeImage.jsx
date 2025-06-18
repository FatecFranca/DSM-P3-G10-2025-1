import React, { useState } from "react";
import styles from "./SafeImage.module.css";

const SafeImage = ({
  src,
  alt,
  fallbackSrc = "/placeholder-game.jpg",
  className = "",
  ...props
}) => {
  const [imageSrc, setImageSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);

    // Se a imagem atual não é o fallback e ainda não tentamos o fallback
    if (imageSrc !== fallbackSrc) {
      setImageSrc(fallbackSrc);
    } else {
      // Se mesmo o fallback falhou, usar placeholder genérico
      setImageSrc(
        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDMwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMTUwIDIwMEMxNjUuNDY0IDIwMCAxNzggMTg3LjQ2NCAxNzggMTcyQzE3OCAxNTYuNTM2IDE2NS40NjQgMTQ0IDE1MCAxNDRDMTM0LjUzNiAxNDQgMTIyIDE1Ni41MzYgMTIyIDE3MkMxMjIgMTg3LjQ2NCAxMzQuNTM2IDIwMCAxNTAgMjAwWiIgZmlsbD0iIzk3QTNBRiIvPgo8cGF0aCBkPSJNMjMxIDMwNkMxOTQgMjk0IDEzNCAxODUgMTM0IDI4M0MxMzQgMjgzIDY4IDI4MyA2OCAzMDZIMjMxWiIgZmlsbD0iIzk3QTNBRiIvPgo8L3N2Zz4K"
      );
    }
  };

  const isValidImage = (url) => {
    // Verificar se é uma URL válida ou data URL
    try {
      if (url.startsWith("data:image/")) {
        return true;
      }
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // Se a src não é válida, usar fallback imediatamente
  React.useEffect(() => {
    if (!src || !isValidImage(src)) {
      setImageSrc(fallbackSrc);
      setHasError(true);
      setIsLoading(false);
    } else {
      setImageSrc(src);
      setHasError(false);
      setIsLoading(true);
    }
  }, [src, fallbackSrc]);

  return (
    <div className={`${styles.imageContainer} ${className}`}>
      {isLoading && !hasError && (
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
        {...props}
      />
    </div>
  );
};

export default SafeImage;
