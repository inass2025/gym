import { useState, useEffect } from 'react';
import api from '../../Api/Axios.js';
import {
  Search,
  Users,
  CalendarDays,
  Filter,
  ChevronRight,
  X,
  User,
  Dumbbell,
  Salad,
  History,
  Save,
  Pencil,
  Trash2,
  Plus,
  ShieldAlert,
  CheckCircle2,
  Weight,
  Ruler,
  Phone,
  Target,
  BarChart3,
  Clock,
  MapPin,
} from 'lucide-react';
import './CoachClients.css';

const COLORS = ['#3D4F5A', '#73795D', '#5a6e78', '#8a9a7a', '#4a5568'];
const getColor = (id) => COLORS[(id || 0) % COLORS.length];

function Avatar({ nom, prenom, id, photo, size = 44 }) {
  if (photo) return (
    <img
      src={`http://localhost:8000/storage/${photo}`}
      alt=""
      style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
    />
  );
  const letter = prenom?.[0]?.toUpperCase() || nom?.[0]?.toUpperCase() || '?';
  return (
    <div
      style={{
        width: size, height: size, borderRadius: '50%',
        background: getColor(id),
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: size * 0.38, fontWeight: 700, color: '#fff', flexShrink: 0,
      }}
    >
      {letter}
    </div>
  );
}

