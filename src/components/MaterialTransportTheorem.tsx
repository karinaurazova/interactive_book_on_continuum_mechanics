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
    back:'← T06',
    title:'Транспортная теорема для материальной области',
    lead:'Когда область сама движется и деформируется вместе с континуумом, производная интеграла зависит не только от изменения поля внутри неё, но и от изменения самого элемента объёма.',
    key:'ПРОИЗВОДНАЯ ИНТЕГРАЛА ПО ДВИЖУЩЕЙСЯ ОБЛАСТИ',
    keyText:'Для материальной области Ωₜ: d/dt ∫Ωₜ φ dv = ∫Ωₜ (Dφ/Dt + φ ∇·v) dv.',
    first:'Первый вклад',
    firstText:'Dφ/Dt описывает изменение самой величины φ, которое испытывает движущаяся частица.',
    second:'Второй вклад',
    secondText:'φ ∇·v возникает из изменения локального элемента объёма: для материального элемента D(dv)/Dt = (∇·v) dv.',
    reference:'Референсная область Ω₀',
    current:'Материальная область Ωₜ',
    sceneKicker:'ТРАНСПОРТНАЯ ТЕОРЕМА',
    sceneTitle:'сравни прямую производную интеграла и сумму двух локальных вкладов',
    time:'время t',
    volumeRate:'скорость расширения κ',
    fieldRate:'скорость изменения поля q',
    fieldGradient:'градиент поля c',
    integral:'∫Ωₜ φ dv',
    direct:'d/dt напрямую',
    materialTerm:'∫ Dφ/Dt dv',
    volumeTerm:'∫ φ ∇·v dv',
    rhs:'сумма правой части',
    error:'ошибка',
    warning:'ВАЖНО',
    warningTitle:'Эта формула записана для материальной области.',
    warningText:'Граница Ωₜ движется вместе с частицами континуума. Для фиксированного или произвольно движущегося контрольного объёма появится отдельный поток через границу.',
    question:'ВОПРОС ДЛЯ ПРОВЕРКИ',
    questionTitle:'Что останется, если φ = 1?',
    questionText:'Получим d|Ωₜ|/dt = ∫Ωₜ ∇·v dv — интегральную версию связи между дивергенцией скорости и изменением объёма.',
    conclusion:'ВЫВОД',
    conclusionTitle:'Транспортная теорема переносит локальную кинематику на интегральные величины.',
    conclusionText:'Именно она станет мостом к законам сохранения массы, импульса и энергии.',
    interactive:'ИНТЕРАКТИВНО',
    next:'Перейти к контрольному объёму →',
  },
  en: {
    back:'← T06',
    title:'Transport theorem for a material region',
    lead:'When a region moves and deforms with the continuum, the derivative of an integral depends both on the change of the field inside it and on the change of the volume element itself.',
    key:'DERIVATIVE OF AN INTEGRAL OVER A MOVING REGION',
    keyText:'For a material region Ωₜ: d/dt ∫Ωₜ φ dv = ∫Ωₜ (Dφ/Dt + φ ∇·v) dv.',
    first:'First contribution',
    firstText:'Dφ/Dt describes the change of φ experienced by moving material particles.',
    second:'Second contribution',
    secondText:'φ ∇·v comes from the change of the local volume element: for a material volume element, D(dv)/Dt = (∇·v) dv.',
    reference:'Reference region Ω₀',
    current:'Material region Ωₜ',
    sceneKicker:'TRANSPORT THEOREM',
    sceneTitle:'compare the direct integral derivative with the two local contributions',
    time:'time t',
    volumeRate:'expansion rate κ',
    fieldRate:'field rate q',
    fieldGradient:'field gradient c',
    integral:'∫Ωₜ φ dv',
    direct:'direct d/dt',
    materialTerm:'∫ Dφ/Dt dv',
    volumeTerm:'∫ φ ∇·v dv',
    rhs:'right-hand-side sum',
    error:'error',
    warning:'IMPORTANT',
    warningTitle:'This form is written for a material region.',
    warningText:'The boundary of Ωₜ moves with continuum particles. A fixed or independently moving control volume requires an explicit boundary-flux term.',
    question:'CHECKPOINT',
    questionTitle:'What remains if φ = 1?',
    questionText:'We obtain d|Ωₜ|/dt = ∫Ωₜ ∇·v dv, the integral version of the relation between velocity divergence and volume change.',
    conclusion:'CONCLUSION',
    conclusionTitle:'The transport theorem lifts local kinematics to integral quantities.',
    conclusionText:'It becomes the bridge to conservation of mass, momentum, and energy.',
    interactive:'INTERACTIVE',
    next:'Continue to the control volume →',
  }
} as const

function fmt(v:number,d=4){
  return (Math.abs(v)<1e-10?0:v).toFixed(d)
}

