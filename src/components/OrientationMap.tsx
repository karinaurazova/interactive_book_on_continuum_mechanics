import { useMemo, useState } from 'react'
import type { Language, NotationMode } from '../i18n'

type Props = {
  notation: NotationMode
  language: Language
  onBack: () => void
  onNext: () => void
}

const text = {
  ru: {
    back: '← M02',
    title: 'Одна точка — множество площадок',
    lead: 'Через одну и ту же точку можно провести бесконечно много площадок. Каждая ориентация задаётся единичной нормалью n и, вообще говоря, имеет свой вектор напряжения t(n).',
    key: 'КЛЮЧЕВАЯ МЫСЛЬ',
    keyText: 'Напряжённое состояние в точке можно рассматривать как отображение n ↦ t(n).',
    map: 'Отображение',
    mapText: 'Для каждой единичной нормали n существует соответствующий вектор напряжения t(n).',
    compact: 'Почему нужен новый объект?',
    compactText: 'Хранить отдельный вектор для каждой ориентации неудобно. В классической механике сплошной среды всё семейство t(n) можно восстановить из одного тензора второго порядка.',
    sceneKicker: 'ОРИЕНТАЦИИ ПЛОЩАДКИ',
    sceneTitle: 'выбери направление нормали',
    angle: 'угол нормали',
    normal: 'нормаль n',
    traction: 'вектор t(n)',
    question: 'ВОПРОС ДЛЯ ПРОВЕРКИ',
    questionTitle: 'Меняется ли t(n), если точка остаётся той же, а нормаль поворачивается?',
    questionText: 'Поворачивай n по окружности и сравнивай направление и длину t(n).',
    conclusion: 'ВЫВОД',
    conclusionTitle: 'Нам нужен один объект, который кодирует всё семейство t(n).',
    conclusionText: 'В следующем модуле этим объектом станет тензор напряжений Коши σ.',
    interactive: 'ИНТЕРАКТИВНО',
    aria: 'Окружность ориентаций с нормалью и соответствующим вектором напряжения',
    next: 'Перейти к тетраэдру Коши →',
  },
  en: {
    back: '← M02',
    title: 'One point — many planes',
    lead: 'Infinitely many planes can pass through the same point. Each orientation is described by a unit normal n and, in general, has its own traction vector t(n).',
    key: 'KEY IDEA',
    keyText: 'The stress state at a point can be viewed as a mapping n ↦ t(n).',
    map: 'Mapping',
    mapText: 'For every unit normal n there is a corresponding traction vector t(n).',
    compact: 'Why do we need a new object?',
    compactText: 'Storing a separate vector for every orientation is inconvenient. In classical continuum mechanics the whole family t(n) can be recovered from a single second-order tensor.',
    sceneKicker: 'PLANE ORIENTATIONS',
    sceneTitle: 'choose the normal direction',
    angle: 'normal angle',
    normal: 'normal n',
    traction: 'vector t(n)',
    question: 'CHECKPOINT',
    questionTitle: 'Does t(n) change if the point stays fixed while the normal rotates?',
    questionText: 'Rotate n around the circle and compare the direction and magnitude of t(n).',
    conclusion: 'CONCLUSION',
    conclusionTitle: 'We need one object that encodes the whole family t(n).',
    conclusionText: 'In the next module that object will be the Cauchy stress tensor σ.',
    interactive: 'INTERACTIVE',
    aria: 'Orientation circle with a normal and the corresponding traction vector',
    next: 'Continue to the Cauchy tetrahedron →',
  },
} as const

function fmt(v: number) {
  return (Math.abs(v) < 1e-10 ? 0 : v).toFixed(2)
}

