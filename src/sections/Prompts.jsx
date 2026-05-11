import React, { useState } from 'react'
import { Brain, Plus, X, Copy, Check, ChevronDown, ChevronUp, Edit2, Tag } from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { DEFAULT_PROMPTS, PROMPT_CATEGORIES, PROMPT_MODELS } from '../data/defaults'

const CAT_COLORS = {
  'Extracción datos': 'bg-info/10 text-info border-info/30',
  'Validación': 'bg-success/10 text-success border-success/30',
  'Generación output': 'bg-accent/10 text-accent border-accent/30',
  'Anonimización': 'bg-danger/10 text-danger border-danger/30',
  'Testing': 'bg-warning/10 text-warning border-warning/30',
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback
      const el = document.createElement('textarea')
      el.value = text
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <button
      onClick={handleCopy}
      className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all ${
        copied
          ? 'bg-success/20 text-success border-success/30'
          : 'bg-border/50 text-text-sec hover:text-text-main hover:border-accent/40 border-border'
      }`}
    >
      {copied ? <Check size={12} /> : <Copy size={12} />}
      {copied ? 'Copiado!' : 'Copiar'}
    </button>
  )
}

function Modal({ onClose, onSave, initial }) {
  const [form, setForm] = useState(initial || {
    name: '', category: 'Extracción datos', text: '', model: 'Claude Sonnet', notes: ''
  })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal max-w-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-text-main">{initial ? 'Editar prompt' : 'Nuevo prompt'}</h3>
          <button onClick={onClose} className="text-text-sec hover:text-text-main"><X size={18} /></button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="label block mb-1">Nombre *</label>
            <input value={form.name} onChange={e => set('name', e.target.value)} className="input" placeholder="Ej. Extractor de fechas de reserva" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label block mb-1">Categoría</label>
              <select value={form.category} onChange={e => set('category', e.target.value)} className="select">
                {PROMPT_CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="label block mb-1">Modelo recomendado</label>
              <select value={form.model} onChange={e => set('model', e.target.value)} className="select">
                {PROMPT_MODELS.map(m => <option key={m}>{m}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="label block mb-1">Texto del prompt *</label>
            <textarea value={form.text} onChange={e => set('text', e.target.value)} className="textarea h-48 font-mono text-xs" placeholder="Escribe el prompt aquí..." />
          </div>
          <div>
            <label className="label block mb-1">Notas de uso</label>
            <textarea value={form.notes} onChange={e => set('notes', e.target.value)} className="textarea h-16" placeholder="Contexto, limitaciones, cuándo usar..." />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-5">
          <button onClick={onClose} className="btn-ghost">Cancelar</button>
          <button
            onClick={() => { if (form.name.trim() && form.text.trim()) onSave(form) }}
            disabled={!form.name.trim() || !form.text.trim()}
            className="btn-primary disabled:opacity-40"
          >
            <Check size={14} /> {initial ? 'Actualizar' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  )
}

function PromptCard({ prompt, onEdit, onDelete }) {
  const [expanded, setExpanded] = useState(false)
  const preview = prompt.text.slice(0, 200)
  const hasMore = prompt.text.length > 200

  return (
    <div className="prompt-card">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-text-main">{prompt.name}</h3>
            <span className={`badge border text-xs ${CAT_COLORS[prompt.category] || 'bg-border text-text-sec border-border'}`}>
              {prompt.category}
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <Tag size={10} className="text-text-sec" />
            <span className="text-xs text-text-sec">{prompt.model}</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <CopyButton text={prompt.text} />
          <button onClick={() => onEdit(prompt)} className="btn-ghost text-xs py-1.5 px-2">
            <Edit2 size={12} />
          </button>
          <button onClick={() => onDelete(prompt.id)} className="btn-ghost text-xs py-1.5 px-2 hover:text-danger">
            <X size={12} />
          </button>
        </div>
      </div>

      {/* Prompt preview */}
      <div className="mt-3 bg-bg rounded-lg border border-border p-3">
        <pre className="text-xs text-text-sec font-mono whitespace-pre-wrap leading-relaxed">
          {expanded ? prompt.text : preview}{!expanded && hasMore && '...'}
        </pre>
        {hasMore && (
          <button
            onClick={() => setExpanded(v => !v)}
            className="flex items-center gap-1 text-xs text-accent hover:underline mt-2"
          >
            {expanded ? <><ChevronUp size={12} /> Colapsar</> : <><ChevronDown size={12} /> Ver completo</>}
          </button>
        )}
      </div>

      {prompt.notes && (
        <p className="mt-2 text-xs text-text-sec border-t border-border pt-2 leading-relaxed">
          💡 {prompt.notes}
        </p>
      )}
    </div>
  )
}

export default function Prompts() {
  const [prompts, setPrompts] = useLocalStorage('ms_prompts', DEFAULT_PROMPTS)
  const [showModal, setShowModal] = useState(false)
  const [editingPrompt, setEditingPrompt] = useState(null)
  const [filterCat, setFilterCat] = useState('Todas')

  const categories = ['Todas', ...PROMPT_CATEGORIES]
  const filtered = filterCat === 'Todas' ? prompts : prompts.filter(p => p.category === filterCat)

  const savePrompt = (form) => {
    if (editingPrompt) {
      setPrompts(prev => prev.map(p => p.id === editingPrompt.id ? { ...form, id: editingPrompt.id } : p))
    } else {
      setPrompts(prev => [...prev, { ...form, id: `p${Date.now()}` }])
    }
    setShowModal(false)
    setEditingPrompt(null)
  }

  const deletePrompt = (id) => setPrompts(prev => prev.filter(p => p.id !== id))
  const openEdit = (prompt) => { setEditingPrompt(prompt); setShowModal(true) }

  return (
    <div className="space-y-5 animate-fade-in">
      {showModal && (
        <Modal
          onClose={() => { setShowModal(false); setEditingPrompt(null) }}
          onSave={savePrompt}
          initial={editingPrompt}
        />
      )}

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="section-title">
          <Brain size={20} className="text-accent" />
          Prompts Master
          <span className="text-sm text-text-sec font-normal">({prompts.length})</span>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <Plus size={15} /> Agregar prompt
        </button>
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        {categories.map(c => (
          <button
            key={c}
            onClick={() => setFilterCat(c)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
              filterCat === c
                ? 'bg-accent text-white border-accent'
                : 'bg-card border-border text-text-sec hover:text-text-main hover:border-accent/40'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Prompts */}
      <div className="space-y-4">
        {filtered.length === 0 && (
          <div className="card text-center py-10">
            <Brain size={32} className="text-text-sec mx-auto mb-2 opacity-40" />
            <p className="text-text-sec text-sm">No hay prompts en esta categoría</p>
          </div>
        )}
        {filtered.map(prompt => (
          <PromptCard
            key={prompt.id}
            prompt={prompt}
            onEdit={openEdit}
            onDelete={deletePrompt}
          />
        ))}
      </div>
    </div>
  )
}
