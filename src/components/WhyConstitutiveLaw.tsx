import { useMemo, useState } from 'react'
import type { Language, NotationMode } from '../i18n'
import { DepthNote } from './DepthNote'

type Props = {
  notation: NotationMode
  language: Language
  onNext: () => void
}

const text = {
  ru: {
    title:'Зачем нужен конститутивный закон?',
    lead:'Законы баланса говорят, какие поля должны удовлетворять фундаментальным ограничениям, но сами по себе не объясняют, как конкретный материал реагирует на деформацию.',
    key:'БАЛАНСЫ НЕ ОПРЕДЕЛЯЮТ МАТЕРИАЛ',
    keyText:'Одинаковая деформация может создавать разные напряжения в разных материалах.',
    balance:'Что дают законы баланса',
    balanceText:'Например, уравнение импульса связывает ускорение, дивергенцию напряжений и массовые силы. Но оно не говорит, каким должно быть напряжение при заданной деформации.',
    closure:'Что добавляет конститутивный закон',
    closureText:'Он связывает механические поля с особенностями материала: жёсткостью, вязкостью, анизотропией, историей нагружения, температурой и внутренними переменными.',
    sceneKicker:'ОДНА ДЕФОРМАЦИЯ — РАЗНЫЕ МАТЕРИАЛЫ',
    sceneTitle:'меняй свойства материала при одной и той же деформации и сравни напряжение',
    strain:'деформация ε',
    soft:'мягкий материал',
    stiff:'жёсткий материал',
    Esoft:'жёсткость E₁',
    Estiff:'жёсткость E₂',
    sigma1:'напряжение σ₁',
    sigma2:'напряжение σ₂',
    warning:'ВАЖНО',
    warningTitle:'Конститутивный закон — не новый закон сохранения.',
    warningText:'Он является моделью материала и должен быть согласован с симметриями, объективностью, экспериментальными данными и термодинамическими ограничениями.',
    question:'ВОПРОС ДЛЯ ПРОВЕРКИ',
    questionTitle:'Могут ли два материала при одной и той же деформации иметь разные напряжения?',
    questionText:'Да. Именно это и требует отдельного конститутивного описания.',
    conclusion:'ВЫВОД',
    conclusionTitle:'Чтобы замкнуть задачу МСС, нужно добавить модель материала.',
    conclusionText:'Следующий шаг — понять, что вообще может входить в конститутивное соотношение и почему оно не обязано иметь вид σ = σ(ε).',
    deepen:'Углубиться',
    deepenText:'В простейшем линейно-упругом случае можно написать σ = C:ε. Но в общем виде отклик может зависеть от текущего состояния, истории, температуры, внутренних переменных и структурных направлений материала.',
    research:'Исследовательское замечание',
    researchText:'Для мягких тканей конститутивный закон часто должен учитывать волоконную архитектуру, почти несжимаемое поведение, вязкоупругость, активность, рост и ремоделирование. Поэтому выбор модели материала становится отдельной научной задачей.',
    interactive:'ИНТЕРАКТИВНО',
    next:'Перейти к расширенному состоянию материала →',
  },
  en: {
    title:'Why do we need a constitutive law?',
    lead:'Balance laws constrain admissible fields, but they do not by themselves explain how a particular material responds to deformation.',
    key:'BALANCE LAWS DO NOT DEFINE THE MATERIAL',
    keyText:'The same deformation can produce different stresses in different materials.',
    balance:'What balance laws provide',
    balanceText:'For example, momentum balance connects acceleration, stress divergence, and body force. It does not tell us what stress corresponds to a prescribed deformation.',
    closure:'What a constitutive law adds',
    closureText:'It connects mechanical fields to material behavior: stiffness, viscosity, anisotropy, loading history, temperature, and internal variables.',
    sceneKicker:'SAME DEFORMATION — DIFFERENT MATERIALS',
    sceneTitle:'change material properties at the same deformation and compare stress',
    strain:'strain ε',
    soft:'soft material',
    stiff:'stiff material',
    Esoft:'stiffness E₁',
    Estiff:'stiffness E₂',
    sigma1:'stress σ₁',
    sigma2:'stress σ₂',
    warning:'IMPORTANT',
    warningTitle:'A constitutive law is not another conservation law.',
    warningText:'It is a material model and must respect symmetries, objectivity, experimental evidence, and thermodynamic restrictions.',
    question:'CHECKPOINT',
    questionTitle:'Can two materials at the same deformation have different stresses?',
    questionText:'Yes. That is exactly why a separate constitutive description is required.',
    conclusion:'CONCLUSION',
    conclusionTitle:'Closing a continuum problem requires a material model.',
    conclusionText:'Next we ask what may enter a constitutive relation and why it need not have the simple form σ = σ(ε).',
    deepen:'Go deeper',
    deepenText:'In simple linear elasticity one may write σ = C:ε. In general, the response may depend on current state, history, temperature, internal variables, and structural directions.',
    research:'Research note',
    researchText:'Soft-tissue constitutive laws often need fiber architecture, near-incompressibility, viscoelasticity, active response, growth, and remodeling. Choosing the material model is therefore a scientific problem in its own right.',
    interactive:'INTERACTIVE',
    next:'Continue to the extended material state →',
  }
} as const