export function MaterialTransportTheorem({notation,language,onBack,onNext}:Props){
  const copy=text[language]
  const [time,setTime]=useState(0.45)
  const [kappa,setKappa]=useState(0.35)
  const [q,setQ]=useState(0.30)
  const [c,setC]=useState(0.45)

  const data=useMemo(()=>{
    // 1D material interval X in [0,1], x = a(t) X, a = exp(kappa t)
    const a=Math.exp(kappa*time)
    const adot=kappa*a

    // spatial scalar field phi(x,t) = 1 + q t + c x
    // Integral over current material interval x in [0,a]
    const integral=a*(1+q*time)+0.5*c*a*a

    // exact time derivative
    const direct=
      adot*(1+q*time)+a*q+c*a*adot

    // velocity v = kappa x, div v = kappa
    // Dphi/Dt = q + v*dphi/dx = q + kappa*c*x
    const materialTerm=
      q*a + 0.5*kappa*c*a*a

    const volumeTerm=
      kappa*(a*(1+q*time)+0.5*c*a*a)

    const rhs=materialTerm+volumeTerm

    return {a,adot,integral,direct,materialTerm,volumeTerm,rhs}
  },[time,kappa,q,c])

  const notationLine =
    notation==='Index'
      ? 'd/dt ∫Ωₜ φ dv = ∫Ωₜ (Dφ/Dt + φ ∂vᵢ/∂xᵢ) dv'
      : notation==='Matrix'
      ? 'd/dt ∫Ωₜ φ dv = ∫Ωₜ (Dφ/Dt + φ ∇·v) dv'
      : notation==='Python'
      ? 'dI_dt = integral(DphiDt + phi * div_v, Omega_t)'
      : 'd/dt ∫Ωₜ φ dv = ∫Ωₜ (Dφ/Dt + φ ∇·𝐯) dv'

  const refX=18, refW=24
  const curX=58, curW=Math.min(30,24*data.a)

  return (
    <section className="module-view module-view-stacked">
      <div className="lesson-copy">
        <button className="text-button" onClick={onBack}>{copy.back}</button>
        <div className="lesson-index">T07 / 11</div>
        <h1>{copy.title}</h1>
        <p className="lead">{copy.lead}</p>

        <div className="concept-card">
          <span>{copy.key}</span>
          <strong>{copy.keyText}</strong>
        </div>

        <div className="definition">
          <div className="definition-label">{copy.first}</div>
          <div className="formula">{notationLine}</div>
          <p>{copy.firstText}</p>
        </div>

        <div className="definition">
          <div className="definition-label">{copy.second}</div>
          <p>{copy.secondText}</p>
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

          <svg className="transport-scene" viewBox="0 0 100 66" role="img">
            <rect x="5" y="6" width="90" height="54" rx="9" fill="#111318"/>

            <text x="12" y="15" fill="#8E96A3" fontSize="2.7">{copy.reference}</text>
            <text x="55" y="15" fill="#8E96A3" fontSize="2.7">{copy.current}</text>

            <rect x={refX} y="27" width={refW} height="14" rx="2" fill="rgba(244,242,236,.04)" stroke="#69717C" strokeWidth=".8"/>
            <rect x={curX} y="27" width={curW} height="14" rx="2" fill="rgba(40,100,255,.10)" stroke="#2864FF" strokeWidth=".9"/>

            <line x1={refX} y1="45" x2={refX+refW} y2="45" stroke="#A9E3D2" strokeWidth=".8"/>
            <line x1={curX} y1="45" x2={curX+curW} y2="45" stroke="#A9E3D2" strokeWidth=".8"/>

            <text x={refX+4} y="54" fill="#8E96A3" fontSize="2.5">|Ω₀| = 1</text>
            <text x={curX+2} y="54" fill="#A9E3D2" fontSize="2.5">|Ωₜ| = {fmt(data.a,2)}</text>
          </svg>

          <div className="control-stack">
            <label><span>{copy.time} <strong>{fmt(time,2)}</strong></span><input type="range" min="0" max="1.2" step=".01" value={time} onChange={e=>setTime(Number(e.target.value))}/></label>
            <label><span>{copy.volumeRate} <strong>{fmt(kappa,2)}</strong></span><input type="range" min="-.65" max=".65" step=".01" value={kappa} onChange={e=>setKappa(Number(e.target.value))}/></label>
            <label><span>{copy.fieldRate} <strong>{fmt(q,2)}</strong></span><input type="range" min="-.8" max=".8" step=".01" value={q} onChange={e=>setQ(Number(e.target.value))}/></label>
            <label><span>{copy.fieldGradient} <strong>{fmt(c,2)}</strong></span><input type="range" min="-.9" max=".9" step=".01" value={c} onChange={e=>setC(Number(e.target.value))}/></label>
          </div>

          <div className="transport-metrics">
            <div><span>{copy.integral}</span><strong>{fmt(data.integral)}</strong></div>
            <div><span>{copy.direct}</span><strong>{fmt(data.direct)}</strong></div>
            <div><span>{copy.materialTerm}</span><strong>{fmt(data.materialTerm)}</strong></div>
            <div><span>{copy.volumeTerm}</span><strong>{fmt(data.volumeTerm)}</strong></div>
            <div><span>{copy.rhs}</span><strong>{fmt(data.rhs)}</strong></div>
            <div><span>{copy.error}</span><strong>{fmt(Math.abs(data.direct-data.rhs),7)}</strong></div>
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
