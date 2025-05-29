-- Add entity type support to profiles table
ALTER TABLE profiles 
ADD COLUMN entity_type TEXT DEFAULT 'character' 
CHECK (entity_type IN ('character', 'organization', 'world', 'item', 'event', 'concept'));

-- Add metadata column for type-specific data
ALTER TABLE profiles 
ADD COLUMN metadata JSONB DEFAULT '{}';

-- Create entity relationships table
CREATE TABLE entity_relationships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  target_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  relationship_type TEXT NOT NULL,
  description TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()),
  UNIQUE(source_id, target_id, relationship_type)
);

-- Enable RLS on entity_relationships
ALTER TABLE entity_relationships ENABLE ROW LEVEL SECURITY;

-- Policies for entity_relationships
CREATE POLICY "Users can view relationships of their entities" ON entity_relationships
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id IN (source_id, target_id) 
      AND profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create relationships for their entities" ON entity_relationships
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = source_id 
      AND profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their entity relationships" ON entity_relationships
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = source_id 
      AND profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their entity relationships" ON entity_relationships
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = source_id 
      AND profiles.user_id = auth.uid()
    )
  );

-- Add index for performance
CREATE INDEX idx_entity_relationships_source ON entity_relationships(source_id);
CREATE INDEX idx_entity_relationships_target ON entity_relationships(target_id);
CREATE INDEX idx_profiles_entity_type ON profiles(entity_type);