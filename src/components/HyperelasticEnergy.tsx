import { useMemo, useState } from 'react'
import type { Language, NotationMode } from '../i18n'
import { DepthNote } from './DepthNote'
import { ApplicationLinks } from './ApplicationLinks'

type Props = {
  notation: NotationMode
  language: Language
  onBack?: () => void
  onNext?: () => void
}

type EnergyModel = 'stvk' | 'neo'

const text = {
  ru: {
    title:'Гиперупругость через функцию энергии',
    lead:'В гиперупругом материале напряжение не задают отдельной формулой “с нуля”. Сначала задают плотность запасённой энергии Ψ, а затем получают напряжения как её производные по подходящей мере деформации.',
    key:'ЭНЕРГИЯ — ГЛАВНЫЙ КОНСТИТУТИВНЫЙ ОБЪЕКТ',
    keyText:'Если существует Ψ, то напряжения и касательные жёсткости получают дифференцированием. Это автоматически связывает отклик материала с термодинамически согласованной потенциальной структурой.',
    route:'Основной маршрут',
    routeText:'Для Ψ = Ψ(C) удобно получить второй тензор Пиолы–Кирхгофа как S = 2∂Ψ/∂C, затем перейти к P = FS и σ = J⁻¹FSFᵀ.',
    tangent:'Почему это важно для вычислений',
    tangentText:'Производная напряжения даёт материальную касательную жёсткость, которая входит в ньютоновские итерации нелинейного МКЭ.',
    model:'модель энергии',
    lambda:'растяжение λ',
    mu:'μ',
    bulk:'κ',
    energy:'Ψ',
    nominal:'P₁₁',
    cauchy:'σ₁₁',
    sceneKicker:'ЭНЕРГИЯ → НАПРЯЖЕНИЕ',
    sceneTitle:'меняй растяжение и параметры и смотри, как энергия порождает напряжение',
    stvk:'Сен-Венан–Кирхгоф',
    neo:'Нео-Гук',
    checkpoint:'ВОПРОС ДЛЯ ПРОВЕРКИ',
    checkpointTitle:'Почему нельзя просто подставить большую деформацию в закон Гука?',
    checkpointText:'Потому что геометрия деформации нелинейна, а линейная связь σ = C:ε не сохраняет объективность и энергетическую структуру при больших поворотах и растяжениях.',
    conclusion:'ВЫВОД',
    conclusionTitle:'Гиперупругость задаётся через Ψ, а напряжение — её следствие.',
    conclusionText:'Следующий шаг — перейти к инвариантам C и построить изотропные гиперупругие модели в объективной форме.',
    deepen:'Углубиться',
    deepenText:'Если Ψ = Ψ(C), то δΨ = 1/2 S:δC. Для Ψ = Ψ(F) имеем P = ∂Ψ/∂F. Эти записи эквивалентны при корректном преобразовании производных.',
    research:'Исследовательское замечание',
    researchText:'В современных кодах гиперупругости полезно отделять функцию энергии от автоматического получения напряжений и касательной жёсткости (stress/tangent). Это упрощает проверку модели, автоматическое дифференцирование и добавление новых материалов.',
    warning:'ВАЖНО',
    warningTitle:'Гиперупругость не означает линейность и не означает несжимаемость.',
    warningText:'Модель может быть сильно нелинейной и сжимаемой; несжимаемость вводится отдельно как ограничение или объёмный штраф.',
    back:'← D01',
    next:'D03 → инварианты деформации',
    interactive:'ИНТЕРАКТИВНО',
  },
  en: {
    title:'Hyperelasticity through a strain-energy function',
    lead:'In a hyperelastic material, stress is not prescribed independently. We first define the stored-energy density Ψ and then obtain stress by differentiating Ψ with respect to a compatible deformation measure.',
    key:'ENERGY IS THE PRIMARY CONSTITUTIVE OBJECT',
    keyText:'Once Ψ exists, stresses and consistent tangent moduli follow by differentiation. This gives the material response a thermodynamically consistent potential structure.',
    route:'Main route',
    routeText:'For Ψ = Ψ(C), the second Piola–Kirchhoff stress is S = 2∂Ψ/∂C, followed by P = FS and σ = J⁻¹FSFᵀ.',
    tangent:'Why this matters computationally',
    tangentText:'Differentiating stress gives the material tangent required by Newton iterations in nonlinear FEM.',
    model:'energy model',
    lambda:'stretch λ',
    mu:'μ',
    bulk:'κ',
    energy:'Ψ',
    nominal:'P₁₁',
    cauchy:'σ₁₁',
    sceneKicker:'ЭНЕРГИЯ → НАПРЯЖЕНИЕ',
    sceneTitle:'vary stretch and parameters and watch energy generate stress',
    stvk:'Saint Venant–Kirchhoff',
    neo:'Neo-Hookean',
    checkpoint:'CHECKPOINT',
    checkpointTitle:'Why not simply use Hooke’s law at large strain?',
    checkpointText:'Because deformation geometry is nonlinear, and σ = C:ε does not preserve objectivity and the correct energetic structure under large rotations and stretches.',
    conclusion:'CONCLUSION',
    conclusionTitle:'Hyperelasticity is defined by Ψ; stress is derived from it.',
    conclusionText:'Next we move to invariants of C and build isotropic hyperelastic laws in an objective form.',
    deepen:'Go deeper',
    deepenText:'If Ψ = Ψ(C), then δΨ = 1/2 S:δC. If Ψ = Ψ(F), then P = ∂Ψ/∂F. These descriptions are equivalent under the proper chain rule.',
    research:'Research note',
    researchText:'In modern hyperelastic codes, separating the energy function from automatic stress/tangent generation makes model verification, automatic differentiation, and extension to new materials much easier.',
    warning:'IMPORTANT',
    warningTitle:'Hyperelastic does not mean linear and does not mean incompressible.',
    warningText:'A hyperelastic model may be strongly nonlinear and compressible; incompressibility is introduced separately as a constraint or volumetric penalty.',
    back:'← D01',
    interactive:'INTERACTIVE',
    next:'D03 → deformation invariants',
  }
} as const

