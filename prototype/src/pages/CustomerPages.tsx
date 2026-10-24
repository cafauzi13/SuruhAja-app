import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import {
  Activity, ArrowDownRight, ArrowRight, ArrowUpRight, BadgeCheck, Check, ChevronRight,
  Clock3, Compass, Footprints, Heart, History, MapPin, MessageCircle, MessageSquareText, Package,
  PackageCheck, Pencil, Printer, Search, Send, Settings, Share2, ShieldCheck, ShoppingBag,
  Sparkles, Star, Store, UserRound, WalletCards,
} from 'lucide-react'
import { categories, DEMO_CUSTOMER_NAME, DEMO_RUNNER_ID, DEMO_RUNNER_NAME, estimatePrice, formatRupiah, NEGOTIATION_LIMIT_MINUTES, runners, sampleOrders, type Service } from '../data/mockData'
import { useAppState, type ChatMessage, type NegotiationMessage } from '../context/AppContext'
import { ActionButton, Avatar, FieldLabel, InfoCard, LocationLine, PageTitle, RunnerMeta, SectionHeading, StatusPill } from '../components/UI'

const serviceIcons = { Search, Sparkles, ShoppingBag, PackageCheck, Printer, Footprints, Package }
const categoryEmojis: Record<string, string> = {
  'Titip beli': '🛍️',
  Pengantaran: '📦',
  Kebersihan: '🧽',
  Lainnya: '✨',
}
const serviceImages: Record<string, string> = {
  Survei: '/images/service-home.jpg',
  'Titip beli': '/images/service-grocery.jpg',
  Kebersihan: '/images/service-cleaning.jpg',
  Pengantaran: '/images/service-delivery.jpg',
  Lainnya: '/images/service-documents.jpg',
}

function ServiceIcon({ name }: { name: string }) {
  const Icon = serviceIcons[name as keyof typeof serviceIcons] ?? Sparkles
  return <Icon size={21} />
}

function ServiceCard({ service }: { service: Service }) {
  const { openServices } = useAppState()
  const runner = runners.find((item) => item.id === service.runnerId)!
  const isOpen = openServices[service.id]
  return (
    <Link to={`/katalog/${service.id}`} className="service-card">
      <span className="service-thumb"><img src={serviceImages[service.category] ?? serviceImages.Lainnya} alt="" loading="lazy" /></span>
      <span className="service-card-copy"><strong>{service.name}</strong><span>{runner.name} · {service.duration}</span><span className="service-rating"><Star size={13} fill="currentColor" /> {service.rating.toFixed(1)} <span>·</span> {isOpen ? 'Buka' : 'Tutup'}</span></span>
      <span className="service-card-price">{formatRupiah(service.price)}</span>
    </Link>
  )
}

export function LoginPage() {
  const navigate = useNavigate()
  const [phone, setPhone] = useState('')
  return <div className="login-screen">
    <div className="login-emblem"><span>S</span></div>
    <span className="eyebrow">SURUH AJA, SELESAI</span>
    <h1>Halo, warga<br />Surabaya.</h1>
    <p className="login-copy">Urusan kecil jadi lebih ringan. Temukan bantuan tepercaya di sekitar kamu.</p>
    <FieldLabel label="Nomor handphone"><div className="phone-input"><span>+62</span><input inputMode="tel" placeholder="812 3456 7890" value={phone} onChange={(event) => setPhone(event.target.value)} /></div></FieldLabel>
    <ActionButton onClick={() => navigate('/')} className="full-button">Lanjutkan <ChevronRight size={18} /></ActionButton>
    <p className="login-footnote"><ShieldCheck size={15} /> Akun demo, tanpa OTP sungguhan</p>
  </div>
}

export function HomePage() {
  const { activeOrder, catalogServices, openServices, role, setRole } = useAppState()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const currentOrder = activeOrder ?? sampleOrders[1]
  const active = activeOrder?.status !== 'completed'
  return <div className="screen home-screen">
    <form className="home-search" onSubmit={(event) => { event.preventDefault(); navigate(`/katalog${searchQuery.trim() ? `?q=${encodeURIComponent(searchQuery.trim())}` : ''}`) }}><Search size={19} /><input aria-label="Cari jasa" placeholder="Cari jasa atau bantuan" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} /><button type="button" className="home-role-switch" title={role === 'runner' ? 'Demo Runner' : 'Demo Pelanggan'} aria-label={`Demo ${role === 'runner' ? 'Runner' : 'Pelanggan'}`} onClick={() => { const nextRole = role === 'runner' ? 'customer' : 'runner'; setRole(nextRole); navigate(nextRole === 'runner' ? '/runner' : '/') }}>{role === 'runner' ? 'R' : 'U'}</button></form>
    <div className="home-greeting"><span>Sabtu, 24 Oktober 2026 · Sukolilo</span><h1>Hai, Lilis <span>✳</span></h1></div>
    <div className="quick-category-row">{categories.map(({ name }) => <Link to={`/katalog?kategori=${encodeURIComponent(name)}`} className="quick-category" key={name}><span className="quick-category-art" aria-hidden="true">{categoryEmojis[name] ?? '✨'}</span><small>{name}</small></Link>)}</div>
    <Link to="/buat" className="request-hero"><div><span className="hero-kicker">MINTA BANTUAN SEKARANG</span><strong>Ada yang bisa dibantu<br />hari ini?</strong><span className="hero-action">Buat permintaan <ChevronRight size={16} /></span></div><span className="hero-orbit"><ArrowUpRight size={26} /></span></Link>
    {active && <section className="home-section"><SectionHeading title="Aktivitas berjalan" action="Lihat semua" to="/aktivitas" /><Link to={`/pesanan/${currentOrder.id}`} className="running-order"><div className="running-order-top"><StatusPill tone={activeOrder?.status === 'waiting' ? 'orange' : 'green'}>{activeOrder?.status === 'waiting' ? 'Mencari runner' : 'Sedang dikerjakan'}</StatusPill><ChevronRight size={18} /></div><strong>{currentOrder.task}</strong><LocationLine>{currentOrder.location}</LocationLine><div className="running-progress"><span /></div><div className="progress-labels"><span>Runner dalam perjalanan</span><span>12 mnt</span></div></Link></section>}
    <section className="home-section"><SectionHeading title="Available Now" action="Lihat katalog" to="/katalog" /><div className="service-list compact-list">{catalogServices.filter((item) => openServices[item.id]).slice(0, 3).map((service) => <ServiceCard service={service} key={service.id} />)}</div></section>
    <section className="trust-strip"><span><BadgeCheck size={18} /></span><div><strong>Runner terverifikasi</strong><p>Identitas dan ulasan dicek sebelum bertugas.</p></div></section>
  </div>
}

