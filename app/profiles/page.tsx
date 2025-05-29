'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import type { ProfileWithActive } from '@/types/profile';
import { AvatarGenerator } from '@/components/AvatarGenerator';

export default function ProfilesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [profiles, setProfiles] = useState<ProfileWithActive[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showAvatarGenerator, setShowAvatarGenerator] = useState(false);
  const [formData, setFormData] = useState({
    display_name: '',
    bio: '',
    avatar_url: '',
    favorite_genres: [] as string[],
  });

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else {
      fetchProfiles();
    }
  }, [user, router]);

  const fetchProfiles = async () => {
    try {
      const response = await fetch('/api/profiles');
      if (response.ok) {
        const data = await response.json();
        setProfiles(data.profiles);
      }
    } catch (error) {
      console.error('プロフィール取得エラー:', error);
    } finally {
      setLoading(false);
    }
  };

  const createProfile = async () => {
    try {
      const response = await fetch('/api/profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchProfiles();
        setShowCreateForm(false);
        setFormData({
          display_name: '',
          bio: '',
          avatar_url: '',
          favorite_genres: [],
        });
      }
    } catch (error) {
      console.error('プロフィール作成エラー:', error);
    }
  };

  const switchProfile = async (profileId: string) => {
    try {
      const response = await fetch('/api/profiles/active', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile_id: profileId }),
      });

      if (response.ok) {
        await fetchProfiles();
      }
    } catch (error) {
      console.error('プロフィール切り替えエラー:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-purple-300">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">プロフィール管理</h1>

        <div className="mb-8">
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors"
          >
            新しいプロフィールを作成
          </button>
        </div>

        {showCreateForm && (
          <div className="bg-gray-900 rounded-lg p-6 mb-8 border border-purple-500/20">
            <h2 className="text-xl font-bold mb-4">新規プロフィール作成</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-purple-300 mb-2">
                  表示名 *
                </label>
                <input
                  type="text"
                  value={formData.display_name}
                  onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-purple-500/20 rounded-lg focus:outline-none focus:border-purple-500"
                  placeholder="ペンネームやニックネーム"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-purple-300 mb-2">
                  自己紹介
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-purple-500/20 rounded-lg focus:outline-none focus:border-purple-500"
                  rows={3}
                  placeholder="あなたについて教えてください"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-purple-300 mb-2">
                  アバター
                </label>
                <div className="space-y-2">
                  {formData.avatar_url && (
                    <img
                      src={formData.avatar_url}
                      alt="アバタープレビュー"
                      className="w-24 h-24 rounded-full mx-auto"
                    />
                  )}
                  <input
                    type="url"
                    value={formData.avatar_url}
                    onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-purple-500/20 rounded-lg focus:outline-none focus:border-purple-500"
                    placeholder="https://example.com/avatar.jpg"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAvatarGenerator(!showAvatarGenerator)}
                    className="w-full px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-lg transition-colors"
                  >
                    {showAvatarGenerator ? 'AI生成を閉じる' : 'AIでアバターを生成'}
                  </button>
                  {showAvatarGenerator && (
                    <div className="mt-4 p-4 bg-gray-850 rounded-lg border border-purple-500/10">
                      <AvatarGenerator
                        onGenerated={(imageUrl) => {
                          setFormData({ ...formData, avatar_url: imageUrl });
                          setShowAvatarGenerator(false);
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={createProfile}
                  disabled={!formData.display_name}
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  作成
                </button>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors"
                >
                  キャンセル
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          {profiles.map((profile) => (
            <div
              key={profile.id}
              className={`bg-gray-900 rounded-lg p-6 border transition-all ${
                profile.is_active
                  ? 'border-purple-500 shadow-lg shadow-purple-500/20'
                  : 'border-purple-500/20 hover:border-purple-500/40'
              }`}
            >
              <div className="flex items-start gap-4">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.display_name}
                    className="w-16 h-16 rounded-full"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                    {profile.display_name[0].toUpperCase()}
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-1">{profile.display_name}</h3>
                  {profile.bio && (
                    <p className="text-purple-300 text-sm mb-3">{profile.bio}</p>
                  )}
                  {profile.is_active ? (
                    <div className="text-purple-400 text-sm font-medium">✨ 現在着用中</div>
                  ) : (
                    <button
                      onClick={() => switchProfile(profile.id)}
                      className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      このプロフィールを着る
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}