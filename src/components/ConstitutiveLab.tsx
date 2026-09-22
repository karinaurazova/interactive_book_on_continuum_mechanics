import { useMemo, useState } from 'react'
import type { Language, NotationMode } from '../i18n'
import { DepthNote } from './DepthNote'

type Props = {
  notation: NotationMode
  language: Language
  onBack: () => void
}

type Mode = 'linear' | 'nonlinear' | 'visco' | 'fiber'

const text = {
  ru: {
    back:'← C09',
    title:'Конститутивная лаборатория: сравнение моделей на одной сцене',
    lead:'Сравним несколько редуцированных одномерных моделей при одинаковом протоколе деформации. Это не замена полной 3D-теории, а лаборатория для понимания того, какой механизм меняет форму отклика.',
    key:'ОДИН ПРОТОКОЛ — РАЗНЫЕ КОНСТИТУТИВНЫЕ МЕХАНИЗМЫ',
    keyText:'Меняя модель при тех же ε и ε̇, можно увидеть вклад нелинейности, скорости и структурного направления.',
    reduced:'Редуцированные модели',
    reducedText:'В лаборатории используются простые скалярные аналоги: σ = Eε; σ = Eε + aε³; σ = Eε + ηε̇; и направленный волоконный вклад.',
    interpretation:'Что сравнивать',
    interpretationText:'Смотри не только на текущее напряжение, но и на чувствительность к ε, ε̇ и углу структуры.',
    linear:'линейная',
    nonlinear:'нелинейная',
    visco:'Кельвин–Фойгт',
    fiber:'волоконная',
    strain:'деформация ε',
    rate:'скорость ε̇',
    E:'жёсткость E',
    a:'нелинейность a',
    eta:'вязкость η',
    Ef:'жёсткость волокон E_f',
    angle:'угол θ',
    stress:'напряжение σ',
    tangent:'касательная жёсткость dσ/dε',
    viscousPart:'вязкий вклад',
    fiberPart:'волоконный вклад',
    sceneKicker:'КОНСТИТУТИВНЫЙ СТЕНД',
    sceneTitle:'переключай модель и сравни отклик при одном протоколе',
    warning:'ВАЖНО',
    warningTitle:'Эти скалярные формулы — учебные суррогаты, а не полноценные 3D-модели мягких тканей.',
    warningText:'Полные конечнодеформационные модели требуют объективных тензорных мер, корректной энергии и согласования с термодинамикой.',
    question:'ВОПРОС ДЛЯ ПРОВЕРКИ',
    questionTitle:'Как отличить нелинейность от вязкости по эксперименту?',
    questionText:'Нужно варьировать скорость и протокол нагружения: чистая нелинейная упругость зависит от состояния, а вязкий вклад — от скорости и истории.',
    conclusion:'ВЫВОД',
    conclusionTitle:'Форма конститутивного отклика кодирует физический механизм модели.',
    conclusionText:'Следующий модуль — итоговая самопроверка всей главы.',
    deepen:'Углубиться',
    deepenText:'Для нелинейной упругости касательная жёсткость зависит от состояния: dσ/dε = E + 3aε². Для Кельвина–Фойгта при фиксированном ε изменение ε̇ меняет σ через ηε̇, но не меняет упругую часть Eε.',
    research:'Исследовательское замечание',
    researchText:'В реальной идентификации моделей одного одноосного теста часто недостаточно. Для мягких тканей используют многоосные протоколы, разные скорости, релаксацию/ползучесть и структурную информацию, чтобы разделить конкурирующие механизмы.',
    interactive:'ИНТЕРАКТИВНО',
  },
  en: {
    back:'← C09',
    title:'Constitutive laboratory: compare models on one scene',
    lead:'We compare several reduced one-dimensional models under the same strain protocol. This is not a replacement for full 3D theory, but a lab for understanding which mechanism changes the response.',
    key:'ONE PROTOCOL — DIFFERENT CONSTITUTIVE MECHANISMS',
    keyText:'At the same ε and ε̇, switching the model reveals effects of nonlinearity, rate dependence, and structural direction.',
    reduced:'Reduced models',
    reducedText:'The lab uses scalar analogues: σ = Eε; σ = Eε + aε³; σ = Eε + ηε̇; and a directional fiber contribution.',
    interpretation:'What to compare',
    interpretationText:'Inspect not only current stress but also sensitivity to ε, ε̇, and structural angle.',
    linear:'linear',
    nonlinear:'nonlinear',
    visco:'Kelvin–Voigt',
    fiber:'fiber',
    strain:'strain ε',
    rate:'rate ε̇',
    E:'stiffness E',
    a:'nonlinearity a',
    eta:'viscosity η',
    Ef:'fiber stiffness E_f',
    angle:'angle θ',
    stress:'stress σ',
    tangent:'tangent stiffness dσ/dε',
    viscousPart:'viscous contribution',
    fiberPart:'fiber contribution',
    sceneKicker:'CONSTITUTIVE BENCH',
    sceneTitle:'switch models and compare response under one protocol',
    warning:'IMPORTANT',
    warningTitle:'These scalar formulas are teaching surrogates, not full 3D soft-tissue models.',
    warningText:'Full finite-strain models require objective tensor measures, proper energy functions, and thermodynamic consistency.',
    question:'CHECKPOINT',
    questionTitle:'How can nonlinearity be distinguished from viscosity experimentally?',
    questionText:'Vary loading rate and protocol: purely nonlinear elasticity depends on state, while viscous response depends on rate and history.',
    conclusion:'CONCLUSION',
    conclusionTitle:'The shape of a constitutive response encodes the mechanism represented by the model.',
    conclusionText:'Next comes the final self-check for the whole chapter.',
    deepen:'Go deeper',
    deepenText:'For nonlinear elasticity the tangent stiffness is state-dependent: dσ/dε = E + 3aε². For Kelvin–Voigt, changing ε̇ at fixed ε changes stress through ηε̇ while leaving the elastic part Eε unchanged.',
    research:'Research note',
    researchText:'In model identification, one uniaxial test is often insufficient. Soft-tissue studies use multiaxial protocols, multiple rates, relaxation/creep, and structural information to separate competing mechanisms.',
    interactive:'INTERACTIVE',
  }
} as const

