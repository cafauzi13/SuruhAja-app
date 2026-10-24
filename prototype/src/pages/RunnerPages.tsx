import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowUpRight, BadgeCheck, Check, ChevronRight, Clock3, MapPin, Package, Pencil, Plus, ShieldCheck, Star, Trash2, WalletCards, X } from 'lucide-react'
import { DEMO_CUSTOMER_NAME, DEMO_RUNNER_ID, DEMO_RUNNER_NAME, formatRupiah, NEGOTIATION_LIMIT_MINUTES, runners, sampleOrders, type Service } from '../data/mockData'
import { useAppState, type ServiceInput } from '../context/AppContext'
import { ActionButton, Avatar, FieldLabel, InfoCard, LocationLine, PageTitle, RunnerMeta, SectionHeading, StatusPill, Toggle } from '../components/UI'

export function RunnerDashboardPage() {
  const { ready, setReady, activeOrder, openServices, catalogServices, setRole } = useAppState()
  const navigate = useNavigate()
  const openCount = catalogServices.filter((service) => service.runnerId === DEMO_RUNNER_ID && openServices[service.id]).length
  return <div className="screen runner-dashboard"><div className="runner-dashboard-heading"><PageTitle title="Dashboard runner" subtitle={`Selamat pagi, ${DEMO_RUNNER_NAME}.`} back={false} /><button className="home-role-switch" title="Demo Pelanggan" aria-label="Beralih ke Demo Pelanggan" onClick={() => { setRole('customer'); navigate('/') }}>R</button></div>
    <div className={`availability-card ${ready ? 'online' : 'offline'}`}><div className="availability-top"><span className="availability-icon"><span /></span><div><strong>{ready ? 'Kamu siap bertugas' : 'Kamu sedang offline'}</strong><small>{ready ? 'Tawaran tugas mendadak bisa masuk.' : 'Tawaran tugas mendadak dijeda.'}</small></div><Toggle checked={ready} onChange={() => setReady(!ready)} label="Status kesiapan runner" /></div><div className="availability-foot"><span>Status kesiapan</span><b>{ready ? 'AKTIF' : 'NONAKTIF'}</b></div></div>
    <div className="runner-metric-row"><div><Star size={18} /><strong>4,9</strong><small>Rating</small></div><div><ShieldCheck size={18} /><strong>98%</strong><small>Skor tepercaya</small></div><div><WalletCards size={18} /><strong>Rp 185k</strong><small>Pendapatan bulan ini</small></div></div>
    <section className="runner-section"><SectionHeading title="Tawaran tugas" action="Lihat semua" to="/runner/tawaran" /><Link to="/runner/tawaran" className={`runner-offer-preview ${ready ? '' : 'muted-preview'}`}><span className="offer-preview-icon"><Package size={20} /></span><span><strong>{ready ? 'Ada 2 tugas di dekatmu' : 'Tawaran sedang dijeda'}</strong><small>{ready ? 'Jarak terdekat 0,8 km · mulai Rp15.000' : 'Aktifkan status kesiapan untuk menerima tugas'}</small></span><ChevronRight size={18} /></Link></section>
    <section className="runner-section"><SectionHeading title="Katalog jasa" action="Kelola" to="/runner/katalog" /><div className="catalog-summary"><span><BadgeCheck size={19} /></span><div><strong>{openCount} jasa sedang buka</strong><small>Status katalog mengatur pesanan terjadwal.</small></div><ChevronRight size={18} /></div></section>
    <section className="runner-section"><SectionHeading title="Pesanan aktif" action="Buka" to={activeOrder ? `/pesanan/${activeOrder.id}` : '/pesanan'} /><Link to={activeOrder ? `/pesanan/${activeOrder.id}` : '/pesanan/SA-2394'} className="runner-active-order"><StatusPill>Dalam pengerjaan</StatusPill><strong>{activeOrder?.task ?? sampleOrders[1].task}</strong><LocationLine>{activeOrder?.location ?? sampleOrders[1].location}</LocationLine></Link></section>
    <InfoCard className="runner-trust-note"><ShieldCheck size={19} /><div><strong>Escrow melindungi pembayaran</strong><p>Dana tersedia setelah pelanggan mengonfirmasi tugas selesai.</p></div></InfoCard>
  </div>
}

