-- Story graphs table
CREATE TABLE story_graphs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  center_node_id UUID,
  layout_type TEXT DEFAULT 'force',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Story nodes table
CREATE TABLE story_nodes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  graph_id UUID REFERENCES story_graphs(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('character', 'event', 'location', 'item', 'concept', 'plot', 'theme')),
  title TEXT NOT NULL,
  description TEXT,
  metadata JSONB DEFAULT '{}',
  position JSONB,
  color TEXT,
  size TEXT DEFAULT 'medium' CHECK (size IN ('small', 'medium', 'large')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Story edges table
CREATE TABLE story_edges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  graph_id UUID REFERENCES story_graphs(id) ON DELETE CASCADE NOT NULL,
  from_node_id UUID REFERENCES story_nodes(id) ON DELETE CASCADE NOT NULL,
  to_node_id UUID REFERENCES story_nodes(id) ON DELETE CASCADE NOT NULL,
  relationship_type TEXT NOT NULL,
  label TEXT,
  description TEXT,
  strength INTEGER DEFAULT 5 CHECK (strength >= 1 AND strength <= 10),
  temporal_order INTEGER,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(graph_id, from_node_id, to_node_id, relationship_type)
);

-- Indexes
CREATE INDEX idx_story_graphs_user_id ON story_graphs(user_id);
CREATE INDEX idx_story_nodes_graph_id ON story_nodes(graph_id);
CREATE INDEX idx_story_edges_graph_id ON story_edges(graph_id);
CREATE INDEX idx_story_edges_from_node ON story_edges(from_node_id);
CREATE INDEX idx_story_edges_to_node ON story_edges(to_node_id);

-- RLS Policies
ALTER TABLE story_graphs ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_edges ENABLE ROW LEVEL SECURITY;

-- Graphs policies
CREATE POLICY "Users can view their own graphs" ON story_graphs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own graphs" ON story_graphs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own graphs" ON story_graphs
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own graphs" ON story_graphs
  FOR DELETE USING (auth.uid() = user_id);

-- Nodes policies (access through graph ownership)
CREATE POLICY "Users can view nodes in their graphs" ON story_nodes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM story_graphs 
      WHERE story_graphs.id = story_nodes.graph_id 
      AND story_graphs.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create nodes in their graphs" ON story_nodes
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM story_graphs 
      WHERE story_graphs.id = story_nodes.graph_id 
      AND story_graphs.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update nodes in their graphs" ON story_nodes
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM story_graphs 
      WHERE story_graphs.id = story_nodes.graph_id 
      AND story_graphs.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete nodes in their graphs" ON story_nodes
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM story_graphs 
      WHERE story_graphs.id = story_nodes.graph_id 
      AND story_graphs.user_id = auth.uid()
    )
  );

-- Edges policies (same pattern as nodes)
CREATE POLICY "Users can view edges in their graphs" ON story_edges
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM story_graphs 
      WHERE story_graphs.id = story_edges.graph_id 
      AND story_graphs.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create edges in their graphs" ON story_edges
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM story_graphs 
      WHERE story_graphs.id = story_edges.graph_id 
      AND story_graphs.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update edges in their graphs" ON story_edges
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM story_graphs 
      WHERE story_graphs.id = story_edges.graph_id 
      AND story_graphs.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete edges in their graphs" ON story_edges
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM story_graphs 
      WHERE story_graphs.id = story_edges.graph_id 
      AND story_graphs.user_id = auth.uid()
    )
  );