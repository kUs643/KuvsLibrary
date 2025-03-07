/*
  # Create Playbook Schema

  1. New Tables
    - `playbooks`: Stores playbook collections
      - `id` (uuid, primary key)
      - `name` (text)
      - `user_id` (uuid, foreign key to auth.users)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `maps`: Stores map information
      - `id` (uuid, primary key)
      - `name` (text)
      - `image_url` (text)
      - `created_at` (timestamp)
    
    - `strategies`: Stores strategy details
      - `id` (uuid, primary key)
      - `playbook_id` (uuid, foreign key to playbooks)
      - `map_id` (uuid, foreign key to maps)
      - `title` (text)
      - `description` (text)
      - `team` (text)
      - `side` (text)
      - `steps` (jsonb array)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `strategy_images`: Stores strategy images
      - `id` (uuid, primary key)
      - `strategy_id` (uuid, foreign key to strategies)
      - `image_url` (text)
      - `storage_path` (text)
      - `created_at` (timestamp)
    
    - `comments`: Stores strategy comments
      - `id` (uuid, primary key)
      - `strategy_id` (uuid, foreign key to strategies)
      - `user_id` (uuid, foreign key to auth.users)
      - `text` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create tables
CREATE TABLE IF NOT EXISTS playbooks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  user_id uuid NOT NULL REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS maps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  image_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS strategies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  playbook_id uuid NOT NULL REFERENCES playbooks(id),
  map_id uuid NOT NULL REFERENCES maps(id),
  title text NOT NULL,
  description text,
  team text NOT NULL,
  side text NOT NULL,
  steps jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS strategy_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  strategy_id uuid NOT NULL REFERENCES strategies(id),
  image_url text NOT NULL,
  storage_path text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  strategy_id uuid NOT NULL REFERENCES strategies(id),
  user_id uuid NOT NULL REFERENCES auth.users(id),
  text text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE playbooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE maps ENABLE ROW LEVEL SECURITY;
ALTER TABLE strategies ENABLE ROW LEVEL SECURITY;
ALTER TABLE strategy_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Playbook Policies
CREATE POLICY "Users can create their own playbooks"
  ON playbooks
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view all playbooks"
  ON playbooks
  FOR SELECT
  TO authenticated
  USING (true);

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

-- Map Policies
CREATE POLICY "Anyone can view maps"
  ON maps
  FOR SELECT
  TO authenticated
  USING (true);

-- Strategy Policies
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

CREATE POLICY "Users can view all strategies"
  ON strategies
  FOR SELECT
  TO authenticated
  USING (true);

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

-- Strategy Images Policies
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

CREATE POLICY "Users can view all strategy images"
  ON strategy_images
  FOR SELECT
  TO authenticated
  USING (true);

-- Comment Policies
CREATE POLICY "Users can create comments"
  ON comments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view all comments"
  ON comments
  FOR SELECT
  TO authenticated
  USING (true);

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