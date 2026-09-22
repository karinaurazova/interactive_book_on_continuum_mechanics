import { useMemo, useState } from 'react'
import type { Language, NotationMode } from '../i18n'

type Props = {
  notation: NotationMode
  language: Language
  onBack: () => void
  onNext: () => void
}

type Mode = 'stretch' | 'shear' | 'rotation' | 'combined'

const text = {
  ru: {
    back: '← K03',
    title: 'Растяжение, сдвиг и поворот',
    lead: 'Одна и та же матрица F может менять длины, углы и ориентацию локальной окрестности. Разберём типовые режимы по отдельности, чтобы увидеть, какой геометрический эффект создаёт каждый из них.',
    key: 'ФИЗИЧЕСКИЙ СМЫСЛ',
    keyText: 'Растяжение меняет длины, сдвиг меняет взаимный угол направлений, а жёсткий поворот меняет ориентацию без изменения длин и углов.',
    stretch: 'Растяжение',
    shear: 'Сдвиг',
    rotation: 'Поворот',
    combined: 'Комбинация',
    stretchText: 'Диагональная F масштабирует базисные направления.',
    shearText: 'Сдвиг превращает прямой угол в другой угол и меняет форму квадрата.',
    rotationText: 'Чистое вращение меняет ориентацию, но сохраняет длины и угол между направлениями.',
    combinedText: 'Общая F может одновременно менять длины, углы и ориентацию.',
    parameter: 'параметр',
    angleBetween: 'угол между образами',
    length1: '|F e₁|',
    length2: '|F e₂|',
    det: 'det F',
    sceneKicker: 'ТИПОВЫЕ РЕЖИМЫ',
    sceneTitle: 'сравни геометрический эффект разных локальных преобразований',
    warning: 'ВАЖНО',
    warningTitle: 'Это ещё не полярное разложение.',
    warningText: 'Мы рассматриваем характерные примеры F. Для произвольной матрицы строгое разделение вращения и растяжения выполняется через F = R U = V R.',
    question: 'ВОПРОС ДЛЯ ПРОВЕРКИ',
    questionTitle: 'Как распознать чистый жёсткий поворот?',
    questionText: 'При чистом вращении длины базисных направлений и угол между ними сохраняются, а det F = +1.',
    conclusion: 'ВЫВОД',
    conclusionTitle: 'Не каждое изменение ориентации означает деформацию.',
    conclusionText: 'Чтобы измерять именно изменение длин и углов независимо от жёсткого поворота, нужны специальные меры деформации.',
    interactive: 'ИНТЕРАКТИВНО',
    next: 'Перейти к якобиану J →',
  },
  en: {
    back: '← K03',
    title: 'Stretch, shear, and rotation',
    lead: 'The same matrix F can change lengths, angles, and the orientation of a local neighborhood. We examine typical modes separately to see the geometric effect produced by each one.',
    key: 'PHYSICAL MEANING',
    keyText: 'Stretch changes lengths, shear changes the angle between directions, while rigid rotation changes orientation without changing lengths or angles.',
    stretch: 'Stretch',
    shear: 'Shear',
    rotation: 'Rotation',
    combined: 'Combined',
    stretchText: 'A diagonal F scales the basis directions.',
    shearText: 'Shear changes a right angle and alters the shape of a square.',
    rotationText: 'Pure rotation changes orientation while preserving lengths and the angle between directions.',
    combinedText: 'A general F may change lengths, angles, and orientation simultaneously.',
    parameter: 'parameter',
    angleBetween: 'angle between images',
    length1: '|F e₁|',
    length2: '|F e₂|',
    det: 'det F',
    sceneKicker: 'TYPICAL MODES',
    sceneTitle: 'compare the geometric effects of local transformations',
    warning: 'IMPORTANT',
    warningTitle: 'This is not yet the polar decomposition.',
    warningText: 'We are examining characteristic examples of F. For a general matrix, rigorous separation of rotation and stretch uses F = R U = V R.',
    question: 'CHECKPOINT',
    questionTitle: 'How can a pure rigid rotation be recognized?',
    questionText: 'Under pure rotation the lengths of basis directions and their angle are preserved, while det F = +1.',
    conclusion: 'CONCLUSION',
    conclusionTitle: 'A change of orientation does not necessarily mean deformation.',
    conclusionText: 'To measure changes of lengths and angles independently of rigid rotation, we need dedicated strain measures.',
    interactive: 'INTERACTIVE',
    next: 'Continue to the Jacobian J →',
  },
} as const

function fmt(v:number, d=2) {
  return (Math.abs(v) < 1e-10 ? 0 : v).toFixed(d)
}

function angleBetween(a:[number,number], b:[number,number]) {
  const dot=a[0]*b[0]+a[1]*b[1]
  const na=Math.hypot(a[0],a[1])
  const nb=Math.hypot(b[0],b[1])
  const c=Math.max(-1,Math.min(1,dot/(na*nb)))
  return Math.acos(c)*180/Math.PI
}

