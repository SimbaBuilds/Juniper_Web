import { getUser } from '@/lib/auth/get-user'
import { ConfirmationSettingsClient } from './ConfirmationSettingsClient'

export const metadata = {
  title: 'Confirmation words',
}

export default async function ConfirmationSettingsPage() {
  // Auth gate only; the client fetches data from the backend (which owns
  // validation against the live tool catalog).
  await getUser()
  return <ConfirmationSettingsClient />
}
