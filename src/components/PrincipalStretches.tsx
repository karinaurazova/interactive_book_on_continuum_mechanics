import { useMemo, useState } from 'react'
import type { Language, NotationMode } from '../i18n'

type Props = {
  notation: NotationMode
  language: Language
  onBack: () => void
  onNext: () => void
}

const text = {
  ru: {
    back: '← K08',
    title: 'Главные растяжения и главные направления',
    lead: 'Собственные значения тензора растяжения U имеют прямой механический смысл: это главные растяжения. Их собственные векторы задают материальные направления, которые при действии U не отклоняются, а только изменяют длину.',
    key: 'КЛЮЧЕВАЯ МЫСЛЬ',
    keyText: 'Если U Nᵢ = λᵢ Nᵢ, то направление Nᵢ остаётся своим собственным направлением, а его длина умножается на λᵢ.',
    eigen: 'Собственная задача',
    eigenText: 'Главные растяжения λ₁ и λ₂ — собственные значения U. Для C = U² соответствующие собственные значения равны λ₁² и λ₂².',
    geometry: 'Геометрический смысл',
    geometryText: 'Единичная окружность в материальной конфигурации под действием U превращается в эллипс. Его полуоси ориентированы вдоль главных направлений и имеют длины λ₁ и λ₂.',
    u11: 'U₁₁',
    u22: 'U₂₂',
    u12: 'U₁₂',
    lambda1: 'λ₁',
    lambda2: 'λ₂',
    angle1: 'направление N₁',
    angle2: 'направление N₂',
    sceneKicker: 'ГЛАВНЫЕ РАСТЯЖЕНИЯ',
    sceneTitle: 'окружность → эллипс по собственным направлениям U',
    warning: 'ВАЖНО',
    warningTitle: 'Главные растяжения — не главные деформации.',
    warningText: 'λᵢ — коэффициенты растяжения. Главные значения конкретной меры деформации зависят от выбранной меры: например, для Грина–Лагранжа это 1/2(λᵢ² − 1).',
    question: 'ВОПРОС ДЛЯ ПРОВЕРКИ',
    questionTitle: 'Что произойдёт при λ₁ = λ₂?',
    questionText: 'Растяжение становится изотропным: любое направление становится главным, а эллипс превращается обратно в окружность, только другого радиуса.',
    conclusion: 'ВЫВОД',
    conclusionTitle: 'Главные растяжения дают самый компактный геометрический язык конечной деформации.',
    conclusionText: 'Через них удобно описывать анизотропию, большие деформации и далее строить конститутивные модели.',
    interactive: 'ИНТЕРАКТИВНО',
    next: 'Перейти к предельным случаям →',
  },
  en: {
    back: '← K08',
    title: 'Principal stretches and principal directions',
    lead: 'The eigenvalues of the stretch tensor U have a direct mechanical meaning: they are the principal stretches. Their eigenvectors define material directions that do not rotate under U, but only change length.',
    key: 'KEY IDEA',
    keyText: 'If U Nᵢ = λᵢ Nᵢ, the direction Nᵢ remains its own direction and its length is multiplied by λᵢ.',
    eigen: 'Eigenproblem',
    eigenText: 'Principal stretches λ₁ and λ₂ are the eigenvalues of U. For C = U², the corresponding eigenvalues are λ₁² and λ₂².',
    geometry: 'Geometric meaning',
    geometryText: 'A unit circle in the material configuration becomes an ellipse under U. Its semi-axes align with the principal directions and have lengths λ₁ and λ₂.',
    u11: 'U₁₁',
    u22: 'U₂₂',
    u12: 'U₁₂',
    lambda1: 'λ₁',
    lambda2: 'λ₂',
    angle1: 'direction N₁',
    angle2: 'direction N₂',
    sceneKicker: 'PRINCIPAL STRETCHES',
    sceneTitle: 'circle → ellipse along the eigenvectors of U',
    warning: 'IMPORTANT',
    warningTitle: 'Principal stretches are not principal strains.',
    warningText: 'λᵢ are stretch ratios. Principal values of a strain measure depend on the chosen measure: for Green–Lagrange strain they are 1/2(λᵢ² − 1).',
    question: 'CHECKPOINT',
    questionTitle: 'What happens when λ₁ = λ₂?',
    questionText: 'The stretch becomes isotropic: every direction is principal, and the ellipse becomes a circle again, only with a different radius.',
    conclusion: 'CONCLUSION',
    conclusionTitle: 'Principal stretches provide the most compact geometric language for finite deformation.',
    conclusionText: 'They are especially useful for anisotropy, large deformation, and constitutive modeling.',
    interactive: 'INTERACTIVE',
    next: 'Continue to limiting cases →',
  },
} as const

