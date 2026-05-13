import { useState, useEffect, useRef } from "react";
import api from "./api";
import "./message.css";

// ── Helpers ────────────────────────────────────────────────────────────────
const ME_ID = () => JSON.parse(localStorage.getItem("user") || "{}").id || 1;

const fmtTime = (d) =>
  new Date(d).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

const COLORS = ["#e8445a","#3a7bd5","#2ecc71","#f39c12","#9b59b6","#1abc9c","#e67e22"];
const getColor = (id) => COLORS[id % COLORS.length];

const initials = (nom = "") =>
  nom.split(" ").slice(0, 2).map((w) => w[0]?.toUpperCase()).join("");

// ── Avatar ─────────────────────────────────────────────────────────────────
function Avatar({ nom, id, size = 40 }) {
  return (
    <div className="ch-avatar" style={{ width: size, height: size, background: getColor(id) }}>
      {initials(nom)}
    </div>
  );
}

// ── Composant principal ────────────────────────────────────────────────────
export default function Chat() {
  const [coaches, setCoaches]         = useState([]);
  const [activeCoach, setActiveCoach] = useState(null);
  const [messages, setMessages]       = useState([]);
  const [content, setContent]         = useState("");
  const [loading, setLoading]         = useState(false);
  const [loadingCoaches, setLoadingCoaches] = useState(true);
  const bottomRef  = useRef(null);
  const adherentId = ME_ID();

  // ── Fetch coaches depuis API ─────────────────────────────────────────────
  useEffect(() => {
    async function fetchCoaches() {
      try {
        const res = await api.get("/coaches"); // ← adherents role=coach
        // Laravel retourne soit res.data directement soit res.data.data
        const list = Array.isArray(res.data) ? res.data : res.data.data || [];
        setCoaches(list);
        if (list.length > 0) setActiveCoach(list[0]);
      } catch (err) {
        console.error("fetch coaches:", err.message);
      } finally {
        setLoadingCoaches(false);
      }
    }
    fetchCoaches();
  }, []);

  // ── Fetch messages quand coach change ────────────────────────────────────
  useEffect(() => {
    if (!activeCoach) return;
    fetchMessages();
    const iv = setInterval(fetchMessages, 4000);
    return () => clearInterval(iv);
  }, [activeCoach]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function fetchMessages() {
    try {
      const res = await api.get(`/messages/${adherentId}/${activeCoach.id}`);
      setMessages(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("fetch messages:", err.message);
    }
  }

  async function sendMessage() {
    if (!content.trim() || !activeCoach) return;
    setLoading(true);
    try {
      await api.post("/messages", {
        content,
        adherent_id: adherentId,
        coach_id:    activeCoach.id,
      });
      setContent("");
      fetchMessages();
    } catch (err) {
      console.error("send:", err.message);
    } finally {
      setLoading(false);
    }
  }

  // preview dernier message dans sidebar
  const preview = (coachId) => {
    if (!activeCoach || activeCoach.id !== coachId || messages.length === 0)
      return "Démarrer une conversation...";
    const last = messages[messages.length - 1];
    return last.content.length > 24
      ? last.content.slice(0, 24) + "..."
      : last.content;
  };

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <div className="ch-wrap">

      {/* ── Sidebar ── */}
      <aside className="ch-sidebar">
        <div className="ch-sidebar-header">
          <span className="ch-sidebar-title">Conversations</span>
          <button className="ch-new-btn">+ Nouveau</button>
        </div>

        {loadingCoaches ? (
          <p className="ch-loading">Chargement...</p>
        ) : coaches.length === 0 ? (
          <p className="ch-loading">Aucun coach trouvé.</p>
        ) : (
          <ul className="ch-conv-list">
            {coaches.map((c) => (
              <li
                key={c.id}
                className={`ch-conv-item ${activeCoach?.id === c.id ? "active" : ""}`}
                onClick={() => setActiveCoach(c)}
              >
                <Avatar nom={c.nom} id={c.id} />
                <div className="ch-conv-info">
                  <span className="ch-conv-name">{c.nom}</span>
                  <span className="ch-conv-preview">{preview(c.id)}</span>
                </div>
                <div className="ch-conv-meta">
                  <span className="ch-conv-time">
                    {new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                  <span className="ch-dot" />
                </div>
              </li>
            ))}
          </ul>
        )}
      </aside>

      {/* ── Panel ── */}
      <main className="ch-panel">
        {!activeCoach ? (
          <div className="ch-empty-panel">Sélectionnez un coach</div>
        ) : (
          <>
            {/* Header */}
            <div className="ch-panel-header">
              <Avatar nom={activeCoach.nom} id={activeCoach.id} size={42} />
              <div>
                <p className="ch-panel-name">{activeCoach.nom}</p>
                <p className="ch-panel-status">● En ligne</p>
              </div>
            </div>

            {/* Messages */}
            <div className="ch-messages">
              {messages.length === 0 && (
                <p className="ch-empty">Aucun message — commencez la conversation !</p>
              )}
              {messages.map((msg, i) => {
                const mine     = msg.adherent_id === adherentId;
                const showTime = i === 0 ||
                  fmtTime(messages[i - 1].date_envoie) !== fmtTime(msg.date_envoie);
                return (
                  <div key={msg.id}>
                    {showTime && (
                      <div className="ch-time-sep">{fmtTime(msg.date_envoie)}</div>
                    )}
                    <div className={`ch-bubble-row ${mine ? "mine" : "other"}`}>
                      <div className={`ch-bubble ${mine ? "ch-bubble-mine" : "ch-bubble-other"}`}>
                        {msg.content}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="ch-input-bar">
              <input
                className="ch-input"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Écrire un message..."
              />
              <button className="ch-send-btn" onClick={sendMessage} disabled={loading}>
                {loading ? "..." : "Envoyer"}
              </button>
            </div>
          </>
        )}
      </main>

    </div>
  );
}