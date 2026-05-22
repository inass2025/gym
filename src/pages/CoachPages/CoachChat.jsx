import { useState, useEffect, useRef } from 'react';
import {
  MessageSquare, Megaphone, Send, Users,
  CheckCircle, XCircle, AlertCircle
} from 'lucide-react';
import api from '../../Api/Axios.js';
import './CoachChat.css';

const fmtTime = (d) =>
  new Date(d).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

const fmtDate = (d) => {
  const date = new Date(d);
  const today = new Date();
  if (date.toDateString() === today.toDateString()) return "Aujourd'hui";
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) return 'Hier';
  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
};

const COLORS = ['#e83e8c', '#0891b2', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];
const getColor = (id) => COLORS[id % COLORS.length];

function Avatar({ nom, prenom, id, photo, size = 40 }) {
  if (photo) return (
    <img
      src={`http://localhost:8000/storage/${photo}`}
      alt=""
      style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
    />
  );
  const letter = prenom?.[0]?.toUpperCase() || nom?.[0]?.toUpperCase() || '?';
  return (
    <div className="cch-avatar" style={{ width: size, height: size, background: getColor(id || 0) }}>
      {letter}
    </div>
  );
}

export default function CoachChat() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const coachId = user.id;

  const [clients, setClients] = useState([]);
  const [activeClient, setActiveClient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingClients, setLoadingClients] = useState(true);
  const [activeTab, setActiveTab] = useState('chat');

  const [annonce, setAnnonce] = useState('');
  const [annonceLoading, setAnnonceLoading] = useState(false);
  const [annonceSent, setAnnonceSent] = useState(false);

  const bottomRef = useRef(null);

  useEffect(() => { fetchClients(); }, []);

  const fetchClients = async () => {
    setLoadingClients(true);
    try {
      const [coursRes, resRes] = await Promise.all([
        api.get('/api/cours'),
        api.get('/api/reservation'),
      ]);
      const mesCours = coursRes.data.filter(c => c.coach_id === coachId);
      const mesCoursIds = mesCours.map(c => c.id);
      const mesRes = resRes.data.filter(r => mesCoursIds.includes(r.cours_id));

      const map = {};
      mesRes.forEach(r => {
        if (r.adherent && !map[r.adherent_id]) map[r.adherent_id] = r.adherent;
      });
      const list = Object.values(map);
      setClients(list);
      if (list.length > 0) setActiveClient(list[0]);
    } catch (_) {}
    setLoadingClients(false);
  };

  useEffect(() => {
    if (!activeClient) return;
    fetchMessages();
    const iv = setInterval(fetchMessages, 4000);
    return () => clearInterval(iv);
  }, [activeClient]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchMessages = async () => {
    if (!activeClient) return;
    try {
      const res = await api.get(`/api/messages/${activeClient.id}/${coachId}`);
      setMessages(Array.isArray(res.data) ? res.data : []);
    } catch (_) {}
  };

  const sendMessage = async () => {
    if (!content.trim() || !activeClient) return;
    setLoading(true);
    try {
      await api.post('/api/messages', {
        content,
        adherent_id: activeClient.id,
        coach_id: coachId,
        sender: 'coach',
      });
      setContent('');
      fetchMessages();
    } catch (_) {}
    setLoading(false);
  };

  const sendAnnonce = async () => {
    if (!annonce.trim() || clients.length === 0) return;
    setAnnonceLoading(true);
    try {
      await Promise.all(
        clients.map(client =>
          api.post('/api/messages', {
            content: `[Annonce] ${annonce}`,
            adherent_id: client.id,
            coach_id: coachId,
          })
        )
      );
      setAnnonce('');
      setAnnonceSent(true);
      setTimeout(() => setAnnonceSent(false), 3000);
    } catch (_) {}
    setAnnonceLoading(false);
  };

  const preview = (clientId) => {
    if (!activeClient || activeClient.id !== clientId || messages.length === 0)
      return 'Démarrer une conversation...';
    const last = messages[messages.length - 1];
    const text = last.content || '';
    return text.length > 28 ? text.slice(0, 28) + '...' : text;
  };

  return (
    <div className="cch">
      {/* Header */}
      <div className="cch__page-header">
        <div>
          <h1>Ma <span>Messagerie</span></h1>
          <p>Communiquez avec vos clients</p>
        </div>
        <div className="cch__tabs">
          <button
            className={`cch__tab ${activeTab === 'chat' ? 'active' : ''}`}
            onClick={() => setActiveTab('chat')}
          >
            <MessageSquare size={15} /> Chat
          </button>
          <button
            className={`cch__tab ${activeTab === 'annonces' ? 'active' : ''}`}
            onClick={() => setActiveTab('annonces')}
          >
            <Megaphone size={15} /> Annonces groupées
          </button>
        </div>
      </div>

      {/* ===== TAB CHAT ===== */}
      {activeTab === 'chat' && (
        <div className="cch__wrap">
          <aside className="cch__sidebar">
            <div className="cch__sidebar-header">
              <Users size={14} /> Clients ({clients.length})
            </div>

            {loadingClients ? (
              <p className="cch__loading">Chargement...</p>
            ) : clients.length === 0 ? (
              <p className="cch__loading">Aucun client</p>
            ) : (
              <ul className="cch__list">
                {clients.map(c => (
                  <li
                    key={c.id}
                    className={`cch__item ${activeClient?.id === c.id ? 'active' : ''}`}
                    onClick={() => setActiveClient(c)}
                  >
                    <Avatar nom={c.nom} prenom={c.prenom} id={c.id} photo={c.photo} />
                    <div className="cch__item-info">
                      <span className="cch__item-name">{c.prenom} {c.nom}</span>
                      <span className="cch__item-preview">{preview(c.id)}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </aside>

          <main className="cch__panel">
            {!activeClient ? (
              <div className="cch__empty-panel">
                <MessageSquare size={32} strokeWidth={1.2} />
                <p>Sélectionnez un client</p>
                <span>pour démarrer une conversation</span>
              </div>
            ) : (
              <>
                <div className="cch__panel-header">
                  <Avatar nom={activeClient.nom} prenom={activeClient.prenom} id={activeClient.id} photo={activeClient.photo} size={42} />
                  <div className="cch__panel-identity">
                    <p className="cch__panel-name">{activeClient.prenom} {activeClient.nom}</p>
                    <p className="cch__panel-email">{activeClient.email}</p>
                  </div>
                </div>

                <div className="cch__messages">
                  {messages.length === 0 && (
                    <p className="cch__empty-msg">Aucun message — commencez la conversation !</p>
                  )}
                  {messages.map((msg, i) => {
                    const isMine = msg.sender === 'coach';
                    const showDate = i === 0 || fmtDate(messages[i - 1].date_envoie) !== fmtDate(msg.date_envoie);
                    const showTime = i === 0 || fmtTime(messages[i - 1].date_envoie) !== fmtTime(msg.date_envoie);
                    return (
                      <div key={msg.id}>
                        {showDate && <div className="cch__date-sep">{fmtDate(msg.date_envoie)}</div>}
                        {showTime && !showDate && <div className="cch__time-sep">{fmtTime(msg.date_envoie)}</div>}
                        <div className={`cch__bubble-row ${isMine ? 'mine' : 'other'}`}>
                          {!isMine && (
                            <Avatar nom={activeClient.nom} prenom={activeClient.prenom} id={activeClient.id} photo={activeClient.photo} size={28} />
                          )}
                          <div className={`cch__bubble ${isMine ? 'cch__bubble--mine' : 'cch__bubble--other'}`}>
                            {msg.content}
                            <span className="cch__bubble-time">{fmtTime(msg.date_envoie)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={bottomRef} />
                </div>

                <div className="cch__input-bar">
                  <input
                    className="cch__input"
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && sendMessage()}
                    placeholder={`Message à ${activeClient.prenom}...`}
                  />
                  <button className="cch__send-btn" onClick={sendMessage} disabled={loading}>
                    {loading ? '...' : <Send size={18} />}
                  </button>
                </div>
              </>
            )}
          </main>
        </div>
      )}

      {/* ===== TAB ANNONCES ===== */}
      {activeTab === 'annonces' && (
        <div className="cch__annonces">
          <div className="cch__annonce-card">
            <div className="cch__annonce-header">
              <h3>Envoyer une annonce à tous vos clients</h3>
              <p>Le message sera envoyé à <strong>{clients.length} client(s)</strong></p>
            </div>

            {annonceSent && (
              <div className="cch__alert-ok">
                <CheckCircle size={14} /> Annonce envoyée à tous vos clients !
              </div>
            )}

            <div className="cch__annonce-body">
              <div className="cch__annonce-clients">
                <p className="cch__annonce-label">DESTINATAIRES</p>
                <div className="cch__annonce-avatars">
                  {clients.slice(0, 8).map(c => (
                    <div key={c.id} className="cch__annonce-avatar-wrap" title={`${c.prenom} ${c.nom}`}>
                      <Avatar nom={c.nom} prenom={c.prenom} id={c.id} photo={c.photo} size={36} />
                    </div>
                  ))}
                  {clients.length > 8 && (
                    <div className="cch__annonce-more">+{clients.length - 8}</div>
                  )}
                </div>
              </div>

              <div className="cch__field">
                <label className="cch__label">MESSAGE</label>
                <textarea
                  className="cch__textarea"
                  placeholder="Ex: Rappel : séance de yoga annulée demain, nouvelle date le vendredi..."
                  value={annonce}
                  onChange={e => setAnnonce(e.target.value)}
                  rows={5}
                />
              </div>

              <button
                className="cch__btn-send-annonce"
                onClick={sendAnnonce}
                disabled={annonceLoading || clients.length === 0 || !annonce.trim()}
              >
                <Send size={15} />
                {annonceLoading ? 'Envoi en cours...' : `Envoyer à ${clients.length} client(s)`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}