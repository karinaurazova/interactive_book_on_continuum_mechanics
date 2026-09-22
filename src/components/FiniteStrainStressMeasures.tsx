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

type StressMode = 'cauchy' | 'kirchhoff' | 'pk1' | 'pk2'

const text = {
  ru: {
    title:'Меры напряжений при конечных деформациях',
    lead:'При конечных деформациях одного универсального тензора напряжений недостаточно: разные меры относятся к разным конфигурациям. Их нельзя смешивать без преобразования.',
    key:'ОДНА И ТА ЖЕ СИЛА — РАЗНЫЕ ПРЕДСТАВЛЕНИЯ',
    keyText:'σ, τ, P и S описывают одно механическое взаимодействие, но “живут” в разных конфигурациях и связаны преобразованиями через F и J.',
    current:'Текущая конфигурация',
    reference:'Начальная конфигурация',
    conjugacy:'Энергетическая сопряжённость',
    conjugacyText:'В гиперупругости особенно важно, какая пара даёт корректную мощность: P:Ḟ, S:Ė и τ:D.',
    sceneKicker:'STRESS-MEASURE EXPLORER',
    sceneTitle:'выбери меру и меняй растяжения — связи обновляются автоматически',
    l1:'λ₁', l2:'λ₂', J:'J = det F',
    selected:'выбранная мера', relation:'связь', config:'конфигурация',
    cauchy:'Напряжение Коши σ',
    kirchhoff:'Напряжение Кирхгофа τ',
    pk1:'Первый тензор Пиолы–Кирхгофа P',
    pk2:'Второй тензор Пиолы–Кирхгофа S',
    currentLabel:'текущая',
    referenceLabel:'начальная',
    mixedLabel:'смешанная',
    note:'КЛЮЧЕВОЕ',
    noteTitle:'P обычно несимметричен — и это нормально.',
    noteText:'Первый тензор Пиолы–Кирхгофа связывает площадь в начальной конфигурации с силой в текущей, поэтому его индексы относятся к разным конфигурациям.',
    checkpoint:'ВОПРОС ДЛЯ ПРОВЕРКИ',
    checkpointTitle:'Что происходит с τ при J = 1?',
    checkpointText:'Для несжимаемого движения τ = Jσ = σ. При изменении объёма эти меры уже отличаются масштабом.',
    conclusion:'ВЫВОД',
    conclusionTitle:'Меру напряжений выбирают вместе с конфигурацией и мерой деформации.',
    conclusionText:'Следующий шаг — записать гиперупругость через плотность энергии и получить напряжения дифференцированием энергии.',
    deepen:'Углубиться',
    deepenText:'Преобразование Пиолы задаёт P = JσF⁻ᵀ, а S = F⁻¹P = JF⁻¹σF⁻ᵀ. Эти формулы обеспечивают эквивалентность мощности в разных конфигурациях.',
    research:'Исследовательское замечание',
    researchText:'В нелинейной FEM выбор меры напряжений связан с тем, в какой конфигурации формулируется слабая форма: total Lagrangian, updated Lagrangian или пространственная постановка.',
    interactive:'ИНТЕРАКТИВНО',
    back:'← D00',
    next:'D02 → гиперупругость через Ψ',
  },
  en: {
    title:'Stress measures at finite strain',
    lead:'At finite strain, there is no single universal stress tensor: different measures belong to different configurations. They cannot be mixed without the proper transformation.',
    key:'SAME FORCE — DIFFERENT REPRESENTATIONS',
    keyText:'σ, τ, P, and S describe the same mechanical interaction but live in different configurations and are connected through F and J.',
    current:'Current configuration',
    reference:'Reference configuration',
    conjugacy:'Energetic conjugacy',
    conjugacyText:'In hyperelasticity the power-conjugate pair matters: P:Ḟ, S:Ė, and τ:D.',
    sceneKicker:'STRESS-MEASURE EXPLORER',
    sceneTitle:'choose a measure and vary stretches — the transformations update automatically',
    l1:'λ₁', l2:'λ₂', J:'J = det F',
    selected:'selected measure', relation:'relation', config:'configuration',
    cauchy:'Cauchy stress σ',
    kirchhoff:'Kirchhoff stress τ',
    pk1:'First Piola–Kirchhoff stress P',
    pk2:'Second Piola–Kirchhoff stress S',
    currentLabel:'current',
    referenceLabel:'reference',
    mixedLabel:'mixed',
    note:'KEY POINT',
    noteTitle:'P is generally not symmetric — and that is expected.',
    noteText:'The first Piola–Kirchhoff tensor maps reference-area normals to current forces, so its indices belong to different configurations.',
    checkpoint:'CHECKPOINT',
    checkpointTitle:'What happens to τ when J = 1?',
    checkpointText:'For incompressible motion τ = Jσ = σ. Once volume changes, the two measures differ by the Jacobian scale.',
    conclusion:'CONCLUSION',
    conclusionTitle:'Choose the stress measure together with configuration and strain measure.',
    conclusionText:'Next we formulate hyperelasticity through a stored-energy density and derive stresses by differentiating the energy.',
    deepen:'Go deeper',
    deepenText:'The Piola transform gives P = JσF⁻ᵀ and S = F⁻¹P = JF⁻¹σF⁻ᵀ. These transformations preserve mechanical power across configurations.',
    research:'Research note',
    researchText:'In nonlinear FEM, stress measure choice follows the configuration used for the weak form: total Lagrangian, updated Lagrangian, or spatial formulations.',
    interactive:'INTERACTIVE',
    back:'← D00',
    next:'D02 → hyperelasticity via Ψ',
  }
} as const

