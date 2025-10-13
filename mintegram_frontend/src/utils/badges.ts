// Utility to fetch all badges from backend
import { api } from 'src/boot/axios'

export async function fetchAllBadges() {
  const { data } = await api.get('/api/badges/')
  return data
}
