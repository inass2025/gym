import { useEffect, useState } from "react";
import axios from "axios";
import "./NotificationBell.css";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const adherentId = user?.id;

  useEffect(() => {
    if (!adherentId) return;
    axios
      .get(`http://localhost:8000/api/notifications/${adherentId}`)
      .then((res) => setNotifications(res.data))
      .catch(console.error);
  }, [adherentId]);

  const getStatus = (sub) => {
    if (!sub) return null;
    const diff = Math.ceil((new Date(sub.fin) - new Date()) / 86400000);
    if (diff < 0) return { label: "Expiré", cls: "pill-expired" };
    if (diff <= 7) return { label: `Expire dans ${diff}j`, cls: "pill-expiring" };
    return { label: "Actif", cls: "pill-active" };
  };

  const getIcon = (type, sub) => {
    if (type === "expiration") {
      const s = getStatus(sub);
      if (s?.cls === "pill-expired") return { cls: "ic-danger", icon: "ti-alert-circle" };
      return { cls: "ic-warn", icon: "ti-clock" };
    }
    if (type === "paiement") return { cls: "ic-ok", icon: "ti-circle-check" };
    return { cls: "ic-info", icon: "ti-info-circle" };
  };

  const relativeTime = (iso) => {
    const diff = (Date.now() - new Date(iso)) / 1000;
    if (diff < 3600) return `${Math.floor(diff / 60)}min`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    return `${Math.floor(diff / 86400)}j`;
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="nb-wrapper">
      <button
        className="nb-bell-btn"
        onClick={() => setOpen((o) => !o)}
        aria-label="Notifications"
      >
        <i className="ti ti-bell" />
        {unreadCount > 0 && <span className="nb-dot" />}
      </button>

      {open && (
        <div className="nb-panel">
          <div className="nb-panel-head">
            <i className="ti ti-bell" />
            <span>Notifications</span>
            {unreadCount > 0 && (
              <span className="nb-count">{unreadCount} nouvelles</span>
            )}
          </div>

          {notifications.length === 0 && (
            <div className="nb-empty">Aucune notification</div>
          )}

          {notifications.map((n) => {
            const { cls, icon } = getIcon(n.type, n.subscription);
            const status = getStatus(n.subscription);
            const sub = n.subscription;
            return (
              <div key={n.id} className="nb-notif">
                <div className={`nb-icon ${cls}`}>
                  <i className={`ti ${icon}`} />
                </div>
                <div className="nb-body">
                  <p className="nb-msg">{n.message}</p>
                  <div className="nb-meta">
                    {status && (
                      <span className={`nb-pill ${status.cls}`}>
                        {status.label}
                      </span>
                    )}
                    {sub && (
                      <span className="nb-dates">
                        <i className="ti ti-calendar" />
                        {formatDate(sub.debut)} → {formatDate(sub.fin)} · {sub.plan}
                      </span>
                    )}
                  </div>
                </div>
                <span className="nb-time">{relativeTime(n.created_at)}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}