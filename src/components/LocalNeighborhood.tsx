import { useMemo, useState } from 'react'
import type { Language, NotationMode } from '../i18n'

type Props = {
  notation: NotationMode
  language: Language
  onBack: () => void
}

const text = {
  ru: {
    back: '← K01',
    title: 'Локальная окрестность материальной точки',
    lead: 'Положение одной точки ещё не говорит, как деформируется тело рядом с ней. Поэтому рассмотрим малую окрестность материальной точки X и проследим, что происходит с короткими материальными отрезками вокруг неё.',
    key: 'ФИЗИЧЕСКИЙ СМЫСЛ',
    keyText: 'Локальная деформация определяется тем, как движение изменяет малые векторы dX, соединяющие выбранную точку с соседними материальными точками.',
    local: 'Локальная окрестность',
    localText: 'Если окрестность достаточно мала, её изменение можно приближённо описывать линейным отображением.',
    preview: 'ПРЕДВАРИТЕЛЬНЫЙ ВЗГЛЯД',
    previewText: 'В следующем модуле это линейное отображение получит имя — градиент деформации F.',
    stretchX: 'растяжение по X₁',
    stretchY: 'растяжение по X₂',
    shear: 'сдвиг',
    rotation: 'поворот',
    radius: 'размер окрестности',
    before: 'до',
    after: 'после',
    question: 'ВОПРОС ДЛЯ ПРОВЕРКИ',
    questionTitle: 'Почему нельзя судить о деформации только по траектории центральной точки?',
    questionText: 'Потому что одна и та же траектория центра совместима и с жёстким движением, и с растяжением, сдвигом или их комбинацией.',
    conclusion: 'ВЫВОД',
    conclusionTitle: 'Чтобы описать локальную деформацию, нужно смотреть на соседние точки.',
    conclusionText: 'Именно поэтому следующим объектом станет отображение малых векторов dX в dx.',
    sceneKicker: 'ЛОКАЛЬНАЯ ДЕФОРМАЦИЯ',
    sceneTitle: 'наблюдай, как меняется малая окрестность точки',
    interactive: 'ИНТЕРАКТИВНО',
  },
  en: {
    back: '← K01',
    title: 'Local neighborhood of a material point',
    lead: 'The position of one point does not tell us how the body deforms nearby. We therefore examine a small neighborhood of a material point X and track short material segments around it.',
    key: 'PHYSICAL MEANING',
    keyText: 'Local deformation is determined by how the motion changes small vectors dX connecting the selected point to nearby material points.',
    local: 'Local neighborhood',
    localText: 'If the neighborhood is sufficiently small, its change can be approximated by a linear mapping.',
    preview: 'PREVIEW',
    previewText: 'In the next module this linear mapping will be named the deformation gradient F.',
    stretchX: 'stretch along X₁',
    stretchY: 'stretch along X₂',
    shear: 'shear',
    rotation: 'rotation',
    radius: 'neighborhood size',
    before: 'before',
    after: 'after',
    question: 'CHECKPOINT',
    questionTitle: 'Why can deformation not be inferred from the trajectory of the center point alone?',
    questionText: 'Because the same center trajectory is compatible with rigid motion, stretch, shear, or a combination of them.',
    conclusion: 'CONCLUSION',
    conclusionTitle: 'Local deformation requires looking at neighboring points.',
    conclusionText: 'That is why the next object will map small vectors dX into dx.',
    sceneKicker: 'LOCAL DEFORMATION',
    sceneTitle: 'observe how a small neighborhood changes',
    interactive: 'INTERACTIVE',
  },
} as const

function fmt(v: number) {
  return v.toFixed(2)
}

