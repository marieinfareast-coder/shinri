# サンプル参照ロジックとユーザーサンプルの構造

Step 5 でユーザーのサンプル群（user_samples.json または同等のファイル）から類例を抽出するロジックと、サンプルファイルのスキーマ。

---

## サンプル参照の役割

Step 5 で類例を提示することで、ユーザーは「自分の方針に近い既存作例」を見て、方針の妥当性や方向性を確認できる。Step 4 で言語化された方針を、視覚的な参照点に接続する役割。

ただしこのステップは**任意**である。ユーザーがサンプルファイルを用意していない場合、Step 5 はスキップして Step 6 に進んでよい。

---

## マッチングロジック

サンプルファイル（user_samples.json）から以下の条件でマッチング：

1. **emotional_tags** がユーザーの情動選択と部分一致
2. **script_family** が決定された書体系統と一致
3. **character の属性**（一字／長文等）が近い

マッチしたサンプルから2〜3点を選び、philosophical_note と（あれば）画像 URL を提示。「類例」と明示し、コピーではないことを強調する。

### スコアリングの簡易ルール

各サンプルに対して：

- emotional_tags の一致数 × 2点
- script_family が一致 → +5点
- character の文字数カテゴリが一致（短文／長文）→ +2点
- engine_compatibility がユーザーの環境と一致 → +1点

合計スコア上位 2〜3 件を提示。

---

## サンプルファイル（user_samples.json）のスキーマ

```json
[
  {
    "id": "[一意のID、文字列]",
    "character": "[書いた文字または文字列]",
    "title": "[作品のタイトル、なくてもよい]",
    "engine_used": "image2 | nanobanana | nanobanana_pro | both",
    "script_family": "sokintai | classical | kyousou | gendai | zenei | wayou | keitan | autograph",
    "emotional_tags": ["heavy", "light", "hard", "soft", "hot", "cold", "full", "empty", "present", "past", "dream"],
    "approach_summary": "[アプローチの一文要約]",
    "philosophical_note": "[作品の意図・哲学的背景。Step 5 で提示する短文]",
    "engine_compatibility": {
      "nanobanana_2": "ok | reject | warning",
      "nanobanana_pro": "ok | reject | warning",
      "image2": "ok | reject | warning"
    },
    "image_url": "[画像のURL、あれば]"
  }
]
```

### フィールドの説明

| フィールド | 必須 | 内容 |
|---|---|---|
| id | ✓ | 一意のID（例：`zenei_explosion_001`） |
| character | ✓ | 書いた文字または文字列。一字でも長文でも可 |
| title | - | 作品のタイトル、なければ character と同じでよい |
| engine_used | ✓ | 実際に使用したエンジン |
| script_family | ✓ | 8系統のいずれか |
| emotional_tags | ✓ | 5情動軸のキー名（heavy/light/hard/soft/hot/cold/full/empty/present/past/dream）から該当するものを選ぶ |
| approach_summary | ✓ | 一文での要約。Step 5 で短く提示する |
| philosophical_note | ✓ | 作品の意図や哲学的背景。Step 5 で1〜3文で提示する |
| engine_compatibility | - | エンジンごとの拒否・警告情報（任意） |
| image_url | - | 画像のURL（任意、外部ホスティング推奨） |

---

## サンプル例のテンプレート

各書体系統に対応するサンプル枠の例。ユーザーは自分の作品で同様の構造を作る。

