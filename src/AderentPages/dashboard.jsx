import { useEffect, useState } from "react";
import api from "./api";
import "./Dashboard.css";

const MONTHS = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];
const DAYS_SHORT = ["Lu","Ma","Me","Je","Ve","Sa","Di"];

export default function AdherentDashboard() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [abonnements, setAbonnements] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [calMonth, setCalMonth] = useState(new Date().getMonth());
  const [calYear, setCalYear] = useState(new Date().getFullYear());

  useEffect(() => {
    api.get("/abonnements").then(r => setAbonnements(r.data)).catch(() => {});
    api.get("/my-reservations").then(r => setReservations(r.data)).catch(() => {});
  }, []);

  const aboActif = abonnements.find(a => a.statut === "actif");
  const daysLeft = aboActif
    ? Math.round((new Date(aboActif.date_fin) - new Date()) / (1000*60*60*24))
    : 0;
  const pct = aboActif
    ? Math.round(((new Date() - new Date(aboActif.date_debut)) /
        (new Date(aboActif.date_fin) - new Date(aboActif.date_debut))) * 100)
    : 0;

  const eventDates = reservations.map(r => r.date_reservation);

  function buildCalendar() {
    const first = new Date(calYear, calMonth, 1);
    const lastDay = new Date(calYear, calMonth + 1, 0).getDate();
    const startDow = (first.getDay() + 6) % 7;
    const prevLast = new Date(calYear, calMonth, 0).getDate();
    const today = new Date();
    const cells = [];

    for (let i = startDow - 1; i >= 0; i--)
      cells.push({ day: prevLast - i, current: false });
    for (let d = 1; d <= lastDay; d++) {
      const iso = `${calYear}-${String(calMonth+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
      cells.push({
        day: d, current: true,
        isToday: today.getDate()===d && today.getMonth()===calMonth && today.getFullYear()===calYear,
        hasEvent: eventDates.includes(iso),
      });
    }
    const rem = (startDow + lastDay) % 7;
    if (rem > 0) for (let i = 1; i <= 7-rem; i++) cells.push({ day: i, current: false });
    return cells;
  }

  const fmtDate = d => { if(!d) return "—"; const [y,m,j]=d.split("-"); return `${j}/${m}/${y}`; };
  const initials = `${user.prenom?.[0]||""}${user.nom?.[0]||""}`.toUpperCase();

  return (
    <div className="adh-dash">
      {/* Topbar */}
      <div className="adh-topbar">
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div className="adh-avatar">{initials}</div>
          <div>
            <h1 className="adh-greeting">Bonjour, {user.prenom} {user.nom} 👋</h1>
            <p className="adh-date">{new Date().toLocaleDateString("fr-FR",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}</p>
          </div>
        </div>
        
      </div>

      {/* Stats */}
      <div className="adh-stats">
        <div className="adh-stat">
          <div className="adh-stat-label">Abonnement</div>
          <div className="adh-stat-val pink">{aboActif ? aboActif.type : "—"}</div>
          <div className="adh-stat-sub">{aboActif ? "actif" : "aucun"}</div>
        </div>
        <div className="adh-stat">
          <div className="adh-stat-label">Réservations</div>
          <div className="adh-stat-val blue">{reservations.length}</div>
          <div className="adh-stat-sub">cette période</div>
        </div>
        <div className="adh-stat">
          <div className="adh-stat-label">Jours restants</div>
          <div className="adh-stat-val green">{daysLeft > 0 ? daysLeft : "—"}</div>
          <div className="adh-stat-sub">fin d'abonnement</div>
        </div>
        <div className="adh-stat">
          <div className="adh-stat-label">Cours réservés</div>
          <div className="adh-stat-val">{reservations.length}</div>
          <div className="adh-stat-sub">total</div>
        </div>
      </div>

      {/* Row 2 */}
      <div className="adh-row2">
        {/* Calendrier */}
        <div className="adh-card">
          <div className="adh-card-title">📅 Calendrier</div>
          <div className="adh-cal-header">
            <span className="adh-cal-month">{MONTHS[calMonth]} {calYear}</span>
            <div className="adh-cal-nav">
              <button onClick={() => { let m=calMonth-1,y=calYear; if(m<0){m=11;y--;} setCalMonth(m);setCalYear(y); }}>‹</button>
              <button onClick={() => { let m=calMonth+1,y=calYear; if(m>11){m=0;y++;} setCalMonth(m);setCalYear(y); }}>›</button>
            </div>
          </div>
          <div className="adh-cal-grid">
            {DAYS_SHORT.map(d => <div key={d} className="adh-cal-day-name">{d}</div>)}
            {buildCalendar().map((c,i) => (
              <div key={i} className={`adh-cal-day ${!c.current?"other":""} ${c.isToday?"today":""} ${c.hasEvent?"has-event":""}`}>
                {c.day}
              </div>
            ))}
          </div>
        </div>

        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {/* Abonnement */}
          <div className="adh-card">
            <div className="adh-card-title">🎫 Mon abonnement</div>
            {aboActif ? (
              <div className="adh-abo">
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <span className="adh-abo-type">{aboActif.type}</span>
                  <span className={`adh-badge ${aboActif.statut}`}>{aboActif.statut}</span>
                </div>
                <div className="adh-abo-detail">📆 {fmtDate(aboActif.date_debut)} → {fmtDate(aboActif.date_fin)}</div>
                <div className="adh-abo-detail">💰 {aboActif.prix} MAD</div>
                <div className="adh-progress-bar">
                  <div className="adh-progress-fill" style={{width:`${Math.min(pct,100)}%`}}></div>
                </div>
                <div className="adh-progress-label">{pct}% écoulé</div>
              </div>
            ) : <p className="adh-empty">Aucun abonnement actif</p>}
          </div>

          {/* Profil rapide */}
          <div className="adh-card">
            <div className="adh-card-title">👤 Profil rapide</div>
            <div className="adh-profile">
              <div className="adh-profile-row"><span>⚖️ Poids</span><span>{user.poids ? `${user.poids} kg` : "—"}</span></div>
              <div className="adh-profile-row"><span>📏 Taille</span><span>{user.taille ? `${user.taille} cm` : "—"}</span></div>
              <div className="adh-profile-row"><span>📅 Inscription</span><span>{fmtDate(user.date_inscription)}</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Réservations */}
      <div className="adh-card" style={{marginTop:12}}>
        <div className="adh-card-title">✅ Mes réservations</div>
        {reservations.length === 0
          ? <p className="adh-empty">Aucune réservation</p>
          : reservations.map(r => (
            <div key={r.id} className="adh-reserv-item">
              <div className={`adh-dot ${r.status}`}></div>
              <div className="adh-reserv-info">
                <div className="adh-reserv-name">Cours #{r.cours_id}</div>
                <div className="adh-reserv-date">{fmtDate(r.date_reservation)}</div>
              </div>
              <span className={`adh-badge ${r.status}`}>{r.status}</span>
            </div>
          ))}
      </div>
    </div>
  );
}