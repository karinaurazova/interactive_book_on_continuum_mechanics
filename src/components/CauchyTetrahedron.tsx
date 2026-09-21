import { useMemo, useState } from 'react'
import type { Language, NotationMode } from '../i18n'

type Props = {
  notation: NotationMode
  language: Language
  onBack: () => void
}

const text = {
  ru: {
    back: '← M03',
    title: 'Тетраэдр Коши',
    lead: 'Рассмотрим очень малый тетраэдральный элемент. Три его грани совпадают с координатными площадками, а четвёртая имеет произвольную нормаль n. Этот мысленный элемент позволяет связать ориентацию площадки с действующим на неё вектором напряжения.',
    key: 'КЛЮЧЕВАЯ МЫСЛЬ',
    keyText: 'При h → 0 поверхностные силы имеют порядок h², а объёмные силы и инерционные члены — порядок h³.',
    scaling: 'Масштабный аргумент',
    scalingText: 'Площади граней пропорциональны h², тогда как объём тетраэдра пропорционален h³. После деления баланса на h² и перехода к пределу вклад объёмных членов исчезает относительно поверхностных.',
    geometry: 'Геометрия площадей',
    geometryText: 'Проекции наклонной грани на координатные плоскости пропорциональны n₁A, n₂A и n₃A. Поэтому компоненты нормали становятся коэффициентами в локальном балансе.',
    formulaLabel: 'Формула Коши',
    formulaText: 'В результате вектор напряжения на произвольной площадке линейно зависит от её нормали.',
    sceneKicker: 'ТЕТРАЭДР КОШИ',
    sceneTitle: 'поверхностные и объёмные вклады при уменьшении h',
    size: 'характерный размер h',
    angle: 'ориентация нормали',
    question: 'ВОПРОС ДЛЯ ПРОВЕРКИ',
    questionTitle: 'Почему в локальном выводе исчезают объёмные силы, но сохраняются поверхностные?',
    questionText: 'Уменьшай h и сравнивай h² и h³. Обрати внимание на отношение h³/h².',
    conclusion: 'ИТОГ',
    conclusionTitle: 'Бесконечное семейство t(n) можно представить одним тензором.',
    conclusionText: 'Именно так появляется тензор напряжений Коши σ, для которого t(n)=σn.',
    metrics: {
      surface: 'поверхность ~ h²',
      volume: 'объём ~ h³',
      ratio: 'отношение h³/h²',
    },
    labels: {
      inclined: 'наклонная грань',
      coord: 'координатные грани',
      body: 'объёмный вклад',
      surface: 'поверхностный вклад',
    },
    interactive: 'ИНТЕРАКТИВНО',
    aria: 'Тетраэдр Коши с визуализацией поверхностных и объёмных вкладов',
  },
  en: {
    back: '← M03',
    title: 'Cauchy tetrahedron',
    lead: 'Consider a very small tetrahedral element. Three of its faces coincide with coordinate planes, while the fourth has an arbitrary normal n. This thought element connects plane orientation with the traction acting on it.',
    key: 'KEY IDEA',
    keyText: 'As h → 0, surface forces scale like h², whereas body-force and inertial terms scale like h³.',
    scaling: 'Scaling argument',
    scalingText: 'Face areas are proportional to h², while tetrahedron volume is proportional to h³. After dividing the balance by h² and taking the limit, volume terms vanish relative to surface terms.',
    geometry: 'Area geometry',
    geometryText: 'Projections of the inclined face onto coordinate planes are proportional to n₁A, n₂A, and n₃A. The normal components therefore become coefficients in the local balance.',
    formulaLabel: 'Cauchy formula',
    formulaText: 'The traction on an arbitrary plane is therefore a linear function of its normal.',
    sceneKicker: 'CAUCHY TETRAHEDRON',
    sceneTitle: 'surface and volume contributions as h decreases',
    size: 'characteristic size h',
    angle: 'normal orientation',
    question: 'CHECKPOINT',
    questionTitle: 'Why do body forces disappear from the local derivation while surface forces remain?',
    questionText: 'Reduce h and compare h² with h³. Watch the ratio h³/h².',
    conclusion: 'CONCLUSION',
    conclusionTitle: 'The infinite family t(n) can be represented by one tensor.',
    conclusionText: 'This gives the Cauchy stress tensor σ satisfying t(n)=σn.',
    metrics: {
      surface: 'surface ~ h²',
      volume: 'volume ~ h³',
      ratio: 'ratio h³/h²',
    },
    labels: {
      inclined: 'inclined face',
      coord: 'coordinate faces',
      body: 'body-force term',
      surface: 'surface term',
    },
    interactive: 'INTERACTIVE',
    aria: 'Cauchy tetrahedron showing surface and volume contributions',
  },
} as const

function fmt(v: number) {
  return (Math.abs(v) < 1e-10 ? 0 : v).toFixed(2)
}