function fmt(v:number,d=3){ return (Math.abs(v)<1e-12?0:v).toFixed(d) }

export function ConstitutiveLab({notation,language,onBack}:Props){
  const copy=text[language]
  const [mode,setMode]=useState<Mode>('linear')
  const [eps,setEps]=useState(.20)
  const [rate,setRate]=useState(.15)
  const [E,setE]=useState(1.5)
  const [a,setA]=useState(8)
  const [eta,setEta]=useState(.6)
  const [Ef,setEf]=useState(2.5)
  const [angle,setAngle]=useState(25)

  const data=useMemo(()=>{
    const elastic=E*eps
    if(mode==='linear') return {stress:elastic,tangent:E,viscous:0,fiber:0}
    if(mode==='nonlinear') return {stress:elastic+a*eps**3,tangent:E+3*a*eps**2,viscous:0,fiber:0}
    if(mode==='visco') return {stress:elastic+eta*rate,tangent:E,viscous:eta*rate,fiber:0}
    const c=Math.cos(angle*Math.PI/180)
    const fiber=Ef*Math.max(eps,0)*c**4
    return {stress:elastic+fiber,tangent:E+(eps>0?Ef*c**4:0),viscous:0,fiber}
  },[mode,eps,rate,E,a,eta,Ef,angle])

  const formula =
    mode==='linear' ? 'σ = Eε' :
    mode==='nonlinear' ? 'σ = Eε + aε³' :
    mode==='visco' ? 'σ = Eε + ηε̇' :
    'σ = Eε + E_f ⟨ε⟩_+ cos⁴θ'

  const modes:[Mode,string][]=[
    ['linear',copy.linear],['nonlinear',copy.nonlinear],['visco',copy.visco],['fiber',copy.fiber]
  ]

  const curvePoints=useMemo(()=>{
    const pts=[]
    for(let i=0;i<=50;i++){
      const e=-.35+i*(.7/50)
      let s=E*e
      if(mode==='nonlinear') s+=a*e**3
      if(mode==='visco') s+=eta*rate
      if(mode==='fiber'){
        const c=Math.cos(angle*Math.PI/180)
        s+=Ef*Math.max(e,0)*c**4
      }
      const x=12+(e+.35)/.7*76
      const y=52-s*10
      pts.push(x+','+Math.max(12,Math.min(58,y)))
    }
    return pts.join(' ')
  },[mode,E,a,eta,rate,Ef,angle])

  return (
    <section className="module-view module-view-stacked">
      <div className="lesson-copy">
        <button className="text-button" onClick={onBack}>{copy.back}</button>
        <div className="lesson-index">C10</div>
        <h1>{copy.title}</h1>
        <p className="lead">{copy.lead}</p>

        <div className="concept-card">
          <span>{copy.key}</span>
          <strong>{copy.keyText}</strong>
        </div>

        <div className="definition">
          <div className="definition-label">{copy.reduced}</div>
          <div className="formula">{formula}</div>
          <p>{copy.reducedText}</p>
        </div>

        <div className="definition">
          <div className="definition-label">{copy.interpretation}</div>
          <p>{copy.interpretationText}</p>
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

          <div className="constitutive-mode-switch constitutive-mode-switch-dark weak-step-switch">
            {modes.map(([id,label])=>(
              <button key={id} className={mode===id?'constitutive-mode-button active':'constitutive-mode-button'} onClick={()=>setMode(id)}>{label}</button>
            ))}
          </div>

          <svg className="balance-scene" viewBox="0 0 100 70" role="img">
            <rect x="5" y="6" width="90" height="58" rx="9" fill="#111318"/>
            <line x1="12" y1="52" x2="88" y2="52" stroke="#505764" strokeWidth=".7"/>
            <line x1="50" y1="12" x2="50" y2="60" stroke="#505764" strokeWidth=".7"/>
            <polyline points={curvePoints} fill="none" stroke="#A9E3D2" strokeWidth="1.4"/>
            <circle cx={12+(eps+.35)/.7*76} cy={Math.max(12,Math.min(58,52-data.stress*10))} r="2.2" fill="#2864FF"/>
            <text x="13" y="16" fill="#F4F2EC" fontSize="2.3">σ = {fmt(data.stress)}</text>
          </svg>

          <div className="control-stack">
            <label><span>{copy.strain} <strong>{fmt(eps,3)}</strong></span><input type="range" min="-.35" max=".35" step=".005" value={eps} onChange={e=>setEps(Number(e.target.value))}/></label>
            <label><span>{copy.E} <strong>{fmt(E,2)}</strong></span><input type="range" min=".2" max="3" step=".01" value={E} onChange={e=>setE(Number(e.target.value))}/></label>
            {mode==='nonlinear' && <label><span>{copy.a} <strong>{fmt(a,1)}</strong></span><input type="range" min="0" max="20" step=".1" value={a} onChange={e=>setA(Number(e.target.value))}/></label>}
            {mode==='visco' && <>
              <label><span>{copy.rate} <strong>{fmt(rate,3)}</strong></span><input type="range" min="-.5" max=".5" step=".01" value={rate} onChange={e=>setRate(Number(e.target.value))}/></label>
              <label><span>{copy.eta} <strong>{fmt(eta,2)}</strong></span><input type="range" min="0" max="2" step=".01" value={eta} onChange={e=>setEta(Number(e.target.value))}/></label>
            </>}
            {mode==='fiber' && <>
              <label><span>{copy.Ef} <strong>{fmt(Ef,2)}</strong></span><input type="range" min=".2" max="5" step=".01" value={Ef} onChange={e=>setEf(Number(e.target.value))}/></label>
              <label><span>{copy.angle} <strong>{fmt(angle,0)}°</strong></span><input type="range" min="0" max="90" step="1" value={angle} onChange={e=>setAngle(Number(e.target.value))}/></label>
            </>}
          </div>

          <div className="transport-metrics">
            <div><span>{copy.stress}</span><strong>{fmt(data.stress)}</strong></div>
            <div><span>{copy.tangent}</span><strong>{fmt(data.tangent)}</strong></div>
            <div><span>{copy.viscousPart}</span><strong>{fmt(data.viscous)}</strong></div>
            <div><span>{copy.fiberPart}</span><strong>{fmt(data.fiber)}</strong></div>
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
