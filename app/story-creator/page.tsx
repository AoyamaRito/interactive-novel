'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { BookOpen, Sparkles, Check, Loader2 } from 'lucide-react';
import Header from '@/components/layout/Header';
import type { ProfileWithActive } from '@/types/profile';

const STORY_GENRES = [
  { value: '’°Ûø∏¸', label: '’°Ûø∏¸', icon: '>Ÿ' },
  { value: 'ﬂπ∆Í¸', label: 'ﬂπ∆Í¸', icon: '=' },
  { value: 'ÌﬁÛπ', label: 'ÌﬁÛπ', icon: '=ù' },
  { value: 'SF', label: 'SF', icon: '=Ä' },
  { value: '≥·«£', label: '≥·«£', icon: '=' },
  { value: '€È¸', label: '€È¸', icon: '={' },
  { value: 'íz', label: 'íz', icon: '=˙' },
  { value: 'Â8', label: 'Â8', icon: '' },
];

export default function StoryCreatorPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [profiles, setProfiles] = useState<ProfileWithActive[]>([]);
  const [selectedCharacters, setSelectedCharacters] = useState<string[]>([]);
  const [genre, setGenre] = useState('’°Ûø∏¸');
  const [additionalPrompt, setAdditionalPrompt] = useState('');
  const [aiProvider, setAiProvider] = useState<'openai' | 'xai' | undefined>(undefined);
  const [generating, setGenerating] = useState(false);
  const [generatedStory, setGeneratedStory] = useState<{
    title: string;
    content: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchProfiles();
  }, [user, router]);

  const fetchProfiles = async () => {
    try {
      const response = await fetch('/api/profiles');
      const data = await response.json();
      if (data.profiles) {
        setProfiles(data.profiles);
      }
    } catch (error) {
      console.error('◊Ì’£¸Î÷ó®È¸:', error);
    }
  };

  const toggleCharacter = (profileId: string) => {
    setSelectedCharacters(prev => 
      prev.includes(profileId)
        ? prev.filter(id => id !== profileId)
        : [...prev, profileId]
    );
  };

  const generateStory = async () => {
    if (selectedCharacters.length === 0) {
      setError('jOhÇ1∫n≠„ÈØø¸íxûWfO`UD');
      return;
    }

    setGenerating(true);
    setError(null);
    setGeneratedStory(null);

    try {
      const response = await fetch('/api/story/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          characterIds: selectedCharacters,
          genre,
          prompt: additionalPrompt,
          aiProvider,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'iûnk1WW~W_');
      }

      setGeneratedStory({
        title: data.title,
        content: data.content,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : '®È¸LzW~W_');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-purple-400" />
            iûØÍ®§ø¸
          </h1>

          {!generatedStory ? (
            <div className="grid lg:grid-cols-2 gap-8">
              {/* ≠„ÈØø¸xû */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-purple-500/20">
                <h2 className="text-xl font-semibold text-purple-300 mb-4">
                  {4∫iíxû
                </h2>
                <div className="space-y-3">
                  {profiles.map(profile => (
                    <button
                      key={profile.id}
                      onClick={() => toggleCharacter(profile.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                        selectedCharacters.includes(profile.id)
                          ? 'bg-purple-600/30 border-purple-500'
                          : 'bg-gray-700/30 border-gray-600 hover:bg-gray-700/50'
                      } border`}
                    >
                      {profile.avatar_url && (
                        <img
                          src={profile.avatar_url}
                          alt={profile.display_name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      )}
                      <div className="flex-1 text-left">
                        <p className="font-medium text-white">{profile.display_name}</p>
                        {profile.bio && (
                          <p className="text-sm text-gray-400 line-clamp-1">{profile.bio}</p>
                        )}
                      </div>
                      {selectedCharacters.includes(profile.id) && (
                        <Check className="h-5 w-5 text-purple-400" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* -ö */}
              <div className="space-y-6">
                {/* ∏„ÛÎxû */}
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-purple-500/20">
                  <h2 className="text-xl font-semibold text-purple-300 mb-4">
                    ∏„ÛÎ
                  </h2>
                  <div className="grid grid-cols-2 gap-2">
                    {STORY_GENRES.map(g => (
                      <button
                        key={g.value}
                        onClick={() => setGenre(g.value)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          genre === g.value
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        <span className="mr-2">{g.icon}</span>
                        {g.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* AIxû */}
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-purple-500/20">
                  <h2 className="text-xl font-semibold text-purple-300 mb-4">
                    AIxû
                  </h2>
                  <div className="space-y-2">
                    <button
                      onClick={() => setAiProvider('openai')}
                      className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        aiProvider === 'openai'
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      GPT-4o-mini
                    </button>
                    <button
                      onClick={() => setAiProvider('xai')}
                      className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        aiProvider === 'xai'
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      Grok-3
                    </button>
                  </div>
                </div>

                {/* ˝†n: */}
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-purple-500/20">
                  <h2 className="text-xl font-semibold text-purple-300 mb-4">
                    ˝†n:™◊∑ÁÛ	
                  </h2>
                  <textarea
                    value={additionalPrompt}
                    onChange={(e) => setAdditionalPrompt(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                    rows={3}
                    placeholder="ã: À≈í∆¸ﬁkW_’ÑjUãkWfO`UD"
                  />
                </div>

                {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-300">
                    {error}
                  </div>
                )}

                <button
                  onClick={generateStory}
                  disabled={generating || selectedCharacters.length === 0}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {generating ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      -...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />
                      iûí
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            /* Uå_iû */
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-8 border border-purple-500/20">
              <h2 className="text-2xl font-bold text-white mb-6">
                {generatedStory.title}
              </h2>
              
              <div className="prose prose-invert max-w-none">
                {generatedStory.content.split('\n').map((paragraph, index) => (
                  paragraph.trim() && (
                    <p key={index} className="text-gray-300 mb-4 leading-relaxed">
                      {paragraph}
                    </p>
                  )
                ))}
              </div>

              <div className="mt-8 flex gap-4">
                <button
                  onClick={() => setGeneratedStory(null)}
                  className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors"
                >
                  ∞WDiûí\ã
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}