export function OrientationMap({ notation, language, onBack, onNext }: Props) {
  const copy = text[language]
  const [theta, setTheta] = useState(34)

  const sigma = useMemo(() => [[1.2, 0.55], [0.55, 0.75]], [])
  const rad = (theta * Math.PI) / 180
  const n = useMemo<[number, number]>(() => [Math.cos(rad), Math.sin(rad)], [rad])
  const t = useMemo<[number, number]>(() => [
    sigma[0][0] * n[0] + sigma[0][1] * n[1],
    sigma[1][0] * n[0] + sigma[1][1] * n[1],
  ], [sigma, n])

  const tMag = Math.sqrt(t[0] ** 2 + t[1] ** 2)
  const notationLine =
    notation === 'Index' ? 'nⱼ ↦ tᵢ = σᵢⱼnⱼ' :
    notation === 'Matrix' ? '[n₁ n₂]ᵀ ↦ [t₁ t₂]ᵀ' :
    notation === 'Python' ? 'n -> sigma @ n' :
    '𝐧 ↦ 𝐭(𝐧)'

  const cx = 50
  const cy = 36
  const r = 21
  const nx = cx + n[0] * r
  const ny = cy - n[1] * r
  const tx = nx + t[0] * 9
  const ty = ny - t[1] * 9

  const samples = Array.from({ length: 18 }, (_, i) => {
    const a = (i / 18) * Math.PI * 2
    const sn: [number, number] = [Math.cos(a), Math.sin(a)]
    const st: [number, number] = [
      sigma[0][0] * sn[0] + sigma[0][1] * sn[1],
      sigma[1][0] * sn[0] + sigma[1][1] * sn[1],
    ]
    const px = cx + sn[0] * r
    const py = cy - sn[1] * r
    return { px, py, ex: px + st[0] * 3.8, ey: py - st[1] * 3.8 }
  })

  return (
    <section className="module-view">
      <div className="lesson-copy">
        <button className="text-button" onClick={onBack}>{copy.back}</button>
        <div className="lesson-index">M03 / 04</div>
        <h1>{copy.title}</h1>
        <p className="lead">{copy.lead}</p>

        <div className="concept-card">
          <span>{copy.key}</span>
          <strong>{copy.keyText}</strong>
        </div>

        <div className="definition">
          <div className="definition-label">{copy.map}</div>
          <div className="formula">{notationLine}</div>
          <p>{copy.mapText}</p>
        </div>

        <div className="definition">
          <div className="definition-label">{copy.compact}</div>
          <p>{copy.compactText}</p>
        </div>

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

          <svg className="orientation-scene" viewBox="0 0 100 72" role="img" aria-label={copy.aria}>
            <rect x="7" y="6" width="86" height="60" rx="9" fill="#111318" />
            <circle cx={cx} cy={cy} r={r} fill="none" stroke="#414752" strokeWidth="0.9" />
            <circle cx={cx} cy={cy} r="1.3" fill="#F4F2EC" />

            {samples.map((s, i) => (
              <line
                key={i}
                x1={s.px}
                y1={s.py}
                x2={s.ex}
                y2={s.ey}
                stroke="#A9E3D2"
                strokeWidth="0.55"
                opacity="0.32"
              />
            ))}

            <line x1={cx} y1={cy} x2={nx} y2={ny} stroke="#2864FF" strokeWidth="1.6" />
            <circle cx={nx} cy={ny} r="1.4" fill="#2864FF" />
            <text x={nx + 1.8} y={ny - 1.5} fill="#F4F2EC" fontSize="4">n</text>

            <line x1={nx} y1={ny} x2={tx} y2={ty} stroke="#A9E3D2" strokeWidth="1.7" />
            <text x={tx + 1.5} y={ty - 1} fill="#F4F2EC" fontSize="4">t(n)</text>
          </svg>

          <div className="control-stack">
            <label>
              <span>{copy.angle} <strong>{theta}°</strong></span>
              <input type="range" min="-180" max="180" value={theta} onChange={(e) => setTheta(Number(e.target.value))} />
            </label>
          </div>

          <div className="metrics">
            <div><span>{copy.normal}</span><strong>[{fmt(n[0])}; {fmt(n[1])}]</strong></div>
            <div><span>{copy.traction}</span><strong>[{fmt(t[0])}; {fmt(t[1])}]</strong></div>
            <div><span>|t|</span><strong>{fmt(tMag)}</strong></div>
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
