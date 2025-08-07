import { createSupabaseAppServerClient } from '@/lib/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function getUser() {
  const supabase = await createSupabaseAppServerClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    redirect('/login')
  }
  
  return user
}