function fmt(v:number,d=3){
  return (Math.abs(v)<1e-10?0:v).toFixed(d)
}

function eigSym2(a:number,b:number,d:number){
  const tr=a+d
  const disc=Math.sqrt((a-d)*(a-d)+4*b*b)
  const l1=(tr+disc)/2
  const l2=(tr-disc)/2

  const vec=(lambda:number):[number,number]=>{
    let x=b
    let y=lambda-a
    if (Math.hypot(x,y)<1e-10){
      x=lambda===a?1:0
      y=lambda===a?0:1
    }
    const n=Math.hypot(x,y)
    return [x/n,y/n]
  }
  return {l1,l2,n1:vec(l1),n2:vec(l2)}
}

export function PrincipalStretches({notation,language,onBack,onNext}:Props){
  const copy=text[language]
  const [u11,setU11]=useState(1.35)
  const [u22,setU22]=useState(0.82)
  const [u12,setU12]=useState(0.18)

  const eig=useMemo(()=>eigSym2(u11,u12,u22),[u11,u12,u22])
  const {l1,l2,n1,n2}=eig

  const notationLine =
    notation==='Index' ? 'Uᵢⱼ Nⱼ = λ Nᵢ' :
    notation==='Matrix' ? 'U N = λ N' :
    notation==='Python' ? 'lam, N = np.linalg.eigh(U)' :
    '𝐔𝐍ᵢ = λᵢ𝐍ᵢ'

  const circle=Array.from({length:100},(_,i)=>{
    const a=2*Math.PI*i/100
    return [Math.cos(a),Math.sin(a)] as [number,number]
  })

  const applyU=(p:[number,number])=>[
    u11*p[0]+u12*p[1],
    u12*p[0]+u22*p[1],
  ] as [number,number]

  const ellipse=circle.map(applyU)
  const mapRef=(p:[number,number])=>[28+13*p[0],40-13*p[1]]
  const mapCur=(p:[number,number])=>[72+11*p[0],40-11*p[1]]
  const linePts=(pts:[number,number][],mapper:(p:[number,number])=>number[])=>pts.map(p=>mapper(p).join(',')).join(' ')

  const n1a=Math.atan2(n1[1],n1[0])*180/Math.PI
  const n2a=Math.atan2(n2[1],n2[0])*180/Math.PI

  return (
    <section className="module-view module-view-stacked">
      <div className="lesson-copy">
        <button className="text-button" onClick={onBack}>{copy.back}</button>
        <div className="lesson-index">K09 / 13</div>
        <h1>{copy.title}</h1>
        <p className="lead">{copy.lead}</p>

        <div className="concept-card">
          <span>{copy.key}</span>
          <strong>{copy.keyText}</strong>
        </div>

        <div className="definition">
          <div className="definition-label">{copy.eigen}</div>
          <div className="formula">{notationLine}</div>
          <p>{copy.eigenText}</p>
        </div>

        <div className="definition">
          <div className="definition-label">{copy.geometry}</div>
          <p>{copy.geometryText}</p>
        </div>

        <div className="warning-card kinematics-warning">
          <span>{copy.warning}</span>
          <strong>{copy.warningTitle}</strong>
          <p>{copy.warningText}</p>
        </div>

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

          <svg className="principal-stretch-scene" viewBox="0 0 100 72" role="img">
            <rect x="5" y="6" width="90" height="60" rx="9" fill="#111318"/>
            <text x="14" y="13" fill="#8E96A3" fontSize="3.1">I</text>
            <text x="62" y="13" fill="#8E96A3" fontSize="3.1">U</text>

            <polyline points={linePts([...circle,circle[0]],mapRef)} fill="none" stroke="#69717C" strokeWidth=".7"/>
            <polyline points={linePts([...ellipse,ellipse[0]],mapCur)} fill="none" stroke="#2864FF" strokeWidth=".95"/>

            <line x1={mapRef([0,0])[0]} y1={mapRef([0,0])[1]} x2={mapRef(n1)[0]} y2={mapRef(n1)[1]} stroke="#2864FF" strokeWidth="1.2"/>
            <line x1={mapRef([0,0])[0]} y1={mapRef([0,0])[1]} x2={mapRef(n2)[0]} y2={mapRef(n2)[1]} stroke="#A9E3D2" strokeWidth="1.2"/>

            <line x1={mapCur([0,0])[0]} y1={mapCur([0,0])[1]} x2={mapCur([l1*n1[0],l1*n1[1]])[0]} y2={mapCur([l1*n1[0],l1*n1[1]])[1]} stroke="#2864FF" strokeWidth="1.4"/>
            <line x1={mapCur([0,0])[0]} y1={mapCur([0,0])[1]} x2={mapCur([l2*n2[0],l2*n2[1]])[0]} y2={mapCur([l2*n2[0],l2*n2[1]])[1]} stroke="#A9E3D2" strokeWidth="1.4"/>

            <text x="76" y="20" fill="#2864FF" fontSize="2.7">λ₁</text>
            <text x="76" y="24" fill="#A9E3D2" fontSize="2.7">λ₂</text>
          </svg>

          <div className="principal-stretch-grid">
            <div className="gradient-matrix-card">
              <span>U</span>
              <div className="gradient-matrix">
                {[u11,u12,u12,u22].map((v,i)=><strong key={i}>{fmt(v)}</strong>)}
              </div>
            </div>
            <div className="principal-values-card">
              <div><span>{copy.lambda1}</span><strong>{fmt(l1)}</strong></div>
              <div><span>{copy.lambda2}</span><strong>{fmt(l2)}</strong></div>
              <div><span>{copy.angle1}</span><strong>{fmt(n1a,1)}°</strong></div>
              <div><span>{copy.angle2}</span><strong>{fmt(n2a,1)}°</strong></div>
            </div>
          </div>

          <div className="control-stack">
            <label><span>{copy.u11} <strong>{fmt(u11,2)}</strong></span><input type="range" min="0.55" max="1.75" step="0.01" value={u11} onChange={e=>setU11(Number(e.target.value))}/></label>
            <label><span>{copy.u22} <strong>{fmt(u22,2)}</strong></span><input type="range" min="0.55" max="1.75" step="0.01" value={u22} onChange={e=>setU22(Number(e.target.value))}/></label>
            <label><span>{copy.u12} <strong>{fmt(u12,2)}</strong></span><input type="range" min="-0.40" max="0.40" step="0.01" value={u12} onChange={e=>setU12(Number(e.target.value))}/></label>
          </div>

          <div className="principal-stretch-metrics">
            <div><span>λ₁²</span><strong>{fmt(l1*l1)}</strong></div>
            <div><span>λ₂²</span><strong>{fmt(l2*l2)}</strong></div>
            <div><span>det U</span><strong>{fmt(l1*l2)}</strong></div>
            <div><span>λ₁/λ₂</span><strong>{fmt(l1/l2)}</strong></div>
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
