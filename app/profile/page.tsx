'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import Header from '@/components/layout/Header';
import { User, Edit3, Save, X, Camera } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface UserProfile {
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  favorite_genres: string[] | null;
}

const GENRE_OPTIONS = [
  'ファンタジー',
  'SF',
  'ミステリー',
  'ロマンス',
  'ホラー',
  'アクション',
  'コメディ',
  'ドラマ',
  '日常',
  '歴史',
];

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<UserProfile>({
    display_name: null,
    bio: null,
    avatar_url: null,
    favorite_genres: null,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<UserProfile>(profile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (user && !authLoading) {
      fetchProfile();
    }
  }, [user, authLoading]);

  const fetchProfile = async () => {
    try {
      const supabase = createClient();
      if (!supabase || !user) return;

      const { data, error } = await supabase
        .from('users')
        .select('display_name, bio, avatar_url, favorite_genres')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Profile fetch error:', error);
      } else if (data) {
        setProfile(data);
        setEditedProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    
    setSaving(true);
    setMessage(null);

    try {
      const supabase = createClient();
      if (!supabase) {
        throw new Error('Supabase client not available');
      }

      const { error } = await supabase
        .from('users')
        .update({
          display_name: editedProfile.display_name,
          bio: editedProfile.bio,
          avatar_url: editedProfile.avatar_url,
          favorite_genres: editedProfile.favorite_genres || [],
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) {
        throw error;
      }

      setProfile(editedProfile);
      setIsEditing(false);
      setMessage({ type: 'success', text: 'プロフィールを更新しました' });
    } catch (error) {
      console.error('Save error:', error);
      setMessage({ type: 'error', text: 'プロフィールの更新に失敗しました' });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const toggleGenre = (genre: string) => {
    const currentGenres = editedProfile.favorite_genres || [];
    const newGenres = currentGenres.includes(genre)
      ? currentGenres.filter(g => g !== genre)
      : [...currentGenres, genre];
    
    setEditedProfile({ ...editedProfile, favorite_genres: newGenres });
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen relative">
        <Header />
        <main className="max-w-2xl mx-auto px-4 py-16 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto"></div>
          <p className="text-white/70 mt-4">読み込み中...</p>
        </main>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen relative">
        <Header />
        <main className="max-w-2xl mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold text-white mb-4">ログインが必要です</h1>
          <a href="/login" className="text-cyan-400 hover:text-cyan-300">
            ログインページへ
          </a>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <Header />
      
      <main className="max-w-2xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-white mb-2">プロフィール</h1>
          <p className="text-white/70">あなたの情報を管理</p>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-500/20 border border-green-500/30 text-green-300' 
              : 'bg-red-500/20 border border-red-500/30 text-red-300'
          }`}>
            {message.text}
          </div>
        )}

        <div className="bg-white/10 border border-white/20 rounded-lg p-6">
          {/* アバターセクション */}
          <div className="flex items-center mb-8">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center">
                {profile.avatar_url ? (
                  <img 
                    src={profile.avatar_url} 
                    alt="Avatar" 
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User className="h-12 w-12 text-white" />
                )}
              </div>
              {isEditing && (
                <button className="absolute bottom-0 right-0 p-2 bg-cyan-500 rounded-full hover:bg-cyan-600 transition-colors">
                  <Camera className="h-4 w-4 text-white" />
                </button>
              )}
            </div>
            
            <div className="ml-6 flex-1">
              <div className="text-white/60 text-sm">メールアドレス</div>
              <div className="text-white">{user.email}</div>
              {user.app_metadata?.provider && (
                <div className="text-cyan-400 text-sm mt-1">
                  {user.app_metadata.provider}でログイン中
                </div>
              )}
            </div>

            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 rounded-lg hover:bg-cyan-500/30 transition-colors flex items-center gap-2"
              >
                <Edit3 className="h-4 w-4" />
                編集
              </button>
            )}
          </div>

          {/* プロフィール情報 */}
          <div className="space-y-6">
            <div>
              <label className="block text-white/70 text-sm mb-2">表示名</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedProfile.display_name || ''}
                  onChange={(e) => setEditedProfile({ ...editedProfile, display_name: e.target.value })}
                  placeholder="あなたの名前"
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all"
                />
              ) : (
                <p className="text-white">{profile.display_name || '未設定'}</p>
              )}
            </div>

            <div>
              <label className="block text-white/70 text-sm mb-2">自己紹介</label>
              {isEditing ? (
                <textarea
                  value={editedProfile.bio || ''}
                  onChange={(e) => setEditedProfile({ ...editedProfile, bio: e.target.value })}
                  placeholder="自己紹介を書いてください"
                  rows={4}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all resize-none"
                />
              ) : (
                <p className="text-white whitespace-pre-wrap">{profile.bio || '未設定'}</p>
              )}
            </div>

            <div>
              <label className="block text-white/70 text-sm mb-2">お気に入りジャンル</label>
              {isEditing ? (
                <div className="flex flex-wrap gap-2">
                  {GENRE_OPTIONS.map((genre) => (
                    <button
                      key={genre}
                      onClick={() => toggleGenre(genre)}
                      className={`px-3 py-1 rounded-full text-sm transition-all ${
                        editedProfile.favorite_genres?.includes(genre)
                          ? 'bg-cyan-500 text-white'
                          : 'bg-white/10 text-white/70 hover:bg-white/20'
                      }`}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {profile.favorite_genres && profile.favorite_genres.length > 0 ? (
                    profile.favorite_genres.map((genre) => (
                      <span
                        key={genre}
                        className="px-3 py-1 bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 rounded-full text-sm"
                      >
                        {genre}
                      </span>
                    ))
                  ) : (
                    <span className="text-white/50">未設定</span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* 編集時のアクションボタン */}
          {isEditing && (
            <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-white/10">
              <button
                onClick={handleCancel}
                disabled={saving}
                className="px-4 py-2 text-white/70 hover:text-white transition-colors disabled:opacity-50"
              >
                <X className="h-5 w-5" />
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-lg hover:from-emerald-600 hover:to-cyan-600 transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    保存中...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    保存
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}