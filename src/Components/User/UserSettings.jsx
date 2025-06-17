import React, { useState } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import styles from './UserSettings.module.css';

const UserSettings = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [activeSection, setActiveSection] = useState('account');
  const { user, updateUser } = useAuthContext();
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    reviewNotifications: true,
    gameRecommendations: false,
    darkMode: false
  });

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePreferenceChange = (key) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage('As senhas não coincidem');
      setLoading(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage('A nova senha deve ter pelo menos 6 caracteres');
      setLoading(false);
      return;
    }

    try {
      // Simular atualização (substitua pela chamada real da API)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMessage('Senha alterada com sucesso!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      setMessage('Erro ao alterar senha. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.')) {
      if (window.confirm('Última confirmação: Sua conta e todos os dados serão permanentemente excluídos.')) {
        alert('Funcionalidade de exclusão de conta será implementada em breve.');
      }
    }
  };

  const sections = [
    { id: 'account', label: 'Conta', icon: '👤' },
    { id: 'security', label: 'Segurança', icon: '🔒' },
    { id: 'notifications', label: 'Notificações', icon: '🔔' },
    { id: 'privacy', label: 'Privacidade', icon: '🛡️' }
  ];

  return (
    <div className={styles.userSettings}>
      <div className={styles.settingsContainer}>
        <div className={styles.settingsHeader}>
          <h1 className={styles.title}>Configurações</h1>
          <p className={styles.subtitle}>Gerencie suas preferências e configurações de conta</p>
        </div>

        <div className={styles.settingsLayout}>
          {/* Menu lateral */}
          <nav className={styles.settingsNav}>
            {sections.map(section => (
              <button
                key={section.id}
                className={`${styles.navButton} ${activeSection === section.id ? styles.active : ''}`}
                onClick={() => setActiveSection(section.id)}
              >
                <span className={styles.navIcon}>{section.icon}</span>
                <span className={styles.navLabel}>{section.label}</span>
              </button>
            ))}
          </nav>

          {/* Conteúdo das configurações */}
          <div className={styles.settingsContent}>
            {message && (
              <div className={`${styles.message} ${message.includes('sucesso') ? styles.success : styles.error}`}>
                <span className={styles.messageIcon}>
                  {message.includes('sucesso') ? '✅' : '❌'}
                </span>
                {message}
              </div>
            )}

            {/* Seção Conta */}
            {activeSection === 'account' && (
              <div className={styles.section}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>
                    <span className={styles.sectionIcon}>👤</span>
                    Informações da Conta
                  </h2>
                </div>

                <div className={styles.infoGrid}>
                  <div className={styles.infoItem}>
                    <label className={styles.infoLabel}>Nome</label>
                    <div className={styles.infoValue}>{user?.name}</div>
                    <p className={styles.infoNote}>Para alterar seu nome, acesse a seção de perfil</p>
                  </div>

                  <div className={styles.infoItem}>
                    <label className={styles.infoLabel}>Email</label>
                    <div className={styles.infoValue}>{user?.email}</div>
                    <p className={styles.infoNote}>Email usado para login e notificações</p>
                  </div>

                  <div className={styles.infoItem}>
                    <label className={styles.infoLabel}>Membro desde</label>
                    <div className={styles.infoValue}>
                      {new Date(user?.createdAt).toLocaleDateString('pt-BR')}
                    </div>
                  </div>

                  <div className={styles.infoItem}>
                    <label className={styles.infoLabel}>Status da conta</label>
                    <div className={styles.accountStatus}>
                      <span className={styles.statusActive}>Ativa</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Seção Segurança */}
            {activeSection === 'security' && (
              <div className={styles.section}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>
                    <span className={styles.sectionIcon}>🔒</span>
                    Segurança
                  </h2>
                </div>

                <form onSubmit={handlePasswordSubmit} className={styles.passwordForm}>
                  <h3 className={styles.formTitle}>Alterar Senha</h3>
                  
                  <div className={styles.formGroup}>
                    <label htmlFor="currentPassword" className={styles.label}>
                      Senha atual
                    </label>
                    <input
                      type="password"
                      id="currentPassword"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className={styles.input}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="newPassword" className={styles.label}>
                      Nova senha
                    </label>
                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className={styles.input}
                      minLength="6"
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="confirmPassword" className={styles.label}>
                      Confirmar nova senha
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className={styles.input}
                      minLength="6"
                      required
                    />
                  </div>

                  <button 
                    type="submit" 
                    className={styles.primaryButton}
                    disabled={loading}
                  >
                    {loading ? 'Alterando...' : 'Alterar Senha'}
                  </button>
                </form>
              </div>
            )}

            {/* Seção Notificações */}
            {activeSection === 'notifications' && (
              <div className={styles.section}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>
                    <span className={styles.sectionIcon}>🔔</span>
                    Notificações
                  </h2>
                </div>

                <div className={styles.preferencesGrid}>
                  <div className={styles.preferenceItem}>
                    <div className={styles.preferenceInfo}>
                      <h4 className={styles.preferenceTitle}>Notificações por email</h4>
                      <p className={styles.preferenceDesc}>Receba atualizações importantes por email</p>
                    </div>
                    <label className={styles.toggle}>
                      <input
                        type="checkbox"
                        checked={preferences.emailNotifications}
                        onChange={() => handlePreferenceChange('emailNotifications')}
                      />
                      <span className={styles.toggleSlider}></span>
                    </label>
                  </div>

                  <div className={styles.preferenceItem}>
                    <div className={styles.preferenceInfo}>
                      <h4 className={styles.preferenceTitle}>Notificações de reviews</h4>
                      <p className={styles.preferenceDesc}>Seja notificado quando alguém comentar em suas reviews</p>
                    </div>
                    <label className={styles.toggle}>
                      <input
                        type="checkbox"
                        checked={preferences.reviewNotifications}
                        onChange={() => handlePreferenceChange('reviewNotifications')}
                      />
                      <span className={styles.toggleSlider}></span>
                    </label>
                  </div>

                  <div className={styles.preferenceItem}>
                    <div className={styles.preferenceInfo}>
                      <h4 className={styles.preferenceTitle}>Recomendações de jogos</h4>
                      <p className={styles.preferenceDesc}>Receba sugestões personalizadas de jogos</p>
                    </div>
                    <label className={styles.toggle}>
                      <input
                        type="checkbox"
                        checked={preferences.gameRecommendations}
                        onChange={() => handlePreferenceChange('gameRecommendations')}
                      />
                      <span className={styles.toggleSlider}></span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Seção Privacidade */}
            {activeSection === 'privacy' && (
              <div className={styles.section}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>
                    <span className={styles.sectionIcon}>🛡️</span>
                    Privacidade e Dados
                  </h2>
                </div>

                <div className={styles.privacyOptions}>
                  <div className={styles.privacyItem}>
                    <h4>Exportar meus dados</h4>
                    <p>Baixe uma cópia de todos os seus dados</p>
                    <button className={styles.secondaryButton}>
                      📥 Exportar dados
                    </button>
                  </div>

                  <div className={styles.privacyItem}>
                    <h4>Limpar histórico</h4>
                    <p>Remova seu histórico de navegação no site</p>
                    <button className={styles.secondaryButton}>
                      🗑️ Limpar histórico
                    </button>
                  </div>
                </div>

                <div className={styles.dangerZone}>
                  <h3 className={styles.dangerTitle}>🚨 Zona de Perigo</h3>
                  <div className={styles.dangerItem}>
                    <div>
                      <h4>Excluir conta</h4>
                      <p>Exclua permanentemente sua conta e todos os dados associados</p>
                    </div>
                    <button 
                      onClick={handleDeleteAccount}
                      className={styles.dangerButton}
                    >
                      Excluir conta
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSettings;