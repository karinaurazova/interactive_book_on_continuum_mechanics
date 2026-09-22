import { useMemo, useState } from 'react'
import type { Language, NotationMode } from '../i18n'
import { DepthNote } from './DepthNote'

type Props = {
  notation: NotationMode
  language: Language
  onBack: () => void
  onNext: () => void
}

type Mode = 'exact' | 'near'

const text = {
  ru: {
    back:'← C07',
    title:'Несжимаемость и почти несжимаемые материалы',
    lead:'Точная несжимаемость и почти несжимаемость — не одно и то же. В первом случае J = 1 является ограничением, во втором объёмные изменения допускаются, но сильно штрафуются большим K.',
    key:'J = 1 — ОГРАНИЧЕНИЕ, А БОЛЬШОЙ K — ШТРАФ',
    keyText:'Точно несжимаемый материал требует отдельного давления p, которое обеспечивает выполнение J = 1.',
    exact:'точно несжимаемый',
    near:'почти несжимаемый',
    exactTitle:'Точная несжимаемость',
    exactText:'Ограничение J = 1 вводится явно. Давление p не задаётся конститутивным законом как обычная функция деформации, а определяется из уравнений как множитель Лагранжа.',
    nearTitle:'Почти несжимаемость',
    nearText:'J может немного отличаться от 1. Большой, но конечный K делает такие отклонения энергетически дорогими.',
    sceneKicker:'J, K И ДАВЛЕНИЕ',
    sceneTitle:'сравни точное ограничение и штрафную почти несжимаемость',
    J:'якобиан J',
    K:'объёмный модуль K',
    pressure:'давление p',
    volEnergy:'объёмная энергия',
    constraint:'ошибка ограничения |J−1|',
    warning:'ВАЖНО',
    warningTitle:'Давление в несжимаемой модели — не то же самое, что среднее напряжение в произвольной сжимаемой модели.',
    warningText:'В точно несжимаемой постановке p выступает неопределённым множителем Лагранжа, который подстраивается так, чтобы обеспечить J = 1 вместе с уравнениями равновесия.',
    question:'ВОПРОС ДЛЯ ПРОВЕРКИ',
    questionTitle:'Почему нельзя просто поставить K = ∞ в обычной численной модели?',
    questionText:'Потому что это приводит к сингулярному пределу и численным проблемам. Для точной несжимаемости обычно используют смешанную постановку с отдельным полем давления.',
    conclusion:'ВЫВОД',
    conclusionTitle:'Точная и почти несжимаемая модели требуют разной математической постановки.',
    conclusionText:'Следующий шаг — понять, что ломается за пределами линейной упругости.',
    deepen:'Углубиться',
    deepenText:'Для точно несжимаемой гиперупругости часто пишут σ = −pI + σ_dev с ограничением J = 1. Для почти несжимаемой модели вводят объёмную энергию U(J), например U = (K/2)(J−1)², так что p_vol = dU/dJ.',
    research:'Исследовательское замечание',
    researchText:'В мягких тканях почти несжимаемость особенно важна из-за высокого содержания жидкости. В FEM это часто требует смешанных u–p элементов или других стабилизированных постановок, чтобы избежать объёмной блокировки.',
    interactive:'ИНТЕРАКТИВНО',
    next:'Перейти за пределы линейной упругости →',
  },
  en: {
    back:'← C07',
    title:'Incompressibility and nearly incompressible materials',
    lead:'Exact incompressibility and near incompressibility are not the same. In the first case J = 1 is a constraint; in the second, volume change is allowed but strongly penalized by a large K.',
    key:'J = 1 IS A CONSTRAINT, LARGE K IS A PENALTY',
    keyText:'An exactly incompressible material requires a pressure p that enforces J = 1.',
    exact:'exactly incompressible',
    near:'nearly incompressible',
    exactTitle:'Exact incompressibility',
    exactText:'The constraint J = 1 is imposed explicitly. Pressure p is not an ordinary constitutive function of deformation but is solved as a Lagrange multiplier.',
    nearTitle:'Near incompressibility',
    nearText:'J may differ slightly from 1. A large but finite K makes those deviations energetically expensive.',
    sceneKicker:'J, K, AND PRESSURE',
    sceneTitle:'compare exact constraint and penalty-based near incompressibility',
    J:'Jacobian J',
    K:'bulk modulus K',
    pressure:'pressure p',
    volEnergy:'volumetric energy',
    constraint:'constraint error |J−1|',
    warning:'IMPORTANT',
    warningTitle:'Pressure in an incompressible model is not simply the mean stress of an arbitrary compressible model.',
    warningText:'In an exactly incompressible formulation, p is an indeterminate Lagrange multiplier that adjusts to enforce J = 1 together with equilibrium.',
    question:'CHECKPOINT',
    questionTitle:'Why can we not simply set K = ∞ in an ordinary numerical model?',
    questionText:'Because that is a singular limit and causes numerical difficulties. Exact incompressibility is usually handled with a mixed formulation using pressure as an additional field.',
    conclusion:'CONCLUSION',
    conclusionTitle:'Exact and nearly incompressible models require different mathematical formulations.',
    conclusionText:'Next we ask what breaks down beyond linear elasticity.',
    deepen:'Go deeper',
    deepenText:'For exactly incompressible hyperelasticity one often writes σ = −pI + σ_dev with J = 1. For a nearly incompressible model one introduces a volumetric energy U(J), for example U = (K/2)(J−1)², with p_vol = dU/dJ.',
    research:'Research note',
    researchText:'Near incompressibility is especially important in soft tissues because of their high fluid content. FEM often uses mixed u–p elements or stabilized formulations to avoid volumetric locking.',
    interactive:'INTERACTIVE',
    next:'Continue beyond linear elasticity →',
  }
} as const

