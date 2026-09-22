import { useMemo, useState } from 'react'
import type { Language, NotationMode } from '../i18n'
import { DepthNote } from './DepthNote'

type Props = {
  notation: NotationMode
  language: Language
  onBack: () => void
}

const text = {
  ru: {
    back:'← B00',
    title:'Баланс массы и уравнение неразрывности',
    lead:'Масса материальной области не создаётся и не исчезает. Если область расширяется, плотность должна уменьшаться; если сжимается — увеличиваться.',
    key:'МАССА МАТЕРИАЛЬНОЙ ОБЛАСТИ ПОСТОЯННА',
    keyText:'Для любой материальной области Ωₜ выполняется d/dt ∫Ωₜ ρ dv = 0.',
    local:'Локальная форма',
    localText:'После применения транспортной теоремы получаем Dρ/Dt + ρ ∇·v = 0.',
    spatial:'Пространственная форма',
    spatialText:'Эквивалентная запись через частную производную и поток массы: ∂ρ/∂t + ∇·(ρv) = 0.',
    jacobian:'Связь с якобианом',
    jacobianText:'Для материального элемента масса сохраняется как ρ J = ρ₀, если J отсчитывается от референсной конфигурации.',
    sceneKicker:'СОХРАНЕНИЕ МАССЫ',
    sceneTitle:'меняй скорость расширения и наблюдай, как плотность компенсирует изменение объёма',
    time:'время t',
    divergence:'дивергенция κ',
    rho0:'начальная плотность ρ₀',
    J:'J',
    rho:'ρ',
    materialRate:'Dρ/Dt',
    continuity:'Dρ/Dt + ρ κ',
    mass:'масса элемента ρJ',
    warning:'ВАЖНО',
    warningTitle:'Несжимаемость не означает постоянную плотность во всех возможных моделях автоматически.',
    warningText:'Для классической однокомпонентной среды без источников массы условие ∇·v = 0 вместе с балансом массы даёт Dρ/Dt = 0. Но в смесях, реакциях или моделях с источниками массы появляются дополнительные члены.',
    question:'ВОПРОС ДЛЯ ПРОВЕРКИ',
    questionTitle:'Что произойдёт с плотностью при положительной дивергенции скорости?',
    questionText:'Материальный элемент локально расширяется, поэтому при сохранении массы его плотность уменьшается.',
    conclusion:'ВЫВОД',
    conclusionTitle:'Уравнение неразрывности — это локальная форма сохранения массы.',
    conclusionText:'Следующий шаг — линейный импульс: к накоплению и потоку добавятся массовые и поверхностные силы.',
    deepen:'Углубиться',
    deepenText:'Из ρJ = ρ₀ следует D(ρJ)/Dt = 0. Используя J̇ = J ∇·v, получаем J[Dρ/Dt + ρ∇·v] = 0, а при J > 0 — локальное уравнение неразрывности.',
    research:'Исследовательское замечание',
    researchText:'В теориях смесей и роста баланс массы записывается отдельно для компонентов и может содержать источники. Тогда правая часть уравнения неразрывности не равна нулю и отражает химические реакции, обмен между фазами или массовое накопление.',
    interactive:'ИНТЕРАКТИВНО',
  },
  en: {
    back:'← B00',
    title:'Mass balance and the continuity equation',
    lead:'Mass of a material region is neither created nor destroyed. If the region expands, density must decrease; if it contracts, density must increase.',
    key:'MASS OF A MATERIAL REGION IS CONSTANT',
    keyText:'For every material region Ωₜ, d/dt ∫Ωₜ ρ dv = 0.',
    local:'Local form',
    localText:'Applying the transport theorem gives Dρ/Dt + ρ ∇·v = 0.',
    spatial:'Spatial form',
    spatialText:'Equivalently, using a partial time derivative and mass flux: ∂ρ/∂t + ∇·(ρv) = 0.',
    jacobian:'Connection to the Jacobian',
    jacobianText:'For a material element, mass conservation implies ρ J = ρ₀ when J is measured from the reference configuration.',
    sceneKicker:'MASS CONSERVATION',
    sceneTitle:'change the expansion rate and watch density compensate for volume change',
    time:'time t',
    divergence:'divergence κ',
    rho0:'initial density ρ₀',
    J:'J',
    rho:'ρ',
    materialRate:'Dρ/Dt',
    continuity:'Dρ/Dt + ρ κ',
    mass:'element mass ρJ',
    warning:'IMPORTANT',
    warningTitle:'Incompressibility does not automatically mean constant density in every possible model.',
    warningText:'For a classical single-constituent medium without mass sources, ∇·v = 0 together with mass balance gives Dρ/Dt = 0. Mixtures, reactions, or source terms modify this relation.',
    question:'CHECKPOINT',
    questionTitle:'What happens to density when velocity divergence is positive?',
    questionText:'The material element expands locally, so its density decreases while mass remains constant.',
    conclusion:'CONCLUSION',
    conclusionTitle:'The continuity equation is the local form of mass conservation.',
    conclusionText:'Next we move to linear momentum, where body and surface forces enter the balance.',
    deepen:'Go deeper',
    deepenText:'From ρJ = ρ₀ we have D(ρJ)/Dt = 0. Using J̇ = J∇·v gives J[Dρ/Dt + ρ∇·v] = 0 and, for J > 0, the local continuity equation.',
    research:'Research note',
    researchText:'In mixture and growth theories, mass balance is written for each constituent and may include source terms. The right-hand side of the continuity equation can then represent reactions, phase exchange, or mass deposition.',
    interactive:'INTERACTIVE',
  }
} as const

