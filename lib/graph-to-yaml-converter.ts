// グラフ構造をAIが理解しやすいYAMLに変換する

export interface GraphToYamlOptions {
  // 空間的な配置情報を意味に変換
  interpretSpatialRelations?: boolean;
  // クラスター（近接ノード群）を検出
  detectClusters?: boolean;
  // 中心性を計算（重要度）
  calculateCentrality?: boolean;
}

export function convertGraphToYaml(
  nodes: any[],
  edges: any[],
  options: GraphToYamlOptions = {}
): string {
  
  // 1. 空間分析：ノードの配置から関係性を推測
  const spatialAnalysis = analyzeSpatialRelations(nodes);
  
  // 2. ネットワーク分析：つながりの密度から重要度を計算
  const centrality = calculateNodeCentrality(nodes, edges);
  
  // 3. クラスター検出：密接に関連するグループを発見
  const clusters = detectNodeClusters(nodes, edges);
  
  // 4. 時系列推定：左から右への配置を時間軸として解釈
  const timeline = inferTimeline(nodes, edges);

  // YAMLを構築
  const yaml = {
    metadata: {
      total_nodes: nodes.length,
      total_edges: edges.length,
      analysis_timestamp: new Date().toISOString(),
    },
    
    // 中心的な要素（主人公や核心的な出来事）
    central_elements: nodes
      .filter(n => centrality[n.id] > 0.7)
      .map(n => ({
        name: n.text,
        type: n.type,
        importance: centrality[n.id],
        connections: edges.filter(e => e.from === n.id || e.to === n.id).length,
      })),
    
    // 関係性マップ
    relationships: edges.map(edge => {
      const fromNode = nodes.find(n => n.id === edge.from);
      const toNode = nodes.find(n => n.id === edge.to);
      
      return {
        from: {
          name: fromNode.text,
          type: fromNode.type,
        },
        to: {
          name: toNode.text,
          type: toNode.type,
        },
        relationship: edge.type,
        label: edge.label,
        // 空間的な距離から関係の強さを推定
        strength: calculateRelationStrength(fromNode, toNode),
      };
    }),
    
    // クラスター（密接に関連するグループ）
    clusters: clusters.map((cluster, index) => ({
      cluster_id: `group_${index + 1}`,
      theme: inferClusterTheme(cluster, nodes),
      members: cluster.nodeIds.map(id => {
        const node = nodes.find(n => n.id === id);
        return {
          name: node.text,
          type: node.type,
          role_in_cluster: inferNodeRole(node, cluster, edges),
        };
      }),
    })),
    
    // 推定される時系列
    temporal_sequence: timeline.map((phase, index) => ({
      phase: index + 1,
      description: inferPhaseDescription(phase, nodes),
      key_events: phase.nodeIds
        .filter(id => nodes.find(n => n.id === id)?.type === 'event')
        .map(id => nodes.find(n => n.id === id)?.text),
      active_characters: phase.nodeIds
        .filter(id => nodes.find(n => n.id === id)?.type === 'character')
        .map(id => nodes.find(n => n.id === id)?.text),
    })),
    
    // AI向けの要約と指示
    ai_context: {
      story_summary: generateStorySummary(nodes, edges, clusters),
      main_conflict: identifyMainConflict(nodes, edges),
      suggested_themes: suggestThemes(nodes, edges),
      plot_holes: identifyPlotHoles(nodes, edges),
      
      // AIへの具体的な指示例
      generation_prompts: [
        `この構造を元に、${getCentralCharacter(nodes, centrality)}を主人公とした物語の第1章を書いてください。`,
        `${getMainConflict(nodes, edges)}という対立を中心に、クライマックスシーンを描写してください。`,
        `${getClusters(clusters)[0]}のグループ内での会話シーンを作成してください。`,
      ],
    },
  };
  
  return formatAsYaml(yaml);
}

// ヘルパー関数群

