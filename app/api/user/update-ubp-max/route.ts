import { NextRequest, NextResponse } from 'next/server'
import { getUser } from '@/lib/auth/get-user'
import { createSupabaseAppServerClient } from '@/lib/utils/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { ubp_max } = await request.json()
    
    console.log('Received UBP update request:', { ubp_max, type: typeof ubp_max })

    if (typeof ubp_max !== 'number' || ubp_max < 0) {
      console.log('Invalid UBP value:', { ubp_max, type: typeof ubp_max })
      return NextResponse.json({ message: 'Invalid UBP max value' }, { status: 400 })
    }

    const supabase = await createSupabaseAppServerClient()
    
    const { data, error } = await supabase
      .from('user_profiles')
      .update({ ubp_max })
      .eq('id', user.id)
      .select()

    if (error) {
      console.error('Error updating ubp_max:', error)
      console.error('Error details:', JSON.stringify(error, null, 2))
      return NextResponse.json({ message: `Failed to update max UBP: ${error.message || 'Unknown error'}` }, { status: 500 })
    }

    return NextResponse.json({ message: 'Max UBP updated successfully' })
  } catch (error) {
    console.error('Error in update-ubp-max API:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}