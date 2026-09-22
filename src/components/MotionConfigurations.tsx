import { useMemo, useState } from 'react'
import type { Language, NotationMode } from '../i18n'

type Props = {
  notation: NotationMode
  language: Language
  onNext: () => void
}

const text = {
  ru: {
    title: 'Движение и конфигурации',
    lead: 'Одно и то же материальное тело можно наблюдать в разные моменты времени. Чтобы описывать его движение, нужно уметь сопоставлять материальной точке её положение в исходной и текущей конфигурациях.',
    key: 'КЛЮЧЕВАЯ МЫСЛЬ',
    keyText: 'Движение — это отображение, которое каждой материальной точке X в исходной конфигурации ставит в соответствие её текущее положение x в момент времени t.',
    ref: 'Исходная конфигурация',
    cur: 'Текущая конфигурация',
    mapping: 'Отображение движения',
    mappingText: 'Запись x = χ(X,t) означает: выбери материальную точку по её метке X и узнай, где она находится в момент t.',
    point: 'материальная точка',
    time: 'время t',
    stretch: 'растяжение',
    shear: 'сдвиг',
    rotation: 'поворот',
    question: 'ВОПРОС ДЛЯ ПРОВЕРКИ',
    questionTitle: 'Если всё тело просто повернуть как абсолютно жёсткое, произошла ли деформация?',
    questionText: 'Меняй только поворот и наблюдай: положение точек меняется, но расстояния между любыми двумя материальными точками сохраняются.',
    conclusion: 'ВЫВОД',
    conclusionTitle: 'Движение и деформация — не одно и то же.',
    conclusionText: 'Кинематика сначала описывает, куда переместилась каждая материальная точка; затем мы отделяем жёсткое движение от локальной деформации.',
    sceneKicker: 'ДВИЖЕНИЕ ТЕЛА',
    sceneTitle: 'сравни исходную и текущую конфигурации',
    interactive: 'ИНТЕРАКТИВНО',
    next: 'Перейти к координатам X и x →',
  },
  en: {
    title: 'Motion and configurations',
    lead: 'The same material body can be observed at different times. To describe its motion, we need to associate each material point with its position in the reference and current configurations.',
    key: 'KEY IDEA',
    keyText: 'Motion is a mapping that assigns to each material point X in the reference configuration its current position x at time t.',
    ref: 'Reference configuration',
    cur: 'Current configuration',
    mapping: 'Motion map',
    mappingText: 'The notation x = χ(X,t) means: identify a material point by X and determine where it is at time t.',
    point: 'material point',
    time: 'time t',
    stretch: 'stretch',
    shear: 'shear',
    rotation: 'rotation',
    question: 'CHECKPOINT',
    questionTitle: 'If the whole body undergoes only a rigid rotation, has it deformed?',
    questionText: 'Change only the rotation and observe: point positions change while distances between every pair of material points remain unchanged.',
    conclusion: 'CONCLUSION',
    conclusionTitle: 'Motion and deformation are not the same thing.',
    conclusionText: 'Kinematics first describes where each material point moves; then rigid motion is separated from local deformation.',
    sceneKicker: 'BODY MOTION',
    sceneTitle: 'compare reference and current configurations',
    interactive: 'INTERACTIVE',
    next: 'Continue to X and x coordinates →',
  },
} as const

function fmt(v: number) {
  return v.toFixed(2)
}

