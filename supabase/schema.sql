-- ╔══════════════════════════════════════════════════════════════════════════════╗
-- ║  Budget Bit — Supabase Schema                                               ║
-- ║  Run this in Supabase → SQL Editor → New Query → Run                        ║
-- ╚══════════════════════════════════════════════════════════════════════════════╝

-- ── Enable UUID extension ─────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── Drop existing tables (clean slate — policies drop automatically with CASCADE)
DROP TABLE IF EXISTS saved_restaurants CASCADE;
DROP TABLE IF EXISTS bills            CASCADE;
DROP TABLE IF EXISTS reviews          CASCADE;
DROP TABLE IF EXISTS restaurants      CASCADE;
DROP TABLE IF EXISTS profiles         CASCADE;

-- ── 1. Profiles (mirrors auth.users — auto-created on sign-up) ────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name   TEXT,
  avatar_url  TEXT,
  bio         TEXT DEFAULT '',
  total_spent NUMERIC(10,2) DEFAULT 0,
  total_saved NUMERIC(10,2) DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

-- Auto-create profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ── 2. Restaurants ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS restaurants (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name             TEXT NOT NULL,
  cuisine          TEXT NOT NULL DEFAULT 'Multi-Cuisine',
  image_url        TEXT DEFAULT '',
  address          TEXT DEFAULT '',
  city             TEXT DEFAULT '',
  rating           NUMERIC(2,1) DEFAULT 0,
  avg_cost         INTEGER DEFAULT 0,         -- avg cost for two in ₹
  worth_it_score   INTEGER DEFAULT 0,         -- Budget Bit score 0-100
  social_buzz      INTEGER DEFAULT 0,         -- 0-100
  community_reviews INTEGER DEFAULT 0,        -- 0-100
  distance         NUMERIC(4,1) DEFAULT 0,    -- km from user
  tag              TEXT DEFAULT '',           -- e.g. 'Trending'
  tag_color        TEXT DEFAULT '#E8360A',
  top_dishes       JSONB DEFAULT '[]',        -- [{name, price, emoji, score}]
  lat              DOUBLE PRECISION,
  lng              DOUBLE PRECISION,
  created_at       TIMESTAMPTZ DEFAULT now(),
  updated_at       TIMESTAMPTZ DEFAULT now()
);

-- ── 3. Reviews ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reviews (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  restaurant_id   UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  dishes          JSONB DEFAULT '[]',  -- [{name,price,taste,value,portion}]
  avg_rating      NUMERIC(3,2) DEFAULT 0,
  overall_score   INTEGER CHECK (overall_score BETWEEN 0 AND 100),
  comment         TEXT DEFAULT '',
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- ── 4. Bills ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS bills (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  restaurant_id   UUID REFERENCES restaurants(id) ON DELETE SET NULL,
  image_url       TEXT DEFAULT '',
  amount          NUMERIC(10,2) NOT NULL DEFAULT 0,
  dishes          TEXT[] DEFAULT '{}',  -- list of dish names
  items           JSONB DEFAULT '[]',   -- [{name, price, qty}]
  avg_rating      NUMERIC(3,2) DEFAULT 0,
  saved           NUMERIC(10,2) DEFAULT 0,  -- amount saved vs avg price
  worth_it_score  INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- ── 5. Saved Restaurants (bookmarks) ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS saved_restaurants (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  restaurant_id   UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  created_at      TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, restaurant_id)
);

-- ══════════════════════════════════════════════════════════════════════════════
-- Row Level Security (RLS) — secure by default
-- ══════════════════════════════════════════════════════════════════════════════

-- Profiles: users can read all, update own
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_read"   ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_update" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Restaurants: anyone can read, only service-role can insert/update
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "restaurants_read" ON restaurants FOR SELECT USING (true);
CREATE POLICY "restaurants_insert" ON restaurants FOR INSERT WITH CHECK (true);
CREATE POLICY "restaurants_update" ON restaurants FOR UPDATE USING (true);

-- Reviews: anyone reads, owner inserts/updates/deletes
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "reviews_read"   ON reviews FOR SELECT USING (true);
CREATE POLICY "reviews_insert" ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "reviews_update" ON reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "reviews_delete" ON reviews FOR DELETE USING (auth.uid() = user_id);

-- Bills: owner only
ALTER TABLE bills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "bills_read"   ON bills FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "bills_insert" ON bills FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "bills_delete" ON bills FOR DELETE USING (auth.uid() = user_id);

-- Saved restaurants: owner only
ALTER TABLE saved_restaurants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "saved_read"   ON saved_restaurants FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "saved_insert" ON saved_restaurants FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "saved_delete" ON saved_restaurants FOR DELETE USING (auth.uid() = user_id);


-- ══════════════════════════════════════════════════════════════════════════════
-- Seed data — 5 restaurants to start with
-- ══════════════════════════════════════════════════════════════════════════════
INSERT INTO restaurants (name, cuisine, image_url, address, city, rating, avg_cost, worth_it_score, social_buzz, community_reviews, distance, tag, tag_color, top_dishes) VALUES
  ('Spice Garden',      'Indian',   '🍛', '12 MG Road',       'Bangalore', 4.3, 450, 82, 76, 80, 1.2, 'Trending',  '#E8360A',
    '[{"name":"Butter Chicken","price":280,"emoji":"🍗","score":88},{"name":"Dal Makhani","price":180,"emoji":"🫕","score":82}]'),
  ('Pasta La Vista',    'Italian',  '🍝', '8 Church Street',  'Bangalore', 4.5, 700, 74, 65, 70, 2.8, 'Popular',   '#3b82f6',
    '[{"name":"Truffle Pasta","price":420,"emoji":"🍝","score":78},{"name":"Margherita","price":350,"emoji":"🍕","score":74}]'),
  ('Wok & Roll',        'Chinese',  '🥢', '45 Brigade Road',  'Bangalore', 4.1, 350, 88, 84, 86, 0.8, 'Best Value','#16a34a',
    '[{"name":"Dim Sum","price":180,"emoji":"🥟","score":92},{"name":"Kung Pao","price":220,"emoji":"🥢","score":86}]'),
  ('The Breakfast Club','Cafe',     '☕', '23 Indiranagar',   'Bangalore', 4.6, 300, 91, 90, 88, 1.5, 'Top Rated', '#FF9F1C',
    '[{"name":"Pancakes","price":180,"emoji":"🥞","score":95},{"name":"Cold Brew","price":120,"emoji":"☕","score":90}]'),
  ('Sushi Spot',        'Japanese', '🍱', '5 Koramangala',    'Bangalore', 4.4, 900, 68, 72, 65, 3.5, 'Premium',   '#8b5cf6',
    '[{"name":"Salmon Nigiri","price":480,"emoji":"🍣","score":72},{"name":"Ramen","price":380,"emoji":"🍜","score":68}]')
ON CONFLICT DO NOTHING;


-- ══════════════════════════════════════════════════════════════════════════════
-- Storage bucket for bill images
-- ══════════════════════════════════════════════════════════════════════════════
-- Run this in Supabase → Storage → Create bucket:
--   Name: bill-images
--   Public: Yes (or use signed URLs)
