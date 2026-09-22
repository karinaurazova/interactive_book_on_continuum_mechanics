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

const text = {
  ru: {
    title:'Инварианты деформации и объективная гиперупругость',
    lead:'Для изотропного гиперупругого материала энергию удобно выражать не через отдельные компоненты C, а через его инварианты. Тогда модель автоматически не зависит от выбора системы координат и жёсткого поворота наблюдателя.',
    key:'ИНВАРИАНТЫ ОТДЕЛЯЮТ ДЕФОРМАЦИЮ ОТ ПОВОРОТА',
    keyText:'При F* = QF имеем C* = F*ᵀF* = C. Поэтому I₁, I₂ и I₃ не меняются при наложенном жёстком повороте Q.',
    invariants:'Три главных инварианта C',
    invariantsText:'Для трёхмерной задачи I₁ = tr C, I₂ = 1/2[(tr C)² − tr(C²)], I₃ = det C = J².',
    isotropic:'Изотропная гиперупругость',
    isotropicText:'Объективную изотропную энергию можно записать как Ψ = Ψ(I₁, I₂, J). Это фундамент для модели Нео–Гука (Neo-Hookean), Муни–Ривлина (Mooney–Rivlin) и многих других моделей.',
    sceneKicker:'ПРОВЕРКА ОБЪЕКТИВНОСТИ',
    sceneTitle:'меняй растяжения и жёсткий поворот — инварианты должны сохраняться',
    l1:'λ₁',
    l2:'λ₂',
    angle:'поворот φ',
    I1:'I₁',
    I2:'I₂',
    J:'J',
    delta:'макс. изменение инварианта',
    psi:'Ψ(I₁,J)',
    checkpoint:'ВОПРОС ДЛЯ ПРОВЕРКИ',
    checkpointTitle:'Изменится ли Ψ после чистого поворота деформированного тела?',
    checkpointText:'Если Ψ построена из объективных инвариантов C, то нет: жёсткий поворот меняет F, но не меняет C и его инварианты.',
    conclusion:'ВЫВОД',
    conclusionTitle:'Изотропную гиперупругость естественно строить на инвариантах.',
    conclusionText:'Следующий шаг — разобрать конкретные модели: Нео–Гука и Муни–Ривлина и увидеть, что именно добавляет зависимость от I₂.',
    deepen:'Углубиться',
    deepenText:'Для спектрального разложения C собственные значения равны λ₁², λ₂², λ₃², поэтому I₁, I₂ и I₃ можно выражать напрямую через главные растяжения.',
    research:'Исследовательское замечание',
    researchText:'Для анизотропных материалов одних I₁–I₃ недостаточно: вводят структурные тензоры и псевдоинварианты, например I₄ = a₀·C a₀. Именно это позже позволит перейти к моделям армированных композитов и мягких тканей.',
    warning:'ВАЖНО',
    warningTitle:'Объективность и изотропия — не одно и то же.',
    warningText:'Объективность относится к смене наблюдателя, а изотропия — к симметрии самого материала. Анизотропная модель тоже обязана быть объективной.',
    back:'← D02',
    next:'D04 → Нео–Гук и Муни–Ривлин',
    interactive:'ИНТЕРАКТИВНО',
  },
  en: {
    title:'Deformation invariants and objective hyperelasticity',
    lead:'For an isotropic hyperelastic material, it is natural to express energy through invariants of C rather than through individual components. This makes the constitutive law independent of basis choice and superposed rigid rotation.',
    key:'INVARIANTS SEPARATE DEFORMATION FROM ROTATION',
    keyText:'Under F* = QF we obtain C* = F*ᵀF* = C. Therefore I₁, I₂, and I₃ remain unchanged under a superposed rigid rotation Q.',
    invariants:'Three principal invariants of C',
    invariantsText:'In three dimensions, I₁ = tr C, I₂ = 1/2[(tr C)² − tr(C²)], and I₃ = det C = J².',
    isotropic:'Isotropic hyperelasticity',
    isotropicText:'An objective isotropic energy can be written as Ψ = Ψ(I₁, I₂, J). This is the basis of Neo-Hookean, Mooney–Rivlin, and many other models.',
    sceneKicker:'ПРОВЕРКА ОБЪЕКТИВНОСТИ',
    sceneTitle:'vary stretches and rigid rotation — the invariants should stay unchanged',
    l1:'λ₁',
    l2:'λ₂',
    angle:'rotation φ',
    I1:'I₁',
    I2:'I₂',
    J:'J',
    delta:'max invariant change',
    psi:'Ψ(I₁,J)',
    checkpoint:'CHECKPOINT',
    checkpointTitle:'Does Ψ change after a pure rotation of an already deformed body?',
    checkpointText:'If Ψ is built from objective invariants of C, no: rigid rotation changes F but not C or its invariants.',
    conclusion:'CONCLUSION',
    conclusionTitle:'Isotropic hyperelasticity is naturally built from invariants.',
    conclusionText:'Next we compare concrete models: Neo-Hookean and Mooney–Rivlin and see what an I₂-dependence adds.',
    deepen:'Go deeper',
    deepenText:'In the spectral decomposition of C, its eigenvalues are λ₁², λ₂², λ₃², so I₁, I₂, and I₃ can be written directly in terms of principal stretches.',
    research:'Research note',
    researchText:'For anisotropic materials, I₁–I₃ are not enough: structural tensors and pseudo-invariants such as I₄ = a₀·C a₀ are introduced. This later opens the path to fiber-reinforced composites and soft tissues.',
    warning:'IMPORTANT',
    warningTitle:'Objectivity and isotropy are not the same thing.',
    warningText:'Objectivity concerns observer changes; isotropy concerns material symmetry. An anisotropic constitutive law must still be objective.',
    back:'← D02',
    next:'D04 → Нео–Гук и Муни–Ривлин',
    interactive:'INTERACTIVE',
  }
} as const

