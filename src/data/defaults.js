// ── Default seed data ─────────────────────────────────────────────────────────

export const DEFAULT_CHECKLIST = [
  { id: 'c1', text: 'Contactar a Chafic para confirmar kickoff', done: false },
  { id: 'c2', text: 'Confirmar acceso a datos sintéticos de rooming lists', done: false },
  { id: 'c3', text: 'Definir stack técnico final del prototipo', done: false },
  { id: 'c4', text: 'Documentar metodología de anonimización', done: false },
  { id: 'c5', text: 'Crear URL pública del prototipo funcional', done: false },
  { id: 'c6', text: 'Preparar Business Case completo en PDF', done: false },
  { id: 'c7', text: 'Registrar costos en tabulador oficial TPC', done: false },
  { id: 'c8', text: 'Grabar video demo del flujo completo', done: false },
  { id: 'c9', text: 'Revisar compatibilidad con Azure AD', done: false },
  { id: 'c10', text: 'Ensayar pitch de 15 minutos con el equipo', done: false },
]

export const DEFAULT_NOTES = [
  { id: 'n1', text: '⚠️ Chafic no ha respondido — escalar con Ivan si no hay respuesta antes del 14 mayo', color: 'amber' },
  { id: 'n2', text: '🎯 Foco: el prototipo debe mostrar flujo completo de rooming list → asignación automática', color: 'purple' },
  { id: 'n3', text: '📅 Entrega final: 25 mayo 23:59h Mérida (UTC-6)', color: 'red' },
]

export const DEFAULT_CONTACTS = {
  'Chafic Abrham': 'Sin respuesta',
  'Dalila Bocardo': 'En seguimiento',
  'Ivan Villareal': 'Sin respuesta',
}

export const DEFAULT_DOCUMENTS = [
  { id: 'd1', name: 'Bases del Concurso — 1° Hackathon TPC AI Builders', category: 'Bases', date: '2026-05-01', url: '', notes: 'Bases oficiales: reglas, cronograma, entregables, premios y tolerancia cero. Incluye el formato Shark Tank de 15 min.' },
  { id: 'd2', name: 'Catálogo de Retos y Equipos — Mayo 2026', category: 'Referencia', date: '2026-05-01', url: 'https://hotelerapalace-my.sharepoint.com/:b:/g/personal/angsierra_thepalacecompany_com/IQBStsyjhh-GSr9p-kE55717Ab4XXNhqnqsLH3GjbEPVfJU?e=21veTI', notes: '16 retos y 16 equipos. Reto #03 asignado a Meta Sapiens: Agente de Captura Robusta de Rooming Lists · Área: Operaciones.' },
  { id: 'd3', name: 'Rúbrica Oficial del Jurado — TPC AI Builders', category: 'Bases', date: '2026-05-01', url: 'https://hotelerapalace-my.sharepoint.com/:b:/g/personal/rsantarosa_thepalacecompany_com/IQDltPEIwtiSTacNR5XOg_FZAXecmmsRNbCsLsR2p24Ymvk?e=NLkPkv', notes: 'Rúbrica completa del panel de jueces (Jose Chapur, Anuar Chapur, David Moreno, Arturo Chablé). 97 pts totales. Mínimo 80 para premio.' },
  { id: 'd4', name: 'Tabulador de Costos TPC — Mayo 2026', category: 'Entregables', date: '2026-05-01', url: 'https://hotelerapalace-my.sharepoint.com/:b:/g/personal/rsantarosa_thepalacecompany_com/IQDpo1yIH18HSaKWzXy7ObyXAf0_ZD03BNe_4gmvaLo5rHI?e=QwMCRR', notes: 'Tabulador oficial obligatorio para registrar y proyectar costos operativos del prototipo.' },
  { id: 'd5', name: 'MetaSapiens — Contactos y Seguimiento', category: 'Referencia', date: '2026-05-11', url: '', notes: 'Registro de contactos del proyecto: Chafic Abrham (dueño problema), Dalila Bocardo (enlace institucional), Ivan Villareal (sponsor).' },
]

export const DEFAULT_LINKS = [
  { id: 'l1', title: 'Prototipo / App', url: '', category: 'Prototipo', description: 'URL pública del producto final', date: '2026-05-11' },
  { id: 'l2', title: 'Lovable', url: 'https://lovable.dev', category: 'Herramienta', description: 'Generador de UI con IA', date: '2026-05-11' },
  { id: 'l3', title: 'Claude (Anthropic)', url: 'https://claude.ai', category: 'Herramienta', description: 'LLM principal para extracción y análisis', date: '2026-05-11' },
  { id: 'l4', title: 'AntiGravity', url: 'https://antigravity.ai', category: 'Herramienta', description: 'Agente de desarrollo avanzado', date: '2026-05-11' },
]

