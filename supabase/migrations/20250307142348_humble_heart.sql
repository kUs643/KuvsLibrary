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

-- Create tables if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'playbooks') THEN
    CREATE TABLE playbooks (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      name text NOT NULL,
      user_id uuid NOT NULL REFERENCES auth.users(id),
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'maps') THEN
    CREATE TABLE maps (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      name text NOT NULL,
      image_url text NOT NULL,
      created_at timestamptz DEFAULT now()
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'strategies') THEN
    CREATE TABLE strategies (
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
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'strategy_images') THEN
    CREATE TABLE strategy_images (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      strategy_id uuid NOT NULL REFERENCES strategies(id),
      image_url text NOT NULL,
      storage_path text NOT NULL,
      created_at timestamptz DEFAULT now()
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'comments') THEN
    CREATE TABLE comments (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      strategy_id uuid NOT NULL REFERENCES strategies(id),
      user_id uuid NOT NULL REFERENCES auth.users(id),
      text text NOT NULL,
      created_at timestamptz DEFAULT now()
    );
  END IF;
END $$;

-- Enable Row Level Security
DO $$ 
BEGIN
  EXECUTE 'ALTER TABLE playbooks ENABLE ROW LEVEL SECURITY';
  EXECUTE 'ALTER TABLE maps ENABLE ROW LEVEL SECURITY';
  EXECUTE 'ALTER TABLE strategies ENABLE ROW LEVEL SECURITY';
  EXECUTE 'ALTER TABLE strategy_images ENABLE ROW LEVEL SECURITY';
  EXECUTE 'ALTER TABLE comments ENABLE ROW LEVEL SECURITY';
END $$;

-- Create policies if they don't exist
DO $$ 
BEGIN
  -- Playbook Policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'playbooks' AND policyname = 'Users can create their own playbooks') THEN
    CREATE POLICY "Users can create their own playbooks"
      ON playbooks
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'playbooks' AND policyname = 'Users can view all playbooks') THEN
    CREATE POLICY "Users can view all playbooks"
      ON playbooks
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'playbooks' AND policyname = 'Users can update their own playbooks') THEN
    CREATE POLICY "Users can update their own playbooks"
      ON playbooks
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'playbooks' AND policyname = 'Users can delete their own playbooks') THEN
    CREATE POLICY "Users can delete their own playbooks"
      ON playbooks
      FOR DELETE
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;

  -- Map Policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'maps' AND policyname = 'Anyone can view maps') THEN
    CREATE POLICY "Anyone can view maps"
      ON maps
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;

  -- Strategy Policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'strategies' AND policyname = 'Users can create strategies in their playbooks') THEN
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
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'strategies' AND policyname = 'Users can view all strategies') THEN
    CREATE POLICY "Users can view all strategies"
      ON strategies
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'strategies' AND policyname = 'Users can update strategies in their playbooks') THEN
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
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'strategies' AND policyname = 'Users can delete strategies in their playbooks') THEN
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
  END IF;

  -- Strategy Images Policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'strategy_images' AND policyname = 'Users can manage images for their strategies') THEN
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
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'strategy_images' AND policyname = 'Users can view all strategy images') THEN
    CREATE POLICY "Users can view all strategy images"
      ON strategy_images
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;

  -- Comment Policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'comments' AND policyname = 'Users can create comments') THEN
    CREATE POLICY "Users can create comments"
      ON comments
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'comments' AND policyname = 'Users can view all comments') THEN
    CREATE POLICY "Users can view all comments"
      ON comments
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'comments' AND policyname = 'Users can update their own comments') THEN
    CREATE POLICY "Users can update their own comments"
      ON comments
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'comments' AND policyname = 'Users can delete their own comments') THEN
    CREATE POLICY "Users can delete their own comments"
      ON comments
      FOR DELETE
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;