import { useMemo, useState } from 'react'
import type { Language, NotationMode } from '../i18n'

type Props = {
  notation: NotationMode
  language: Language
  onBack: () => void
}

type ViewMode = 'material' | 'spatial'

const text = {
  ru: {
    back: '← K00',
    title: 'Материальные и пространственные координаты',
    lead: 'Одно и то же движение можно описывать двумя способами. В материальном описании мы следим за выбранной частицей. В пространственном — фиксируем место в текущем пространстве и спрашиваем, какая частица там находится.',
    key: 'КЛЮЧЕВАЯ МЫСЛЬ',
    keyText: 'X — метка материальной точки в исходной конфигурации; x — её текущее положение. Это разные координаты одного и того же физического объекта.',
    material: 'Материальное описание',
    materialText: 'Фиксируем X и вычисляем x = χ(X,t). Это взгляд вслед за частицей.',
    spatial: 'Пространственное описание',
    spatialText: 'Фиксируем x и определяем X = χ⁻¹(x,t). Это взгляд из выбранной точки пространства.',
    modeMaterial: 'следить за X',
    modeSpatial: 'фиксировать x',
    time: 'время t',
    selectedX: 'выбранная X',
    selectedx: 'выбранная x',
    recoveredX: 'восстановленная X',
    currentx: 'текущая x',
    sceneKicker: 'ДВА ОПИСАНИЯ',
    sceneTitle: 'переключай точку зрения на одно и то же движение',
    question: 'ВОПРОС ДЛЯ ПРОВЕРКИ',
    questionTitle: 'Почему нельзя просто заменить X на x в формулах?',
    questionText: 'Потому что они относятся к разным конфигурациям и отвечают на разные вопросы.',
    conclusion: 'ВЫВОД',
    conclusionTitle: 'Материальное и пространственное описания дополняют друг друга.',
    conclusionText: 'Дальше производные по X приведут нас к градиенту деформации F, а производные по x — к пространственным мерам.',
    interactive: 'ИНТЕРАКТИВНО',
    notationLabel: 'Форма записи',
  },
  en: {
    back: '← K00',
    title: 'Material and spatial coordinates',
    lead: 'The same motion can be described in two ways. In a material description we follow a chosen particle. In a spatial description we fix a location in the current configuration and ask which particle occupies it.',
    key: 'KEY IDEA',
    keyText: 'X labels a material point in the reference configuration; x is its current position. They are different coordinates of the same physical object.',
    material: 'Material description',
    materialText: 'Fix X and compute x = χ(X,t). This follows the particle.',
    spatial: 'Spatial description',
    spatialText: 'Fix x and determine X = χ⁻¹(x,t). This observes from a fixed current location.',
    modeMaterial: 'follow X',
    modeSpatial: 'fix x',
    time: 'time t',
    selectedX: 'selected X',
    selectedx: 'selected x',
    recoveredX: 'recovered X',
    currentx: 'current x',
    sceneKicker: 'TWO DESCRIPTIONS',
    sceneTitle: 'switch viewpoints on the same motion',
    question: 'CHECKPOINT',
    questionTitle: 'Why can X not simply be replaced by x in formulas?',
    questionText: 'Because they belong to different configurations and answer different questions.',
    conclusion: 'CONCLUSION',
    conclusionTitle: 'Material and spatial descriptions complement each other.',
    conclusionText: 'Later, derivatives with respect to X lead to the deformation gradient F, while derivatives with respect to x lead to spatial measures.',
    interactive: 'INTERACTIVE',
    notationLabel: 'Notation',
  },
} as const

function fmt(v: number) {
  return v.toFixed(2)
}

