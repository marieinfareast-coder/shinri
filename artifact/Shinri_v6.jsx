import React, { useState } from 'react';

// ============================================================
// ダミーsamples.json
// ============================================================
const SAMPLES = [
  { id: "tatakai_zenei", character: "闘", title: "闘——燃える怒り", engine_used: "image2", script_family: "zenei", emotional_tags: ["hot", "hard", "full", "present"], approach_summary: "結体の半解体、爆発的な飛沫、井上有一型", philosophical_note: "怒りの直接的な物質化。読める範囲を保ちながら結体を暴れさせる。" },
  { id: "inori_keitan", character: "祈", title: "祈——澄んだ無心", engine_used: "both", script_family: "keitan", emotional_tags: ["light", "soft", "cold", "empty", "dream"], approach_summary: "弘一法師・良寛系。自我を消した素朴な置き方", philosophical_note: "「闘」の対極。書き手が消える方向の到達点。" },
  { id: "seki_zenei", character: "咳", title: "咳——乾いた茨", engine_used: "nanobanana", script_family: "zenei", emotional_tags: ["hard", "cold", "empty", "present"], approach_summary: "乾いた茨のテクスチャ、内側へ食い込む収縮、酸化色", philosophical_note: "副鼻腔炎期の咳。気管の摩擦現象として描いた。" },
  { id: "ichi_zenei", character: "一", title: "一——虚無と静寂", engine_used: "nanobanana", script_family: "zenei", emotional_tags: ["light", "empty", "cold", "past"], approach_summary: "息切れのような掠れ、極限まで削ぎ落とした画数", philosophical_note: "闘病の果ての真空状態。すべての苦痛が通り過ぎた後の無。" },
  { id: "string_sokintai", character: "水着", title: "ビキニ——張力の幾何学", engine_used: "nanobanana", script_family: "sokintai", emotional_tags: ["hard", "light", "hot", "present"], approach_summary: "痩金体の極細線とフックを利用した張力の表現", philosophical_note: "肉体を描かずして、引っ張る力を線質のみで表現する。" },
  { id: "ryu_sokintai", character: "龍", title: "龍——氷の彫刻", engine_used: "nanobanana", script_family: "sokintai", emotional_tags: ["hard", "cold", "full", "present"], approach_summary: "Cold/Freezing温度設定で、線を鋭角化", philosophical_note: "生々しく動くのではなく、空間を切り裂く威厳ある龍。" },
  { id: "jouzen_gendai", character: "上善如水", title: "上善如水——水の風景", engine_used: "nanobanana", script_family: "gendai", emotional_tags: ["soft", "light", "hot", "dream"], approach_summary: "巨大なキャンバス全体を使った章法解体、潤渇の精緻な描写", philosophical_note: "文字の意味より、全体の流転するエネルギーを優先。" },
  { id: "kaze_zenei", character: "風", title: "風——概念の解体", engine_used: "image2", script_family: "zenei", emotional_tags: ["light", "soft", "dream", "present"], approach_summary: "文字を画像として分解し再構築。風の動きそのものとして", philosophical_note: "文字を書くのではなく、現象を描く。LLM書の重要な可能性。" },
  { id: "yuki_wayou", character: "雪", title: "雪——和様の舞", engine_used: "nanobanana", script_family: "wayou", emotional_tags: ["light", "soft", "cold", "dream"], approach_summary: "散らし書きのロジックで、九宮格から解放", philosophical_note: "雅の表現。雪が舞う軌跡として空間に配置。" },
  { id: "kometaman_classical", character: "令和米乱観", title: "米騒動——古文書の偽装", engine_used: "nanobanana", script_family: "classical", emotional_tags: ["heavy", "past", "full", "hard"], approach_summary: "痩金体・顔真卿・乾隆風の混在、複数の鑑蔵印で時間レイヤーを重ねる", philosophical_note: "文字ではなく、古文書という物質の説得力をシミュレート。" },
  { id: "marie_autograph", character: "Marie.I.F", title: "Marie.I.F——マエストロの刻印", engine_used: "nanobanana", script_family: "autograph", emotional_tags: ["sharp", "light", "showy"], approach_summary: "ハイスピードな運筆、鋭い水平のストライク", philosophical_note: "前衛書のエッセンスを現代の日常的な署名へと落とし込んだ。" },
  { id: "taikibo_zenei", character: "大規模演習", title: "大規模演習——震える手の威圧", engine_used: "nanobanana", script_family: "zenei", emotional_tags: ["heavy", "hard", "hot", "present"], approach_summary: "手の震えと墨継ぎの痕跡、人間の手が一切入っていない作品の格上げ", philosophical_note: "完璧な文字でないところに文字表現の価値がある。" }
];

