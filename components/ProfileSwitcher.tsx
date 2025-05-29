'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import type { ProfileWithActive } from '@/types/profile';

export function ProfileSwitcher() {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<ProfileWithActive[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProfiles();
    }
  }, [user]);

  const fetchProfiles = async () => {
    try {
      const response = await fetch('/api/profiles');
      if (response.ok) {
        const data = await response.json();
        setProfiles(data.profiles);
      }
    } catch (error) {
      console.error('プロフィール取得エラー:', error);
    }
  };

  const switchProfile = async (profileId: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/profiles/active', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile_id: profileId }),
      });

      if (response.ok) {
        await fetchProfiles();
        setIsOpen(false);
      }
    } catch (error) {
      console.error('プロフィール切り替えエラー:', error);
    } finally {
      setLoading(false);
    }
  };

  const activeProfile = profiles.find(p => p.is_active);

  if (!user || profiles.length === 0) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 transition-colors"
      >
        {activeProfile?.avatar_url ? (
          <img 
            src={activeProfile.avatar_url} 
            alt={activeProfile.display_name}
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-bold">
            {activeProfile?.display_name?.[0]?.toUpperCase()}
          </div>
        )}
        <span className="text-white font-medium">{activeProfile?.display_name}</span>
        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 w-64 bg-gray-900 rounded-lg shadow-xl border border-purple-500/20 overflow-hidden">
          <div className="p-2">
            <div className="text-purple-300 text-sm mb-2 px-2">プロフィールを選択</div>
            {profiles.map((profile) => (
              <button
                key={profile.id}
                onClick={() => switchProfile(profile.id)}
                disabled={profile.is_active || loading}
                className={`w-full flex items-center gap-3 p-2 rounded-lg transition-colors ${
                  profile.is_active 
                    ? 'bg-purple-500/20 cursor-default' 
                    : 'hover:bg-purple-500/10 cursor-pointer'
                }`}
              >
                {profile.avatar_url ? (
                  <img 
                    src={profile.avatar_url} 
                    alt={profile.display_name}
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-bold">
                    {profile.display_name[0].toUpperCase()}
                  </div>
                )}
                <div className="flex-1 text-left">
                  <div className="text-white font-medium">{profile.display_name}</div>
                  {profile.bio && (
                    <div className="text-purple-300 text-sm truncate">{profile.bio}</div>
                  )}
                </div>
                {profile.is_active && (
                  <div className="text-purple-400 text-sm">着用中</div>
                )}
              </button>
            ))}
          </div>
          <div className="border-t border-purple-500/20 p-2">
            <a
              href="/profiles"
              className="w-full block text-center py-2 text-purple-300 hover:text-purple-200 text-sm"
            >
              プロフィール管理
            </a>
          </div>
        </div>
      )}
    </div>
  );
}