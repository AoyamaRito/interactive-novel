export type User = {
  id: string;
  email: string;
  displayName?: string;
  avatarUrl?: string;
  subscriptionStatus: 'free' | 'premium';
  subscriptionId?: string;
  subscriptionEndDate?: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type NovelPreferences = {
  id: string;
  userId: string;
  genre: string[];
  themes: string[];
  characterTypes: string[];
  storyLength: 'short' | 'medium' | 'long';
  tone: 'lighthearted' | 'balanced' | 'serious';
  customPrompt?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Novel = {
  id: string;
  userId: string;
  title: string;
  content: string;
  summary?: string;
  genre: string[];
  generatedAt: Date;
  createdAt: Date;
  user?: User;
  likeCount?: number;
  isLikedByUser?: boolean;
};

export type Like = {
  id: string;
  userId: string;
  novelId: string;
  createdAt: Date;
};