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
    back:'← B01',
    title:'Баланс линейного импульса и уравнение Коши',
    lead:'Изменение линейного импульса материальной области вызывают массовые и поверхностные силы. После перехода от поверхностной силы t = σn к объёмной форме через теорему Гаусса получаем локальное уравнение движения.',
    key:'СИЛЫ ОПРЕДЕЛЯЮТ УСКОРЕНИЕ',
    keyText:'Для классического континуума: ρa = ∇·σ + ρb.',
    integral:'Интегральная форма',
    integralText:'Производная импульса материальной области равна сумме поверхностных и массовых сил.',
    local:'Локальная форма',
    localText:'Поверхностный интеграл от σn преобразуется в объёмный интеграл от ∇·σ, после чего локализация даёт уравнение Коши.',
    sceneKicker:'ЛИНЕЙНЫЙ ИМПУЛЬС',
    sceneTitle:'меняй градиент напряжения и массовую силу и наблюдай результирующее ускорение',
    density:'плотность ρ',
    stressLeft:'σ слева',
    stressRight:'σ справа',
    bodyForce:'массовая сила b',
    stressGradient:'∂σ/∂x',
    surfaceForce:'результат поверхностных сил',
    bodyTerm:'ρb',
    acceleration:'ускорение a',
    residual:'проверка баланса',
    warning:'ВАЖНО',
    warningTitle:'∇·σ — не «градиент напряжения» в общем 3D-смысле.',
    warningText:'Дивергенция тензора напряжений — вектор с компонентами (∇·σ)ᵢ = ∂σᵢⱼ/∂xⱼ. В одномерной сцене она действительно сводится к ∂σ/∂x.',
    question:'ВОПРОС ДЛЯ ПРОВЕРКИ',
    questionTitle:'Что будет, если поверхностные и массовые силы точно компенсируют друг друга?',
    questionText:'Ускорение станет нулевым, хотя напряжение и массовая сила по отдельности могут быть ненулевыми.',
    conclusion:'ВЫВОД',
    conclusionTitle:'Уравнение Коши связывает локальное ускорение с дивергенцией напряжений и массовыми силами.',
    conclusionText:'Следующий шаг — баланс момента импульса и вопрос о симметрии тензора напряжений.',
    deepen:'Углубиться',
    deepenText:'Для материальной области Ωₜ: d/dt ∫Ωₜ ρv dv = ∫∂Ωₜ σn da + ∫Ωₜ ρb dv. Используя баланс массы, транспортную теорему и теорему Гаусса, получаем ∫Ωₜ [ρDv/Dt − ∇·σ − ρb] dv = 0. Локализация приводит к ρa = ∇·σ + ρb.',
    research:'Исследовательское замечание',
    researchText:'В вычислительной механике именно эта локальная форма лежит в основе сильной постановки. В методе конечных элементов обычно переходят к слабой форме, где производные напряжений переносятся на тестовые функции, а естественные граничные условия входят через поверхностный член.',
    interactive:'ИНТЕРАКТИВНО',
  },
  en: {
    back:'← B01',
    title:'Linear momentum balance and the Cauchy equation of motion',
    lead:'The change of linear momentum of a material region is caused by body and surface forces. Converting the surface traction t = σn into a volume term through Gauss theorem yields the local equation of motion.',
    key:'FORCES DETERMINE ACCELERATION',
    keyText:'For a classical continuum: ρa = ∇·σ + ρb.',
    integral:'Integral form',
    integralText:'The time derivative of momentum of a material region equals the sum of surface and body forces.',
    local:'Local form',
    localText:'The surface integral of σn is converted into a volume integral of ∇·σ, and localization yields the Cauchy equation.',
    sceneKicker:'LINEAR MOMENTUM',
    sceneTitle:'change the stress gradient and body force and observe the resulting acceleration',
    density:'density ρ',
    stressLeft:'left σ',
    stressRight:'right σ',
    bodyForce:'body force b',
    stressGradient:'∂σ/∂x',
    surfaceForce:'resultant surface force',
    bodyTerm:'ρb',
    acceleration:'acceleration a',
    residual:'balance residual',
    warning:'IMPORTANT',
    warningTitle:'∇·σ is not simply “the stress gradient” in general 3D.',
    warningText:'The divergence of the stress tensor is a vector with components (∇·σ)ᵢ = ∂σᵢⱼ/∂xⱼ. In the one-dimensional scene it reduces to ∂σ/∂x.',
    question:'CHECKPOINT',
    questionTitle:'What happens if surface and body forces exactly cancel?',
    questionText:'Acceleration becomes zero even though stress and body force may each be nonzero.',
    conclusion:'CONCLUSION',
    conclusionTitle:'The Cauchy equation connects local acceleration to stress divergence and body forces.',
    conclusionText:'Next we move to angular momentum balance and the symmetry of the stress tensor.',
    deepen:'Go deeper',
    deepenText:'For a material region Ωₜ: d/dt ∫Ωₜ ρv dv = ∫∂Ωₜ σn da + ∫Ωₜ ρb dv. Using mass balance, the transport theorem, and Gauss theorem gives ∫Ωₜ [ρDv/Dt − ∇·σ − ρb] dv = 0. Localization yields ρa = ∇·σ + ρb.',
    research:'Research note',
    researchText:'In computational mechanics this local equation defines the strong form. Finite-element methods usually pass to a weak form, transferring derivatives from stresses to test functions and introducing natural boundary conditions through the surface term.',
    interactive:'INTERACTIVE',
  }
} as const

