import { NextResponse } from 'next/server';
import { createSupabaseAppServerClient } from '@/lib/utils/supabase/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = await createSupabaseAppServerClient();
    
    // Fetch published blog posts
    const { data: posts, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('published', true)
      .order('published_at', { ascending: false })
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching blog posts:', error);
      return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 });
    }
    
    return NextResponse.json(posts || []);
  } catch (error) {
    console.error('Unexpected error in blog posts API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}