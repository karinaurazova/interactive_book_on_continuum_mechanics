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
    back:'← B05',
    title:'Второй закон термодинамики и неравенство Клаузиуса–Дюгема',
    lead:'Первый закон сохраняет энергию, но не запрещает физически невозможные направления процессов. Второй закон вводит производство энтропии и требует, чтобы внутренняя диссипация не была отрицательной.',
    key:'ДИССИПАЦИЯ НЕ МОЖЕТ БЫТЬ ОТРИЦАТЕЛЬНОЙ',
    keyText:'Для изотермического локального случая удобно записывать: 𝒟 = σ:D − ρ Dψ/Dt ≥ 0.',
    entropy:'Энтропийное неравенство',
    entropyText:'В общей термомеханике ограничение включает тепловой поток, температуру и энтропию. Оно не является ещё одним законом сохранения — это неравенство, задающее направление допустимых процессов.',
    constitutive:'Конститутивное ограничение',
    constitutiveText:'После введения свободной энергии ψ второй закон ограничивает допустимые формы напряжений, теплового потока и внутренних переменных.',
    sceneKicker:'ТЕРМОДИНАМИЧЕСКАЯ ДОПУСТИМОСТЬ',
    sceneTitle:'меняй энергетические вклады и проверяй знак диссипации',
    stressPower:'мощность напряжений σ:D',
    freeEnergyRate:'ρ Dψ/Dt',
    thermalTerm:'тепловой вклад',
    dissipation:'диссипация 𝒟',
    admissible:'допустимый процесс',
    reversible:'предельный обратимый случай',
    violation:'нарушение второго закона',
    warning:'ВАЖНО',
    warningTitle:'Неотрицательная диссипация — ограничение на модель, а не дополнительное уравнение для всех неизвестных.',
    warningText:'В конститутивном моделировании обычно сначала выбирают переменные состояния и свободную энергию, а затем требуют, чтобы оставшиеся диссипативные механизмы удовлетворяли второму закону.',
    question:'ВОПРОС ДЛЯ ПРОВЕРКИ',
    questionTitle:'Что означает 𝒟 = 0?',
    questionText:'Это предельный обратимый случай для выбранного набора механизмов: вся механическая мощность идёт в изменение свободной энергии и другие явно учтённые обратимые вклады.',
    conclusion:'ВЫВОД',
    conclusionTitle:'Второй закон отбирает термодинамически допустимые конститутивные модели.',
    conclusionText:'Следующий шаг — применить это ограничение к простым материалам и увидеть, как из него возникают знакомые формы упругого и вязкого отклика.',
    deepen:'Углубиться',
    deepenText:'Одна из локальных форм неравенства Клаузиуса–Дюгема: ρ(Dη/Dt) ≥ ρr/θ − ∇·(q/θ), где η — энтропия на единицу массы, θ — абсолютная температура. Совмещая это с первым законом и ψ = e − θη, получают диссипативное неравенство, ограничивающее механические и тепловые конститутивные соотношения.',
    research:'Исследовательское замечание',
    researchText:'Для роста, ремоделирования, повреждения и активных биоматериалов в диссипации появляются дополнительные сопряжённые пары: термодинамические силы и скорости внутренних переменных. Именно через второй закон удобно проверять, что предложенная эволюционная модель не создаёт нефизическую отрицательную диссипацию.',
    interactive:'ИНТЕРАКТИВНО',
  },
  en: {
    back:'← B05',
    title:'Second law of thermodynamics and the Clausius–Duhem inequality',
    lead:'The first law conserves energy but does not exclude physically impossible process directions. The second law introduces entropy production and requires internal dissipation to be nonnegative.',
    key:'DISSIPATION CANNOT BE NEGATIVE',
    keyText:'For an isothermal local setting one convenient form is: 𝒟 = σ:D − ρ Dψ/Dt ≥ 0.',
    entropy:'Entropy inequality',
    entropyText:'In general thermomechanics the restriction includes heat flux, temperature, and entropy. It is not another conservation law but an inequality that selects admissible process directions.',
    constitutive:'Constitutive restriction',
    constitutiveText:'After introducing free energy ψ, the second law constrains admissible stresses, heat fluxes, and internal-variable evolution.',
    sceneKicker:'THERMODYNAMIC ADMISSIBILITY',
    sceneTitle:'change energetic contributions and inspect the dissipation sign',
    stressPower:'stress power σ:D',
    freeEnergyRate:'ρ Dψ/Dt',
    thermalTerm:'thermal contribution',
    dissipation:'dissipation 𝒟',
    admissible:'admissible process',
    reversible:'limiting reversible case',
    violation:'second-law violation',
    warning:'IMPORTANT',
    warningTitle:'Nonnegative dissipation is a constitutive restriction, not an extra field equation for all unknowns.',
    warningText:'In constitutive modeling one typically chooses state variables and a free-energy function first, then requires the remaining dissipative mechanisms to satisfy the second law.',
    question:'CHECKPOINT',
    questionTitle:'What does 𝒟 = 0 mean?',
    questionText:'It is a limiting reversible case for the chosen mechanisms: mechanical power is fully accounted for by free-energy storage and other explicitly reversible terms.',
    conclusion:'CONCLUSION',
    conclusionTitle:'The second law filters thermodynamically admissible constitutive models.',
    conclusionText:'Next we apply this restriction to simple materials and recover familiar elastic and viscous responses.',
    deepen:'Go deeper',
    deepenText:'One local Clausius–Duhem form is ρ(Dη/Dt) ≥ ρr/θ − ∇·(q/θ), where η is entropy per unit mass and θ is absolute temperature. Combining it with the first law and ψ = e − θη yields a dissipation inequality constraining mechanical and thermal constitutive relations.',
    research:'Research note',
    researchText:'Growth, remodeling, damage, and active biomaterials introduce additional conjugate pairs in the dissipation: thermodynamic forces and rates of internal variables. The second law is a natural tool for checking that an evolution law does not generate unphysical negative dissipation.',
    interactive:'INTERACTIVE',
  }
} as const

