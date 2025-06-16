import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import styles from './UserAccount.module.css';

const UserAccount = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, updateUser } = useContext(AuthContext);
  
  // Estados para os dados do perfil
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  
  // Estados para controle de UI
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Dados simulados de reviews do usuário
  const [userReviews, setUserReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  
  // Redirecionar para login se não estiver autenticado
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/conta' } });
    } else {
      // Preencher os campos com dados do usuário se estiver autenticado
      if (user) {
        setName(user.name || '');
        setEmail(user.email || '');
        setUsername(user.username || '');
        setBio(user.bio || '');
        setAvatarUrl(user.avatarUrl || '');
      }
      
      // Buscar reviews do usuário
      fetchUserReviews();
    }
  }, [isAuthenticated, navigate, user]);
  
  // Função para buscar reviews do usuário
  const fetchUserReviews = () => {
    if (!user) return;
    
    setLoadingReviews(true);
    
    // Simulação de busca de dados
    setTimeout(() => {
      const mockReviews = [
        {
          id: '1',
          title: 'Uma obra-prima do gênero',
          gameTitle: 'The Last of Us Part II',
          rating: 5,
          date: '2025-06-01',
          likes: 124
        },
        {
          id: '2',
          title: 'Experiência épica e memorável',
          gameTitle: 'God of War Ragnarök',
          rating: 4,
          date: '2025-05-15',
          likes: 87
        },
        {
          id: '3',
          title: 'Gráficos incríveis mas história fraca',
          gameTitle: 'Horizon Forbidden West',
          rating: 3,
          date: '2025-04-10',
          likes: 42
        }
      ];
      
      setUserReviews(mockReviews);
      setLoadingReviews(false);
    }, 800);
  };
  
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    
    // Resetar valores para os valores originais ao cancelar edição
    if (isEditing && user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setUsername(user.username || '');
      setBio(user.bio || '');
      setAvatarUrl(user.avatarUrl || '');
    }
    
    // Limpar mensagens
    setError(null);
    setSuccess(null);
  };
  
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      // Simulação de atualização de perfil
      setTimeout(() => {
        // Em um app real, você faria uma requisição para o backend
        // await api.updateUserProfile({ name, username, bio, avatarUrl });
        
        setSuccess('Perfil atualizado com sucesso!');
        setIsEditing(false);
        setLoading(false);
        
        // Atualizar o estado global do usuário (simulado)
        // Em um app real, você chamaria uma função do contexto para atualizar o usuário
        // updateUser({ ...user, name, username, bio, avatarUrl });
        
      }, 1500);
      
    } catch (err) {
      console.error('Erro ao atualizar perfil:', err);
      setError('Não foi possível atualizar o perfil. Tente novamente.');
      setLoading(false);
    }
  };
  
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    // Validações
    if (newPassword.length < 6) {
      setError('A nova senha deve ter pelo menos 6 caracteres');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError('As senhas não conferem');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Simulação de atualização de senha
      setTimeout(() => {
        // Em um app real, você faria uma requisição para o backend
        // await api.updatePassword({ currentPassword, newPassword });
        
        setSuccess('Senha atualizada com sucesso!');
        setNewPassword('');
        setConfirmPassword('');
        setCurrentPassword('');
        setLoading(false);
        
      }, 1500);
      
    } catch (err) {
      console.error('Erro ao atualizar senha:', err);
      setError('Não foi possível atualizar a senha. Verifique se a senha atual está correta.');
      setLoading(false);
    }
  };
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <div className={styles.userInfo}>
          <div className={styles.avatar}>
            <img 
              src={avatarUrl || 'https://via.placeholder.com/150?text=Usuário'} 
              alt={name}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/150?text=Usuário';
              }}
            />
          </div>
          <div className={styles.userName}>{name}</div>
          <div className={styles.userUsername}>@{username}</div>
        </div>
        
        <nav className={styles.sidebarNav}>
          <button 
            className={`${styles.navButton} ${activeTab === 'profile' ? styles.active : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            Perfil
          </button>
          <button 
            className={`${styles.navButton} ${activeTab === 'security' ? styles.active : ''}`}
            onClick={() => setActiveTab('security')}
          >
            Segurança
          </button>
          <button 
            className={`${styles.navButton} ${activeTab === 'reviews' ? styles.active : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            Minhas Reviews
          </button>
          <button 
            className={`${styles.navButton} ${styles.logoutButton}`}
            onClick={handleLogout}
          >
            Sair da Conta
          </button>
        </nav>
      </div>
      
      <div className={styles.content}>
        {error && (
          <div className={styles.messageError}>
            {error}
          </div>
        )}
        
        {success && (
          <div className={styles.messageSuccess}>
            {success}
          </div>
        )}
        
        {/* Aba de Perfil */}
        {activeTab === 'profile' && (
          <div className={styles.tabContent}>
            <div className={styles.tabHeader}>
              <h2>Meu Perfil</h2>
              <button 
                onClick={handleEditToggle}
                className={isEditing ? styles.cancelButton : styles.editButton}
              >
                {isEditing ? 'Cancelar' : 'Editar Perfil'}
              </button>
            </div>
            
            <form className={styles.profileForm} onSubmit={handleProfileSubmit}>
              <div className={styles.formGroup}>
                <label>Nome</label>
                {isEditing ? (
                  <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    disabled={loading}
                    required
                  />
                ) : (
                  <p className={styles.fieldValue}>{name}</p>
                )}
              </div>
              
              <div className={styles.formGroup}>
                <label>Email</label>
                <p className={styles.fieldValue}>{email}</p>
                <small className={styles.fieldNote}>
                  O email não pode ser alterado diretamente.
                </small>
              </div>
              
              <div className={styles.formGroup}>
                <label>Nome de usuário</label>
                {isEditing ? (
                  <input 
                    type="text" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    disabled={loading}
                    required
                  />
                ) : (
                  <p className={styles.fieldValue}>@{username}</p>
                )}
              </div>
              
              <div className={styles.formGroup}>
                <label>Bio</label>
                {isEditing ? (
                  <textarea 
                    value={bio} 
                    onChange={(e) => setBio(e.target.value)} 
                    rows={4}
                    disabled={loading}
                    placeholder="Conte um pouco sobre você..."
                  />
                ) : (
                  <p className={styles.fieldValue}>
                    {bio || <span className={styles.emptyField}>Sem biografia</span>}
                  </p>
                )}
              </div>
              
              <div className={styles.formGroup}>
                <label>URL da foto de perfil</label>
                {isEditing ? (
                  <input 
                    type="url" 
                    value={avatarUrl} 
                    onChange={(e) => setAvatarUrl(e.target.value)} 
                    disabled={loading}
                    placeholder="http://exemplo.com/sua-foto.jpg"
                  />
                ) : (
                  <p className={styles.fieldValue}>
                    {avatarUrl || <span className={styles.emptyField}>Sem foto personalizada</span>}
                  </p>
                )}
              </div>
              
              {isEditing && (
                <div className={styles.formActions}>
                  <button 
                    type="submit" 
                    className={styles.saveButton}
                    disabled={loading}
                  >
                    {loading ? 'Salvando...' : 'Salvar Alterações'}
                  </button>
                </div>
              )}
            </form>
          </div>
        )}
        
        {/* Aba de Segurança */}
        {activeTab === 'security' && (
          <div className={styles.tabContent}>
            <div className={styles.tabHeader}>
              <h2>Segurança</h2>
            </div>
            
            <div className={styles.securitySection}>
              <h3>Alterar Senha</h3>
              
              <form className={styles.passwordForm} onSubmit={handlePasswordSubmit}>
                <div className={styles.formGroup}>
                  <label htmlFor="currentPassword">Senha Atual</label>
                  <input 
                    type="password" 
                    id="currentPassword"
                    value={currentPassword} 
                    onChange={(e) => setCurrentPassword(e.target.value)} 
                    required
                    disabled={loading}
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="newPassword">Nova Senha</label>
                  <input 
                    type="password" 
                    id="newPassword"
                    value={newPassword} 
                    onChange={(e) => setNewPassword(e.target.value)} 
                    required
                    disabled={loading}
                    minLength={6}
                    placeholder="Mínimo de 6 caracteres"
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="confirmPassword">Confirmar Nova Senha</label>
                  <input 
                    type="password" 
                    id="confirmPassword"
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    required
                    disabled={loading}
                  />
                </div>
                
                <div className={styles.formActions}>
                  <button 
                    type="submit" 
                    className={styles.saveButton}
                    disabled={loading}
                  >
                    {loading ? 'Atualizando...' : 'Atualizar Senha'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        
        {/* Aba de Reviews */}
        {activeTab === 'reviews' && (
          <div className={styles.tabContent}>
            <div className={styles.tabHeader}>
              <h2>Minhas Reviews</h2>
              <button 
                onClick={() => navigate('/criar/review')}
                className={styles.addButton}
              >
                Nova Review
              </button>
            </div>
            
            {loadingReviews ? (
              <div className={styles.loading}>
                <div className={styles.spinner}></div>
                <p>Carregando suas reviews...</p>
              </div>
            ) : userReviews.length > 0 ? (
              <div className={styles.reviewsList}>
                {userReviews.map(review => (
                  <div key={review.id} className={styles.reviewCard}>
                    <div className={styles.reviewHeader}>
                      <h3>{review.title}</h3>
                      <div className={styles.gameTitle}>{review.gameTitle}</div>
                    </div>
                    
                    <div className={styles.reviewStats}>
                      <div className={styles.rating}>
                        {Array(5).fill().map((_, i) => (
                          <span 
                            key={i} 
                            className={i < review.rating ? styles.starFilled : styles.starEmpty}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      
                      <div className={styles.reviewMeta}>
                        <span className={styles.reviewDate}>{new Date(review.date).toLocaleDateString('pt-BR')}</span>
                        <span className={styles.reviewLikes}>{review.likes} curtidas</span>
                      </div>
                    </div>
                    
                    <div className={styles.reviewActions}>
                      <button 
                        onClick={() => navigate(`/review/${review.id}`)}
                        className={styles.viewButton}
                      >
                        Ver Review
                      </button>
                      <button 
                        onClick={() => navigate(`/editar/review/${review.id}`)}
                        className={styles.editReviewButton}
                      >
                        Editar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <p>Você ainda não publicou nenhuma review.</p>
                <button 
                  onClick={() => navigate('/criar/review')}
                  className={styles.createButton}
                >
                  Criar Primeira Review
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserAccount;