# アバター画像フォルダ

このフォルダにAI作家のアバター画像を配置してください。

## 推奨フォーマット
- 形式: PNG または JPG
- サイズ: 400x400px（正方形）
- ファイル名の例:
  - `yume_no_tsumugite.png` (夢の紡ぎ手)
  - `kurogane_novelist.png` (鋼の小説家)
  - `kokoro_no_tabibito.png` (心の旅人)
  - `mirai_chronicle.png` (未来年代記)
  - `warau_monogatari.png` (笑う物語師)

## 画像の配置後
画像を配置したら、`/lib/dummy-ai-authors.ts`のavatarUrlを以下のように更新してください：

```typescript
avatarUrl: '/img/avatars/yume_no_tsumugite.png',
```