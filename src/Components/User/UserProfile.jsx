import React, { useState, useEffect } from "react";
import { useAuthContext } from "../../context/AuthContext";
import { useReview } from "../../context/ReviewContext";
import UserIcon from "./UserIcon";
import userService from "../../services/userService";
import styles from "./UserProfile.module.css";

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [stats, setStats] = useState({
    likesReceived: 0,
    dislikesReceived: 0,
    reviewsCount: 0,
    gamesCreated: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);
  const { user, updateUser } = useAuthContext();
  const { reviewCount } = useReview();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    bio: user?.bio || "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const response = await userService.updateUserProfile(user.id, {
        name: formData.name,
        bio: formData.bio,
      });

      if (response.success) {
        const updatedUser = { ...user, ...response.data };
        updateUser(updatedUser);

        setMessage("Perfil atualizado com sucesso!");
        setIsEditing(false);
      } else {
        setMessage(response.message || "Erro ao atualizar perfil.");
      }
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      setMessage("Erro ao atualizar perfil. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };
  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      bio: user?.bio || "",
    });
    setIsEditing(false);
    setMessage("");
  };

  const loadUserStats = async () => {
    if (!user?.id) return;

    setLoadingStats(true);
    try {
      const response = await userService.getUserStats(user.id);
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error);
    } finally {
      setLoadingStats(false);
    }
  };
  useEffect(() => {
    loadUserStats();
  }, [user?.id, reviewCount]); // Adicionar reviewCount como dependência

  return (
    <div className={styles.userProfile}>
      <div className={styles.profileContainer}>
        {}
        <div className={styles.profileHeader}>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>Meu Perfil</h1>
            <p className={styles.subtitle}>
              Gerencie suas informações pessoais
            </p>
          </div>

          {!isEditing && (
            <button
              className={styles.editButton}
              onClick={() => setIsEditing(true)}
            >
              <span className={styles.editIcon}>✏️</span>
              Editar Perfil
            </button>
          )}
        </div>
        {}
        {message && (
          <div
            className={`${styles.message} ${
              message.includes("sucesso") ? styles.success : styles.error
            }`}
          >
            <span className={styles.messageIcon}>
              {message.includes("sucesso") ? "✅" : "❌"}
            </span>
            {message}
          </div>
        )}{" "}
        {}
        <div className={styles.avatarSection}>
          <div className={styles.avatarContainer}>
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={`Avatar de ${user.name}`}
                className={styles.userAvatar}
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "flex";
                }}
              />
            ) : null}
            <UserIcon
              initial={user?.name?.charAt(0)?.toUpperCase() || "U"}
              size="xlarge"
              className={`${styles.avatarFallback} ${
                user?.avatarUrl ? styles.hidden : ""
              }`}
            />
          </div>

          <div className={styles.avatarInfo}>
            <h2 className={styles.userName}>{user?.name}</h2>
          </div>
        </div>
        {}
        {isEditing ? (
          <form onSubmit={handleSubmit} className={styles.editForm}>
            {" "}
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label htmlFor="name" className={styles.label}>
                  <span className={styles.labelText}>Nome Completo</span>
                  <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className={styles.input}
                  placeholder="Digite seu nome completo"
                />
              </div>

              <div className={styles.formGroupFull}>
                <label htmlFor="bio" className={styles.label}>
                  <span className={styles.labelText}>Biografia</span>
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  className={styles.textarea}
                  placeholder="Conte um pouco sobre você e seus jogos favoritos..."
                  rows="4"
                />
              </div>
            </div>
            <div className={styles.formActions}>
              <button
                type="button"
                onClick={handleCancel}
                className={styles.cancelButton}
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className={styles.saveButton}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className={styles.spinner}></span>
                    Salvando...
                  </>
                ) : (
                  <>
                    <span className={styles.saveIcon}>💾</span>
                    Salvar Alterações
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className={styles.profileContent}>
            {}
            <div className={styles.infoCard}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>
                  <span className={styles.cardIcon}>👤</span>
                  Informações Pessoais
                </h3>
              </div>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Nome:</span>
                  <span className={styles.infoValue}>{user?.name}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Email:</span>
                  <span className={styles.infoValue}>{user?.email}</span>
                </div>
              </div>{" "}
            </div>{" "}
            {}
            <div className={styles.bioCard}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>
                  <span className={styles.cardIcon}>📝</span>
                  Biografia
                </h3>
              </div>
              <div className={styles.bioContent}>
                {user?.bio ? (
                  <p className={styles.bioText}>{user.bio}</p>
                ) : (
                  <p className={styles.bioTextEmpty}>
                    Nenhuma biografia adicionada ainda. Clique em "Editar
                    Perfil" para adicionar uma.
                  </p>
                )}
              </div>
            </div>
            {}
            <div className={styles.statsCard}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>
                  <span className={styles.cardIcon}>📊</span>
                  Estatísticas
                </h3>
              </div>

              {loadingStats ? (
                <div className={styles.statsLoading}>
                  <div className={styles.spinner}></div>
                  <p>Carregando estatísticas...</p>
                </div>
              ) : (
                <div className={styles.statsGrid}>
                  <div className={styles.statItem}>
                    <div className={styles.statNumber}>
                      {stats.likesReceived}
                    </div>
                    <div className={styles.statLabel}>Likes Recebidos</div>
                    <div className={styles.statIcon}>👍</div>
                  </div>
                  <div className={styles.statItem}>
                    <div className={styles.statNumber}>
                      {stats.dislikesReceived}
                    </div>
                    <div className={styles.statLabel}>Deslikes Recebidos</div>
                    <div className={styles.statIcon}>👎</div>
                  </div>
                  <div className={styles.statItem}>
                    <div className={styles.statNumber}>
                      {stats.reviewsCount}
                    </div>
                    <div className={styles.statLabel}>Reviews</div>
                    <div className={styles.statIcon}>📝</div>
                  </div>
                  <div className={styles.statItem}>
                    <div className={styles.statNumber}>
                      {stats.gamesCreated}
                    </div>
                    <div className={styles.statLabel}>Jogos Criados</div>
                    <div className={styles.statIcon}>🎮</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
