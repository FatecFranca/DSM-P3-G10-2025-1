import React, { useState } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import UserIcon from './UserIcon';
import styles from './UserProfile.module.css';

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { user, updateUser } = useAuthContext();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    avatarUrl: user?.avatarUrl || ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // Simular atualização (substitua pela chamada real da API)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedUser = { ...user, ...formData };
      updateUser(updatedUser);
      
      setMessage('Perfil atualizado com sucesso!');
      setIsEditing(false);
    } catch (error) {
      setMessage('Erro ao atualizar perfil. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      bio: user?.bio || '',
      avatarUrl: user?.avatarUrl || ''
    });
    setIsEditing(false);
    setMessage('');
  };

  return (
    <div className={styles.userProfile}>
      <div className={styles.profileContainer}>
        {/* Header */}
        <div className={styles.profileHeader}>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>Meu Perfil</h1>
            <p className={styles.subtitle}>Gerencie suas informações pessoais</p>
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

        {/* Mensagem de feedback */}
        {message && (
          <div className={`${styles.message} ${message.includes('sucesso') ? styles.success : styles.error}`}>
            <span className={styles.messageIcon}>
              {message.includes('sucesso') ? '✅' : '❌'}
            </span>
            {message}
          </div>
        )}

        {/* Avatar Section */}
        <div className={styles.avatarSection}>
          <div className={styles.avatarContainer}>
            {user?.avatarUrl ? (
              <img 
                src={user.avatarUrl} 
                alt={`Avatar de ${user.name}`}
                className={styles.userAvatar}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <UserIcon 
              initial={user?.name?.charAt(0)?.toUpperCase() || 'U'} 
              size="xlarge"
              className={`${styles.avatarFallback} ${user?.avatarUrl ? styles.hidden : ''}`}
            />
          </div>
          
          <div className={styles.avatarInfo}>
            <h2 className={styles.userName}>{user?.name}</h2>
            <p className={styles.userEmail}>{user?.email}</p>
            <div className={styles.memberSince}>
              Membro desde {new Date(user?.createdAt).getFullYear()}
            </div>
          </div>
        </div>

        {/* Conteúdo Principal */}
        {isEditing ? (
          <form onSubmit={handleSubmit} className={styles.editForm}>
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

              <div className={styles.formGroup}>
                <label htmlFor="avatarUrl" className={styles.label}>
                  <span className={styles.labelText}>URL do Avatar</span>
                </label>
                <input
                  type="url"
                  id="avatarUrl"
                  name="avatarUrl"
                  value={formData.avatarUrl}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="https://exemplo.com/sua-foto.jpg"
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
            {/* Informações Pessoais */}
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
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Username:</span>
                  <span className={styles.infoValue}>{user?.username || 'Não definido'}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Membro desde:</span>
                  <span className={styles.infoValue}>
                    {new Date(user?.createdAt).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </div>
            </div>

            {/* Biografia */}
            {user?.bio && (
              <div className={styles.infoCard}>
                <div className={styles.cardHeader}>
                  <h3 className={styles.cardTitle}>
                    <span className={styles.cardIcon}>📝</span>
                    Biografia
                  </h3>
                </div>
                <p className={styles.bioText}>{user.bio}</p>
              </div>
            )}

            {/* Estatísticas */}
            <div className={styles.statsCard}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>
                  <span className={styles.cardIcon}>📊</span>
                  Estatísticas
                </h3>
              </div>
              
              <div className={styles.statsGrid}>
                <div className={styles.statItem}>
                  <div className={styles.statNumber}>12</div>
                  <div className={styles.statLabel}>Reviews Publicadas</div>
                  <div className={styles.statIcon}>📝</div>
                </div>
                <div className={styles.statItem}>
                  <div className={styles.statNumber}>8</div>
                  <div className={styles.statLabel}>Jogos Favoritos</div>
                  <div className={styles.statIcon}>❤️</div>
                </div>
                <div className={styles.statItem}>
                  <div className={styles.statNumber}>4.2</div>
                  <div className={styles.statLabel}>Nota Média</div>
                  <div className={styles.statIcon}>⭐</div>
                </div>
                <div className={styles.statItem}>
                  <div className={styles.statNumber}>156</div>
                  <div className={styles.statLabel}>Curtidas Recebidas</div>
                  <div className={styles.statIcon}>👍</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;