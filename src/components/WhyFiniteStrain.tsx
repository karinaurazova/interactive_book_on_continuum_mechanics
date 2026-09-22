import { useMemo, useState } from 'react'
import type { Language, NotationMode } from '../i18n'
import { DepthNote } from './DepthNote'
import { ApplicationLinks } from './ApplicationLinks'

type Props = {
  notation: NotationMode
  language: Language
}

const text = {
  ru: {
    title:'Почему нужны конечные деформации?',
    lead:'При больших изменениях формы линейная мера деформации и один тензор напряжений перестают быть достаточными. Нужно явно учитывать текущую и начальную конфигурации, нелинейную кинематику и согласованные меры напряжений.',
    key:'БОЛЬШАЯ ДЕФОРМАЦИЯ — ЭТО НЕ ПРОСТО “БОЛЬШОЕ ε”',
    keyText:'Даже чистый поворот может давать ненулевой симметричный градиент перемещений, хотя физической деформации нет.',
    small:'Почему малая деформация ломается',
    smallText:'Линейная мера ε = sym∇u корректна только при малых градиентах перемещений. При конечных поворотах она смешивает жёсткое вращение и деформацию.',
    finite:'Что используем вместо этого',
    finiteText:'Основным объектом становится F, а объективные меры строятся из C = FᵀF, B = FFᵀ, J = detF и других конечнодеформационных тензоров.',
    sceneKicker:'МАЛАЯ VS КОНЕЧНАЯ ДЕФОРМАЦИЯ',
    sceneTitle:'увеличивай поворот и растяжение и сравни линейную и конечную меры',
    angle:'поворот φ',
    stretch:'растяжение λ',
    linearMeasure:'‖ε_lin‖',
    greenMeasure:'‖E_GL‖',
    rigidError:'ошибка при чистом повороте',
    warning:'ВАЖНО',
    warningTitle:'Нельзя выбирать меру деформации отдельно от меры напряжений и энергетической постановки.',
    warningText:'В конечной деформации разные тензоры напряжений относятся к разным конфигурациям и имеют разные энергетически сопряжённые меры деформации.',
    question:'ВОПРОС ДЛЯ ПРОВЕРКИ',
    questionTitle:'Что должно происходить при чистом жёстком повороте?',
    questionText:'Объективная мера деформации должна оставаться нулевой, даже если компоненты F и градиента перемещений меняются.',
    conclusion:'ВЫВОД',
    conclusionTitle:'Конечная деформация требует геометрически точной кинематики.',
    conclusionText:'Следующий шаг — различить основные меры напряжений и понять, в какой конфигурации каждая из них работает.',
    deepen:'Углубиться',
    deepenText:'Для F = RU имеем C = U², поэтому C не зависит от жёсткого поворота R. Тензор Грина–Лагранжа E = (C−I)/2 также обращается в ноль при F = R.',
    research:'Исследовательское замечание',
    researchText:'В нелинейной FEM геометрическая нелинейность возникает уже на уровне кинематики и слабой формы, даже если сам материал остаётся гиперупругим и без внутренних переменных.',
    interactive:'ИНТЕРАКТИВНО',
  },
  en: {
    title:'Why do we need finite-strain mechanics?',
    lead:'At large changes of shape, linear strain and a single stress tensor are no longer sufficient. We must track reference and current configurations, nonlinear kinematics, and compatible stress measures.',
    key:'FINITE STRAIN IS NOT JUST “LARGE ε”',
    keyText:'Even a pure rotation can create a nonzero symmetric displacement gradient although there is no physical strain.',
    small:'Why small strain fails',
    smallText:'The linear strain ε = sym∇u is accurate only for small displacement gradients. At finite rotations it mixes rigid rotation with deformation.',
    finite:'What replaces it',
    finiteText:'The central object is F, while objective measures are built from C = FᵀF, B = FFᵀ, J = detF, and related tensors.',
    sceneKicker:'SMALL VS FINITE STRAIN',
    sceneTitle:'increase rotation and stretch and compare linear and finite measures',
    angle:'rotation φ',
    stretch:'stretch λ',
    linearMeasure:'‖ε_lin‖',
    greenMeasure:'‖E_GL‖',
    rigidError:'pure-rotation error',
    warning:'IMPORTANT',
    warningTitle:'A strain measure cannot be chosen independently of stress measure and energetic formulation.',
    warningText:'At finite strain, different stress tensors belong to different configurations and have different energetically conjugate strain measures.',
    question:'CHECKPOINT',
    questionTitle:'What should happen under a pure rigid rotation?',
    questionText:'An objective strain measure should remain zero even though F and displacement-gradient components change.',
    conclusion:'CONCLUSION',
    conclusionTitle:'Finite-strain mechanics requires geometrically exact kinematics.',
    conclusionText:'Next we distinguish the main stress measures and the configurations in which they act.',
    deepen:'Go deeper',
    deepenText:'For F = RU, C = U², so C is independent of rigid rotation R. The Green–Lagrange strain E = (C−I)/2 therefore vanishes when F = R.',
    research:'Research note',
    researchText:'In nonlinear FEM, geometric nonlinearity enters through kinematics and the weak form even when the material itself remains hyperelastic and has no internal variables.',
    interactive:'INTERACTIVE',
  }
} as const