export function CreateRequestPage() {
  const { task, setTask, location, setLocation } = useAppState()
  return <div className="screen"><PageTitle title="Buat permintaan" subtitle="Ceritakan tugas yang ingin dibantu." />
    <div className="form-stack"><FieldLabel label="Apa yang perlu dilakukan?"><textarea rows={4} value={task} onChange={(event) => setTask(event.target.value)} placeholder="Contoh: ambil paket di pos satpam..." /></FieldLabel><span className="helper-text">Jelaskan detail singkat agar runner bisa memberi penawaran yang pas.</span>
      <FieldLabel label="Lokasi tugas"><div className="input-with-icon"><MapPin size={18} /><input value={location} onChange={(event) => setLocation(event.target.value)} /></div></FieldLabel>
      <div className="suggestion-label">Area sekitar</div><div className="chip-row">{['Keputih', 'Gebang', 'Mulyosari'].map((place) => <button key={place} className={`choice-chip ${location.includes(place) ? 'selected' : ''}`} onClick={() => setLocation(`${place}, Sukolilo`)}>{place}</button>)}</div>
    </div><div className="sticky-action"><ActionButton to="/buat/waktu" className="full-button">Lanjut pilih waktu <ChevronRight size={18} /></ActionButton></div>
  </div>
}

export function ChooseTimePage() {
  const { scheduled, setScheduled } = useAppState()
  const navigate = useNavigate()
  const [date, setDate] = useState('2026-10-25')
  const [time, setTime] = useState('10:00')
  return <div className="screen"><PageTitle title="Kapan dibutuhkan?" subtitle="Pilih waktu yang paling sesuai." />
    <div className="time-options"><button onClick={() => setScheduled('Segera')} className={`time-option ${scheduled === 'Segera' ? 'selected' : ''}`}><span className="option-icon"><Clock3 size={21} /></span><span><strong>Butuh segera</strong><small>Runner terdekat merespons dalam 10 menit</small></span><span className="radio-mark" /></button><button onClick={() => setScheduled('Terjadwal')} className={`time-option ${scheduled !== 'Segera' ? 'selected' : ''}`}><span className="option-icon"><Clock3 size={21} /></span><span><strong>Terjadwal</strong><small>Tentukan tanggal dan waktu tugas</small></span><span className="radio-mark" /></button></div>
    {scheduled !== 'Segera' && <div className="schedule-fields"><FieldLabel label="Tanggal"><input type="date" value={date} onChange={(event) => setDate(event.target.value)} /></FieldLabel><FieldLabel label="Jam"><input type="time" value={time} onChange={(event) => setTime(event.target.value)} /></FieldLabel></div>}
    <InfoCard className="soft-card"><span className="card-icon"><Clock3 size={18} /></span><div><strong>Tanpa biaya sebelum disepakati</strong><p>Permintaan hanya diteruskan setelah kamu mengajukan bayaran.</p></div></InfoCard>
    <div className="sticky-action"><ActionButton onClick={() => { setScheduled(scheduled === 'Segera' ? 'Segera' : `${date}, ${time}`); navigate('/buat/bayaran') }} className="full-button">Lihat tarif acuan <ChevronRight size={18} /></ActionButton></div>
  </div>
}

export function PaymentPage() {
  const { task, offer, setOffer, startRequest } = useAppState()
  const navigate = useNavigate()
  const estimate = useMemo(() => estimatePrice(task), [task])
  const submit = () => { const order = startRequest(); navigate(`/pesanan/${order.id}/menunggu`) }
  return <div className="screen"><PageTitle title="Ajukan bayaran" subtitle="Tarif acuan membantu mulai negosiasi." />
    <InfoCard className="estimate-card"><span className="estimate-icon"><Sparkles size={19} /></span><span><small>Tarif acuan SuruhAja</small><strong>{formatRupiah(estimate)}</strong><small>Untuk tugas: {task || 'Permintaan bantuan'}</small></span><span className="estimate-badge">ACUAN</span></InfoCard>
    <div className="offer-panel"><div className="offer-panel-heading"><div><span>Penawaran kamu</span><strong>{formatRupiah(offer)}</strong></div><span className="offer-edit-icon"><WalletCards size={20} /></span></div><input className="price-range" type="range" min="10000" max="75000" step="5000" value={offer} onChange={(event) => setOffer(Number(event.target.value))} aria-label="Atur bayaran" /><div className="range-labels"><span>Rp10.000</span><span>Rp75.000</span></div><p>Runner bisa menerima atau mengajukan harga balik. Maksimal 3 putaran.</p></div>
    <InfoCard className="soft-card"><ShieldCheck size={20} /><div><strong>Pembayaran aman</strong><p>Dana baru ditahan setelah harga disepakati. Belum ada pembayaran sekarang.</p></div></InfoCard>
    <div className="sticky-action"><ActionButton onClick={submit} className="full-button">Kirim permintaan <ArrowUpRight size={18} /></ActionButton></div>
  </div>
}

