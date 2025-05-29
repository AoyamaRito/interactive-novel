'use client';

import { useEffect } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { PenTool, BookOpen, Palette, Music, Video, Sparkles, Globe } from 'lucide-react';
import Header from '@/components/layout/Header';
import Link from 'next/link';
import { CREATIVE_CONTENT } from '@/lib/creative-content';

const CREATIVE_TOOLS = [
  {
    id: 'worldbuilding',
    title: CREATIVE_CONTENT.tools.worldbuilding.title,
    description: CREATIVE_CONTENT.tools.worldbuilding.description,
    icon: Globe,
    href: '/worldbuilding',
    color: 'from-indigo-500 to-purple-500',
    available: true,
  },
  {
    id: 'story',
    title: CREATIVE_CONTENT.tools.story.title,
    description: CREATIVE_CONTENT.tools.story.description,
    icon: PenTool,
    href: '/story-creator',
    color: 'from-purple-500 to-pink-500',
    available: true,
  },
  {
    id: 'illustration',
    title: CREATIVE_CONTENT.tools.illustration.title,
    description: CREATIVE_CONTENT.tools.illustration.description,
    icon: Palette,
    href: '/creative/illustration',
    color: 'from-blue-500 to-cyan-500',
    available: false,
  },
  {
    id: 'audiobook',
    title: CREATIVE_CONTENT.tools.audiobook.title,
    description: CREATIVE_CONTENT.tools.audiobook.description,
    icon: Music,
    href: '/creative/audiobook',
    color: 'from-green-500 to-emerald-500',
    available: false,
  },
  {
    id: 'animation',
    title: CREATIVE_CONTENT.tools.animation.title,
    description: CREATIVE_CONTENT.tools.animation.description,
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
              {CREATIVE_CONTENT.title}
            </h1>
            <p className="text-xl text-purple-300">
              {CREATIVE_CONTENT.subtitle}
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
                        {tool.title}
                      </h3>
                      <p className={`mt-3 ${
                        tool.available ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        {tool.description}
                      </p>
                      
                      {tool.available && (
                        <div className="mt-6 flex items-center text-purple-400 group-hover:text-purple-300 transition-colors">
                          <span className="text-sm font-medium">{CREATIVE_CONTENT.getStarted}</span>
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
              {CREATIVE_CONTENT.upcomingFeatures.title}
            </h2>
            <ul className="space-y-2 text-gray-300">
              {CREATIVE_CONTENT.upcomingFeatures.items.map((item, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="text-purple-400">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}