function fmt(v:number,d=4){ return (Math.abs(v)<1e-12?0:v).toFixed(d) }

function invariants2D(F:number[][]){
  const C=[
    [F[0][0]*F[0][0]+F[1][0]*F[1][0], F[0][0]*F[0][1]+F[1][0]*F[1][1]],
    [F[0][1]*F[0][0]+F[1][1]*F[1][0], F[0][1]*F[0][1]+F[1][1]*F[1][1]],
  ]
  const I1=C[0][0]+C[1][1]
  const detC=C[0][0]*C[1][1]-C[0][1]*C[1][0]
  const I2=detC
  const J=F[0][0]*F[1][1]-F[0][1]*F[1][0]
  return {C,I1,I2,J}
}

export function DeformationInvariants({notation,language,onBack,onNext}:Props){
  const copy=text[language]
  const [l1,setL1]=useState(1.25)
  const [l2,setL2]=useState(.85)
  const [angle,setAngle]=useState(55)

  const data=useMemo(()=>{
    const a=angle*Math.PI/180
    const c=Math.cos(a), s=Math.sin(a)
    const F0=[[l1,0],[0,l2]]
    const Fq=[[c*l1,-s*l2],[s*l1,c*l2]]
    const base=invariants2D(F0)
    const rotated=invariants2D(Fq)
    const delta=Math.max(
      Math.abs(base.I1-rotated.I1),
      Math.abs(base.I2-rotated.I2),
      Math.abs(base.J-rotated.J),
    )
    const mu=12, kappa=40
    const logJ=Math.log(Math.max(base.J,1e-8))
    const psi=.5*mu*(base.I1-2-2*logJ)+.5*kappa*logJ*logJ
    return {base,rotated,delta,psi}
  },[l1,l2,angle])

  const formula =
    notation==='Index' ? 'I₁ = C_II,   I₂ = 1/2[(C_II)² − C_IJ C_JI],   I₃ = det(C)' :
    notation==='Matrix' ? 'I₁ = tr(C),   I₂ = 1/2[(tr C)² − tr(C²)],   I₃ = det(C)' :
    notation==='Python' ? 'I1=np.trace(C); I2=.5*(I1**2-np.trace(C@C)); I3=np.linalg.det(C)' :
    'I₁ = tr C,   I₂ = 1/2[(tr C)² − tr(C²)],   I₃ = det C = J²'

  const w=23*l1
  const h=21*l2
  const x=73-w/2
  const y=33-h/2

  return (
    <section className="module-view module-view-stacked">
      <div className="lesson-copy">
        <div className="lesson-index">D03</div>
        <h1>{copy.title}</h1>
        <p className="lead">{copy.lead}</p>

        <div className="concept-card">
          <span>{copy.key}</span>
          <strong>{copy.keyText}</strong>
        </div>

        <div className="definition">
          <div className="definition-label">{copy.invariants}</div>
          <div className="formula">{formula}</div>
          <p>{copy.invariantsText}</p>
        </div>

        <div className="definition">
          <div className="definition-label">{copy.isotropic}</div>
          <div className="formula">Ψ = Ψ(I₁, I₂, J)</div>
          <p>{copy.isotropicText}</p>
        </div>

        <div className="warning-card kinematics-warning">
          <span>{copy.warning}</span>
          <strong>{copy.warningTitle}</strong>
          <p>{copy.warningText}</p>
        </div>

        <DepthNote label={copy.deepen}><p>{copy.deepenText}</p></DepthNote>
        <DepthNote label={copy.research} variant="research"><p>{copy.researchText}</p></DepthNote>

        <ApplicationLinks language={language} items={[
          {ru:'Изотропные эластомеры',en:'Isotropic elastomers'},
          {ru:'Нелинейный МКЭ',en:'Nonlinear FEM'},
          {ru:'Мягкие ткани',en:'Soft tissues'},
          {ru:'Армированные композиты',en:'Fiber-reinforced composites'},
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

          <svg className="balance-scene" viewBox="0 0 100 66" role="img">
            <rect x="5" y="6" width="90" height="54" rx="9" fill="#111318"/>
            <rect x="16" y="22" width={23*l1} height={21*l2} rx="2" fill="rgba(40,100,255,.08)" stroke="#2864FF" strokeWidth="1"/>
            <text x="16" y="17" fill="#F4F2EC" fontSize="2.4">F = U</text>
            <g transform={"rotate("+angle+" 73 33)"}>
              <rect x={x} y={y} width={w} height={h} rx="2" fill="rgba(169,227,210,.10)" stroke="#A9E3D2" strokeWidth="1.1"/>
            </g>
            <text x="63" y="17" fill="#F4F2EC" fontSize="2.4">F* = QF</text>
            <text x="42" y="55" fill="#A9E3D2" fontSize="2.3">C* = C</text>
          </svg>

          <div className="control-stack">
            <label><span>{copy.l1}<strong>{fmt(l1,2)}</strong></span><input type="range" min=".65" max="1.55" step=".01" value={l1} onChange={e=>setL1(Number(e.target.value))}/></label>
            <label><span>{copy.l2}<strong>{fmt(l2,2)}</strong></span><input type="range" min=".65" max="1.55" step=".01" value={l2} onChange={e=>setL2(Number(e.target.value))}/></label>
            <label><span>{copy.angle}<strong>{fmt(angle,0)}°</strong></span><input type="range" min="0" max="180" step="1" value={angle} onChange={e=>setAngle(Number(e.target.value))}/></label>
          </div>

          <div className="transport-metrics">
            <div><span>{copy.I1}</span><strong>{fmt(data.base.I1)}</strong></div>
            <div><span>{copy.I2}</span><strong>{fmt(data.base.I2)}</strong></div>
            <div><span>{copy.J}</span><strong>{fmt(data.base.J)}</strong></div>
          </div>

          <div className="transport-metrics metrics-secondary">
            <div><span>{copy.delta}</span><strong>{data.delta.toExponential(2)}</strong></div>
            <div><span>{copy.psi}</span><strong>{fmt(data.psi)}</strong></div>
            <div><span>{language==='ru'?'C₁₂ после Q':'C₁₂ after Q'}</span><strong>{fmt(data.rotated.C[0][1])}</strong></div>
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