function fmt(v:number,d=4){
  return (Math.abs(v)<1e-10?0:v).toFixed(d)
}

export function LinearMomentumBalance({notation,language,onBack}:Props){
  const copy=text[language]
  const [rho,setRho]=useState(1.00)
  const [sigmaL,setSigmaL]=useState(0.30)
  const [sigmaR,setSigmaR]=useState(0.80)
  const [body,setBody]=useState(-0.10)

  const data=useMemo(()=>{
    const length=1
    const stressGradient=(sigmaR-sigmaL)/length
    const surfaceForce=stressGradient
    const bodyTerm=rho*body
    const acceleration=(surfaceForce+bodyTerm)/rho
    const residual=rho*acceleration-surfaceForce-bodyTerm
    return {stressGradient,surfaceForce,bodyTerm,acceleration,residual}
  },[rho,sigmaL,sigmaR,body])

  const localLine =
    notation==='Index' ? 'ρ aᵢ = ∂σᵢⱼ/∂xⱼ + ρ bᵢ' :
    notation==='Matrix' ? 'ρ a = ∇·σ + ρ b' :
    notation==='Python' ? 'rho * a = div_sigma + rho * b' :
    'ρ𝐚 = ∇·σ + ρ𝐛'

  const integralLine =
    notation==='Index' ? 'd/dt ∫Ωₜ ρvᵢ dv = ∫∂Ωₜ σᵢⱼnⱼ da + ∫Ωₜ ρbᵢ dv' :
    notation==='Python' ? 'dP_dt = surface_traction + body_force' :
    'd/dt ∫Ωₜ ρ𝐯 dv = ∫∂Ωₜ σ𝐧 da + ∫Ωₜ ρ𝐛 dv'

  const arrowScale=8
  const leftEnd=28-arrowScale*sigmaL
  const rightEnd=72+arrowScale*sigmaR
  const bodyEnd=50+10*body

  return (
    <section className="module-view module-view-stacked">
      <div className="lesson-copy">
        <button className="text-button" onClick={onBack}>{copy.back}</button>
        <div className="lesson-index">B02 / 10</div>
        <h1>{copy.title}</h1>
        <p className="lead">{copy.lead}</p>

        <div className="concept-card">
          <span>{copy.key}</span>
          <strong>{copy.keyText}</strong>
        </div>

        <div className="definition">
          <div className="definition-label">{copy.integral}</div>
          <div className="formula">{integralLine}</div>
          <p>{copy.integralText}</p>
        </div>

        <div className="definition">
          <div className="definition-label">{copy.local}</div>
          <div className="formula">{localLine}</div>
          <p>{copy.localText}</p>
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
            <rect x="28" y="24" width="44" height="20" rx="3" fill="rgba(244,242,236,.04)" stroke="#69717C" strokeWidth=".8"/>

            <line x1="28" y1="34" x2={leftEnd} y2="34" stroke="#A9E3D2" strokeWidth="1.4"/>
            <line x1="72" y1="34" x2={rightEnd} y2="34" stroke="#2864FF" strokeWidth="1.4"/>
            <text x="18" y="28" fill="#A9E3D2" fontSize="2.4">σ_L</text>
            <text x="78" y="28" fill="#2864FF" fontSize="2.4">σ_R</text>

            <line x1="50" y1="34" x2={bodyEnd} y2="34" stroke="#DD7A2B" strokeWidth="1.4"/>
            <text x="47" y="50" fill="#DD7A2B" fontSize="2.4">ρb</text>

            <line x1="50" y1="18" x2={50+8*data.acceleration} y2="18" stroke="#F4F2EC" strokeWidth="1.5"/>
            <text x="47" y="14" fill="#F4F2EC" fontSize="2.4">a</text>
          </svg>

          <div className="control-stack">
            <label><span>{copy.density} <strong>{fmt(rho,2)}</strong></span><input type="range" min=".4" max="2.0" step=".01" value={rho} onChange={e=>setRho(Number(e.target.value))}/></label>
            <label><span>{copy.stressLeft} <strong>{fmt(sigmaL,2)}</strong></span><input type="range" min="-.8" max="1.2" step=".01" value={sigmaL} onChange={e=>setSigmaL(Number(e.target.value))}/></label>
            <label><span>{copy.stressRight} <strong>{fmt(sigmaR,2)}</strong></span><input type="range" min="-.8" max="1.2" step=".01" value={sigmaR} onChange={e=>setSigmaR(Number(e.target.value))}/></label>
            <label><span>{copy.bodyForce} <strong>{fmt(body,2)}</strong></span><input type="range" min="-.8" max=".8" step=".01" value={body} onChange={e=>setBody(Number(e.target.value))}/></label>
          </div>

          <div className="transport-metrics">
            <div><span>{copy.stressGradient}</span><strong>{fmt(data.stressGradient)}</strong></div>
            <div><span>{copy.surfaceForce}</span><strong>{fmt(data.surfaceForce)}</strong></div>
            <div><span>{copy.bodyTerm}</span><strong>{fmt(data.bodyTerm)}</strong></div>
            <div><span>{copy.acceleration}</span><strong>{fmt(data.acceleration)}</strong></div>
            <div><span>{copy.residual}</span><strong>{fmt(data.residual,7)}</strong></div>
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
