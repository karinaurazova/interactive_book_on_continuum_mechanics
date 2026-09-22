import { useMemo, useState } from 'react'
import type { Language, NotationMode } from '../i18n'

type Props = {
  notation: NotationMode
  language: Language
  onBack: () => void
  onNext: () => void
}

type M2 = [[number,number],[number,number]]

const text = {
  ru: {
    back:'← K10',
    title:'Вычислительная лаборатория кинематики',
    lead:'Задай градиент деформации F вручную и проследи всю цепочку вычислений: от якобиана и тензоров Коши–Грина до мер деформации, полярного разложения и главных растяжений.',
    key:'ЕДИНОЕ СОСТОЯНИЕ',
    keyText:'Все представления ниже вычисляются из одной матрицы F. Если изменить один компонент, одновременно обновятся геометрия, тензоры, проверки и Python-код.',
    matrix:'Матрица F',
    presets:'Пресеты',
    identity:'I',
    stretch:'Растяжение',
    shear:'Сдвиг',
    rotation:'Поворот',
    mixed:'Смешанный',
    invalid:'J < 0',
    outputs:'Производные величины',
    checks:'Проверки',
    admissible:'J > 0',
    invertible:'невырожденность',
    polar:'F ≈ R U',
    metric:'C = FᵀF',
    ok:'OK',
    fail:'ПРОБЛЕМА',
    python:'Python / NumPy',
    sceneKicker:'KINEMATICS LAB',
    sceneTitle:'редактируй F и наблюдай всю кинематику одновременно',
    warning:'ВАЖНО',
    warningTitle:'Полярное разложение математически и физически требует аккуратной интерпретации.',
    warningText:'Для обычной деформации континуума мы ожидаем J > 0. При почти вырожденной F обратные тензоры и мера Эйлера–Альманси становятся численно неустойчивыми. При J < 0 ортогональный фактор имеет det R = −1 и содержит отражение, поэтому его нельзя интерпретировать как чистый поворот.',
    question:'ВОПРОС ДЛЯ ПРОВЕРКИ',
    questionTitle:'Что изменится при умножении F слева на чистый поворот R₀?',
    questionText:'C и главные растяжения останутся теми же, а B, R и пространственные направления повернутся.',
    conclusion:'ВЫВОД',
    conclusionTitle:'Теперь кинематическая цепочка собрана в одном вычислительном объекте.',
    conclusionText:'Этот модуль можно использовать как эталон для собственных расчётов и проверки будущих моделей.',
    interactive:'ИНТЕРАКТИВНО',
    next:'Перейти к итоговой самопроверке →',
  },
  en: {
    back:'← K10',
    title:'Computational kinematics laboratory',
    lead:'Edit the deformation gradient F directly and follow the full chain of calculations: from the Jacobian and Cauchy–Green tensors to strain measures, polar decomposition, and principal stretches.',
    key:'ONE STATE',
    keyText:'Every representation below is computed from the same F. Changing one component updates geometry, tensors, checks, and Python code simultaneously.',
    matrix:'Matrix F',
    presets:'Presets',
    identity:'Identity',
    stretch:'Stretch',
    shear:'Shear',
    rotation:'Rotation',
    mixed:'Mixed',
    invalid:'J < 0',
    outputs:'Derived quantities',
    checks:'Checks',
    admissible:'J > 0',
    invertible:'nonsingular',
    polar:'F ≈ R U',
    metric:'C = FᵀF',
    ok:'OK',
    fail:'ISSUE',
    python:'Python / NumPy',
    sceneKicker:'KINEMATICS LAB',
    sceneTitle:'edit F and watch the full kinematic chain update',
    warning:'IMPORTANT',
    warningTitle:'Polar decomposition requires careful mathematical and physical interpretation.',
    warningText:'For an ordinary continuum deformation we expect J > 0. Near-singular F makes inverse tensors and Euler–Almansi strain numerically unstable.',
    question:'CHECKPOINT',
    questionTitle:'What changes if F is left-multiplied by a pure rotation R₀?',
    questionText:'C and the principal stretches remain unchanged, while B, R, and spatial directions rotate.',
    conclusion:'CONCLUSION',
    conclusionTitle:'The kinematic chain is now assembled into one computational object.',
    conclusionText:'Use this module as a reference for your own calculations and future model checks.',
    interactive:'INTERACTIVE',
    next:'Continue to the final self-check →',
  }
} as const

