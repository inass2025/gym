import { useEffect, useState } from "react";
import axios from "axios";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState(null);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const adherentId = user?.id;

  useEffect(() => {
    if (!adherentId) return;
    axios.get(`http://localhost:8000/api/notifications/${adherentId}`)
      .then(res => setNotifications(res.data))
      .catch(err => setError(err.message));
  }, [adherentId]);

  if (error) return <div style={{color:"red"}}>Erreur: {error}</div>;
  if (!adherentId) return <div>Pas d'user connecté</div>;

  return (
    <div>
      <h3>Notifications ({notifications.length})</h3>
      {notifications.length === 0 && <p>Aucune notification</p>}
      {notifications.map(n => (
        <div key={n.id} style={{border:"1px solid #ccc", margin:"8px", padding:"8px"}}>
          <b>{n.type}</b> — {n.message}
        </div>
      ))}
    </div>
  );
}