import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { User, Lock, Mail } from "lucide-react";
import "./LoginPage.css";

export default function Login() {
  const [mode, setMode] = useState("login");
  const navigate = useNavigate();

  // login
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // register
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [emailReg, setEmailReg] = useState("");
  const [passReg, setPassReg] = useState("");

  // ================= LOGIN =================
  const handleLogin = (e) => {
    e.preventDefault();
    if (email === "" || password === "") {
      alert("Remplir les champs");
      return;
    }
    axios.post("http://localhost:8000/api/login", {
      email: email,
      password: password,
    })
    .then((res) => {
      const role = res.data.role;
      localStorage.setItem("token", res.data.token);
      
      localStorage.setItem("role", role);
      if (role === "admin") {
        navigate("/admin");
      } else if (role === "coach") {
        navigate("/coach");
      } else {
        navigate("/adherent");
      }
    })
    .catch(() => {
      alert("Email ou mot de passe incorrect");
    });
  };

  // ================= REGISTER =================
  const handleRegister = (e) => {
    e.preventDefault();
    if (prenom === "" || nom === "" || emailReg === "" || passReg === "") {
      alert("Remplir tous les champs");
      return;
    }
    axios.post("http://localhost:8000/api/register", {
      prenom: prenom,
      nom: nom,
      email: emailReg,
      password: passReg,
    })
    .then((res) => {
        localStorage.setItem("token", res.data.token)
      alert("Compte créé !");
      setMode("login");
    })
    .catch(() => {
      alert("Erreur lors de l'inscription");
    });
  };

  return (
    <div className="login-page">
      <div className="login-card">

        {/* ── GAUCHE ── */}
        <div className="login-left">
          <img src="/login.jpeg" alt="photo login" />
          <div className="login-overlay" />
          <div className="login-brand">
            <strong>GymMaster</strong>
            <span>FITNESS CLUB</span>
          </div>
          <div className="login-tab">
            <span
              className={mode === "login" ? "tab-active" : "tab-inactive"}
              onClick={() => setMode("login")}
            >
              LOGIN
            </span>
            <span className="tab-separator">|</span>
            <span
              className={mode === "register" ? "tab-active" : "tab-inactive"}
              onClick={() => setMode("register")}
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

          {/* ===== LOGIN ===== */}
          {mode === "login" && (
            <form className="login-form" onSubmit={handleLogin}>
              <div className="input-wrap">
                <Mail size={18} className="input-icon" />
                <input
                  type="email"
                  placeholder="Email"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="input-wrap">
                <Lock size={18} className="input-icon" />
                <input
                  type="password"
                  placeholder="Mot de passe"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="login-row">
                <span className="forgot">Mot de passe oublié ?</span>
                <button type="submit" className="btn-login">LOGIN</button>
              </div>
            </form>
          )}

          {/* ===== REGISTER ===== */}
          {mode === "register" && (
            <form className="login-form" onSubmit={handleRegister}>
              <div style={{ display: "flex", gap: 16 }}>
                <div className="input-wrap" style={{ flex: 1 }}>
                  <User size={18} className="input-icon" />
                  <input
                    type="text"
                    placeholder="Prénom"
                    onChange={(e) => setPrenom(e.target.value)}
                  />
                </div>
                <div className="input-wrap" style={{ flex: 1 }}>
                  <User size={18} className="input-icon" />
                  <input
                    type="text"
                    placeholder="Nom"
                    onChange={(e) => setNom(e.target.value)}
                  />
                </div>
              </div>
              <div className="input-wrap">
                <Mail size={18} className="input-icon" />
                <input
                  type="email"
                  placeholder="Email"
                  onChange={(e) => setEmailReg(e.target.value)}
                />
              </div>
              <div className="input-wrap">
                <Lock size={18} className="input-icon" />
                <input
                  type="password"
                  placeholder="Mot de passe"
                  onChange={(e) => setPassReg(e.target.value)}
                />
              </div>
              <div className="login-row">
                <span></span>
                <button type="submit" className="btn-login">CRÉER</button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}