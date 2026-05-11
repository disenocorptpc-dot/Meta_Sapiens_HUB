import React, { useState } from 'react'
import { FileText, Plus, X, ExternalLink, Calendar, Tag, FileStack, Edit2, Check } from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { DEFAULT_DOCUMENTS, DOC_CATEGORIES } from '../data/defaults'

const CAT_ICONS = {
  'Bases': '📋',
  'Diagnóstico': '🔍',
  'Solución': '💡',
  'Referencia': '📚',
  'Legal': '⚖️',
  'Entregables': '📤',
}

const CAT_COLORS = {
  'Bases': 'bg-info/10 text-info border-info/30',
  'Diagnóstico': 'bg-warning/10 text-warning border-warning/30',
  'Solución': 'bg-accent/10 text-accent border-accent/30',
  'Referencia': 'bg-text-sec/10 text-text-sec border-text-sec/30',
  'Legal': 'bg-danger/10 text-danger border-danger/30',
  'Entregables': 'bg-success/10 text-success border-success/30',
}

function Modal({ onClose, onSave, initial }) {
  const [form, setForm] = useState(initial || { name: '', category: 'Bases', date: new Date().toISOString().split('T')[0], url: '', notes: '' })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-text-main">{initial ? 'Editar documento' : 'Nuevo documento'}</h3>
          <button onClick={onClose} className="text-text-sec hover:text-text-main"><X size={18} /></button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="label block mb-1">Nombre *</label>
            <input value={form.name} onChange={e => set('name', e.target.value)} className="input" placeholder="Ej. Business Case v1" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label block mb-1">Categoría</label>
              <select value={form.category} onChange={e => set('category', e.target.value)} className="select">
                {DOC_CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="label block mb-1">Fecha</label>
              <input type="date" value={form.date} onChange={e => set('date', e.target.value)} className="input" />
            </div>
          </div>
          <div>
            <label className="label block mb-1">URL / Link de acceso</label>
            <input value={form.url} onChange={e => set('url', e.target.value)} className="input" placeholder="https://..." />
          </div>
          <div>
            <label className="label block mb-1">Notas</label>
            <textarea value={form.notes} onChange={e => set('notes', e.target.value)} className="textarea h-20" placeholder="Contexto o descripción breve..." />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-5">
          <button onClick={onClose} className="btn-ghost">Cancelar</button>
          <button
            onClick={() => { if (form.name.trim()) onSave(form) }}
            disabled={!form.name.trim()}
            className="btn-primary disabled:opacity-40"
          >
            <Check size={14} /> {initial ? 'Actualizar' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Documents() {
  const [docs, setDocs] = useLocalStorage('ms_docs', DEFAULT_DOCUMENTS)
  const [showModal, setShowModal] = useState(false)
  const [editingDoc, setEditingDoc] = useState(null)
  const [filterCat, setFilterCat] = useState('Todas')

  const categories = ['Todas', ...DOC_CATEGORIES]
  const filtered = filterCat === 'Todas' ? docs : docs.filter(d => d.category === filterCat)

  const saveDoc = (form) => {
    if (editingDoc) {
      setDocs(prev => prev.map(d => d.id === editingDoc.id ? { ...form, id: editingDoc.id } : d))
    } else {
      setDocs(prev => [...prev, { ...form, id: `d${Date.now()}` }])
    }
    setShowModal(false)
    setEditingDoc(null)
  }

  const removeDoc = (id) => setDocs(prev => prev.filter(d => d.id !== id))
  const openEdit = (doc) => { setEditingDoc(doc); setShowModal(true) }

  return (
    <div className="space-y-5 animate-fade-in">
      {showModal && (
        <Modal
          onClose={() => { setShowModal(false); setEditingDoc(null) }}
          onSave={saveDoc}
          initial={editingDoc}
        />
      )}

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="section-title">
          <FileStack size={20} className="text-accent" />
          Documentos
          <span className="text-sm text-text-sec font-normal">({docs.length})</span>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <Plus size={15} /> Agregar documento
        </button>
      </div>

      {/* Category filter */}
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

      {/* Document list */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="card text-center py-10">
            <FileText size={32} className="text-text-sec mx-auto mb-2 opacity-40" />
            <p className="text-text-sec text-sm">No hay documentos en esta categoría</p>
          </div>
        )}
        {filtered.map(doc => (
          <div key={doc.id} className="card hover:border-accent/30 transition-all group">
            <div className="flex items-start gap-3">
              <span className="text-2xl shrink-0">{CAT_ICONS[doc.category] || '📄'}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <div>
                    <p className="font-semibold text-text-main leading-tight">{doc.name}</p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className={`badge border text-xs ${CAT_COLORS[doc.category] || 'bg-border text-text-sec border-border'}`}>
                        {doc.category}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-text-sec">
                        <Calendar size={10} /> {doc.date}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                    <button onClick={() => openEdit(doc)} className="btn-ghost text-xs py-1 px-2">
                      <Edit2 size={12} />
                    </button>
                    <button onClick={() => removeDoc(doc.id)} className="btn-ghost text-xs py-1 px-2 hover:text-danger">
                      <X size={12} />
                    </button>
                  </div>
                </div>

                {doc.notes && <p className="text-xs text-text-sec mt-1.5 leading-relaxed">{doc.notes}</p>}

                {doc.url && (
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 mt-2 text-xs text-accent hover:underline"
                  >
                    <ExternalLink size={11} />
                    Abrir documento
                  </a>
                )}
                {!doc.url && (
                  <button
                    onClick={() => openEdit(doc)}
                    className="inline-flex items-center gap-1.5 mt-2 text-xs text-warning/70 hover:text-warning transition-colors"
                  >
                    <Tag size={11} /> Sin URL — agregar link
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
