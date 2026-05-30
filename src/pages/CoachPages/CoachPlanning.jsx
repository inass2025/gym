import { useState, useEffect } from 'react';
import {
  Plus, Edit2, Trash2, ChevronLeft, ChevronRight,
  MapPin, Users, Calendar, Dumbbell,
  Inbox, ClipboardList, Zap, CheckCircle, XCircle,
  AlertCircle, Save, X
} from 'lucide-react';
import api from '../../Api/Axios.js';
import './CoachPlanning.css';

const JOURS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
const MOIS  = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];

export default function CoachPlanning() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const [activeTab, setActiveTab]     = useState('aujourd_hui');
  const [cours, setCours]             = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading]         = useState(true);

  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear,  setCurrentYear]  = useState(today.getFullYear());

  const [showForm,      setShowForm]      = useState(false);
  const [editingCours,  setEditingCours]  = useState(null);
  const [form, setForm] = useState({
    nom: '', description: '', date: '', heur: '',
    capacite: '', salle: '', niveau: 'Débutant'
  });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [coursRes, resRes] = await Promise.all([
        api.get('/api/cours'),
        api.get('/api/reservations'),   
      ]);
      const mesCours    = coursRes.data.filter(c => c.coach_id === user.id);
      const mesCoursIds = mesCours.map(c => c.id);
      const mesRes      = resRes.data.filter(r => mesCoursIds.includes(r.cours_id));
      setCours(mesCours);
      setReservations(mesRes);
    } catch (_) {}
    setLoading(false);
  };

  const todayStr             = today.toISOString().split('T')[0];
  const seancesAujourdHui    = cours.filter(c => c.date?.startsWith(todayStr));
  const reservationsEnAttente = reservations.filter(r => r.status === 'en_attente' || r.status === 'confirmé');

  const getDaysInMonth    = (month, year) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (month, year) => {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1;
  };

  const getCoursDuJour = (day) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return cours.filter(c => c.date?.startsWith(dateStr));
  };

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
    else setCurrentMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
    else setCurrentMonth(m => m + 1);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const openAddForm = () => {
    setEditingCours(null);
    setForm({ nom: '', description: '', date: '', heur: '', capacite: '', salle: '', niveau: 'Débutant' });
    setShowForm(true);
  };

  const openEditForm = (c) => {
    setEditingCours(c);
    setForm({
      nom:         c.nom         || '',
      description: c.description || '',
      date:        c.date        || '',
      heur:        c.heur        || '',
      capacite:    c.capacite    || '',
      salle:       c.salle       || '',
      niveau:      c.niveau      || 'Débutant',
    });
    setShowForm(true);
  };

  const handleSubmit = async () => {
    try {
      if (editingCours) {
        const res = await api.put(`/api/cours/${editingCours.id}`, { ...form, coach_id: user.id });
        setCours(prev => prev.map(c => c.id === editingCours.id ? res.data : c));
      } else {
        const res = await api.post('/api/cours', { ...form, coach_id: user.id });
        setCours(prev => [...prev, res.data]);
      }
      setShowForm(false);
    } catch (err) {
      console.log(err.response?.data);
      alert(JSON.stringify(err.response?.data));
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/cours/${id}`);
      setCours(prev => prev.filter(c => c.id !== id));
      setReservations(prev => prev.filter(r => r.cours_id !== id));
    } catch (_) {}
  };

  const handleAccepter = async (id) => {
    try {
      await api.patch(`/api/reservations/${id}/accepter`);
      setReservations(prev => prev.map(r => r.id === id ? { ...r, status: 'accepté' } : r));
    } catch (_) {}
  };

  const handleRefuser = async (id) => {
    try {
      await api.patch(`/api/reservations/${id}/refuser`);
      setReservations(prev => prev.map(r => r.id === id ? { ...r, status: 'refusé' } : r));
    } catch (_) {}
  };

  const formatHeure = (heur) => heur ? heur.slice(0, 5) : '—';
  const formatDate  = (date) => date
    ? new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })
    : '—';

  const TABS = [
    { key: 'aujourd_hui',  label: "Aujourd'hui", icon: <Zap size={15} />           },
    { key: 'calendrier',   label: 'Calendrier',  icon: <Calendar size={15} />      },
    { key: 'seances',      label: 'Séances',     icon: <Dumbbell size={15} />      },
    { key: 'reservations', label: 'Réservations',icon: <ClipboardList size={15} /> },
  ];

  return (
    <div className="cp">

      {/* ── Header ── */}
      <div className="cp__header">
        <div>
          <h1>Mon <span>Planning</span></h1>
          <p>Gérez vos séances et réservations</p>
        </div>
        <button className="btn-save cp__btn-add" onClick={openAddForm}>
          <Plus size={16} /> Ajouter séance
        </button>
      </div>

      {/* ── Tabs ── */}
      <div className="coach-profil__tabs">
        {TABS.map(t => (
          <button
            key={t.key}
            className={`coach-profil__tab ${activeTab === t.key ? 'active' : ''}`}
            onClick={() => setActiveTab(t.key)}
          >
            {t.icon} {t.label}
            {t.key === 'reservations' && reservationsEnAttente.length > 0 && (
              <span className="cp__badge-count">{reservationsEnAttente.length}</span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="cp__loading">Chargement...</div>
      ) : (
        <>
          {/* ===== AUJOURD'HUI ===== */}
          {activeTab === 'aujourd_hui' && (
            <div className="cp__today">
              <div className="cp__today-date">
                {today.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
              {seancesAujourdHui.length === 0 ? (
                <div className="cp__empty">
                  <Inbox size={36} strokeWidth={1.3} />
                  <p>Aucune séance aujourd'hui</p>
                  <span>Profitez pour planifier de nouvelles séances</span>
                </div>
              ) : (
                <div className="cp__seances-list">
                  {seancesAujourdHui.map(c => {
                    const nbRes = reservations.filter(r => r.cours_id === c.id).length;
                    return (
                      <div key={c.id} className="cp__seance-card cp__seance-card--today">
                        <div className="cp__seance-time">{formatHeure(c.heur)}</div>
                        <div className="cp__seance-info">
                          <h3>{c.nom}</h3>
                          <p>{c.description}</p>
                          <div className="cp__seance-tags">
                            {c.salle && <span className="cp__tag"><MapPin size={11} /> {c.salle}</span>}
                            <span className="cp__tag"><Users size={11} /> {nbRes}/{c.capacite}</span>
                            {c.niveau && <span className={`cp__tag cp__tag--${c.niveau?.toLowerCase()}`}>{c.niveau}</span>}
                          </div>
                        </div>
                        <div className="cp__seance-actions">
                          <button className="btn-edit"   onClick={() => openEditForm(c)}><Edit2  size={14} /></button>
                          <button className="btn-delete" onClick={() => handleDelete(c.id)}><Trash2 size={14} /></button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ===== CALENDRIER ===== */}
          {activeTab === 'calendrier' && (
            <div className="cp__calendar-wrap">
              <div className="cp__cal-header">
                <button className="cp__cal-nav" onClick={prevMonth}><ChevronLeft  size={18} /></button>
                <h3>{MOIS[currentMonth]} {currentYear}</h3>
                <button className="cp__cal-nav" onClick={nextMonth}><ChevronRight size={18} /></button>
              </div>
              <div className="cp__cal-grid">
                {JOURS.map(j => <div key={j} className="cp__cal-day-label">{j}</div>)}
                {Array.from({ length: getFirstDayOfMonth(currentMonth, currentYear) }).map((_, i) => (
                  <div key={`empty-${i}`} className="cp__cal-day cp__cal-day--empty" />
                ))}
                {Array.from({ length: getDaysInMonth(currentMonth, currentYear) }).map((_, i) => {
                  const day       = i + 1;
                  const daysCours = getCoursDuJour(day);
                  const isToday   = day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
                  return (
                    <div key={day} className={`cp__cal-day ${isToday ? 'cp__cal-day--today' : ''} ${daysCours.length > 0 ? 'cp__cal-day--has-cours' : ''}`}>
                      <span className="cp__cal-day-num">{day}</span>
                      {daysCours.map(c => (
                        <div key={c.id} className="cp__cal-event" onClick={() => openEditForm(c)}>
                          {formatHeure(c.heur)} {c.nom}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ===== SÉANCES ===== */}
          {activeTab === 'seances' && (
            <div className="cp__seances">
              {cours.length === 0 ? (
                <div className="cp__empty">
                  <ClipboardList size={36} strokeWidth={1.3} />
                  <p>Aucune séance planifiée</p>
                  <span>Cliquez sur "Ajouter séance" pour commencer</span>
                </div>
              ) : (
                <div className="cp__seances-list">
                  {[...cours].sort((a, b) => new Date(a.date) - new Date(b.date)).map(c => {
                    const nbRes  = reservations.filter(r => r.cours_id === c.id).length;
                    const isPast = c.date && new Date(c.date) < today;
                    return (
                      <div key={c.id} className={`cp__seance-card ${isPast ? 'cp__seance-card--past' : ''}`}>
                        <div className="cp__seance-date-col">
                          <span className="cp__seance-day">
                            {c.date ? new Date(c.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }) : '—'}
                          </span>
                          <span className="cp__seance-hour">{formatHeure(c.heur)}</span>
                        </div>
                        <div className="cp__seance-info">
                          <h3>{c.nom}</h3>
                          <p>{c.description}</p>
                          <div className="cp__seance-tags">
                            {c.salle && <span className="cp__tag"><MapPin size={11} /> {c.salle}</span>}
                            <span className="cp__tag"><Users size={11} /> {nbRes}/{c.capacite || '∞'}</span>
                            {c.niveau && <span className={`cp__tag cp__tag--${c.niveau?.toLowerCase()}`}>{c.niveau}</span>}
                          </div>
                        </div>
                        <div className="cp__seance-actions">
                          <button className="btn-edit"   onClick={() => openEditForm(c)}><Edit2  size={14} /> Modifier</button>
                          <button className="btn-delete" onClick={() => handleDelete(c.id)}><Trash2 size={14} /></button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ===== RÉSERVATIONS ===== */}
          {activeTab === 'reservations' && (
            <div className="cp__reservations">
              {reservations.length === 0 ? (
                <div className="cp__empty">
                  <Inbox size={36} strokeWidth={1.3} />
                  <p>Aucune réservation</p>
                  <span>Les réservations de vos clients apparaîtront ici</span>
                </div>
              ) : (
                <div className="cp__res-list">
                  {reservations.map(r => (
                    <div key={r.id} className="cp__res-card">
                      <div className="cp__res-avatar">
  {typeof r.adherent === 'object' 
    ? r.adherent?.prenom?.[0]?.toUpperCase() 
    : '?'}
</div>
                      <div className="cp__res-info">
  <h4>
    {typeof r.adherent === 'object' 
      ? `${r.adherent?.prenom || ''} ${r.adherent?.nom || ''}` 
      : ''}
  </h4>
                        <p>{r.cours?.nom || `Cours #${r.cours_id}`}</p>
                        <span className="cp__res-date">{formatDate(r.created_at)}</span>
                      </div>
                      <div className="cp__res-right">
                        <span className={`cp__status cp__status--${r.status}`}>
                          {r.status === 'accepté'  && <><CheckCircle  size={12} /> Accepté</>}
                          {r.status === 'refusé'   && <><XCircle      size={12} /> Refusé</>}
                          {(r.status === 'confirmé' || r.status === 'en_attente') && <><AlertCircle size={12} /> En attente</>}
                        </span>
                        {(r.status === 'en_attente' || r.status === 'confirmé') && (
                          <div className="cp__res-btns">
                            <button className="cp__btn-accept" onClick={() => handleAccepter(r.id)}>
                              <CheckCircle size={13} /> Accepter
                            </button>
                            <button className="cp__btn-refuse" onClick={() => handleRefuser(r.id)}>
                              <XCircle size={13} /> Refuser
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* ===== MODAL FORM ===== */}
      {showForm && (
        <div className="cp__modal-overlay" onClick={() => setShowForm(false)}>
          <div className="cp__modal" onClick={e => e.stopPropagation()}>
            <div className="cp__modal-header">
              <h3>
                {editingCours
                  ? <><Edit2 size={16} /> Modifier la séance</>
                  : <><Plus  size={16} /> Nouvelle séance</>}
              </h3>
              <button className="btn-cancel" onClick={() => setShowForm(false)}><X size={16} /></button>
            </div>
            <div className="cp__modal-body">
              <div className="cp__form-grid">
                <div className="coach-profil__field">
                  <label>NOM DE LA SÉANCE</label>
                  <input name="nom" placeholder="Ex: Yoga matinal" value={form.nom} onChange={handleChange} />
                </div>
                <div className="coach-profil__field">
                  <label>NIVEAU</label>
                  <select name="niveau" value={form.niveau} onChange={handleChange}>
                    <option>Débutant</option>
                    <option>Intermédiaire</option>
                    <option>Avancé</option>
                  </select>
                </div>
                <div className="coach-profil__field">
                  <label>DATE</label>
                  <input name="date" type="date" value={form.date} onChange={handleChange} />
                </div>
                <div className="coach-profil__field">
                  <label>HEURE</label>
                  <input name="heur" type="time" value={form.heur} onChange={handleChange} />
                </div>
                <div className="coach-profil__field">
                  <label>SALLE</label>
                  <input name="salle" placeholder="Ex: Salle A" value={form.salle} onChange={handleChange} />
                </div>
                <div className="coach-profil__field">
                  <label>CAPACITÉ</label>
                  <input name="capacite" type="number" placeholder="20" value={form.capacite} onChange={handleChange} />
                </div>
                <div className="coach-profil__field" style={{ gridColumn: '1 / -1' }}>
                  <label>DESCRIPTION</label>
                  <textarea name="description" placeholder="Description de la séance..." value={form.description} onChange={handleChange} />
                </div>
              </div>
            </div>
            <div className="cp__modal-footer">
              <button className="btn-save" onClick={handleSubmit}>
                <Save size={15} /> {editingCours ? 'Sauvegarder' : 'Ajouter'}
              </button>
              <button className="btn-cancel" onClick={() => setShowForm(false)}>
                <X size={15} /> Annuler
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}