import { Link } from 'react-router-dom'
import { ArrowLeft, BadgeCheck, ChevronRight, MapPin, Star } from 'lucide-react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

export function PageTitle({ title, subtitle, back = true }: { title: string; subtitle?: string; back?: boolean }) {
  return (
    <div className="page-title">
      {back && <button className="back-button" onClick={() => window.history.back()} aria-label="Kembali"><ArrowLeft size={20} /></button>}
      <div><h1>{title}</h1>{subtitle && <p>{subtitle}</p>}</div>
    </div>
  )
}

type ActionButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  to?: string
  variant?: 'primary' | 'secondary' | 'quiet' | 'danger'
  icon?: ReactNode
}

export function ActionButton({ to, variant = 'primary', icon, children, className = '', ...props }: ActionButtonProps) {
  const classes = `action-button ${variant} ${className}`
  if (to) return <Link to={to} className={classes}>{icon}{children}</Link>
  return <button className={classes} {...props}>{icon}{children}</button>
}

export function SectionHeading({ title, action, to }: { title: string; action?: string; to?: string }) {
  return <div className="section-heading"><h2>{title}</h2>{action && to && <Link to={to}>{action}<ChevronRight size={16} /></Link>}</div>
}

export function Avatar({ initials, size = 'md' }: { initials: string; size?: 'sm' | 'md' | 'lg' }) {
  return <span className={`avatar avatar-${size}`}>{initials}</span>
}

export function RunnerMeta({ rating, verified = true }: { rating: number; verified?: boolean }) {
  return <span className="runner-meta"><Star size={14} fill="currentColor" /> {rating.toFixed(1)}{verified && <><span className="meta-dot">·</span><BadgeCheck size={15} /> Terverifikasi</>}</span>
}

export function LocationLine({ children }: { children: ReactNode }) {
  return <span className="location-line"><MapPin size={15} />{children}</span>
}

export function StatusPill({ children, tone = 'green' }: { children: ReactNode; tone?: 'green' | 'orange' | 'gray' }) {
  return <span className={`status-pill ${tone}`}><span className="status-dot" />{children}</span>
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return <button className={`toggle ${checked ? 'checked' : ''}`} type="button" role="switch" aria-checked={checked} aria-label={label} onClick={onChange}><span /></button>
}

export function InfoCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`info-card ${className}`}>{children}</div>
}

export function FieldLabel({ label, children }: { label: string; children: ReactNode }) {
  return <label className="field-label"><span>{label}</span>{children}</label>
}