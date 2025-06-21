import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Input from "../Form/Input";
import Button from "../Form/Button";
import Error from "../Helper/Error";
import styles from "./FormCadastro.module.css";

// URL base da sua API
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

// Função utilitária para fazer requests
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, config);
  const data = await response.json();

  if (!response.ok) {
    throw {
      status: response.status,
      message: data.message || data.error || "Erro na requisição",
      data: data,
    };
  }

  return data;
};

// Componente para mostrar força da senha
const PasswordStrength = ({ password }) => {
  const getStrength = (pass) => {
    if (!pass) return 0;
    let strength = 0;
    if (pass.length >= 6) strength += 1;
    if (pass.length >= 10) strength += 1;
    if (/[A-Z]/.test(pass)) strength += 1;
    if (/[0-9]/.test(pass)) strength += 1;
    if (/[^A-Za-z0-9]/.test(pass)) strength += 1;
    return strength;
  };

  const strength = getStrength(password);
  const strengthText = [
    "",
    "Fraca",
    "Razoável",
    "Média",
    "Forte",
    "Muito forte",
  ];
  const strengthColors = [
    "#e5e7eb",
    "#ef4444",
    "#f59e0b",
    "#eab308",
    "#22c55e",
    "#16a34a",
  ];

  return (
    <div className={styles.passwordStrength}>
      <div className={styles.strengthBar}>
        {[1, 2, 3, 4, 5].map((index) => (
          <div
            key={index}
            className={`${styles.strengthSegment} ${
              index <= strength ? styles.active : ""
            }`}
            style={{
              backgroundColor: strengthColors[index <= strength ? strength : 0],
            }}
          />
        ))}
      </div>
      {password && (
        <span
          className={styles.strengthText}
          style={{ color: strengthColors[strength] }}
        >
          {strengthText[strength]}
        </span>
      )}
    </div>
  );
};

