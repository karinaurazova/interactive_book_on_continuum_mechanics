import { useMemo, useState } from 'react'
import type { Language, NotationMode } from '../i18n'
import { DepthNote } from './DepthNote'

type Props = {
  notation: NotationMode
  language: Language
  onBack: () => void
}

type Mode = 'elastic' | 'viscous'

const text = {
  ru: {
    back:'← B06',
    title:'Как второй закон ограничивает простые конститутивные модели',
    lead:'Второй закон не диктует единственный материал. Он проверяет, согласована ли выбранная модель с неотрицательной диссипацией.',
    key:'ОДНА И ТА ЖЕ ПРОВЕРКА — РАЗНЫЕ МАТЕРИАЛЫ',
    keyText:'У идеальной упругости диссипация может быть нулевой, а у вязкой части она должна быть неотрицательной.',
    elastic:'упругий режим',
    viscous:'вязкий режим',
    elasticDef:'Идеальная упругость',
    elasticText:'Если напряжение получено из свободной энергии согласованно с выбранной мерой деформации, механическая мощность может полностью перейти в обратимое накопление энергии: 𝒟 = 0.',
    viscousDef:'Ньютоновская вязкость',
    viscousText:'Для простого вязкого вклада σᵛ = 2μD_dev диссипация равна 2μ D_dev:D_dev. Поэтому достаточно μ ≥ 0, чтобы этот вклад не нарушал второй закон.',
    sceneKicker:'КОНСТИТУТИВНАЯ ПРОВЕРКА',
    sceneTitle:'переключай модель и проверяй её термодинамическую допустимость',
    strain:'деформация ε',
    rate:'скорость деформации d',
    stiffness:'жёсткость E',
    viscosity:'вязкость μ',
    stress:'напряжение',
    freeRate:'скорость свободной энергии',
    dissipation:'диссипация 𝒟',
    admissible:'допустимо',
    violation:'нарушение',
    warning:'ВАЖНО',
    warningTitle:'Условие 𝒟 ≥ 0 не заменяет эксперимент и идентификацию параметров.',
    warningText:'Термодинамическая допустимость — необходимое, но не достаточное условие хорошей модели. Модель ещё должна воспроизводить реальные данные и быть адекватной исследуемому режиму.',
    question:'ВОПРОС ДЛЯ ПРОВЕРКИ',
    questionTitle:'Почему отрицательная вязкость μ < 0 недопустима в этой простой модели?',
    questionText:'Потому что тогда 2μ D_dev:D_dev становится отрицательной при ненулевой скорости деформации, то есть модель генерирует отрицательную диссипацию.',
    conclusion:'ВЫВОД',
    conclusionTitle:'Второй закон проверяет структуру конститутивной модели через знак диссипации.',
    conclusionText:'Следующий шаг — собрать законы баланса и конститутивные связи в единую задачу начально-краевого типа.',
    deepen:'Углубиться',
    deepenText:'Для упругости в малых деформациях можно взять ψ = 1/2 ε:C:ε и σ = ρ ∂ψ/∂ε при согласованной нормировке. Тогда σ:ε̇ − ρ ψ̇ = 0. Для вязкого вклада σᵛ = 2μD_dev получаем 𝒟ᵛ = 2μ D_dev:D_dev ≥ 0 при μ ≥ 0.',
    research:'Исследовательское замечание',
    researchText:'Современные модели мягких тканей часто комбинируют гиперупругость, вязкость, повреждение, активное напряжение, рост и ремоделирование. Удобно строить их модульно: обратимая часть из свободной энергии, необратимые механизмы — через отдельные диссипативные потенциалы или эволюционные законы.',
    interactive:'ИНТЕРАКТИВНО',
    powerLabel:'мощность',
  },
  en: {
    back:'← B06',
    title:'How the second law constrains simple constitutive models',
    lead:'The second law does not prescribe a unique material. It checks whether a chosen model is compatible with nonnegative dissipation.',
    key:'ONE CHECK — DIFFERENT MATERIALS',
    keyText:'Ideal elasticity may have zero dissipation, while viscous response must dissipate nonnegatively.',
    elastic:'elastic mode',
    viscous:'viscous mode',
    elasticDef:'Ideal elasticity',
    elasticText:'If stress is derived consistently from free energy and the chosen strain measure, mechanical power can be fully stored reversibly: 𝒟 = 0.',
    viscousDef:'Newtonian viscosity',
    viscousText:'For a simple viscous contribution σᵛ = 2μD_dev, dissipation is 2μ D_dev:D_dev. Thus μ ≥ 0 is sufficient for this contribution to satisfy the second law.',
    sceneKicker:'CONSTITUTIVE CHECK',
    sceneTitle:'switch the model and inspect thermodynamic admissibility',
    strain:'strain ε',
    rate:'strain rate d',
    stiffness:'stiffness E',
    viscosity:'viscosity μ',
    stress:'stress',
    freeRate:'free-energy rate',
    dissipation:'dissipation 𝒟',
    admissible:'admissible',
    violation:'violation',
    warning:'IMPORTANT',
    warningTitle:'The condition 𝒟 ≥ 0 does not replace experiments or parameter identification.',
    warningText:'Thermodynamic admissibility is necessary but not sufficient. A model must still reproduce data and remain appropriate for the regime of interest.',
    question:'CHECKPOINT',
    questionTitle:'Why is negative viscosity μ < 0 inadmissible in this simple model?',
    questionText:'Because 2μ D_dev:D_dev becomes negative whenever the strain rate is nonzero, creating negative dissipation.',
    conclusion:'CONCLUSION',
    conclusionTitle:'The second law checks constitutive structure through the sign of dissipation.',
    conclusionText:'Next we assemble balance laws and constitutive relations into one initial-boundary-value problem.',
    deepen:'Go deeper',
    deepenText:'For small-strain elasticity one may take ψ = 1/2 ε:C:ε and σ = ρ ∂ψ/∂ε under a consistent normalization. Then σ:ε̇ − ρ ψ̇ = 0. For σᵛ = 2μD_dev, one obtains 𝒟ᵛ = 2μ D_dev:D_dev ≥ 0 when μ ≥ 0.',
    research:'Research note',
    researchText:'Modern soft-tissue models often combine hyperelasticity, viscosity, damage, active stress, growth, and remodeling. A modular construction is useful: reversible response from free energy, irreversible mechanisms from dissipative potentials or evolution laws.',
    interactive:'INTERACTIVE',
    powerLabel:'power',
  }
} as const