export function MotionConfigurations({ notation, language, onNext }: Props) {
  const copy = text[language]
  const [time, setTime] = useState(0.65)
  const [stretch, setStretch] = useState(1.15)
  const [shear, setShear] = useState(0.22)
  const [rotation, setRotation] = useState(18)

  const selected = { X: [0.65, 0.35] as [number, number] }

  const transformedPoint = useMemo(() => {
    const X = selected.X
    const a = 1 + (stretch - 1) * time
    const g = shear * time
    const theta = rotation * time * Math.PI / 180

    const y0 = a * X[0] + g * X[1]
    const y1 = X[1]

    const c = Math.cos(theta)
    const s = Math.sin(theta)

    return [
      c * y0 - s * y1 + 0.22 * time,
      s * y0 + c * y1 + 0.08 * time,
    ] as [number, number]
  }, [time, stretch, shear, rotation])

  const notationLine =
    notation === 'Index' ? 'xᵢ = χᵢ(Xⱼ, t)' :
    notation === 'Matrix' ? 'x = χ(X, t)' :
    notation === 'Python' ? 'x = chi(X, t)' :
    '𝐱 = χ(𝐗,t)'

  const grid = [-0.6, -0.3, 0, 0.3, 0.6]

  const mapPoint = (X: [number, number]) => {
    const a = 1 + (stretch - 1) * time
    const g = shear * time
    const theta = rotation * time * Math.PI / 180
    const y0 = a * X[0] + g * X[1]
    const y1 = X[1]
    const c = Math.cos(theta)
    const s = Math.sin(theta)
    return [
      c * y0 - s * y1 + 0.22 * time,
      s * y0 + c * y1 + 0.08 * time,
    ] as [number, number]
  }

  const refSvg = (p: [number,number]) => [28 + p[0]*24, 38 - p[1]*24]
  const curSvg = (p: [number,number]) => [72 + p[0]*20, 38 - p[1]*20]

  return (
    <section className="module-view module-view-stacked">
      <div className="lesson-copy">
        <div className="lesson-index">K00 / 13</div>
        <h1>{copy.title}</h1>
        <p className="lead">{copy.lead}</p>

        <div className="concept-card">
          <span>{copy.key}</span>
          <strong>{copy.keyText}</strong>
        </div>

        <div className="definition">
          <div className="definition-label">{copy.mapping}</div>
          <div className="formula">{notationLine}</div>
          <p>{copy.mappingText}</p>
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

          <svg className="kinematics-scene" viewBox="0 0 100 72" role="img">
            <rect x="5" y="6" width="90" height="60" rx="9" fill="#111318" />

            <text x="12" y="13" fill="#8E96A3" fontSize="3.1">{copy.ref}</text>
            <text x="61" y="13" fill="#8E96A3" fontSize="3.1">{copy.cur}</text>

            {grid.map((v) => {
              const a = refSvg([v,-0.6])
              const b = refSvg([v,0.6])
              return <line key={'rv'+v} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="#47505C" strokeWidth="0.45" />
            })}
            {grid.map((v) => {
              const a = refSvg([-0.6,v])
              const b = refSvg([0.6,v])
              return <line key={'rh'+v} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="#47505C" strokeWidth="0.45" />
            })}

            {grid.map((v) => {
              const a = curSvg(mapPoint([v,-0.6]))
              const b = curSvg(mapPoint([v,0.6]))
              return <line key={'cv'+v} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="#2864FF" strokeWidth="0.55" opacity="0.9" />
            })}
            {grid.map((v) => {
              const a = curSvg(mapPoint([-0.6,v]))
              const b = curSvg(mapPoint([0.6,v]))
              return <line key={'ch'+v} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="#A9E3D2" strokeWidth="0.55" opacity="0.9" />
            })}

            {(() => {
              const p0=refSvg(selected.X)
              const p1=curSvg(transformedPoint)
              return <>
                <circle cx={p0[0]} cy={p0[1]} r="1.8" fill="#F4F2EC" />
                <text x={p0[0]+2} y={p0[1]-1.5} fill="#F4F2EC" fontSize="3.2">X</text>
                <circle cx={p1[0]} cy={p1[1]} r="1.8" fill="#DD7A2B" />
                <text x={p1[0]+2} y={p1[1]-1.5} fill="#F4F2EC" fontSize="3.2">x</text>
                <path d={`M ${p0[0]+4} ${p0[1]} C 44 24, 56 24, ${p1[0]-4} ${p1[1]}`} fill="none" stroke="#DD7A2B" strokeWidth="0.8" strokeDasharray="2 1.5" />
              </>
            })()}
          </svg>

          <div className="control-stack">
            <label><span>{copy.time} <strong>{fmt(time)}</strong></span><input type="range" min="0" max="1" step="0.01" value={time} onChange={e=>setTime(Number(e.target.value))}/></label>
            <label><span>{copy.stretch} <strong>{fmt(stretch)}</strong></span><input type="range" min="0.75" max="1.45" step="0.01" value={stretch} onChange={e=>setStretch(Number(e.target.value))}/></label>
            <label><span>{copy.shear} <strong>{fmt(shear)}</strong></span><input type="range" min="-0.6" max="0.6" step="0.01" value={shear} onChange={e=>setShear(Number(e.target.value))}/></label>
            <label><span>{copy.rotation} <strong>{rotation}°</strong></span><input type="range" min="-60" max="60" step="1" value={rotation} onChange={e=>setRotation(Number(e.target.value))}/></label>
          </div>

          <div className="metrics">
            <div><span>X₁</span><strong>{fmt(selected.X[0])}</strong></div>
            <div><span>X₂</span><strong>{fmt(selected.X[1])}</strong></div>
            <div><span>x</span><strong>[{transformedPoint.map(fmt).join(', ')}]</strong></div>
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
