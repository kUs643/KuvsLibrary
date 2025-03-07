/*
  # Create playbook database schema

  1. New Tables
    - `playbooks`
      - `id` (uuid, primary key)
      - `name` (text)
      - `user_id` (uuid, references auth.users)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `maps`
      - `id` (uuid, primary key)
      - `name` (text)
      - `image_url` (text)
      - `created_at` (timestamp)

    - `strategies`
      - `id` (uuid, primary key)
      - `playbook_id` (uuid, references playbooks)
      - `map_id` (uuid, references maps)
      - `title` (text)
      - `description` (text)
      - `team` (text)
      - `side` (text)
      - `steps` (jsonb)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `strategy_images`
      - `id` (uuid, primary key)
      - `strategy_id` (uuid, references strategies)
      - `image_url` (text)
      - `storage_path` (text)
      - `created_at` (timestamp)

    - `comments`
      - `id` (uuid, primary key)
      - `strategy_id` (uuid, references strategies)
      - `user_id` (uuid, references auth.users)
      - `text` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Add policies for users to view shared data
*/

-- Create tables
CREATE TABLE playbooks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  user_id uuid REFERENCES auth.users NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE maps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  image_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE strategies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  playbook_id uuid REFERENCES playbooks NOT NULL,
  map_id uuid REFERENCES maps NOT NULL,
  title text NOT NULL,
  description text,
  team text NOT NULL,
  side text NOT NULL,
  steps jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE strategy_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  strategy_id uuid REFERENCES strategies NOT NULL,
  image_url text NOT NULL,
  storage_path text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  strategy_id uuid REFERENCES strategies NOT NULL,
  user_id uuid REFERENCES auth.users NOT NULL,
  text text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE playbooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE maps ENABLE ROW LEVEL SECURITY;
ALTER TABLE strategies ENABLE ROW LEVEL SECURITY;
ALTER TABLE strategy_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Policies for playbooks
CREATE POLICY "Users can view all playbooks"
  ON playbooks
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create their own playbooks"
  ON playbooks
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own playbooks"
  ON playbooks
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own playbooks"
  ON playbooks
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for maps
CREATE POLICY "Anyone can view maps"
  ON maps
  FOR SELECT
  TO authenticated
  USING (true);

-- Policies for strategies
CREATE POLICY "Users can view all strategies"
  ON strategies
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create strategies in their playbooks"
  ON strategies
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM playbooks
      WHERE id = playbook_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update strategies in their playbooks"
  ON strategies
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM playbooks
      WHERE id = playbook_id
      AND user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM playbooks
      WHERE id = playbook_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete strategies in their playbooks"
  ON strategies
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM playbooks
      WHERE id = playbook_id
      AND user_id = auth.uid()
    )
  );

-- Policies for strategy images
CREATE POLICY "Users can view all strategy images"
  ON strategy_images
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage images for their strategies"
  ON strategy_images
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM strategies s
      JOIN playbooks p ON s.playbook_id = p.id
      WHERE s.id = strategy_id
      AND p.user_id = auth.uid()
    )
  );

-- Policies for comments
CREATE POLICY "Users can view all comments"
  ON comments
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create comments"
  ON comments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments"
  ON comments
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments"
  ON comments
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);