import React, { useState } from 'react'
import { Link as LinkIcon, Plus, X, ExternalLink, Check, Edit2 } from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { DEFAULT_LINKS, LINK_CATEGORIES } from '../data/defaults'

const CAT_ICONS = {
  'Prototipo': '🔗',
  'Herramienta': '🛠️',
  'Referencia técnica': '📚',
  'Entrega final': '📤',
  'Otro': '🌐',
}

const CAT_COLORS = {
  'Prototipo': 'bg-accent/10 text-accent border-accent/30',
  'Herramienta': 'bg-info/10 text-info border-info/30',
  'Referencia técnica': 'bg-warning/10 text-warning border-warning/30',
  'Entrega final': 'bg-success/10 text-success border-success/30',
  'Otro': 'bg-border text-text-sec border-border',
}

function Modal({ onClose, onSave, initial }) {
  const [form, setForm] = useState(initial || { title: '', url: '', category: 'Herramienta', description: '', date: new Date().toISOString().split('T')[0] })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-text-main">{initial ? 'Editar link' : 'Nuevo link'}</h3>
          <button onClick={onClose} className="text-text-sec hover:text-text-main"><X size={18} /></button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="label block mb-1">Título *</label>
            <input value={form.title} onChange={e => set('title', e.target.value)} className="input" placeholder="Ej. Prototipo v1.0" />
          </div>
          <div>
            <label className="label block mb-1">URL *</label>
            <input value={form.url} onChange={e => set('url', e.target.value)} className="input" placeholder="https://..." />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label block mb-1">Categoría</label>
              <select value={form.category} onChange={e => set('category', e.target.value)} className="select">
                {LINK_CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="label block mb-1">Fecha</label>
              <input type="date" value={form.date} onChange={e => set('date', e.target.value)} className="input" />
            </div>
          </div>
          <div>
            <label className="label block mb-1">Descripción corta</label>
            <input value={form.description} onChange={e => set('description', e.target.value)} className="input" placeholder="Para qué sirve este link..." />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-5">
          <button onClick={onClose} className="btn-ghost">Cancelar</button>
          <button
            onClick={() => { if (form.title.trim() && form.url.trim()) onSave(form) }}
            disabled={!form.title.trim() || !form.url.trim()}
            className="btn-primary disabled:opacity-40"
          >
            <Check size={14} /> {initial ? 'Actualizar' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Links() {
  const [links, setLinks] = useLocalStorage('ms_links', DEFAULT_LINKS)
  const [showModal, setShowModal] = useState(false)
  const [editingLink, setEditingLink] = useState(null)
  const [filterCat, setFilterCat] = useState('Todas')

  const categories = ['Todas', ...LINK_CATEGORIES]
  const filtered = filterCat === 'Todas' ? links : links.filter(l => l.category === filterCat)

  const saveLink = (form) => {
    if (editingLink) {
      setLinks(prev => prev.map(l => l.id === editingLink.id ? { ...form, id: editingLink.id } : l))
    } else {
      setLinks(prev => [...prev, { ...form, id: `l${Date.now()}` }])
    }
    setShowModal(false)
    setEditingLink(null)
  }

  const removeLink = (id) => setLinks(prev => prev.filter(l => l.id !== id))
  const openEdit = (link) => { setEditingLink(link); setShowModal(true) }

  // Group by category for display
  const grouped = {}
  filtered.forEach(l => {
    if (!grouped[l.category]) grouped[l.category] = []
    grouped[l.category].push(l)
  })

  return (
    <div className="space-y-5 animate-fade-in">
      {showModal && (
        <Modal
          onClose={() => { setShowModal(false); setEditingLink(null) }}
          onSave={saveLink}
          initial={editingLink}
        />
      )}

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="section-title">
          <LinkIcon size={20} className="text-accent" />
          Links & Recursos
          <span className="text-sm text-text-sec font-normal">({links.length})</span>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <Plus size={15} /> Agregar link
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
            {c !== 'Todas' && CAT_ICONS[c]} {c}
          </button>
        ))}
      </div>

      {/* Links grid */}
      {Object.keys(grouped).length === 0 && (
        <div className="card text-center py-10">
          <LinkIcon size={32} className="text-text-sec mx-auto mb-2 opacity-40" />
          <p className="text-text-sec text-sm">No hay links en esta categoría</p>
        </div>
      )}

      {Object.entries(grouped).map(([cat, catLinks]) => (
        <div key={cat}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">{CAT_ICONS[cat]}</span>
            <h3 className="text-sm font-semibold text-text-sec uppercase tracking-wider">{cat}</h3>
            <div className="flex-1 h-px bg-border" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {catLinks.map(link => (
              <div key={link.id} className="card hover:border-accent/30 transition-all group flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg border flex items-center justify-center text-sm shrink-0 mt-0.5 ${CAT_COLORS[link.category] || 'bg-border border-border text-text-sec'}`}>
                  {CAT_ICONS[link.category] || '🔗'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-text-main text-sm truncate">{link.title}</p>
                      {link.description && <p className="text-xs text-text-sec mt-0.5 leading-relaxed">{link.description}</p>}
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all shrink-0">
                      <button onClick={() => openEdit(link)} className="btn-ghost text-xs py-1 px-1.5">
                        <Edit2 size={11} />
                      </button>
                      <button onClick={() => removeLink(link.id)} className="btn-ghost text-xs py-1 px-1.5 hover:text-danger">
                        <X size={11} />
                      </button>
                    </div>
                  </div>
                  {link.url ? (
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 mt-1.5 text-xs text-accent hover:underline max-w-full overflow-hidden"
                    >
                      <ExternalLink size={10} className="shrink-0" />
                      <span className="truncate">{link.url}</span>
                    </a>
                  ) : (
                    <button onClick={() => openEdit(link)} className="text-xs text-warning/60 hover:text-warning mt-1 transition-colors">
                      + Agregar URL
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
