import React, { createContext, useContext, useState } from "react";

const ModalContext = createContext();

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};

export const ModalProvider = ({ children }) => {
  const [modals, setModals] = useState([]);

  const openModal = (config) => {
    const id = Date.now() + Math.random();
    const modal = { id, ...config };

    setModals((prev) => [...prev, modal]);
    return id;
  };

  const closeModal = (id) => {
    setModals((prev) => prev.filter((modal) => modal.id !== id));
  };

  const confirm = (message, title = "Confirmação") => {
    return new Promise((resolve) => {
      const id = openModal({
        type: "confirm",
        title,
        message,
        onConfirm: () => {
          closeModal(id);
          resolve(true);
        },
        onCancel: () => {
          closeModal(id);
          resolve(false);
        },
      });
    });
  };

  const alert = (message, title = "Aviso") => {
    return new Promise((resolve) => {
      const id = openModal({
        type: "alert",
        title,
        message,
        onClose: () => {
          closeModal(id);
          resolve();
        },
      });
    });
  };

  const prompt = (message, title = "Entrada", defaultValue = "") => {
    return new Promise((resolve) => {
      const id = openModal({
        type: "prompt",
        title,
        message,
        defaultValue,
        onConfirm: (value) => {
          closeModal(id);
          resolve(value);
        },
        onCancel: () => {
          closeModal(id);
          resolve(null);
        },
      });
    });
  };

  return (
    <ModalContext.Provider
      value={{
        modals,
        openModal,
        closeModal,
        confirm,
        alert,
        prompt,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};
