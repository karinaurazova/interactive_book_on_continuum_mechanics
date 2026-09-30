import { useMemo, useState } from 'react'
import type { Language, NotationMode } from '../i18n'
import { ApplicationLinks } from './ApplicationLinks'
import { DepthNote } from './DepthNote'

type Props = {
  notation: NotationMode
  language: Language
  onBack: () => void
}

const text = {
  ru: {
    title:'Баланс импульса и уравнения Навье—Стокса',
    lead:'Уравнение Навье—Стокса не вводится как отдельный закон. Оно получается из общего баланса линейного импульса, когда в него подставляют конститутивный закон ньютоновской жидкости.',
    key:'ГЛАВНАЯ ЛОГИКА',
    keyText:'баланс импульса + закон напряжений + кинематическое ограничение → уравнения движения жидкости',
    step1:'1. Баланс линейного импульса',
    step1Text:'Это универсальный закон МСС: он справедлив не только для жидкостей.',
    step2:'2. Напряжение в жидкости',
    step2Text:'Разделяем напряжение на давление и вязкую часть: σ = −pI + τ.',
    step3:'3. Ньютоновская несжимаемая жидкость',
    step3Text:'При постоянной динамической вязкости μ и ∇·v = 0 имеем τ = 2μD и ∇·τ = μ∇²v.',
    step4:'4. Получаем Навье—Стокса',
    step4Text:'Материальное ускорение раскрывается как локальный и конвективный вклады.',
    continuity:'Условие несжимаемости',
    continuityText:'Для несжимаемой жидкости поле скорости должно удовлетворять ∇·v = 0. Давление при этом определяется совместно с полем скорости и играет роль переменной, обеспечивающей выполнение ограничения.',
    warning:'НЕ ПУТАТЬ',
    warningTitle:'Стационарное течение не означает нулевое ускорение.',
    warningText:'Даже при ∂v/∂t = 0 конвективный член (v·∇)v может быть ненулевым, если частица движется через неоднородное поле скорости.',
    sceneKicker:'NAVIER–STOKES LAB',
    sceneTitle:'кто именно ускоряет жидкость?',
    rho:'плотность ρ',
    mu:'вязкость μ',
    gradP:'градиент давления ∂p/∂x',
    velocity:'скорость U',
    gradV:'градиент скорости ∂U/∂x',
    lapV:'кривизна профиля ∂²U/∂x²',
    body:'объёмное ускорение bₓ',
    pressure:'давление −∂p/∂x',
    viscous:'вязкость μ∂²U/∂x²',
    bodyTerm:'массовая сила ρbₓ',
    convective:'конвективная инерция ρU∂U/∂x',
    local:'локальная инерция ρ∂U/∂t',
    materialAcc:'материальное ускорение DU/Dt',
    localAcc:'локальное ускорение ∂U/∂t',
    balance:'невязка баланса',
    positive:'вдоль +x',
    negative:'вдоль −x',
    equationMode:'Текущая 1D-проекция',
    equationNote:'Это диагностическая проекция полного векторного уравнения: она позволяет увидеть знак и относительный вклад каждого члена, не заменяя полноценную многомерную задачу.',
    checkpoint:'ВОПРОС ДЛЯ ПРОВЕРКИ',
    checkpointTitle:'Может ли жидкость ускоряться при постоянном во времени поле?',
    checkpointText:'Да. Если ∂v/∂t = 0, но (v·∇)v ≠ 0, материальное ускорение остаётся ненулевым.',
    conclusion:'ВЫВОД',
    conclusionTitle:'Навье—Стокса — это закрытый баланс импульса для выбранного класса жидкости.',
    conclusionText:'Сами законы баланса универсальны; конкретный вид уравнений движения появляется после выбора конститутивного закона и кинематических ограничений.',
    deepen:'Углубиться',
    deepenText:'Для сжимаемой ньютоновской жидкости появляется дополнительный объёмный вязкий вклад, а плотность уже нельзя считать постоянной: уравнение импульса нужно решать совместно с балансом массы и, как правило, энергии.',
    research:'Исследовательская заметка',
    researchText:'В вычислительной гидродинамике давление и скорость связаны особенно тесно. Для несжимаемого течения дискретизация должна обеспечивать совместность поля давления с условием ∇·v = 0; отсюда возникают projection-, pressure-correction- и смешанные постановки.',
    back:'← F02',
  },
  en: {
    title:'Momentum balance and the Navier–Stokes equations',
    lead:'The Navier–Stokes equation is not a separate balance law. It follows from the general linear-momentum balance after inserting the constitutive law of a Newtonian fluid.',
    key:'CORE LOGIC',
    keyText:'momentum balance + stress law + kinematic constraint → fluid equations of motion',
    step1:'1. Linear-momentum balance',
    step1Text:'This is a universal continuum-mechanics law, not a fluid-specific assumption.',
    step2:'2. Fluid stress',
    step2Text:'Split stress into pressure and viscous parts: σ = −pI + τ.',
    step3:'3. Newtonian incompressible fluid',
    step3Text:'For constant dynamic viscosity μ and ∇·v = 0, τ = 2μD and ∇·τ = μ∇²v.',
    step4:'4. Navier–Stokes follows',
    step4Text:'The material acceleration expands into local and convective contributions.',
    continuity:'Incompressibility constraint',
    continuityText:'For an incompressible fluid the velocity field satisfies ∇·v = 0. Pressure is then determined together with velocity and acts as a variable enforcing this constraint.',
    warning:'DO NOT CONFUSE',
    warningTitle:'Steady flow does not imply zero acceleration.',
    warningText:'Even when ∂v/∂t = 0, the convective term (v·∇)v may be nonzero if a particle moves through a nonuniform velocity field.',
    sceneKicker:'NAVIER–STOKES LAB',
    sceneTitle:'what actually accelerates the fluid?',
    rho:'density ρ',
    mu:'viscosity μ',
    gradP:'pressure gradient ∂p/∂x',
    velocity:'velocity U',
    gradV:'velocity gradient ∂U/∂x',
    lapV:'profile curvature ∂²U/∂x²',
    body:'body acceleration bₓ',
    pressure:'pressure −∂p/∂x',
    viscous:'viscous μ∂²U/∂x²',
    bodyTerm:'body force ρbₓ',
    convective:'convective inertia ρU∂U/∂x',
    local:'local inertia ρ∂U/∂t',
    materialAcc:'material acceleration DU/Dt',
    localAcc:'local acceleration ∂U/∂t',
    balance:'balance residual',
    positive:'along +x',
    negative:'along −x',
    equationMode:'Current 1D projection',
    equationNote:'This is a diagnostic projection of the full vector equation: it exposes signs and relative term magnitudes without replacing the full multidimensional problem.',
    checkpoint:'CHECKPOINT',
    checkpointTitle:'Can a fluid accelerate in a time-independent velocity field?',
    checkpointText:'Yes. If ∂v/∂t = 0 but (v·∇)v ≠ 0, material acceleration is still nonzero.',
    conclusion:'CONCLUSION',
    conclusionTitle:'Navier–Stokes is a closed momentum balance for a selected fluid class.',
    conclusionText:'Balance laws remain universal; the particular equations of motion emerge after choosing a constitutive law and kinematic constraints.',
    deepen:'Go deeper',
    deepenText:'For a compressible Newtonian fluid an additional volumetric viscous contribution appears and density is no longer constant. Momentum must be solved together with mass balance and, usually, energy balance.',
    research:'Research note',
    researchText:'In computational fluid dynamics pressure and velocity are tightly coupled. For incompressible flow the discretization must make pressure compatible with ∇·v = 0, motivating projection, pressure-correction, and mixed formulations.',
    back:'← F02',
  }
} as const

