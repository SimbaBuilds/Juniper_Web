import { getUser } from '@/lib/auth/get-user'
import { IntegrationsClient } from './components/IntegrationsClient'

export default async function IntegrationsPage() {
  const user = await getUser()
  
  return <IntegrationsClient userId={user.id} />
}