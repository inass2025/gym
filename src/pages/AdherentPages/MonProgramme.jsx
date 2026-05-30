import { useState, useEffect } from "react"
import api from "./api"
import "./MonProgramme.css"  // 👈 importe le CSS

export default function MonProgramme() {

  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [erreur, setErreur]   = useState(null)

  useEffect(() => {
    api.get("/mon-programme")
      .then(response => {
        setData(response.data)
        setLoading(false)
      })
      .catch(error => {
        setErreur("Erreur de chargement")
        setLoading(false)
      })
  }, [])

  if (loading) return <div className="loading">Chargement...</div>
  if (erreur)  return <div className="erreur">{erreur}</div>
  



if (!data) return <div className="loading">Chargement...</div>
  return (
    <div className="programme-page">

      {/* Header */}
      <div className="programme-header">
        <h1>Bonjour {data.adherent.prenom} 👋</h1>
        <p>Bienvenue dans ton espace entraînement</p>
        {data.adherent.objectif && (
          <span className="objectif-badge">
            🎯 {data.adherent.objectif}
          </span>
        )}
      </div>

      {/* Titre section */}
      <h2 className="section-title">Mon Programme</h2>

      {/* Aucun programme */}
      {data.programmes.length === 0 && (
        <div className="empty-message">
          Ton coach n'a pas encore créé ton programme.
        </div>
      )}

      {/* Grille des programmes */}
      <div className="programmes-grid">
        {data.programmes.map((prog, i) => (
          <div key={i} className="programme-card">

            <div className="card-header">
              <span className="card-jour">{prog.jour}</span>
            </div>

            <p className="card-titre">{prog.titre}</p>

            <div className="card-exercices">
              {prog.exercices}
            </div>

            {prog.conseil && (
              <div className="card-conseil">
                <span>💡</span>
                <span>{prog.conseil}</span>
              </div>
            )}

            <div className="card-coach">
  <div className="coach-avatar">
    {prog.coach?.prenom?.[0] || ''}{prog.coach?.nom?.[0] || ''}
  </div>
  Par {String(prog.coach?.prenom || '')} {String(prog.coach?.nom || '')}
</div>

          </div>
        ))}
      </div>

    </div>
  )
}