function fmt(v:number,d=3){ return (Math.abs(v)<1e-12?0:v).toFixed(d) }

export function HyperelasticEnergy({notation,language,onBack,onNext}:Props){
  const copy=text[language]
  const [model,setModel]=useState<EnergyModel>('neo')
  const [lambda,setLambda]=useState(1.20)
  const [mu,setMu]=useState(20)
  const [bulk,setBulk]=useState(80)

  const data=useMemo(()=>{
    const l=Math.max(lambda,.05)
    if(model==='stvk'){
      const E=.5*(l*l-1)
      const psi=mu*E*E + .5*bulk*E*E
      const S=(2*mu+bulk)*E
      const P=l*S
      const sigma=P
      return {psi,P,sigma}
    }
    const J=l
    const logJ=Math.log(J)
    const psi=.5*mu*(l*l-1-2*logJ)+.5*bulk*logJ*logJ
    const P=mu*(l-1/l)+bulk*logJ/l
    const sigma=P
    return {psi,P,sigma}
  },[lambda,mu,bulk,model])

  const formula =
    notation==='Index' ? 'S_IJ = 2 ∂Ψ/∂C_IJ,   P_iI = F_iJ S_JI' :
    notation==='Matrix' ? 'S = 2 ∂Ψ/∂C,   P = FS,   σ = J⁻¹FSFᵀ' :
    notation==='Python' ? 'S = 2*dPsi_dC; P = F @ S; sigma = (F @ S @ F.T)/J' :
    'S = 2∂Ψ/∂C,   P = FS,   σ = J⁻¹FSFᵀ'

  const energyFormula = model==='stvk'
    ? 'Ψ(E) = μ E:E + ½ κ (tr E)²'
    : 'Ψ = μ/2 (I₁ − 3 − 2 ln J) + κ/2 (ln J)²'

  const curve = Array.from({length:81},(_,i)=>{
    const l=.65+i*(.9/80)
    if(model==='stvk'){
      const E=.5*(l*l-1)
      const psi=mu*E*E+.5*bulk*E*E
      return [l,psi]
    }
    const q=Math.log(l)
    const psi=.5*mu*(l*l-1-2*q)+.5*bulk*q*q
    return [l,psi]
  })
  const maxPsi=Math.max(...curve.map(p=>p[1]),1e-6)
  const path=curve.map(([l,p],i)=>{
    const x=8+(l-.65)/.9*84
    const y=52-p/maxPsi*39
    return `${i===0?'M':'L'} ${x.toFixed(2)} ${y.toFixed(2)}`
  }).join(' ')
  const markerX=8+(lambda-.65)/.9*84
  const markerY=52-data.psi/maxPsi*39

  return (
    <section className="module-view module-view-stacked">
      <div className="lesson-copy">
        <div className="lesson-index">D02</div>
        <h1>{copy.title}</h1>
        <p className="lead">{copy.lead}</p>

        <div className="concept-card">
          <span>{copy.key}</span>
          <strong>{copy.keyText}</strong>
        </div>

        <div className="definition">
          <div className="definition-label">{copy.route}</div>
          <div className="formula">{formula}</div>
          <p>{copy.routeText}</p>
        </div>

        <div className="definition">
          <div className="definition-label">{copy.tangent}</div>
          <div className="formula">𝓒 = ∂S/∂E</div>
          <p>{copy.tangentText}</p>
        </div>

        <div className="warning-card kinematics-warning">
          <span>{copy.warning}</span>
          <strong>{copy.warningTitle}</strong>
          <p>{copy.warningText}</p>
        </div>

        <DepthNote label={copy.deepen}><p>{copy.deepenText}</p></DepthNote>
        <DepthNote label={copy.research} variant="research"><p>{copy.researchText}</p></DepthNote>

        <ApplicationLinks language={language} items={[
          {ru:'Нелинейный МКЭ',en:'Nonlinear FEM'},
          {ru:'Мягкие ткани',en:'Soft tissues'},
          {ru:'Резина и эластомеры',en:'Rubber and elastomers'},
          {ru:'Механика полимеров',en:'Polymer mechanics'},
        ]}/>

        <div className="mini-toggle-row" style={{marginTop:20}}>{onBack && <button className="text-button" onClick={onBack}>{copy.back}</button>}{onNext && <button className="primary-button" onClick={onNext}>{copy.next}</button>}</div>
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

          <div className="mini-toggle-row" style={{marginBottom:14}}>
            <button className={model==='neo'?'toggle active':'toggle'} onClick={()=>setModel('neo')}>{copy.neo}</button>
            <button className={model==='stvk'?'toggle active':'toggle'} onClick={()=>setModel('stvk')}>{copy.stvk}</button>
          </div>

          <div className="definition component-vector-card">
            <div className="definition-label">{copy.model}</div>
            <div className="formula">{energyFormula}</div>
          </div>

          <svg className="balance-scene" viewBox="0 0 100 60" role="img">
            <rect x="5" y="5" width="90" height="50" rx="8" fill="#111318"/>
            <line x1="8" y1="52" x2="94" y2="52" stroke="#69717C" strokeWidth=".6"/>
            <line x1="8" y1="52" x2="8" y2="10" stroke="#69717C" strokeWidth=".6"/>
            <path d={path} fill="none" stroke="#A9E3D2" strokeWidth="1.3"/>
            <circle cx={markerX} cy={markerY} r="1.8" fill="#2864FF"/>
            <text x="10" y="13" fill="#F4F2EC" fontSize="2.4">Ψ(λ)</text>
            <text x="81" y="56" fill="#F4F2EC" fontSize="2.2">λ</text>
          </svg>

          <div className="control-stack">
            <label><span>{copy.lambda}<strong>{fmt(lambda,2)}</strong></span><input type="range" min=".65" max="1.55" step=".01" value={lambda} onChange={e=>setLambda(Number(e.target.value))}/></label>
            <label><span>{copy.mu}<strong>{fmt(mu,1)}</strong></span><input type="range" min="2" max="60" step="1" value={mu} onChange={e=>setMu(Number(e.target.value))}/></label>
            <label><span>{copy.bulk}<strong>{fmt(bulk,1)}</strong></span><input type="range" min="5" max="200" step="5" value={bulk} onChange={e=>setBulk(Number(e.target.value))}/></label>
          </div>

          <div className="transport-metrics">
            <div><span>{copy.energy}</span><strong>{fmt(data.psi)}</strong></div>
            <div><span>{copy.nominal}</span><strong>{fmt(data.P)}</strong></div>
            <div><span>{copy.cauchy}</span><strong>{fmt(data.sigma)}</strong></div>
          </div>
        </div>

        <div className="bottom-grid">
          <div className="prediction-card">
            <span>{copy.checkpoint}</span>
            <strong>{copy.checkpointTitle}</strong>
            <p>{copy.checkpointText}</p>
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
