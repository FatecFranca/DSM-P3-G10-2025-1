import React from "react";
import { useModal } from "../../context/ModalContext";
import styles from "./Modal.module.css";

const Modal = () => {
  const { modals, closeModal } = useModal();

  if (modals.length === 0) return null;

  return (
    <>
      {modals.map((modal) => (
        <div
          key={modal.id}
          className={styles.modalOverlay}
          onClick={() => closeModal(modal.id)}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>{modal.title}</h3>
              <button
                className={styles.modalClose}
                onClick={() => closeModal(modal.id)}
              >
                ×
              </button>
            </div>

            <div className={styles.modalBody}>
              <p className={styles.modalMessage}>{modal.message}</p>
            </div>

            <div className={styles.modalFooter}>
              {modal.type === "confirm" && (
                <>
                  <button
                    className={`${styles.modalButton} ${styles.cancelButton}`}
                    onClick={() => {
                      modal.onCancel && modal.onCancel();
                      closeModal(modal.id);
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    className={`${styles.modalButton} ${styles.confirmButton}`}
                    onClick={() => {
                      modal.onConfirm && modal.onConfirm();
                      closeModal(modal.id);
                    }}
                  >
                    Confirmar
                  </button>
                </>
              )}

              {modal.type === "alert" && (
                <button
                  className={`${styles.modalButton} ${styles.confirmButton}`}
                  onClick={() => {
                    modal.onConfirm && modal.onConfirm();
                    closeModal(modal.id);
                  }}
                >
                  OK
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default Modal;