export function LocalTransformationModes({ notation, language, onBack, onNext }: Props) {
  const copy=text[language]
  const [mode,setMode]=useState<Mode>('stretch')
  const [parameter,setParameter]=useState(0.35)

  const F=useMemo(() => {
    if (mode === 'stretch') {
      return [[1+parameter,0],[0,1-0.35*parameter]]
    }
    if (mode === 'shear') {
      return [[1,parameter],[0,1]]
    }
    if (mode === 'rotation') {
      const theta=parameter*70*Math.PI/180
      return [[Math.cos(theta),-Math.sin(theta)],[Math.sin(theta),Math.cos(theta)]]
    }
    const theta=parameter*35*Math.PI/180
    const c=Math.cos(theta), s=Math.sin(theta)
    const A=[[1+0.45*parameter,0.55*parameter],[0,1-0.18*parameter]]
    return [
      [c*A[0][0]-s*A[1][0], c*A[0][1]-s*A[1][1]],
      [s*A[0][0]+c*A[1][0], s*A[0][1]+c*A[1][1]],
    ]
  },[mode,parameter])

  const e1:[number,number]=[1,0]
  const e2:[number,number]=[0,1]
  const Fe1:[number,number]=[F[0][0],F[1][0]]
  const Fe2:[number,number]=[F[0][1],F[1][1]]

  const l1=Math.hypot(...Fe1)
  const l2=Math.hypot(...Fe2)
  const angle=angleBetween(Fe1,Fe2)
  const det=F[0][0]*F[1][1]-F[0][1]*F[1][0]

  const modeText =
    mode === 'stretch' ? copy.stretchText :
    mode === 'shear' ? copy.shearText :
    mode === 'rotation' ? copy.rotationText :
    copy.combinedText

  const notationLine =
    notation === 'Index' ? 'dxᵢ = Fᵢⱼ dXⱼ' :
    notation === 'Matrix' ? 'dx = F dX' :
    notation === 'Python' ? 'dx = F @ dX' :
    'd𝐱 = 𝐅 d𝐗'

  const ref=(p:[number,number])=>[27+p[0]*14,39-p[1]*14]
  const cur=(p:[number,number])=>[72+p[0]*12,39-p[1]*12]
  const p0=ref([0,0])
  const q0=cur([0,0])

  const refSquare=[[0,0],[1,0],[1,1],[0,1]] as [number,number][]
  const curSquare=[
    [0,0],
    Fe1,
    [Fe1[0]+Fe2[0],Fe1[1]+Fe2[1]],
    Fe2,
  ] as [number,number][]

  const polygon=(pts:[number,number][], mapper:(p:[number,number])=>number[]) =>
    pts.map(p=>mapper(p).join(',')).join(' ')

  return (
    <section className="module-view module-view-stacked">
      <div className="lesson-copy">
        <button className="text-button" onClick={onBack}>{copy.back}</button>
        <div className="lesson-index">K04 / 13</div>
        <h1>{copy.title}</h1>
        <p className="lead">{copy.lead}</p>

        <div className="concept-card">
          <span>{copy.key}</span>
          <strong>{copy.keyText}</strong>
        </div>

        <div className="definition">
          <div className="definition-label">{mode === 'stretch' ? copy.stretch : mode === 'shear' ? copy.shear : mode === 'rotation' ? copy.rotation : copy.combined}</div>
          <div className="formula">{notationLine}</div>
          <p>{modeText}</p>
        </div>

        <div className="warning-card kinematics-warning">
          <span>{copy.warning}</span>
          <strong>{copy.warningTitle}</strong>
          <p>{copy.warningText}</p>
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

          <div className="decomp-toggle-row">
            {([
              ['stretch',copy.stretch],
              ['shear',copy.shear],
              ['rotation',copy.rotation],
              ['combined',copy.combined],
            ] as [Mode,string][]).map(([id,label])=>(
              <button key={id} className={mode===id?'decomp-toggle active':'decomp-toggle'} onClick={()=>setMode(id)}>{label}</button>
            ))}
          </div>

          <div className="mode-layout">
            <svg className="mode-scene" viewBox="0 0 100 72" role="img">
              <rect x="5" y="6" width="90" height="60" rx="9" fill="#111318"/>
              <text x="15" y="13" fill="#8E96A3" fontSize="3.1">I</text>
              <text x="63" y="13" fill="#8E96A3" fontSize="3.1">F</text>

              <polygon points={polygon(refSquare,ref)} fill="rgba(244,242,236,0.04)" stroke="#5E6774" strokeWidth="0.7"/>
              <line x1={p0[0]} y1={p0[1]} x2={ref(e1)[0]} y2={ref(e1)[1]} stroke="#2864FF" strokeWidth="1.2"/>
              <line x1={p0[0]} y1={p0[1]} x2={ref(e2)[0]} y2={ref(e2)[1]} stroke="#A9E3D2" strokeWidth="1.2"/>

              <polygon points={polygon(curSquare,cur)} fill="rgba(40,100,255,0.09)" stroke="#F4F2EC" strokeWidth="0.8"/>
              <line x1={q0[0]} y1={q0[1]} x2={cur(Fe1)[0]} y2={cur(Fe1)[1]} stroke="#2864FF" strokeWidth="1.3"/>
              <line x1={q0[0]} y1={q0[1]} x2={cur(Fe2)[0]} y2={cur(Fe2)[1]} stroke="#A9E3D2" strokeWidth="1.3"/>
            </svg>

            <div className="gradient-matrix-card">
              <span>F</span>
              <div className="gradient-matrix">
                {[F[0][0],F[0][1],F[1][0],F[1][1]].map((v,i)=><strong key={i}>{fmt(v)}</strong>)}
              </div>
            </div>
          </div>

          <div className="control-stack">
            <label>
              <span>{copy.parameter} <strong>{fmt(parameter)}</strong></span>
              <input type="range" min="-0.75" max="0.75" step="0.01" value={parameter} onChange={e=>setParameter(Number(e.target.value))}/>
            </label>
          </div>

          <div className="mode-metrics">
            <div><span>{copy.length1}</span><strong>{fmt(l1)}</strong></div>
            <div><span>{copy.length2}</span><strong>{fmt(l2)}</strong></div>
            <div><span>{copy.angleBetween}</span><strong>{fmt(angle,1)}°</strong></div>
            <div><span>{copy.det}</span><strong>{fmt(det)}</strong></div>
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
