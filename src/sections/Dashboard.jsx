import React, { useState, useEffect } from 'react'
import { Clock, CheckSquare, Square, Plus, X, Trash2, Pin, AlertTriangle } from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { DEFAULT_CHECKLIST, DEFAULT_NOTES } from '../data/defaults'

// Deadline: May 25 2026 23:59:00 Mérida (UTC-6) = May 26 2026 05:59:00 UTC
const DEADLINE = new Date('2026-05-26T05:59:00Z')

function useCountdown(target) {
  const [timeLeft, setTimeLeft] = useState(() => {
    const diff = target - new Date()
    return diff > 0 ? diff : 0
  })

  useEffect(() => {
    const interval = setInterval(() => {
      const diff = target - new Date()
      setTimeLeft(diff > 0 ? diff : 0)
    }, 1000)
    return () => clearInterval(interval)
  }, [target])

  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24))
  const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000)

  return { days, hours, minutes, seconds, expired: timeLeft === 0 }
}

const PHASES = [
  { id: 1, name: 'Diagnóstico', desc: 'Análisis del problema y datos', color: 'bg-info' },
  { id: 2, name: 'Solución', desc: 'Diseño y construcción del prototipo', color: 'bg-accent' },
  { id: 3, name: 'Proyección ROI', desc: 'Business Case y métricas de impacto', color: 'bg-success' },
]

const NOTE_COLORS = {
  amber: { bg: 'bg-warning/10', border: 'border-warning/30', text: 'text-warning' },
  purple: { bg: 'bg-accent/10', border: 'border-accent/30', text: 'text-accent' },
  red: { bg: 'bg-danger/10', border: 'border-danger/30', text: 'text-danger' },
  green: { bg: 'bg-success/10', border: 'border-success/30', text: 'text-success' },
}

function CountdownBlock({ label, value }) {
  const str = String(value).padStart(2, '0')
  return (
    <div className="countdown-digit">
      <div className="num">{str}</div>
      <div className="lbl">{label}</div>
    </div>
  )
}