function analyzeSpatialRelations(nodes: any[]) {
  // 上下左右の配置から階層や時系列を推定
  const avgY = nodes.reduce((sum, n) => sum + n.y, 0) / nodes.length;
  const avgX = nodes.reduce((sum, n) => sum + n.x, 0) / nodes.length;
  
  return {
    topNodes: nodes.filter(n => n.y < avgY - 100),
    bottomNodes: nodes.filter(n => n.y > avgY + 100),
    leftNodes: nodes.filter(n => n.x < avgX - 100),
    rightNodes: nodes.filter(n => n.x > avgX + 100),
    centralNodes: nodes.filter(n => 
      Math.abs(n.x - avgX) < 100 && Math.abs(n.y - avgY) < 100
    ),
  };
}

function calculateNodeCentrality(nodes: any[], edges: any[]) {
  const centrality: Record<string, number> = {};
  
  nodes.forEach(node => {
    // 接続数ベースの単純な中心性計算
    const connections = edges.filter(e => 
      e.from === node.id || e.to === node.id
    ).length;
    
    centrality[node.id] = connections / edges.length;
  });
  
  return centrality;
}

function detectNodeClusters(nodes: any[], edges: any[]) {
  // 距離と接続密度からクラスターを検出
  const clusters: any[] = [];
  const visited = new Set<string>();
  
  nodes.forEach(node => {
    if (visited.has(node.id)) return;
    
    const cluster = {
      nodeIds: [node.id],
      center: { x: node.x, y: node.y },
    };
    
    // 近接ノードを探索
    const nearbyNodes = nodes.filter(n => {
      const distance = Math.sqrt(
        Math.pow(n.x - node.x, 2) + Math.pow(n.y - node.y, 2)
      );
      return distance < 150 && n.id !== node.id;
    });
    
    nearbyNodes.forEach(n => {
      if (!visited.has(n.id)) {
        cluster.nodeIds.push(n.id);
        visited.add(n.id);
      }
    });
    
    if (cluster.nodeIds.length > 1) {
      clusters.push(cluster);
    }
    visited.add(node.id);
  });
  
  return clusters;
}

function inferTimeline(nodes: any[], edges: any[]) {
  // X座標でソートして時系列を推定
  const sortedByX = [...nodes].sort((a, b) => a.x - b.x);
  const phases: any[] = [];
  
  let currentPhase = { nodeIds: [], avgX: 0 };
  let lastX = sortedByX[0]?.x || 0;
  
  sortedByX.forEach(node => {
    if (node.x - lastX > 200) {
      // 新しいフェーズ
      if (currentPhase.nodeIds.length > 0) {
        phases.push(currentPhase);
      }
      currentPhase = { nodeIds: [node.id], avgX: node.x };
    } else {
      currentPhase.nodeIds.push(node.id);
    }
    lastX = node.x;
  });
  
  if (currentPhase.nodeIds.length > 0) {
    phases.push(currentPhase);
  }
  
  return phases;
}

function calculateRelationStrength(from: any, to: any): number {
  const distance = Math.sqrt(
    Math.pow(to.x - from.x, 2) + Math.pow(to.y - from.y, 2)
  );
  
  // 距離が近いほど関係が強い（1-10のスケール）
  return Math.max(1, Math.min(10, Math.round(10 - (distance / 100))));
}

