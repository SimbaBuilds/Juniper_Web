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
    
    // First, get the post ID from the slug
    const { data: post, error: postError } = await supabase
      .from('blog_posts')
      .select('id')
      .eq('slug', slug)
      .eq('published', true)
      .single();
    
    if (postError) {
      if (postError.code === 'PGRST116') {
        return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
      }
      console.error('Error fetching blog post:', postError);
      return NextResponse.json({ error: 'Failed to fetch blog post' }, { status: 500 });
    }
    
    // Fetch approved comments for this post
    const { data: comments, error: commentsError } = await supabase
      .from('blog_comments')
      .select('*')
      .eq('post_id', post.id)
      .eq('approved', true)
      .order('created_at', { ascending: true });
    
    if (commentsError) {
      console.error('Error fetching comments:', commentsError);
      return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
    }
    
    return NextResponse.json(comments || []);
  } catch (error) {
    console.error('Unexpected error in comments API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const body = await request.json();
    const { author_name, author_email, content } = body;
    
    // Basic validation
    if (!author_name?.trim() || !content?.trim()) {
      return NextResponse.json({ error: 'Author name and content are required' }, { status: 400 });
    }
    
    const supabase = await createSupabaseAppServerClient();
    
    // First, get the post ID from the slug
    const { data: post, error: postError } = await supabase
      .from('blog_posts')
      .select('id')
      .eq('slug', slug)
      .eq('published', true)
      .single();
    
    if (postError) {
      if (postError.code === 'PGRST116') {
        return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
      }
      console.error('Error fetching blog post:', postError);
      return NextResponse.json({ error: 'Failed to fetch blog post' }, { status: 500 });
    }
    
    // Insert the comment
    const { data: comment, error: commentError } = await supabase
      .from('blog_comments')
      .insert({
        post_id: post.id,
        author_name: author_name.trim(),
        author_email: author_email?.trim() || null,
        content: content.trim(),
        approved: true // Auto-approve for now
      })
      .select()
      .single();
    
    if (commentError) {
      console.error('Error inserting comment:', commentError);
      return NextResponse.json({ error: 'Failed to submit comment' }, { status: 500 });
    }
    
    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error('Unexpected error in comment submission:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}