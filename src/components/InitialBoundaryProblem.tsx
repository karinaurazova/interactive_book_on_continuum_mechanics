import { useMemo, useState } from 'react'
import type { Language, NotationMode } from '../i18n'
import { DepthNote } from './DepthNote'

type Props = {
  notation: NotationMode
  language: Language
  onBack: () => void
}

type Part = 'balance' | 'kinematics' | 'constitutive' | 'initial' | 'boundary'

const text = {
  ru: {
    back:'← B07',
    title:'Начально-краевая постановка задачи МСС',
    lead:'Законов баланса недостаточно, чтобы получить решаемую задачу. Нужно задать неизвестые поля, кинематику, конститутивный закон, начальные условия и условия на границе.',
    key:'ПОЛНАЯ ЗАДАЧА = УРАВНЕНИЯ + МАТЕРИАЛ + УСЛОВИЯ',
    keyText:'Только совместно эти элементы превращают физическую модель в начально-краевую задачу.',
    unknowns:'Неизвестые поля',
    unknownsText:'В динамической механической задаче основным неизвестным может быть перемещение u(x,t); из него получают скорость, ускорение и меры деформации.',
    structure:'Структура постановки',
    structureText:'Баланс задаёт уравнение движения, кинематика связывает перемещение с деформацией, конститутивный закон — деформацию с напряжением, а начальные и граничные условия замыкают задачу.',
    sceneKicker:'СБОРКА ЗАДАЧИ',
    sceneTitle:'включай элементы постановки и проверяй, достаточно ли информации для решения',
    balance:'баланс импульса',
    kinematics:'кинематика',
    constitutive:'конститутивный закон',
    initial:'начальные условия',
    boundary:'граничные условия',
    complete:'постановка замкнута',
    incomplete:'постановка неполна',
    missing:'не хватает',
    warning:'ВАЖНО',
    warningTitle:'Количество уравнений само по себе не гарантирует корректность постановки.',
    warningText:'Нужны совместимые начальные и граничные условия, корректное разбиение границы, физически допустимый конститутивный закон и достаточная регулярность полей. В нелинейных задачах также важны вопросы существования, единственности и устойчивости решения.',
    question:'ВОПРОС ДЛЯ ПРОВЕРКИ',
    questionTitle:'Почему нельзя задать перемещение и вектор напряжения на одной и той же части границы произвольно?',
    questionText:'Потому что это обычно переопределяет задачу. На разных частях границы задают кинематические условия u = ū и силовые условия σn = t̄.',
    conclusion:'ВЫВОД',
    conclusionTitle:'Начально-краевая задача объединяет всю механику в единую систему.',
    conclusionText:'Следующий шаг — перейти к слабой форме: именно она лежит в основе метода конечных элементов.',
    deepen:'Углубиться',
    deepenText:'Для малых деформаций динамическая упругая задача может быть записана как ρü = ∇·σ + ρb в Ω, ε = sym∇u, σ = C:ε, с u = ū на Γᵤ, σn = t̄ на Γₜ, Γᵤ ∪ Γₜ = ∂Ω, Γᵤ ∩ Γₜ = ∅, а также u(x,0)=u₀(x), u̇(x,0)=v₀(x).',
    research:'Исследовательское замечание',
    researchText:'В нелинейной механике мягких тканей неизвестные могут включать давление несжимаемости, внутренние переменные, концентрации, поля роста и ремоделирования. Тогда постановка становится многополевой и требует согласованного выбора дополнительных уравнений и условий.',
    interactive:'ИНТЕРАКТИВНО',
  },
  en: {
    back:'← B07',
    title:'Initial-boundary-value problem in continuum mechanics',
    lead:'Balance laws alone do not define a solvable problem. One must specify unknown fields, kinematics, a constitutive law, initial conditions, and boundary conditions.',
    key:'COMPLETE PROBLEM = EQUATIONS + MATERIAL + CONDITIONS',
    keyText:'Only together do these ingredients turn a physical model into an initial-boundary-value problem.',
    unknowns:'Unknown fields',
    unknownsText:'In a dynamic mechanical problem, displacement u(x,t) can be the primary unknown; velocity, acceleration, and strain measures follow from it.',
    structure:'Problem structure',
    structureText:'Balance provides the equation of motion, kinematics links displacement to strain, constitutive equations link strain to stress, and initial/boundary conditions close the problem.',
    sceneKicker:'PROBLEM ASSEMBLY',
    sceneTitle:'toggle ingredients and check whether the problem is sufficiently specified',
    balance:'momentum balance',
    kinematics:'kinematics',
    constitutive:'constitutive law',
    initial:'initial conditions',
    boundary:'boundary conditions',
    complete:'problem closed',
    incomplete:'problem incomplete',
    missing:'missing',
    warning:'IMPORTANT',
    warningTitle:'The number of equations alone does not guarantee a well-posed problem.',
    warningText:'Initial and boundary conditions must be compatible, boundary partitioning must be correct, the constitutive law must be physically admissible, and fields need sufficient regularity. Nonlinear problems also raise existence, uniqueness, and stability questions.',
    question:'CHECKPOINT',
    questionTitle:'Why can displacement and traction not be prescribed arbitrarily on the same boundary part?',
    questionText:'Because this typically overconstrains the problem. Kinematic conditions u = ū and traction conditions σn = t̄ are assigned on distinct boundary subsets.',
    conclusion:'CONCLUSION',
    conclusionTitle:'An initial-boundary-value problem assembles continuum mechanics into one system.',
    conclusionText:'Next we move to the weak form, which underlies the finite-element method.',
    deepen:'Go deeper',
    deepenText:'For small-strain dynamic elasticity one may write ρü = ∇·σ + ρb in Ω, ε = sym∇u, σ = C:ε, with u = ū on Γᵤ, σn = t̄ on Γₜ, Γᵤ ∪ Γₜ = ∂Ω, Γᵤ ∩ Γₜ = ∅, and u(x,0)=u₀(x), u̇(x,0)=v₀(x).',
    research:'Research note',
    researchText:'In nonlinear soft-tissue mechanics the unknowns may also include incompressibility pressure, internal variables, concentrations, growth fields, and remodeling fields. The problem then becomes multiphysics and requires consistent additional equations and conditions.',
    interactive:'INTERACTIVE',
  }
} as const

