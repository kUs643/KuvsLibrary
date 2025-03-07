export interface Database {
  public: {
    Tables: {
      playbooks: {
        Row: {
          id: string;
          name: string;
          user_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          user_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          user_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      maps: {
        Row: {
          id: string;
          name: string;
          image_url: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          image_url: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          image_url?: string;
          created_at?: string;
        };
      };
      strategies: {
        Row: {
          id: string;
          playbook_id: string;
          map_id: string;
          title: string;
          description: string | null;
          team: string;
          side: string;
          steps: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          playbook_id: string;
          map_id: string;
          title: string;
          description?: string | null;
          team: string;
          side: string;
          steps?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          playbook_id?: string;
          map_id?: string;
          title?: string;
          description?: string | null;
          team?: string;
          side?: string;
          steps?: string[];
          created_at?: string;
          updated_at?: string;
        };
      };
      strategy_images: {
        Row: {
          id: string;
          strategy_id: string;
          image_url: string;
          storage_path: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          strategy_id: string;
          image_url: string;
          storage_path: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          strategy_id?: string;
          image_url?: string;
          storage_path?: string;
          created_at?: string;
        };
      };
      comments: {
        Row: {
          id: string;
          strategy_id: string;
          user_id: string;
          text: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          strategy_id: string;
          user_id: string;
          text: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          strategy_id?: string;
          user_id?: string;
          text?: string;
          created_at?: string;
        };
      };
    };
  };
}