export function CauchyTetrahedron({ notation, language, onBack }: Props) {
  const copy = text[language]
  const [h, setH] = useState(0.58)
  const [theta, setTheta] = useState(35)

  const rad = (theta * Math.PI) / 180
  const n = useMemo<[number, number, number]>(() => {
    const a = Math.max(0.15, Math.cos(rad))
    const b = Math.max(0.12, Math.sin(rad) * 0.6)
    const c = Math.sqrt(Math.max(0.05, 1 - a * a - b * b))
    const norm = Math.sqrt(a * a + b * b + c * c)
    return [a / norm, b / norm, c / norm]
  }, [rad])

  const area = h * h
  const volume = h * h * h
  const ratio = volume / area
  const projected = [n[0] * area, n[1] * area, n[2] * area]

  const formulaLine =
    notation === 'Index' ? 'tᵢ = σᵢⱼnⱼ' :
    notation === 'Matrix' ? '[t₁ t₂ t₃]ᵀ = [σ][n₁ n₂ n₃]ᵀ' :
    notation === 'Python' ? 't = sigma @ n' :
    '𝐭(𝐧) = σ𝐧'

  const cx = 55
  const cy = 39
  const s = 17 + 16 * h

  const p0 = { x: cx - s * 0.95, y: cy + s * 0.62 }
  const p1 = { x: cx + s * 0.05, y: cy + s * 0.72 }
  const p2 = { x: cx - s * 0.38, y: cy - s * 0.82 }
  const p3 = { x: cx + s * 0.72, y: cy - s * 0.18 }

  const surfLen = 6 + 12 * h
  const bodyLen = 3 + 6 * h * h

  return (
    <section className="module-view">
      <div className="lesson-copy">
        <button className="text-button" onClick={onBack}>{copy.back}</button>
        <div className="lesson-index">M04 / 05</div>
        <h1>{copy.title}</h1>
        <p className="lead">{copy.lead}</p>

        <div className="concept-card">
          <span>{copy.key}</span>
          <strong>{copy.keyText}</strong>
        </div>

        <div className="definition">
          <div className="definition-label">{copy.scaling}</div>
          <p>{copy.scalingText}</p>
        </div>

        <div className="definition">
          <div className="definition-label">{copy.geometry}</div>
          <p>{copy.geometryText}</p>
        </div>

        <div className="definition">
          <div className="definition-label">{copy.formulaLabel}</div>
          <div className="formula">{formulaLine}</div>
          <p>{copy.formulaText}</p>
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

          <svg className="tetra-scene" viewBox="0 0 100 72" role="img" aria-label={copy.aria}>
            <rect x="5" y="6" width="90" height="60" rx="9" fill="#111318" />

            <polygon points={`${p0.x},${p0.y} ${p1.x},${p1.y} ${p2.x},${p2.y}`} fill="rgba(40,100,255,0.15)" stroke="#2864FF" strokeWidth="0.5" />
            <polygon points={`${p0.x},${p0.y} ${p1.x},${p1.y} ${p3.x},${p3.y}`} fill="rgba(40,100,255,0.10)" stroke="#2864FF" strokeWidth="0.5" />
            <polygon points={`${p0.x},${p0.y} ${p2.x},${p2.y} ${p3.x},${p3.y}`} fill="rgba(40,100,255,0.08)" stroke="#2864FF" strokeWidth="0.5" />
            <polygon points={`${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y}`} fill="rgba(169,227,210,0.28)" stroke="#A9E3D2" strokeWidth="0.9" />

            <text x={p2.x - 6} y={p2.y - 2} fill="#F4F2EC" fontSize="3.2">{copy.labels.inclined}</text>
            <text x={p0.x - 7} y={p0.y + 7} fill="#F4F2EC" fontSize="3.1">{copy.labels.coord}</text>

            <line x1={p2.x} y1={p2.y} x2={p2.x + surfLen} y2={p2.y - surfLen * 0.45} stroke="#A9E3D2" strokeWidth="1.2" />
            <line x1={p3.x} y1={p3.y} x2={p3.x + surfLen * 0.55} y2={p3.y - surfLen * 0.35} stroke="#A9E3D2" strokeWidth="1.2" />
            <text x={p3.x + surfLen * 0.58} y={p3.y - surfLen * 0.38} fill="#F4F2EC" fontSize="3.1">{copy.labels.surface}</text>

            <line x1={cx - 8} y1={cy} x2={cx - 8} y2={cy + bodyLen} stroke="#DD7A2B" strokeWidth="1.2" />
            <text x={cx - 17} y={cy + bodyLen + 5} fill="#F4F2EC" fontSize="3.1">{copy.labels.body}</text>
          </svg>

          <div className="control-stack">
            <label>
              <span>{copy.size} <strong>{fmt(h)}</strong></span>
              <input type="range" min="0.2" max="1" step="0.01" value={h} onChange={(e) => setH(Number(e.target.value))} />
            </label>
            <label>
              <span>{copy.angle} <strong>{theta}°</strong></span>
              <input type="range" min="10" max="70" step="1" value={theta} onChange={(e) => setTheta(Number(e.target.value))} />
            </label>
          </div>

          <div className="metrics">
            <div><span>{copy.metrics.surface}</span><strong>{fmt(area)}</strong></div>
            <div><span>{copy.metrics.volume}</span><strong>{fmt(volume)}</strong></div>
            <div><span>{copy.metrics.ratio}</span><strong>{fmt(ratio)}</strong></div>
          </div>

          <div className="metrics metrics-secondary">
            <div><span>n₁A</span><strong>{fmt(projected[0])}</strong></div>
            <div><span>n₂A</span><strong>{fmt(projected[1])}</strong></div>
            <div><span>n₃A</span><strong>{fmt(projected[2])}</strong></div>
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
