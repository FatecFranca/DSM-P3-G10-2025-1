import React, { useState } from "react";
import { useAuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import userService from "../../services/userService";
import styles from "./UserSettings.module.css";

const UserSettings = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [activeSection, setActiveSection] = useState("account");
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage("As senhas não coincidem");
      setLoading(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage("A nova senha deve ter pelo menos 6 caracteres");
      setLoading(false);
      return;
    }

    try {
      // Simular atualização (substitua pela chamada real da API)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setMessage("Senha alterada com sucesso!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      setMessage("Erro ao alterar senha. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };
  const handleDeleteAccount = async () => {
    if (!user?.id) {
      setMessage("Erro: Usuário não identificado");
      return;
    }

    const firstConfirm = window.confirm(
      "Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.\n\n" +
        "Ao excluir sua conta, você perderá:\n" +
        "• Todos os seus favoritos\n" +
        "• Todas as suas avaliações\n" +
        "• Todo o histórico de atividades\n" +
        "• Todos os dados da conta"
    );

    if (!firstConfirm) return;

    const secondConfirm = window.confirm(
      "ÚLTIMA CONFIRMAÇÃO!\n\n" +
        "Sua conta e todos os dados serão permanentemente excluídos.\n" +
        "Esta ação NÃO PODE ser desfeita.\n\n" +
        "Deseja realmente continuar?"
    );

    if (!secondConfirm) return;

    setLoading(true);
    setMessage("");

    try {
      const result = await userService.deleteUser(user.id);

      if (result.success) {
        alert(
          "Conta excluída com sucesso. Você será redirecionado para a página inicial."
        );
        logout(); // Fazer logout do usuário
        navigate("/"); // Redirecionar para a página inicial
      } else {
        setMessage(`Erro ao excluir conta: ${result.message}`);
      }
    } catch (error) {
      console.error("Erro ao excluir conta:", error);
      setMessage("Erro inesperado ao excluir conta. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };
  const sections = [
    { id: "account", label: "Perfil", icon: "👤" },
    { id: "security", label: "Segurança", icon: "🔒" },
  ];

  return (
    <div className={styles.userSettings}>
      <div className={styles.settingsContainer}>
        <div className={styles.settingsHeader}>
          <h1 className={styles.title}>Configurações</h1>
          <p className={styles.subtitle}>
            Gerencie suas preferências e configurações de conta
          </p>
        </div>

        <div className={styles.settingsLayout}>
          {}
          <nav className={styles.settingsNav}>
            {sections.map((section) => (
              <button
                key={section.id}
                className={`${styles.navButton} ${
                  activeSection === section.id ? styles.active : ""
                }`}
                onClick={() => setActiveSection(section.id)}
              >
                <span className={styles.navIcon}>{section.icon}</span>
                <span className={styles.navLabel}>{section.label}</span>
              </button>
            ))}
          </nav>

          {}
          <div className={styles.settingsContent}>
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
            {activeSection === "account" && (
              <div className={styles.section}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>
                    <span className={styles.sectionIcon}>👤</span>
                    Informações do Perfil
                  </h2>
                </div>

                <div className={styles.infoGrid}>
                  <div className={styles.infoItem}>
                    <label className={styles.infoLabel}>Nome</label>
                    <div className={styles.infoValue}>
                      {user?.name || "Não informado"}
                    </div>
                  </div>

                  <div className={styles.infoItem}>
                    <label className={styles.infoLabel}>Email</label>
                    <div className={styles.infoValue}>
                      {user?.email || "Não informado"}
                    </div>
                  </div>

                  <div className={styles.infoItem}>
                    <label className={styles.infoLabel}>Membro desde</label>
                    <div className={styles.infoValue}>
                      {user?.createdAt
                        ? new Date(user.createdAt).toLocaleDateString("pt-BR")
                        : "Não informado"}
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
            )}{" "}
            {}
            {activeSection === "security" && (
              <div className={styles.section}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>
                    <span className={styles.sectionIcon}>🔒</span>
                    Segurança da Conta
                  </h2>
                </div>

                {}
                <form
                  onSubmit={handlePasswordSubmit}
                  className={styles.passwordForm}
                >
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
                      placeholder="Digite sua senha atual"
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
                      placeholder="Digite sua nova senha"
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
                      placeholder="Confirme sua nova senha"
                      minLength="6"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className={styles.primaryButton}
                    disabled={loading}
                  >
                    {loading ? "Alterando..." : "Alterar Senha"}
                  </button>
                </form>

                {}
                <div className={styles.dangerZone}>
                  <h3 className={styles.dangerTitle}>🚨 Zona de Perigo</h3>
                  <div className={styles.dangerItem}>
                    <div>
                      <h4>Excluir conta</h4>
                      <p>
                        Exclua permanentemente sua conta e todos os dados
                        associados. Esta ação não pode ser desfeita.
                      </p>
                    </div>{" "}
                    <button
                      onClick={handleDeleteAccount}
                      className={styles.dangerButton}
                      disabled={loading}
                    >
                      {loading ? "Excluindo..." : "Excluir conta"}
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