export function MaterialSpatialCoordinates({ notation, language, onBack }: Props) {
  const copy = text[language]
  const [mode, setMode] = useState<ViewMode>('material')
  const [time, setTime] = useState(0.7)
  const [X1, setX1] = useState(0.35)
  const [X2, setX2] = useState(-0.20)
  const [x1Target, setx1Target] = useState(0.55)
  const [x2Target, setx2Target] = useState(0.05)

  const A = useMemo(() => {
    const a = 1 + 0.25 * time
    const g = 0.35 * time
    return [[a, g], [0, 1 - 0.10 * time]]
  }, [time])

  const b = useMemo<[number, number]>(() => [0.20 * time, 0.08 * time], [time])

  const forward = (X: [number, number]) => [
    A[0][0] * X[0] + A[0][1] * X[1] + b[0],
    A[1][0] * X[0] + A[1][1] * X[1] + b[1],
  ] as [number, number]

  const inverse = (x: [number, number]) => {
    const y0 = x[0] - b[0]
    const y1 = x[1] - b[1]
    const det = A[0][0] * A[1][1] - A[0][1] * A[1][0]
    return [
      ( A[1][1] * y0 - A[0][1] * y1) / det,
      (-A[1][0] * y0 + A[0][0] * y1) / det,
    ] as [number, number]
  }

  const selectedX: [number, number] = [X1, X2]
  const currentx = forward(selectedX)
  const selectedx: [number, number] = [x1Target, x2Target]
  const recoveredX = inverse(selectedx)

  const notationLine =
    notation === 'Index' ? 'xᵢ = χᵢ(Xⱼ,t),   Xᵢ = χ⁻¹ᵢ(xⱼ,t)' :
    notation === 'Matrix' ? 'x = χ(X,t),   X = χ⁻¹(x,t)' :
    notation === 'Python' ? 'x = chi(X,t); X = chi_inv(x,t)' :
    '𝐱 = χ(𝐗,t),   𝐗 = χ⁻¹(𝐱,t)'

  const refMap = (p:[number,number]) => [28 + p[0]*25, 38 - p[1]*25]
  const curMap = (p:[number,number]) => [72 + p[0]*21, 38 - p[1]*21]

  const activeRef = mode === 'material' ? selectedX : recoveredX
  const activeCur = mode === 'material' ? currentx : selectedx
  const pRef = refMap(activeRef)
  const pCur = curMap(activeCur)

  return (
    <section className="module-view">
      <div className="lesson-copy">
        <button className="text-button" onClick={onBack}>{copy.back}</button>
        <div className="lesson-index">K01 / 13</div>
        <h1>{copy.title}</h1>
        <p className="lead">{copy.lead}</p>

        <div className="concept-card">
          <span>{copy.key}</span>
          <strong>{copy.keyText}</strong>
        </div>

        <div className="definition">
          <div className="definition-label">{copy.material}</div>
          <div className="formula">𝐱 = χ(𝐗,t)</div>
          <p>{copy.materialText}</p>
        </div>

        <div className="definition">
          <div className="definition-label">{copy.spatial}</div>
          <div className="formula">𝐗 = χ⁻¹(𝐱,t)</div>
          <p>{copy.spatialText}</p>
        </div>

        <div className="definition">
          <div className="definition-label">{copy.notationLabel}</div>
          <div className="formula">{notationLine}</div>
        </div>
      </div>

      <div className="scene-column">
        <div className="scene-card">
          <div className="scene-head">
            <div>
              <span className="scene-kicker">{copy.sceneKicker}</span>
              <h2>{copy.sceneTitle}</h2>
            </div>
            <div className="live-badge">{copy.interactive}</div>
          </div>

          <div className="decomp-toggle-row">
            <button className={mode === 'material' ? 'decomp-toggle active' : 'decomp-toggle'} onClick={() => setMode('material')}>{copy.modeMaterial}</button>
            <button className={mode === 'spatial' ? 'decomp-toggle active' : 'decomp-toggle'} onClick={() => setMode('spatial')}>{copy.modeSpatial}</button>
          </div>

          <svg className="kinematics-scene" viewBox="0 0 100 72" role="img">
            <rect x="5" y="6" width="90" height="60" rx="9" fill="#111318" />
            <text x="12" y="13" fill="#8E96A3" fontSize="3.1">X</text>
            <text x="61" y="13" fill="#8E96A3" fontSize="3.1">x</text>

            <rect x="14" y="21" width="28" height="28" rx="3" fill="rgba(244,242,236,0.04)" stroke="#525A66" strokeWidth="0.7"/>
            <polygon points="61,22 86,25 82,50 58,47" fill="rgba(40,100,255,0.09)" stroke="#2864FF" strokeWidth="0.8"/>

            <circle cx={pRef[0]} cy={pRef[1]} r="2" fill={mode === 'material' ? '#A9E3D2' : '#F4F2EC'} />
            <circle cx={pCur[0]} cy={pCur[1]} r="2" fill={mode === 'spatial' ? '#DD7A2B' : '#2864FF'} />

            <path d={`M ${pRef[0]+3} ${pRef[1]} C 45 20, 55 20, ${pCur[0]-3} ${pCur[1]}`} fill="none" stroke="#A9E3D2" strokeWidth="1" strokeDasharray="2 1.5"/>

            <text x={pRef[0]+2.5} y={pRef[1]-2} fill="#F4F2EC" fontSize="3.2">X</text>
            <text x={pCur[0]+2.5} y={pCur[1]-2} fill="#F4F2EC" fontSize="3.2">x</text>
          </svg>

          <div className="control-stack">
            <label>
              <span>{copy.time} <strong>{fmt(time)}</strong></span>
              <input type="range" min="0" max="1" step="0.01" value={time} onChange={e=>setTime(Number(e.target.value))}/>
            </label>

            {mode === 'material' ? (
              <>
                <label><span>X₁ <strong>{fmt(X1)}</strong></span><input type="range" min="-0.5" max="0.5" step="0.01" value={X1} onChange={e=>setX1(Number(e.target.value))}/></label>
                <label><span>X₂ <strong>{fmt(X2)}</strong></span><input type="range" min="-0.5" max="0.5" step="0.01" value={X2} onChange={e=>setX2(Number(e.target.value))}/></label>
              </>
            ) : (
              <>
                <label><span>x₁ <strong>{fmt(x1Target)}</strong></span><input type="range" min="-0.2" max="0.9" step="0.01" value={x1Target} onChange={e=>setx1Target(Number(e.target.value))}/></label>
                <label><span>x₂ <strong>{fmt(x2Target)}</strong></span><input type="range" min="-0.5" max="0.6" step="0.01" value={x2Target} onChange={e=>setx2Target(Number(e.target.value))}/></label>
              </>
            )}
          </div>

          <div className="metrics">
            <div><span>{mode === 'material' ? copy.selectedX : copy.recoveredX}</span><strong>[{activeRef.map(fmt).join(', ')}]</strong></div>
            <div><span>{mode === 'material' ? copy.currentx : copy.selectedx}</span><strong>[{activeCur.map(fmt).join(', ')}]</strong></div>
            <div><span>det A</span><strong>{fmt(A[0][0]*A[1][1]-A[0][1]*A[1][0])}</strong></div>
          </div>
        </div>

        <div className="bottom-grid">
          <div className="prediction-card">
            <span>{copy.question}</span>
            <strong>{copy.questionTitle}</strong>
            <p>{copy.questionText}</p>
          </div>
          <div className="author-card">
            <span>{copy.conclusion}</span>
            <strong>{copy.conclusionTitle}</strong>
            <p>{copy.conclusionText}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
