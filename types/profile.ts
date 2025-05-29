export interface Profile {
  id: string;
  user_id: string;
  display_name: string;
  avatar_url?: string;
  bio?: string;
  favorite_genres?: string[];
  created_at: string;
  updated_at: string;
}

export interface ActiveProfile {
  user_id: string;
  profile_id: string;
  updated_at: string;
}

export interface ProfileWithActive extends Profile {
  is_active: boolean;
}