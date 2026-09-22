import { useMemo, useState } from 'react'
import type { Language, NotationMode } from '../i18n'

type Props = {
  notation: NotationMode
  language: Language
  onBack: () => void
}

type M2 = [[number,number],[number,number]]

const text = {
  ru: {
    back:'← K11',
    title:'Итоговая самопроверка по кинематике',
    lead:'Теперь без готовых пресетов. Меняй F вручную и по очереди найди четыре характерных состояния. Условие считается выполненным только после того, как ты сам его зафиксируешь.',
    key:'РЕЖИМ САМОПРОВЕРКИ',
    keyText:'Нужно связать матрицу F с физическим смыслом: жёсткое движение, сохранение площади, изотропное растяжение и полярное разложение.',
    task1:'Найди чистое жёсткое движение',
    task1Text:'Добейся J ≈ 1 и ‖E‖ < 0.02, но F не должна совпадать с I.',
    task2:'Найди деформацию при J ≈ 1',
    task2Text:'Сохрани площадь, но сделай ‖E‖ > 0.08.',
    task3:'Найди изотропное растяжение',
    task3Text:'Добейся |λ₁ − λ₂| < 0.02, причём растяжение должно отличаться от единицы.',
    task4:'Проверь полярное разложение',
    task4Text:'Для допустимой F убедись, что F ≈ R U с малой численной ошибкой.',
    capture:'зафиксировать',
    verify:'проверить',
    reset:'сбросить',
    complete:'выполнено',
    pending:'не выполнено',
    progress:'Прогресс',
    sceneKicker:'ИТОГОВАЯ САМОПРОВЕРКА',
    sceneTitle:'одна матрица F — четыре кинематических режима',
    j:'J',
    strain:'‖E‖',
    lambda:'λ₁, λ₂',
    polar:'‖F − RU‖',
    finish:'Глава по кинематике завершена',
    finishText:'Ты связал движение, градиент деформации, изменение площади, меры деформации, полярное разложение и главные растяжения в единую систему.',
    interactive:'ИНТЕРАКТИВНО',
  },
  en: {
    back:'← K11',
    title:'Final kinematics self-check',
    lead:'No ready-made presets now. Edit F directly and find four characteristic states. A task is completed only after you explicitly capture or verify it.',
    key:'SELF-CHECK MODE',
    keyText:'Connect the matrix F with physical meaning: rigid motion, area preservation, isotropic stretch, and polar decomposition.',
    task1:'Find a pure rigid motion',
    task1Text:'Reach J ≈ 1 and ‖E‖ < 0.02, but F must differ from I.',
    task2:'Find deformation with J ≈ 1',
    task2Text:'Preserve area while making ‖E‖ > 0.08.',
    task3:'Find isotropic stretch',
    task3Text:'Reach |λ₁ − λ₂| < 0.02, with stretch different from one.',
    task4:'Verify polar decomposition',
    task4Text:'For an admissible F, verify F ≈ R U with small numerical error.',
    capture:'capture',
    verify:'verify',
    reset:'reset',
    complete:'completed',
    pending:'pending',
    progress:'Progress',
    sceneKicker:'FINAL SELF-CHECK',
    sceneTitle:'one matrix F — four kinematic regimes',
    j:'J',
    strain:'‖E‖',
    lambda:'λ₁, λ₂',
    polar:'‖F − RU‖',
    finish:'Kinematics chapter completed',
    finishText:'You linked motion, deformation gradient, area change, strain measures, polar decomposition, and principal stretches into one system.',
    interactive:'INTERACTIVE',
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
  if(Math.abs(d)<1e-9) return null
  return [[a[1][1]/d,-a[0][1]/d],[-a[1][0]/d,a[0][0]/d]]
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

export function KinematicsFinalChallenge({notation,language,onBack}:Props){
  const copy=text[language]
  const [F,setF]=useState<M2>([[1,0],[0,1]])
  const [done,setDone]=useState([false,false,false,false])

  const data=useMemo(()=>{
    const J=det(F)
    const C=mul(tr(F),F)
    const E:M2=[[.5*(C[0][0]-1),.5*C[0][1]],[.5*C[1][0],.5*(C[1][1]-1)]]
    const eig=eigSym(C)
    const lam=eig.map(v=>v>=0?Math.sqrt(v):NaN)
    const U=sqrtSPD(C)
    const Uinv=U?inv(U):null
    const R=Uinv?mul(F,Uinv):null
    const polarError=R&&U?frob(diff(F,mul(R,U))):Infinity
    const identityError=frob(diff(F,[[1,0],[0,1]]))
    return {J,E,strain:frob(E),lam,U,R,polarError,identityError}
  },[F])

  const conditions=[
    Math.abs(data.J-1)<.02 && data.strain<.02 && data.identityError>.08,
    Math.abs(data.J-1)<.02 && data.strain>.08,
    Math.abs(data.lam[0]-data.lam[1])<.02 && Math.abs(.5*(data.lam[0]+data.lam[1])-1)>.08,
    data.J>0 && data.polarError<1e-7,
  ]

  const mark=(i:number)=>{
    if(!conditions[i]) return
    setDone(prev=>prev.map((v,j)=>j===i?true:v))
  }

  const setEntry=(i:number,j:number,s:string)=>{
    const v=Number(s)
    if(!Number.isFinite(v)) return
    setF(prev=>prev.map((row,ri)=>row.map((x,cj)=>ri===i&&cj===j?v:x)) as M2)
  }

  const completed=done.filter(Boolean).length
  const notationLine =
    notation==='Index' ? 'Fᵢⱼ = ∂xᵢ/∂Xⱼ' :
    notation==='Matrix' ? 'F = ∂x/∂X' :
    notation==='Python' ? 'F = np.array([[...], [...]])' :
    '𝐅 = ∂𝐱/∂𝐗'

  const square=[[0,0],[1,0],[1,1],[0,1]] as [number,number][]
  const mapped=square.map(([x,y])=>[F[0][0]*x+F[0][1]*y,F[1][0]*x+F[1][1]*y] as [number,number])
  const ref=(p:[number,number])=>[27+14*p[0],43-14*p[1]]
  const cur=(p:[number,number])=>[70+11*p[0],43-11*p[1]]
  const poly=(pts:[number,number][],m:(p:[number,number])=>number[])=>pts.map(p=>m(p).join(',')).join(' ')

  const tasks=[
    [copy.task1,copy.task1Text],
    [copy.task2,copy.task2Text],
    [copy.task3,copy.task3Text],
    [copy.task4,copy.task4Text],
  ]

  return (
    <section className="module-view module-view-stacked">
      <div className="lesson-copy">
        <button className="text-button" onClick={onBack}>{copy.back}</button>
        <div className="lesson-index">K12 / 13</div>
        <h1>{copy.title}</h1>
        <p className="lead">{copy.lead}</p>
        <div className="concept-card"><span>{copy.key}</span><strong>{copy.keyText}</strong></div>
        <div className="definition"><div className="definition-label">F</div><div className="formula">{notationLine}</div></div>
      </div>

      <div className="scene-column">
        <div className="scene-card">
          <div className="scene-head">
            <div><span className="scene-kicker">{copy.sceneKicker}</span><h2>{copy.sceneTitle}</h2></div>
            <div className="live-badge">{copy.interactive}</div>
          </div>

          <div className="kin-challenge-grid">
            <div>
              <div className="kin-lab-matrix-editor">
                {F.flatMap((row,i)=>row.map((v,j)=><input key={`${i}-${j}`} type="number" step=".01" value={v} onChange={e=>setEntry(i,j,e.target.value)}/>))}
              </div>

              <svg className="kin-challenge-scene" viewBox="0 0 100 72">
                <rect x="5" y="6" width="90" height="60" rx="9" fill="#111318"/>
                <polygon points={poly(square,ref)} fill="rgba(244,242,236,.04)" stroke="#69717C" strokeWidth=".8"/>
                <polygon points={poly(mapped,cur)} fill={data.J>0?"rgba(40,100,255,.10)":"rgba(221,122,43,.15)"} stroke={data.J>0?"#2864FF":"#DD7A2B"} strokeWidth="1"/>
              </svg>

              <div className="kin-challenge-metrics">
                <div><span>{copy.j}</span><strong>{fmt(data.J)}</strong></div>
                <div><span>{copy.strain}</span><strong>{fmt(data.strain)}</strong></div>
                <div><span>{copy.lambda}</span><strong>{fmt(data.lam[0])}, {fmt(data.lam[1])}</strong></div>
                <div><span>{copy.polar}</span><strong>{fmt(data.polarError,6)}</strong></div>
              </div>

              <button className="text-button challenge-reset" onClick={()=>{
                setF([[1,0],[0,1]])
                setDone([false,false,false,false])
              }}>{copy.reset}</button>
            </div>

            <div className="challenge-task-list">
              {tasks.map(([title,body],i)=>(
                <div className={done[i]?'challenge-task done':'challenge-task'} key={i}>
                  <div className="challenge-task-status">{done[i]?'✓':i+1}</div>
                  <div>
                    <strong>{title}</strong>
                    <p>{body}</p>
                    <button
                      className={conditions[i]&&!done[i]?'kin-challenge-capture':'kin-challenge-capture disabled'}
                      disabled={!conditions[i]||done[i]}
                      onClick={()=>mark(i)}
                    >
                      {i===3?copy.verify:copy.capture}
                    </button>
                    <small>{done[i]?copy.complete:copy.pending}</small>
                  </div>
                </div>
              ))}

              <div className="challenge-progress-card">
                <div className="progress-head"><span>{copy.progress}</span><span>{completed} / 4</span></div>
                <div className="progress-track"><div className="progress-fill" style={{width:`${completed*25}%`}}/></div>
              </div>
            </div>
          </div>

          {completed===4 && <div className="challenge-finish"><strong>{copy.finish}</strong><p>{copy.finishText}</p></div>}
        </div>
      </div>
    </section>
  )
}