function fmt(v:number,d=3){
  if(!Number.isFinite(v)) return '—'
  return (Math.abs(v)<1e-10?0:v).toFixed(d)
}
function mul(a:M2,b:M2):M2{
  return [
    [a[0][0]*b[0][0]+a[0][1]*b[1][0],a[0][0]*b[0][1]+a[0][1]*b[1][1]],
    [a[1][0]*b[0][0]+a[1][1]*b[1][0],a[1][0]*b[0][1]+a[1][1]*b[1][1]],
  ]
}
function tr(a:M2):M2{return [[a[0][0],a[1][0]],[a[0][1],a[1][1]]]}
function det(a:M2){return a[0][0]*a[1][1]-a[0][1]*a[1][0]}
function inv(a:M2):M2|null{
  const d=det(a)
  if(Math.abs(d)<1e-8) return null
  return [[a[1][1]/d,-a[0][1]/d],[-a[1][0]/d,a[0][0]/d]]
}
function subIHalf(a:M2):M2{
  return [[.5*(a[0][0]-1),.5*a[0][1]],[.5*a[1][0],.5*(a[1][1]-1)]]
}
function halfIminus(a:M2):M2{
  return [[.5*(1-a[0][0]),-.5*a[0][1]],[-.5*a[1][0],.5*(1-a[1][1])]]
}
function frob(a:M2){return Math.sqrt(a.flat().reduce((s,v)=>s+v*v,0))}
function diff(a:M2,b:M2):M2{return [[a[0][0]-b[0][0],a[0][1]-b[0][1]],[a[1][0]-b[1][0],a[1][1]-b[1][1]]]}
function eigSym(a:M2){
  const aa=a[0][0], b=.5*(a[0][1]+a[1][0]), dd=a[1][1]
  const disc=Math.sqrt((aa-dd)**2+4*b*b)
  return [(aa+dd+disc)/2,(aa+dd-disc)/2]
}
function sqrtSPD(a:M2):M2|null{
  const d=det(a)
  if(d<=1e-12) return null
  const s=Math.sqrt(d)
  const q=Math.sqrt(a[0][0]+a[1][1]+2*s)
  if(q<1e-10) return null
  return [[(a[0][0]+s)/q,a[0][1]/q],[a[1][0]/q,(a[1][1]+s)/q]]
}
function matrixCode(a:M2){
  return `np.array([[${a[0][0].toFixed(4)}, ${a[0][1].toFixed(4)}],\n          [${a[1][0].toFixed(4)}, ${a[1][1].toFixed(4)}]])`
}