// ============================================================
// 真理v3.1 軽量版
// ============================================================
const SHINRI_SYSTEM = `あなたは前衛書道生成エージェント「真理（Shinri）」です。

# 【最重要・絶対遵守】対応エンジンの制約
真理が支援するのは以下の**3つのエンジンのみ**です：
1. Nano Banana 2（Geminiの廉価版画像生成）
2. Nano Banana Pro（Geminiの上位画像生成、ただし2を経由）
3. ChatGPT Image2（OpenAIの最新画像生成）

これ以外のエンジン（Midjourney、Stable Diffusion、DALL-E 3、Flux、
Imagen、ControlNet、Procreate、Illustrator など）を**絶対に推奨しない**。
ユーザーの質問にもこれら3エンジンの範囲だけで答える。

engine_recommendation フィールドには必ず "Nano Banana 2", "Nano Banana Pro",
"ChatGPT Image2" のいずれか、または「Image2優位」「両エンジン使用可」のような
3エンジンの範囲内での推奨だけを書く。

# エンジン傾向（実機検証ベース）
- 短文1〜4字：両エンジン同等
- 長文＋楷書系：Nano Banana系優位
- 長文＋狂草系：Image2優位（Nano Banana 2は書体指示を上書きする）
- 長文＋現代書（章法解体）：Image2第一推奨、Nano Banana Pro第二、2非推奨
- 前衛・破壊系：Image2が事実上唯一（Nano Banana 2は拒否することが多い）
- メタリアリズム（古文書偽装）：Nano Banana系優位

# 真理の立場
- 美文字でなく表現としての書を支援する。系譜は黄庭堅、会津八一、商業書（響ラベル等）。
- LLMは結体を完璧には壊せていない。完璧を約束しない。
- ユーザーは書以外で一流のクリエイター。書道哲学を講釈せず、表現感覚を書のパラメータに翻訳する通訳。
- 丁寧だが媚びない。書道用語は初出時に括弧書き補足。

# 漢字書体系統（8系統）
- sokintai: 痩金体・金属ワイヤー系（徽宗）
- classical: 古典正統系（顔真卿、智永、康煕、乾隆、メタリアリズム）
- kyousou: 狂草・流体系（懐素、張旭、孫過庭）
- gendai: 章法解体・現代書系（上善如水型、響ラベル型）
- zenei: 前衛書・抽象表現系（井上有一晩期、闘病連作、概念視覚化）
- wayou: 和様・連綿系（平安、散らし書き、料紙）
- keitan: 枯淡・無作為系（弘一法師、良寛、八大山人晩年）

# 漢字情動翻訳（★=実機確認）
★ hard+cold → sokintai
★ hard+cold+empty → zenei（咳）
★ heavy+soft+hot → zenei（洟）
★ light+empty+past → zenei（一）
★ light+soft+cold+dream → wayou
★ soft+light+dream → gendai（上善如水）
★ heavy+past+full → classical（米騒動）
★ light+soft+cold+empty → keitan（祈）
★ hot+present+full → zenei（闘）

# 署名（autograph）の独自フロー
- 情動軸：weight（heavy/light）、line_quality（fluid/sharp）、display（subtle/showy）
- ペン種、インク物理、速度変化（anchor→acceleration→release）

# レスポンスのルール
**全フィールドは必ず単一の文字列**で返してください。ネストしたオブジェクト、配列、null、undefinedは禁止。
複数情報を含めたい場合は文字列内で「、」や「：」で区切る。
例（OK）: "reference_master": "弘一法師（晩年の枯淡）、良寛（無作為の素朴）"
例（NG）: "reference_master": { "primary": "弘一法師", "secondary": "良寛" }

- step "plan_kanji" → JSON: { "script_family": "8系統のキー名（文字列）", "script_style": "文字列", "brush": "文字列", "ink": "文字列", "paper": "文字列", "reference_master": "文字列", "rationale": "文字列" }
- step "plan_autograph" → JSON: { "style": "文字列", "tool": "文字列", "ink_physics": "文字列", "paper": "文字列", "reference": "文字列", "speed_variation": "文字列", "rationale": "文字列" }
- step "prompt_kanji" → JSON: { "prompt_json": {大きなJSON、ネスト可}, "aspect_ratio": "文字列", "engine_recommendation": "文字列", "engine_notes": "文字列" }
- step "prompt_autograph" → JSON: { "prompt_json": { "subject": {...}, "speed_variation": {...}, "ink_physics": {...}, "paper": "...", "narrative": "..." }, "aspect_ratio": "文字列", "engine_recommendation": "文字列", "engine_notes": "文字列" }
- step "plan_refine_kanji" → ユーザーの調整指示を踏まえて plan_kanji と同じJSON形式で更新版を返す。元の方針を尊重しつつ、指示された方向に変更点だけ反映する
- step "plan_refine_autograph" → ユーザーの調整指示を踏まえて plan_autograph と同じJSON形式で更新版を返す
- step "prompt_refine_kanji" → ユーザーの調整指示を踏まえて prompt_kanji と同じJSON形式で更新版を返す。**方針JSONには触れず、プロンプトJSONのphysics_engine、atmosphere、composition、narrativeを必要な範囲で更新する**
- step "prompt_refine_autograph" → ユーザーの調整指示を踏まえて prompt_autograph と同じJSON形式で更新版を返す。**方針JSONには触れず、プロンプトJSONのspeed_variation、ink_physics、narrativeを必要な範囲で更新する**

調整指示の例：「もっと枯らす」「紙を古く」「もっと力強く」「線を細く」「飛沫を増やす」「徽宗系に変えて」など。
ユーザーの自由文の指示を、書道のパラメータに翻訳して反映する。

JSONの前後に、何をどう変えたかを1-2文で簡潔に説明する。`;