function fmt(v:number,d=3){ return (Math.abs(v)<1e-12?0:v).toFixed(d) }

export function FiniteStrainStressMeasures({notation,language,onBack,onNext}:Props){
  const copy=text[language]
  const [mode,setMode]=useState<StressMode>('cauchy')
  const [l1,setL1]=useState(1.25)
  const [l2,setL2]=useState(.85)

  const data=useMemo(()=>{
    const J=l1*l2
    const sigma=[[1.00,.22],[.22,.55]]
    const tau=sigma.map(row=>row.map(v=>J*v))
    const P=[
      [J*sigma[0][0]/l1, J*sigma[0][1]/l2],
      [J*sigma[1][0]/l1, J*sigma[1][1]/l2],
    ]
    const S=[
      [P[0][0]/l1, P[0][1]/l1],
      [P[1][0]/l2, P[1][1]/l2],
    ]
    return {J,sigma,tau,P,S}
  },[l1,l2])

  const definitions = {
    cauchy:{label:copy.cauchy, config:copy.currentLabel, relation:'σ', matrix:data.sigma},
    kirchhoff:{label:copy.kirchhoff, config:copy.currentLabel, relation:'τ = Jσ', matrix:data.tau},
    pk1:{label:copy.pk1, config:copy.mixedLabel, relation:'P = JσF⁻ᵀ', matrix:data.P},
    pk2:{label:copy.pk2, config:copy.referenceLabel, relation:'S = F⁻¹P', matrix:data.S},
  }
  const selected=definitions[mode]

  const formula =
    notation==='Index' ? 'P_iI = J σ_ij F⁻¹_Ij,   S_IJ = F⁻¹_Ii P_iJ' :
    notation==='Matrix' ? 'P = J σ F⁻ᵀ,   S = F⁻¹P' :
    notation==='Python' ? 'P = J * sigma @ inv(F).T;  S = inv(F) @ P' :
    'P = JσF⁻ᵀ,   S = F⁻¹P,   τ = Jσ'

  return (
    <section className="module-view module-view-stacked">
      <div className="lesson-copy">
        <div className="lesson-index">D01</div>
        <h1>{copy.title}</h1>
        <p className="lead">{copy.lead}</p>

        <div className="concept-card">
          <span>{copy.key}</span>
          <strong>{copy.keyText}</strong>
        </div>

        <div className="definition">
          <div className="definition-label">{copy.current}</div>
          <div className="formula">σ, τ = Jσ</div>
          <p>σ {language==='ru'?'действует на площадке текущей конфигурации; τ удобен в энергетических и пространственных формулах.':'acts on current-area elements; τ is convenient in energetic and spatial formulations.'}</p>
        </div>

        <div className="definition">
          <div className="definition-label">{copy.reference}</div>
          <div className="formula">{formula}</div>
          <p>{language==='ru'?'P и S переносят описание сил в начальную конфигурацию и позволяют работать с материалом относительно X.':'P and S pull the force description back to the reference configuration and let us formulate material response relative to X.'}</p>
        </div>

        <div className="definition">
          <div className="definition-label">{copy.conjugacy}</div>
          <div className="formula">P:Ḟ = S:Ė = τ:D</div>
          <p>{copy.conjugacyText}</p>
        </div>

        <div className="warning-card kinematics-warning">
          <span>{copy.note}</span>
          <strong>{copy.noteTitle}</strong>
          <p>{copy.noteText}</p>
        </div>

        <DepthNote label={copy.deepen}><p>{copy.deepenText}</p></DepthNote>
        <DepthNote label={copy.research} variant="research"><p>{copy.researchText}</p></DepthNote>

        <ApplicationLinks language={language} items={[
          {ru:'Нелинейный FEM',en:'Nonlinear FEM'},
          {ru:'Гиперупругие материалы',en:'Hyperelastic materials'},
          {ru:'Мягкие ткани',en:'Soft tissues'},
          {ru:'Эластомеры и полимеры',en:'Elastomers and polymers'},
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
            {(Object.keys(definitions) as StressMode[]).map(key=>(
              <button key={key} className={mode===key?'toggle active':'toggle'} onClick={()=>setMode(key)}>
                {key==='cauchy'?'σ':key==='kirchhoff'?'τ':key==='pk1'?'P':'S'}
              </button>
            ))}
          </div>

          <svg className="balance-scene" viewBox="0 0 100 64" role="img">
            <rect x="5" y="6" width="90" height="52" rx="9" fill="#111318"/>
            <rect x="15" y="20" width="25" height="24" rx="2" fill="none" stroke="#69717C" strokeWidth=".8"/>
            <text x="15" y="16" fill="#A9E3D2" fontSize="2.5">{copy.referenceLabel}</text>
            <rect x="61" y={32-12*l2} width={25*l1} height={24*l2} rx="2" fill="rgba(169,227,210,.10)" stroke="#A9E3D2" strokeWidth="1.1"/>
            <text x="61" y="16" fill="#A9E3D2" fontSize="2.5">{copy.currentLabel}</text>
            <line x1="40" y1="32" x2="58" y2="32" stroke="#2864FF" strokeWidth="1.2"/>
            <polygon points="58,32 54.5,30 54.5,34" fill="#2864FF"/>
            <text x="47" y="28" fill="#F4F2EC" fontSize="2.4">F</text>
            <text x="15" y="52" fill="#F4F2EC" fontSize="2.3">λ₁={fmt(l1,2)}, λ₂={fmt(l2,2)}</text>
          </svg>

          <div className="control-stack">
            <label><span>{copy.l1}<strong>{fmt(l1,2)}</strong></span><input type="range" min=".65" max="1.55" step=".01" value={l1} onChange={e=>setL1(Number(e.target.value))}/></label>
            <label><span>{copy.l2}<strong>{fmt(l2,2)}</strong></span><input type="range" min=".65" max="1.55" step=".01" value={l2} onChange={e=>setL2(Number(e.target.value))}/></label>
          </div>

          <div className="transport-metrics">
            <div><span>{copy.J}</span><strong>{fmt(data.J)}</strong></div>
            <div><span>{copy.config}</span><strong>{selected.config}</strong></div>
            <div><span>{copy.relation}</span><strong>{selected.relation}</strong></div>
          </div>

          <div className="definition component-vector-card">
            <div className="definition-label">{copy.selected}: {selected.label}</div>
            <div className="basis-matrix-grid" style={{marginTop:12}}>
              {selected.matrix.flat().map((v,i)=><strong key={i}>{fmt(v)}</strong>)}
            </div>
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