function fmt(v:number,d=4){ return (Math.abs(v)<1e-12?0:v).toFixed(d) }

export function IncompressibilityModes({notation,language,onBack,onNext}:Props){
  const copy=text[language]
  const [mode,setMode]=useState<Mode>('near')
  const [Jnear,setJnear]=useState(1.03)
  const [K,setK]=useState(25)
  const [p,setP]=useState(1.2)

  const data=useMemo(()=>{
    if(mode==='exact'){
      return {
        J:1,
        pressure:p,
        volEnergy:0,
        constraint:0,
      }
    }
    const dJ=Jnear-1
    const volEnergy=.5*K*dJ*dJ
    const pressure=K*dJ
    return {
      J:Jnear,
      pressure,
      volEnergy,
      constraint:Math.abs(dJ),
    }
  },[mode,Jnear,K,p])

  const formula =
    mode==='exact'
      ? notation==='Index' ? 'J = 1,   σᵢⱼ = −p δᵢⱼ + σᵈᵉᵛᵢⱼ'
      : notation==='Python' ? 'constraint = J - 1; sigma = -p * I + sigma_dev'
      : 'J = 1,   σ = −pI + σ_dev'
      : notation==='Index' ? 'U(J) = K/2 (J−1)²,   p_vol = K(J−1)'
      : notation==='Python' ? 'Uvol = 0.5 * K * (J - 1)**2; p_vol = K * (J - 1)'
      : 'U(J) = K/2 (J−1)²,   p_vol = K(J−1)'

  const cubeScale=Math.max(.75,Math.min(1.25,Math.pow(data.J,1/3)))
  const w=28*cubeScale
  const h=24*cubeScale
  const x=50-w/2
  const y=36-h/2

  return (
    <section className="module-view module-view-stacked">
      <div className="lesson-copy">
        <button className="text-button" onClick={onBack}>{copy.back}</button>
        <div className="lesson-index">C08</div>
        <h1>{copy.title}</h1>
        <p className="lead">{copy.lead}</p>

        <div className="concept-card">
          <span>{copy.key}</span>
          <strong>{copy.keyText}</strong>
        </div>

        <div className="definition">
          <div className="definition-label">{mode==='exact'?copy.exactTitle:copy.nearTitle}</div>
          <div className="formula">{formula}</div>
          <p>{mode==='exact'?copy.exactText:copy.nearText}</p>
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

          <div className="constitutive-mode-switch constitutive-mode-switch-dark">
            <button className={mode==='exact'?'constitutive-mode-button active':'constitutive-mode-button'} onClick={()=>setMode('exact')}>{copy.exact}</button>
            <button className={mode==='near'?'constitutive-mode-button active':'constitutive-mode-button'} onClick={()=>setMode('near')}>{copy.near}</button>
          </div>

          <svg className="balance-scene" viewBox="0 0 100 72" role="img">
            <rect x="5" y="6" width="90" height="60" rx="9" fill="#111318"/>
            <rect x={x} y={y} width={w} height={h} rx="3" fill="rgba(169,227,210,.12)" stroke="#A9E3D2" strokeWidth="1"/>
            <line x1="50" y1="18" x2="50" y2={y-3} stroke="#2864FF" strokeWidth="1.2"/>
            <line x1="50" y1={y+h+3} x2="50" y2="58" stroke="#2864FF" strokeWidth="1.2"/>
            <text x="12" y="17" fill="#F4F2EC" fontSize="2.4">J = {fmt(data.J,3)}</text>
            <text x="12" y="61" fill="#2864FF" fontSize="2.2">p = {fmt(data.pressure,3)}</text>
            <text x="67" y="61" fill="#A9E3D2" fontSize="2.2">|J−1| = {fmt(data.constraint,3)}</text>
          </svg>

          <div className="control-stack">
            {mode==='exact' ? (
              <label><span>{copy.pressure} <strong>{fmt(p,2)}</strong></span><input type="range" min="-4" max="4" step=".01" value={p} onChange={e=>setP(Number(e.target.value))}/></label>
            ) : (
              <>
                <label><span>{copy.J} <strong>{fmt(Jnear,3)}</strong></span><input type="range" min=".92" max="1.08" step=".001" value={Jnear} onChange={e=>setJnear(Number(e.target.value))}/></label>
                <label><span>{copy.K} <strong>{fmt(K,1)}</strong></span><input type="range" min="2" max="100" step="1" value={K} onChange={e=>setK(Number(e.target.value))}/></label>
              </>
            )}
          </div>

          <div className="transport-metrics">
            <div><span>{copy.J}</span><strong>{fmt(data.J)}</strong></div>
            <div><span>{copy.pressure}</span><strong>{fmt(data.pressure)}</strong></div>
            <div><span>{copy.volEnergy}</span><strong>{fmt(data.volEnergy)}</strong></div>
            <div><span>{copy.constraint}</span><strong>{fmt(data.constraint)}</strong></div>
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