export function WaitingPage() {
  const { id = 'SA-2488' } = useParams()
  const { activeOrder, runnerCounter } = useAppState()
  const navigate = useNavigate()
  const [seconds, setSeconds] = useState(600)
  useEffect(() => { const timer = window.setInterval(() => setSeconds((value) => Math.max(0, value - 1)), 1000); return () => window.clearInterval(timer) }, [])
  const minutesText = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`
  const simulate = () => { runnerCounter(); navigate(`/pesanan/${id}/negosiasi`) }
  return <div className="screen waiting-screen"><PageTitle title="Mencari runner" subtitle="Permintaanmu sedang diteruskan ke runner terdekat." />
    <div className="waiting-animation"><div className="waiting-ring ring-one" /><div className="waiting-ring ring-two" /><span><Search size={30} /></span></div>
    <div className="countdown-label">WAKTU TERSISA</div><div className="countdown-value">{minutesText}</div><p className="center-copy">Kami menghubungi runner di sekitar<br />{activeOrder?.location ?? 'Keputih, Sukolilo'}.</p>
    <div className="waiting-order-card"><span className="detail-label">PERMINTAAN</span><strong>{activeOrder?.task ?? 'Tugas bantuan sekitar'}</strong><span><MapPin size={15} />{activeOrder?.location ?? 'Keputih, Sukolilo'}</span><span><WalletCards size={15} />Penawaran {formatRupiah(activeOrder?.amount ?? 30000)}</span></div>
    <button className="accelerate-button" onClick={() => setSeconds((value) => Math.max(0, value - 60))}><ArrowDownRight size={15} /> Percepat 1 menit</button>
    <div className="demo-simulate"><ActionButton onClick={simulate} className="full-button">Simulasikan balasan runner <ChevronRight size={18} /></ActionButton><Link to={`/runner/tawaran/${id}`}>Buka layar runner demo</Link></div>
  </div>
}

export function NegotiationPage() {
  const { id = 'SA-2488' } = useParams()
  const { activeOrder, customerCounter, acceptDeal } = useAppState()
  const navigate = useNavigate()
  const round = activeOrder?.negotiationRound || 1
  const amount = activeOrder?.amount ?? 35000
  const [counter, setCounter] = useState(amount)
  const [remainingSeconds, setRemainingSeconds] = useState(NEGOTIATION_LIMIT_MINUTES * 60)
  const [fallbackDeadline] = useState(() => Date.now() + NEGOTIATION_LIMIT_MINUTES * 60 * 1000)
  const deadline = activeOrder?.negotiationDeadline ?? fallbackDeadline
  useEffect(() => { setCounter(amount) }, [amount, round])
  useEffect(() => {
    if (!deadline) return
    const update = () => setRemainingSeconds(Math.max(0, Math.ceil((deadline - Date.now()) / 1000)))
    update()
    const timer = window.setInterval(update, 1000)
    return () => window.clearInterval(timer)
  }, [deadline])
  const expired = Boolean(deadline) && remainingSeconds === 0
  const timerText = `${String(Math.floor(remainingSeconds / 60)).padStart(2, '0')}:${String(remainingSeconds % 60).padStart(2, '0')}`
  const messages: NegotiationMessage[] = activeOrder?.negotiationMessages ?? []
  const visibleMessages = messages.length ? messages : [
    { id: 1, sender: 'customer' as const, text: 'Mengajukan bayaran untuk tugas ini.', amount: 30000, time: '10.20' },
    { id: 2, sender: 'runner' as const, text: 'Saya bisa membantu dengan bayaran ini.', amount, time: '10.24' },
  ]
  const goToOrder = () => { acceptDeal(); navigate(`/pesanan/${id}`) }
  const sendCounter = () => { customerCounter(counter); navigate(`/runner/tawaran/${id}`) }
  return <div className="screen"><PageTitle title="Penawaran balik" subtitle="Harga dibicarakan langsung di aplikasi." />
    <div className="round-banner"><span className="round-indicator"><span className={round >= 1 ? 'filled' : ''} /><span className={round >= 2 ? 'filled' : ''} /><span className={round >= 3 ? 'filled' : ''} /></span><strong>Putaran {round} dari 3</strong></div>
    <div className={`negotiation-deadline ${expired ? 'expired' : ''}`}><Clock3 size={17} /><span>{expired ? 'Waktu negosiasi habis' : `Batas waktu kesepakatan · ${NEGOTIATION_LIMIT_MINUTES} menit`}</span><strong>{timerText}</strong></div>
    <div className="chat-preview"><div className="chat-date">RIWAYAT PENAWARAN</div>{visibleMessages.map((message) => <div className={`chat-message ${message.sender === 'customer' ? 'customer-message' : 'runner-message'} offer-message`} key={message.id}><span className="chat-author">{message.sender === 'customer' ? 'Kamu' : activeOrder?.runnerName ?? DEMO_RUNNER_NAME}</span><p>{message.text}</p>{message.amount !== undefined && <strong>{formatRupiah(message.amount)}</strong>}<time>{message.time}</time></div>)}</div>
    {expired ? <InfoCard className="final-notice"><Clock3 size={21} /><div><strong>Waktu negosiasi habis</strong><p>Belum ada kesepakatan dalam batas waktu. Permintaan bisa diteruskan ke runner berikutnya.</p></div></InfoCard> : round === 3 ? <InfoCard className="final-notice"><ShieldCheck size={21} /><div><strong>Harga sudah final</strong><p>Penawaran putaran ketiga tidak bisa ditawar lagi. Kamu bisa menerima atau menolak.</p></div></InfoCard> : <div className="round-note"><span className="round-note-icon"><MessageCircle size={18} /></span><p>{round === 2 ? 'Penawaranmu sudah dikirim. Runner akan menerima atau memberi harga final.' : 'Kamu bisa menerima harga ini atau mengajukan satu penawaran balik.'}</p></div>}
    {round === 2 && <ActionButton to={`/runner/tawaran/${id}`} variant="secondary" className="full-button runner-response-link">Lihat sebagai runner demo <ArrowUpRight size={17} /></ActionButton>}
    {expired ? <ActionButton to="/pesanan" className="full-button">Kembali ke pesanan</ActionButton> : <div className="negotiation-actions">{round === 3 ? <><ActionButton onClick={goToOrder} className="full-button">Terima {formatRupiah(amount)} <Check size={18} /></ActionButton><ActionButton to="/pesanan" variant="quiet" className="full-button">Tolak penawaran</ActionButton></> : round === 2 ? <ActionButton onClick={goToOrder} className="full-button">Setuju dengan {formatRupiah(amount)} <Check size={18} /></ActionButton> : <><ActionButton onClick={goToOrder} className="full-button">Terima {formatRupiah(amount)} <Check size={18} /></ActionButton><div className="counter-offer"><label htmlFor="counter-price">Ajukan harga balik</label><div><span>Rp</span><input id="counter-price" type="number" min="10000" max="75000" step="1000" value={counter} onChange={(event) => setCounter(Number(event.target.value))} /><ActionButton onClick={sendCounter} variant="secondary">Kirim</ActionButton></div></div></>}</div>}
  </div>
}

export function CatalogPage() {
  const { catalogServices } = useAppState()
  const [searchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') ?? '')
  const [category, setCategory] = useState(searchParams.get('kategori') ?? 'Semua')
  const list = catalogServices.filter((service) => {
    const runner = runners.find((item) => item.id === service.runnerId)!
    return service.name.toLowerCase().includes(query.toLowerCase()) && (category === 'Semua' || service.category === category) && runner.name.length > 0
  })
  return <div className="screen"><PageTitle title="Katalog jasa" subtitle="Jasa tepercaya dari runner sekitar." />
    <div className="catalog-search"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari jasa atau kebutuhan" /></div>
    <div className="chip-row catalog-chips">{['Semua', ...new Set(catalogServices.map((service) => service.category))].map((item) => <button key={item} onClick={() => setCategory(item)} className={`choice-chip ${category === item ? 'selected' : ''}`}>{item}</button>)}</div>
    <div className="catalog-result-label">{list.length} jasa di sekitar Sukolilo</div><div className="service-list">{list.map((service) => <ServiceCard key={service.id} service={service} />)}</div>
  </div>
}

export function ServiceDetailPage() {
  const { id = '' } = useParams()
  const { catalogServices, openServices, createCatalogOrder } = useAppState()
  const navigate = useNavigate()
  const [when, setWhen] = useState('Besok, 10.00')
  const service = catalogServices.find((item) => item.id === id)
  if (!service) return <div className="screen"><PageTitle title="Jasa tidak tersedia" subtitle="Jasa ini mungkin sudah dihapus." /><ActionButton to="/katalog" className="full-button">Kembali ke katalog</ActionButton></div>
  const runner = runners.find((item) => item.id === service.runnerId)!
  const open = openServices[service.id]
  const book = () => { if (open) { const order = createCatalogOrder(service, when); navigate(`/pesanan/${order.id}`) } }
  return <div className="screen detail-screen"><PageTitle title="Detail jasa" />
    <div className={`detail-illustration ${service.color}`}><img src={serviceImages[service.category] ?? serviceImages.Lainnya} alt="" /><span><ServiceIcon name={service.icon} /></span><small>JASA RUNNER SUKOLILO</small></div>
    <span className="eyebrow detail-category">{service.category.toUpperCase()}</span><h1 className="service-detail-title">{service.name}</h1><div className="detail-runner"><Avatar initials={runner.initials} /><div><strong>{runner.name}</strong><span><RunnerMeta rating={service.rating} /></span></div><ChevronRight size={18} /></div>
    <p className="service-description">{service.description}</p><div className="service-facts"><span><Clock3 size={17} /><b>{service.duration}</b><small>Durasi rata-rata</small></span><span><MapPin size={17} /><b>{runner.distance}</b><small>Dari lokasimu</small></span><span><ShieldCheck size={17} /><b>{runner.trust}%</b><small>Skor tepercaya</small></span></div>
    <InfoCard className="fixed-price-note"><Check size={19} /><div><strong>Harga tetap, tanpa negosiasi</strong><p>Harga ditentukan runner dan tidak berubah saat memesan.</p></div></InfoCard>
    <FieldLabel label="Usulkan waktu"><select value={when} onChange={(event) => setWhen(event.target.value)}><option>Besok, 10.00</option><option>Besok, 14.00</option><option>Senin, 09.00</option></select></FieldLabel>
    {!open && <p className="closed-note">Jasa ini sedang tutup dan belum bisa dipesan.</p>}
    <div className="sticky-action booking-action"><div><small>Total harga tetap</small><strong>{formatRupiah(service.price)}</strong></div><ActionButton onClick={book} disabled={!open}>Pesan jasa</ActionButton></div>
  </div>
}

export function ActivityPage() {
  const { activeOrder } = useAppState()
  const [showHistory, setShowHistory] = useState(false)
  const activities = [
    ...(activeOrder ? [{ id: activeOrder.id, task: activeOrder.task, location: activeOrder.location, status: activeOrder.status === 'waiting' ? 'Menunggu runner' : activeOrder.status === 'completed' ? 'Selesai' : 'Sedang dikerjakan', amount: activeOrder.amount, source: activeOrder.source }] : []),
    ...sampleOrders.filter((item) => item.id !== activeOrder?.id).map((item) => ({ id: item.id, task: item.task, location: item.location, status: item.status, amount: item.price, source: item.source })),
  ]
  const visibleActivities = activities.filter((item) => showHistory ? item.status === 'Selesai' : item.status !== 'Selesai')
  return <div className="screen activity-screen"><PageTitle title="Aktivitas" back={false} />
    <div className="activity-section-heading"><h2>{showHistory ? 'Riwayat' : 'Baru-baru ini'}</h2><button onClick={() => setShowHistory((current) => !current)}>{showHistory ? 'Baru-baru ini' : 'Lihat Riwayat'}</button></div>
    {visibleActivities.length ? <div className="activity-list">{visibleActivities.map((item) => {
      const done = item.status === 'Selesai'
      const Icon = item.task.toLowerCase().includes('beli') ? ShoppingBag : Package
      return <div className="activity-row-wrap" key={item.id}><Link to={`/pesanan/${item.id}`} className="activity-row"><span className={`activity-mark ${done ? 'completed' : ''}`}><Icon size={23} /></span><span className="activity-copy"><strong>{item.task}</strong><small>{item.location} · {item.status}</small><small>24 Okt 2026 · {item.source === 'Katalog' || item.source === 'catalog' ? 'Jasa katalog' : 'Permintaan'}</small></span><span className="activity-amount">{formatRupiah(item.amount)}</span></Link>{done && <Link className="activity-repeat" to="/katalog">Pesan ulang <ArrowRight size={16} /></Link>}</div>
    })}</div> : <div className="activity-empty"><History size={25} /><p>Belum ada aktivitas di sini.</p></div>}
  </div>
}

export function InboxPage() {
  const { activeOrder, role } = useAppState()
  const otherName = role === 'runner' ? DEMO_CUSTOMER_NAME : DEMO_RUNNER_NAME
  const currentId = activeOrder?.id ?? 'SA-2401'
  const currentTask = activeOrder?.task ?? sampleOrders[0].task
  const messages = activeOrder?.chatMessages ?? []
  const latestMessage = messages.at(-1)?.text ?? (activeOrder?.negotiationMessages.at(-1)?.text ?? 'Penawaran dan detail tugas tersedia di chat.')
  const threads = [
    { id: currentId, name: otherName, role: role === 'runner' ? 'Pelanggan' : 'Runner', task: currentTask, preview: latestMessage, time: '10.24', unread: 1, to: `/pesanan/${currentId}/chat`, initials: otherName.split(' ').map((part) => part[0]).join('') },
    { id: 'SA-2394', name: role === 'runner' ? DEMO_CUSTOMER_NAME : DEMO_RUNNER_NAME, role: role === 'runner' ? 'Pelanggan' : 'Runner', task: sampleOrders[1].task, preview: 'Pesanan sudah dikonfirmasi.', time: '09.12', unread: 0, to: '/pesanan/SA-2394/chat', initials: role === 'runner' ? 'L' : 'A' },
    { id: 'info', name: 'SuruhAja', role: 'Pembaruan', task: 'Informasi pesanan', preview: 'Pembayaran dilindungi sampai tugas selesai.', time: 'Kemarin', unread: 0, to: '/aktivitas', initials: 'S' },
  ]
  return <div className="screen inbox-screen"><PageTitle title="Kotak Masuk" subtitle="Pesan dan pembaruan pesanan." back={false} />
    <div className="inbox-list">{threads.map((thread) => <Link to={thread.to} className="inbox-row" key={thread.id}><Avatar initials={thread.initials} size="md" /><span className="inbox-copy"><span className="inbox-name-row"><strong>{thread.name}</strong><time>{thread.time}</time></span><small>{thread.role} · {thread.task}</small><span className="inbox-preview">{thread.preview}</span></span>{thread.unread > 0 && <span className="inbox-unread">{thread.unread}</span>}</Link>)}</div>
  </div>
}

export function OrderDetailPage() {
  const { id = 'SA-2394' } = useParams()
  const { activeOrder } = useAppState()
  const order = activeOrder?.id === id ? activeOrder : null
  const sample = sampleOrders.find((item) => item.id === id) ?? sampleOrders[1]
  const status = order ? order.status === 'waiting' ? 'Menunggu runner' : order.status === 'completed' ? 'Selesai' : 'Sedang dikerjakan' : sample.status
  const sourceLabel = order ? order.source === 'catalog' ? 'Pesanan katalog' : 'Permintaan' : sample.source === 'Katalog' ? 'Pesanan katalog' : 'Permintaan'
  const amount = order?.amount ?? sample.price
  const task = order?.task ?? sample.task
  const location = order?.location ?? sample.location
  const runnerName = order?.runnerName ?? sample.runnerName
  const completed = status === 'Selesai'
  const waiting = status === 'Menunggu runner'
  return <div className="screen"><PageTitle title="Detail pesanan" subtitle={id} />
    <div className="detail-status-row"><StatusPill tone={waiting ? 'orange' : completed ? 'gray' : 'green'}>{status}</StatusPill><span className="source-tag">{sourceLabel}</span></div>
    <h2 className="order-task-title">{task}</h2><div className="scheduled-detail"><Clock3 size={17} /><span>Waktu tugas</span><strong>{order?.scheduled ?? 'Hari ini, 10.24'}</strong></div><div className="map-placeholder"><span className="map-road road-one" /><span className="map-road road-two" /><span className="map-pin start-pin"><MapPin size={18} /></span><span className="map-pin end-pin"><MapPin size={18} /></span><span className="map-neighborhood">{location}</span></div>
    <InfoCard className="escrow-card"><span className="escrow-icon"><ShieldCheck size={21} /></span><div><span className="detail-label">PEMBAYARAN</span><strong>{completed ? 'Dana sudah diteruskan' : 'Dana ditahan dengan aman'}</strong><p>{completed ? 'Konfirmasi selesai dan saldo runner telah diperbarui.' : 'Escrow aktif. Dana baru berpindah setelah kamu mengonfirmasi tugas selesai.'}</p></div><b>{formatRupiah(amount)}</b></InfoCard>
    <div className="runner-detail-row"><Avatar initials={runnerName.split(' ').map((part) => part[0]).join('')} /><div><strong>{runnerName}</strong><RunnerMeta rating={4.9} /></div><Link to={`/pesanan/${id}/chat`} className="chat-link" aria-label="Buka chat dan penawaran"><MessageCircle size={19} /></Link></div>
    <div className="timeline"><div className="timeline-step done"><span><Check size={13} /></span><div><strong>Pesanan dibuat</strong><small>Permintaan diterima sistem</small></div><time>10.14</time></div><div className={`timeline-step ${waiting ? '' : 'done'}`}><span>{waiting ? <Clock3 size={13} /> : <Check size={13} />}</span><div><strong>{waiting ? 'Menunggu runner' : 'Runner mulai bertugas'}</strong><small>{waiting ? 'Runner sekitar sedang dihubungi' : 'Pembayaran ditahan dalam escrow'}</small></div><time>{waiting ? '10 mnt' : '10.24'}</time></div><div className={`timeline-step ${completed ? 'done' : ''}`}><span>{completed ? <Check size={13} /> : <span className="timeline-empty" />}</span><div><strong>{completed ? 'Tugas selesai' : 'Bukti penyelesaian'}</strong><small>{completed ? 'Dana diteruskan ke runner' : 'Menunggu runner mengunggah bukti'}</small></div></div></div>
    <div className="order-detail-actions">{waiting ? <ActionButton to={`/pesanan/${id}/menunggu`} className="full-button">Lihat pencarian runner <ChevronRight size={18} /></ActionButton> : completed ? <ActionButton to={`/pesanan/${id}/konfirmasi`} variant="secondary" className="full-button">Lihat bukti dan rating <Star size={17} /></ActionButton> : <><ActionButton to={`/pesanan/${id}/konfirmasi`} className="full-button">Lihat bukti penyelesaian <ChevronRight size={18} /></ActionButton><div className="escrow-caption"><ShieldCheck size={15} /> Dana belum dicairkan</div></>}</div>
  </div>
}

export function OrderChatPage() {
  const { id = 'SA-2394' } = useParams()
  const { activeOrder, role, sendChatMessage } = useAppState()
  const [draft, setDraft] = useState('')
  const [localMessages, setLocalMessages] = useState<ChatMessage[]>([])
  const order = activeOrder?.id === id ? activeOrder : null
  const sample = sampleOrders.find((item) => item.id === id) ?? sampleOrders[1]
  const runnerName = order?.runnerName ?? sample.runnerName
  const otherName = role === 'customer' ? runnerName : DEMO_CUSTOMER_NAME
  const otherInitials = otherName.split(' ').map((part) => part[0]).join('')
  const otherRole = role === 'customer' ? 'Runner' : 'Pelanggan'
  const quickReplies = role === 'customer'
    ? ['Saya sudah di lokasi', 'Mohon kabari saat berangkat', 'Terima kasih!']
    : ['Saya sedang menuju lokasi', 'Boleh kirim patokan?', 'Tugas sudah selesai']
  const source = order?.source ?? (sample.source === 'Katalog' ? 'catalog' : 'request')
  const amount = order?.amount ?? sample.price
  const offerMessages = order?.negotiationMessages.length ? order.negotiationMessages : [
    { id: 1, sender: 'customer' as const, text: source === 'catalog' ? 'Saya ingin memesan jasa ini di waktu yang tersedia.' : 'Halo, saya membutuhkan bantuan untuk tugas ini.', amount: source === 'request' ? amount : undefined, time: '10.20' },
    { id: 2, sender: 'runner' as const, text: source === 'catalog' ? 'Pesanan dikonfirmasi dengan harga tetap dari katalog.' : 'Saya bisa membantu. Ini penawaran saya.', amount, time: '10.24' },
  ]
  const chatMessages = order?.chatMessages ?? localMessages
  const conversation = [
    ...offerMessages.map((message) => ({ ...message, kind: 'offer' as const })),
    ...chatMessages.map((message) => ({ ...message, kind: 'chat' as const })),
  ].sort((first, second) => first.id - second.id)
  const isNegotiating = order?.source === 'request' && order.status === 'waiting' && order.negotiationRound > 0
  const sendMessage = (text: string) => {
    const cleanText = text.trim()
    if (!cleanText) return
    const message: ChatMessage = { id: Date.now(), sender: role, text: cleanText, time: new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(new Date()) }
    if (order) sendChatMessage(cleanText)
    else setLocalMessages((current) => [...current, message])
    setDraft('')
  }
  return <div className="screen order-chat-screen"><PageTitle title="Chat & penawaran" subtitle={order?.task ?? sample.task} />
    <div className="chat-order-summary"><Avatar initials={otherInitials} /><div><strong>{otherName}</strong><span>{otherRole} · {id}</span></div><StatusPill tone={order?.status === 'completed' ? 'gray' : 'green'}>{order?.status === 'completed' ? 'Selesai' : source === 'catalog' ? 'Harga tetap' : 'Pesanan aktif'}</StatusPill></div>
    <div className="chat-self-role">Kamu masuk sebagai <strong>{role === 'customer' ? `${DEMO_CUSTOMER_NAME} · Pelanggan` : `${DEMO_RUNNER_NAME} · Runner`}</strong></div>
    <div className="chat-price-context"><span><WalletCards size={18} />{isNegotiating ? 'Penawaran terakhir' : source === 'catalog' ? 'Harga tetap' : 'Harga pesanan'}</span><strong>{formatRupiah(amount)}</strong><small>{source === 'catalog' ? 'Harga jasa katalog, tanpa negosiasi.' : 'Percakapan dan penawaran untuk pesanan ini.'}</small></div>
    {order?.negotiationDeadline && <div className="negotiation-deadline"><Clock3 size={17} /><span>Batas waktu kesepakatan · {NEGOTIATION_LIMIT_MINUTES} menit</span><strong>Aktif</strong></div>}
    <div className="chat-preview order-chat-transcript"><div className="chat-date">CHAT & RIWAYAT PENAWARAN</div>{conversation.map((message) => { const mine = message.sender === role; return <div className={`chat-message ${mine ? 'customer-message' : 'runner-message'} ${message.kind === 'offer' ? 'offer-message' : ''}`} key={`${message.kind}-${message.id}`}><span className="chat-author">{mine ? 'Kamu' : otherName}</span><p>{message.text}</p>{'amount' in message && message.amount !== undefined && <strong>{formatRupiah(message.amount)}</strong>}<time>{message.time}</time></div> })}</div>
    <InfoCard className="soft-card chat-escrow-note"><ShieldCheck size={19} /><div><strong>Pembayaran aman di escrow</strong><p>Dana hanya diteruskan setelah tugas dikonfirmasi selesai.</p></div></InfoCard>
    {isNegotiating && <ActionButton to={`/pesanan/${id}/negosiasi`} className="full-button">Lanjutkan negosiasi harga <ArrowUpRight size={18} /></ActionButton>}
    <div className="quick-replies" aria-label={`Pesan cepat sebagai ${role === 'runner' ? 'runner' : 'pelanggan'}`}><span>Pesan cepat</span>{quickReplies.map((text) => <button key={text} type="button" onClick={() => sendMessage(text)}>{text}</button>)}</div>
    <form className="chat-composer" onSubmit={(event) => { event.preventDefault(); sendMessage(draft) }}><input aria-label="Tulis pesan" placeholder="Tulis pesan di luar harga..." value={draft} onChange={(event) => setDraft(event.target.value)} /><button type="submit" aria-label="Kirim pesan" disabled={!draft.trim()}><Send size={19} /></button></form>
  </div>
}

export function ConfirmationPage() {
  const { id = 'SA-2394' } = useParams()
  const { completeOrder, activeOrder } = useAppState()
  const navigate = useNavigate()
  const [rating, setRating] = useState(0)
  const isDone = activeOrder?.id === id && activeOrder.status === 'completed'
  return <div className="screen"><PageTitle title={isDone ? 'Pesanan selesai' : 'Bukti penyelesaian'} subtitle="Periksa hasilnya sebelum konfirmasi." />
    <div className="proof-photo"><span className="proof-stamp"><Check size={16} /> SELESAI</span><span className="proof-package"><PackageCheck size={48} /></span><span className="proof-caption">Bukti dari runner · 10.42</span></div>
    <div className="proof-copy"><h2>{isDone ? `Terima kasih, ${DEMO_CUSTOMER_NAME}!` : 'Paket sudah di depan kamar'}</h2><p>Runner mengunggah bukti bahwa tugas telah diselesaikan. Pastikan hasilnya sesuai sebelum melepas dana.</p></div>
    <InfoCard className="release-card"><span><WalletCards size={19} /></span><div><strong>{isDone ? 'Dana sudah diteruskan' : 'Konfirmasi akan melepas escrow'}</strong><p>{isDone ? 'Pembayaran diteruskan kepada runner.' : 'Dana hanya diteruskan setelah kamu menekan tombol konfirmasi.'}</p></div></InfoCard>
    {!isDone && <div className="rating-panel"><strong>Bagaimana pengalamanmu?</strong><p>Rating membantu komunitas memilih runner tepercaya.</p><div className="rating-stars">{[1, 2, 3, 4, 5].map((value) => <button key={value} onClick={() => setRating(value)} aria-label={`Beri ${value} bintang`}><Star size={30} fill={value <= rating ? 'currentColor' : 'none'} /></button>)}</div></div>}
    {isDone ? <ActionButton to="/pesanan" className="full-button">Kembali ke pesanan</ActionButton> : <div className="sticky-action"><ActionButton onClick={() => { completeOrder(); navigate(`/pesanan/${id}`) }} disabled={rating === 0} className="full-button">Konfirmasi selesai & cairkan dana <Check size={18} /></ActionButton><button className="quiet-link" onClick={() => navigate(`/pesanan/${id}`)}>Periksa pesanan lagi</button></div>}
  </div>
}

export function ProfilePage() {
  const { role, setRole, ready, openServices, catalogServices } = useAppState()
  const navigate = useNavigate()
  const [editing, setEditing] = useState(false)
  const [notice, setNotice] = useState('')
  const runnerMode = role === 'runner'
  const profileName = runnerMode ? DEMO_RUNNER_NAME : DEMO_CUSTOMER_NAME
  const [displayName, setDisplayName] = useState(profileName)
  const [displayLocation, setDisplayLocation] = useState('Keputih, Sukolilo')
  useEffect(() => { setDisplayName(profileName) }, [profileName])
  const profileInitials = displayName.split(' ').map((part) => part[0]).join('')
  const openCount = catalogServices.filter((service) => service.runnerId === DEMO_RUNNER_ID && openServices[service.id]).length
  const changeMode = () => {
    const nextRole = runnerMode ? 'customer' : 'runner'
    setRole(nextRole)
    navigate(nextRole === 'runner' ? '/runner' : '/')
  }
  const stats = runnerMode ? [{ value: '4,9', label: 'rating' }, { value: '28', label: 'tugas selesai' }, { value: '98%', label: 'tepercaya' }] : [{ value: '3', label: 'pesanan' }, { value: '2', label: 'ulasan' }, { value: '4', label: 'favorit' }]
  return <div className="screen profile-screen profile-reference-screen">
    <div className="profile-cover"><div className="profile-cover-actions"><button aria-label="Bagikan profil" onClick={() => setNotice('Profil siap dibagikan')}><Share2 size={19} /></button><button aria-label="Pengaturan profil" onClick={() => setEditing((current) => !current)}><Settings size={19} /></button></div></div>
    <div className="profile-person"><Avatar initials={profileInitials} size="lg" /><h1>{displayName}</h1><p>{runnerMode ? 'Runner terverifikasi' : 'Pelanggan'} · {displayLocation}</p></div>
    <div className="profile-stats">{stats.map((stat) => <div key={stat.label}><strong>{stat.value}</strong><span>{stat.label}</span></div>)}</div>
    <button className="profile-edit-button" onClick={() => setEditing((current) => !current)}><Pencil size={17} />{editing ? 'Tutup edit profil' : 'Ubah profil'}</button>
    {editing && <form className="profile-edit-form" onSubmit={(event) => { event.preventDefault(); setNotice('Perubahan profil tersimpan untuk demo'); setEditing(false) }}><FieldLabel label="Nama"><input value={displayName} onChange={(event) => setDisplayName(event.target.value)} /></FieldLabel><FieldLabel label="Lokasi"><input value={displayLocation} onChange={(event) => setDisplayLocation(event.target.value)} /></FieldLabel><ActionButton type="submit" className="full-button">Simpan perubahan</ActionButton></form>}
    {notice && <p className="profile-notice" role="status">{notice}</p>}
    <div className="profile-mode-row"><span className="profile-mode-symbol">{runnerMode ? <Store size={19} /> : <UserRound size={19} />}</span><span><strong>{runnerMode ? 'Mode Runner' : 'Mode Pelanggan'}</strong><small>{runnerMode ? `${ready ? 'Siap menerima tugas' : 'Status kesiapan nonaktif'} · ${openCount} jasa buka` : 'Cari bantuan atau pesan jasa sekitar'}</small></span><button onClick={changeMode}>{runnerMode ? 'Ganti' : 'Jadi runner'} <ChevronRight size={16} /></button></div>
    <section className="profile-links"><h2>{runnerMode ? 'Ruang kerja' : 'Aktivitas akun'}</h2>{runnerMode && <Link to="/runner"><span><Compass size={19} /></span><strong>Dashboard runner</strong><ChevronRight size={18} /></Link>}<Link to="/aktivitas"><span><Activity size={19} /></span><strong>Aktivitas</strong><ChevronRight size={18} /></Link><Link to="/pesan"><span><MessageSquareText size={19} /></span><strong>Kotak Masuk</strong><ChevronRight size={18} /></Link>{runnerMode && <Link to="/runner/katalog"><span><Store size={19} /></span><strong>Katalog jasa saya</strong><ChevronRight size={18} /></Link>}</section>
    <div className="profile-review-prompt"><span><Star size={21} fill="currentColor" /></span><div><strong>{runnerMode ? 'Ulasan membangun kepercayaan' : 'Pengalamanmu berarti'}</strong><p>{runnerMode ? 'Jaga kualitas layanan untuk komunitas sekitar.' : 'Ulasanmu membantu orang lain menemukan bantuan.'}</p></div><Heart size={18} /></div>
  </div>
}