import { useMemo, useState } from 'react'
import type { Language, NotationMode } from '../i18n'
import { DepthNote } from './DepthNote'

type Props = {
  notation: NotationMode
  language: Language
  onBack: () => void
  onNext: () => void
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
    sceneTitle: 'изменяй размер и ориентацию наклонной грани',
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
    legend: {
      inclined: 'наклонная грань',
      coord: 'координатные грани',
      normal: 'нормаль n',
      surface: 'поверхностный вклад',
      body: 'объёмный вклад',
    },
    interactive: 'ИНТЕРАКТИВНО',
    aria: 'Тетраэдр Коши с изменяемой наклонной гранью и нормалью',
    next: 'Перейти к компонентам тензора →',
    deepen: 'Углубиться',
    deepenText: 'Если записать баланс сил для тетраэдра и разделить его на площадь наклонной грани A, координатные поверхностные силы входят с коэффициентами n₁, n₂, n₃. Объёмные и инерционные члены содержат дополнительный множитель h и исчезают при h → 0. Так получается линейность t(n) по n.',
    research: 'Исследовательское замечание',
    researchText: 'Вывод Коши опирается на локальность и существование конечного предела поверхностной силы на единицу площади. В более общих теориях континуума — например, с моментными напряжениями или дополнительными микроструктурными степенями свободы — структура контактных взаимодействий может быть богаче.',
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
    sceneTitle: 'change the size and orientation of the inclined face',
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
    legend: {
      inclined: 'inclined face',
      coord: 'coordinate faces',
      normal: 'normal n',
      surface: 'surface contribution',
      body: 'body-force contribution',
    },
    interactive: 'INTERACTIVE',
    aria: 'Cauchy tetrahedron with a variable inclined face and normal',
    next: 'Continue to stress components →',
    deepen: 'Go deeper',
    deepenText: 'Writing force balance for the tetrahedron and dividing by the inclined-face area A leaves the coordinate-face tractions weighted by n₁, n₂, n₃. Body-force and inertia terms carry one extra factor of h and vanish as h → 0. This yields linearity of t(n) in n.',
    research: 'Research note',
    researchText: 'Cauchy’s construction assumes a local continuum description and a finite traction limit per unit area. In generalized continua with couple stresses or additional microstructural degrees of freedom, contact interactions may require a richer description.',
  },
} as const

function fmt(v: number) {
  return (Math.abs(v) < 1e-10 ? 0 : v).toFixed(2)
}

