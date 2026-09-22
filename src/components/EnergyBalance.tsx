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
    back:'← B03',
    title:'Баланс энергии и первый закон термодинамики',
    lead:'Энергия материальной области меняется за счёт механической работы и теплопереноса. После исключения кинетической части с помощью баланса импульса остаётся локальный баланс внутренней энергии.',
    key:'ЭНЕРГИЯ МЕНЯЕТСЯ ЧЕРЕЗ РАБОТУ И ТЕПЛО',
    keyText:'Для классического континуума локально: ρ De/Dt = σ:D − ∇·q + ρr.',
    total:'Полная энергия',
    totalText:'Интегральный первый закон учитывает кинетическую и внутреннюю энергию, работу поверхностных и массовых сил, тепловой поток и объёмный тепловой источник.',
    internal:'Внутренняя энергия',
    internalText:'После использования баланса линейного импульса механическая часть сводится к мощности напряжений σ:D.',
    sceneKicker:'ЭНЕРГЕТИЧЕСКИЙ БЮДЖЕТ',
    sceneTitle:'меняй мощность напряжений и теплоподвод и наблюдай изменение внутренней энергии',
    density:'плотность ρ',
    stressPower:'мощность напряжений σ:D',
    heatFlux:'−∇·q',
    heatSource:'объёмный нагрев ρr',
    internalRate:'ρ De/Dt',
    specificRate:'De/Dt',
    residual:'проверка баланса',
    warning:'ВАЖНО',
    warningTitle:'Баланс энергии сам по себе не задаёт направление теплопереноса и не определяет материал.',
    warningText:'Первый закон выражает сохранение энергии. Конститутивные законы для σ, q и e и ограничения второго закона термодинамики вводятся отдельно.',
    question:'ВОПРОС ДЛЯ ПРОВЕРКИ',
    questionTitle:'Может ли внутренняя энергия расти без теплоподвода?',
    questionText:'Да. Положительная мощность напряжений σ:D может превращать механическую работу во внутреннюю энергию.',
    conclusion:'ВЫВОД',
    conclusionTitle:'Первый закон связывает механическую мощность, теплоперенос и изменение внутренней энергии.',
    conclusionText:'Следующий шаг — локальная мощность напряжений и её связь с D, чтобы понять, какие части напряжения совершают работу.',
    deepen:'Углубиться',
    deepenText:'Для материальной области баланс полной энергии можно записать как d/dt ∫Ωₜ ρ(e + |v|²/2) dv = ∫∂Ωₜ (σn)·v da + ∫Ωₜ ρb·v dv − ∫∂Ωₜ q·n da + ∫Ωₜ ρr dv. Используя баланс импульса, получаем локально ρ De/Dt = σ:D − ∇·q + ρr.',
    research:'Исследовательское замечание',
    researchText:'В конечной термомеханике выбор свободной энергии и диссипативных механизмов определяет конститутивную структуру. Для гиперупругих материалов часть σ:D связана с обратимым накоплением энергии, а при вязкости, повреждении, пластичности или ремоделировании появляется необратимая диссипация.',
    interactive:'ИНТЕРАКТИВНО',
    heatLabel:'тепло',
  },
  en: {
    back:'← B03',
    title:'Energy balance and the first law of thermodynamics',
    lead:'The energy of a material region changes through mechanical work and heat transfer. After removing the kinetic contribution using momentum balance, the local internal-energy equation remains.',
    key:'ENERGY CHANGES THROUGH WORK AND HEAT',
    keyText:'For a classical continuum locally: ρ De/Dt = σ:D − ∇·q + ρr.',
    total:'Total energy',
    totalText:'The integral first law includes kinetic and internal energy, surface and body-force power, heat flux, and volumetric heat supply.',
    internal:'Internal energy',
    internalText:'After using linear momentum balance, the mechanical contribution reduces to stress power σ:D.',
    sceneKicker:'ENERGY BUDGET',
    sceneTitle:'change stress power and heat input and observe the internal-energy rate',
    density:'density ρ',
    stressPower:'stress power σ:D',
    heatFlux:'−∇·q',
    heatSource:'volumetric heating ρr',
    internalRate:'ρ De/Dt',
    specificRate:'De/Dt',
    residual:'balance residual',
    warning:'IMPORTANT',
    warningTitle:'Energy balance alone does not determine heat-flow direction or material behavior.',
    warningText:'The first law expresses conservation of energy. Constitutive laws for σ, q, and e, together with second-law restrictions, are introduced separately.',
    question:'CHECKPOINT',
    questionTitle:'Can internal energy increase without heat input?',
    questionText:'Yes. Positive stress power σ:D can convert mechanical work into internal energy.',
    conclusion:'CONCLUSION',
    conclusionTitle:'The first law connects mechanical power, heat transfer, and internal-energy change.',
    conclusionText:'Next we focus on local stress power and its connection to D.',
    deepen:'Go deeper',
    deepenText:'For a material region, total-energy balance may be written as d/dt ∫Ωₜ ρ(e + |v|²/2) dv = ∫∂Ωₜ (σn)·v da + ∫Ωₜ ρb·v dv − ∫∂Ωₜ q·n da + ∫Ωₜ ρr dv. Using momentum balance gives locally ρ De/Dt = σ:D − ∇·q + ρr.',
    research:'Research note',
    researchText:'In finite thermomechanics, the choice of free energy and dissipative mechanisms determines constitutive structure. In hyperelasticity part of σ:D corresponds to reversible energy storage, while viscosity, damage, plasticity, or remodeling introduce irreversible dissipation.',
    interactive:'INTERACTIVE',
    heatLabel:'heat',
  }
} as const

