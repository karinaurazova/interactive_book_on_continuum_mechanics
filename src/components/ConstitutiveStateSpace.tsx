import { useMemo, useState } from 'react'
import type { Language, NotationMode } from '../i18n'
import { DepthNote } from './DepthNote'

type Props = {
  notation: NotationMode
  language: Language
  onBack: () => void
  onNext: () => void
}

type Dependency = 'history' | 'temperature' | 'internal' | 'structure'

const text = {
  ru: {
    back:'← C00',
    title:'Что может входить в конститутивное соотношение?',
    lead:'Напряжение не обязано определяться только текущей деформацией. Для реального материала важны история нагружения, температура, внутреннее состояние и микроструктурные направления.',
    key:'ТЕКУЩЕЕ СОСТОЯНИЕ — НЕ ВСЯ ИСТОРИЯ МАТЕРИАЛА',
    keyText:'Конститутивный отклик может зависеть от набора переменных состояния и истории процесса.',
    general:'Общая идея',
    generalText:'Вместо простой зависимости σ = σ(ε) часто нужен функционал или расширенная функция состояния, учитывающая дополнительные поля и внутренние переменные.',
    state:'Переменные состояния',
    stateText:'Нужно различать наблюдаемые кинематические поля и дополнительные материальные переменные, которые вводятся самой моделью.',
    sceneKicker:'РАСШИРЕННОЕ СОСТОЯНИЕ МАТЕРИАЛА',
    sceneTitle:'включай дополнительные зависимости и смотри, как меняется отклик при той же деформации',
    strain:'текущая деформация ε',
    history:'история нагружения',
    temperature:'температура',
    internal:'внутренняя переменная',
    structure:'структурное направление',
    historyAmp:'память h',
    deltaT:'ΔT',
    alpha:'внутренняя переменная α',
    angle:'угол структуры θ',
    base:'базовый упругий вклад',
    extra:'дополнительный вклад',
    stress:'итоговое напряжение σ',
    active:'учитывается',
    inactive:'не учитывается',
    warning:'ВАЖНО',
    warningTitle:'Дополнительная переменная должна иметь физический смысл и собственный закон эволюции, если она меняется во времени.',
    warningText:'Нельзя просто добавлять скрытые параметры ради подгонки кривой. Для внутренних переменных нужны определение, термодинамически допустимая эволюция и связь с наблюдаемыми эффектами.',
    question:'ВОПРОС ДЛЯ ПРОВЕРКИ',
    questionTitle:'Может ли материал иметь одинаковую текущую деформацию, но разные напряжения?',
    questionText:'Да. Например, при наличии памяти, повреждения, остаточной деформации или активного состояния текущее ε не определяет σ однозначно.',
    conclusion:'ВЫВОД',
    conclusionTitle:'Конститутивная модель определяет, какую информацию о состоянии и истории материала мы считаем существенной.',
    conclusionText:'Следующий шаг — требование материальной объективности: физический отклик не должен зависеть от произвольного движения наблюдателя.',
    deepen:'Углубиться',
    deepenText:'Обобщённо можно писать σ(t) = 𝓕({kinematics(τ)}_{τ≤t}, θ(t), q(t), A₁,…), где q — набор внутренних переменных, а A₁,… — структурные тензоры. Для материалов без памяти функциональная зависимость по истории упрощается до функции текущего состояния.',
    research:'Исследовательское замечание',
    researchText:'В моделях роста и ремоделирования внутренними переменными могут быть естественная конфигурация, массовые доли компонентов, deposition stretch, повреждение, ориентация волокон или параметры адаптации. Их выбор фактически задаёт научную гипотезу о механизмах материала.',
    interactive:'ИНТЕРАКТИВНО',
    next:'Перейти к материальной объективности →',
  },
  en: {
    back:'← C00',
    title:'What can enter a constitutive relation?',
    lead:'Stress need not be determined only by current deformation. Real materials may depend on loading history, temperature, internal state, and microstructural directions.',
    key:'CURRENT STATE IS NOT THE WHOLE MATERIAL HISTORY',
    keyText:'Constitutive response may depend on a set of state variables and on process history.',
    general:'General idea',
    generalText:'Instead of a simple σ = σ(ε) relation, one often needs a functional or an extended state function that includes additional fields and internal variables.',
    state:'State variables',
    stateText:'Observable kinematic fields should be distinguished from additional material variables introduced by the model itself.',
    sceneKicker:'EXTENDED MATERIAL STATE',
    sceneTitle:'toggle extra dependencies and observe the response at the same deformation',
    strain:'current strain ε',
    history:'loading history',
    temperature:'temperature',
    internal:'internal variable',
    structure:'structural direction',
    historyAmp:'memory h',
    deltaT:'ΔT',
    alpha:'internal variable α',
    angle:'structure angle θ',
    base:'baseline elastic contribution',
    extra:'additional contribution',
    stress:'total stress σ',
    active:'included',
    inactive:'not included',
    warning:'IMPORTANT',
    warningTitle:'An internal variable needs physical meaning and an evolution law if it changes in time.',
    warningText:'Hidden parameters should not be added only to fit curves. Internal variables need definitions, thermodynamically admissible evolution, and links to observable effects.',
    question:'CHECKPOINT',
    questionTitle:'Can a material have the same current strain but different stresses?',
    questionText:'Yes. With memory, damage, residual strain, or active state, current ε does not uniquely determine σ.',
    conclusion:'CONCLUSION',
    conclusionTitle:'A constitutive model defines which information about material state and history is considered essential.',
    conclusionText:'Next comes material objectivity: physical response must not depend on arbitrary observer motion.',
    deepen:'Go deeper',
    deepenText:'One may write σ(t) = 𝓕({kinematics(τ)}_{τ≤t}, θ(t), q(t), A₁,…), where q denotes internal variables and A₁,… structural tensors. For memoryless materials, the history functional reduces to a function of current state.',
    research:'Research note',
    researchText:'Growth and remodeling models may use natural configuration, constituent mass fractions, deposition stretch, damage, fiber orientation, or adaptation variables as internal state descriptors. Choosing them is itself a mechanistic hypothesis.',
    interactive:'INTERACTIVE',
    next:'Continue to material objectivity →',
  }
} as const