function fmt(v:number,d=4){
  return (Math.abs(v)<1e-10?0:v).toFixed(d)
}

export function ConstitutiveAdmissibility({notation,language,onBack}:Props){
  const copy=text[language]
  const [mode,setMode]=useState<Mode>('elastic')
  const [strain,setStrain]=useState(.35)
  const [rate,setRate]=useState(.25)
  const [E,setE]=useState(1.2)
  const [mu,setMu]=useState(.45)

  const data=useMemo(()=>{
    if(mode==='elastic'){
      const stress=E*strain
      const freeRate=stress*rate
      const power=stress*rate
      const dissipation=power-freeRate
      return {stress,freeRate,power,dissipation}
    }
    const stress=2*mu*rate
    const power=stress*rate
    const freeRate=0
    const dissipation=power
    return {stress,freeRate,power,dissipation}
  },[mode,strain,rate,E,mu])

  const formula =
    mode==='elastic'
      ? notation==='Index' ? '𝒟 = σᵢⱼ ε̇ᵢⱼ − ρ ψ̇ = 0'
      : notation==='Python' ? 'D = stress_power - rho * psi_dot'
      : '𝒟 = σ:ε̇ − ρ ψ̇ = 0'
      : notation==='Index' ? '𝒟 = 2μ DᵈᵉᵛᵢⱼDᵈᵉᵛᵢⱼ ≥ 0'
      : notation==='Python' ? 'D = 2 * mu * double_dot(Ddev, Ddev)'
      : '𝒟 = 2μ 𝐃_dev:𝐃_dev ≥ 0'

  const admissible=data.dissipation>=-1e-10
  const status=admissible?copy.admissible:copy.violation
  const statusColor=admissible?'#A9E3D2':'#DD7A2B'
  const bar=(v:number)=>Math.max(0,Math.min(30,15+9*v))

  return (
    <section className="module-view module-view-stacked">
      <div className="lesson-copy">
        <button className="text-button" onClick={onBack}>{copy.back}</button>
        <div className="lesson-index">B07 / 10</div>
        <h1>{copy.title}</h1>
        <p className="lead">{copy.lead}</p>

        <div className="concept-card">
          <span>{copy.key}</span>
          <strong>{copy.keyText}</strong>
        </div>

        <div className="decomp-toggle-row">
          <button className={mode==='elastic'?'decomp-toggle active':'decomp-toggle'} onClick={()=>setMode('elastic')}>{copy.elastic}</button>
          <button className={mode==='viscous'?'decomp-toggle active':'decomp-toggle'} onClick={()=>setMode('viscous')}>{copy.viscous}</button>
        </div>

        <div className="definition">
          <div className="definition-label">{mode==='elastic'?copy.elasticDef:copy.viscousDef}</div>
          <div className="formula">{formula}</div>
          <p>{mode==='elastic'?copy.elasticText:copy.viscousText}</p>
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

          <svg className="balance-scene" viewBox="0 0 100 72" role="img">
            <rect x="5" y="6" width="90" height="60" rx="9" fill="#111318"/>
            <rect x="14" y="20" width="72" height="32" rx="4" fill="rgba(244,242,236,.04)" stroke="#69717C" strokeWidth=".8"/>

            <rect x="25" y={49-bar(data.power)} width="14" height={bar(data.power)} rx="2" fill="rgba(40,100,255,.32)"/>
            <rect x="45" y={49-bar(data.freeRate)} width="14" height={bar(data.freeRate)} rx="2" fill="rgba(244,242,236,.14)"/>
            <rect x="65" y={49-bar(data.dissipation)} width="14" height={bar(data.dissipation)} rx="2" fill={statusColor}/>

            <text x="24" y="59" fill="#2864FF" fontSize="2.25">{copy.powerLabel}</text>
            <text x="45" y="59" fill="#F4F2EC" fontSize="2.25">ψ̇</text>
            <text x="68" y="59" fill={statusColor} fontSize="2.25">𝒟</text>
            <text x="39" y="15" fill={statusColor} fontSize="2.6">{status}</text>
          </svg>

          <div className="control-stack">
            {mode==='elastic' && <label><span>{copy.strain} <strong>{fmt(strain,2)}</strong></span><input type="range" min="-.8" max=".8" step=".01" value={strain} onChange={e=>setStrain(Number(e.target.value))}/></label>}
            <label><span>{copy.rate} <strong>{fmt(rate,2)}</strong></span><input type="range" min="-.8" max=".8" step=".01" value={rate} onChange={e=>setRate(Number(e.target.value))}/></label>
            {mode==='elastic'
              ? <label><span>{copy.stiffness} <strong>{fmt(E,2)}</strong></span><input type="range" min=".1" max="2.5" step=".01" value={E} onChange={e=>setE(Number(e.target.value))}/></label>
              : <label><span>{copy.viscosity} <strong>{fmt(mu,2)}</strong></span><input type="range" min="-.8" max="1.5" step=".01" value={mu} onChange={e=>setMu(Number(e.target.value))}/></label>}
          </div>

          <div className="transport-metrics">
            <div><span>{copy.stress}</span><strong>{fmt(data.stress)}</strong></div>
            <div><span>{copy.freeRate}</span><strong>{fmt(data.freeRate)}</strong></div>
            <div><span>{copy.dissipation}</span><strong>{fmt(data.dissipation)}</strong></div>
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
