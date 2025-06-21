import React, { useState, useRef } from "react";
import styles from "./ImageUpload.module.css";

const ImageUpload = ({
  onImageUpload,
  value,
  label = "Imagem",
  required = false,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState(value || null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  // Validação de arquivo
  const validateFile = (file) => {
    const validTypes = [
      "image/png",
      "image/jpg",
      "image/jpeg",
      "image/gif",
      "image/webp",
      "image/bmp",
    ];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type.toLowerCase())) {
      return "Tipo de arquivo inválido. Use PNG, JPG, JPEG, GIF, WebP ou BMP.";
    }

    if (file.size > maxSize) {
      return "Arquivo muito grande. Máximo 5MB.";
    }

    if (file.size === 0) {
      return "Arquivo está vazio ou corrompido.";
    }

    return null;
  };
  // Redimensionar e comprimir imagem
  const resizeImage = (file) => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = () => {
        try {
          // Calcular dimensões mantendo proporção (máximo 800x600)
          const maxWidth = 800;
          const maxHeight = 600;
          let { width, height } = img;

          if (width > height) {
            if (width > maxWidth) {
              height = (height * maxWidth) / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = (width * maxHeight) / height;
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;

          // Definir fundo branco para imagens com transparência
          ctx.fillStyle = "white";
          ctx.fillRect(0, 0, width, height);

          // Desenhar e comprimir
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
          resolve(dataUrl);
        } catch (error) {
          reject(new Error("Erro ao processar a imagem."));
        }
      };

      img.onerror = () => {
        reject(new Error("Imagem corrompida ou formato não suportado."));
      };

      // Timeout para evitar travamento
      setTimeout(() => {
        reject(new Error("Timeout ao carregar a imagem."));
      }, 10000);

      img.src = URL.createObjectURL(file);
    });
  };

  // Processar arquivo
  const processFile = async (file) => {
    setError(null);
    setLoading(true);

    try {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        setLoading(false);
        return;
      }

      const dataUrl = await resizeImage(file);
      setPreview(dataUrl);
      onImageUpload(dataUrl);
    } catch (err) {
      setError("Erro ao processar imagem.");
      console.error("Erro no processamento da imagem:", err);
    }

    setLoading(false);
  };

  // Eventos de drag and drop
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const openFileSelector = () => {
    fileInputRef.current?.click();
  };

  const removeImage = () => {
    setPreview(null);
    setError(null);
    onImageUpload("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={styles.imageUpload}>
      <label className={styles.label}>
        {label} {required && <span className={styles.required}>*</span>}
      </label>

      {preview ? (
        <div className={styles.preview}>
          <img src={preview} alt="Preview" className={styles.previewImage} />
          <div className={styles.previewActions}>
            <button
              type="button"
              onClick={openFileSelector}
              className={styles.changeButton}
            >
              Alterar
            </button>
            <button
              type="button"
              onClick={removeImage}
              className={styles.removeButton}
            >
              Remover
            </button>
          </div>
        </div>
      ) : (
        <div
          className={`${styles.dropzone} ${
            dragActive ? styles.dragActive : ""
          } ${error ? styles.error : ""}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={openFileSelector}
        >
          {loading ? (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <p>Processando imagem...</p>
            </div>
          ) : (
            <>
              <div className={styles.uploadIcon}>📷</div>
              <p className={styles.uploadText}>
                Clique ou arraste uma imagem aqui
              </p>{" "}
              <p className={styles.uploadSubtext}>
                PNG, JPG, JPEG, GIF, WebP ou BMP (máx. 5MB)
              </p>
            </>
          )}
        </div>
      )}

      {error && <div className={styles.errorMessage}>{error}</div>}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        style={{ display: "none" }}
      />
    </div>
  );
};

export default ImageUpload;

