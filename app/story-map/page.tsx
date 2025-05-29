'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { 
  GitBranch, 
  Plus, 
  Trash2, 
  Save, 
  FileText,
  Sparkles,
  Download,
  ZoomIn,
  ZoomOut,
  Maximize2
} from 'lucide-react';
import Header from '@/components/layout/Header';

interface MapNode {
  id: string;
  x: number;
  y: number;
  text: string;
  type: 'character' | 'event' | 'location' | 'item' | 'concept' | 'plot';
  metadata?: Record<string, any>;
}

interface MapEdge {
  id: string;
  from: string;
  to: string;
  label?: string;
  type: 'causes' | 'knows' | 'owns' | 'located_at' | 'loves' | 'hates' | 'other';
}

const NODE_COLORS = {
  character: '#8B5CF6', // purple
  event: '#EF4444',     // red
  location: '#10B981',  // green
  item: '#F59E0B',      // yellow
  concept: '#3B82F6',   // blue
  plot: '#EC4899',      // pink
};

const EDGE_TYPES = [
  { value: 'causes', label: '原因となる' },
  { value: 'knows', label: '知っている' },
  { value: 'owns', label: '所有する' },
  { value: 'located_at', label: '位置する' },
  { value: 'loves', label: '愛している' },
  { value: 'hates', label: '憎んでいる' },
  { value: 'other', label: 'その他' },
];

