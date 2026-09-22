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
    back: '← K04',
    title: 'Якобиан движения: J = det F',
    lead: 'Градиент деформации меняет не только направления и длины, но и локальный размер области. Определитель F собирает эту информацию в один скаляр J.',
    key: 'ФИЗИЧЕСКИЙ СМЫСЛ',
    keyText: 'В 3D J = det F задаёт локальное отношение текущего объёма к исходному. В нашей 2D-сцене он играет роль ориентированного отношения площадей.',
    expansion: 'J > 1',
    expansionText: 'Локальная площадь/объём увеличивается.',
    preserved: 'J ≈ 1',
    preservedText: 'В пределах допуска сцены локальная площадь/объём практически сохраняется.',
    contraction: '0 < J < 1',
    contractionText: 'Локальная площадь/объём уменьшается.',
    singular: 'J ≤ 0',
    singularText: 'Это уже не обычная допустимая локальная деформация континуума: при J = 0 отображение вырождается, при J < 0 меняется ориентация.',
    stretchX: 'масштаб по X₁',
    stretchY: 'масштаб по X₂',
    shear: 'сдвиг',
    sceneKicker: 'ЛОКАЛЬНОЕ ИЗМЕНЕНИЕ РАЗМЕРА',
    sceneTitle: 'следи за тем, как det F меняет локальную площадь',
    area0: 'исходная площадь',
    area1: 'текущая площадь',
    ratio: 'отношение',
    status: 'режим',
    warning: 'ВАЖНО',
    warningTitle: 'В механике обычно требуется J > 0.',
    warningText: 'Условие J > 0 обеспечивает локальную невырожденность и сохранение ориентации, но само по себе не гарантирует глобальную взаимную однозначность движения.',
    question: 'ВОПРОС ДЛЯ ПРОВЕРКИ',
    questionTitle: 'Может ли J = 1 означать отсутствие деформации?',
    questionText: 'Нет. Например, чистый сдвиг может сохранять площадь при J = 1, но при этом менять форму и углы.',
    conclusion: 'ВЫВОД',
    conclusionTitle: 'J говорит о локальном изменении размера, но не описывает форму полностью.',
    conclusionText: 'Чтобы понять растяжения и изменения углов независимо от вращения, дальше понадобятся C и B.',
    interactive: 'ИНТЕРАКТИВНО',
    next: 'Перейти к тензорам Коши–Грина →',
  },
  en: {
    back: '← K04',
    title: 'Jacobian of motion: J = det F',
    lead: 'The deformation gradient changes not only directions and lengths but also the local size of a region. The determinant of F collects this information into the scalar J.',
    key: 'PHYSICAL MEANING',
    keyText: 'In 3D, J = det F is the local current-to-reference volume ratio. In this 2D scene it plays the role of an oriented area ratio.',
    expansion: 'J > 1',
    expansionText: 'Local area/volume increases.',
    preserved: 'J ≈ 1',
    preservedText: 'Within the scene tolerance, local area/volume is approximately preserved.',
    contraction: '0 < J < 1',
    contractionText: 'Local area/volume decreases.',
    singular: 'J ≤ 0',
    singularText: 'This is no longer an ordinary admissible local deformation of a continuum: at J = 0 the map is singular, while J < 0 reverses orientation.',
    stretchX: 'scale along X₁',
    stretchY: 'scale along X₂',
    shear: 'shear',
    sceneKicker: 'LOCAL SIZE CHANGE',
    sceneTitle: 'watch how det F changes local area',
    area0: 'reference area',
    area1: 'current area',
    ratio: 'ratio',
    status: 'regime',
    warning: 'IMPORTANT',
    warningTitle: 'Continuum mechanics typically requires J > 0.',
    warningText: 'The condition J > 0 gives local nonsingularity and orientation preservation, but by itself does not guarantee global injectivity of the motion.',
    question: 'CHECKPOINT',
    questionTitle: 'Does J = 1 mean there is no deformation?',
    questionText: 'No. A pure shear, for example, may preserve area with J = 1 while still changing shape and angles.',
    conclusion: 'CONCLUSION',
    conclusionTitle: 'J measures local size change, not the full change of shape.',
    conclusionText: 'To quantify stretches and angle changes independently of rotation, we will next need C and B.',
    interactive: 'INTERACTIVE',
    next: 'Continue to the Cauchy–Green tensors →',
  },
} as const

function fmt(v:number, d=2) {
  return (Math.abs(v) < 1e-10 ? 0 : v).toFixed(d)
}