export function RunnerOffersPage() {
  const { ready, activeOrder } = useAppState()
  const sample = sampleOrders[0]
  const offers = activeOrder ? [{ id: activeOrder.id, task: activeOrder.task, location: activeOrder.location, amount: activeOrder.amount, distance: runners[0].distance, requester: DEMO_CUSTOMER_NAME }] : [
    { id: sample.id, task: sample.task, location: sample.location, amount: sample.price, distance: '0,8 km', requester: DEMO_CUSTOMER_NAME },
    { id: 'SA-2408', task: 'Belikan makan siang di kantin', location: 'Mulyosari, Sukolilo', amount: 20000, distance: '1,4 km', requester: DEMO_CUSTOMER_NAME },
  ]
  return <div className="screen"><PageTitle title="Tawaran tugas" subtitle="Permintaan mendadak di sekitar kamu." />
    {!ready ? <div className="empty-state"><span className="empty-state-icon"><Clock3 size={28} /></span><h2>Belum ada tawaran</h2><p>Status kesiapanmu sedang nonaktif. Nyalakan di dashboard untuk mulai menerima tugas mendadak.</p><ActionButton to="/runner" variant="secondary" className="full-button">Buka dashboard runner</ActionButton></div> : <><div className="offer-list-heading"><span>{offers.length} tawaran tersedia</span><span><MapPin size={14} /> Sukolilo</span></div><div className="runner-offer-list">{offers.map((offer, index) => <Link to={`/runner/tawaran/${offer.id}`} className="runner-offer-card" key={offer.id}><div className="offer-card-top"><StatusPill tone="orange">{index === 0 ? 'Baru masuk' : 'Tugas dekat'}</StatusPill><span>{offer.distance}</span></div><strong>{offer.task}</strong><LocationLine>{offer.location}</LocationLine><div className="offer-card-bottom"><span>Permintaan dari {offer.requester}</span><b>{formatRupiah(offer.amount)}</b></div><span className="offer-card-arrow"><ChevronRight size={18} /></span></Link>)}</div><div className="safe-note"><ShieldCheck size={16} /> Pembayaran akan ditahan di escrow setelah disepakati.</div></>}
  </div>
}

