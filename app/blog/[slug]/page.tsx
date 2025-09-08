'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, User, ArrowLeft, Brain, Loader2, MessageCircle } from 'lucide-react';
import { ThemeToggle } from '../../components/theme-toggle';
import { PublicMobileMenu } from '../../components/public-mobile-menu';
import { useAuth } from '../../providers/auth-provider';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { BlogPost, BlogComment } from '@/lib/tables';

interface BlogPostWithFormattedDate extends Omit<BlogPost, 'published_at' | 'created_at' | 'updated_at'> {
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

interface BlogCommentWithFormattedDate extends Omit<BlogComment, 'created_at'> {
  created_at: string;
}

export default function BlogPostPage() {
  const { user, loading: authLoading } = useAuth();
  const params = useParams();
  const slug = params.slug as string;
  
  const [post, setPost] = useState<BlogPostWithFormattedDate | null>(null);
  const [comments, setComments] = useState<BlogCommentWithFormattedDate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [commentForm, setCommentForm] = useState({
    author_name: '',
    author_email: '',
    content: ''
  });

  useEffect(() => {
    const loadPostAndComments = async () => {
      if (!slug) return;
      
      try {
        setLoading(true);
        
        // Load post
        const postResponse = await fetch(`/api/blog/posts/${slug}`);
        if (!postResponse.ok) {
          if (postResponse.status === 404) {
            setError('Blog post not found');
          } else {
            throw new Error('Failed to fetch blog post');
          }
          return;
        }
        const postData = await postResponse.json();
        setPost(postData);

        // Load comments
        const commentsResponse = await fetch(`/api/blog/posts/${slug}/comments`);
        if (commentsResponse.ok) {
          const commentsData = await commentsResponse.json();
          setComments(commentsData);
        }
      } catch (err) {
        console.error('Error loading blog post:', err);
        setError('Failed to load blog post');
      } finally {
        setLoading(false);
      }
    };

    loadPostAndComments();
  }, [slug]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!commentForm.author_name.trim() || !commentForm.content.trim()) {
      alert('Please fill in your name and comment');
      return;
    }

    setCommentSubmitting(true);
    
    try {
      const response = await fetch(`/api/blog/posts/${slug}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(commentForm),
      });

      if (!response.ok) {
        throw new Error('Failed to submit comment');
      }

      const newComment = await response.json();
      setComments(prev => [...prev, newComment]);
      setCommentForm({ author_name: '', author_email: '', content: '' });
      
      alert('Comment submitted successfully!');
    } catch (err) {
      console.error('Error submitting comment:', err);
      alert('Failed to submit comment. Please try again.');
    } finally {
      setCommentSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
        <div className="flex items-center justify-center py-32">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading blog post...</span>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
        <div className="container mx-auto px-4 py-32 text-center">
          <div className="text-red-500 mb-4 text-lg">{error || 'Post not found'}</div>
          <Link href="/blog">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      {/* Header */}
      <header className="container mx-auto px-4 py-8">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="h-8 w-8" style={{color: 'var(--muted-blue)'}} />
            <Link href="/" className="text-2xl font-bold text-foreground hover:text-primary transition-colors cursor-pointer">
              Juniper
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/integration-descriptions" className="text-foreground hover:text-primary transition-colors">
              Integrations
            </Link>
            <Link href="/blog" className="text-foreground hover:text-primary transition-colors font-semibold">
              Blog
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <div className="hidden md:flex items-center space-x-4">
              {authLoading ? (
                <div className="text-muted-foreground">Loading...</div>
              ) : user ? (
                <>
                  <span className="text-foreground">{user.email}</span>
                  <Link href="/dashboard">
                    <Button variant="outline">Dashboard</Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost">Sign in</Button>
                  </Link>
                  <Link href="/signup">
                    <Button>Get Started</Button>
                  </Link>
                </>
              )}
            </div>
            <PublicMobileMenu user={user} loading={authLoading} />
          </div>
        </nav>
      </header>

      {/* Blog Post */}
      <article className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <Link href="/blog">
            <Button variant="ghost" className="mb-8">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Button>
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            {post.title}
          </h1>
          
          <div className="flex items-center text-muted-foreground space-x-6 mb-8">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span className="text-lg">{post.author_name}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span className="text-lg">
                {formatDate(post.published_at || post.created_at)}
              </span>
            </div>
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none [&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:display-list-item [&_p]:mb-4 [&_h1]:mb-4 [&_h1]:mt-8 [&_h2]:mb-4 [&_h2]:mt-6 [&_h3]:mb-3 [&_h3]:mt-5 [&_ul]:mb-4 [&_ol]:mb-4 [&_li]:mb-2 [&_blockquote]:my-6">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.content}
            </ReactMarkdown>
          </div>
        </div>
      </article>

      {/* Comments Section */}
      <section className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="border-t border-border pt-8">
          <div className="flex items-center space-x-2 mb-8">
            <MessageCircle className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">
              Comments ({comments.length})
            </h2>
          </div>

          {/* Comment Form */}
          <Card className="mb-8 bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg text-foreground">Leave a Comment</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCommentSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Input
                      placeholder="Your name *"
                      value={commentForm.author_name}
                      onChange={(e) => setCommentForm(prev => ({ ...prev, author_name: e.target.value }))}
                      required
                      className="bg-background border-input"
                    />
                  </div>
                  <div>
                    <Input
                      type="email"
                      placeholder="Your email (optional)"
                      value={commentForm.author_email}
                      onChange={(e) => setCommentForm(prev => ({ ...prev, author_email: e.target.value }))}
                      className="bg-background border-input"
                    />
                  </div>
                </div>
                <div>
                  <Textarea
                    placeholder="Write your comment... *"
                    value={commentForm.content}
                    onChange={(e) => setCommentForm(prev => ({ ...prev, content: e.target.value }))}
                    rows={4}
                    required
                    className="bg-background border-input"
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={commentSubmitting}
                  className="w-full md:w-auto"
                >
                  {commentSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Comment'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Comments List */}
          <div className="space-y-6">
            {comments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No comments yet. Be the first to comment!
              </div>
            ) : (
              comments.map((comment) => (
                <Card key={comment.id} className="bg-card border-border">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-semibold text-foreground">
                          {comment.author_name}
                        </span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {formatDateTime(comment.created_at)}
                      </span>
                    </div>
                    <div className="text-foreground whitespace-pre-wrap leading-relaxed">
                      {comment.content}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-16 text-center">
        <div className="text-muted-foreground">
          <p>&copy; 2025 Juniper. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}