export function JacobianVolumeChange({ notation, language, onBack, onNext }: Props) {
  const copy=text[language]
  const [sx,setSx]=useState(1.25)
  const [sy,setSy]=useState(0.90)
  const [shear,setShear]=useState(0.25)

  const F=useMemo(()=>[[sx,shear],[0,sy]],[sx,sy,shear])
  const J=F[0][0]*F[1][1]-F[0][1]*F[1][0]

  const status =
    J > 1.02 ? [copy.expansion, copy.expansionText] :
    J > 0.98 ? [copy.preserved, copy.preservedText] :
    J > 0 ? [copy.contraction, copy.contractionText] :
    [copy.singular, copy.singularText]

  const refSquare:[[number,number],[number,number],[number,number],[number,number]]=[
    [0,0],[1,0],[1,1],[0,1]
  ]

  const curSquare=refSquare.map(([x,y])=>[
    F[0][0]*x+F[0][1]*y,
    F[1][0]*x+F[1][1]*y,
  ] as [number,number])

  const ref=(p:[number,number])=>[28+p[0]*14,42-p[1]*14]
  const cur=(p:[number,number])=>[72+p[0]*12,42-p[1]*12]
  const polygon=(pts:[number,number][], mapper:(p:[number,number])=>number[]) =>
    pts.map(p=>mapper(p).join(',')).join(' ')

  const notationLine =
    notation === 'Index' ? 'J = det(Fᵢⱼ)' :
    notation === 'Matrix' ? 'J = det[F]' :
    notation === 'Python' ? 'J = np.linalg.det(F)' :
    'J = det 𝐅'

  return (
    <section className="module-view module-view-stacked">
      <div className="lesson-copy">
        <button className="text-button" onClick={onBack}>{copy.back}</button>
        <div className="lesson-index">K05 / 13</div>
        <h1>{copy.title}</h1>
        <p className="lead">{copy.lead}</p>

        <div className="concept-card">
          <span>{copy.key}</span>
          <strong>{copy.keyText}</strong>
        </div>

        <div className="definition">
          <div className="definition-label">{copy.status}</div>
          <div className="formula">{notationLine} = {fmt(J)}</div>
          <p><strong>{status[0]}</strong> — {status[1]}</p>
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

          <svg className="jacobian-scene" viewBox="0 0 100 72" role="img">
            <rect x="5" y="6" width="90" height="60" rx="9" fill="#111318"/>
            <text x="14" y="13" fill="#8E96A3" fontSize="3.1">Ω₀</text>
            <text x="62" y="13" fill="#8E96A3" fontSize="3.1">Ωₜ</text>

            <polygon points={polygon(refSquare,ref)} fill="rgba(244,242,236,0.05)" stroke="#F4F2EC" strokeWidth="0.8"/>
            <polygon points={polygon(curSquare,cur)} fill={J>0 ? "rgba(40,100,255,0.11)" : "rgba(221,122,43,0.16)"} stroke={J>0 ? "#2864FF" : "#DD7A2B"} strokeWidth="0.9"/>

            <line x1={ref([0,0])[0]} y1={ref([0,0])[1]} x2={ref([1,0])[0]} y2={ref([1,0])[1]} stroke="#2864FF" strokeWidth="1.2"/>
            <line x1={ref([0,0])[0]} y1={ref([0,0])[1]} x2={ref([0,1])[0]} y2={ref([0,1])[1]} stroke="#A9E3D2" strokeWidth="1.2"/>

            <line x1={cur([0,0])[0]} y1={cur([0,0])[1]} x2={cur([F[0][0],F[1][0]])[0]} y2={cur([F[0][0],F[1][0]])[1]} stroke="#2864FF" strokeWidth="1.2"/>
            <line x1={cur([0,0])[0]} y1={cur([0,0])[1]} x2={cur([F[0][1],F[1][1]])[0]} y2={cur([F[0][1],F[1][1]])[1]} stroke="#A9E3D2" strokeWidth="1.2"/>
          </svg>

          <div className="control-stack">
            <label><span>{copy.stretchX} <strong>{fmt(sx)}</strong></span><input type="range" min="-0.6" max="1.8" step="0.01" value={sx} onChange={e=>setSx(Number(e.target.value))}/></label>
            <label><span>{copy.stretchY} <strong>{fmt(sy)}</strong></span><input type="range" min="-0.6" max="1.8" step="0.01" value={sy} onChange={e=>setSy(Number(e.target.value))}/></label>
            <label><span>{copy.shear} <strong>{fmt(shear)}</strong></span><input type="range" min="-1.0" max="1.0" step="0.01" value={shear} onChange={e=>setShear(Number(e.target.value))}/></label>
          </div>

          <div className="jacobian-metrics">
            <div><span>{copy.area0}</span><strong>1.00</strong></div>
            <div><span>{copy.area1}</span><strong>{fmt(Math.abs(J))}</strong></div>
            <div><span>{copy.ratio}</span><strong>{fmt(J)}</strong></div>
            <div className={J>0 ? 'jacobian-status ok' : 'jacobian-status fail'}><span>{copy.status}</span><strong>{status[0]}</strong></div>
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
