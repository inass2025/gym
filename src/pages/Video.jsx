// VideoSection.jsx
import { useState, useRef } from "react";
import "./video.css";

const VIDEOS = [
  { id: 1, label: "Growing Better",     sub: "Culture",    title: "Growing Better",      src: "/video/v1.mp4" },
  { id: 2, label: "Elevate Your Life",  sub: "Motivation", title: "Elevate Your Life",   src: "/video/v2.mp4" },
  { id: 3, label: "Transform Yourself", sub: "Musculation",title: "Transform Yourself", src: "/video/v3.mp4" },
  { id: 4, label: "Fitness Journey",    sub: "Cardio",     title: "Fitness Journey",     src: "votre-video.mp4" },
  { id: 5, label: "Stronger Every Day", sub: "Progression",title: "Stronger Every Day",  src: "votre-video.mp4" },
];

export default function VideoSection() {
  const [index,    setIndex]    = useState(2);     // onglet actif
  const [playing,  setPlaying]  = useState(false); // en lecture ?
  const [muted,    setMuted]    = useState(true);  // son coupé ?
  const [progress, setProgress] = useState(0);     // % avancement

  const videoRef  = useRef(null);
  const playerRef = useRef(null);

  const video = VIDEOS[index]; // vidéo courante

  // ── Changer de vidéo ──
  function switchVideo(i) {
    setIndex(i);
    setPlaying(false);
    setProgress(0);
    videoRef.current.pause();
    videoRef.current.load();
  }

  // ── Play / Pause ──
  function togglePlay() {
    if (playing) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setPlaying(!playing);
  }

  // ── Mute ──
  function toggleMute(e) {
    e.stopPropagation();
    videoRef.current.muted = !muted;
    setMuted(!muted);
  }

  // ── Plein écran ──
  function toggleFullscreen(e) {
    e.stopPropagation();
    if (!document.fullscreenElement) {
      playerRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }

  // ── Mise à jour barre de progression ──
  function handleTimeUpdate() {
    const vid = videoRef.current;
    setProgress((vid.currentTime / vid.duration) * 100);
  }

  return (
    <section className="vs-section">

      {/* GAUCHE */}
      <div className="vs-left">
        <h2 className="vs-heading">Discover More <span>About Us</span></h2>
        <p className="vs-tagline">
          Coachs certifiés, équipements de pointe, programmes personnalisés.
        </p>
        <button className="vs-cta">Voir toutes les vidéos →</button>
      </div>

      {/* PLAYER */}
      <div className="vs-player" ref={playerRef} onClick={togglePlay}>

        <video
          ref={videoRef}
          className="vs-video"
          src={video.src}
          muted={muted}
          playsInline
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => { setPlaying(false); setProgress(0); }}
        />

        {/* Poster visible quand pas en lecture */}
        {!playing && (
          <div className="vs-poster">
            <div className="vs-poster-bg" />
            <div className="vs-poster-icon">▶</div>
          </div>
        )}

        {/* Boutons haut droite */}
        <div className="vs-controls">
          <button className="vs-ctrl" onClick={toggleMute}>
            {muted ? "🔇" : "🔊"}
          </button>
          <button className="vs-ctrl" onClick={toggleFullscreen}>⛶</button>
        </div>

        {/* Titre + bouton bas */}
        <div className="vs-info">
          <p className="vs-title">{video.title}</p>
          <button className="vs-watch-btn" onClick={(e) => { e.stopPropagation(); togglePlay(); }}>
            {playing ? "⏸ Pause" : "▶ Watch Full Video"}
          </button>
        </div>

        {/* Barre de progression */}
        <div className="vs-progress-wrap">
          <div className="vs-progress" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* ONGLETS DROITE */}
      <div className="vs-tabs">
        {VIDEOS.map((v, i) => (
          <button
            key={v.id}
            className={`vs-tab ${i === index ? "active" : ""}`}
            onClick={() => switchVideo(i)}
          >
            <span className="vs-tab-label">{v.label}</span>
            <span className="vs-tab-sub">{v.sub}</span>
          </button>
        ))}
      </div>

    </section>
  );
}