export default function CoachClients() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [clients, setClients] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('infos');

  const [progForm, setProgForm] = useState({ titre: '', jour: 'Lundi', exercices: '', conseil: '' });
  const [progLoading, setProgLoading] = useState(false);
  const jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

  const [regimeForm, setRegimeForm] = useState({ titre: '', calories: '', proteines: '', glucides: '', lipides: '', description: '' });
  const [regimeLoading, setRegimeLoading] = useState(false);

  const [clientProgs, setClientProgs] = useState([]);
  const [clientReservations, setClientReservations] = useState([]);
  const [editingProg, setEditingProg] = useState(null);

  useEffect(() => { fetchClients(); }, []);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const [coursRes, reservRes] = await Promise.all([
        api.get('/api/cours'),
        api.get('/api/reservation'),
      ]);
      const mesCours = coursRes.data.filter(c => c.coach_id === user.id);
      const mesCoursIds = mesCours.map(c => c.id);
      const mesReservations = reservRes.data.filter(r => mesCoursIds.includes(r.cours_id));

      const map = {};
      mesReservations.forEach(r => {
        if (r.adherent && !map[r.adherent_id]) {
          map[r.adherent_id] = { ...r.adherent, reservations: [] };
        }
        if (r.adherent) map[r.adherent_id].reservations.push(r);
      });
      const list = Object.values(map);
      setClients(list);
      setFiltered(list);
    } catch (_) {}
    setLoading(false);
  };

  const handleDeleteProg = async (id) => {
    try {
      await api.delete(`/api/programmes/${id}`);
      setClientProgs(prev => prev.filter(p => p.id !== id));
    } catch (err) { console.log(err.response?.data); }
  };

  const handleUpdateProg = async () => {
    try {
      await api.put(`/api/programmes/${editingProg}`, progForm);
      setClientProgs(prev => prev.map(p =>
        p.id === editingProg ? { ...p, ...progForm } : p
      ));
      setEditingProg(null);
      setProgForm({ titre: '', jour: 'Lundi', exercices: '', conseil: '' });
    } catch (err) { console.log(err.response?.data); }
  };

  const handleSearch = (e) => {
    const val = e.target.value;
    setSearch(val);
    setFiltered(
      clients.filter(c =>
        `${c.nom} ${c.prenom} ${c.email}`.toLowerCase().includes(val.toLowerCase())
      )
    );
  };

  const openDrawer = async (client) => {
    setSelected(client);
    setDrawerOpen(true);
    setActiveTab('infos');
    try {
      const res = await api.get(`/api/programmes?adherent_id=${client.id}`);
      setClientProgs(Array.isArray(res.data) ? res.data.filter(p => p.adherent_id === client.id) : []);
    } catch (_) { setClientProgs([]); }
    setClientReservations(client.reservations || []);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setTimeout(() => setSelected(null), 300);
  };

  const handleAssignProg = async () => {
    if (!progForm.titre || !progForm.exercices) return;
    setProgLoading(true);
    try {
      await api.post('/api/programmes', { ...progForm, adherent_id: selected.id });
      const res = await api.get(`/api/programmes`);
      setClientProgs(res.data.filter(p => p.adherent_id === selected.id));
      setProgForm({ titre: '', jour: 'Lundi', exercices: '', conseil: '' });
    } catch (err) { console.log(err.response?.data); }
    setProgLoading(false);
  };

  const handleAssignRegime = async () => {
    if (!regimeForm.titre) return;
    setRegimeLoading(true);
    try {
      await api.post('/api/regimes', { ...regimeForm, adherent_id: selected.id });
      setRegimeForm({ titre: '', calories: '', proteines: '', glucides: '', lipides: '', description: '' });
      alert('Régime assigné ✅');
    } catch (err) { console.log(err.response?.data); }
    setRegimeLoading(false);
  };

  const handleBlock = async (clientId) => {
    if (!window.confirm('Bloquer ce client ?')) return;
    try {
      await api.put(`/api/adherent/${clientId}`, { statut: 'bloque' });
      setClients(prev => prev.filter(c => c.id !== clientId));
      setFiltered(prev => prev.filter(c => c.id !== clientId));
      closeDrawer();
    } catch (_) { alert('Erreur lors du blocage'); }
  };

  const handleDelete = async (clientId) => {
    if (!window.confirm('Supprimer ce client définitivement ?')) return;
    try {
      await api.delete(`/api/adherent/${clientId}`);
      setClients(prev => prev.filter(c => c.id !== clientId));
      setFiltered(prev => prev.filter(c => c.id !== clientId));
      closeDrawer();
    } catch (_) { alert('Erreur lors de la suppression'); }
  };

  const calcAge = (dob) => {
    if (!dob) return '—';
    const diff = Date.now() - new Date(dob).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  };

  const drawerTabs = [
    { key: 'infos',      icon: <User size={14} />,        label: 'Infos' },
    { key: 'programme',  icon: <Dumbbell size={14} />,    label: 'Programme' },
    { key: 'regime',     icon: <Salad size={14} />,       label: 'Régime' },
    { key: 'historique', icon: <History size={14} />,     label: 'Historique' },
  ];

  return (
    <div className="cc">
      {/* Header */}
      <div className="cc__header">
        <div>
          <h1>Mes <span>Clients</span></h1>
          <p>Gérez et suivez vos clients</p>
        </div>
        <div className="cc__search-wrap">
          <Search size={15} className="cc__search-icon" />
          <input
            className="cc__search"
            placeholder="Rechercher un client..."
            value={search}
            onChange={handleSearch}
          />
        </div>
      </div>

      {/* Stats bar */}
      <div className="cc__stats">
        <div className="cc__stat">
          <Users size={16} className="cc__stat-icon" />
          <div>
            <span className="cc__stat-val">{clients.length}</span>
            <span className="cc__stat-label">Total clients</span>
          </div>
        </div>
        <div className="cc__stat-div" />
        <div className="cc__stat">
          <CalendarDays size={16} className="cc__stat-icon" />
          <div>
            <span className="cc__stat-val">{clients.reduce((a, c) => a + (c.reservations?.length || 0), 0)}</span>
            <span className="cc__stat-label">Réservations</span>
          </div>
        </div>
        <div className="cc__stat-div" />
        <div className="cc__stat">
          <Filter size={16} className="cc__stat-icon" />
          <div>
            <span className="cc__stat-val">{filtered.length}</span>
            <span className="cc__stat-label">Résultats</span>
          </div>
        </div>
      </div>

      {/* Liste */}
      {loading ? (
        <div className="cc__loading">Chargement...</div>
      ) : filtered.length === 0 ? (
        <div className="cc__empty">
          <Users size={40} strokeWidth={1.2} />
          <p>Aucun client trouvé</p>
          <span>Vos clients apparaîtront ici une fois qu'ils réservent vos cours</span>
        </div>
      ) : (
        <div className="cc__grid">
          {filtered.map(client => (
            <div key={client.id} className="cc__card" onClick={() => openDrawer(client)}>
              <Avatar nom={client.nom} prenom={client.prenom} id={client.id} photo={client.photo} size={46} />
              <div className="cc__card-info">
                <h4>{client.prenom} {client.nom}</h4>
                <p>{client.email}</p>
                <div className="cc__card-tags">
                  {client.objectif && <span className="cc__tag">{client.objectif}</span>}
                  {client.niveau && <span className="cc__tag cc__tag--level">{client.niveau}</span>}
                  <span className="cc__tag cc__tag--res">{client.reservations?.length || 0} séance(s)</span>
                </div>
              </div>
              <ChevronRight size={16} className="cc__card-arrow" />
            </div>
          ))}
        </div>
      )}

      {/* Overlay */}
      <div className={`cc__overlay ${drawerOpen ? 'open' : ''}`} onClick={closeDrawer} />

      {/* Drawer */}
      <div className={`cc__drawer ${drawerOpen ? 'open' : ''}`}>
        {selected && (
          <>
            {/* Drawer Header */}
            <div className="cc__drawer-header">
              <Avatar nom={selected.nom} prenom={selected.prenom} id={selected.id} photo={selected.photo} size={52} />
              <div className="cc__drawer-identity">
                <h2>{selected.prenom} {selected.nom}</h2>
                <p>{selected.email}</p>
                <span className="cc__badge">CLIENT</span>
              </div>
              <button className="cc__drawer-close" onClick={closeDrawer}>
                <X size={15} />
              </button>
            </div>

            {/* Drawer Tabs */}
            <div className="cc__drawer-tabs">
              {drawerTabs.map(t => (
                <button
                  key={t.key}
                  className={`cc__drawer-tab ${activeTab === t.key ? 'active' : ''}`}
                  onClick={() => setActiveTab(t.key)}
                >
                  {t.icon}
                  {t.label}
                </button>
              ))}
            </div>

            <div className="cc__drawer-body">

              {/* TAB INFOS */}
              {activeTab === 'infos' && (
                <div className="cc__infos">
                  <div className="cc__infos-grid">
                    <div className="cc__info-item">
                      <span className="cc__info-label"><User size={10} /> ÂGE</span>
                      <span className="cc__info-val">{calcAge(selected.date_naissance)} ans</span>
                    </div>
                    <div className="cc__info-item">
                      <span className="cc__info-label"><Weight size={10} /> POIDS</span>
                      <span className="cc__info-val">{selected.poids ? `${selected.poids} kg` : '—'}</span>
                    </div>
                    <div className="cc__info-item">
                      <span className="cc__info-label"><Ruler size={10} /> TAILLE</span>
                      <span className="cc__info-val">{selected.taille ? `${selected.taille} cm` : '—'}</span>
                    </div>
                    <div className="cc__info-item">
                      <span className="cc__info-label"><BarChart3 size={10} /> NIVEAU</span>
                      <span className="cc__info-val">{selected.niveau || '—'}</span>
                    </div>
                    <div className="cc__info-item" style={{ gridColumn: '1/-1' }}>
                      <span className="cc__info-label"><Target size={10} /> OBJECTIF</span>
                      <span className="cc__info-val">{selected.objectif || '—'}</span>
                    </div>
                    <div className="cc__info-item">
                      <span className="cc__info-label"><Phone size={10} /> TÉLÉPHONE</span>
                      <span className="cc__info-val">{selected.telephone || '—'}</span>
                    </div>
                    <div className="cc__info-item">
                      <span className="cc__info-label"><CalendarDays size={10} /> INSCRIPTION</span>
                      <span className="cc__info-val">
                        {selected.date_inscription
                          ? new Date(selected.date_inscription).toLocaleDateString('fr-FR')
                          : '—'}
                      </span>
                    </div>
                  </div>

                  {user.role === 'admin' && (
                    <div className="cc__danger-zone">
                      <p className="cc__danger-title">
                        <ShieldAlert size={14} /> Zone dangereuse
                      </p>
                      <div style={{ display: 'flex', gap: 10 }}>
                        <button className="cc__btn-block" onClick={() => handleBlock(selected.id)}>
                          Bloquer
                        </button>
                        <button className="cc__btn-delete" onClick={() => handleDelete(selected.id)}>
                          <Trash2 size={13} /> Supprimer
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB PROGRAMME */}
              {activeTab === 'programme' && (
                <div className="cc__programme">
                  <p className="cc__section-title">Programmes assignés</p>
                  {clientProgs.length === 0
                    ? <p className="cc__empty-sm">Aucun programme pour ce client</p>
                    : clientProgs.map(p => (
                      <div key={p.id} className="cc__prog-item">
                        <div className="cc__prog-header">
                          <span className="cc__prog-titre">{p.titre}</span>
                          <span className="cc__prog-jour">{p.jour}</span>
                          <div style={{ display: 'flex', gap: 6, marginLeft: 'auto' }}>
                            <button className="btn-icon btn-icon--edit" onClick={() => {
                              setEditingProg(p.id);
                              setProgForm({ titre: p.titre, jour: p.jour, exercices: p.exercices, conseil: p.conseil || '' });
                            }}>
                              <Pencil size={13} />
                            </button>
                            <button className="btn-icon btn-icon--delete" onClick={() => handleDeleteProg(p.id)}>
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                        <p className="cc__prog-exercices">{p.exercices}</p>
                        {p.conseil && <p className="cc__prog-conseil">{p.conseil}</p>}
                      </div>
                    ))
                  }

                  <div className="cc__divider" />
                  <p className="cc__section-title">{editingProg ? 'Modifier le programme' : 'Nouveau programme'}</p>

                  <div className="cc__form-grid">
                    <div className="cc__field">
                      <label>TITRE</label>
                      <input placeholder="Ex: Pectoraux & Triceps" value={progForm.titre}
                        onChange={e => setProgForm({ ...progForm, titre: e.target.value })} />
                    </div>
                    <div className="cc__field">
                      <label>JOUR</label>
                      <select value={progForm.jour}
                        onChange={e => setProgForm({ ...progForm, jour: e.target.value })}>
                        {jours.map(j => <option key={j}>{j}</option>)}
                      </select>
                    </div>
                    <div className="cc__field cc__field--full">
                      <label>EXERCICES</label>
                      <textarea placeholder="Ex: Squat 4x10, Presse 3x12..." value={progForm.exercices}
                        onChange={e => setProgForm({ ...progForm, exercices: e.target.value })} />
                    </div>
                    <div className="cc__field cc__field--full">
                      <label>CONSEIL</label>
                      <textarea placeholder="Conseils personnalisés..." value={progForm.conseil}
                        onChange={e => setProgForm({ ...progForm, conseil: e.target.value })} />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="cc__btn-save"
                      onClick={editingProg ? handleUpdateProg : handleAssignProg}
                      disabled={progLoading}>
                      <Save size={14} />
                      {editingProg ? 'Modifier' : 'Assigner le programme'}
                    </button>
                    {editingProg && (
                      <button className="cc__btn-cancel" onClick={() => {
                        setEditingProg(null);
                        setProgForm({ titre: '', jour: 'Lundi', exercices: '', conseil: '' });
                      }}>
                        <X size={14} /> Annuler
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* TAB REGIME */}
              {activeTab === 'regime' && (
                <div className="cc__regime">
                  <p className="cc__section-title">Régime alimentaire</p>
                  <div className="cc__form-grid">
                    <div className="cc__field cc__field--full">
                      <label>TITRE DU RÉGIME</label>
                      <input placeholder="Ex: Prise de masse" value={regimeForm.titre}
                        onChange={e => setRegimeForm({ ...regimeForm, titre: e.target.value })} />
                    </div>
                    <div className="cc__field">
                      <label>CALORIES / JOUR</label>
                      <input type="number" placeholder="2500" value={regimeForm.calories}
                        onChange={e => setRegimeForm({ ...regimeForm, calories: e.target.value })} />
                    </div>
                    <div className="cc__field">
                      <label>PROTÉINES (g)</label>
                      <input type="number" placeholder="150" value={regimeForm.proteines}
                        onChange={e => setRegimeForm({ ...regimeForm, proteines: e.target.value })} />
                    </div>
                    <div className="cc__field">
                      <label>GLUCIDES (g)</label>
                      <input type="number" placeholder="300" value={regimeForm.glucides}
                        onChange={e => setRegimeForm({ ...regimeForm, glucides: e.target.value })} />
                    </div>
                    <div className="cc__field">
                      <label>LIPIDES (g)</label>
                      <input type="number" placeholder="80" value={regimeForm.lipides}
                        onChange={e => setRegimeForm({ ...regimeForm, lipides: e.target.value })} />
                    </div>
                    <div className="cc__field cc__field--full">
                      <label>DESCRIPTION / CONSEILS</label>
                      <textarea placeholder="Repas recommandés, horaires..." value={regimeForm.description}
                        onChange={e => setRegimeForm({ ...regimeForm, description: e.target.value })} />
                    </div>
                  </div>
                  <button className="cc__btn-save" onClick={handleAssignRegime} disabled={regimeLoading}>
                    <Save size={14} />
                    {regimeLoading ? 'Envoi...' : 'Assigner le régime'}
                  </button>
                </div>
              )}

              {/* TAB HISTORIQUE */}
              {activeTab === 'historique' && (
                <div className="cc__historique">
                  <p className="cc__section-title">Historique des séances ({clientReservations.length})</p>
                  {clientReservations.length === 0
                    ? <p className="cc__empty-sm">Aucune séance enregistrée</p>
                    : clientReservations.map(r => (
                      <div key={r.id} className="cc__seance-item">
                        <div className="cc__seance-dot" />
                        <div style={{ flex: 1 }}>
                          <p className="cc__seance-cours">{r.cours?.nom || `Cours #${r.cours_id}`}</p>
                          <span className="cc__seance-date">
                            {r.created_at
                              ? new Date(r.created_at).toLocaleDateString('fr-FR', {
                                  day: '2-digit', month: 'long', year: 'numeric'
                                })
                              : '—'}
                          </span>
                        </div>
                        <CheckCircle2 size={16} className="cc__seance-status" />
                      </div>
                    ))
                  }
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}