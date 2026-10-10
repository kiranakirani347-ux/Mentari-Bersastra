-- ==============================================================================
-- 1. EXTENSIONS
-- ==============================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 2. TABEL KATEGORI (categories)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(120) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);

-- ==============================================================================
-- 3. TABEL ARTIKEL (posts)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(280) NOT NULL UNIQUE,
    excerpt TEXT,
    content TEXT NOT NULL,
    featured_image TEXT,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    published BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_posts_slug ON public.posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_category_id ON public.posts(category_id);
CREATE INDEX IF NOT EXISTS idx_posts_published_created ON public.posts(published, created_at DESC);

-- Trigger untuk otomatis memperbarui updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_posts_updated_at ON public.posts;
CREATE TRIGGER set_posts_updated_at
    BEFORE UPDATE ON public.posts
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- ==============================================================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public categories are viewable by everyone"
    ON public.categories FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can manage categories"
    ON public.categories FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Public can view published posts"
    ON public.posts FOR SELECT
    USING (published = true);

CREATE POLICY "Authenticated users can view all posts"
    ON public.posts FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Authenticated users can insert posts"
    ON public.posts FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Authenticated users can update posts"
    ON public.posts FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Authenticated users can delete posts"
    ON public.posts FOR DELETE
    TO authenticated
    USING (true);

-- ==============================================================================
-- 5. SUPABASE STORAGE BUCKET (blog-images) & RLS
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-images', 'blog-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public Access for Blog Images"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'blog-images');

CREATE POLICY "Authenticated users can upload blog images"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'blog-images');

CREATE POLICY "Authenticated users can update blog images"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = 'blog-images');

CREATE POLICY "Authenticated users can delete blog images"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'blog-images');

-- ==============================================================================
-- 6. DATA CONTOH AWAL (SEED)
-- ==============================================================================
INSERT INTO public.categories (name, slug, description)
VALUES 
  ('Teknologi', 'teknologi', 'Berita dan tren komputasi, gadget, dan AI modern.'),
  ('Web Development', 'web-development', 'Tutorial dan praktik terbaik frontend & backend.'),
  ('Cloud & DevOps', 'cloud-devops', 'Arsitektur cloud, serverless, CI/CD, dan infrastruktur.')
ON CONFLICT (slug) DO NOTHING;
