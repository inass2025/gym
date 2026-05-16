import { NavLink, useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext.jsx";
import api from "../../Api/Axios.js";
import {
  LayoutDashboard,
  User,
  ClipboardList,
  Users,
  CalendarDays,
  MessageSquare,
  LogOut,
  Sun,
  Moon,
  Dumbbell,
} from "lucide-react";
import "./CoachSidebar.css";

export default function CoachSidebar() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const photo = user.photo
    ? `http://localhost:8000/storage/${user.photo}`
    : null;

  const handleLogout = async () => {
    try {
      await api.post("/api/logout");
    } catch (_) {}
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const navItems = [
    { to: "/coach", end: true, icon: <LayoutDashboard size={18} />, label: "Dashboard" },
    { to: "/coach/profil",     icon: <User size={18} />,           label: "Profil" },
    { to: "/coach/programmes", icon: <ClipboardList size={18} />,  label: "Programmes" },
    { to: "/coach/clients",    icon: <Users size={18} />,          label: "Mes Clients" },
    { to: "/coach/planning",   icon: <CalendarDays size={18} />,   label: "Planning" },
    { to: "/coach/chat",       icon: <MessageSquare size={18} />,  label: "Messages" },
  ];

  return (
    <aside className="coach-sidebar">
      {/* Logo */}
      <div className="coach-sidebar__logo">
        <div className="coach-sidebar__logo-icon">
          <Dumbbell size={20} />
        </div>
        <span>GymMaster</span>
        <button
          className="coach-sidebar__theme-toggle"
          onClick={toggleTheme}
          title="Changer le thème"
        >
          {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>

      {/* Profile */}
      <div className="coach-sidebar__profile">
        <div className="coach-sidebar__avatar">
          {photo ? (
            <img src={photo} alt="profil" />
          ) : user.prenom ? (
            user.prenom[0].toUpperCase()
          ) : (
            "C"
          )}
        </div>
        <p className="coach-sidebar__name">
          {user.prenom} {user.nom}
        </p>
        <span className="coach-sidebar__badge">Coach</span>
      </div>

      {/* Nav */}
      <nav className="coach-sidebar__nav">
        <p className="coach-sidebar__section">NAVIGATION</p>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <button className="coach-sidebar__logout" onClick={handleLogout}>
        <LogOut size={16} />
        Déconnexion
      </button>
    </aside>
  );
}