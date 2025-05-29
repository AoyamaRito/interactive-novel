import yaml from 'js-yaml';
import { StoryNode, StoryEdge, RelationshipType } from '@/types/story-graph';

// YAMLで物語を定義する構造
export interface StoryYAML {
  title: string;
  description?: string;
  
  // ノード定義
  characters?: Record<string, {
    name: string;
    description?: string;
    traits?: string[];
    goals?: string[];
  }>;
  
  locations?: Record<string, {
    name: string;
    description?: string;
    atmosphere?: string;
  }>;
  
  items?: Record<string, {
    name: string;
    description?: string;
    power?: string;
    owner?: string; // キャラクターID
  }>;
  
  events?: Record<string, {
    name: string;
    description?: string;
    when?: string;
    where?: string; // 場所ID
    participants?: string[]; // キャラクターID
    causes?: string[]; // 他のイベントID
    effects?: string[]; // 他のイベントID
  }>;
  
  // 関係性定義
  relationships?: Array<{
    from: string;
    to: string;
    type: string;
    description?: string;
    strength?: number;
  }>;
  
  // プロット進行
  plot_sequence?: string[]; // イベントIDの順序
}

// YAMLをグラフ構造に変換
export function parseStoryYAML(yamlContent: string): {
  nodes: Omit<StoryNode, 'id' | 'created_at' | 'updated_at'>[];
  edges: Omit<StoryEdge, 'id' | 'graph_id' | 'from_node_id' | 'to_node_id'>[];
} {
  const story = yaml.load(yamlContent) as StoryYAML;
  const nodes: Omit<StoryNode, 'id' | 'created_at' | 'updated_at'>[] = [];
  const edges: Omit<StoryEdge, 'id' | 'graph_id' | 'from_node_id' | 'to_node_id'>[] = [];
  const nodeIdMap = new Map<string, string>();
  
  // キャラクターノードを作成
  if (story.characters) {
    Object.entries(story.characters).forEach(([id, char]) => {
      const nodeId = `char_${id}`;
      nodeIdMap.set(id, nodeId);
      nodes.push({
        type: 'character',
        title: char.name,
        description: char.description,
        metadata: {
          traits: char.traits,
          goals: char.goals,
        },
      });
    });
  }
  
  // 場所ノードを作成
  if (story.locations) {
    Object.entries(story.locations).forEach(([id, loc]) => {
      const nodeId = `loc_${id}`;
      nodeIdMap.set(id, nodeId);
      nodes.push({
        type: 'location',
        title: loc.name,
        description: loc.description,
        metadata: {
          atmosphere: loc.atmosphere,
        },
      });
    });
  }
  
  // アイテムノードを作成
  if (story.items) {
    Object.entries(story.items).forEach(([id, item]) => {
      const nodeId = `item_${id}`;
      nodeIdMap.set(id, nodeId);
      nodes.push({
        type: 'item',
        title: item.name,
        description: item.description,
        metadata: {
          power: item.power,
        },
      });
      
      // 所有関係を作成
      if (item.owner && nodeIdMap.has(item.owner)) {
        edges.push({
          relationship_type: 'owns' as RelationshipType,
          label: '所有',
        });
      }
    });
  }
  
  // イベントノードを作成
  if (story.events) {
    Object.entries(story.events).forEach(([id, event]) => {
      const nodeId = `event_${id}`;
      nodeIdMap.set(id, nodeId);
      nodes.push({
        type: 'event',
        title: event.name,
        description: event.description,
        metadata: {
          when: event.when,
        },
      });
      
      // イベントと場所の関係
      if (event.where && nodeIdMap.has(event.where)) {
        edges.push({
          relationship_type: 'located_at' as RelationshipType,
          label: '発生場所',
        });
      }
      
      // イベントと参加者の関係
      if (event.participants) {
        event.participants.forEach(participantId => {
          if (nodeIdMap.has(participantId)) {
            edges.push({
              relationship_type: 'participates' as RelationshipType,
              label: '参加',
            });
          }
        });
      }
    });
  }
  
  // 明示的な関係性を追加
  if (story.relationships) {
    story.relationships.forEach(rel => {
      if (nodeIdMap.has(rel.from) && nodeIdMap.has(rel.to)) {
        edges.push({
          relationship_type: rel.type as RelationshipType,
          label: rel.type,
          description: rel.description,
          strength: rel.strength,
        });
      }
    });
  }
  
  return { nodes, edges };
}

// グラフ構造をYAMLに変換
export function graphToYAML(
  nodes: StoryNode[],
  edges: StoryEdge[]
): string {
  const story: StoryYAML = {
    title: 'Story Graph Export',
    characters: {},
    locations: {},
    items: {},
    events: {},
    relationships: [],
  };
  
  // ノードを種類別に整理
  nodes.forEach(node => {
    const simpleId = node.id.replace(/^(char|loc|item|event)_/, '');
    
    switch (node.type) {
      case 'character':
        story.characters![simpleId] = {
          name: node.title,
          description: node.description,
          traits: node.metadata?.traits,
          goals: node.metadata?.goals,
        };
        break;
      case 'location':
        story.locations![simpleId] = {
          name: node.title,
          description: node.description,
          atmosphere: node.metadata?.atmosphere,
        };
        break;
      case 'item':
        story.items![simpleId] = {
          name: node.title,
          description: node.description,
          power: node.metadata?.power,
        };
        break;
      case 'event':
        story.events![simpleId] = {
          name: node.title,
          description: node.description,
          when: node.metadata?.when,
        };
        break;
    }
  });
  
  // エッジを関係性に変換
  edges.forEach(edge => {
    const fromNode = nodes.find(n => n.id === edge.from_node_id);
    const toNode = nodes.find(n => n.id === edge.to_node_id);
    
    if (fromNode && toNode) {
      story.relationships!.push({
        from: fromNode.title,
        to: toNode.title,
        type: edge.relationship_type,
        description: edge.description,
        strength: edge.strength,
      });
    }
  });
  
  return yaml.dump(story, {
    indent: 2,
    lineWidth: 80,
    noRefs: true,
  });
}