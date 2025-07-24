import { createClient } from '@/lib/utils/supabase/server'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export async function getUser() {
  const supabase = createClient(cookies())
  
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    redirect('/login')
  }
  
  return user
}