function fmt(v:number,d=3){
  return v.toFixed(d)
}

export function WhyConstitutiveLaw({notation,language,onNext}:Props){
  const copy=text[language]
  const [strain,setStrain]=useState(.25)
  const [E1,setE1]=useState(.8)
  const [E2,setE2]=useState(2.2)

  const data=useMemo(()=>({
    sigma1:E1*strain,
    sigma2:E2*strain,
  }),[strain,E1,E2])

  const formula =
    notation==='Index' ? 'σᵢⱼ = Cᵢⱼₖₗ εₖₗ' :
    notation==='Matrix' ? 'σ = C : ε' :
    notation==='Python' ? 'sigma = constitutive_model(state, params)' :
    'σ = 𝓕(kinematics, history, temperature, internal variables, …)'

  const width1=Math.max(4,Math.min(58,10+18*Math.abs(data.sigma1)))
  const width2=Math.max(4,Math.min(58,10+18*Math.abs(data.sigma2)))

  return (
    <section className="module-view module-view-stacked">
      <div className="lesson-copy">
        <div className="lesson-index">C00</div>
        <h1>{copy.title}</h1>
        <p className="lead">{copy.lead}</p>

        <div className="concept-card">
          <span>{copy.key}</span>
          <strong>{copy.keyText}</strong>
        </div>

        <div className="definition">
          <div className="definition-label">{copy.balance}</div>
          <p>{copy.balanceText}</p>
        </div>

        <div className="definition">
          <div className="definition-label">{copy.closure}</div>
          <div className="formula">{formula}</div>
          <p>{copy.closureText}</p>
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

          <svg className="balance-scene" viewBox="0 0 100 72" role="img">
            <rect x="5" y="6" width="90" height="60" rx="9" fill="#111318"/>
            <text x="13" y="18" fill="#F4F2EC" fontSize="2.5">ε = {fmt(strain,2)}</text>

            <rect x="15" y="27" width="24" height="12" rx="2" fill="rgba(169,227,210,.15)" stroke="#A9E3D2" strokeWidth=".8"/>
            <rect x="15" y="47" width="24" height="12" rx="2" fill="rgba(40,100,255,.12)" stroke="#2864FF" strokeWidth=".8"/>
            <text x="17" y="34.5" fill="#A9E3D2" fontSize="2.3">{copy.soft}</text>
            <text x="17" y="54.5" fill="#2864FF" fontSize="2.3">{copy.stiff}</text>

            <rect x="44" y="29" width={width1} height="8" rx="2" fill="rgba(169,227,210,.55)"/>
            <rect x="44" y="49" width={width2} height="8" rx="2" fill="rgba(40,100,255,.55)"/>
            <text x="44" y="25" fill="#A9E3D2" fontSize="2.25">σ₁ = {fmt(data.sigma1)}</text>
            <text x="44" y="45" fill="#2864FF" fontSize="2.25">σ₂ = {fmt(data.sigma2)}</text>
          </svg>

          <div className="control-stack">
            <label><span>{copy.strain} <strong>{fmt(strain,2)}</strong></span><input type="range" min="-.5" max=".5" step=".01" value={strain} onChange={e=>setStrain(Number(e.target.value))}/></label>
            <label><span>{copy.Esoft} <strong>{fmt(E1,2)}</strong></span><input type="range" min=".2" max="2.0" step=".01" value={E1} onChange={e=>setE1(Number(e.target.value))}/></label>
            <label><span>{copy.Estiff} <strong>{fmt(E2,2)}</strong></span><input type="range" min=".5" max="4.0" step=".01" value={E2} onChange={e=>setE2(Number(e.target.value))}/></label>
          </div>

          <div className="transport-metrics">
            <div><span>{copy.sigma1}</span><strong>{fmt(data.sigma1)}</strong></div>
            <div><span>{copy.sigma2}</span><strong>{fmt(data.sigma2)}</strong></div>
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
