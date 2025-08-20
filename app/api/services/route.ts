import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAppServerClient } from '@/lib/utils/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createSupabaseAppServerClient();
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch all services from the database (matching React Native pattern exactly)
    const { data: services, error: servicesError } = await supabase
      .from('services')
      .select(`
        *,
        tag_1:tags!services_tag_1_id_fkey(name),
        tag_2:tags!services_tag_2_id_fkey(name),
        tag_3:tags!services_tag_3_id_fkey(name),
        tag_4:tags!services_tag_4_id_fkey(name),
        tag_5:tags!services_tag_5_id_fkey(name)
      `)
      .order('service_name');

    console.log('Fetched services from database:', services?.length || 0);
    console.log('Services by type:', services?.reduce((acc: any, s: any) => {
      acc[s.type] = (acc[s.type] || 0) + 1;
      return acc;
    }, {}));

    if (servicesError) {
      console.error('Error fetching services:', servicesError);
      return NextResponse.json(
        { error: 'Failed to fetch services' },
        { status: 500 }
      );
    }

    // Transform the data to include tagNames array (matching React Native pattern)
    const transformedServices = services?.map(service => {
      const tagNames = [
        service.tag_1?.name,
        service.tag_2?.name,
        service.tag_3?.name,
        service.tag_4?.name,
        service.tag_5?.name
      ].filter(Boolean); // Remove null/undefined values
      
      return {
        ...service,
        tagNames
      };
    }) || [];

    return NextResponse.json({
      success: true,
      services: transformedServices
    });

  } catch (error) {
    console.error('Services API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}