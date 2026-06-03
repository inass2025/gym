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
  const [loginError, setLoginError] = useState("");

  // register
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [emailReg, setEmailReg] = useState("");
  const [passReg, setPassReg] = useState("");
  const [registerError, setRegisterError] = useState("");

  // ================= LOGIN =================
  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError("");
    if (email === "" || password === "") {
      setLoginError("Veuillez remplir tous les champs");
      return;
    }
    axios.post("http://localhost:8000/api/login", { email, password })
      .then((res) => {
        const role = res.data.role;
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        localStorage.setItem("role", role);
        if (role === "admin") navigate("/Admin");
        else if (role === "coach") navigate("/coach");
        else navigate("/adherent");
      })
      .catch((err) => {
        setLoginError(err.response?.data?.message || "Erreur de connexion");
      });
  };

  // ================= REGISTER =================
  const handleRegister = (e) => {
    e.preventDefault();
    setRegisterError("");
    if (!prenom || !nom || !emailReg || !passReg) {
      setRegisterError("Veuillez remplir tous les champs");
      return;
    }
    axios.post("http://localhost:8000/api/register", {
      prenom, nom, email: emailReg, password: passReg,
    })
      .then((res) => {
        localStorage.setItem("token", res.data.token);
        setMode("login");
      })
      .catch((err) => {
        setRegisterError(err.response?.data?.message || "Erreur lors de l'inscription");
      });
  };

  return (
    <div className="login-page">
      <div className="login-card">
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
              onClick={() => { setMode("login"); setLoginError(""); }}
            >LOGIN</span>
            <span className="tab-separator">|</span>
            <span
              className={mode === "register" ? "tab-active" : "tab-inactive"}
              onClick={() => { setMode("register"); setRegisterError(""); }}
            >CREATE ACCOUNT</span>
          </div>
        </div>

        <div className="login-right">
          <div className="login-avatar">
            <User size={30} color="#fff" />
          </div>
          <h1 className="login-title">
            {mode === "login" ? "LOGIN" : "CREATE ACCOUNT"}
          </h1>

          {mode === "login" && (
            <form className="login-form" onSubmit={handleLogin}>
              <div className="input-wrap">
                <Mail size={18} className="input-icon" />
                <input
                  type="email"
                  placeholder="Email"
                  onChange={(e) => { setEmail(e.target.value); setLoginError(""); }}
                />
              </div>
              <div className="input-wrap">
                <Lock size={18} className="input-icon" />
                <input
                  type="password"
                  placeholder="Mot de passe"
                  onChange={(e) => { setPassword(e.target.value); setLoginError(""); }}
                />
              </div>
              {loginError && (
                <p style={{ color: "#e24b4a", fontSize: "13px", margin: "4px 0 8px" }}>
                  {loginError}
                </p>
              )}
              <div className="login-row">
                
                <button type="submit" className="btn-login">LOGIN</button>
              </div>
            </form>
          )}

          {mode === "register" && (
            <form className="login-form" onSubmit={handleRegister}>
              <div style={{ display: "flex", gap: 16 }}>
                <div className="input-wrap" style={{ flex: 1 }}>
                  <User size={18} className="input-icon" />
                  <input type="text" placeholder="Prénom" onChange={(e) => { setPrenom(e.target.value); setRegisterError(""); }} />
                </div>
                <div className="input-wrap" style={{ flex: 1 }}>
                  <User size={18} className="input-icon" />
                  <input type="text" placeholder="Nom" onChange={(e) => { setNom(e.target.value); setRegisterError(""); }} />
                </div>
              </div>
              <div className="input-wrap">
                <Mail size={18} className="input-icon" />
                <input type="email" placeholder="Email" onChange={(e) => { setEmailReg(e.target.value); setRegisterError(""); }} />
              </div>
              <div className="input-wrap">
                <Lock size={18} className="input-icon" />
                <input type="password" placeholder="Mot de passe" onChange={(e) => { setPassReg(e.target.value); setRegisterError(""); }} />
              </div>
              {registerError && (
                <p style={{ color: "#e24b4a", fontSize: "13px", margin: "4px 0 8px" }}>
                  {registerError}
                </p>
              )}
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