function fmt(v:number,d=4){
  return (Math.abs(v)<1e-10?0:v).toFixed(d)
}

export function EnergyBalance({notation,language,onBack}:Props){
  const copy=text[language]
  const [rho,setRho]=useState(1.0)
  const [stressPower,setStressPower]=useState(.45)
  const [heatFlux,setHeatFlux]=useState(.20)
  const [heatSource,setHeatSource]=useState(.10)

  const data=useMemo(()=>{
    const internalRate=stressPower+heatFlux+heatSource
    const specificRate=internalRate/rho
    const residual=rho*specificRate-stressPower-heatFlux-heatSource
    return {internalRate,specificRate,residual}
  },[rho,stressPower,heatFlux,heatSource])

  const localLine =
    notation==='Index' ? 'ρ De/Dt = σᵢⱼDᵢⱼ − ∂qᵢ/∂xᵢ + ρr' :
    notation==='Matrix' ? 'ρ De/Dt = σ:D − ∇·q + ρr' :
    notation==='Python' ? 'rho * DeDt = double_dot(sigma, D) - div_q + rho * r' :
    'ρ De/Dt = σ:𝐃 − ∇·𝐪 + ρr'

  const integralLine =
    notation==='Python' ? 'dE_dt = mechanical_power + heat_input' :
    'd/dt ∫Ωₜ ρ(e + |𝐯|²/2) dv = P_mech + Q̇'

  const mechBar=Math.max(0,Math.min(28,14+10*stressPower))
  const heatBar=Math.max(0,Math.min(28,14+10*(heatFlux+heatSource)))
  const totalBar=Math.max(0,Math.min(36,16+8*data.internalRate))

  return (
    <section className="module-view module-view-stacked">
      <div className="lesson-copy">
        <button className="text-button" onClick={onBack}>{copy.back}</button>
        <div className="lesson-index">B04 / 10</div>
        <h1>{copy.title}</h1>
        <p className="lead">{copy.lead}</p>

        <div className="concept-card">
          <span>{copy.key}</span>
          <strong>{copy.keyText}</strong>
        </div>

        <div className="definition">
          <div className="definition-label">{copy.total}</div>
          <div className="formula">{integralLine}</div>
          <p>{copy.totalText}</p>
        </div>

        <div className="definition">
          <div className="definition-label">{copy.internal}</div>
          <div className="formula">{localLine}</div>
          <p>{copy.internalText}</p>
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

          <svg className="balance-scene" viewBox="0 0 100 70" role="img">
            <rect x="5" y="6" width="90" height="58" rx="9" fill="#111318"/>
            <rect x="18" y="21" width="64" height="30" rx="4" fill="rgba(244,242,236,.04)" stroke="#69717C" strokeWidth=".8"/>

            <rect x="24" y={48-mechBar} width="12" height={mechBar} rx="2" fill="rgba(40,100,255,.32)"/>
            <rect x="44" y={48-heatBar} width="12" height={heatBar} rx="2" fill="rgba(221,122,43,.28)"/>
            <rect x="64" y={48-totalBar} width="12" height={totalBar} rx="2" fill="rgba(169,227,210,.34)"/>

            <text x="23" y="57" fill="#2864FF" fontSize="2.35">σ:D</text>
            <text x="43" y="57" fill="#DD7A2B" fontSize="2.35">{copy.heatLabel}</text>
            <text x="63" y="57" fill="#A9E3D2" fontSize="2.35">ρDe/Dt</text>
          </svg>

          <div className="control-stack">
            <label><span>{copy.density} <strong>{fmt(rho,2)}</strong></span><input type="range" min=".4" max="2.0" step=".01" value={rho} onChange={e=>setRho(Number(e.target.value))}/></label>
            <label><span>{copy.stressPower} <strong>{fmt(stressPower,2)}</strong></span><input type="range" min="-.8" max="1.2" step=".01" value={stressPower} onChange={e=>setStressPower(Number(e.target.value))}/></label>
            <label><span>{copy.heatFlux} <strong>{fmt(heatFlux,2)}</strong></span><input type="range" min="-.8" max=".8" step=".01" value={heatFlux} onChange={e=>setHeatFlux(Number(e.target.value))}/></label>
            <label><span>{copy.heatSource} <strong>{fmt(heatSource,2)}</strong></span><input type="range" min="-.8" max=".8" step=".01" value={heatSource} onChange={e=>setHeatSource(Number(e.target.value))}/></label>
          </div>

          <div className="transport-metrics">
            <div><span>{copy.stressPower}</span><strong>{fmt(stressPower)}</strong></div>
            <div><span>{copy.heatFlux}</span><strong>{fmt(heatFlux)}</strong></div>
            <div><span>{copy.heatSource}</span><strong>{fmt(heatSource)}</strong></div>
            <div><span>{copy.internalRate}</span><strong>{fmt(data.internalRate)}</strong></div>
            <div><span>{copy.specificRate}</span><strong>{fmt(data.specificRate)}</strong></div>
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