export default function Dashboard({ phaseProgress, setPhaseProgress }) {
  const [checklist, setChecklist] = useLocalStorage('ms_checklist', DEFAULT_CHECKLIST)
  const [notes, setNotes] = useLocalStorage('ms_notes', DEFAULT_NOTES)
  const [newTask, setNewTask] = useState('')
  const [newNote, setNewNote] = useState('')
  const [newNoteColor, setNewNoteColor] = useState('purple')
  const [addingTask, setAddingTask] = useState(false)
  const [addingNote, setAddingNote] = useState(false)
  const countdown = useCountdown(DEADLINE)

  const toggleCheck = (id) => {
    setChecklist(prev => prev.map(i => i.id === id ? { ...i, done: !i.done } : i))
  }

  const addTask = () => {
    if (!newTask.trim()) return
    setChecklist(prev => [...prev, { id: `c${Date.now()}`, text: newTask.trim(), done: false }])
    setNewTask('')
    setAddingTask(false)
  }

  const removeTask = (id) => setChecklist(prev => prev.filter(i => i.id !== id))

  const addNote = () => {
    if (!newNote.trim()) return
    setNotes(prev => [...prev, { id: `n${Date.now()}`, text: newNote.trim(), color: newNoteColor }])
    setNewNote('')
    setAddingNote(false)
  }

  const removeNote = (id) => setNotes(prev => prev.filter(n => n.id !== id))

  const doneCount = checklist.filter(i => i.done).length
  const totalCount = checklist.length
  const checkProgress = totalCount ? Math.round((doneCount / totalCount) * 100) : 0

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Countdown */}
      <div className="card glow-accent">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock size={18} className="text-accent" />
            <span className="text-sm font-semibold text-text-sec uppercase tracking-wider">Deadline · 25 Mayo 2026 23:59h Mérida</span>
          </div>
          {countdown.expired && (
            <span className="badge bg-danger/20 text-danger border border-danger/30">¡Tiempo expirado!</span>
          )}
        </div>
        {!countdown.expired ? (
          <div className="flex items-end gap-6 justify-center py-4">
            <CountdownBlock label="días" value={countdown.days} />
            <span className="text-4xl font-bold text-accent/40 mb-3">:</span>
            <CountdownBlock label="horas" value={countdown.hours} />
            <span className="text-4xl font-bold text-accent/40 mb-3">:</span>
            <CountdownBlock label="min" value={countdown.minutes} />
            <span className="text-4xl font-bold text-accent/40 mb-3">:</span>
            <CountdownBlock label="seg" value={countdown.seconds} />
          </div>
        ) : (
          <div className="text-center py-6 text-danger text-2xl font-bold">
            ⏰ Plazo vencido
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Phases */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-text-main">Fases del Proyecto</h2>
          </div>
          <div className="space-y-4">
            {PHASES.map((phase) => {
              const prog = phaseProgress[phase.id] ?? 0
              return (
                <div key={phase.id}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div>
                      <span className="text-sm font-medium text-text-main">Fase {phase.id}: {phase.name}</span>
                      <p className="text-xs text-text-sec">{phase.desc}</p>
                    </div>
                    <span className="text-sm font-bold text-text-sec">{prog}%</span>
                  </div>
                  <div className="progress-track">
                    <div
                      className={`phase-bar ${phase.color}`}
                      style={{ width: `${prog}%` }}
                    />
                  </div>
                  <input
                    type="range" min="0" max="100" value={prog}
                    onChange={e => setPhaseProgress(prev => ({ ...prev, [phase.id]: Number(e.target.value) }))}
                    className="w-full mt-1 accent-[#6C63FF] cursor-pointer"
                    style={{ accentColor: '#6C63FF' }}
                  />
                </div>
              )
            })}
          </div>
        </div>

        {/* Sticky Notes */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Pin size={15} className="text-accent" />
              <h2 className="font-semibold text-text-main">Notas del Equipo</h2>
            </div>
            <button onClick={() => setAddingNote(true)} className="btn-ghost text-xs">
              <Plus size={13} /> Agregar
            </button>
          </div>

          {addingNote && (
            <div className="mb-3 space-y-2 p-3 rounded-lg bg-bg border border-border">
              <textarea
                value={newNote}
                onChange={e => setNewNote(e.target.value)}
                placeholder="Escribe la nota..."
                className="textarea h-16 text-xs"
                autoFocus
              />
              <div className="flex items-center gap-2">
                <span className="label">Color:</span>
                {Object.keys(NOTE_COLORS).map(c => (
                  <button
                    key={c}
                    onClick={() => setNewNoteColor(c)}
                    className={`w-5 h-5 rounded-full border-2 transition-all ${newNoteColor === c ? 'border-white scale-110' : 'border-transparent'}`}
                    style={{
                      backgroundColor: c === 'amber' ? '#FFA502' : c === 'purple' ? '#6C63FF' : c === 'red' ? '#FF4757' : '#2ED573'
                    }}
                  />
                ))}
                <div className="flex-1" />
                <button onClick={() => setAddingNote(false)} className="btn-ghost text-xs py-1">Cancelar</button>
                <button onClick={addNote} className="btn-primary text-xs py-1">Guardar</button>
              </div>
            </div>
          )}

          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {notes.map(note => {
              const c = NOTE_COLORS[note.color] || NOTE_COLORS.purple
              return (
                <div key={note.id} className={`sticky-note ${c.bg} border ${c.border} group`}>
                  <p className="text-xs text-text-main leading-relaxed pr-5">{note.text}</p>
                  <button
                    onClick={() => removeNote(note.id)}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-text-sec hover:text-danger transition-all"
                  >
                    <X size={12} />
                  </button>
                </div>
              )
            })}
            {notes.length === 0 && (
              <p className="text-xs text-text-sec text-center py-4">Sin notas aún</p>
            )}
          </div>
        </div>
      </div>

      {/* Checklist */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h2 className="font-semibold text-text-main">Acciones Inmediatas</h2>
            <span className="badge bg-accent/20 text-accent border border-accent/30">
              {doneCount}/{totalCount} · {checkProgress}%
            </span>
          </div>
          <button onClick={() => setAddingTask(v => !v)} className="btn-ghost text-xs">
            <Plus size={13} /> Agregar tarea
          </button>
        </div>

        {/* Progress bar */}
        <div className="progress-track mb-4">
          <div className="phase-bar bg-accent" style={{ width: `${checkProgress}%` }} />
        </div>

        {addingTask && (
          <div className="flex gap-2 mb-3">
            <input
              value={newTask}
              onChange={e => setNewTask(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') addTask(); if (e.key === 'Escape') setAddingTask(false) }}
              placeholder="Nueva acción..."
              className="input text-sm flex-1"
              autoFocus
            />
            <button onClick={addTask} className="btn-primary">Agregar</button>
            <button onClick={() => setAddingTask(false)} className="btn-ghost">Cancelar</button>
          </div>
        )}

        <div className="space-y-1 max-h-72 overflow-y-auto">
          {checklist.map(item => (
            <div
              key={item.id}
              className={`flex items-start gap-3 p-2.5 rounded-lg group transition-all cursor-pointer hover:bg-border/40 ${item.done ? 'opacity-50' : ''}`}
              onClick={() => toggleCheck(item.id)}
            >
              {item.done
                ? <CheckSquare size={16} className="text-accent shrink-0 mt-0.5" />
                : <Square size={16} className="text-text-sec shrink-0 mt-0.5" />
              }
              <span className={`text-sm flex-1 ${item.done ? 'line-through text-text-sec' : 'text-text-main'}`}>
                {item.text}
              </span>
              <button
                onClick={e => { e.stopPropagation(); removeTask(item.id) }}
                className="opacity-0 group-hover:opacity-100 text-text-sec hover:text-danger transition-all"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