function inferClusterTheme(cluster: any, nodes: any[]): string {
  const types = cluster.nodeIds.map(id => 
    nodes.find(n => n.id === id)?.type
  );
  
  const typeCounts = types.reduce((acc, type) => {
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const dominantType = Object.entries(typeCounts)
    .sort(([, a], [, b]) => b - a)[0][0];
  
  const themeMap: Record<string, string> = {
    character: '人物関係',
    event: '連続する出来事',
    location: '地理的なつながり',
    item: 'アイテムの系譜',
    concept: '思想的なつながり',
  };
  
  return themeMap[dominantType] || '関連要素群';
}

function inferNodeRole(node: any, cluster: any, edges: any[]): string {
  const clusterEdges = edges.filter(e => 
    cluster.nodeIds.includes(e.from) && cluster.nodeIds.includes(e.to)
  );
  
  const incomingEdges = clusterEdges.filter(e => e.to === node.id).length;
  const outgoingEdges = clusterEdges.filter(e => e.from === node.id).length;
  
  if (outgoingEdges > incomingEdges) return '中心的存在';
  if (incomingEdges > outgoingEdges) return '影響を受ける存在';
  return 'メンバー';
}

function generateStorySummary(nodes: any[], edges: any[], clusters: any[]): string {
  const characters = nodes.filter(n => n.type === 'character');
  const events = nodes.filter(n => n.type === 'event');
  const locations = nodes.filter(n => n.type === 'location');
  
  return `${characters.length}人のキャラクター、${events.length}の出来事、${locations.length}の場所を含む物語構造。${clusters.length}つの主要なグループ/テーマが存在。`;
}

function identifyMainConflict(nodes: any[], edges: any[]): string {
  const conflictEdges = edges.filter(e => 
    e.type === 'opposes' || e.type === 'conflicts_with' || e.type === 'hates'
  );
  
  if (conflictEdges.length === 0) return '明確な対立構造は見つかりません';
  
  const mainConflict = conflictEdges[0];
  const from = nodes.find(n => n.id === mainConflict.from);
  const to = nodes.find(n => n.id === mainConflict.to);
  
  return `${from?.text || '不明'} vs ${to?.text || '不明'}`;
}

function suggestThemes(nodes: any[], edges: any[]): string[] {
  const themes: string[] = [];
  
  // 関係性のタイプから主題を推測
  const relationTypes = edges.map(e => e.type);
  
  if (relationTypes.includes('loves')) themes.push('愛と絆');
  if (relationTypes.includes('hates') || relationTypes.includes('opposes')) themes.push('対立と和解');
  if (relationTypes.includes('causes')) themes.push('因果応報');
  
  // ノードタイプから推測
  const hasItems = nodes.some(n => n.type === 'item');
  const hasEvents = nodes.some(n => n.type === 'event');
  
  if (hasItems) themes.push('力と責任');
  if (hasEvents) themes.push('運命と選択');
  
  return themes;
}

function identifyPlotHoles(nodes: any[], edges: any[]): string[] {
  const issues: string[] = [];
  
  // 孤立したノード
  const isolatedNodes = nodes.filter(node => 
    !edges.some(e => e.from === node.id || e.to === node.id)
  );
  
  if (isolatedNodes.length > 0) {
    issues.push(`${isolatedNodes.map(n => n.text).join(', ')} が他の要素と関連付けられていません`);
  }
  
  // 一方通行の関係
  const characters = nodes.filter(n => n.type === 'character');
  characters.forEach(char => {
    const outgoing = edges.filter(e => e.from === char.id && e.type === 'knows');
    const incoming = edges.filter(e => e.to === char.id && e.type === 'knows');
    
    if (outgoing.length > 0 && incoming.length === 0) {
      issues.push(`${char.text} は他者を知っているが、誰からも知られていない`);
    }
  });
  
  return issues;
}

function getCentralCharacter(nodes: any[], centrality: Record<string, number>): string {
  const characters = nodes.filter(n => n.type === 'character');
  const sorted = characters.sort((a, b) => centrality[b.id] - centrality[a.id]);
  return sorted[0]?.text || '主人公';
}

function getMainConflict(nodes: any[], edges: any[]): string {
  return identifyMainConflict(nodes, edges);
}

function getClusters(clusters: any[]): any[] {
  return clusters;
}

function inferPhaseDescription(phase: any, nodes: any[]): string {
  const phaseNodes = phase.nodeIds.map(id => nodes.find(n => n.id === id));
  const events = phaseNodes.filter(n => n?.type === 'event');
  
  if (events.length > 0) {
    return `${events.map(e => e.text).join('、')} が起こる段階`;
  }
  
  return 'フェーズ';
}

function formatAsYaml(obj: any): string {
  // 簡易的なYAML変換（実際はjs-yamlなどを使用）
  return JSON.stringify(obj, null, 2)
    .replace(/"/g, '')
    .replace(/,$/gm, '')
    .replace(/{/g, '')
    .replace(/}/g, '')
    .replace(/\[/g, '\n  -')
    .replace(/\]/g, '');
}