function fmt(v:number,d=3){
  return v.toFixed(d)
}

export function ConstitutiveStateSpace({notation,language,onBack,onNext}:Props){
  const copy=text[language]
  const [strain,setStrain]=useState(.25)
  const [history,setHistory]=useState(true)
  const [temperature,setTemperature]=useState(false)
  const [internal,setInternal]=useState(true)
  const [structure,setStructure]=useState(false)
  const [h,setH]=useState(.20)
  const [dT,setDT]=useState(8)
  const [alpha,setAlpha]=useState(.15)
  const [angle,setAngle]=useState(30)

  const data=useMemo(()=>{
    const E=1.6
    const base=E*strain
    const historyTerm=history ? .7*h : 0
    const thermalTerm=temperature ? -.012*dT : 0
    const internalTerm=internal ? -.9*alpha : 0
    const c=Math.cos(angle*Math.PI/180)
    const structureTerm=structure ? .45*strain*(3*c*c-1) : 0
    const extra=historyTerm+thermalTerm+internalTerm+structureTerm
    return {base,extra,stress:base+extra}
  },[strain,history,temperature,internal,structure,h,dT,alpha,angle])

  const formula =
    notation==='Index' ? 'σᵢⱼ = 𝓕ᵢⱼ(εₖₗ, history, θ, q, Aₖₗ, …)' :
    notation==='Matrix' ? 'σ = 𝓕(ε, history, θ, q, A, …)' :
    notation==='Python' ? 'sigma = model(strain, history, temperature, internal_vars, structure)' :
    'σ(t) = 𝓕(current state, history, internal variables, structure, …)'

  const deps: [Dependency,string,boolean,(v:boolean)=>void][] = [
    ['history',copy.history,history,setHistory],
    ['temperature',copy.temperature,temperature,setTemperature],
    ['internal',copy.internal,internal,setInternal],
    ['structure',copy.structure,structure,setStructure],
  ]

  return (
    <section className="module-view module-view-stacked">
      <div className="lesson-copy">
        <button className="text-button" onClick={onBack}>{copy.back}</button>
        <div className="lesson-index">C01</div>
        <h1>{copy.title}</h1>
        <p className="lead">{copy.lead}</p>

        <div className="concept-card">
          <span>{copy.key}</span>
          <strong>{copy.keyText}</strong>
        </div>

        <div className="definition">
          <div className="definition-label">{copy.general}</div>
          <div className="formula">{formula}</div>
          <p>{copy.generalText}</p>
        </div>

        <div className="definition">
          <div className="definition-label">{copy.state}</div>
          <p>{copy.stateText}</p>
        </div>

        <div className="warning-card kinematics-warning">
          <span>{copy.warning}</span>
          <strong>{copy.warningTitle}</strong>
          <p>{copy.warningText}</p>
        </div>

        <DepthNote label={copy.deepen}><p>{copy.deepenText}</p></DepthNote>
        <DepthNote label={copy.research} variant="research"><p>{copy.researchText}</p></DepthNote>

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

          <div className="constitutive-mode-switch weak-step-switch">
            {deps.map(([id,label,on,setOn])=>(
              <button
                key={id}
                className={on?'constitutive-mode-button active':'constitutive-mode-button'}
                onClick={()=>setOn(!on)}
              >
                {label}
              </button>
            ))}
          </div>

          <svg className="balance-scene" viewBox="0 0 100 72" role="img">
            <rect x="5" y="6" width="90" height="60" rx="9" fill="#111318"/>
            <line x1="15" y1="51" x2="86" y2="51" stroke="#505764" strokeWidth=".7"/>
            <rect x="20" y={51-Math.max(2,Math.min(28,12+10*data.base))} width="16" height={Math.max(2,Math.min(28,12+10*data.base))} rx="2" fill="rgba(40,100,255,.48)"/>
            <rect x="43" y={51-Math.max(2,Math.min(28,12+10*data.extra))} width="16" height={Math.max(2,Math.min(28,12+10*data.extra))} rx="2" fill="rgba(221,122,43,.42)"/>
            <rect x="66" y={51-Math.max(2,Math.min(32,12+10*data.stress))} width="16" height={Math.max(2,Math.min(32,12+10*data.stress))} rx="2" fill="rgba(169,227,210,.52)"/>
            <text x="19" y="60" fill="#2864FF" fontSize="2.2">{copy.base}</text>
            <text x="41" y="60" fill="#DD7A2B" fontSize="2.2">{copy.extra}</text>
            <text x="65" y="60" fill="#A9E3D2" fontSize="2.2">{copy.stress}</text>
          </svg>

          <div className="control-stack">
            <label><span>{copy.strain} <strong>{fmt(strain,2)}</strong></span><input type="range" min="-.5" max=".5" step=".01" value={strain} onChange={e=>setStrain(Number(e.target.value))}/></label>
            {history && <label><span>{copy.historyAmp} <strong>{fmt(h,2)}</strong></span><input type="range" min="-.5" max=".5" step=".01" value={h} onChange={e=>setH(Number(e.target.value))}/></label>}
            {temperature && <label><span>{copy.deltaT} <strong>{fmt(dT,0)}</strong></span><input type="range" min="-30" max="30" step="1" value={dT} onChange={e=>setDT(Number(e.target.value))}/></label>}
            {internal && <label><span>{copy.alpha} <strong>{fmt(alpha,2)}</strong></span><input type="range" min="0" max=".6" step=".01" value={alpha} onChange={e=>setAlpha(Number(e.target.value))}/></label>}
            {structure && <label><span>{copy.angle} <strong>{fmt(angle,0)}°</strong></span><input type="range" min="0" max="90" step="1" value={angle} onChange={e=>setAngle(Number(e.target.value))}/></label>}
          </div>

          <div className="transport-metrics">
            <div><span>{copy.base}</span><strong>{fmt(data.base)}</strong></div>
            <div><span>{copy.extra}</span><strong>{fmt(data.extra)}</strong></div>
            <div><span>{copy.stress}</span><strong>{fmt(data.stress)}</strong></div>
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
