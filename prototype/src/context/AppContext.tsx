import { createContext, useContext, useState, type ReactNode } from 'react'
import { DEMO_RUNNER_ID, NEGOTIATION_LIMIT_MINUTES, runners, services, type Service } from '../data/mockData'

export type NegotiationMessage = {
  id: number
  sender: 'customer' | 'runner'
  text: string
  amount?: number
  time: string
}

export type ChatMessage = {
  id: number
  sender: 'customer' | 'runner'
  text: string
  time: string
}

export type DemoRole = 'customer' | 'runner'
export type ActiveOrder = {
  id: string
  task: string
  location: string
  scheduled: string
  amount: number
  runnerName: string
  source: 'request' | 'catalog'
  status: 'waiting' | 'active' | 'completed'
  negotiationRound: 0 | 1 | 2 | 3
  negotiationMessages: NegotiationMessage[]
  chatMessages: ChatMessage[]
  negotiationDeadline?: number
}

export type ServiceInput = Pick<Service, 'name' | 'category' | 'description' | 'price' | 'duration'>

function currentTime() {
  return new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(new Date())
}

type AppContextValue = {
  role: DemoRole
  setRole: (role: DemoRole) => void
  ready: boolean
  setReady: (ready: boolean) => void
  openServices: Record<string, boolean>
  catalogServices: Service[]
  toggleService: (id: string) => void
  addCatalogService: (input: ServiceInput) => Service
  updateCatalogService: (id: string, input: ServiceInput) => void
  deleteCatalogService: (id: string) => void
  task: string
  setTask: (task: string) => void
  location: string
  setLocation: (location: string) => void
  scheduled: string
  setScheduled: (scheduled: string) => void
  offer: number
  setOffer: (offer: number) => void
  activeOrder: ActiveOrder | null
  sendChatMessage: (text: string) => void
  startRequest: () => ActiveOrder
  runnerCounter: () => void
  customerCounter: (amount: number) => void
  runnerFinal: () => void
  acceptDeal: () => void
  createCatalogOrder: (service: Service, scheduled: string) => ActiveOrder
  completeOrder: () => void
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<DemoRole>(() => {
    const basePath = import.meta.env.BASE_URL.replace(/\/$/, '')
    const routePath = window.location.pathname.startsWith(basePath)
      ? window.location.pathname.slice(basePath.length) || '/'
      : window.location.pathname
    return routePath.startsWith('/runner') ? 'runner' : 'customer'
  })
  const [ready, setReady] = useState(false)
  const [catalogServices, setCatalogServices] = useState(services)
  const [openServices, setOpenServices] = useState(() => Object.fromEntries(services.map((service) => [service.id, service.isOpen])))
  const [task, setTask] = useState('Ambil paket di gerbang utama')
  const [location, setLocation] = useState('Keputih, Sukolilo')
  const [scheduled, setScheduled] = useState('Segera')
  const [offer, setOffer] = useState(30000)
  const [activeOrder, setActiveOrder] = useState<ActiveOrder | null>(null)

  const startRequest = () => {
    const order: ActiveOrder = {
      id: 'SA-2488', task: task || 'Permintaan tugas baru', location, scheduled, amount: offer,
      runnerName: runners[0].name, source: 'request', status: 'waiting', negotiationRound: 0,
      negotiationMessages: [{ id: Date.now(), sender: 'customer', text: 'Mengajukan bayaran untuk tugas ini.', amount: offer, time: currentTime() }],
      chatMessages: [],
    }
    setActiveOrder(order)
    return order
  }

  const runnerCounter = () => setActiveOrder((current) => {
    if (!current) return current
    const amount = Math.min(75000, Math.max(current.amount + 5000, 35000))
    return {
      ...current,
      amount,
      status: 'waiting',
      negotiationRound: 1,
      negotiationDeadline: current.negotiationDeadline ?? Date.now() + NEGOTIATION_LIMIT_MINUTES * 60 * 1000,
      negotiationMessages: [...current.negotiationMessages, { id: Date.now(), sender: 'runner', text: 'Saya bisa membantu dengan bayaran ini.', amount, time: currentTime() }],
    }
  })
  const customerCounter = (offeredAmount: number) => setActiveOrder((current) => {
    if (!current) return current
    const amount = Math.min(75000, Math.max(10000, offeredAmount))
    return {
      ...current,
      amount,
      negotiationRound: 2,
      negotiationMessages: [...current.negotiationMessages, { id: Date.now(), sender: 'customer', text: 'Saya mengajukan penawaran balik.', amount, time: currentTime() }],
    }
  })
  const runnerFinal = () => setActiveOrder((current) => {
    if (!current) return current
    const amount = Math.min(75000, Math.max(current.amount + 5000, 40000))
    return {
      ...current,
      amount,
      negotiationRound: 3,
      negotiationMessages: [...current.negotiationMessages, { id: Date.now(), sender: 'runner', text: 'Ini penawaran final. Harganya tidak bisa ditawar lagi.', amount, time: currentTime() }],
    }
  })
  const acceptDeal = () => setActiveOrder((current) => current ? { ...current, status: 'active' } : current)

  const createCatalogOrder = (service: Service, scheduledTime: string) => {
    const runner = runners.find((item) => item.id === service.runnerId) ?? runners[0]
    const order: ActiveOrder = {
      id: 'SA-2492', task: service.name, location, scheduled: scheduledTime, amount: service.price,
      runnerName: runner.name, source: 'catalog', status: 'active', negotiationRound: 0, negotiationMessages: [], chatMessages: [],
    }
    setActiveOrder(order)
    return order
  }

  const completeOrder = () => setActiveOrder((current) => current ? { ...current, status: 'completed' } : current)
  const sendChatMessage = (text: string) => {
    const message = { id: Date.now(), sender: role, text: text.trim(), time: currentTime() }
    if (message.text) setActiveOrder((current) => current ? { ...current, chatMessages: [...current.chatMessages, message] } : current)
  }
  const toggleService = (id: string) => setOpenServices((current) => ({ ...current, [id]: !current[id] }))
  const addCatalogService = (input: ServiceInput) => {
    const slug = input.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-')
    const service: Service = {
      ...input,
      id: `${slug || 'jasa'}-${Date.now()}`,
      runnerId: DEMO_RUNNER_ID,
      rating: 5,
      isOpen: true,
      icon: 'Package',
      color: 'mint',
    }
    setCatalogServices((current) => [...current, service])
    setOpenServices((current) => ({ ...current, [service.id]: true }))
    return service
  }
  const updateCatalogService = (id: string, input: ServiceInput) => {
    setCatalogServices((current) => current.map((service) => service.id === id ? { ...service, ...input } : service))
  }
  const deleteCatalogService = (id: string) => {
    setCatalogServices((current) => current.filter((service) => service.id !== id))
    setOpenServices((current) => Object.fromEntries(Object.entries(current).filter(([serviceId]) => serviceId !== id)))
  }

  return (
    <AppContext.Provider value={{
      role, setRole, ready, setReady, openServices, catalogServices, toggleService,
      addCatalogService, updateCatalogService, deleteCatalogService, task, setTask, location,
      setLocation, scheduled, setScheduled, offer, setOffer, activeOrder, sendChatMessage, startRequest,
      runnerCounter, customerCounter, runnerFinal, acceptDeal, createCatalogOrder, completeOrder,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useAppState() {
  const value = useContext(AppContext)
  if (!value) throw new Error('useAppState harus digunakan di dalam AppProvider')
  return value
}