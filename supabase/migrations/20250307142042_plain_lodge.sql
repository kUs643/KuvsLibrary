/*
  # Seed Maps Data

  1. Purpose
    - Populate the maps table with initial Valorant maps
    - Add default map images and information
*/

INSERT INTO maps (name, image_url) VALUES
  ('Haven', 'https://static.wikia.nocookie.net/valorant/images/7/70/Loading_Screen_Haven.png/revision/latest/scale-to-width-down/1000?cb=20200620202335'),
  ('Bind', 'https://images.unsplash.com/photo-1624138784614-87fd1b6528f8?auto=format&fit=crop&q=80&w=2000'),
  ('Split', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&q=80&w=2000'),
  ('Ascent', 'https://images.unsplash.com/photo-1614422264972-6c355f4c819d?auto=format&fit=crop&q=80&w=2000'),
  ('Icebox', 'https://images.unsplash.com/photo-1624138784614-87fd1b6528f8?auto=format&fit=crop&q=80&w=2000'),
  ('Breeze', 'https://images.unsplash.com/photo-1614422264972-6c355f4c819d?auto=format&fit=crop&q=80&w=2000'),
  ('Fracture', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&q=80&w=2000'),
  ('Pearl', 'https://images.unsplash.com/photo-1624138784614-87fd1b6528f8?auto=format&fit=crop&q=80&w=2000'),
  ('Lotus', 'https://images.unsplash.com/photo-1614422264972-6c355f4c819d?auto=format&fit=crop&q=80&w=2000'),
  ('Sunset', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&q=80&w=2000'),
  ('Abyss', 'https://images.unsplash.com/photo-1624138784614-87fd1b6528f8?auto=format&fit=crop&q=80&w=2000')
ON CONFLICT (id) DO NOTHING;