function fmt(v:number,d=3){
  const x=Math.abs(v)<1e-12?0:v
  return x.toFixed(d)
}

function contributionWidth(v:number,maxAbs:number){
  return Math.min(42,42*Math.abs(v)/Math.max(maxAbs,1e-9))
}

export function NavierStokesBalance({notation,language,onBack}:Props){
  const c=text[language]
  const [rho,setRho]=useState(1.0)
  const [mu,setMu]=useState(1.2)
  const [gradP,setGradP]=useState(-2.0)
  const [velocity,setVelocity]=useState(1.4)
  const [gradV,setGradV]=useState(0.45)
  const [lapV,setLapV]=useState(-0.55)
  const [body,setBody]=useState(0)

  const data=useMemo(()=>{
    const pressure=-gradP
    const viscous=mu*lapV
    const bodyTerm=rho*body
    const convective=rho*velocity*gradV
    const rhs=pressure+viscous+bodyTerm
    const materialAcc=rhs/rho
    const localAcc=materialAcc-velocity*gradV
    const local=rho*localAcc
    const residual=(local+convective)-rhs
    const terms=[pressure,viscous,bodyTerm,-convective,-local]
    const maxAbs=Math.max(1,...terms.map(v=>Math.abs(v)))
    return {pressure,viscous,bodyTerm,convective,materialAcc,localAcc,local,residual,maxAbs}
  },[rho,mu,gradP,velocity,gradV,lapV,body])

  const equation =
    notation==='Index'
      ? 'ρ(∂vᵢ/∂t + vⱼ∂vᵢ/∂xⱼ) = −∂p/∂xᵢ + μ∂²vᵢ/∂xⱼ∂xⱼ + ρbᵢ'
      : notation==='Python'
      ? 'rho*(dv_dt + (v @ grad)*v) = -grad(p) + mu*laplacian(v) + rho*b'
      : 'ρ(∂𝐯/∂t + (𝐯·∇)𝐯) = −∇p + μ∇²𝐯 + ρ𝐛'

  const rows = [
    {label:c.pressure,value:data.pressure,color:'#2864FF'},
    {label:c.viscous,value:data.viscous,color:'#A9E3D2'},
    {label:c.bodyTerm,value:data.bodyTerm,color:'#F4F2EC'},
    {label:c.convective,value:-data.convective,color:'#DD7A2B'},
    {label:c.local,value:-data.local,color:'#E7B8FF'},
  ]

  return <section className="module-view module-view-stacked">
    <div className="lesson-copy">
      <button className="text-button" onClick={onBack}>{c.back}</button>
      <div className="lesson-index">F03</div>
      <h1>{c.title}</h1>
      <p className="lead">{c.lead}</p>

      <div className="concept-card"><span>{c.key}</span><strong>{c.keyText}</strong></div>

      <div className="definition">
        <div className="definition-label">{c.step1}</div>
        <div className="formula">ρ D𝐯/Dt = ∇·σ + ρ𝐛</div>
        <p>{c.step1Text}</p>
      </div>

      <div className="definition">
        <div className="definition-label">{c.step2}</div>
        <div className="formula">σ = −pI + τ</div>
        <p>{c.step2Text}</p>
      </div>

      <div className="definition">
        <div className="definition-label">{c.step3}</div>
        <div className="formula">τ = 2μD, &nbsp; ∇·𝐯 = 0</div>
        <p>{c.step3Text}</p>
      </div>

      <div className="definition">
        <div className="definition-label">{c.step4}</div>
        <div className="formula">{equation}</div>
        <p>{c.step4Text}</p>
      </div>

      <div className="definition">
        <div className="definition-label">{c.continuity}</div>
        <div className="formula">∇·𝐯 = 0</div>
        <p>{c.continuityText}</p>
      </div>

      <div className="warning-card kinematics-warning">
        <span>{c.warning}</span><strong>{c.warningTitle}</strong><p>{c.warningText}</p>
      </div>

      <DepthNote label={c.deepen}><p>{c.deepenText}</p></DepthNote>
      <DepthNote label={c.research} variant="research"><p>{c.researchText}</p></DepthNote>

      <ApplicationLinks language={language} items={[
        {ru:'Аэродинамика и гидродинамика',en:'Aerodynamics and hydrodynamics'},
        {ru:'Микрофлюидика',en:'Microfluidics'},
        {ru:'Геофизические течения',en:'Geophysical flows'},
        {ru:'Гемодинамика',en:'Hemodynamics'},
        {ru:'Тепло- и массоперенос с конвекцией',en:'Convective heat and mass transfer'},
      ]}/>
    </div>

    <div className="scene-column">
      <div className="scene-card">
        <div className="scene-head">
          <div><span className="scene-kicker">{c.sceneKicker}</span><h2>{c.sceneTitle}</h2></div>
          <div className="live-badge">F03</div>
        </div>

        <div className="definition" style={{marginBottom:14}}>
          <div className="definition-label">{c.equationMode}</div>
          <div className="formula">ρ(∂U/∂t + U∂U/∂x) = −∂p/∂x + μ∂²U/∂x² + ρbₓ</div>
          <p>{c.equationNote}</p>
        </div>

        <svg className="balance-scene" viewBox="0 0 100 74" role="img" aria-label={c.sceneTitle}>
          <rect x="4" y="4" width="92" height="66" rx="9" fill="#111318"/>
          <line x1="50" y1="10" x2="50" y2="66" stroke="#5E6774" strokeWidth=".6"/>
          {rows.map((row,i)=>{
            const y=16+i*10
            const w=contributionWidth(row.value,data.maxAbs)
            const x=row.value>=0?50:50-w
            return <g key={row.label}>
              <text x="7" y={y+2} fill="#F4F2EC" fontSize="2.15">{row.label}</text>
              <rect x={x} y={y+3.2} width={w} height="3.6" rx="1.2" fill={row.color} opacity=".9"/>
              <text x={row.value>=0?52:48} y={y+6.2} fill={row.color} fontSize="1.8" textAnchor={row.value>=0?'start':'end'}>{fmt(row.value,2)}</text>
            </g>
          })}
          <text x="73" y="68" fill="#A9E3D2" fontSize="2">{c.positive}</text>
          <text x="8" y="68" fill="#DD7A2B" fontSize="2">{c.negative}</text>
        </svg>

        <div className="control-stack">
          <label><span>{c.rho}<strong>{fmt(rho,2)}</strong></span><input type="range" min=".3" max="3" step=".05" value={rho} onChange={e=>setRho(Number(e.target.value))}/></label>
          <label><span>{c.mu}<strong>{fmt(mu,2)}</strong></span><input type="range" min=".05" max="4" step=".05" value={mu} onChange={e=>setMu(Number(e.target.value))}/></label>
          <label><span>{c.gradP}<strong>{fmt(gradP,2)}</strong></span><input type="range" min="-5" max="5" step=".1" value={gradP} onChange={e=>setGradP(Number(e.target.value))}/></label>
          <label><span>{c.velocity}<strong>{fmt(velocity,2)}</strong></span><input type="range" min="-3" max="3" step=".05" value={velocity} onChange={e=>setVelocity(Number(e.target.value))}/></label>
          <label><span>{c.gradV}<strong>{fmt(gradV,2)}</strong></span><input type="range" min="-2" max="2" step=".05" value={gradV} onChange={e=>setGradV(Number(e.target.value))}/></label>
          <label><span>{c.lapV}<strong>{fmt(lapV,2)}</strong></span><input type="range" min="-2" max="2" step=".05" value={lapV} onChange={e=>setLapV(Number(e.target.value))}/></label>
          <label><span>{c.body}<strong>{fmt(body,2)}</strong></span><input type="range" min="-3" max="3" step=".05" value={body} onChange={e=>setBody(Number(e.target.value))}/></label>
        </div>

        <div className="transport-metrics">
          <div><span>{c.materialAcc}</span><strong>{fmt(data.materialAcc)}</strong></div>
          <div><span>{c.localAcc}</span><strong>{fmt(data.localAcc)}</strong></div>
          <div><span>{c.pressure}</span><strong>{fmt(data.pressure)}</strong></div>
          <div><span>{c.viscous}</span><strong>{fmt(data.viscous)}</strong></div>
          <div><span>{c.convective}</span><strong>{fmt(data.convective)}</strong></div>
          <div><span>{c.bodyTerm}</span><strong>{fmt(data.bodyTerm)}</strong></div>
          <div><span>{c.balance}</span><strong>{fmt(data.residual,6)}</strong></div>
        </div>
      </div>

      <div className="bottom-grid">
        <div className="prediction-card"><span>{c.checkpoint}</span><strong>{c.checkpointTitle}</strong><p>{c.checkpointText}</p></div>
        <div className="author-card"><span>{c.conclusion}</span><strong>{c.conclusionTitle}</strong><p>{c.conclusionText}</p></div>
      </div>
    </div>
  </section>
}