function fmt(v:number,d=4){
  return (Math.abs(v)<1e-10?0:v).toFixed(d)
}

export function ClausiusDuhem({notation,language,onBack}:Props){
  const copy=text[language]
  const [stressPower,setStressPower]=useState(.55)
  const [freeRate,setFreeRate]=useState(.30)
  const [thermal,setThermal]=useState(.08)

  const data=useMemo(()=>{
    const dissipation=stressPower-freeRate+thermal
    const eps=.015
    const status=dissipation>eps?'admissible':dissipation<-eps?'violation':'reversible'
    return {dissipation,status}
  },[stressPower,freeRate,thermal])

  const formula =
    notation==='Index' ? '𝒟 = σᵢⱼDᵢⱼ − ρ Dψ/Dt + 𝒯 ≥ 0' :
    notation==='Matrix' ? '𝒟 = σ:D − ρ Dψ/Dt + 𝒯 ≥ 0' :
    notation==='Python' ? 'dissipation = stress_power - rho * DpsiDt + thermal_term' :
    '𝒟 = σ:𝐃 − ρ Dψ/Dt + 𝒯 ≥ 0'

  const scale=(v:number)=>Math.max(0,Math.min(30,15+9*v))
  const dissScale=Math.max(0,Math.min(34,16+8*data.dissipation))
  const statusText=data.status==='admissible'?copy.admissible:data.status==='violation'?copy.violation:copy.reversible
  const statusColor=data.status==='admissible'?'#A9E3D2':data.status==='violation'?'#DD7A2B':'#F4F2EC'

  return (
    <section className="module-view module-view-stacked">
      <div className="lesson-copy">
        <button className="text-button" onClick={onBack}>{copy.back}</button>
        <div className="lesson-index">B06 / 10</div>
        <h1>{copy.title}</h1>
        <p className="lead">{copy.lead}</p>

        <div className="concept-card">
          <span>{copy.key}</span>
          <strong>{copy.keyText}</strong>
        </div>

        <div className="definition">
          <div className="definition-label">{copy.entropy}</div>
          <div className="formula">{formula}</div>
          <p>{copy.entropyText}</p>
        </div>

        <div className="definition">
          <div className="definition-label">{copy.constitutive}</div>
          <p>{copy.constitutiveText}</p>
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

            <rect x="20" y={49-scale(stressPower)} width="12" height={scale(stressPower)} rx="2" fill="rgba(40,100,255,.32)"/>
            <rect x="38" y={49-scale(-freeRate)} width="12" height={scale(-freeRate)} rx="2" fill="rgba(244,242,236,.14)"/>
            <rect x="56" y={49-scale(thermal)} width="12" height={scale(thermal)} rx="2" fill="rgba(221,122,43,.26)"/>
            <rect x="74" y={49-dissScale} width="8" height={dissScale} rx="2" fill={statusColor}/>

            <text x="18" y="59" fill="#2864FF" fontSize="2.2">σ:D</text>
            <text x="36" y="59" fill="#F4F2EC" fontSize="2.2">−ρDψ/Dt</text>
            <text x="56" y="59" fill="#DD7A2B" fontSize="2.2">𝒯</text>
            <text x="74" y="59" fill={statusColor} fontSize="2.2">𝒟</text>
            <text x="35" y="15" fill={statusColor} fontSize="2.6">{statusText}</text>
          </svg>

          <div className="control-stack">
            <label><span>{copy.stressPower} <strong>{fmt(stressPower,2)}</strong></span><input type="range" min="-.8" max="1.2" step=".01" value={stressPower} onChange={e=>setStressPower(Number(e.target.value))}/></label>
            <label><span>{copy.freeEnergyRate} <strong>{fmt(freeRate,2)}</strong></span><input type="range" min="-.8" max="1.2" step=".01" value={freeRate} onChange={e=>setFreeRate(Number(e.target.value))}/></label>
            <label><span>{copy.thermalTerm} <strong>{fmt(thermal,2)}</strong></span><input type="range" min="-.8" max=".8" step=".01" value={thermal} onChange={e=>setThermal(Number(e.target.value))}/></label>
          </div>

          <div className="transport-metrics">
            <div><span>{copy.stressPower}</span><strong>{fmt(stressPower)}</strong></div>
            <div><span>{copy.freeEnergyRate}</span><strong>{fmt(freeRate)}</strong></div>
            <div><span>{copy.thermalTerm}</span><strong>{fmt(thermal)}</strong></div>
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