function norm2(A:number[][]){ return Math.sqrt(A.flat().reduce((s,x)=>s+x*x,0)) }
function fmt(v:number,d=4){ return (Math.abs(v)<1e-12?0:v).toFixed(d) }

export function WhyFiniteStrain({notation,language}:Props){
  const copy=text[language]
  const [angle,setAngle]=useState(35)
  const [stretch,setStretch]=useState(1.15)

  const data=useMemo(()=>{
    const a=angle*Math.PI/180
    const c=Math.cos(a), s=Math.sin(a)
    const F=[[stretch*c,-s],[stretch*s,c]]
    const H=[[F[0][0]-1,F[0][1]],[F[1][0],F[1][1]-1]]
    const epsLin=[
      [H[0][0],.5*(H[0][1]+H[1][0])],
      [.5*(H[1][0]+H[0][1]),H[1][1]]
    ]
    const C=[
      [F[0][0]**2+F[1][0]**2,F[0][0]*F[0][1]+F[1][0]*F[1][1]],
      [F[0][1]*F[0][0]+F[1][1]*F[1][0],F[0][1]**2+F[1][1]**2]
    ]
    const EGL=[[.5*(C[0][0]-1),.5*C[0][1]],[.5*C[1][0],.5*(C[1][1]-1)]]
    const rigidLin = stretch===1 ? norm2(epsLin) : NaN
    return {F,epsLin,EGL,linNorm:norm2(epsLin),greenNorm:norm2(EGL),rigidLin}
  },[angle,stretch])

  const formula =
    notation==='Index' ? 'E_IJ = 1/2 (C_IJ − δ_IJ),   C_IJ = F_kI F_kJ' :
    notation==='Matrix' ? 'E = 1/2(FᵀF − I)' :
    notation==='Python' ? 'E = 0.5 * (F.T @ F - np.eye(2))' :
    'E = 1/2(C − I),   C = FᵀF'

  const w=26*stretch
  const x=50-w/2
  const theta=angle*Math.PI/180
  const dx=13*Math.cos(theta), dy=13*Math.sin(theta)

  return (
    <section className="module-view module-view-stacked">
      <div className="lesson-copy">
        <div className="lesson-index">D00</div>
        <h1>{copy.title}</h1>
        <p className="lead">{copy.lead}</p>

        <div className="concept-card">
          <span>{copy.key}</span>
          <strong>{copy.keyText}</strong>
        </div>

        <div className="definition">
          <div className="definition-label">{copy.small}</div>
          <p>{copy.smallText}</p>
        </div>

        <div className="definition">
          <div className="definition-label">{copy.finite}</div>
          <div className="formula">{formula}</div>
          <p>{copy.finiteText}</p>
        </div>

        <div className="warning-card kinematics-warning">
          <span>{copy.warning}</span>
          <strong>{copy.warningTitle}</strong>
          <p>{copy.warningText}</p>
        </div>

        <DepthNote label={copy.deepen}><p>{copy.deepenText}</p></DepthNote>
        <DepthNote label={copy.research} variant="research"><p>{copy.researchText}</p></DepthNote>

        <ApplicationLinks language={language} items={[
          {ru:'Эластомеры и резина',en:'Elastomers and rubber'},
          {ru:'Полимеры',en:'Polymers'},
          {ru:'Мягкие ткани',en:'Soft tissues'},
          {ru:'Большие перемещения конструкций',en:'Large-displacement structures'},
        ]}/>
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

          <svg className="balance-scene" viewBox="0 0 100 72" role="img">
            <rect x="5" y="6" width="90" height="60" rx="9" fill="#111318"/>
            <rect x="37" y="24" width="26" height="24" rx="2" fill="none" stroke="#69717C" strokeWidth=".8"/>
            <g transform={"rotate("+angle+" 50 36)"}>
              <rect x={x} y="24" width={w} height="24" rx="2" fill="rgba(169,227,210,.10)" stroke="#A9E3D2" strokeWidth="1.1"/>
            </g>
            <line x1="50" y1="36" x2={50+dx} y2={36-dy} stroke="#2864FF" strokeWidth="1.2"/>
            <text x="12" y="17" fill="#F4F2EC" fontSize="2.4">φ = {fmt(angle,0)}°, λ = {fmt(stretch,2)}</text>
          </svg>

          <div className="control-stack">
            <label><span>{copy.angle} <strong>{fmt(angle,0)}°</strong></span><input type="range" min="0" max="120" step="1" value={angle} onChange={e=>setAngle(Number(e.target.value))}/></label>
            <label><span>{copy.stretch} <strong>{fmt(stretch,3)}</strong></span><input type="range" min=".7" max="1.5" step=".005" value={stretch} onChange={e=>setStretch(Number(e.target.value))}/></label>
          </div>

          <div className="transport-metrics">
            <div><span>{copy.linearMeasure}</span><strong>{fmt(data.linNorm)}</strong></div>
            <div><span>{copy.greenMeasure}</span><strong>{fmt(data.greenNorm)}</strong></div>
            <div><span>{copy.rigidError}</span><strong>{stretch===1?fmt(data.rigidLin):'—'}</strong></div>
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
