import { useMemo, useState } from 'react'
import type { Language, NotationMode } from '../i18n'
import { DepthNote } from './DepthNote'

type Props = {
  notation: NotationMode
  language: Language
  onBack: () => void
}

type Mode = 'isotropic' | 'anisotropic'

const text = {
  ru: {
    back:'← C02',
    title:'Изотропия и анизотропия: симметрии самого материала',
    lead:'Теперь вращаем не наблюдателя, а внутреннюю структуру материала относительно одной и той же нагрузки. Если отклик не меняется, материал изотропен относительно такого вращения; если меняется — проявляется анизотропия.',
    key:'ИЗОТРОПИЯ — СВОЙСТВО МАТЕРИАЛА, А НЕ НАБЛЮДАТЕЛЯ',
    keyText:'Изотропный материал не выделяет предпочтительных направлений, а анизотропный отклик зависит от ориентации структуры.',
    symmetry:'Материальная симметрия',
    symmetryText:'Для изотропного материала вращение материальных направлений не меняет конститутивный отклик при том же физическом нагружении.',
    anisotropy:'Анизотропия',
    anisotropyText:'Если в материале есть волокна, слои или иная направленная структура, отклик может зависеть от угла между этой структурой и направлением деформации.',
    sceneKicker:'СИММЕТРИЯ МАТЕРИАЛА',
    sceneTitle:'вращай структурное направление относительно одной и той же деформации',
    isotropic:'изотропный',
    anisotropic:'анизотропный',
    strain:'деформация ε',
    angle:'угол структуры θ',
    matrixStiffness:'жёсткость матрицы Eₘ',
    fiberStiffness:'жёсткость волокон E_f',
    matrixStress:'вклад матрицы',
    fiberStress:'вклад структуры',
    totalStress:'итоговое напряжение',
    warning:'ВАЖНО',
    warningTitle:'Анизотропия не нарушает объективность.',
    warningText:'При смене наблюдателя все пространственные величины и структурные направления должны преобразовываться согласованно. Анизотропия означает лишь то, что материал физически различает направления.',
    question:'ВОПРОС ДЛЯ ПРОВЕРКИ',
    questionTitle:'Почему поворот волокон относительно нагрузки меняет отклик, а поворот наблюдателя — нет?',
    questionText:'Потому что в первом случае меняется физическая ориентация структуры относительно деформации, а во втором меняется только способ описания того же процесса.',
    conclusion:'ВЫВОД',
    conclusionTitle:'Материальные симметрии определяют, какие направления конститутивный закон должен различать.',
    conclusionText:'Следующий шаг — линейная упругость и тензор жёсткости четвёртого порядка.',
    deepen:'Углубиться',
    deepenText:'Для трансверсально-изотропного материала удобно вводить структурный тензор A = a₀⊗a₀. Тогда энергия и напряжения могут зависеть не только от обычных инвариантов деформации, но и от смешанных инвариантов, например I₄ = a₀·C a₀.',
    research:'Исследовательское замечание',
    researchText:'В мягких тканях анизотропия часто связана с коллагеновыми волокнами и их распределением по ориентациям. Поэтому вместо одного направления a₀ могут использоваться несколько семейств волокон или распределённые ориентационные модели.',
    interactive:'ИНТЕРАКТИВНО',
  },
  en: {
    back:'← C02',
    title:'Isotropy and anisotropy: symmetries of the material',
    lead:'Now we rotate the internal material structure relative to the same loading, not the observer. If the response is unchanged, the material is isotropic with respect to that rotation; if it changes, anisotropy is present.',
    key:'ISOTROPY IS A PROPERTY OF THE MATERIAL, NOT OF THE OBSERVER',
    keyText:'An isotropic material has no preferred directions, while anisotropic response depends on structural orientation.',
    symmetry:'Material symmetry',
    symmetryText:'For an isotropic material, rotating material directions does not change the constitutive response under the same physical loading.',
    anisotropy:'Anisotropy',
    anisotropyText:'If a material has fibers, layers, or another directed structure, the response may depend on the angle between that structure and the deformation direction.',
    sceneKicker:'MATERIAL SYMMETRY',
    sceneTitle:'rotate the structural direction relative to the same deformation',
    isotropic:'isotropic',
    anisotropic:'anisotropic',
    strain:'strain ε',
    angle:'structure angle θ',
    matrixStiffness:'matrix stiffness Eₘ',
    fiberStiffness:'fiber stiffness E_f',
    matrixStress:'matrix contribution',
    fiberStress:'structural contribution',
    totalStress:'total stress',
    warning:'IMPORTANT',
    warningTitle:'Anisotropy does not violate objectivity.',
    warningText:'Under a change of observer, all spatial quantities and structural directions must transform consistently. Anisotropy only means that the material physically distinguishes directions.',
    question:'CHECKPOINT',
    questionTitle:'Why does rotating fibers relative to loading change response while rotating the observer does not?',
    questionText:'Because the first changes the physical orientation of structure relative to deformation, while the second changes only the description of the same process.',
    conclusion:'CONCLUSION',
    conclusionTitle:'Material symmetries determine which directions the constitutive law must distinguish.',
    conclusionText:'Next comes linear elasticity and the fourth-order stiffness tensor.',
    deepen:'Go deeper',
    deepenText:'For a transversely isotropic material one may introduce the structural tensor A = a₀⊗a₀. Energy and stress may then depend not only on standard deformation invariants but also on mixed invariants such as I₄ = a₀·C a₀.',
    research:'Research note',
    researchText:'Soft-tissue anisotropy is often associated with collagen fibers and their orientation distribution. Models may use several fiber families or distributed orientation descriptions instead of a single direction a₀.',
    interactive:'INTERACTIVE',
  }
} as const

