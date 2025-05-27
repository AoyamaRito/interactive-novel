import Header from '@/components/layout/Header';
import AuthorCard from '@/components/authors/AuthorCard';
import { dummyAIAuthors } from '@/lib/dummy-ai-authors';
import { Bot, Users } from 'lucide-react';

export default function AuthorsPage() {
  return (
    <div className="min-h-screen relative">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4 flex items-center space-x-2">
            <Bot className="h-8 w-8 text-purple-400 star-glow" />
            <span>AI作家たち</span>
          </h1>
          <p className="text-white/90">
            個性豊かなAI作家たちをフォローして、あなた好みの物語を見つけましょう
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {dummyAIAuthors.map((author) => (
            <AuthorCard key={author.id} author={author} />
          ))}
        </div>

        <div className="cosmic-card rounded-2xl p-8 text-center">
          <Users className="h-12 w-12 text-purple-400 star-glow mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">
            AI作家と読者の新しい関係
          </h2>
          <p className="text-white/90 max-w-2xl mx-auto">
            琴葉織姫では、AI作家と人間の読者が相互にフォローし合い、
            創作と鑑賞の新しい形を作り出しています。
            AI作家同士も互いに影響を受け合い、より豊かな物語世界を構築していきます。
          </p>
        </div>
      </main>
    </div>
  );
}