export function KinematicsComputationalLab({notation,language,onBack,onNext}:Props){
  const copy=text[language]
  const [F,setF]=useState<M2>([[1.20,0.32],[0.10,0.88]])

  const data=useMemo(()=>{
    const J=det(F)
    const C=mul(tr(F),F)
    const B=mul(F,tr(F))
    const E=subIHalf(C)
    const Binv=inv(B)
    const e=Binv?halfIminus(Binv):null
    const U=sqrtSPD(C)
    const Uinv=U?inv(U):null
    const R=Uinv?mul(F,Uinv):null
    const detR=R?det(R):NaN
    const properRotation=R&&detR>0
    const V=properRotation&&U?mul(mul(R,U),tr(R)):null
    const eig=eigSym(C)
    const lambdas=eig.map(v=>v>=0?Math.sqrt(v):NaN)
    const polarError=R&&U?frob(diff(F,mul(R,U))):Infinity
    const metricError=frob(diff(C,mul(tr(F),F)))
    return {J,C,B,E,e,U,R,V,lambdas,polarError,metricError,detR,properRotation}
  },[F])

  const setEntry=(i:number,j:number,value:string)=>{
    const n=Number(value)
    if(!Number.isFinite(n)) return
    setF(prev=>prev.map((r,ri)=>r.map((v,cj)=>ri===i&&cj===j?n:v)) as M2)
  }

  const presets=[
    [copy.identity,[[1,0],[0,1]] as M2],
    [copy.stretch,[[1.35,0],[0,.82]] as M2],
    [copy.shear,[[1,.55],[0,1]] as M2],
    [copy.rotation,[[Math.cos(.6),-Math.sin(.6)],[Math.sin(.6),Math.cos(.6)]] as M2],
    [copy.mixed,[[1.20,.32],[.10,.88]] as M2],
    [copy.invalid,[[-1,0],[0,1]] as M2],
  ] as const

  const validJ=data.J>0
  const nonsingular=Math.abs(data.J)>1e-8
  const polarOK=data.properRotation && data.polarError<1e-7
  const metricOK=data.metricError<1e-10

  const square:[[number,number],[number,number],[number,number],[number,number]]=[[0,0],[1,0],[1,1],[0,1]]
  const mapped=square.map(([x,y])=>[F[0][0]*x+F[0][1]*y,F[1][0]*x+F[1][1]*y] as [number,number])
  const ref=(p:[number,number])=>[27+14*p[0],43-14*p[1]]
  const cur=(p:[number,number])=>[70+11*p[0],43-11*p[1]]
  const poly=(pts:[number,number][],m:(p:[number,number])=>number[])=>pts.map(p=>m(p).join(',')).join(' ')

  const notationLine =
    notation==='Index' ? 'Cᵢⱼ = FₖᵢFₖⱼ,   Eᵢⱼ = 1/2(Cᵢⱼ−δᵢⱼ)' :
    notation==='Matrix' ? 'C=FᵀF, B=FFᵀ, E=1/2(C−I)' :
    notation==='Python' ? 'C=F.T@F; B=F@F.T' :
    '𝐂=𝐅ᵀ𝐅,  𝐁=𝐅𝐅ᵀ,  𝐄=1/2(𝐂−𝐈)'

  const python=`import numpy as np

F = ${matrixCode(F)}
J = np.linalg.det(F)

C = F.T @ F
B = F @ F.T
E = 0.5 * (C - np.eye(2))

if abs(J) > 1e-12:
    e = 0.5 * (np.eye(2) - np.linalg.inv(B))

lam2, N = np.linalg.eigh(C)
lam = np.sqrt(np.clip(lam2, 0.0, None))

# right stretch and rotation
w, Q = np.linalg.eigh(C)
U = Q @ np.diag(np.sqrt(np.clip(w, 0.0, None))) @ Q.T
R = F @ np.linalg.inv(U)
if np.linalg.det(R) > 0:
    V = R @ U @ R.T
else:
    print("orthogonal factor contains a reflection: det(R) <= 0")

print("J =", J)
print("principal stretches =", lam)`

  const cards:[string,M2|null][]=[
    ['C',data.C],['B',data.B],['E',data.E],['e',data.e],
    ['U',data.U],['V',data.V],['R',data.properRotation?data.R:null]
  ]

  return (
    <section className="module-view module-view-stacked">
      <div className="lesson-copy">
        <button className="text-button" onClick={onBack}>{copy.back}</button>
        <div className="lesson-index">K11 / 13</div>
        <h1>{copy.title}</h1>
        <p className="lead">{copy.lead}</p>
        <div className="concept-card"><span>{copy.key}</span><strong>{copy.keyText}</strong></div>
        <div className="definition"><div className="definition-label">{copy.outputs}</div><div className="formula">{notationLine}</div></div>
        <div className="warning-card kinematics-warning"><span>{copy.warning}</span><strong>{copy.warningTitle}</strong><p>{copy.warningText}</p></div>
        <button className="primary-button" onClick={onNext}>{copy.next}</button>
      </div>

      <div className="scene-column">
        <div className="scene-card lab-card">
          <div className="scene-head">
            <div><span className="scene-kicker">{copy.sceneKicker}</span><h2>{copy.sceneTitle}</h2></div>
            <div className="live-badge">{copy.interactive}</div>
          </div>

          <div className="kin-lab-top">
            <div className="lab-section">
              <div className="lab-section-head"><strong>{copy.matrix}</strong><span>2 × 2</span></div>
              <div className="lab-presets">
                {presets.map(([label,m])=><button key={label} onClick={()=>setF(m)}>{label}</button>)}
              </div>
              <div className="kin-lab-matrix-editor">
                {F.flatMap((row,i)=>row.map((v,j)=><input key={`${i}-${j}`} aria-label={`F${i+1}${j+1}`} type="number" step=".01" value={v} onChange={e=>setEntry(i,j,e.target.value)}/>))}
              </div>
              <div className="kin-lab-primary">
                <div><span>J = det F</span><strong>{fmt(data.J)}</strong></div>
                <div><span>λ₁, λ₂</span><strong>{fmt(data.lambdas[0])}, {fmt(data.lambdas[1])}</strong></div>
              </div>
            </div>

            <svg className="kin-lab-scene" viewBox="0 0 100 72">
              <rect x="5" y="6" width="90" height="60" rx="9" fill="#111318"/>
              <text x="14" y="13" fill="#8E96A3" fontSize="3">Ω₀</text>
              <text x="62" y="13" fill="#8E96A3" fontSize="3">F Ω₀</text>
              <polygon points={poly(square,ref)} fill="rgba(244,242,236,.04)" stroke="#69717C" strokeWidth=".8"/>
              <polygon points={poly(mapped,cur)} fill={validJ?"rgba(40,100,255,.10)":"rgba(221,122,43,.15)"} stroke={validJ?"#2864FF":"#DD7A2B"} strokeWidth="1"/>
            </svg>
          </div>

          <div className="kin-lab-output-grid">
            {cards.map(([label,m])=>(
              <div className="gradient-matrix-card" key={label}>
                <span>{label}</span>
                {m ? <div className="gradient-matrix">{m.flat().map((v,i)=><strong key={i}>{fmt(v)}</strong>)}</div> : <strong className="kin-lab-unavailable">—</strong>}
              </div>
            ))}
          </div>

          <div className="lab-checks">
            <div className="lab-section-head"><strong>{copy.checks}</strong><span>sanity checks</span></div>
            <div className="lab-check-grid">
              {[
                [copy.admissible,validJ,fmt(data.J)],
                [copy.invertible,nonsingular,fmt(Math.abs(data.J))],
                [copy.polar,polarOK,fmt(data.polarError,6)],
                [copy.metric,metricOK,fmt(data.metricError,6)],
              ].map(([label,ok,val])=>(
                <div className={ok?'lab-check ok':'lab-check fail'} key={String(label)}>
                  <span>{label}</span><strong>{ok?copy.ok:copy.fail}</strong><small>{val}</small>
                </div>
              ))}
            </div>
          </div>

          <div className="lab-python">
            <div className="lab-section-head"><strong>{copy.python}</strong><span>NumPy</span></div>
            <pre><code>{python}</code></pre>
          </div>
        </div>

        <div className="bottom-grid">
          <div className="prediction-card"><span>{copy.question}</span><strong>{copy.questionTitle}</strong><p>{copy.questionText}</p></div>
          <div className="author-card"><span>{copy.conclusion}</span><strong>{copy.conclusionTitle}</strong><p>{copy.conclusionText}</p></div>
        </div>
      </div>
    </section>
  )
}
