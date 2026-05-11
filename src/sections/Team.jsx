import React, { useState } from 'react'
import { Users, Mail, ChevronDown, UserCircle, Building2, AlertCircle } from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { DEFAULT_CONTACTS, CONTACT_STATUSES } from '../data/defaults'

const TEAM = [
  { name: 'Rufino de Jesús Santa Rosa Rodríguez', initials: 'RR', color: 'bg-accent/20 text-accent border-accent/30' },
  { name: 'Juan Antonio Galvan Rivera', initials: 'JG', color: 'bg-info/20 text-info border-info/30' },
  { name: 'Angie Sierra Garrido', initials: 'AS', color: 'bg-pink-500/20 text-pink-400 border-pink-500/30' },
  { name: 'Diego Carranza', initials: 'DC', color: 'bg-success/20 text-success border-success/30', isNew: true },
]

const STAKEHOLDERS = [
  {
    name: 'Chafic Abrham',
    email: 'cabraham@thepalacecompany.com',
    role: 'Dueño del Problema',
    area: 'Operaciones · Reservaciones Especiales',
    notes: 'Contacto principal para levantamiento de información, muestras de rooming lists, horas-hombre y reglas de negocio. Aún sin contacto directo — esperar acceso vía Dalila.',
  },
  {
    name: 'Dalila Guadalupe Bocardo Martínez',
    email: 'dbocardo@palaceresorts.com',
    role: 'Enlace Institucional',
    area: 'Dir. Corp. Grupos & Convenciones',
    notes: 'Primer contacto del proyecto. Canalizó el reto al equipo y facilita el acceso al dueño del problema. Contactada el 08/05 vía email — respuesta pendiente.',
  },
  {
    name: 'Ivan Villareal',
    email: 'dvillarreal@thepalacecompany.com',
    role: 'Soporte / Sponsor',
    area: 'The Palace Company',
    notes: 'Contacto de escalamiento y apoyo institucional. Contactado el 08/05 vía email — sin respuesta. Enviar follow-up.',
  },
]

function StatusBadge({ value }) {
  const s = CONTACT_STATUSES.find(cs => cs.value === value) || CONTACT_STATUSES[0]
  return (
    <span className={`badge border text-xs ${s.color}`}>{value}</span>
  )
}

function StatusDropdown({ name, value, onChange }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-1 rounded-full px-2 py-0.5 text-xs transition-all hover:bg-border"
      >
        <StatusBadge value={value} />
        <ChevronDown size={10} className="text-text-sec" />
      </button>
      {open && (
        <div className="absolute right-0 top-7 z-20 bg-card border border-border rounded-xl shadow-xl min-w-[180px] py-1 animate-fade-in">
          {CONTACT_STATUSES.map(cs => (
            <button
              key={cs.value}
              onClick={() => { onChange(cs.value); setOpen(false) }}
              className={`w-full text-left px-3 py-2 text-xs hover:bg-border transition-all flex items-center gap-2 ${value === cs.value ? 'font-semibold' : ''}`}
            >
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${cs.value === 'Sin respuesta' ? 'bg-danger' : cs.value === 'Follow-up pendiente' ? 'bg-warning' : cs.value === 'En seguimiento' ? 'bg-info' : cs.value === 'Respondido' ? 'bg-success' : 'bg-accent'}`} />
              {cs.value}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Team() {
  const [contacts, setContacts] = useLocalStorage('ms_contacts', DEFAULT_CONTACTS)

  const updateContact = (name, status) => {
    setContacts(prev => ({ ...prev, [name]: status }))
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Internal Team */}
      <div className="card">
        <div className="section-title mb-5">
          <Users size={20} className="text-accent" />
          Equipo Interno
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {TEAM.map(member => (
            <div
              key={member.name}
              className="flex items-center gap-3 p-4 rounded-xl border border-border bg-bg hover:border-accent/20 transition-all"
            >
              <div className={`w-10 h-10 rounded-full border flex items-center justify-center text-sm font-bold shrink-0 ${member.color}`}>
                {member.initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold text-text-main leading-tight">{member.name}</span>
                  {member.isNew && (
                    <span className="badge bg-success/20 text-success border border-success/30">nuevo</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stakeholders */}
      <div className="card">
        <div className="section-title mb-5">
          <Building2 size={20} className="text-accent" />
          Stakeholders — The Palace Company
        </div>

        <div className="flex items-start gap-2 p-3 rounded-lg bg-warning/5 border border-warning/20 mb-4">
          <AlertCircle size={15} className="text-warning shrink-0 mt-0.5" />
          <p className="text-xs text-text-sec">
            El estado de contacto es editable. Haz click en el badge de estado para actualizarlo.
          </p>
        </div>

        <div className="space-y-4">
          {STAKEHOLDERS.map(s => (
            <div key={s.name} className="p-4 rounded-xl border border-border bg-bg hover:border-accent/30 transition-all">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-border flex items-center justify-center shrink-0">
                    <UserCircle size={20} className="text-text-sec" />
                  </div>
                  <div>
                    <p className="font-semibold text-text-main">{s.name}</p>
                    <p className="text-xs text-accent font-medium">{s.role}</p>
                    <p className="text-xs text-text-sec">{s.area}</p>
                  </div>
                </div>
                <StatusDropdown
                  name={s.name}
                  value={contacts[s.name] || 'Sin respuesta'}
                  onChange={(status) => updateContact(s.name, status)}
                />
              </div>

              <div className="mt-3 flex items-center gap-2 flex-wrap">
                <a
                  href={`mailto:${s.email}`}
                  className="flex items-center gap-1.5 text-xs text-info hover:underline"
                >
                  <Mail size={12} />
                  {s.email}
                </a>
              </div>

              <p className="mt-2 text-xs text-text-sec border-t border-border pt-2">{s.notes}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