const FormCadastro = () => {
  // Estados para campos obrigatórios
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Estados para campos opcionais
  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  // Estados para validação
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Estados para controle do formulário
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [backendStatus, setBackendStatus] = useState(null);

  const navigate = useNavigate();

  // Teste de conexão com o backend
  const testBackendConnection = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/`);
      const data = await response.json();

      if (response.ok && data.status === "Online") {
        setBackendStatus("✅ Backend conectado com sucesso!");
        setSuccess(`🎮 ${data.message} - Versão ${data.version}`);
      } else {
        setBackendStatus("❌ Backend retornou status inválido");
      }
    } catch (err) {
      setBackendStatus("❌ Não foi possível conectar ao backend");
      console.error("Erro de conexão:", err);
    } finally {
      setLoading(false);
    }
  };

  // Verificar se email já existe
  const checkEmailExists = async (email) => {
    try {
      const users = await apiRequest("/api/users");
      return users.some(
        (user) => user.email.toLowerCase() === email.toLowerCase()
      );
    } catch (err) {
      console.warn("Não foi possível verificar email duplicado:", err);
      return false; // Em caso de erro, permite continuar
    }
  };

  // Verificar se username já existe
  const checkUsernameExists = async (username) => {
    try {
      const users = await apiRequest("/api/users");
      return users.some(
        (user) =>
          user.username &&
          user.username.toLowerCase() === username.toLowerCase()
      );
    } catch (err) {
      console.warn("Não foi possível verificar username duplicado:", err);
      return false; // Em caso de erro, permite continuar
    }
  };

  // Validação em tempo real
  const validateField = async (field, value) => {
    const newErrors = { ...errors };

    switch (field) {
      case "name":
        if (!value.trim()) {
          newErrors.name = "Nome é obrigatório";
        } else if (value.trim().length < 2) {
          newErrors.name = "Nome deve ter pelo menos 2 caracteres";
        } else if (value.trim().length > 100) {
          newErrors.name = "Nome deve ter no máximo 100 caracteres";
        } else {
          delete newErrors.name;
        }
        break;

      case "email":
        if (!value.trim()) {
          newErrors.email = "Email é obrigatório";
        } else {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            newErrors.email = "Email inválido";
          } else {
            // Verificar se email já existe (apenas se válido)
            const emailExists = await checkEmailExists(value);
            if (emailExists) {
              newErrors.email = "Este email já está cadastrado";
            } else {
              delete newErrors.email;
            }
          }
        }
        break;

      case "username":
        if (value.trim()) {
          if (value.length < 3) {
            newErrors.username =
              "Nome de usuário deve ter pelo menos 3 caracteres";
          } else if (value.length > 50) {
            newErrors.username =
              "Nome de usuário deve ter no máximo 50 caracteres";
          } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
            newErrors.username = "Use apenas letras, números e underscore";
          } else {
            // Verificar se username já existe
            const usernameExists = await checkUsernameExists(value);
            if (usernameExists) {
              newErrors.username = "Este nome de usuário já está em uso";
            } else {
              delete newErrors.username;
            }
          }
        } else {
          delete newErrors.username;
        }
        break;

      case "password":
        if (!value) {
          newErrors.password = "Senha é obrigatória";
        } else if (value.length < 6) {
          newErrors.password = "A senha deve ter pelo menos 6 caracteres";
        } else if (value.length > 128) {
          newErrors.password = "A senha deve ter no máximo 128 caracteres";
        } else {
          delete newErrors.password;
        }

        // Revalidar confirmação se já foi preenchida
        if (confirmPassword && value !== confirmPassword) {
          newErrors.confirmPassword = "As senhas não conferem";
        } else if (confirmPassword && value === confirmPassword) {
          delete newErrors.confirmPassword;
        }
        break;

      case "confirmPassword":
        if (value !== password) {
          newErrors.confirmPassword = "As senhas não conferem";
        } else {
          delete newErrors.confirmPassword;
        }
        break;

      case "avatarUrl":
        if (value.trim()) {
          try {
            new URL(value);
            const validExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
            const hasValidExtension = validExtensions.some((ext) =>
              value.toLowerCase().includes(ext)
            );
            if (!hasValidExtension) {
              newErrors.avatarUrl =
                "URL deve apontar para uma imagem (jpg, png, gif, webp)";
            } else {
              delete newErrors.avatarUrl;
            }
          } catch {
            newErrors.avatarUrl = "URL inválida";
          }
        } else {
          delete newErrors.avatarUrl;
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
  };

  // Handlers para mudança nos campos
  const handleFieldChange = (field, value) => {
    switch (field) {
      case "name":
        setName(value);
        break;
      case "email":
        setEmail(value.toLowerCase().trim());
        break;
      case "username":
        setUsername(value.toLowerCase().replace(/[^a-z0-9_]/g, ""));
        break;
      case "password":
        setPassword(value);
        break;
      case "confirmPassword":
        setConfirmPassword(value);
        break;
      case "avatarUrl":
        setAvatarUrl(value.trim());
        break;
      default:
        break;
    }

    // Validar campo após delay (debounce)
    if (touched[field]) {
      setTimeout(() => validateField(field, value), 500);
    }
  };

  // Marcar campo como tocado
  const handleBlur = async (field, value) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    await validateField(field, value);
  };

  // Validar step 1
  const validateStep1 = () => {
    const requiredFields = ["name", "email"];
    const optionalFields = ["username"];

    let isValid = true;

    // Marcar campos obrigatórios como tocados
    requiredFields.forEach((field) => {
      setTouched((prev) => ({ ...prev, [field]: true }));
    });

    // Verificar se há erros nos campos obrigatórios
    requiredFields.forEach((field) => {
      if (errors[field] || !eval(field).trim()) {
        isValid = false;
      }
    });

    // Verificar erros em campos opcionais preenchidos
    optionalFields.forEach((field) => {
      if (eval(field).trim() && errors[field]) {
        isValid = false;
      }
    });

    return isValid;
  };

  // Validar step 2
  const validateStep2 = () => {
    const requiredFields = ["password", "confirmPassword"];
    const optionalFields = ["avatarUrl"];

    let isValid = true;

    // Marcar campos como tocados
    requiredFields.forEach((field) => {
      setTouched((prev) => ({ ...prev, [field]: true }));
    });

    // Verificar campos obrigatórios
    if (!password || !confirmPassword || password !== confirmPassword) {
      isValid = false;
    }

    // Verificar se há erros
    requiredFields.forEach((field) => {
      if (errors[field]) {
        isValid = false;
      }
    });

    // Verificar campos opcionais
    optionalFields.forEach((field) => {
      if (eval(field).trim() && errors[field]) {
        isValid = false;
      }
    });

    // Verificar termos
    if (!acceptTerms) {
      setError("Você deve aceitar os termos de uso para continuar");
      isValid = false;
    }

    return isValid;
  };

  // Avançar para próxima etapa
  const nextStep = async (e) => {
    e.preventDefault();

    // Validar todos os campos do step 1
    await Promise.all(
      [
        validateField("name", name),
        validateField("email", email),
        username && validateField("username", username),
      ].filter(Boolean)
    );

    if (validateStep1()) {
      setStep(2);
      setError(null);
    } else {
      setError("Por favor, corrija os erros antes de continuar");
    }
  };

  // Voltar para etapa anterior
  const prevStep = () => {
    setStep(1);
    setError(null);
  };

  // Submeter formulário
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validar todos os campos
    await Promise.all(
      [
        validateField("password", password),
        validateField("confirmPassword", confirmPassword),
        avatarUrl && validateField("avatarUrl", avatarUrl),
      ].filter(Boolean)
    );

    if (!validateStep2()) {
      setError("Por favor, corrija os erros antes de continuar");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Preparar dados para envio
      const userData = {
        name: name.trim(),
        email: email.trim(),
        password: password,
        // Campos opcionais
        ...(username && { username: username.trim() }),
        ...(avatarUrl && { avatarUrl: avatarUrl.trim() }),
      };

      console.log("Enviando dados para /api/users:", {
        ...userData,
        password: "[OCULTA]",
      });

      // Enviar para sua API
      const result = await apiRequest("/api/users", {
        method: "POST",
        body: JSON.stringify(userData),
      });

      console.log("Usuário criado com sucesso:", result);

      // Sucesso
      setSuccess("Cadastro realizado com sucesso! 🎉 Redirecionando...");

      // Limpar formulário
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setUsername("");
      setAvatarUrl("");
      setAcceptTerms(false);
      setErrors({});
      setTouched({});

      // Redirecionar após 2 segundos
      setTimeout(() => {
        navigate("/login", {
          state: {
            message: "Cadastro realizado! Agora você pode fazer login.",
            email: userData.email,
          },
        });
      }, 2000);
    } catch (err) {
      console.error("Erro durante o cadastro:", err);

      // Tratar diferentes tipos de erro
      if (err.status === 400) {
        setError(err.message || "Dados inválidos. Verifique os campos.");
      } else if (err.status === 409) {
        setError("Email ou nome de usuário já cadastrado.");
      } else if (err.status === 422) {
        setError("Erro de validação. Verifique os dados enviados.");
      } else if (err.status >= 500) {
        setError("Erro interno do servidor. Tente novamente mais tarde.");
      } else if (err.message === "Failed to fetch") {
        setError("Erro de conexão. Verifique sua internet e tente novamente.");
      } else {
        setError(err.message || "Erro inesperado durante o cadastro.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {}
        <div className={styles.header}>
          <h1 className={styles.title}>🎮 Crie sua conta GameReviews</h1>

          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: step === 1 ? "50%" : "100%" }}
            />
          </div>

          <div className={styles.steps}>
            <div className={`${styles.step} ${step >= 1 ? styles.active : ""}`}>
              <div className={styles.stepNumber}>1</div>
              <span>Dados Pessoais</span>
            </div>
            <div className={`${styles.step} ${step >= 2 ? styles.active : ""}`}>
              <div className={styles.stepNumber}>2</div>
              <span>Credenciais</span>
            </div>
          </div>
        </div>

        {}
        {process.env.NODE_ENV === "development" && (
          <div className={styles.devTools}>
            <Button
              type="button"
              onClick={testBackendConnection}
              variant="outline"
              size="small"
              disabled={loading}
            >
              🔧 Testar Conexão Backend
            </Button>
            {backendStatus && (
              <p
                className={`${styles.status} ${
                  backendStatus.includes("✅") ? styles.success : styles.error
                }`}
              >
                {backendStatus}
              </p>
            )}
          </div>
        )}

        {}
        {error && (
          <div className={styles.errorContainer}>
            <Error error={error} />
          </div>
        )}

        {success && (
          <div className={styles.successContainer}>
            <div className={styles.success}>
              <svg viewBox="0 0 24 24" className={styles.successIcon}>
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
              </svg>
              <p>{success}</p>
            </div>
          </div>
        )}

        {}
        <div className={styles.formContainer}>
          <form
            onSubmit={step === 1 ? nextStep : handleSubmit}
            className={styles.form}
          >
            {}
            {step === 1 && (
              <div className={styles.formStep}>
                <div className={styles.inputGroup}>
                  <Input
                    label="Nome completo *"
                    type="text"
                    name="name"
                    value={name}
                    onChange={(e) => handleFieldChange("name", e.target.value)}
                    onBlur={(e) => handleBlur("name", e.target.value)}
                    error={touched.name ? errors.name : null}
                    required
                    autoFocus
                    placeholder="Ex: João Silva"
                    maxLength={100}
                  />
                  <small className={styles.hint}>
                    Como você quer ser chamado na comunidade GameReviews
                  </small>
                </div>

                <div className={styles.inputGroup}>
                  <Input
                    label="E-mail *"
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => handleFieldChange("email", e.target.value)}
                    onBlur={(e) => handleBlur("email", e.target.value)}
                    error={touched.email ? errors.email : null}
                    required
                    placeholder="Ex: joao@email.com"
                  />
                  <small className={styles.hint}>
                    Usaremos para login e notificações importantes
                  </small>
                </div>

                <div className={styles.inputGroup}>
                  <Input
                    label="Nome de usuário (opcional)"
                    type="text"
                    name="username"
                    value={username}
                    onChange={(e) =>
                      handleFieldChange("username", e.target.value)
                    }
                    onBlur={(e) => handleBlur("username", e.target.value)}
                    error={touched.username ? errors.username : null}
                    placeholder="Ex: joao_gamer_123"
                    maxLength={50}
                  />
                  <small className={styles.hint}>
                    Seu identificador único (letras, números e _ apenas)
                  </small>
                </div>

                <Button
                  type="submit"
                  className={styles.nextButton}
                  disabled={loading || Object.keys(errors).length > 0}
                >
                  {loading ? "Validando..." : "Continuar"} →
                </Button>
              </div>
            )}

            {}
            {step === 2 && (
              <div className={styles.formStep}>
                <div className={styles.inputGroup}>
                  <div className={styles.passwordField}>
                    <Input
                      label="Senha *"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={password}
                      onChange={(e) =>
                        handleFieldChange("password", e.target.value)
                      }
                      onBlur={(e) => handleBlur("password", e.target.value)}
                      error={touched.password ? errors.password : null}
                      required
                      autoFocus
                      placeholder="Mínimo 6 caracteres"
                      maxLength={128}
                    />
                    <button
                      type="button"
                      className={styles.togglePassword}
                      onClick={() => setShowPassword(!showPassword)}
                      title={showPassword ? "Ocultar senha" : "Mostrar senha"}
                    >
                      {showPassword ? "🙈" : "👁️"}
                    </button>
                  </div>
                  <PasswordStrength password={password} />
                  <small className={styles.hint}>
                    Use letras, números e símbolos para maior segurança
                  </small>
                </div>

                <div className={styles.inputGroup}>
                  <div className={styles.passwordField}>
                    <Input
                      label="Confirmar senha *"
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) =>
                        handleFieldChange("confirmPassword", e.target.value)
                      }
                      onBlur={(e) =>
                        handleBlur("confirmPassword", e.target.value)
                      }
                      error={
                        touched.confirmPassword ? errors.confirmPassword : null
                      }
                      required
                      placeholder="Digite a senha novamente"
                      maxLength={128}
                    />
                    <button
                      type="button"
                      className={styles.togglePassword}
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      title={
                        showConfirmPassword ? "Ocultar senha" : "Mostrar senha"
                      }
                    >
                      {showConfirmPassword ? "🙈" : "👁️"}
                    </button>
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <Input
                    label="URL da foto de perfil (opcional)"
                    type="url"
                    name="avatarUrl"
                    value={avatarUrl}
                    onChange={(e) =>
                      handleFieldChange("avatarUrl", e.target.value)
                    }
                    onBlur={(e) => handleBlur("avatarUrl", e.target.value)}
                    error={touched.avatarUrl ? errors.avatarUrl : null}
                    placeholder="https://exemplo.com/sua-foto.jpg"
                  />
                  <small className={styles.hint}>
                    Link para sua imagem de perfil (JPG, PNG, GIF, WebP)
                  </small>

                  {avatarUrl && !errors.avatarUrl && (
                    <div className={styles.avatarPreview}>
                      <img
                        src={avatarUrl}
                        alt="Preview da foto de perfil"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://via.placeholder.com/100x100/6366f1/white?text=Erro";
                        }}
                      />
                      <span>Preview da sua foto</span>
                    </div>
                  )}
                </div>

                <div className={styles.termsCheck}>
                  <label className={styles.checkbox}>
                    <input
                      type="checkbox"
                      checked={acceptTerms}
                      onChange={(e) => setAcceptTerms(e.target.checked)}
                      required
                    />
                    <span className={styles.checkmark}></span>
                    <span>
                      Eu aceito os{" "}
                      <Link
                        to="/termos"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        termos de uso
                      </Link>{" "}
                      e a{" "}
                      <Link
                        to="/privacidade"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        política de privacidade
                      </Link>
                    </span>
                  </label>
                </div>

                <div className={styles.buttonGroup}>
                  <Button
                    type="button"
                    onClick={prevStep}
                    variant="secondary"
                    disabled={loading}
                  >
                    ← Voltar
                  </Button>

                  <Button
                    type="submit"
                    disabled={
                      loading || !acceptTerms || Object.keys(errors).length > 0
                    }
                  >
                    {loading ? (
                      <>
                        <span className={styles.spinner}></span>
                        Cadastrando...
                      </>
                    ) : (
                      "Criar conta 🚀"
                    )}
                  </Button>
                </div>
              </div>
            )}
          </form>
        </div>

        {}
        <div className={styles.loginLink}>
          <p>
            Já tem uma conta?{" "}
            <Link to="/login" className={styles.highlightLink}>
              Faça login aqui
            </Link>
          </p>
        </div>

        {}
        <div className={styles.securityInfo}>
          <div className={styles.securityIcon}>🔒</div>
          <p>Seus dados estão protegidos com criptografia de ponta</p>
        </div>
      </div>
    </section>
  );
};

export default FormCadastro;

