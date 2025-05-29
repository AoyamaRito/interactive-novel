export type EntityType = 'character' | 'organization' | 'world' | 'item' | 'event' | 'concept';

export interface Profile {
  id: string;
  user_id: string;
  display_name: string;
  avatar_url?: string;
  bio?: string;
  favorite_genres?: string[];
  entity_type?: EntityType;
  metadata?: Record<string, any>;
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

export interface EntityRelationship {
  id: string;
  source_id: string;
  target_id: string;
  relationship_type: string;
  description?: string;
  metadata?: Record<string, any>;
  created_at: string;
}

// Type-specific metadata interfaces
export interface CharacterMetadata {
  personality?: string;
  skills?: string[];
  occupation?: string;
  relationships?: { [key: string]: string };
}

export interface OrganizationMetadata {
  type?: string;
  size?: string;
  headquarters?: string;
  leadership?: string;
  purpose?: string;
}

export interface WorldMetadata {
  geography?: string;
  culture?: string;
  history?: string;
  physics_rules?: string;
  technology_level?: string;
}

export interface ItemMetadata {
  properties?: string[];
  rarity?: string;
  abilities?: string;
  origin?: string;
  material?: string;
}

export interface EventMetadata {
  date?: string;
  location?: string;
  participants?: string[];
  impact?: string;
  duration?: string;
}

export interface ConceptMetadata {
  definition?: string;
  applications?: string[];
  related_concepts?: string[];
  origin?: string;
}