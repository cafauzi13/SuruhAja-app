export type Runner = {
  id: string
  name: string
  initials: string
  rating: number
  trust: number
  distance: string
  verified: boolean
  neighborhood: string
}

export const DEMO_RUNNER_ID = 'r1'
export const DEMO_CUSTOMER_NAME = 'Lilis'
export const DEMO_RUNNER_NAME = 'Andi'
export const NEGOTIATION_LIMIT_MINUTES = 5

export type Service = {
  id: string
  name: string
  category: string
  description: string
  runnerId: string
  price: number
  duration: string
  rating: number
  isOpen: boolean
  icon: string
  color: string
}

export type SampleOrder = {
  id: string
  task: string
  location: string
  runnerName: string
  status: 'Menunggu runner' | 'Sedang dikerjakan' | 'Selesai'
  price: number
  source: 'Permintaan' | 'Katalog'
}

export const runners: Runner[] = [
  { id: DEMO_RUNNER_ID, name: DEMO_RUNNER_NAME, initials: 'AN', rating: 4.9, trust: 98, distance: '0,8 km', verified: true, neighborhood: 'Keputih' },
  { id: 'r2', name: 'Fajar Ramadhan', initials: 'FR', rating: 4.8, trust: 96, distance: '1,2 km', verified: true, neighborhood: 'Gebang' },
  { id: 'r3', name: 'Dimas Ardi', initials: 'DA', rating: 4.9, trust: 99, distance: '1,6 km', verified: true, neighborhood: 'Mulyosari' },
  { id: 'r4', name: 'Salsa Nabila', initials: 'SN', rating: 4.7, trust: 94, distance: '2,1 km', verified: true, neighborhood: 'Keputih' },
  { id: 'r5', name: 'Rizky Pratama', initials: 'RP', rating: 4.8, trust: 97, distance: '2,4 km', verified: true, neighborhood: 'Gebang' },
]

export const services: Service[] = [
  { id: 'survei-kos', name: 'Survei kos sekitar ITS', category: 'Survei', description: 'Foto kondisi kamar, cek fasilitas, dan tanyakan detail langsung ke pemilik.', runnerId: 'r1', price: 35000, duration: '45 menit', rating: 4.9, isOpen: true, icon: 'Search', color: 'mint' },
  { id: 'bersih-kamar', name: 'Bersih-bersih kamar kos', category: 'Kebersihan', description: 'Kamar rapi dan segar, termasuk menyapu, mengepel, dan merapikan meja.', runnerId: 'r4', price: 50000, duration: '90 menit', rating: 4.8, isOpen: true, icon: 'Sparkles', color: 'peach' },
  { id: 'titip-beli', name: 'Titip beli kebutuhan', category: 'Titip beli', description: 'Belanja kebutuhan harian di minimarket sekitar Keputih dan Gebang.', runnerId: 'r2', price: 15000, duration: '30 menit', rating: 4.8, isOpen: true, icon: 'ShoppingBag', color: 'blue' },
  { id: 'antar-dokumen', name: 'Antar jemput dokumen', category: 'Pengantaran', description: 'Antar dokumen atau paket kecil dengan aman di sekitar Sukolilo.', runnerId: 'r3', price: 20000, duration: '35 menit', rating: 4.9, isOpen: false, icon: 'PackageCheck', color: 'lavender' },
  { id: 'cetak-fotokopi', name: 'Cetak dan fotokopi tugas', category: 'Lainnya', description: 'Kirim file, tentukan jumlah cetak, lalu dokumen diantar ke kos.', runnerId: 'r5', price: 12000, duration: '25 menit', rating: 4.8, isOpen: true, icon: 'Printer', color: 'yellow' },
  { id: 'cuci-sepatu', name: 'Cuci sepatu express', category: 'Kebersihan', description: 'Perawatan sepatu harian, selesai dan kembali di hari yang sama.', runnerId: 'r1', price: 40000, duration: '2 jam', rating: 4.9, isOpen: true, icon: 'Footprints', color: 'mint' },
  { id: 'ambil-paket', name: 'Ambil paket di gerbang', category: 'Pengantaran', description: 'Paket dari pos satpam langsung diantar sampai depan kamar kos.', runnerId: 'r2', price: 10000, duration: '20 menit', rating: 4.7, isOpen: true, icon: 'Package', color: 'peach' },
]

export const sampleOrders: SampleOrder[] = [
  { id: 'SA-2401', task: 'Ambil paket di gerbang utama', location: 'Gebang Wetan, Sukolilo', runnerName: 'Fajar Ramadhan', status: 'Menunggu runner', price: 15000, source: 'Permintaan' },
  { id: 'SA-2394', task: 'Antar dokumen ke kampus ITS', location: 'Keputih, Sukolilo', runnerName: DEMO_RUNNER_NAME, status: 'Sedang dikerjakan', price: 25000, source: 'Katalog' },
  { id: 'SA-2378', task: 'Belikan makan malam', location: 'Mulyosari, Sukolilo', runnerName: DEMO_RUNNER_NAME, status: 'Selesai', price: 30000, source: 'Permintaan' },
]

export const categories = [
  { name: 'Titip beli', icon: 'ShoppingBag' },
  { name: 'Pengantaran', icon: 'Package' },
  { name: 'Kebersihan', icon: 'Sparkles' },
  { name: 'Lainnya', icon: 'BookOpen' },
]

export function formatRupiah(amount: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount)
}

export function estimatePrice(task: string) {
  const normalized = task.toLowerCase()
  if (/bersih|cuci|rapi/.test(normalized)) return 45000
  if (/antar|jemput|paket|dokumen/.test(normalized)) return 25000
  if (/beli|belanja|titip/.test(normalized)) return 20000
  if (/cetak|print|fotokopi/.test(normalized)) return 15000
  return 30000
}