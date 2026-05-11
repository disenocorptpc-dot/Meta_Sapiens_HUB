import React, { useState } from 'react'
import { Trophy, CheckSquare, Square, Target } from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { DEFAULT_RUBRICA, DEFAULT_DELIVERABLES } from '../data/defaults'

const CRITERIA_COLORS = [
  { border: 'border-l-accent', bg: 'bg-accent', text: 'text-accent', glow: 'rgba(108,99,255,0.2)' },
  { border: 'border-l-info', bg: 'bg-info', text: 'text-info', glow: 'rgba(30,144,255,0.2)' },
  { border: 'border-l-warning', bg: 'bg-warning', text: 'text-warning', glow: 'rgba(255,165,2,0.2)' },
  { border: 'border-l-success', bg: 'bg-success', text: 'text-success', glow: 'rgba(46,213,115,0.2)' },
  { border: 'border-l-danger', bg: 'bg-danger', text: 'text-danger', glow: 'rgba(255,71,87,0.2)' },
]

export default function Rubrica() {
  const [rubrica, setRubrica] = useLocalStorage('ms_rubrica', DEFAULT_RUBRICA)
  const [deliverables, setDeliverables] = useLocalStorage('ms_deliverables', DEFAULT_DELIVERABLES)

  const updateCriterion = (name, field, value) => {
    setRubrica(prev => ({
      ...prev,
      [name]: { ...prev[name], [field]: value }
    }))
  }

  const toggleDeliverable = (id) => {
    setDeliverables(prev => prev.map(d => d.id === id ? { ...d, done: !d.done } : d))
  }

  const entries = Object.entries(rubrica)
  const totalPts = entries.reduce((sum, [, v]) => sum + v.maxPts, 0)
  const estimatedPts = entries.reduce((sum, [, v]) => sum + Math.round(v.maxPts * (v.progress / 100)), 0)
  const overallProgress = totalPts ? Math.round((estimatedPts / totalPts) * 100) : 0

  const doneDeliverables = deliverables.filter(d => d.done).length

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Score summary */}
      <div className="card glow-accent">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="section-title mb-1">
              <Trophy size={20} className="text-warning" />
              Rúbrica de Evaluación
            </div>
            <p className="text-xs text-text-sec">Puntaje estimado basado en avance declarado</p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-extrabold" style={{ color: estimatedPts >= 80 ? '#2ED573' : estimatedPts >= 60 ? '#FFA502' : '#FF4757' }}>
              {estimatedPts}
              <span className="text-lg text-text-sec font-normal"> / {totalPts}</span>
            </div>
            <div className="text-xs text-text-sec mt-0.5">
              {estimatedPts >= 80
                ? '✅ Por encima del mínimo para premio (80 / 97 pts)'
                : `⚠️ Faltan ${80 - estimatedPts} pts para el mínimo de 80/97`}
            </div>
          </div>
        </div>
        <div className="mt-4 progress-track">
          <div
            className={`phase-bar ${estimatedPts >= 80 ? 'bg-success' : estimatedPts >= 60 ? 'bg-warning' : 'bg-danger'}`}
            style={{ width: `${overallProgress}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-text-sec mt-1">
          <span>0</span>
          <span className="text-warning font-medium">Meta: 80 pts</span>
          <span>{totalPts}</span>
        </div>
      </div>

      {/* Criteria */}
      <div className="space-y-4">
        {entries.map(([name, data], i) => {
          const c = CRITERIA_COLORS[i % CRITERIA_COLORS.length]
          const estPts = Math.round(data.maxPts * (data.progress / 100))

          return (
            <div key={name} className={`card border-l-4 ${c.border} hover:shadow-lg transition-all`}>
              <div className="flex items-start justify-between gap-3 flex-wrap mb-3">
                <div>
                  <h3 className="font-semibold text-text-main">{name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs font-bold ${c.text}`}>
                      {estPts} pts estimados
                    </span>
                    <span className="text-xs text-text-sec">/ {data.maxPts} posibles</span>
                  </div>
                </div>
                <div className={`text-2xl font-extrabold ${c.text}`}>
                  {data.progress}%
                </div>
              </div>

              {/* Progress slider */}
              <div className="space-y-2">
                <div className="progress-track">
                  <div className={`phase-bar ${c.bg}`} style={{ width: `${data.progress}%` }} />
                </div>
                <input
                  type="range" min="0" max="100" value={data.progress}
                  onChange={e => updateCriterion(name, 'progress', Number(e.target.value))}
                  className="w-full cursor-pointer"
                  style={{ accentColor: c.text.replace('text-', '') === 'accent' ? '#6C63FF' : undefined }}
                />
              </div>

              {/* Notes */}
              <div className="mt-3">
                <textarea
                  value={data.notes}
                  onChange={e => updateCriterion(name, 'notes', e.target.value)}
                  placeholder="Notas sobre el avance, qué falta, evidencias..."
                  className="textarea h-14 text-xs"
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* Deliverables checklist */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="section-title">
              <Target size={20} className="text-accent" />
              Entregables Finales
            </div>
            <span className="badge bg-accent/20 text-accent border border-accent/30">
              {doneDeliverables}/{deliverables.length}
            </span>
          </div>
        </div>

        <div className="progress-track mb-4">
          <div
            className="phase-bar bg-accent"
            style={{ width: `${deliverables.length ? Math.round((doneDeliverables / deliverables.length) * 100) : 0}%` }}
          />
        </div>

        <div className="space-y-1">
          {deliverables.map(d => (
            <div
              key={d.id}
              onClick={() => toggleDeliverable(d.id)}
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all hover:bg-border/40 ${d.done ? 'opacity-60' : ''}`}
            >
              {d.done
                ? <CheckSquare size={16} className="text-accent shrink-0" />
                : <Square size={16} className="text-text-sec shrink-0" />
              }
              <span className={`text-sm ${d.done ? 'line-through text-text-sec' : 'text-text-main'}`}>
                {d.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
