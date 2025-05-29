'use client';

import { useEffect } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { PenTool, BookOpen, Palette, Music, Video, Sparkles } from 'lucide-react';
import Header from '@/components/layout/Header';
import Link from 'next/link';

const CREATIVE_TOOLS = [
  {
    id: 'story',
    title: 'Story Creator',
    titleJa: '\u7269\u8a9e\u30af\u30ea\u30a8\u30a4\u30bf\u30fc',
    description: 'Create stories using your characters',
    descriptionJa: '\u4f5c\u6210\u3057\u305f\u30ad\u30e3\u30e9\u30af\u30bf\u30fc\u3092\u4f7f\u3063\u3066\u7269\u8a9e\u3092\u751f\u6210',
    icon: PenTool,
    href: '/story-creator',
    color: 'from-purple-500 to-pink-500',
    available: true,
  },
  {
    id: 'illustration',
    title: 'Illustration',
    titleJa: '\u30a4\u30e9\u30b9\u30c8\u751f\u6210',
    description: 'Generate illustrations for your stories',
    descriptionJa: '\u7269\u8a9e\u306e\u30a4\u30e9\u30b9\u30c8\u3092\u751f\u6210',
    icon: Palette,
    href: '/creative/illustration',
    color: 'from-blue-500 to-cyan-500',
    available: false,
  },
  {
    id: 'audiobook',
    title: 'Audiobook',
    titleJa: '\u30aa\u30fc\u30c7\u30a3\u30aa\u30d6\u30c3\u30af',
    description: 'Convert stories to audio',
    descriptionJa: '\u7269\u8a9e\u3092\u97f3\u58f0\u5316',
    icon: Music,
    href: '/creative/audiobook',
    color: 'from-green-500 to-emerald-500',
    available: false,
  },
  {
    id: 'animation',
    title: 'Animation',
    titleJa: '\u30a2\u30cb\u30e1\u30fc\u30b7\u30e7\u30f3',
    description: 'Create animated stories',
    descriptionJa: '\u7269\u8a9e\u3092\u30a2\u30cb\u30e1\u30fc\u30b7\u30e7\u30f3\u5316',
    icon: Video,
    href: '/creative/animation',
    color: 'from-orange-500 to-red-500',
    available: false,
  },
];

export default function CreativePage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
              <Sparkles className="h-10 w-10 text-purple-400" />
              \u30af\u30ea\u30a8\u30a4\u30c6\u30a3\u30d6\u30b9\u30bf\u30b8\u30aa
            </h1>
            <p className="text-xl text-purple-300">
              AI\u3092\u6d3b\u7528\u3057\u3066\u5275\u9020\u7684\u306a\u30b3\u30f3\u30c6\u30f3\u30c4\u3092\u4f5c\u6210
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {CREATIVE_TOOLS.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link
                  key={tool.id}
                  href={tool.available ? tool.href : '#'}
                  className={`relative group ${!tool.available ? 'cursor-not-allowed' : ''}`}
                >
                  <div className={`relative overflow-hidden rounded-2xl border ${
                    tool.available 
                      ? 'border-purple-500/30 hover:border-purple-500/60' 
                      : 'border-gray-700/50'
                  } transition-all duration-300`}>
                    {/* Background gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${
                      tool.available ? tool.color : 'from-gray-700 to-gray-800'
                    } opacity-10 group-hover:opacity-20 transition-opacity`} />
                    
                    {/* Content */}
                    <div className="relative p-8">
                      <div className="flex items-start justify-between mb-4">
                        <Icon className={`h-12 w-12 ${
                          tool.available ? 'text-purple-400' : 'text-gray-500'
                        }`} />
                        {!tool.available && (
                          <span className="px-3 py-1 bg-gray-700 text-gray-400 text-xs rounded-full">
                            Coming Soon
                          </span>
                        )}
                      </div>
                      
                      <h3 className={`text-2xl font-bold mb-2 ${
                        tool.available ? 'text-white' : 'text-gray-400'
                      }`}>
                        {tool.titleJa}
                      </h3>
                      <p className={`text-sm mb-1 ${
                        tool.available ? 'text-purple-300' : 'text-gray-500'
                      }`}>
                        {tool.title}
                      </p>
                      <p className={`mt-3 ${
                        tool.available ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        {tool.descriptionJa}
                      </p>
                      
                      {tool.available && (
                        <div className="mt-6 flex items-center text-purple-400 group-hover:text-purple-300 transition-colors">
                          <span className="text-sm font-medium">\u4f7f\u3063\u3066\u307f\u308b</span>
                          <BookOpen className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="mt-12 p-6 bg-purple-900/20 rounded-lg border border-purple-500/20">
            <h2 className="text-xl font-semibold text-purple-300 mb-3">
              \u4eca\u5f8c\u306e\u6a5f\u80fd\u8ffd\u52a0\u4e88\u5b9a
            </h2>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-center gap-2">
                <span className="text-purple-400">•</span>
                \u30a4\u30e9\u30b9\u30c8\u751f\u6210: \u7269\u8a9e\u306e\u30b7\u30fc\u30f3\u3092\u30d3\u30b8\u30e5\u30a2\u30eb\u5316
              </li>
              <li className="flex items-center gap-2">
                <span className="text-purple-400">•</span>
                \u30aa\u30fc\u30c7\u30a3\u30aa\u30d6\u30c3\u30af: \u30d7\u30ed\u306e\u58f0\u512aAI\u306b\u3088\u308b\u6717\u8aad
              </li>
              <li className="flex items-center gap-2">
                <span className="text-purple-400">•</span>
                \u30a2\u30cb\u30e1\u30fc\u30b7\u30e7\u30f3: \u30ad\u30e3\u30e9\u30af\u30bf\u30fc\u304c\u52d5\u304f\u77ed\u7de8\u30a2\u30cb\u30e1
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}