// 物語要素のノード
export interface StoryNode {
  id: string;
  type: 'character' | 'event' | 'location' | 'item' | 'concept' | 'plot' | 'theme';
  title: string;
  description?: string;
  metadata?: Record<string, any>;
  position?: { x: number; y: number }; // マインドマップ上の位置
  color?: string; // ノードの色
  size?: 'small' | 'medium' | 'large'; // 重要度
  created_at: string;
  updated_at: string;
}

// ノード間の関係（有向エッジ）
export interface StoryEdge {
  id: string;
  from_node_id: string;
  to_node_id: string;
  relationship_type: RelationshipType;
  label?: string; // エッジのラベル
  description?: string;
  strength?: number; // 1-10: 関係の強さ
  temporal_order?: number; // 時系列順序
  metadata?: Record<string, any>;
}

// 関係性のタイプ
export type RelationshipType = 
  // キャラクター関係
  | 'loves' | 'hates' | 'knows' | 'related_to' | 'works_with'
  // 所有・使用
  | 'owns' | 'uses' | 'created' | 'destroyed'
  // 因果関係
  | 'causes' | 'prevents' | 'triggers' | 'resolves'
  // 場所関係
  | 'located_at' | 'travels_to' | 'from_location'
  // 時系列
  | 'happens_before' | 'happens_after' | 'happens_during'
  // プロット関係
  | 'motivates' | 'conflicts_with' | 'supports' | 'opposes'
  // その他
  | 'custom';

// マインドマップ全体
export interface StoryGraph {
  id: string;
  title: string;
  description?: string;
  nodes: StoryNode[];
  edges: StoryEdge[];
  center_node_id?: string; // 中心となるノード
  layout_type?: 'radial' | 'hierarchical' | 'force' | 'timeline';
  metadata?: {
    genre?: string;
    themes?: string[];
    target_audience?: string;
  };
  created_at: string;
  updated_at: string;
}

// ビュー設定
export interface GraphViewSettings {
  show_labels: boolean;
  show_descriptions: boolean;
  filter_node_types?: StoryNode['type'][];
  filter_edge_types?: RelationshipType[];
  highlight_path?: string[]; // ハイライトするノードIDの配列
  zoom_level: number;
  center_position: { x: number; y: number };
}