export function RunnerOfferDetailPage() {
  const { id = 'SA-2401' } = useParams()
  const { activeOrder, startRequest, ready, acceptDeal, runnerCounter, runnerFinal } = useAppState()
  const navigate = useNavigate()
  const [remainingSeconds, setRemainingSeconds] = useState(NEGOTIATION_LIMIT_MINUTES * 60)
  useEffect(() => { if (!activeOrder) startRequest() }, [activeOrder, startRequest])
  useEffect(() => {
    const deadline = activeOrder?.negotiationDeadline
    if (!deadline) return
    const update = () => setRemainingSeconds(Math.max(0, Math.ceil((deadline - Date.now()) / 1000)))
    update()
    const timer = window.setInterval(update, 1000)
    return () => window.clearInterval(timer)
  }, [activeOrder?.negotiationDeadline])
  const orderId = activeOrder?.id ?? id
  const current = activeOrder
  const amount = current?.amount ?? sampleOrders[0].price
  const round = current?.negotiationRound ?? 0
  const remainingText = `${String(Math.floor(remainingSeconds / 60)).padStart(2, '0')}:${String(remainingSeconds % 60).padStart(2, '0')}`
  const location = current?.location ?? sampleOrders[0].location
  const task = current?.task ?? sampleOrders[0].task
  const accept = () => { acceptDeal(); navigate(`/pesanan/${orderId}`) }
  const counter = () => { runnerCounter(); navigate(`/pesanan/${orderId}/negosiasi`) }
  const finalOffer = () => { runnerFinal(); navigate(`/pesanan/${orderId}/negosiasi`) }
  return <div className="screen"><PageTitle title={round === 2 ? 'Tawaran pelanggan' : 'Detail tawaran'} subtitle={id} />
    {!ready && <div className="inline-warning"><Clock3 size={17} /> Status kesiapan nonaktif. Kamu masih bisa meninjau tawaran ini.</div>}
    <div className="offer-detail-title"><StatusPill tone="orange">Putaran {round === 2 ? 2 : 1} dari 3</StatusPill><h2>{task}</h2><LocationLine>{location}</LocationLine></div>
    {activeOrder?.negotiationDeadline && <div className={`negotiation-deadline ${remainingSeconds === 0 ? 'expired' : ''}`}><Clock3 size={17} /><span>{remainingSeconds === 0 ? 'Waktu negosiasi habis' : `Batas waktu kesepakatan · ${NEGOTIATION_LIMIT_MINUTES} menit`}</span><strong>{remainingText}</strong></div>}
    <div className="map-placeholder compact-map"><span className="map-road road-one" /><span className="map-road road-two" /><span className="map-pin start-pin"><MapPin size={18} /></span><span className="map-pin end-pin"><MapPin size={18} /></span><span className="map-neighborhood">{location}</span></div>
    <div className="offer-price-box"><span>{round === 2 ? 'Penawaran balik pelanggan' : 'Bayaran diajukan pelanggan'}</span><strong>{formatRupiah(amount)}</strong><span><Clock3 size={15} />Perkiraan waktu tugas 30 menit</span></div>
    <div className="runner-requester"><Avatar initials="NA" /><div><strong>{DEMO_CUSTOMER_NAME}</strong><RunnerMeta rating={4.9} verified={false} /></div><span><BadgeCheck size={16} /> Terverifikasi</span></div>
    <InfoCard className="runner-trust-note"><ShieldCheck size={19} /><div><strong>Dana ditahan sistem</strong><p>Pembayaran aman di escrow sampai pelanggan menyetujui bukti selesai.</p></div></InfoCard>
    <div className="sticky-action runner-offer-actions">{round === 2 ? <><ActionButton onClick={accept} className="full-button">Terima {formatRupiah(amount)} <CheckIcon /></ActionButton><ActionButton onClick={finalOffer} variant="secondary" className="full-button">Ajukan harga final <ArrowUpRight size={17} /></ActionButton><p className="final-round-caption">Penawaran final adalah putaran ke-3 dan tidak bisa ditawar lagi.</p></> : <><ActionButton onClick={accept} className="full-button">Terima tugas <ChevronRight size={18} /></ActionButton><ActionButton onClick={counter} variant="secondary" className="full-button">Ajukan penawaran balik <ArrowUpRight size={17} /></ActionButton></>}</div>
  </div>
}

function CheckIcon() {
  return <span className="button-check">✓</span>
}

