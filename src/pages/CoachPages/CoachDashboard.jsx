import { useEffect, useState } from 'react';
import api from '../../Api/Axios.js';
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  Dumbbell,
  TrendingUp,
  Target,
  Trophy,
  Zap,
  Clock,
  MapPin,
  ChevronRight
} from 'lucide-react';
import './CoachDashboard.css';

const COLORS = ['#3D4F5A', '#73795D', '#5a6e78', '#8a9a7a', '#2E2C26'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="cd-tooltip">
        <p className="cd-tooltip__label">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }}>{p.name}: <strong>{p.value}</strong></p>
        ))}
      </div>
    );
  }
  return null;
};

export default function CoachDashboard() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [stats, setStats] = useState({
    cours: 0, participants: 0, reservations: 0, programmes: 0,
  });
  const [reservationsParMois, setReservationsParMois] = useState([]);
  const [coursParNiveau, setCoursParNiveau] = useState([]);
  const [topClients, setTopClients] = useState([]);
  const [seancesAujourdhui, setSeancesAujourdhui] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [coursRes, resRes, progRes] = await Promise.all([
        api.get('/api/cours'),
        api.get('/api/reservation'),
        api.get('/api/programmes'),
      ]);

      const mesCours = coursRes.data.filter(c => c.coach_id === user.id);
      const mesCoursIds = mesCours.map(c => c.id);
      const mesRes = resRes.data.filter(r => mesCoursIds.includes(r.cours_id));
      const mesProgs = progRes.data;

      const participantsUniques = new Set(mesRes.map(r => r.adherent_id)).size;
      setStats({
        cours: mesCours.length,
        participants: participantsUniques,
        reservations: mesRes.length,
        programmes: mesProgs.length,
      });

      const moisLabels = ['Jan','Fév','Mar','Avr','Mai','Jun','Jul','Aoû','Sep','Oct','Nov','Déc'];
      const now = new Date();
      const parMois = [];
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const mois = d.getMonth();
        const annee = d.getFullYear();
        const count = mesRes.filter(r => {
          const rd = new Date(r.created_at);
          return rd.getMonth() === mois && rd.getFullYear() === annee;
        }).length;
        parMois.push({ mois: moisLabels[mois], reservations: count });
      }
      setReservationsParMois(parMois);

      const niveaux = {};
      mesCours.forEach(c => {
        const n = c.niveau || 'Non défini';
        niveaux[n] = (niveaux[n] || 0) + 1;
      });
      setCoursParNiveau(Object.entries(niveaux).map(([name, value]) => ({ name, value })));

      const clientMap = {};
      mesRes.forEach(r => {
        if (r.adherent) {
          const key = r.adherent_id;
          if (!clientMap[key]) clientMap[key] = { ...r.adherent, count: 0 };
          clientMap[key].count++;
        }
      });
      const sorted = Object.values(clientMap).sort((a, b) => b.count - a.count).slice(0, 5);
      setTopClients(sorted);

      const today = new Date().toISOString().split('T')[0];
      setSeancesAujourdhui(mesCours.filter(c => c.date?.startsWith(today)));

    } catch (_) {}
    setLoading(false);
  };

  const todayFr = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long'
  });

  const statCards = [
    { icon: <LayoutDashboard size={22} />, label: 'Mes Cours', value: stats.cours, color: '#3D4F5A' },
    { icon: <Users size={22} />, label: 'Clients', value: stats.participants, color: '#73795D' },
    { icon: <CalendarDays size={22} />, label: 'Réservations', value: stats.reservations, color: '#5a6e78' },
    { icon: <Dumbbell size={22} />, label: 'Programmes', value: stats.programmes, color: '#8a9a7a' },
  ];

  return (
    <div className="coach-dashboard">
      {/* Header */}
      <div className="coach-dashboard__header">
        <div>
          <h1>Bonjour, <span>{user.prenom} {user.nom}</span></h1>
          <p className="cd-date">{todayFr}</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="coach-dashboard__cards">
        {statCards.map((s, i) => (
          <div className="dash-card" key={i}>
            <div className="dash-card__icon-wrap" style={{ background: `${s.color}22`, color: s.color }}>
              {s.icon}
            </div>
            <div>
              <p className="dash-card__label">{s.label}</p>
              <h2 className="dash-card__value" style={{ color: s.color }}>{s.value}</h2>
            </div>
            <ChevronRight size={16} className="dash-card__arrow" />
          </div>
        ))}
      </div>

      {/* Graphiques row 1 */}
      <div className="cd-charts-row">
        {/* Réservations par mois */}
        <div className="cd-chart-card cd-chart-card--large">
          <div className="cd-chart-header">
            <TrendingUp size={18} />
            <h3 className="cd-chart-title">Réservations — 6 derniers mois</h3>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={reservationsParMois}>
              <defs>
                <linearGradient id="colorRes" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3D4F5A" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#3D4F5A" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="mois" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="reservations" name="Réservations" stroke="#3D4F5A" strokeWidth={2.5} fill="url(#colorRes)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Cours par niveau */}
        <div className="cd-chart-card">
          <div className="cd-chart-header">
            <Target size={18} />
            <h3 className="cd-chart-title">Cours par niveau</h3>
          </div>
          {coursParNiveau.length === 0 ? (
            <div className="cd-empty">Aucun cours</div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={coursParNiveau}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {coursParNiveau.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          )}
          <div className="cd-legend">
            {coursParNiveau.map((item, i) => (
              <div key={i} className="cd-legend-item">
                <span className="cd-legend-dot" style={{ background: COLORS[i % COLORS.length] }} />
                <span>{item.name}</span>
                <span className="cd-legend-val">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2 */}
      <div className="cd-charts-row">
        {/* Top clients */}
        <div className="cd-chart-card">
          <div className="cd-chart-header">
            <Trophy size={18} />
            <h3 className="cd-chart-title">Top clients</h3>
          </div>
          {topClients.length === 0 ? (
            <div className="cd-empty">Aucun client</div>
          ) : (
            <div className="cd-top-clients">
              {topClients.map((c, i) => (
                <div key={c.id} className="cd-client-row">
                  <span className="cd-client-rank" style={{
                    color: i === 0 ? '#8a9a7a' : i === 1 ? '#94a3b8' : i === 2 ? '#73795D' : 'rgba(255,255,255,0.25)'
                  }}>
                    #{i + 1}
                  </span>
                  <div className="cd-client-avatar">
                    {c.prenom?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div className="cd-client-info">
                    <span className="cd-client-name">
  {typeof c === 'object' ? `${c.prenom || ''} ${c.nom || ''}` : ''}
</span>
                    <span className="cd-client-sub">{c.count} séance(s)</span>
                  </div>
                  <div className="cd-client-bar-wrap">
                    <div
                      className="cd-client-bar"
                      style={{ width: `${(c.count / (topClients[0]?.count || 1)) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Séances aujourd'hui */}
        <div className="cd-chart-card cd-chart-card--large">
          <div className="cd-chart-header">
            <Zap size={18} />
            <h3 className="cd-chart-title">Séances aujourd'hui</h3>
          </div>
          {seancesAujourdhui.length === 0 ? (
            <div className="cd-empty">Aucune séance aujourd'hui</div>
          ) : (
            <div className="cd-seances">
              {seancesAujourdhui.map(s => (
                <div key={s.id} className="cd-seance-item">
                  <div className="cd-seance-time">
                    <Clock size={13} />
                    {s.heur?.slice(0, 5) || '—'}
                  </div>
                  <div className="cd-seance-info">
                    <p>{s.nom}</p>
                    <span>
                      {s.salle && (
                        <><MapPin size={11} style={{ display:'inline', marginRight:3 }} />{s.salle}</>
                      )}
                      {s.capacite && ` · ${s.capacite} places`}
                    </span>
                  </div>
                  <span className={`cd-seance-niveau cd-niveau--${s.niveau?.toLowerCase()}`}>{s.niveau}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}