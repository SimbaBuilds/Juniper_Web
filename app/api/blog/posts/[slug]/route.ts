import { NextResponse } from 'next/server';
import { createSupabaseAppServerClient } from '@/lib/utils/supabase/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const supabase = await createSupabaseAppServerClient();
    
    // Fetch blog post by slug
    const { data: post, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
      }
      console.error('Error fetching blog post:', error);
      return NextResponse.json({ error: 'Failed to fetch blog post' }, { status: 500 });
    }
    
    return NextResponse.json(post);
  } catch (error) {
    console.error('Unexpected error in blog post API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}