export const DEFAULT_PROMPTS = [
  {
    id: 'p1',
    name: 'Extracción de Rooming List a JSON',
    category: 'Extracción datos',
    model: 'Claude Sonnet',
    text: `Eres un experto en procesamiento de documentos hoteleros. A continuación recibirás un fragmento de una rooming list en formato texto (puede ser plano, CSV o tabla). Tu tarea es extraer cada registro de huésped y convertirlo en un JSON estructurado con los siguientes campos:

- reservation_id (string)
- arrival_date (YYYY-MM-DD)
- departure_date (YYYY-MM-DD)
- room_type (string)
- guests (array: {name, type: adult|child})
- special_requests (string o null)
- meal_plan (string o null)

Reglas críticas:
1. NO incluyas datos reales — si el input tiene datos reales, DETENTE y notifica al usuario.
2. Si falta algún campo, usa null.
3. Responde SOLO con el JSON, sin explicaciones.

Input:
[PEGAR ROOMING LIST AQUÍ]`,
    notes: 'Usar SOLO con datos sintéticos o anonimizados. Validar output con el schema antes de procesar.',
  },
  {
    id: 'p2',
    name: 'Anonimización de Datos de Huéspedes',
    category: 'Anonimización',
    model: 'Claude Sonnet',
    text: `Recibirás un JSON con datos de huéspedes de una rooming list. Tu tarea es anonimizar los datos personales identificables (PII) siguiendo estas reglas:

1. Nombres reemplazar con: "Huésped_[ID_SECUENCIAL]"
2. Emails: reemplazar con "huesped_[N]@example.com"
3. Teléfonos: reemplazar con "555-000-[N]"
4. Números de tarjeta/pago: ELIMINAR completamente
5. Pasaportes/IDs: reemplazar con "DOC-[HASH_3_CHARS]"
6. Mantener intactos: fechas, tipos de habitación, planes de alimentos, solicitudes especiales (sin nombres propios)

Devuelve el JSON anonimizado en el mismo formato que el input.
Incluye un campo "_anonymized": true en la raíz.

Input JSON:
[PEGAR JSON AQUÍ]`,
    notes: 'Ejecutar SIEMPRE antes de usar datos en cualquier LLM externo. Documentar en el Business Case.',
  },
  {
    id: 'p3',
    name: 'Validación de Asignación de Habitaciones',
    category: 'Validación',
    model: 'Claude Sonnet',
    text: `Eres un validador de asignaciones hoteleras. Recibirás:
1. Una rooming list procesada (JSON)
2. Un inventario de habitaciones disponibles (JSON)

Valida que cada asignación cumpla:
✓ El tipo de habitación existe en el inventario
✓ Las fechas de ocupación no se solapan con otra reserva
✓ La capacidad de la habitación soporta el número de huéspedes
✓ Los requerimientos especiales están anotados
✓ El plan de alimentos es válido para esa propiedad

Para cada error encontrado, reporta:
- reservation_id afectada
- tipo de conflicto
- sugerencia de resolución

Formato de respuesta: JSON con "valid": true/false y "issues": []

Rooming List:
[PEGAR JSON]

Inventario:
[PEGAR INVENTARIO]`,
    notes: 'Usar para QA del algoritmo de asignación antes de mostrar en el demo.',
  },
]

export const DEFAULT_RUBRICA = {
  'Impacto Operativo y ROI (Eje 1)': { maxPts: 35, progress: 0, notes: '1a. Diagnóstico costo actual (12pts) · 1b. ROI a 12 meses con Tabulador TPC (13pts) · 1c. Escalabilidad a propiedades TPC (10pts)' },
  'Enfoque y Resolución del Reto (Eje 2)': { maxPts: 20, progress: 0, notes: '2a. Fidelidad al reto asignado 100% (10pts) · 2b. Comprensión del dolor operativo (10pts)' },
  'Viabilidad Técnica y Seguridad (Eje 3)': { maxPts: 20, progress: 0, notes: '3a. Documentación técnica handoff (8pts) · 3b. Higiene de datos sintéticos (6pts) · 3c. Compatibilidad Azure AD/AWS/Supabase (6pts)' },
  'Calidad del Prototipo — Demo en Vivo (Eje 4)': { maxPts: 15, progress: 0, notes: '4a. Estabilidad demo en vivo min 5-10 (6pts) · 4b. UX/UI para usuario operativo (5pts) · 4c. Esfuerzo real de desarrollo 3 semanas (4pts)' },
  'Claridad en los 15 Minutos (Eje 5)': { maxPts: 7, progress: 0, notes: 'Estructura clara min 0-5 problema/solución · min 5-10 demo · min 10-15 Q&A ROI. Manejo de preguntas del jurado.' },
}

export const DEFAULT_DELIVERABLES = [
  { id: 'del1', text: 'Business Case completo en PDF', done: false },
  { id: 'del2', text: 'URL del prototipo funcional accesible públicamente', done: false },
  { id: 'del3', text: 'Video demo (opcional según tipo de desarrollo)', done: false },
  { id: 'del4', text: 'Metodología de anonimización documentada', done: false },
  { id: 'del5', text: 'Costos registrados en tabulador oficial TPC', done: false },
  { id: 'del6', text: 'Pauta de compatibilidad Azure AD mencionada en el prototipo', done: false },
]

export const DOC_CATEGORIES = ['Bases', 'Diagnóstico', 'Solución', 'Referencia', 'Legal', 'Entregables']
export const LINK_CATEGORIES = ['Prototipo', 'Herramienta', 'Referencia técnica', 'Entrega final', 'Otro']
export const PROMPT_CATEGORIES = ['Extracción datos', 'Validación', 'Generación output', 'Anonimización', 'Testing']
export const PROMPT_MODELS = ['Claude Sonnet', 'Claude Opus', 'GPT-4o', 'Gemini Pro', 'Otro']

export const CONTACT_STATUSES = [
  { value: 'Sin respuesta', color: 'text-danger bg-danger/10 border-danger/30' },
  { value: 'Follow-up pendiente', color: 'text-warning bg-warning/10 border-warning/30' },
  { value: 'En seguimiento', color: 'text-info bg-info/10 border-info/30' },
  { value: 'Respondido', color: 'text-success bg-success/10 border-success/30' },
  { value: 'Kickoff agendado', color: 'text-accent bg-accent/10 border-accent/30' },
]