export function InitialBoundaryProblem({notation,language,onBack}:Props){
  const copy=text[language]
  const [parts,setParts]=useState<Record<Part,boolean>>({
    balance:true,
    kinematics:true,
    constitutive:true,
    initial:true,
    boundary:true,
  })

  const order:Part[]=['balance','kinematics','constitutive','initial','boundary']
  const toggle=(p:Part)=>setParts(prev=>({...prev,[p]:!prev[p]}))
  const missing=useMemo(()=>order.filter(p=>!parts[p]),[parts])
  const complete=missing.length===0

  const equation =
    notation==='Index' ? 'ρ üᵢ = ∂σᵢⱼ/∂xⱼ + ρbᵢ' :
    notation==='Matrix' ? 'ρ ü = ∇·σ + ρ b' :
    notation==='Python' ? 'rho * u_ddot = div_sigma + rho * b' :
    'ρü = ∇·σ + ρb'

  const label=(p:Part)=>copy[p]

  return (
    <section className="module-view module-view-stacked">
      <div className="lesson-copy">
        <button className="text-button" onClick={onBack}>{copy.back}</button>
        <div className="lesson-index">B08 / 10</div>
        <h1>{copy.title}</h1>
        <p className="lead">{copy.lead}</p>

        <div className="concept-card">
          <span>{copy.key}</span>
          <strong>{copy.keyText}</strong>
        </div>

        <div className="definition">
          <div className="definition-label">{copy.unknowns}</div>
          <div className="formula">{equation}</div>
          <p>{copy.unknownsText}</p>
        </div>

        <div className="definition">
          <div className="definition-label">{copy.structure}</div>
          <p>{copy.structureText}</p>
        </div>

        <div className="warning-card kinematics-warning">
          <span>{copy.warning}</span>
          <strong>{copy.warningTitle}</strong>
          <p>{copy.warningText}</p>
        </div>

        <DepthNote label={copy.deepen}><p>{copy.deepenText}</p></DepthNote>
        <DepthNote label={copy.research} variant="research"><p>{copy.researchText}</p></DepthNote>
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
            {order.map(p=>(
              <button
                key={p}
                className={parts[p]?'decomp-toggle active':'decomp-toggle'}
                onClick={()=>toggle(p)}
              >
                {label(p)}
              </button>
            ))}
          </div>

          <svg className="balance-scene" viewBox="0 0 100 72" role="img">
            <rect x="5" y="6" width="90" height="60" rx="9" fill="#111318"/>

            {order.map((p,i)=>{
              const x=10+i*17.5
              const on=parts[p]
              return <g key={p}>
                <rect x={x} y="25" width="14" height="18" rx="2.5"
                  fill={on?"rgba(169,227,210,.15)":"rgba(244,242,236,.035)"}
                  stroke={on?"#A9E3D2":"#505764"} strokeWidth=".8"/>
                <text x={x+2} y="35" fill={on?"#A9E3D2":"#69717C"} fontSize="2.2">
                  {i+1}
                </text>
                {i<order.length-1 && <line x1={x+14} y1="34" x2={x+17.5} y2="34" stroke="#505764" strokeWidth=".7"/>}
              </g>
            })}

            <text x="30" y="55" fill={complete?"#A9E3D2":"#DD7A2B"} fontSize="3">
              {complete?copy.complete:copy.incomplete}
            </text>
            {!complete && <text x="22" y="61" fill="#DD7A2B" fontSize="2.15">
              {copy.missing}: {missing.map(label).join(', ')}
            </text>}
          </svg>

          <div className="transport-metrics">
            {order.map(p=>(
              <div key={p}>
                <span>{label(p)}</span>
                <strong>{parts[p]?'✓':'—'}</strong>
              </div>
            ))}
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
