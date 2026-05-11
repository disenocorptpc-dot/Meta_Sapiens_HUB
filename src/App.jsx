import React, { useState } from 'react'
import {
  LayoutDashboard, Users, FileText, Link, Brain, Trophy,
  AlertTriangle, Download, Upload, Menu, X, Zap
} from 'lucide-react'
import { useLocalStorage } from './hooks/useLocalStorage'
import Dashboard from './sections/Dashboard'
import Team from './sections/Team'
import Documents from './sections/Documents'
import Links from './sections/Links'
import Prompts from './sections/Prompts'
import Rubrica from './sections/Rubrica'
import {
  DEFAULT_CHECKLIST, DEFAULT_NOTES, DEFAULT_CONTACTS, DEFAULT_DOCUMENTS,
  DEFAULT_LINKS, DEFAULT_PROMPTS, DEFAULT_RUBRICA, DEFAULT_DELIVERABLES
} from './data/defaults'

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'team', label: 'Equipo & Contactos', icon: Users },
  { id: 'documents', label: 'Documentos', icon: FileText },
  { id: 'links', label: 'Links & Recursos', icon: Link },
  { id: 'prompts', label: 'Prompts Master', icon: Brain },
  { id: 'rubrica', label: 'Rúbrica & Entregables', icon: Trophy },
]

function CriticalRules() {
  const [collapsed, setCollapsed] = useState(false)
  return (
    <div className="rules-banner px-4 py-2.5 flex items-start gap-3">
      <AlertTriangle size={15} className="text-danger shrink-0 mt-0.5" />
      {!collapsed ? (
        <div className="flex-1 flex flex-wrap gap-x-6 gap-y-0.5">
          <span className="text-xs text-danger font-semibold">🚫 PROHIBIDO usar datos reales de Palace en LLMs públicos — descalificación inmediata</span>
          <span className="text-xs text-text-sec">✅ Solo datos sintéticos/anonimizados — documentar metodología</span>
          <span className="text-xs text-text-sec">✅ Prototipo funcional con URL pública — no se aceptan mockups estáticos</span>
        </div>
      ) : (
        <span className="text-xs text-danger font-semibold flex-1">⚠️ REGLAS CRÍTICAS (expandir para ver)</span>
      )}
      <button onClick={() => setCollapsed(v => !v)} className="text-text-sec hover:text-text-main text-xs shrink-0">
        {collapsed ? 'Ver' : 'Minimizar'}
      </button>
    </div>
  )
}

function ExportImportButtons() {
  const handleExport = () => {
    const allKeys = [
      'ms_checklist', 'ms_notes', 'ms_contacts', 'ms_docs',
      'ms_links', 'ms_prompts', 'ms_rubrica', 'ms_deliverables', 'ms_phases'
    ]
    const backup = {}
    allKeys.forEach(k => {
      const val = localStorage.getItem(k)
      if (val) backup[k] = JSON.parse(val)
    })
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `meta-sapiens-hub-backup-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e) => {
      const file = e.target.files[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target.result)
          Object.entries(data).forEach(([k, v]) => {
            localStorage.setItem(k, JSON.stringify(v))
          })
          window.location.reload()
        } catch {
          alert('Error al importar: archivo JSON inválido')
        }
      }
      reader.readAsText(file)
    }
    input.click()
  }

  return (
    <div className="flex items-center gap-1.5">
      <button onClick={handleExport} className="btn-ghost text-xs py-1.5 px-2.5 gap-1.5" title="Exportar backup JSON">
        <Download size={13} /> Export
      </button>
      <button onClick={handleImport} className="btn-ghost text-xs py-1.5 px-2.5 gap-1.5" title="Importar backup JSON">
        <Upload size={13} /> Import
      </button>
    </div>
  )
}

function Sidebar({ activeSection, setActiveSection, mobileOpen, setMobileOpen }) {
  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside className={`
        fixed lg:sticky top-0 left-0 h-screen z-40 lg:z-auto
        w-64 bg-card border-r border-border flex flex-col
        transition-transform duration-300 ease-in-out
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
              <Zap size={16} className="text-white" />
            </div>
            <div>
              <div className="text-sm font-bold text-text-main leading-tight">META SAPIENS</div>
              <div className="text-xs text-accent font-medium">RETO #03</div>
            </div>
          </div>
          <p className="text-xs text-text-sec mt-2 leading-relaxed">
            Centro de operaciones del equipo
          </p>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map(item => {
            const Icon = item.icon
            const isActive = activeSection === item.id
            return (
              <button
                key={item.id}
                onClick={() => { setActiveSection(item.id); setMobileOpen(false) }}
                className={`sidebar-item w-full ${isActive ? 'active' : 'inactive'}`}
              >
                <Icon size={16} className="shrink-0" />
                {item.label}
              </button>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-border">
          <ExportImportButtons />
          <p className="text-xs text-text-sec mt-2 text-center opacity-60">
            Hackathon TPC · Mayo 2026
          </p>
        </div>
      </aside>
    </>
  )
}

export default function App() {
  const [activeSection, setActiveSection] = useState('dashboard')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [phaseProgress, setPhaseProgress] = useLocalStorage('ms_phases', { 1: 0, 2: 0, 3: 0 })

  const sectionProps = { phaseProgress, setPhaseProgress }

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard': return <Dashboard {...sectionProps} />
      case 'team': return <Team />
      case 'documents': return <Documents />
      case 'links': return <Links />
      case 'prompts': return <Prompts />
      case 'rubrica': return <Rubrica />
      default: return <Dashboard {...sectionProps} />
    }
  }

  const activeNav = NAV_ITEMS.find(n => n.id === activeSection)
  const ActiveIcon = activeNav?.icon

  return (
    <div className="flex h-screen overflow-hidden bg-bg text-text-main">
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Critical rules banner */}
        <CriticalRules />

        {/* Top bar */}
        <header className="header-gradient border-b border-border px-4 py-3 flex items-center gap-3 shrink-0">
          <button
            onClick={() => setMobileOpen(v => !v)}
            className="lg:hidden btn-ghost p-1.5"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
          {ActiveIcon && <ActiveIcon size={18} className="text-accent" />}
          <h1 className="font-bold text-text-main">{activeNav?.label}</h1>
          <div className="flex-1" />
          <div className="hidden sm:flex items-center gap-2 text-xs text-text-sec">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse-slow" />
            Auto-guardado activo
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="max-w-4xl mx-auto">
            {renderSection()}
          </div>
        </main>
      </div>
    </div>
  )
}