function fmt(v:number,d=3){ return (Math.abs(v)<1e-12?0:v).toFixed(d) }

export function MaterialSymmetry({notation,language,onBack}:Props){
  const copy=text[language]
  const [mode,setMode]=useState<Mode>('anisotropic')
  const [strain,setStrain]=useState(.25)
  const [angle,setAngle]=useState(25)
  const [Em,setEm]=useState(1.0)
  const [Ef,setEf]=useState(2.4)

  const data=useMemo(()=>{
    const theta=angle*Math.PI/180
    const matrixStress=Em*strain
    const orientation=Math.cos(theta)**4
    const fiberStress=mode==='anisotropic' ? Ef*strain*orientation : 0
    const totalStress=matrixStress+fiberStress
    return {matrixStress,fiberStress,totalStress,orientation}
  },[mode,strain,angle,Em,Ef])

  const formula =
    mode==='isotropic'
      ? notation==='Index' ? 'σᵢⱼ = λ εₖₖ δᵢⱼ + 2μ εᵢⱼ'
      : notation==='Python' ? 'sigma = isotropic_response(strain)'
      : 'σ = isotropic_response(ε)'
      : notation==='Index' ? 'σᵢⱼ = σᵢⱼ(εₖₗ, Aₖₗ),   A = a₀⊗a₀'
      : notation==='Python' ? 'sigma = anisotropic_response(strain, a0)'
      : 'σ = 𝓕(ε, A),   A = a₀⊗a₀'

  const theta=angle*Math.PI/180
  const x2=50+23*Math.cos(theta)
  const y2=35-23*Math.sin(theta)
  const bar=(v:number)=>Math.max(3,Math.min(34,10+10*Math.max(0,v)))

  return (
    <section className="module-view module-view-stacked">
      <div className="lesson-copy">
        <button className="text-button" onClick={onBack}>{copy.back}</button>
        <div className="lesson-index">C03</div>
        <h1>{copy.title}</h1>
        <p className="lead">{copy.lead}</p>

        <div className="concept-card">
          <span>{copy.key}</span>
          <strong>{copy.keyText}</strong>
        </div>

        <div className="definition">
          <div className="definition-label">{copy.symmetry}</div>
          <div className="formula">{formula}</div>
          <p>{copy.symmetryText}</p>
        </div>

        <div className="definition">
          <div className="definition-label">{copy.anisotropy}</div>
          <p>{copy.anisotropyText}</p>
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

          <div className="constitutive-mode-switch constitutive-mode-switch-dark">
            <button className={mode==='isotropic'?'constitutive-mode-button active':'constitutive-mode-button'} onClick={()=>setMode('isotropic')}>{copy.isotropic}</button>
            <button className={mode==='anisotropic'?'constitutive-mode-button active':'constitutive-mode-button'} onClick={()=>setMode('anisotropic')}>{copy.anisotropic}</button>
          </div>

          <svg className="balance-scene" viewBox="0 0 100 74" role="img">
            <rect x="5" y="6" width="90" height="62" rx="9" fill="#111318"/>
            <line x1="50" y1="35" x2={x2} y2={y2} stroke="#A9E3D2" strokeWidth="1.6"/>
            <line x1="27" y1="35" x2="73" y2="35" stroke="#2864FF" strokeWidth="1.2"/>
            <circle cx="50" cy="35" r="2" fill="#F4F2EC"/>
            <text x="12" y="17" fill="#F4F2EC" fontSize="2.4">θ = {fmt(angle,0)}°</text>
            <text x="12" y="57" fill="#2864FF" fontSize="2.15">ε</text>
            <text x="75" y="57" fill="#A9E3D2" fontSize="2.15">a₀</text>

            <rect x="18" y={65-bar(data.matrixStress)} width="12" height={bar(data.matrixStress)} rx="2" fill="rgba(40,100,255,.45)"/>
            <rect x="40" y={65-bar(data.fiberStress)} width="12" height={bar(data.fiberStress)} rx="2" fill="rgba(169,227,210,.42)"/>
            <rect x="62" y={65-bar(data.totalStress)} width="12" height={bar(data.totalStress)} rx="2" fill="rgba(244,242,236,.18)"/>
          </svg>

          <div className="control-stack">
            <label><span>{copy.strain} <strong>{fmt(strain,2)}</strong></span><input type="range" min="0" max=".5" step=".01" value={strain} onChange={e=>setStrain(Number(e.target.value))}/></label>
            <label><span>{copy.angle} <strong>{fmt(angle,0)}°</strong></span><input type="range" min="0" max="90" step="1" value={angle} onChange={e=>setAngle(Number(e.target.value))}/></label>
            <label><span>{copy.matrixStiffness} <strong>{fmt(Em,2)}</strong></span><input type="range" min=".2" max="2.5" step=".01" value={Em} onChange={e=>setEm(Number(e.target.value))}/></label>
            {mode==='anisotropic' && <label><span>{copy.fiberStiffness} <strong>{fmt(Ef,2)}</strong></span><input type="range" min=".2" max="5" step=".01" value={Ef} onChange={e=>setEf(Number(e.target.value))}/></label>}
          </div>

          <div className="transport-metrics">
            <div><span>{copy.matrixStress}</span><strong>{fmt(data.matrixStress)}</strong></div>
            <div><span>{copy.fiberStress}</span><strong>{fmt(data.fiberStress)}</strong></div>
            <div><span>{copy.totalStress}</span><strong>{fmt(data.totalStress)}</strong></div>
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
