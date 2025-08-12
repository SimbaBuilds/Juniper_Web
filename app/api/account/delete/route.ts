import { NextResponse } from 'next/server'
import { createSupabaseAppServerClient } from '@/lib/utils/supabase/server'
import { createSupabaseServiceClient } from '@/lib/utils/supabase/service'
import { getUser } from '@/lib/auth/get-user'

export async function DELETE() {
  try {
    // Get the current user
    const user = await getUser()
    
    // Create service client with admin privileges
    const serviceClient = createSupabaseServiceClient()
    
    // Delete the user from auth.users (this will cascade delete related data)
    const { error } = await serviceClient.auth.admin.deleteUser(user.id)
    
    if (error) {
      return NextResponse.json(
        { error: 'Failed to delete account' },
        { status: 500 }
      )
    }
    
    // Sign out the user from the current session
    const supabase = await createSupabaseAppServerClient()
    await supabase.auth.signOut()
    
    return NextResponse.json(
      { message: 'Account deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'An error occurred while deleting the account' },
      { status: 500 }
    )
  }
}