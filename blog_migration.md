# Blog Migration SQL Script

This migration script creates the necessary tables and policies for the blog functionality in your Supabase database.

## Tables to Create

### 1. Blog Posts Table

```sql
-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    author_name TEXT NOT NULL,
    published BOOLEAN DEFAULT false,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_created_at ON blog_posts(created_at DESC);

-- Add trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_blog_posts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_blog_posts_updated_at
    BEFORE UPDATE ON blog_posts
    FOR EACH ROW
    EXECUTE FUNCTION update_blog_posts_updated_at();
```

### 2. Blog Comments Table

```sql
-- Create blog_comments table
CREATE TABLE IF NOT EXISTS blog_comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
    author_name TEXT NOT NULL,
    author_email TEXT,
    content TEXT NOT NULL,
    approved BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_blog_comments_post_id ON blog_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_blog_comments_approved ON blog_comments(approved);
CREATE INDEX IF NOT EXISTS idx_blog_comments_created_at ON blog_comments(created_at);
```

## Row Level Security (RLS) Policies

### Blog Posts Policies

```sql
-- Enable RLS on blog_posts table
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Allow public read access to published blog posts
CREATE POLICY "Public can read published blog posts" ON blog_posts
    FOR SELECT USING (published = true);

-- Allow authenticated users to read all posts (for admin purposes)
-- Note: You can restrict this further if needed
CREATE POLICY "Authenticated users can read all blog posts" ON blog_posts
    FOR SELECT TO authenticated USING (true);

-- Allow service role to perform all operations (for admin panel or scripts)
CREATE POLICY "Service role can do everything on blog posts" ON blog_posts
    FOR ALL TO service_role USING (true);
```

### Blog Comments Policies

```sql
-- Enable RLS on blog_comments table
ALTER TABLE blog_comments ENABLE ROW LEVEL SECURITY;

-- Allow public read access to approved comments
CREATE POLICY "Public can read approved comments" ON blog_comments
    FOR SELECT USING (approved = true);

-- Allow public to insert comments (they'll need approval)
CREATE POLICY "Public can insert comments" ON blog_comments
    FOR INSERT WITH CHECK (true);

-- Allow service role to perform all operations (for moderation)
CREATE POLICY "Service role can do everything on blog comments" ON blog_comments
    FOR ALL TO service_role USING (true);
```

## Sample Data (Optional)

You can insert some sample blog posts to test the functionality:

```sql
-- Insert sample blog post with markdown formatting
INSERT INTO blog_posts (slug, title, excerpt, content, author_name, published, published_at)
VALUES (
    'welcome-to-juniper-blog',
    'Welcome to the Juniper Blog',
    'We''re excited to share insights about AI-powered productivity and wellness with you.',
    '# Welcome to the official Juniper blog! 

We''re *thrilled* to launch our new blog where we''ll be sharing insights, updates, and stories about the future of **AI-powered personal assistance**. This is a space where we''ll explore the intersection of artificial intelligence, personal wellness, and productivity tools to help you live your best life.

## What you can expect

In this blog, we''ll be sharing:

- **Product updates** and new features
- *Tips* for maximizing your productivity with AI
- Insights into wellness technology trends
- Community spotlights and success stories
- Behind-the-scenes development insights

### Our Mission

At Juniper, we believe that AI should enhance your daily life seamlessly. Whether you''re tracking your wellness metrics with devices like Oura, managing your calendar and emails, or staying connected with team communication tools - we''re building the bridge between all your favorite apps and intelligent assistance.

The key is making technology work for you, not the other way around. Our platform adapts to your needs, learns from your patterns, and helps you achieve your goals without the complexity.

> "The future of productivity isn''t about replacing human intelligence—it''s about augmenting it." - Juniper Team

---

Stay tuned for regular updates as we continue to build the future of AI-powered personal assistance. We''re excited to have you on this journey with us!

[Learn more about our integrations](/integration-descriptions)',
    'Juniper Team',
    true,
    NOW()
);

-- Insert sample comment
INSERT INTO blog_comments (post_id, author_name, author_email, content)
SELECT 
    id,
    'Sample User',
    'user@example.com',
    'Great to see the blog is live! Looking forward to more updates.'
FROM blog_posts 
WHERE slug = 'welcome-to-juniper-blog'
LIMIT 1;
```

## Migration Steps

1. **Run the table creation scripts** in your Supabase SQL editor
2. **Apply the RLS policies** to ensure proper security
3. **Optionally insert sample data** to test the functionality
4. **Test the API endpoints** by visiting your blog routes

## Markdown Support

The blog now supports full markdown formatting in blog post content. You can use:

### Basic Formatting
- `*italic text*` → *italic text*
- `**bold text**` → **bold text**
- `***bold and italic***` → ***bold and italic***

### Headers
- `# Header 1`
- `## Header 2`
- `### Header 3`

### Lists
```markdown
- Unordered list item
- Another item
  - Nested item

1. Ordered list item
2. Another ordered item
```

### Links and Images
- `[Link text](URL)` → Clickable links
- `![Alt text](image-url)` → Images

### Blockquotes
```markdown
> This is a blockquote
> It can span multiple lines
```

### Code
- Inline code: \`code here\`
- Code blocks: \`\`\`language\n code here \n\`\`\`

### Other Features
- `---` creates horizontal rules
- GitHub Flavored Markdown features like tables and strikethrough

## Notes

- The `published` field defaults to `false`, so posts need to be explicitly published
- Comments are auto-approved (`approved = true`) by default - you may want to change this for moderation
- The RLS policies allow public read access to published content and public comment submission
- All tables use UUID primary keys for better security and performance
- Proper indexes are created for common query patterns
- Blog content supports full markdown formatting with GitHub Flavored Markdown extensions

## Admin Functionality

To manage blog posts and comments, you'll need to:
1. Create an admin interface (not included in this implementation)
2. Use the Supabase dashboard to manually manage content
3. Or use SQL queries with the service role to manage content programmatically

The current implementation focuses on the public-facing blog functionality.