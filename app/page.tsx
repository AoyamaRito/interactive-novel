import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Sparkles, Bot, Image as ImageIcon, CreditCard } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="container mx-auto px-4 py-16">
        {/* ヒーローセクション */}
        <div className="text-center max-w-4xl mx-auto mb-20">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            AI創作プラットフォーム
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8">
            AIとの対話で、画像やストーリーを生成
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/story-creator">
              <Button className="text-lg px-8 py-4">
                <Sparkles className="mr-2" />
                始める
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" className="text-lg px-8 py-4">
                ログイン
              </Button>
            </Link>
          </div>
        </div>

        {/* 機能カード */}
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <div className="p-6 bg-slate-800 rounded-lg border border-slate-700">
            <Bot className="w-8 h-8 text-blue-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">AI対話</h3>
            <p className="text-gray-400 mb-4">
              OpenAI APIを使用した高度な対話機能
            </p>
            <Link href="/story-creator" className="text-blue-400 hover:text-blue-300">
              試す →
            </Link>
          </div>

          <div className="p-6 bg-slate-800 rounded-lg border border-slate-700">
            <ImageIcon className="w-8 h-8 text-purple-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">画像生成</h3>
            <p className="text-gray-400 mb-4">
              Photon-1による高品質な画像生成
            </p>
            <Link href="/worldbuilding" className="text-purple-400 hover:text-purple-300">
              見る →
            </Link>
          </div>

          <div className="p-6 bg-slate-800 rounded-lg border border-slate-700">
            <CreditCard className="w-8 h-8 text-green-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">シンプルな料金</h3>
            <p className="text-gray-400 mb-4">
              月額制ですべての機能が利用可能
            </p>
            <Link href="/subscribe" className="text-green-400 hover:text-green-300">
              料金を見る →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}