export function CauchyTetrahedron({ notation, language, onBack, onNext }: Props) {
  const copy = text[language]
  const [h, setH] = useState(0.58)
  const [theta, setTheta] = useState(35)

  const rad = (theta * Math.PI) / 180

  const n = useMemo<[number, number, number]>(() => {
    const n1 = Math.cos(rad) * 0.78
    const n2 = Math.sin(rad) * 0.78
    const n3 = Math.sqrt(Math.max(0.08, 1 - n1 * n1 - n2 * n2))
    const norm = Math.sqrt(n1 * n1 + n2 * n2 + n3 * n3)
    return [n1 / norm, n2 / norm, n3 / norm]
  }, [rad])

  const area = h * h
  const volume = h * h * h
  const ratio = volume / area
  const projected = [Math.abs(n[0]) * area, Math.abs(n[1]) * area, Math.abs(n[2]) * area]

  const formulaLine =
    notation === 'Index' ? 'tᵢ = σᵢⱼnⱼ' :
    notation === 'Matrix' ? '[t₁ t₂ t₃]ᵀ = [σ][n₁ n₂ n₃]ᵀ' :
    notation === 'Python' ? 't = sigma @ n' :
    '𝐭(𝐧) = σ𝐧'

  const cx = 50
  const cy = 38
  const s = 14 + 15 * h

  const baseA = { x: cx - s * 0.95, y: cy + s * 0.65 }
  const baseB = { x: cx + s * 0.15, y: cy + s * 0.72 }
  const apex = { x: cx - s * 0.35, y: cy - s * 0.82 }

  const lateralShift = (theta - 40) / 35
  const moving = {
    x: cx + s * (0.55 + 0.34 * lateralShift),
    y: cy - s * (0.08 + 0.28 * lateralShift),
  }

  const faceCenter = {
    x: (baseB.x + apex.x + moving.x) / 3,
    y: (baseB.y + apex.y + moving.y) / 3,
  }

  const normalScale = 11 + 6 * h
  const normalEnd = {
    x: faceCenter.x + n[0] * normalScale,
    y: faceCenter.y - n[1] * normalScale,
  }

  const surfaceScale = 7 + 10 * h
  const bodyScale = 2.5 + 5 * h * h

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

        <DepthNote label={copy.deepen}>
          <p>{copy.deepenText}</p>
        </DepthNote>
        <DepthNote label={copy.research} variant="research">
          <p>{copy.researchText}</p>
        </DepthNote>

        <button className="primary-button" onClick={onNext}>{copy.next}</button>
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

            <polygon
              points={`${baseA.x},${baseA.y} ${baseB.x},${baseB.y} ${apex.x},${apex.y}`}
              fill="rgba(40,100,255,0.16)"
              stroke="#2864FF"
              strokeWidth="0.55"
            />
            <polygon
              points={`${baseA.x},${baseA.y} ${baseB.x},${baseB.y} ${moving.x},${moving.y}`}
              fill="rgba(40,100,255,0.10)"
              stroke="#2864FF"
              strokeWidth="0.55"
            />
            <polygon
              points={`${baseA.x},${baseA.y} ${apex.x},${apex.y} ${moving.x},${moving.y}`}
              fill="rgba(40,100,255,0.07)"
              stroke="#2864FF"
              strokeWidth="0.55"
            />

            <polygon
              points={`${baseB.x},${baseB.y} ${apex.x},${apex.y} ${moving.x},${moving.y}`}
              fill="rgba(169,227,210,0.30)"
              stroke="#A9E3D2"
              strokeWidth="1"
            />

            <circle cx={faceCenter.x} cy={faceCenter.y} r="1.15" fill="#F4F2EC" />

            <line
              x1={faceCenter.x}
              y1={faceCenter.y}
              x2={normalEnd.x}
              y2={normalEnd.y}
              stroke="#2864FF"
              strokeWidth="1.5"
            />
            <text x={normalEnd.x + 1.4} y={normalEnd.y - 1.2} fill="#F4F2EC" fontSize="3.8">n</text>

            <line
              x1={apex.x}
              y1={apex.y}
              x2={apex.x + surfaceScale}
              y2={apex.y - surfaceScale * 0.38}
              stroke="#A9E3D2"
              strokeWidth="1.15"
            />

            <line
              x1={moving.x}
              y1={moving.y}
              x2={moving.x + surfaceScale * 0.6}
              y2={moving.y - surfaceScale * 0.28}
              stroke="#A9E3D2"
              strokeWidth="1.15"
            />

            <line
              x1={cx - 7}
              y1={cy + 1}
              x2={cx - 7}
              y2={cy + 1 + bodyScale}
              stroke="#DD7A2B"
              strokeWidth="1.2"
            />
          </svg>

          <div className="scene-legend">
            <span><i className="legend-swatch inclined" />{copy.legend.inclined}</span>
            <span><i className="legend-swatch coord" />{copy.legend.coord}</span>
            <span><i className="legend-swatch normal" />{copy.legend.normal}</span>
            <span><i className="legend-swatch surface" />{copy.legend.surface}</span>
            <span><i className="legend-swatch body" />{copy.legend.body}</span>
          </div>

          <div className="control-stack">
            <label>
              <span>{copy.size} <strong>{fmt(h)}</strong></span>
              <input type="range" min="0.2" max="1" step="0.01" value={h} onChange={(e) => setH(Number(e.target.value))} />
            </label>
            <label>
              <span>{copy.angle} <strong>{theta}°</strong></span>
              <input type="range" min="5" max="75" step="1" value={theta} onChange={(e) => setTheta(Number(e.target.value))} />
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