export function RunnerCatalogPage() {
  const { catalogServices, openServices, toggleService, addCatalogService, updateCatalogService, deleteCatalogService } = useAppState()
  const [editorOpen, setEditorOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [draft, setDraft] = useState<ServiceInput>({ name: '', category: 'Titip beli', description: '', price: 25000, duration: '30 menit' })
  const ownServices = catalogServices.filter((service) => service.runnerId === DEMO_RUNNER_ID)
  const openCount = ownServices.filter((service) => openServices[service.id]).length
  const categories = [...new Set([...ownServices.map((service) => service.category), 'Lainnya'])]
  const startCreate = () => {
    setEditingId(null)
    setDraft({ name: '', category: 'Titip beli', description: '', price: 25000, duration: '30 menit' })
    setEditorOpen(true)
  }
  const startEdit = (service: Service) => {
    setEditingId(service.id)
    setDraft({ name: service.name, category: service.category, description: service.description, price: service.price, duration: service.duration })
    setDeleteId(null)
    setEditorOpen(true)
  }
  const saveService = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (editingId) updateCatalogService(editingId, draft)
    else addCatalogService(draft)
    setEditorOpen(false)
    setEditingId(null)
  }
  const removeService = (id: string) => {
    deleteCatalogService(id)
    setDeleteId(null)
    if (editingId === id) setEditorOpen(false)
  }
  return <div className="screen"><PageTitle title="Katalog saya" subtitle="Kelola jasa untuk pesanan terjadwal." />
    <InfoCard className="catalog-status-card"><span className="catalog-status-icon"><Package size={19} /></span><div><strong>{openCount} dari {ownServices.length} jasa buka</strong><small>Runner tetap bisa menerima katalog saat status kesiapan nonaktif.</small></div></InfoCard>
    <div className="catalog-toolbar"><span>Atur layanan, tarif, dan durasi.</span><ActionButton variant="secondary" onClick={startCreate} icon={<Plus size={17} />}>Tambah jasa</ActionButton></div>
    {editorOpen && <form className="catalog-editor" onSubmit={saveService}>
      <div className="catalog-editor-heading"><div><span className="eyebrow">KATALOG RUNNER</span><h2>{editingId ? 'Ubah jasa' : 'Jasa baru'}</h2></div><button className="icon-action" type="button" onClick={() => setEditorOpen(false)} aria-label="Tutup form"><X size={19} /></button></div>
      <FieldLabel label="Nama jasa"><input autoFocus required maxLength={60} value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} placeholder="Contoh: Antar makanan ke kos" /></FieldLabel>
      <FieldLabel label="Kategori"><select value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value })}>{categories.map((category) => <option key={category}>{category}</option>)}</select></FieldLabel>
      <FieldLabel label="Deskripsi"><textarea required rows={3} maxLength={180} value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} placeholder="Jelaskan layanan yang akan diberikan" /></FieldLabel>
      <div className="catalog-editor-fields"><FieldLabel label="Harga tetap (Rp)"><input required type="number" min="10000" max="75000" step="1000" value={draft.price} onChange={(event) => setDraft({ ...draft, price: Number(event.target.value) })} /></FieldLabel><FieldLabel label="Durasi"><input required maxLength={24} value={draft.duration} onChange={(event) => setDraft({ ...draft, duration: event.target.value })} placeholder="30 menit" /></FieldLabel></div>
      <div className="catalog-editor-actions"><ActionButton type="button" variant="quiet" onClick={() => setEditorOpen(false)}>Batal</ActionButton><ActionButton type="submit" icon={<Check size={17} />}>{editingId ? 'Simpan perubahan' : 'Tambah ke katalog'}</ActionButton></div>
    </form>}
    <div className="catalog-manage-list">{ownServices.map((service) => {
      const runner = runners.find((item) => item.id === service.runnerId)!
      const isOpen = openServices[service.id]
      return <article className="manage-service-wrap" key={service.id}><div className="manage-service"><div className={`manage-service-icon ${service.color}`}><Package size={19} /></div><div className="manage-service-copy"><strong>{service.name}</strong><span>{formatRupiah(service.price)} · {service.duration}</span><small>{runner.name} · ★ {service.rating.toFixed(1)}</small></div><div className="manage-service-actions"><div className="manage-service-control"><Toggle checked={isOpen} onChange={() => toggleService(service.id)} label={`${isOpen ? 'Tutup' : 'Buka'} ${service.name}`} /><span className={isOpen ? 'open-label' : 'closed-label'}>{isOpen ? 'Buka' : 'Tutup'}</span></div><button className="icon-action" onClick={() => startEdit(service)} aria-label={`Ubah ${service.name}`}><Pencil size={17} /></button><button className="icon-action delete-action" onClick={() => setDeleteId(deleteId === service.id ? null : service.id)} aria-label={`Hapus ${service.name}`}><Trash2 size={17} /></button></div></div>{deleteId === service.id && <div className="delete-confirm"><span>Hapus jasa ini dari katalog?</span><button onClick={() => removeService(service.id)}>Hapus</button><button onClick={() => setDeleteId(null)} aria-label="Batalkan hapus">Batal</button></div>}</article>
    })}</div>
    <InfoCard className="catalog-footnote"><ShieldCheck size={18} /><p>Katalog dan status kesiapan berdiri sendiri. Tutup setiap jasa yang belum bisa kamu ambil.</p></InfoCard>
  </div>
}