export function LocalNeighborhood({ notation, language, onBack }: Props) {
  const copy = text[language]
  const [stretchX, setStretchX] = useState(1.25)
  const [stretchY, setStretchY] = useState(0.90)
  const [shear, setShear] = useState(0.30)
  const [rotationDeg, setRotationDeg] = useState(15)
  const [radius, setRadius] = useState(0.22)

  const F = useMemo(() => {
    const theta = rotationDeg * Math.PI / 180
    const c = Math.cos(theta)
    const s = Math.sin(theta)
    const A = [
      [stretchX, shear],
      [0, stretchY],
    ]
    return [
      [c * A[0][0] - s * A[1][0], c * A[0][1] - s * A[1][1]],
      [s * A[0][0] + c * A[1][0], s * A[0][1] + c * A[1][1]],
    ]
  }, [stretchX, stretchY, shear, rotationDeg])

  const centerX: [number, number] = [0, 0]
  const centerx: [number, number] = [0.18, 0.08]

  const transformLocal = (dX: [number, number]) => [
    centerx[0] + F[0][0] * dX[0] + F[0][1] * dX[1],
    centerx[1] + F[1][0] * dX[0] + F[1][1] * dX[1],
  ] as [number, number]

  const refMap = (p:[number,number]) => [28 + p[0]*45, 38 - p[1]*45]
  const curMap = (p:[number,number]) => [72 + p[0]*35, 38 - p[1]*35]

  const corners: [number,number][] = [
    [-radius,-radius],[radius,-radius],[radius,radius],[-radius,radius]
  ]
  const circle = Array.from({length: 72}, (_,i) => {
    const a = 2*Math.PI*i/72
    return [radius*Math.cos(a), radius*Math.sin(a)] as [number,number]
  })

  const curCorners = corners.map(transformLocal)
  const curCircle = circle.map(transformLocal)
  const refCornersSvg = corners.map(refMap)
  const refCircleSvg = circle.map(refMap)
  const curCornersSvg = curCorners.map(curMap)
  const curCircleSvg = curCircle.map(curMap)

  const polygon = (pts:number[][]) => pts.map(p=>p.join(',')).join(' ')
  const polyline = (pts:number[][]) => [...pts, pts[0]].map(p=>p.join(',')).join(' ')

  const notationLine =
    notation === 'Index' ? 'dxᵢ ≈ Aᵢⱼ dXⱼ' :
    notation === 'Matrix' ? 'dx ≈ A dX' :
    notation === 'Python' ? 'dx = A @ dX' :
    'd𝐱 ≈ 𝒜[d𝐗]'

  const det = F[0][0]*F[1][1]-F[0][1]*F[1][0]

  return (
    <section className="module-view module-view-stacked">
      <div className="lesson-copy">
        <button className="text-button" onClick={onBack}>{copy.back}</button>
        <div className="lesson-index">K02 / 13</div>
        <h1>{copy.title}</h1>
        <p className="lead">{copy.lead}</p>

        <div className="concept-card">
          <span>{copy.key}</span>
          <strong>{copy.keyText}</strong>
        </div>

        <div className="definition">
          <div className="definition-label">{copy.local}</div>
          <div className="formula">{notationLine}</div>
          <p>{copy.localText}</p>
        </div>

        <div className="definition">
          <div className="definition-label">{copy.preview}</div>
          <p>{copy.previewText}</p>
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

          <svg className="kinematics-scene" viewBox="0 0 100 72" role="img">
            <rect x="5" y="6" width="90" height="60" rx="9" fill="#111318" />
            <text x="14" y="13" fill="#8E96A3" fontSize="3.1">{copy.before}</text>
            <text x="62" y="13" fill="#8E96A3" fontSize="3.1">{copy.after}</text>

            <polyline points={polyline(refCircleSvg)} fill="none" stroke="#6C7480" strokeWidth="0.7"/>
            <polygon points={polygon(refCornersSvg)} fill="rgba(244,242,236,0.04)" stroke="#F4F2EC" strokeWidth="0.7"/>
            <circle cx={refMap(centerX)[0]} cy={refMap(centerX)[1]} r="1.6" fill="#A9E3D2"/>

            <polyline points={polyline(curCircleSvg)} fill="none" stroke="#A9E3D2" strokeWidth="0.9"/>
            <polygon points={polygon(curCornersSvg)} fill="rgba(40,100,255,0.10)" stroke="#2864FF" strokeWidth="0.9"/>
            <circle cx={curMap(centerx)[0]} cy={curMap(centerx)[1]} r="1.6" fill="#DD7A2B"/>

            {([[radius,0],[0,radius]] as [number,number][]).map((dX,i)=>{
              const p0=refMap(centerX)
              const p1=refMap(dX)
              const q0=curMap(centerx)
              const q1=curMap(transformLocal(dX))
              return <g key={i}>
                <line x1={p0[0]} y1={p0[1]} x2={p1[0]} y2={p1[1]} stroke={i===0 ? '#2864FF' : '#A9E3D2'} strokeWidth="1.2"/>
                <line x1={q0[0]} y1={q0[1]} x2={q1[0]} y2={q1[1]} stroke={i===0 ? '#2864FF' : '#A9E3D2'} strokeWidth="1.3"/>
              </g>
            })}
          </svg>

          <div className="control-stack">
            <label><span>{copy.stretchX} <strong>{fmt(stretchX)}</strong></span><input type="range" min="0.65" max="1.55" step="0.01" value={stretchX} onChange={e=>setStretchX(Number(e.target.value))}/></label>
            <label><span>{copy.stretchY} <strong>{fmt(stretchY)}</strong></span><input type="range" min="0.65" max="1.55" step="0.01" value={stretchY} onChange={e=>setStretchY(Number(e.target.value))}/></label>
            <label><span>{copy.shear} <strong>{fmt(shear)}</strong></span><input type="range" min="-0.70" max="0.70" step="0.01" value={shear} onChange={e=>setShear(Number(e.target.value))}/></label>
            <label><span>{copy.rotation} <strong>{rotationDeg}°</strong></span><input type="range" min="-60" max="60" step="1" value={rotationDeg} onChange={e=>setRotationDeg(Number(e.target.value))}/></label>
            <label><span>{copy.radius} <strong>{fmt(radius)}</strong></span><input type="range" min="0.10" max="0.35" step="0.01" value={radius} onChange={e=>setRadius(Number(e.target.value))}/></label>
          </div>

          <div className="metrics">
            <div><span>|dX₁|</span><strong>{fmt(radius)}</strong></div>
            <div><span>|dx₁|</span><strong>{fmt(Math.hypot(F[0][0]*radius,F[1][0]*radius))}</strong></div>
            <div><span>local area ratio</span><strong>{fmt(det)}</strong></div>
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