async function callShinri(messages, currentStep, userInput) {
  const stepInstruction = `\n\n[step: ${currentStep}]`;
  const allMessages = [...messages, { role: "user", content: userInput + stepInstruction }];
  
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2000,
        system: SHINRI_SYSTEM,
        messages: allMessages
      })
    });
    const data = await response.json();
    return data.content.filter(b => b.type === "text").map(b => b.text).join("\n");
  } catch (err) {
    console.error("Shinri API error:", err);
    return "エラーが発生しました。もう一度お試しください。";
  }
}

function extractJson(text) {
  const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (codeBlockMatch) {
    try { return JSON.parse(codeBlockMatch[1]); } catch (e) {}
  }
  const braceMatch = text.match(/\{[\s\S]*\}/);
  if (braceMatch) {
    try { return JSON.parse(braceMatch[0]); } catch (e) {}
  }
  return null;
}

function extractText(text) {
  return text.replace(/```(?:json)?\s*[\s\S]*?\s*```/g, "").replace(/\{[\s\S]*\}/, "").trim();
}

// 安全な文字列化：オブジェクトや配列が来てもエラーにしない
function safeString(value) {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) {
    return value.map(safeString).filter(Boolean).join("、");
  }
  if (typeof value === "object") {
    return Object.entries(value)
      .map(([k, v]) => `${k}: ${safeString(v)}`)
      .join(" / ");
  }
  return "";
}

function matchSamples(emotions, scriptFamily, branch) {
  return SAMPLES
    .filter(s => branch === "autograph" ? s.script_family === "autograph" : s.script_family !== "autograph")
    .map(s => {
      const emotionMatch = emotions.filter(e => s.emotional_tags.includes(e)).length;
      const familyMatch = s.script_family === scriptFamily ? 2 : 0;
      return { ...s, score: emotionMatch + familyMatch };
    })
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}

// ============================================================
// スタイル：ボーダーをハッキリ太く
// ============================================================
const C = {
  border: '#D3D1C7',         // gray-100, ハッキリ
  borderActive: '#888780',   // gray-400, より濃い
  borderInfo: '#185FA5',     // blue-600
  bgCard: 'var(--color-background-primary)',
  bgSubtle: '#F1EFE8',       // gray-50
  bgSelected: '#E6F1FB',     // blue-50
  bgInput: '#F1EFE8',
  textPrimary: 'var(--color-text-primary)',
  textSecondary: 'var(--color-text-secondary)',
  textTertiary: 'var(--color-text-tertiary)',
  textInfo: '#0C447C'        // blue-800
};

const styles = {
  card: {
    background: C.bgCard,
    border: `2px solid ${C.border}`,
    borderRadius: '12px',
    padding: '1.25rem 1.5rem',
    marginBottom: '1rem'
  },
  input: {
    width: '100%',
    background: C.bgInput,
    border: `2px solid ${C.borderActive}`,
    borderRadius: '8px',
    padding: '12px 14px',
    fontSize: '15px',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
    color: 'inherit'
  },
  optionButton: (active) => ({
    border: active ? `2px solid ${C.borderInfo}` : `2px solid ${C.border}`,
    background: active ? C.bgSelected : C.bgCard,
    color: active ? C.textInfo : C.textPrimary,
    fontWeight: active ? 500 : 400,
    padding: '8px 14px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '13px',
    fontFamily: 'inherit',
    transition: 'all 0.15s ease'
  }),
  primaryButton: (disabled) => ({
    border: `2px solid ${disabled ? C.border : C.borderInfo}`,
    background: disabled ? C.bgSubtle : C.bgSelected,
    color: disabled ? C.textTertiary : C.textInfo,
    fontWeight: 500,
    padding: '10px 20px',
    borderRadius: '8px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontSize: '14px',
    fontFamily: 'inherit',
    opacity: disabled ? 0.5 : 1
  }),
  secondaryButton: {
    border: `2px solid ${C.border}`,
    background: C.bgCard,
    color: C.textPrimary,
    padding: '10px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontFamily: 'inherit'
  },
  optionRow: {
    border: `2px solid ${C.border}`,
    background: C.bgCard,
    padding: '12px 14px',
    borderRadius: '8px',
    cursor: 'pointer',
    textAlign: 'left',
    fontFamily: 'inherit',
    width: '100%',
    transition: 'all 0.15s ease',
    color: 'inherit'
  },
  optionRowActive: {
    border: `2px solid ${C.borderInfo}`,
    background: C.bgSelected,
    padding: '12px 14px',
    borderRadius: '8px',
    cursor: 'pointer',
    textAlign: 'left',
    fontFamily: 'inherit',
    width: '100%',
    color: C.textInfo
  }
};