```json
[
  {
    "id": "sokintai_example",
    "character": "[文字]",
    "title": "[タイトル]",
    "engine_used": "nanobanana_pro",
    "script_family": "sokintai",
    "emotional_tags": ["hard", "cold"],
    "approach_summary": "痩金体の極細線、Freezing temperature",
    "philosophical_note": "金属ワイヤー状の線で空間を切り裂く。徽宗の痩金体を現代の物質感覚で再構築。"
  },
  {
    "id": "zenei_explosion_example",
    "character": "[文字]",
    "title": "[タイトル]",
    "engine_used": "image2",
    "script_family": "zenei",
    "emotional_tags": ["hot", "hard", "full", "present"],
    "approach_summary": "結体の半解体、爆発的な飛沫、井上有一型",
    "philosophical_note": "怒りの直接的な物質化。読める範囲を保ちながら結体を暴れさせる。"
  },
  {
    "id": "keitan_example",
    "character": "[文字]",
    "title": "[タイトル]",
    "engine_used": "both",
    "script_family": "keitan",
    "emotional_tags": ["light", "soft", "cold", "empty", "dream"],
    "approach_summary": "弘一法師・良寛系。自我を消した素朴な置き方",
    "philosophical_note": "書き手が消える方向の到達点。私心のない静かな線。"
  },
  {
    "id": "gendai_long_example",
    "character": "[長文の文字列]",
    "title": "[タイトル]",
    "engine_used": "image2",
    "script_family": "gendai",
    "emotional_tags": ["soft", "light", "dream"],
    "approach_summary": "巨大なキャンバス全体を使った章法解体、潤渇の精緻な描写",
    "philosophical_note": "文字の意味より、全体の流転するエネルギーを優先。"
  },
  {
    "id": "classical_metarealism_example",
    "character": "[長文の文字列]",
    "title": "[タイトル]",
    "engine_used": "nanobanana",
    "script_family": "classical",
    "emotional_tags": ["heavy", "past", "full", "hard"],
    "approach_summary": "痩金体・顔真卿・乾隆風の混在、複数の鑑蔵印で時間レイヤーを重ねる",
    "philosophical_note": "文字ではなく、古文書という物質の説得力をシミュレート。"
  },
  {
    "id": "autograph_example",
    "character": "[名前またはイニシャル]",
    "title": "[タイトル]",
    "engine_used": "nanobanana",
    "script_family": "autograph",
    "emotional_tags": ["hard", "light", "showy"],
    "approach_summary": "ハイスピードな運筆、鋭い水平のストライク",
    "philosophical_note": "マエストロ系のエッセンスを現代の日常的な署名へと落とし込む。"
  }
]
```

これは**テンプレート**。実際のサンプルファイルは、ユーザー自身の作品で埋める。

---

## emotional_tags の許容値

5情動軸の各キーが許容値：

- weight: `heavy`, `light`
- texture: `hard`, `soft`
- temperature: `hot`, `cold`
- presence: `full`, `empty`
- time: `present`, `past`, `dream`

その他、署名用には：

- `fluid`（流麗）
- `sharp`（鋭利、硬質）
- `subtle`（控えめ）
- `showy`（派手）

複数選択可。すべての軸を埋める必要はない。

---

## engine_compatibility フィールドの活用

各サンプルに `engine_compatibility` フィールドが含まれる場合、実機検証情報をユーザーに伝える：

```
このサンプルの系統は Image2 推奨です（Nano Banana 2 では拒否される傾向）
```

これによりエンジン選択の精度が上がる。Step 5 でサンプル提示時、または Step 6 のエンジン推奨時に活用する。

---

## サンプルがない場合の動作

ユーザーが user_samples.json を用意していない場合：

1. Step 5 をスキップして Step 6 に進む
2. または、`references/translation_table.md` の★パターン（実機検証済みの組み合わせ）を「実機検証された型」として参考提示する

★パターンは抽象的な「型」の説明なので、画像はないが「あなたの方針はこの型に近い」と言語化できる。

---

## サンプル提示の文体

Step 5 でサンプルを提示するときの定型：

```
あなたの方針に近い類例：

【[サンプルのtitle]】
[approach_summary]
→ [philosophical_note]
（[engine_used] で生成）

[必要なら画像URLを提示]

これは類例です。完全なコピーではなく、
あなたの「[文字]×[情動]」固有の方針を組み立てます。
```

同時に2〜3点提示すると、ユーザーが選択肢の幅を持って Step 6 に進める。1点だけだと「これに従うのか」というプレッシャーになる。
