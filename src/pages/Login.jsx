import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { User, Lock, Mail } from "lucide-react";
import "./LoginPage.css";
import api from "../Api/Axios.js";

export default function Login() {
  const [mode, setMode] = useState("login"); 

  // Login 
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");


  // Register 
  const [prenom, setPrenom] = useState("");
  const [nom, setNom]   = useState("");
  const [emailReg, setEmailReg]   = useState("");
  const [passReg, setPassReg] = useState("");


  const handleLogin = async (e) => {
  e.preventDefault();
  const errors = {};
  if (email === "" || password === "")
    errors.email = "Email invalide";
  if (!loginPassword)
    errors.password = "Mot de passe requis";
  setLoginErrors(errors);
  if (Object.keys(errors).length === 0) {
    try {
      const res = await api.post("/api/login", {
        email: loginEmail,
        password: loginPassword,
      });
      localStorage.setItem("token", res.data.token);
      alert("Connecté avec succès!");
    } catch (err) {
      setLoginErrors({ email: "Email ou mot de passe incorrect" });
    }
  }
};



const handleRegister = async (e) => {
  e.preventDefault();
  const errors = {};
  if (!firstName.trim()) errors.firstName = "Prénom requis";
  if (!lastName.trim())  errors.lastName  = "Nom requis";
  if (!regEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regEmail))
    errors.email = "Email invalide";
  if (!regPassword || regPassword.length < 6)
    errors.password = "Minimum 6 caractères";
  setRegErrors(errors);
  if (Object.keys(errors).length === 0) {
    try {
      const res = await api.post("/api/register", {
        nom: lastName,
        prenom: firstName,
        email: regEmail,
        password: regPassword,
      });
      localStorage.setItem("token", res.data.token);
      alert("Compte créé avec succès!");
    } catch (err) {
      setRegErrors({ email: "Cet email existe déjà" });
    }
  }
};

  return (
    <div className="login-page">
      <div className="login-card">

        {/* ── GAUCHE : photo gym ── */}
        <div className="login-left">
          <img src="/login.jpeg" alt="photo login" />
          <div className="login-overlay" />
          <div className="login-brand">
            <strong>GymMaster</strong>
            <span>FITNESS CLUB</span>
          </div>

          {/* ── TAB SWITCH : LOGIN | CREATE ACCOUNT ── */}
          <div className="login-tab">
            <span
              className={mode === "login" ? "tab-active" : "tab-inactive"}
              onClick={() => { setMode("login"); setLoginErrors({}); }}
            >
              LOGIN
            </span>
            <span className="tab-separator">|</span>
            <span
              className={mode === "register" ? "tab-active" : "tab-inactive"}
              onClick={() => { setMode("register"); setRegErrors({}); }}
            >
              CREATE ACCOUNT
            </span>
          </div>
        </div>

        {/* ── DROITE ── */}
        <div className="login-right">

          <div className="login-avatar">
            <User size={30} color="#fff" />
          </div>

          <h1 className="login-title">
            {mode === "login" ? "LOGIN" : "CREATE ACCOUNT"}
          </h1>

          {/* ════ LOGIN ════ */}
          {mode === "login" && (
            <form className="login-form" onSubmit={handleLogin} noValidate>

              <div className="input-wrap" style={{
                flexDirection: "column", alignItems: "flex-start",
                borderBottom: loginErrors.email ? "1.5px solid #e24b4a" : undefined
              }}>
                <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                  <Mail size={18} className="input-icon" />
                  <input
                    type="email"
                    placeholder="Email"
                    value={loginEmail}
                    onChange={e => setLoginEmail(e.target.value)}
                  />
                </div>
                {loginErrors.email && (
                  <span style={{ fontSize: 11, color: "#e24b4a", paddingBottom: 4 }}>{loginErrors.email}</span>
                )}
              </div>

              <div className="input-wrap" style={{
                flexDirection: "column", alignItems: "flex-start",
                borderBottom: loginErrors.password ? "1.5px solid #e24b4a" : undefined
              }}>
                <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                  <Lock size={18} className="input-icon" />
                  <input
                    type="password"
                    placeholder="Mot de passe"
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                  />
                </div>
                {loginErrors.password && (
                  <span style={{ fontSize: 11, color: "#e24b4a", paddingBottom: 4 }}>{loginErrors.password}</span>
                )}
              </div>

              <div className="login-row">
                <span className="forgot">Mot de passe oublié ?</span>
                <button type="submit" className="btn-login">LOGIN</button>
              </div>

              <div className="or-row">Ou se connecter avec</div>

              <div className="socials">
                <button type="button" className="soc-btn">
                  <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" width="18" height="18" />
                  Google
                </button>
                <button type="button" className="soc-btn">
                  <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" alt="Facebook" width="18" height="18" />
                  Facebook
                </button>
              </div>

              <p className="signup-text">
                Pas encore de compte ?{" "}
                <span
                  style={{ color: "#cf478b", fontWeight: 600, cursor: "pointer" }}
                  onClick={() => { setMode("register"); setRegErrors({}); }}
                >
                  S'inscrire
                </span>
              </p>

            </form>
          )}

          {/* ════ CREATE ACCOUNT ════ */}
          {mode === "register" && (
            <form className="login-form" onSubmit={handleRegister} noValidate>

              {/* Prénom + Nom côte à côte */}
              <div style={{ display: "flex", gap: 16 }}>
                <div style={{ flex: 1 }}>
                  <div className="input-wrap" style={{
                    flexDirection: "column", alignItems: "flex-start",
                    borderBottom: regErrors.firstName ? "1.5px solid #e24b4a" : undefined
                  }}>
                    <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                      <User size={18} className="input-icon" />
                      <input
                        type="text"
                        placeholder="Prénom"
                        value={firstName}
                        onChange={e => setFirstName(e.target.value)}
                      />
                    </div>
                    {regErrors.firstName && (
                      <span style={{ fontSize: 11, color: "#e24b4a", paddingBottom: 4 }}>{regErrors.firstName}</span>
                    )}
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <div className="input-wrap" style={{
                    flexDirection: "column", alignItems: "flex-start",
                    borderBottom: regErrors.lastName ? "1.5px solid #e24b4a" : undefined
                  }}>
                    <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                      <User size={18} className="input-icon" />
                      <input
                        type="text"
                        placeholder="Nom"
                        value={lastName}
                        onChange={e => setLastName(e.target.value)}
                      />
                    </div>
                    {regErrors.lastName && (
                      <span style={{ fontSize: 11, color: "#e24b4a", paddingBottom: 4 }}>{regErrors.lastName}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="input-wrap" style={{
                flexDirection: "column", alignItems: "flex-start",
                borderBottom: regErrors.email ? "1.5px solid #e24b4a" : undefined
              }}>
                <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                  <Mail size={18} className="input-icon" />
                  <input
                    type="email"
                    placeholder="Email"
                    value={regEmail}
                    onChange={e => setRegEmail(e.target.value)}
                  />
                </div>
                {regErrors.email && (
                  <span style={{ fontSize: 11, color: "#e24b4a", paddingBottom: 4 }}>{regErrors.email}</span>
                )}
              </div>

              <div className="input-wrap" style={{
                flexDirection: "column", alignItems: "flex-start",
                borderBottom: regErrors.password ? "1.5px solid #e24b4a" : undefined
              }}>
                <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                  <Lock size={18} className="input-icon" />
                  <input
                    type="password"
                    placeholder="Mot de passe (min. 6 caractères)"
                    value={regPassword}
                    onChange={e => setRegPassword(e.target.value)}
                  />
                </div>
                {regErrors.password && (
                  <span style={{ fontSize: 11, color: "#e24b4a", paddingBottom: 4 }}>{regErrors.password}</span>
                )}
              </div>

              <div className="login-row">
                <span></span>
                <button type="submit" className="btn-login">CRÉER</button>
              </div>

              <div className="or-row">Ou s'inscrire avec</div>

              <div className="socials">
                <button type="button" className="soc-btn">
                  <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" width="18" height="18" />
                  Google
                </button>
                <button type="button" className="soc-btn">
                  <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" alt="Facebook" width="18" height="18" />
                  Facebook
                </button>
              </div>

              <p className="signup-text">
                Déjà membre ?{" "}
                <span
                  style={{ color: "#cf478b", fontWeight: 600, cursor: "pointer" }}
                  onClick={() => { setMode("login"); setLoginErrors({}); }}
                >
                  Se connecter
                </span>
              </p>

            </form>
          )}

        </div>
      </div>
    </div>
  );
}