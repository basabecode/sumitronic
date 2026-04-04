import { Metadata } from 'next'
import AdminPanel from './AdminPanel'
import { brand } from '@/lib/brand'

export const metadata: Metadata = {
  title: `Panel de Administración - ${brand.name}`,
  description: 'Panel de control para administradores',
}

export default function AdminPage() {
  return <AdminPanel />
}
