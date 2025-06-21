import { useState, useEffect } from "react";

const useImageHandler = (src, fallbackSrc = null) => {
  const [imageSrc, setImageSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(!!src);
  const [hasError, setHasError] = useState(false);

  // Função para validar se uma URL é uma imagem válida
  const isValidImageUrl = (url) => {
    if (!url) return false;

    // Verificar se é data URL válida
    if (url.startsWith("data:image/")) {
      return true;
    }

    // Verificar se é uma URL válida
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // Função para testar se a imagem carrega
  const testImageLoad = (url) => {
    return new Promise((resolve, reject) => {
      const img = new Image();

      img.onload = () => {
        // Verificar se a imagem tem dimensões válidas
        if (img.width > 0 && img.height > 0) {
          resolve(url);
        } else {
          reject(new Error("Imagem inválida"));
        }
      };

      img.onerror = () => {
        reject(new Error("Falha ao carregar imagem"));
      };

      // Timeout para evitar travamento
      setTimeout(() => {
        reject(new Error("Timeout"));
      }, 5000);

      img.src = url;
    });
  };

  // Efeito para gerenciar o carregamento da imagem
  useEffect(() => {
    if (!src) {
      setImageSrc(fallbackSrc);
      setIsLoading(false);
      setHasError(true);
      return;
    }

    if (!isValidImageUrl(src)) {
      setImageSrc(fallbackSrc);
      setIsLoading(false);
      setHasError(true);
      return;
    }

    setIsLoading(true);
    setHasError(false);

    testImageLoad(src)
      .then(() => {
        setImageSrc(src);
        setIsLoading(false);
        setHasError(false);
      })
      .catch(() => {
        setImageSrc(fallbackSrc);
        setIsLoading(false);
        setHasError(true);
      });
  }, [src, fallbackSrc]);

  return {
    imageSrc,
    isLoading,
    hasError,
    retry: () => {
      if (src && isValidImageUrl(src)) {
        setIsLoading(true);
        setHasError(false);
        testImageLoad(src)
          .then(() => {
            setImageSrc(src);
            setIsLoading(false);
            setHasError(false);
          })
          .catch(() => {
            setImageSrc(fallbackSrc);
            setIsLoading(false);
            setHasError(true);
          });
      }
    },
  };
};

export default useImageHandler;