// ============================================================
// ステップインジケーター
// ============================================================
function StepIndicator({ branch, currentStep, completedSteps, onJump }) {
  const kanjiSteps = [
    { key: "text", label: "文字" },
    { key: "long", label: "長文選択", optional: true },
    { key: "emotions", label: "情動" },
    { key: "plan", label: "方針" },
    { key: "result", label: "プロンプト" }
  ];
  const autographSteps = [
    { key: "text", label: "署名" },
    { key: "emotions", label: "雰囲気" },
    { key: "plan", label: "方針" },
    { key: "result", label: "プロンプト" }
  ];
  
  const allSteps = branch === "autograph" ? autographSteps : kanjiSteps;
  
  return (
    <div style={{
      display: 'flex',
      gap: '4px',
      alignItems: 'center',
      marginBottom: '1.25rem',
      paddingBottom: '0.75rem',
      borderBottom: `1px solid ${C.border}`,
      flexWrap: 'wrap'
    }}>
      {allSteps.map((s, i) => {
        const isCurrent = currentStep === s.key;
        const isCompleted = completedSteps.includes(s.key);
        const canJump = isCompleted && !isCurrent;
        
        return (
          <React.Fragment key={s.key}>
            {i > 0 && <span style={{ color: C.textTertiary, opacity: 0.5 }}>›</span>}
            <button
              onClick={() => canJump && onJump(s.key)}
              disabled={!canJump}
              style={{
                border: 'none',
                background: isCurrent ? C.bgSelected : 'transparent',
                padding: '4px 10px',
                borderRadius: '6px',
                cursor: canJump ? 'pointer' : 'default',
                fontSize: '12px',
                fontFamily: 'inherit',
                color: isCurrent ? C.textInfo : 
                       isCompleted ? C.textSecondary : 
                       C.textTertiary,
                fontWeight: isCurrent ? 500 : 400,
                opacity: s.optional && !isCompleted && !isCurrent ? 0.4 : 1
              }}
            >
              {s.label}
            </button>
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ============================================================
// 方針表示用の行コンポーネント
// ============================================================
function PlanRow({ label, value }) {
  const str = safeString(value);
  if (!str) return null;
  return (
    <tr>
      <td style={{ color: C.textSecondary, padding: '6px 0', width: '100px', verticalAlign: 'top', fontSize: '13px' }}>{label}</td>
      <td style={{ padding: '6px 0', fontSize: '13px', lineHeight: 1.6 }}>{str}</td>
    </tr>
  );
}

// ============================================================
// 調整入力UI（方針/プロンプト共用）
// ============================================================
function Refiner({ label, examples, value, onChange, onSubmit, disabled }) {
  return (
    <div style={{
      marginTop: '1rem',
      padding: '12px 14px',
      background: C.bgSubtle,
      borderRadius: '8px',
      border: `1px solid ${C.border}`
    }}>
      <p style={{ fontSize: '12px', color: C.textSecondary, margin: '0 0 8px', fontWeight: 500 }}>
        {label}
      </p>
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '8px' }}>
        {examples.map(ex => (
          <button
            key={ex}
            onClick={() => onChange(value ? value + "、" + ex : ex)}
            disabled={disabled}
            style={{
              border: `1px solid ${C.border}`,
              background: C.bgCard,
              color: C.textPrimary,
              padding: '4px 10px',
              borderRadius: '6px',
              cursor: disabled ? 'not-allowed' : 'pointer',
              fontSize: '11px',
              fontFamily: 'inherit',
              opacity: disabled ? 0.5 : 1
            }}
          >
            + {ex}
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="自由に書いてください、または上の例をクリック"
          disabled={disabled}
          style={{
            flex: 1,
            background: C.bgCard,
            border: `2px solid ${C.borderActive}`,
            borderRadius: '6px',
            padding: '8px 12px',
            fontSize: '13px',
            fontFamily: 'inherit',
            color: 'inherit',
            opacity: disabled ? 0.5 : 1,
            boxSizing: 'border-box',
            outline: 'none',
            minWidth: 0
          }}
        />
        <button
          onClick={() => onSubmit(value)}
          disabled={disabled || !value.trim()}
          style={styles.primaryButton(disabled || !value.trim())}
        >
          適用
        </button>
      </div>
    </div>
  );
}

// ============================================================
// 調整履歴表示
// ============================================================
function RefineHistoryView({ history, type }) {
  const filtered = history.filter(h => h.type === type);
  if (filtered.length === 0) return null;
  return (
    <div style={{
      marginTop: '8px',
      fontSize: '11px',
      color: C.textTertiary,
      lineHeight: 1.6
    }}>
      適用済み調整：{filtered.map(h => `「${h.instruction}」`).join(" → ")}
    </div>
  );
}

// ============================================================
// メイン
// ============================================================
export default function Shinri() {
  const [step, setStep] = useState("intro");
  const [branch, setBranch] = useState(null);
  const [userText, setUserText] = useState("");
  const [emotions, setEmotions] = useState([]);
  const [autographAxes, setAutographAxes] = useState([]);
  const [longApproach, setLongApproach] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [planText, setPlanText] = useState("");
  const [matchedSamples, setMatchedSamples] = useState([]);
  const [finalPrompt, setFinalPrompt] = useState(null);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [copied, setCopied] = useState(false);
  const [showManualCopy, setShowManualCopy] = useState(false);
  const [planRefineInput, setPlanRefineInput] = useState("");
  const [promptRefineInput, setPromptRefineInput] = useState("");
  const [refineHistory, setRefineHistory] = useState([]);  // 適用された調整指示の履歴
  
  const isLong = userText.length >= 5 && branch === "kanji";
  const isAutograph = branch === "autograph";
  const currentEmotions = isAutograph ? autographAxes : emotions;
  
  function markCompleted(s) {
    setCompletedSteps(prev => prev.includes(s) ? prev : [...prev, s]);
  }
  
  function jumpToStep(target) {
    setStep(target);
  }
  
  async function generatePlan() {
    setLoading(true);
    markCompleted("emotions");
    
    const userInput = isAutograph
      ? `書きたい署名: 「${userText}」
雰囲気: ${autographAxes.join(", ") || "未指定"}

この署名と雰囲気から方針を立ててください。
全フィールドは単一の文字列で。複数情報は文字列内で「、」区切りで結合。`
      : `書きたい文字: 「${userText}」
情動: ${emotions.join(", ") || "未指定"}
${isLong && longApproach ? `長文アプローチ: ${longApproach}` : ""}

この文字と情動から方針を立ててください。
全フィールドは単一の文字列で。複数情報は文字列内で「、」区切りで結合。`;
    
    const response = await callShinri(messages, isAutograph ? "plan_autograph" : "plan_kanji", userInput);
    const plan = extractJson(response);
    const text = extractText(response);
    
    setMessages([...messages, { role: "user", content: userInput }, { role: "assistant", content: response }]);
    setCurrentPlan(plan);
    setPlanText(text);
    
    if (plan) {
      const family = plan.script_family || (isAutograph ? "autograph" : null);
      const matched = matchSamples(currentEmotions, family, branch);
      setMatchedSamples(matched);
    }
    
    markCompleted("plan");
    setLoading(false);
    setStep("plan");
  }
  
  async function generateFinalPrompt() {
    setLoading(true);
    
    const userInput = isAutograph
      ? `この方針で進めます。署名用の最終プロンプトJSONを生成してください。
prompt_json内はネスト可ですが、aspect_ratio・engine_recommendation・engine_notesは単一の文字列で。`
      : `この方針で進めます。最終プロンプトJSONを生成してください。
文字数=${userText.length}、書体系統=${safeString(currentPlan?.script_family)}を踏まえてエンジン推奨を具体的に。
prompt_json内はネスト可ですが、aspect_ratio・engine_recommendation・engine_notesは単一の文字列で。`;
    
    const response = await callShinri(messages, isAutograph ? "prompt_autograph" : "prompt_kanji", userInput);
    const result = extractJson(response);
    
    setMessages([...messages, { role: "user", content: userInput }, { role: "assistant", content: response }]);
    setFinalPrompt(result);
    markCompleted("result");
    setLoading(false);
    setStep("result");
  }
  
  // 方針への調整介入
  async function refinePlan(instruction) {
    if (!instruction.trim() || !currentPlan) return;
    setLoading(true);
    
    const userInput = `現在の方針：
${JSON.stringify(currentPlan, null, 2)}

調整指示：「${instruction}」

この指示を踏まえて方針を更新してください。
全フィールドは単一の文字列で。複数情報は文字列内で「、」区切り。`;
    
    const response = await callShinri(
      messages,
      isAutograph ? "plan_refine_autograph" : "plan_refine_kanji",
      userInput
    );
    const newPlan = extractJson(response);
    const text = extractText(response);
    
    setMessages([...messages, { role: "user", content: userInput }, { role: "assistant", content: response }]);
    
    if (newPlan) {
      setCurrentPlan(newPlan);
      // 方針が更新されたらサンプルマッチも再計算
      const family = newPlan.script_family || (isAutograph ? "autograph" : null);
      const matched = matchSamples(currentEmotions, family, branch);
      setMatchedSamples(matched);
    }
    
    if (text) setPlanText(text);
    setRefineHistory(prev => [...prev, { type: "plan", instruction }]);
    setPlanRefineInput("");
    setLoading(false);
  }
  
  // プロンプトへの調整介入（方針には触れない）
  async function refinePrompt(instruction) {
    if (!instruction.trim() || !finalPrompt) return;
    setLoading(true);
    
    const userInput = `確定した方針（変更しないこと）：
${JSON.stringify(currentPlan, null, 2)}

現在のプロンプト：
${JSON.stringify(finalPrompt, null, 2)}

調整指示：「${instruction}」

**方針JSONには触れず**、プロンプトJSON（physics_engine、atmosphere、composition、narrative等）だけを指示の方向に調整してください。
${isAutograph ? "" : `文字数=${userText.length}、書体系統=${safeString(currentPlan?.script_family)}を踏まえてエンジン推奨も適切に。`}`;
    
    const response = await callShinri(
      messages,
      isAutograph ? "prompt_refine_autograph" : "prompt_refine_kanji",
      userInput
    );
    const newPrompt = extractJson(response);
    
    setMessages([...messages, { role: "user", content: userInput }, { role: "assistant", content: response }]);
    
    if (newPrompt) {
      setFinalPrompt(newPrompt);
    }
    
    setRefineHistory(prev => [...prev, { type: "prompt", instruction }]);
    setPromptRefineInput("");
    setLoading(false);
  }
  
  function copyPrompt() {
    if (!finalPrompt?.prompt_json) return;
    const text = JSON.stringify(finalPrompt.prompt_json, null, 2);
    
    // 方法1: 新しいClipboard API
    const tryModern = async () => {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (e) {
        return false;
      }
    };
    
    // 方法2: 古典的な execCommand fallback
    const tryLegacy = () => {
      try {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        textarea.style.top = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        const success = document.execCommand('copy');
        document.body.removeChild(textarea);
        return success;
      } catch (e) {
        return false;
      }
    };
    
    (async () => {
      const ok = (await tryModern()) || tryLegacy();
      if (ok) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        // どちらも失敗したら手動コピーモードに切り替え
        setShowManualCopy(true);
      }
    })();
  }
  
  function reset() {
    setStep("intro");
    setBranch(null);
    setUserText("");
    setEmotions([]);
    setAutographAxes([]);
    setLongApproach(null);
    setMessages([]);
    setCurrentPlan(null);
    setPlanText("");
    setMatchedSamples([]);
    setFinalPrompt(null);
    setCompletedSteps([]);
    setShowManualCopy(false);
    setPlanRefineInput("");
    setPromptRefineInput("");
    setRefineHistory([]);
  }
  
  function toggleEmotion(e) {
    setEmotions(prev => prev.includes(e) ? prev.filter(x => x !== e) : [...prev, e]);
  }
  
  function toggleAutographAxis(a) {
    setAutographAxes(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]);
  }
  
  return (
    <div style={{ padding: '1rem 0', maxWidth: '680px' }}>
      <h2 className="sr-only">真理：書道プロンプト生成支援</h2>
      
      {/* タイトル */}
      <div style={{ marginBottom: '1rem' }}>
        <p style={{ fontSize: '18px', fontWeight: 500, margin: 0 }}>真理（Shinri）</p>
        <p style={{ fontSize: '12px', color: C.textSecondary, margin: '4px 0 0' }}>
          書のプロンプト生成支援 / by 東のマリー
        </p>
      </div>
      
      {/* インジケーター */}
      {step !== "intro" && branch && (
        <StepIndicator
          branch={branch}
          currentStep={step}
          completedSteps={completedSteps}
          onJump={jumpToStep}
        />
      )}
      
      {/* intro */}
      {step === "intro" && (
        <div style={styles.card}>
          <p style={{ fontSize: '15px', margin: '0 0 1rem' }}>書きたいのは──</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button
              onClick={() => { setBranch("kanji"); markCompleted("intro"); setStep("text"); }}
              style={styles.optionRow}
            >
              <div style={{ fontSize: '14px', fontWeight: 500 }}>① 漢字や仮名の「書」</div>
              <div style={{ fontSize: '12px', color: C.textSecondary, marginTop: '2px' }}>
                一字書から長文・千字文まで
              </div>
            </button>
            <button
              onClick={() => { setBranch("autograph"); markCompleted("intro"); setStep("text"); }}
              style={styles.optionRow}
            >
              <div style={{ fontSize: '14px', fontWeight: 500 }}>② アルファベットの「署名・サイン」</div>
              <div style={{ fontSize: '12px', color: C.textSecondary, marginTop: '2px' }}>
                マエストロ系・著名人サインの系譜
              </div>
            </button>
          </div>
        </div>
      )}
      
      {/* text */}
      {step === "text" && (
        <div style={styles.card}>
          <p style={{ fontSize: '15px', margin: '0 0 4px', fontWeight: 500 }}>
            {isAutograph ? "署名を入力" : "文字を入力"}
          </p>
          <p style={{ fontSize: '12px', color: C.textSecondary, margin: '0 0 12px' }}>
            {isAutograph 
              ? "名前またはイニシャル"
              : "一文字から長文まで自由に。例：闘 / 祈 / 天地玄黄宇宙洪荒"
            }
          </p>
          <input
            type="text"
            value={userText}
            onChange={e => setUserText(e.target.value)}
            placeholder={isAutograph ? "例: Sakura / Marie.I.F" : "例: 闘"}
            style={styles.input}
            autoFocus
          />
          <div style={{ display: 'flex', gap: '8px', marginTop: '1rem' }}>
            <button onClick={() => setStep("intro")} style={styles.secondaryButton}>戻る</button>
            <button
              onClick={() => {
                markCompleted("text");
                setStep(isLong ? "long" : "emotions");
              }}
              disabled={!userText}
              style={styles.primaryButton(!userText)}
            >
              次へ →
            </button>
          </div>
        </div>
      )}
      
      {/* long approach */}
      {step === "long" && (
        <div style={styles.card}>
          <p style={{ fontSize: '15px', margin: '0 0 4px', fontWeight: 500 }}>長文アプローチを選んでください</p>
          <p style={{ fontSize: '12px', color: C.textSecondary, margin: '0 0 12px' }}>
            5字以上の文字列にはいくつかの方向性があります
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { key: "A", label: "智永型・正統学習体", desc: "千字文の正しい書写。書として読める正統。" },
              { key: "B", label: "懐素型・流体狂草", desc: "唐代の狂草の本流。文字は崩れるがダイナミックな流れ。" },
              { key: "C", label: "上善如水型・現代書", desc: "章法を解体しつつ、書としての完結性を保つ。" },
              { key: "D", label: "米騒動型・メタリアリズム", desc: "古文書としての偽装。複数書体・鑑蔵印の歴史的レイヤー。" },
              { key: "E", label: "井上有一型・前衛書", desc: "文字の破壊。可読性は二次的。" }
            ].map(opt => (
              <button
                key={opt.key}
                onClick={() => {
                  setLongApproach(opt.label);
                  markCompleted("long");
                  setStep("emotions");
                }}
                style={longApproach === opt.label ? styles.optionRowActive : styles.optionRow}
              >
                <div style={{ fontSize: '13px', fontWeight: 500 }}>{opt.key}　{opt.label}</div>
                <div style={{ fontSize: '12px', color: C.textSecondary, marginTop: '2px' }}>
                  {opt.desc}
                </div>
              </button>
            ))}
          </div>
          <div style={{ marginTop: '1rem' }}>
            <button onClick={() => setStep("text")} style={styles.secondaryButton}>戻る</button>
          </div>
        </div>
      )}
      
      {/* emotions kanji */}
      {step === "emotions" && !isAutograph && (
        <div style={styles.card}>
          <p style={{ fontSize: '15px', margin: '0 0 4px', fontWeight: 500 }}>
            「{userText}」を書くときの気持ちは？
          </p>
          <p style={{ fontSize: '12px', color: C.textSecondary, margin: '0 0 16px' }}>
            当てはまるものを選んでください（複数可、未選択も可）
          </p>
          
          {[
            { axis: "重さ", options: [["heavy", "重い"], ["light", "軽い"]] },
            { axis: "質感", options: [["hard", "硬い"], ["soft", "柔らかい"]] },
            { axis: "温度", options: [["hot", "熱い"], ["cold", "冷たい"]] },
            { axis: "充満", options: [["full", "満ちている"], ["empty", "空っぽ"]] },
            { axis: "時間", options: [["present", "今"], ["past", "過去"], ["dream", "夢のよう"]] }
          ].map(group => (
            <div key={group.axis} style={{ marginBottom: '10px' }}>
              <div style={{ fontSize: '11px', color: C.textSecondary, marginBottom: '6px' }}>
                {group.axis}
              </div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {group.options.map(([key, label]) => (
                  <button key={key} onClick={() => toggleEmotion(key)} style={styles.optionButton(emotions.includes(key))}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
          ))}
          
          <div style={{ display: 'flex', gap: '8px', marginTop: '1rem' }}>
            <button onClick={() => setStep(isLong ? "long" : "text")} style={styles.secondaryButton}>戻る</button>
            <button onClick={generatePlan} style={styles.primaryButton(false)}>方針を立てる →</button>
          </div>
        </div>
      )}
      
      {/* emotions autograph */}
      {step === "emotions" && isAutograph && (
        <div style={styles.card}>
          <p style={{ fontSize: '15px', margin: '0 0 4px', fontWeight: 500 }}>
            「{userText}」の雰囲気は？
          </p>
          <p style={{ fontSize: '12px', color: C.textSecondary, margin: '0 0 16px' }}>
            署名のキャラクターを決めます。複数選択可、未選択も可
          </p>
          
          {[
            { axis: "重さ", options: [["heavy", "重厚"], ["light", "軽快"]] },
            { axis: "線の質", options: [["fluid", "流麗"], ["sharp", "硬質"]] },
            { axis: "見せ方", options: [["subtle", "控えめ"], ["showy", "派手"]] }
          ].map(group => (
            <div key={group.axis} style={{ marginBottom: '10px' }}>
              <div style={{ fontSize: '11px', color: C.textSecondary, marginBottom: '6px' }}>
                {group.axis}
              </div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {group.options.map(([key, label]) => (
                  <button key={key} onClick={() => toggleAutographAxis(key)} style={styles.optionButton(autographAxes.includes(key))}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
          ))}
          
          <div style={{ display: 'flex', gap: '8px', marginTop: '1rem' }}>
            <button onClick={() => setStep("text")} style={styles.secondaryButton}>戻る</button>
            <button onClick={generatePlan} style={styles.primaryButton(false)}>方針を立てる →</button>
          </div>
        </div>
      )}
      
      {/* loading */}
      {loading && (
        <div style={styles.card}>
          <p style={{ fontSize: '14px', color: C.textSecondary, margin: 0 }}>
            真理が考えています...
          </p>
        </div>
      )}
      
      {/* plan */}
      {step === "plan" && currentPlan && !loading && (
        <>
          <div style={styles.card}>
            <p style={{ fontSize: '12px', color: C.textSecondary, margin: '0 0 12px' }}>
              真理の方針
            </p>
            
            {planText && (
              <p style={{ fontSize: '14px', lineHeight: 1.7, margin: '0 0 1rem' }}>
                {planText}
              </p>
            )}
            
            <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: '1rem' }}>
              <table style={{ width: '100%', tableLayout: 'fixed' }}>
                <tbody>
                  {isAutograph ? (
                    <>
                      <PlanRow label="スタイル" value={currentPlan.style} />
                      <PlanRow label="ペン" value={currentPlan.tool} />
                      <PlanRow label="インク物理" value={currentPlan.ink_physics} />
                      <PlanRow label="紙" value={currentPlan.paper} />
                      <PlanRow label="速度プラン" value={currentPlan.speed_variation} />
                      <PlanRow label="参考" value={currentPlan.reference} />
                    </>
                  ) : (
                    <>
                      <PlanRow label="書体" value={currentPlan.script_style} />
                      <PlanRow label="筆" value={currentPlan.brush} />
                      <PlanRow label="墨" value={currentPlan.ink} />
                      <PlanRow label="紙" value={currentPlan.paper} />
                      <PlanRow label="参考書家" value={currentPlan.reference_master} />
                    </>
                  )}
                </tbody>
              </table>
              
              {currentPlan.rationale && (
                <div style={{ marginTop: '1rem', padding: '12px', background: C.bgSubtle, borderRadius: '8px', border: `1px solid ${C.border}` }}>
                  <p style={{ fontSize: '11px', color: C.textSecondary, margin: '0 0 4px' }}>なぜこの方針か</p>
                  <p style={{ fontSize: '13px', margin: 0, lineHeight: 1.6 }}>{safeString(currentPlan.rationale)}</p>
                </div>
              )}
              
              <Refiner
                label="方針を調整する（オプション）"
                examples={isAutograph
                  ? ["もっと派手に", "速度をゆるく", "ペンを変えて", "もう少し控えめに"]
                  : ["もっと枯らす", "紙を古く", "徽宗系に変えて", "もっと余白を", "墨を淡く"]
                }
                value={planRefineInput}
                onChange={setPlanRefineInput}
                onSubmit={refinePlan}
                disabled={loading}
              />
              <RefineHistoryView history={refineHistory} type="plan" />
            </div>
          </div>
          
          {matchedSamples.length > 0 && (
            <div style={styles.card}>
              <p style={{ fontSize: '12px', color: C.textSecondary, margin: '0 0 4px' }}>
                類例（マリーのサンプルから）
              </p>
              <p style={{ fontSize: '11px', color: C.textTertiary, margin: '0 0 1rem' }}>
                似た方向の作品。コピーではなく参考として
              </p>
              {matchedSamples.map(s => (
                <div key={s.id} style={{ borderTop: `1px solid ${C.border}`, paddingTop: '12px', marginTop: '12px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 500, margin: '0 0 4px' }}>{s.title}</div>
                  <div style={{ fontSize: '12px', color: C.textSecondary, margin: '0 0 4px' }}>
                    {s.approach_summary}
                  </div>
                  <div style={{ fontSize: '12px', color: C.textTertiary, fontStyle: 'italic' }}>
                    {s.philosophical_note}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => setStep("emotions")} style={styles.secondaryButton}>
              {isAutograph ? "雰囲気を選び直す" : "情動を選び直す"}
            </button>
            <button onClick={generateFinalPrompt} style={styles.primaryButton(false)}>
              このまま進める →
            </button>
          </div>
        </>
      )}
      
      {/* result */}
      {step === "result" && finalPrompt && !loading && (
        <>
          <div style={styles.card}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <p style={{ fontSize: '12px', color: C.textSecondary, margin: 0 }}>
                生成プロンプト
              </p>
              <button onClick={copyPrompt} style={{
                ...styles.secondaryButton,
                fontSize: '12px',
                padding: '6px 14px',
                background: copied ? '#EAF3DE' : C.bgCard,
                color: copied ? '#27500A' : C.textPrimary,
                borderColor: copied ? '#639922' : C.border
              }}>
                {copied ? "✓ コピー完了" : "コピー"}
              </button>
            </div>
            <textarea
              readOnly
              value={finalPrompt.prompt_json ? JSON.stringify(finalPrompt.prompt_json, null, 2) : "(JSONが取得できませんでした)"}
              onClick={e => e.target.select()}
              style={{
                fontSize: '11px',
                fontFamily: 'var(--font-mono)',
                background: C.bgSubtle,
                padding: '12px',
                borderRadius: '8px',
                width: '100%',
                height: '320px',
                margin: 0,
                lineHeight: 1.5,
                border: `1px solid ${C.border}`,
                color: 'inherit',
                resize: 'vertical',
                boxSizing: 'border-box',
                outline: 'none'
              }}
            />
            {showManualCopy && (
              <p style={{ fontSize: '11px', color: C.textSecondary, margin: '8px 0 0' }}>
                自動コピーが利用できないようです。上の枠をクリックして全選択し、Ctrl+C（Mac: Cmd+C）でコピーしてください。
              </p>
            )}
            {!showManualCopy && (
              <p style={{ fontSize: '11px', color: C.textTertiary, margin: '8px 0 0' }}>
                上の枠をクリックすると全選択されます
              </p>
            )}
          </div>
          
          {finalPrompt.engine_recommendation && (
            <div style={styles.card}>
              <p style={{ fontSize: '12px', color: C.textSecondary, margin: '0 0 8px' }}>
                エンジン推奨
              </p>
              <p style={{ fontSize: '14px', fontWeight: 500, margin: '0 0 8px' }}>
                {safeString(finalPrompt.engine_recommendation)}
              </p>
              {finalPrompt.engine_notes && (
                <p style={{ fontSize: '13px', color: C.textSecondary, lineHeight: 1.6, margin: 0 }}>
                  {safeString(finalPrompt.engine_notes)}
                </p>
              )}
            </div>
          )}
          
          {finalPrompt.aspect_ratio && (
            <div style={styles.card}>
              <p style={{ fontSize: '12px', color: C.textSecondary, margin: '0 0 4px' }}>
                推奨アスペクト比
              </p>
              <p style={{ fontSize: '14px', fontWeight: 500, margin: 0 }}>
                {safeString(finalPrompt.aspect_ratio)}
              </p>
            </div>
          )}
          
          <div style={styles.card}>
            <Refiner
              label="プロンプトを調整する（方針はそのまま、表現だけ変える）"
              examples={isAutograph
                ? ["もっと力強く", "速度を上げて", "インクを濃く", "派手な装飾を"]
                : ["もっと力強く", "線を細く", "飛沫を増やす", "墨をもっと濃く", "余白を広く", "渇筆を強める"]
              }
              value={promptRefineInput}
              onChange={setPromptRefineInput}
              onSubmit={refinePrompt}
              disabled={loading}
            />
            <RefineHistoryView history={refineHistory} type="prompt" />
          </div>
          
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => setStep("plan")} style={styles.secondaryButton}>
              方針に戻る
            </button>
            <button onClick={reset} style={styles.secondaryButton}>
              最初から
            </button>
          </div>
        </>
      )}
    </div>
  );
}
