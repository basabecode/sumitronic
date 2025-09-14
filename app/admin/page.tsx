import { Metadata } from 'next'
import AdminDashboardUnified from './AdminDashboardUnified'

export const metadata: Metadata = {
  title: 'Panel de Administración - CapiShop',
  description: 'Panel de control para administradores',
}

export default function AdminPage() {
  return <AdminDashboardUnified />
}
