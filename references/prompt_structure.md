# プロンプト構造

Step 6 で最終プロンプトを生成する際の JSON 構造、ナラティブ・プロンプティング、ネガティブ命令、アスペクト比戦略。

---

## 7.1 漢字・仮名用 JSON 構造

```json
{
  "subject": {
    "text": "[文字]",
    "mode": "Classic | Gendai | Zenei | Keitan | Sokintai | Wayou | MetaRealism",
    "script_style": "[書体名 ＋ 参考書家を含む具体的な書風記述]"
  },
  "physics_engine": {
    "ink_viscosity": "Tar | Blood/Oil | Watery",
    "temperature": "Freezing | Burning | Neutral",
    "velocity": "Supersonic | Meditative | Naive(no display)",
    "tremor": "[手の震えの有無と強度。keitanではNone、震動・墨継ぎ型では強]",
    "ink_cycle": "[墨継ぎの有無、潤渇の遷移]"
  },
  "atmosphere": {
    "lighting": "Museum Spotlight | Natural Window | Cyber-Neon | Candlelight | Quiet Indoor",
    "material": "Aged Washi | Gold Leaf | Silk | Concrete | Ryoshi | Kenshi | etc",
    "reference_master": "[参考書家名と短い特徴]"
  },
  "composition": {
    "ma_control": "Minimalist | Dense | Chirashi-gaki | Cluster-with-emptiness",
    "aspect_ratio": "1:1 | 2:3 | 3:4 | 21:9 | etc",
    "seal_placement": "Orthodox | Floating | None | Multiple-Layered (MetaRealism)"
  },
  "narrative": "[全体を一文〜数文で語るナラティブ・プロンプト。映画の撮影指示書のように]"
}
```

### mode の選び方

| mode | 対応系統 | 用途 |
|---|---|---|
| Classic | classical | 智永・顔真卿・欧陽詢など、古典正統 |
| Gendai | gendai | 章法解体しつつ書として成立 |
| Zenei | zenei | 井上有一型、破壊・爆発型、文字の破壊そのもの |
| Keitan | keitan | 弘一・良寛系、自我を消した枯淡 |
| Sokintai | sokintai | 徽宗、針金、極細 |
| Wayou | wayou | 平安、散らし書き、和様 |
| MetaRealism | classical（変則） | 古文書偽装、複数書体・鑑蔵印 |

### physics_engine の各フィールド

- **ink_viscosity（墨の粘度）**: Tar=タール状の高粘度（流体・粘性型）、Blood/Oil=血液や油状（中粘度）、Watery=水のように薄い（淡墨）
- **temperature（温度）**: Freezing=凍結（sokintai）、Burning=燃焼（zenei 破壊型）、Neutral=中性
- **velocity（速度）**: Supersonic=超高速（kyousou, autograph）、Meditative=瞑想的にゆっくり（keitan）、Naive=速度を意識させない（classical 正統）
- **tremor（震え）**: keitan は None、震動・墨継ぎ型は強、その他は文字内容で判断
- **ink_cycle（墨の循環）**: 墨継ぎの位置と頻度、潤（湿った筆）から渇（乾いた筆）への遷移を記述

---

## 7.2 署名用 JSON 構造

漢字・仮名用と別の専用構造。autograph 系統では必ずこちらを使う。

```json
{
  "subject": {
    "text": "[名前またはイニシャル]",
    "style": "Maestro Autograph | Celebrity Quick | Gestural"
  },
  "speed_variation": {
    "anchor": "[始筆：ゆっくり、太く、エレガント]",
    "acceleration": "[中盤：高速、波線化、リエゾン]",
    "release": "[終筆：大きなパラフ、空間支配]"
  },
  "ink_physics": {
    "tool": "Flexible Nib Fountain Pen | Felt-tip | Ballpoint",
    "pooling": "[インク溜まりの位置]",
    "flying_white": "[かすれの位置]",
    "nib_split": "[ペン先の二重線の有無]"
  },
  "paper": "Textured heavy cardstock | Letter paper | Shikishi",
  "narrative": "[映画的ナラティブ]"
}
```

### speed_variation が重要

署名の表現力は速度の変化で決まる。anchor（始筆）→ acceleration（中盤）→ release（終筆）の3段階を明示的に設計することで、エンジンが速度感を画面に反映する。