function fmt(v:number,d=4){
  return (Math.abs(v)<1e-10?0:v).toFixed(d)
}

export function MassBalance({notation,language,onBack}:Props){
  const copy=text[language]
  const [time,setTime]=useState(0.65)
  const [kappa,setKappa]=useState(0.35)
  const [rho0,setRho0]=useState(1.00)

  const data=useMemo(()=>{
    const J=Math.exp(kappa*time)
    const rho=rho0/J
    const DrhoDt=-kappa*rho
    const residual=DrhoDt+rho*kappa
    const mass=rho*J
    return {J,rho,DrhoDt,residual,mass}
  },[time,kappa,rho0])

  const notationLine =
    notation==='Index' ? '∂ρ/∂t + ∂(ρvᵢ)/∂xᵢ = 0' :
    notation==='Matrix' ? '∂ρ/∂t + ∇·(ρv) = 0' :
    notation==='Python' ? 'drho_dt + div(rho * v) = 0' :
    '∂ρ/∂t + ∇·(ρ𝐯) = 0'

  const materialLine =
    notation==='Index' ? 'Dρ/Dt + ρ ∂vᵢ/∂xᵢ = 0' :
    notation==='Python' ? 'DrhoDt + rho * div_v = 0' :
    'Dρ/Dt + ρ ∇·𝐯 = 0'

  const refW=26
  const currentW=Math.max(10,Math.min(52,refW*data.J))
  const densityOpacity=Math.max(.10,Math.min(.62,.16+.32*data.rho/rho0))

  return (
    <section className="module-view module-view-stacked">
      <div className="lesson-copy">
        <button className="text-button" onClick={onBack}>{copy.back}</button>
        <div className="lesson-index">B01 / 10</div>
        <h1>{copy.title}</h1>
        <p className="lead">{copy.lead}</p>

        <div className="concept-card">
          <span>{copy.key}</span>
          <strong>{copy.keyText}</strong>
        </div>

        <div className="definition">
          <div className="definition-label">{copy.local}</div>
          <div className="formula">{materialLine}</div>
          <p>{copy.localText}</p>
        </div>

        <div className="definition">
          <div className="definition-label">{copy.spatial}</div>
          <div className="formula">{notationLine}</div>
          <p>{copy.spatialText}</p>
        </div>

        <div className="definition">
          <div className="definition-label">{copy.jacobian}</div>
          <div className="formula">ρ J = ρ₀</div>
          <p>{copy.jacobianText}</p>
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

          <svg className="balance-scene" viewBox="0 0 100 68" role="img">
            <rect x="5" y="6" width="90" height="56" rx="9" fill="#111318"/>
            <text x="16" y="15" fill="#8E96A3" fontSize="2.6">Ω₀</text>
            <text x="62" y="15" fill="#8E96A3" fontSize="2.6">Ωₜ</text>

            <rect x="14" y="25" width={refW} height="18" rx="2" fill="rgba(244,242,236,.06)" stroke="#69717C" strokeWidth=".8"/>
            <rect x="58" y="25" width={currentW} height="18" rx="2" fill={`rgba(169,227,210,${densityOpacity})`} stroke="#A9E3D2" strokeWidth=".9"/>

            <text x="16" y="50" fill="#8E96A3" fontSize="2.4">ρ₀ = {fmt(rho0,2)}</text>
            <text x="60" y="50" fill="#A9E3D2" fontSize="2.4">ρ = {fmt(data.rho,2)}</text>
          </svg>

          <div className="control-stack">
            <label><span>{copy.time} <strong>{fmt(time,2)}</strong></span><input type="range" min="0" max="1.4" step=".01" value={time} onChange={e=>setTime(Number(e.target.value))}/></label>
            <label><span>{copy.divergence} <strong>{fmt(kappa,2)}</strong></span><input type="range" min="-.7" max=".7" step=".01" value={kappa} onChange={e=>setKappa(Number(e.target.value))}/></label>
            <label><span>{copy.rho0} <strong>{fmt(rho0,2)}</strong></span><input type="range" min=".4" max="1.8" step=".01" value={rho0} onChange={e=>setRho0(Number(e.target.value))}/></label>
          </div>

          <div className="transport-metrics">
            <div><span>{copy.J}</span><strong>{fmt(data.J)}</strong></div>
            <div><span>{copy.rho}</span><strong>{fmt(data.rho)}</strong></div>
            <div><span>{copy.materialRate}</span><strong>{fmt(data.DrhoDt)}</strong></div>
            <div><span>{copy.continuity}</span><strong>{fmt(data.residual,7)}</strong></div>
            <div><span>{copy.mass}</span><strong>{fmt(data.mass)}</strong></div>
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