export default function StoryMapPage() {
  const { user } = useAuth();
  const router = useRouter();
  const svgRef = useRef<SVGSVGElement>(null);
  const [nodes, setNodes] = useState<MapNode[]>([]);
  const [edges, setEdges] = useState<MapEdge[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<string | null>(null);
  const [draggingNode, setDraggingNode] = useState<string | null>(null);
  const [connecting, setConnecting] = useState<{ from: string } | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [showYaml, setShowYaml] = useState(false);
  const [yamlContent, setYamlContent] = useState('');

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  // ノード追加
  const addNode = (type: MapNode['type']) => {
    const newNode: MapNode = {
      id: `node-${Date.now()}`,
      x: 400 + Math.random() * 200,
      y: 300 + Math.random() * 200,
      text: '新しい' + 
        (type === 'character' ? 'キャラクター' :
         type === 'event' ? 'イベント' :
         type === 'location' ? '場所' :
         type === 'item' ? 'アイテム' :
         type === 'concept' ? '概念' : 'プロット'),
      type,
    };
    setNodes([...nodes, newNode]);
  };

  // ノード削除
  const deleteNode = (nodeId: string) => {
    setNodes(nodes.filter(n => n.id !== nodeId));
    setEdges(edges.filter(e => e.from !== nodeId && e.to !== nodeId));
    setSelectedNode(null);
  };

  // エッジ削除
  const deleteEdge = (edgeId: string) => {
    setEdges(edges.filter(e => e.id !== edgeId));
    setSelectedEdge(null);
  };

  // ノードのドラッグ
  const handleNodeDrag = (e: React.MouseEvent, nodeId: string) => {
    const svg = svgRef.current;
    if (!svg) return;

    const pt = svg.createSVGPoint();
    
    const handleMouseMove = (e: MouseEvent) => {
      pt.x = e.clientX;
      pt.y = e.clientY;
      const svgP = pt.matrixTransform(svg.getScreenCTM()?.inverse());
      
      setNodes(nodes => nodes.map(node => 
        node.id === nodeId 
          ? { ...node, x: svgP.x / zoom, y: svgP.y / zoom }
          : node
      ));
    };

    const handleMouseUp = () => {
      setDraggingNode(null);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    setDraggingNode(nodeId);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // 接続開始
  const startConnection = (nodeId: string) => {
    setConnecting({ from: nodeId });
  };

  // 接続完了
  const completeConnection = (toNodeId: string) => {
    if (connecting && connecting.from !== toNodeId) {
      const newEdge: MapEdge = {
        id: `edge-${Date.now()}`,
        from: connecting.from,
        to: toNodeId,
        type: 'other',
      };
      setEdges([...edges, newEdge]);
    }
    setConnecting(null);
  };

  // マインドマップをYAMLに変換
  const convertToYaml = () => {
    const yaml: any = {
      title: "ストーリーマップ",
      nodes: {},
      relationships: [],
    };

    // ノードを種類別に整理
    nodes.forEach(node => {
      const nodeType = node.type + 's';
      if (!yaml[nodeType]) yaml[nodeType] = {};
      
      const nodeId = node.text.replace(/\s+/g, '_').toLowerCase();
      yaml[nodeType][nodeId] = {
        name: node.text,
        position: { x: Math.round(node.x), y: Math.round(node.y) },
        metadata: node.metadata || {},
      };
    });

    // エッジを関係性に変換
    edges.forEach(edge => {
      const fromNode = nodes.find(n => n.id === edge.from);
      const toNode = nodes.find(n => n.id === edge.to);
      
      if (fromNode && toNode) {
        yaml.relationships.push({
          from: fromNode.text,
          to: toNode.text,
          type: edge.type,
          label: edge.label || edge.type,
        });
      }
    });

    // YAMLフォーマットに変換
    const yamlStr = JSON.stringify(yaml, null, 2)
      .replace(/^/gm, '')
      .replace(/"([^"]+)":/g, '$1:')
      .replace(/"/g, "'")
      .replace(/\{/g, '')
      .replace(/\}/g, '')
      .replace(/^\s*[\r\n]/gm, '');

    setYamlContent(yamlStr);
    setShowYaml(true);
  };

  // AIにYAMLを送信
  const sendToAI = async () => {
    // AIストーリー生成機能との連携
    alert('YAML内容をAIに送信して物語を生成します（実装予定）');
  };

  // ズーム機能
  const handleZoom = (delta: number) => {
    setZoom(z => Math.max(0.3, Math.min(2, z + delta)));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <GitBranch className="h-8 w-8 text-purple-400" />
              Story Mind Map
            </h1>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => handleZoom(0.1)}
                className="p-2 bg-gray-800 hover:bg-gray-700 rounded text-white"
              >
                <ZoomIn className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleZoom(-0.1)}
                className="p-2 bg-gray-800 hover:bg-gray-700 rounded text-white"
              >
                <ZoomOut className="h-4 w-4" />
              </button>
              <button
                onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}
                className="p-2 bg-gray-800 hover:bg-gray-700 rounded text-white"
              >
                <Maximize2 className="h-4 w-4" />
              </button>
              <button
                onClick={convertToYaml}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white transition-colors"
              >
                <FileText className="h-4 w-4" />
                YAMLに変換
              </button>
            </div>
          </div>

          <div className="grid lg:grid-cols-[200px_1fr] gap-6">
            {/* ツールパネル */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-purple-500/20 p-4">
              <h2 className="text-lg font-semibold text-purple-300 mb-4">
                ノード追加
              </h2>
              <div className="space-y-2">
                {Object.entries(NODE_COLORS).map(([type, color]) => (
                  <button
                    key={type}
                    onClick={() => addNode(type as MapNode['type'])}
                    className="w-full flex items-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white text-sm transition-colors"
                  >
                    <div 
                      className="w-4 h-4 rounded" 
                      style={{ backgroundColor: color }}
                    />
                    {type === 'character' ? 'キャラクター' :
                     type === 'event' ? 'イベント' :
                     type === 'location' ? '場所' :
                     type === 'item' ? 'アイテム' :
                     type === 'concept' ? '概念' : 'プロット'}
                  </button>
                ))}
              </div>

              {selectedNode && (
                <div className="mt-6">
                  <h3 className="text-sm font-semibold text-purple-300 mb-2">
                    選択中のノード
                  </h3>
                  <input
                    type="text"
                    value={nodes.find(n => n.id === selectedNode)?.text || ''}
                    onChange={(e) => {
                      setNodes(nodes.map(n => 
                        n.id === selectedNode 
                          ? { ...n, text: e.target.value }
                          : n
                      ));
                    }}
                    className="w-full px-3 py-1 bg-gray-700 border border-purple-500/30 rounded text-white text-sm"
                  />
                  <button
                    onClick={() => deleteNode(selectedNode)}
                    className="mt-2 w-full flex items-center justify-center gap-2 px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-white text-sm transition-colors"
                  >
                    <Trash2 className="h-3 w-3" />
                    削除
                  </button>
                </div>
              )}
            </div>

            {/* マインドマップ */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-purple-500/20 p-4">
              <svg
                ref={svgRef}
                className="w-full h-[600px] cursor-move"
                viewBox={`${pan.x} ${pan.y} ${800 / zoom} ${600 / zoom}`}
              >
                {/* エッジ */}
                {edges.map(edge => {
                  const fromNode = nodes.find(n => n.id === edge.from);
                  const toNode = nodes.find(n => n.id === edge.to);
                  if (!fromNode || !toNode) return null;

                  return (
                    <g key={edge.id}>
                      <line
                        x1={fromNode.x}
                        y1={fromNode.y}
                        x2={toNode.x}
                        y2={toNode.y}
                        stroke={selectedEdge === edge.id ? '#A855F7' : '#6B7280'}
                        strokeWidth="2"
                        markerEnd="url(#arrowhead)"
                        onClick={() => setSelectedEdge(edge.id)}
                        className="cursor-pointer hover:stroke-purple-400"
                      />
                      {edge.label && (
                        <text
                          x={(fromNode.x + toNode.x) / 2}
                          y={(fromNode.y + toNode.y) / 2}
                          fill="#E5E7EB"
                          fontSize="12"
                          textAnchor="middle"
                          className="pointer-events-none"
                        >
                          {edge.label}
                        </text>
                      )}
                    </g>
                  );
                })}

                {/* ノード */}
                {nodes.map(node => (
                  <g key={node.id}>
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r="30"
                      fill={NODE_COLORS[node.type]}
                      stroke={selectedNode === node.id ? '#FFFFFF' : 'transparent'}
                      strokeWidth="3"
                      className="cursor-pointer"
                      onMouseDown={(e) => handleNodeDrag(e, node.id)}
                      onClick={() => setSelectedNode(node.id)}
                      onDoubleClick={() => startConnection(node.id)}
                    />
                    <text
                      x={node.x}
                      y={node.y + 5}
                      fill="white"
                      fontSize="14"
                      textAnchor="middle"
                      className="pointer-events-none"
                    >
                      {node.text.length > 10 
                        ? node.text.substring(0, 10) + '...' 
                        : node.text}
                    </text>
                  </g>
                ))}

                {/* 矢印の定義 */}
                <defs>
                  <marker
                    id="arrowhead"
                    markerWidth="10"
                    markerHeight="7"
                    refX="9"
                    refY="3.5"
                    orient="auto"
                  >
                    <polygon
                      points="0 0, 10 3.5, 0 7"
                      fill="#6B7280"
                    />
                  </marker>
                </defs>
              </svg>
            </div>
          </div>

          {/* YAML表示モーダル */}
          {showYaml && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-gray-800 rounded-lg p-6 max-w-4xl max-h-[80vh] overflow-auto">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-white">YAML出力</h2>
                  <button
                    onClick={() => setShowYaml(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>
                
                <pre className="bg-gray-900 p-4 rounded text-sm text-gray-300 overflow-x-auto">
                  {yamlContent}
                </pre>
                
                <div className="mt-4 flex gap-4">
                  <button
                    onClick={sendToAI}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded text-white transition-colors"
                  >
                    <Sparkles className="h-4 w-4" />
                    AIで物語生成
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(yamlContent);
                      alert('コピーしました！');
                    }}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white transition-colors"
                  >
                    コピー
                  </button>
                  <button
                    onClick={() => {
                      const blob = new Blob([yamlContent], { type: 'text/yaml' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'story-map.yaml';
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      URL.revokeObjectURL(url);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    ダウンロード
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}