- anchor: 名前の最初の文字、太く、ゆっくり、装飾的に
- acceleration: 中盤、文字をつなぎ、波線化し、リエゾン（連結）を多用
- release: 最後の終筆、大きなパラフ（曲線装飾）で空間を支配

---

## ナラティブ・プロンプティング

JSON だけでなく、**narrative フィールドに自然言語のストーリーを書く**ことが画像生成エンジンの理解度を大きく上げる。Image2 は特に narrative を大量に読む。

### ナラティブの構造

```
[Subject & Action] + [Physical Simulation] + [Style & Deconstruction]
+ [Lighting & Camera] + [Seal/Accent]
```

### 良いナラティブの例

> "A breathtaking calligraphy masterpiece of '龍', visualized as
> a living creature made of ink. Exploding splatter, twisting and
> turning, dynamic coiled energy. High-contrast dramatic lighting,
> macro detail of paper fibers soaking up wet ink."

### narrative の書き方のコツ

- 映画の撮影指示書のように書く
- 物理現象を具体的に描写する（墨が紙に染み込む、筆が走る、飛沫が飛ぶ）
- 抽象的な感情語より、視覚的・物理的記述が効く
- ライティングとカメラ位置を明示する（マクロ撮影、ドラマチック光線、ミュージアム展示など）

---

## ネガティブ命令の書き方

避けたい結果を明示的に書く。エンジンのデフォルト挙動を打ち消すために必須。

### 結体の崩しを意図する場合
- `NO standard font structures`
- `breaking traditional grid constraints`
- `NOT a perfectly aligned 9-square grid composition`

### 概念視覚化（Level c）の場合
- `Do NOT generate text`
- `Describe geometric shapes mimicking the Kanji parts`
- `NO readable characters`

### 美文字を避ける
- `NOT a perfect font`
- `NOT calligraphy textbook style`
- `NOT educational copy of classical works`

### マンガ的爆発を避ける（zenei 破壊型で重要）
- `NO cartoonish explosions`
- `NO anime-style impact lines`
- `physical ink splatter, not graphic design effects`

### 過剰な曲線を避ける（kyousou で重要）
- `NO boiled pasta effect`
- `NO overly continuous curves`
- `cursive but with disciplined modulation`

### 美術館的「綺麗すぎる」を避ける
- `NOT a museum-clean preservation photo`
- `raw, immediate, in-the-moment quality`

---

## アスペクト比の戦略

画像生成エンジンは**アスペクト比から構図バイアスを呼び出す**。これは見落とされがちだが極めて重要。Step 6 で必ず推奨アスペクト比を明記する。

| 比率 | 呼び出される構図 | 適合する書 |
|---|---|---|
| 1:1 | 軸装、色紙 | 一字書、サイン |
| 3:4 | ポートレート | 縦書き短文 |
| 2:3 | 軸装、ポスター | 縦長作品 |
| 21:9 | 横の連落、巻物 | 長文、章法重視 |
| 3:2 | 横長レター | 署名、横書き |

### 文字数とアスペクト比の対応

- 1〜2字：1:1（正方形）または 3:4（やや縦長）
- 数字の縦書き：2:3 または 3:4（縦長）
- 数字の横書き、または横の連落：21:9（極端な横長）
- 単純な署名：3:2（横長）

### アスペクト比は呼び出しのスイッチ

「縦長＝書」「正方形＝色紙」「横長21:9＝巻物・連落」とエンジンが学習しているため、アスペクト比を変えると同じプロンプトでも全く違う構図が出る。長文を 1:1 で出すと不自然な詰め込みになり、短文を 21:9 で出すと余白だらけの間延びになる。

---

## プロンプト出力の定型

Step 6 では以下の定型でプロンプトを提示する：

```
---
【生成プロンプト】

[JSON プロンプト本体]

---
【両エンジンへの投げ方】

[references/engine_behavior.md の定型メモを要約して提示]

あなたの方針「[要約]」には、[推薦エンジン]がやや向いています。
[推薦理由を1〜2文]

---
【アスペクト比の推奨】

[2:3 / 3:4 / 1:1 / 21:9 等を推奨理由つきで]
```

JSON は markdown のコードブロック（```json ... ```）で囲んで提示する。ユーザーがコピーしやすいように。
