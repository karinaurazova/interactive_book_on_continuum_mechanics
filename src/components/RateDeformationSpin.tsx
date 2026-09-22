import { useMemo, useState } from 'react'
import type { Language, NotationMode } from '../i18n'

type Props = {
  notation: NotationMode
  language: Language
  onBack: () => void
}

type Mode = 'stretch' | 'rotation' | 'mixed'
type M2 = [[number,number],[number,number]]

const text = {
  ru: {
    back:'← T04',
    title:'Скорость деформации и локальный спин',
    lead:'Градиент скорости можно разложить на симметричную и кососимметричную части. Это разложение отделяет мгновенное изменение формы от локального вращения.',
    key:'ДВА МЕХАНИЗМА ВНУТРИ L',
    keyText:'D = 1/2(L + Lᵀ) — тензор скорости деформации, W = 1/2(L − Lᵀ) — тензор спина. Вместе они точно восстанавливают L.',
    deformation:'Тензор скорости деформации D',
    deformationText:'D отвечает за мгновенные скорости изменения длин и углов между материальными направлениями.',
    spin:'Тензор спина W',
    spinText:'W описывает локальную угловую скорость вращения малой окрестности без вклада в мгновенное изменение длины.',
    stretchMode:'чистая деформация',
    rotationMode:'чистый локальный поворот',
    mixedMode:'смешанное движение',
    sceneKicker:'РАЗЛОЖЕНИЕ ГРАДИЕНТА СКОРОСТИ',
    sceneTitle:'сравни, что делают D и W с одной и той же локальной окрестностью',
    rate:'интенсивность',
    shear:'сдвиговый вклад',
    spinRate:'угловая скорость',
    matrixL:'L',
    matrixD:'D',
    matrixW:'W',
    normD:'‖D‖',
    normW:'‖W‖',
    traceD:'tr D',
    reconstruction:'‖L − (D+W)‖',
    warning:'ВАЖНО',
    warningTitle:'W — не конечный угол поворота.',
    warningText:'W описывает мгновенную локальную скорость вращения. Для конечного поворота нужно интегрировать движение во времени; в общем случае это не сводится к простому умножению W на Δt.',
    question:'ВОПРОС ДЛЯ ПРОВЕРКИ',
    questionTitle:'Что будет при чистом жёстком вращении?',
    questionText:'D = 0, а W ≠ 0. То есть окрестность вращается, но мгновенно не деформируется.',
    conclusion:'ВЫВОД',
    conclusionTitle:'D и W разделяют локальную кинематику на деформационную и вращательную части.',
    conclusionText:'Следующим шагом свяжем tr D с изменением объёма и производной якобиана J.',
    interactive:'ИНТЕРАКТИВНО',
  },
  en: {
    back:'← T04',
    title:'Rate of deformation and local spin',
    lead:'The velocity gradient can be decomposed into symmetric and skew-symmetric parts. This separates instantaneous shape change from local rotation.',
    key:'TWO MECHANISMS INSIDE L',
    keyText:'D = 1/2(L + Lᵀ) is the rate-of-deformation tensor, while W = 1/2(L − Lᵀ) is the spin tensor. Together they reconstruct L exactly.',
    deformation:'Rate-of-deformation tensor D',
    deformationText:'D governs instantaneous rates of change of lengths and angles between material directions.',
    spin:'Spin tensor W',
    spinText:'W describes the local angular velocity of a small neighborhood without contributing to instantaneous length change.',
    stretchMode:'pure deformation',
    rotationMode:'pure local rotation',
    mixedMode:'mixed motion',
    sceneKicker:'VELOCITY-GRADIENT DECOMPOSITION',
    sceneTitle:'compare what D and W do to the same local neighborhood',
    rate:'rate magnitude',
    shear:'shear contribution',
    spinRate:'angular velocity',
    matrixL:'L',
    matrixD:'D',
    matrixW:'W',
    normD:'‖D‖',
    normW:'‖W‖',
    traceD:'tr D',
    reconstruction:'‖L − (D+W)‖',
    warning:'IMPORTANT',
    warningTitle:'W is not a finite rotation angle.',
    warningText:'W describes instantaneous local angular velocity. Finite rotation requires integrating the motion in time and is not generally obtained by simply multiplying W by Δt.',
    question:'CHECKPOINT',
    questionTitle:'What happens under pure rigid rotation?',
    questionText:'D = 0 while W ≠ 0. The neighborhood rotates but does not instantaneously deform.',
    conclusion:'CONCLUSION',
    conclusionTitle:'D and W split local kinematics into deformational and rotational parts.',
    conclusionText:'Next we connect tr D with volume change and the time derivative of the Jacobian J.',
    interactive:'INTERACTIVE',
  }
} as const

function fmt(v:number,d=3){
  return (Math.abs(v)<1e-10?0:v).toFixed(d)
}

function transpose(A:M2):M2{
  return [[A[0][0],A[1][0]],[A[0][1],A[1][1]]]
}

function add(A:M2,B:M2):M2{
  return [[A[0][0]+B[0][0],A[0][1]+B[0][1]],[A[1][0]+B[1][0],A[1][1]+B[1][1]]]
}

function sub(A:M2,B:M2):M2{
  return [[A[0][0]-B[0][0],A[0][1]-B[0][1]],[A[1][0]-B[1][0],A[1][1]-B[1][1]]]
}

function scale(A:M2,s:number):M2{
  return [[s*A[0][0],s*A[0][1]],[s*A[1][0],s*A[1][1]]]
}

function frob(A:M2){
  return Math.sqrt(A.flat().reduce((s,v)=>s+v*v,0))
}

export function RateDeformationSpin({notation,language,onBack}:Props){
  const copy=text[language]
  const [mode,setMode]=useState<Mode>('mixed')
  const [rate,setRate]=useState(0.55)
  const [shear,setShear]=useState(0.35)
  const [spin,setSpin]=useState(0.65)

  const data=useMemo(()=>{
    let L:M2
    if(mode==='stretch'){
      L=[[rate,shear],[shear,-0.35*rate]]
    }else if(mode==='rotation'){
      L=[[0,-spin],[spin,0]]
    }else{
      L=[[rate,shear-spin],[shear+spin,-0.35*rate]]
    }

    const Lt=transpose(L)
    const D=scale(add(L,Lt),0.5)
    const W=scale(sub(L,Lt),0.5)
    const rec=add(D,W)
    return {L,D,W,rec}
  },[mode,rate,shear,spin])

  const notationLine =
    notation==='Index' ? 'Dᵢⱼ = 1/2(Lᵢⱼ+Lⱼᵢ),   Wᵢⱼ = 1/2(Lᵢⱼ−Lⱼᵢ)' :
    notation==='Matrix' ? 'D = 1/2(L+Lᵀ),   W = 1/2(L−Lᵀ)' :
    notation==='Python' ? 'D = 0.5*(L+L.T); W = 0.5*(L-L.T)' :
    '𝐃 = 1/2(𝐋+𝐋ᵀ),   𝐖 = 1/2(𝐋−𝐋ᵀ)'

  const square=[[-.5,-.5],[.5,-.5],[.5,.5],[-.5,.5]] as [number,number][]
  const applyRate=(A:M2,p:[number,number],dt=.28):[number,number]=>[
    p[0]+dt*(A[0][0]*p[0]+A[0][1]*p[1]),
    p[1]+dt*(A[1][0]*p[0]+A[1][1]*p[1]),
  ]
  const map=(p:[number,number],cx:number)=>[cx+17*p[0],39-17*p[1]]
  const poly=(pts:[number,number][],cx:number)=>pts.map(p=>map(p,cx).join(',')).join(' ')
  const pD=square.map(p=>applyRate(data.D,p))
  const pW=square.map(p=>applyRate(data.W,p))
  const pL=square.map(p=>applyRate(data.L,p))

  return (
    <section className="module-view module-view-stacked">
      <div className="lesson-copy">
        <button className="text-button" onClick={onBack}>{copy.back}</button>
        <div className="lesson-index">T05 / 11</div>
        <h1>{copy.title}</h1>
        <p className="lead">{copy.lead}</p>

        <div className="concept-card">
          <span>{copy.key}</span>
          <strong>{copy.keyText}</strong>
        </div>

        <div className="definition">
          <div className="definition-label">{copy.deformation}</div>
          <div className="formula">{notationLine}</div>
          <p>{copy.deformationText}</p>
        </div>

        <div className="definition">
          <div className="definition-label">{copy.spin}</div>
          <p>{copy.spinText}</p>
        </div>

        <div className="warning-card kinematics-warning">
          <span>{copy.warning}</span>
          <strong>{copy.warningTitle}</strong>
          <p>{copy.warningText}</p>
        </div>
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

          <div className="decomp-toggle-row">
            <button className={mode==='stretch'?'decomp-toggle active':'decomp-toggle'} onClick={()=>setMode('stretch')}>{copy.stretchMode}</button>
            <button className={mode==='rotation'?'decomp-toggle active':'decomp-toggle'} onClick={()=>setMode('rotation')}>{copy.rotationMode}</button>
            <button className={mode==='mixed'?'decomp-toggle active':'decomp-toggle'} onClick={()=>setMode('mixed')}>{copy.mixedMode}</button>
          </div>

          <svg className="transport-scene" viewBox="0 0 100 70" role="img">
            <rect x="5" y="6" width="90" height="58" rx="9" fill="#111318"/>
            <text x="14" y="13" fill="#8E96A3" fontSize="2.7">D</text>
            <text x="47" y="13" fill="#8E96A3" fontSize="2.7">W</text>
            <text x="78" y="13" fill="#8E96A3" fontSize="2.7">L</text>

            <polygon points={poly(square,20)} fill="none" stroke="#5E6774" strokeWidth=".6"/>
            <polygon points={poly(pD,20)} fill="rgba(169,227,210,.08)" stroke="#A9E3D2" strokeWidth=".9"/>

            <polygon points={poly(square,50)} fill="none" stroke="#5E6774" strokeWidth=".6"/>
            <polygon points={poly(pW,50)} fill="rgba(221,122,43,.08)" stroke="#DD7A2B" strokeWidth=".9"/>

            <polygon points={poly(square,80)} fill="none" stroke="#5E6774" strokeWidth=".6"/>
            <polygon points={poly(pL,80)} fill="rgba(40,100,255,.10)" stroke="#2864FF" strokeWidth=".9"/>
          </svg>

          <div className="velocity-gradient-matrices">
            {[
              [copy.matrixL,data.L],
              [copy.matrixD,data.D],
              [copy.matrixW,data.W],
            ].map(([label,M])=>(
              <div className="gradient-matrix-card" key={String(label)}>
                <span>{label as string}</span>
                <div className="gradient-matrix">
                  {(M as M2).flat().map((v,i)=><strong key={i}>{fmt(v)}</strong>)}
                </div>
              </div>
            ))}
          </div>

          <div className="control-stack">
            {mode!=='rotation' && <>
              <label><span>{copy.rate} <strong>{fmt(rate,2)}</strong></span><input type="range" min="-.9" max=".9" step=".01" value={rate} onChange={e=>setRate(Number(e.target.value))}/></label>
              <label><span>{copy.shear} <strong>{fmt(shear,2)}</strong></span><input type="range" min="-.8" max=".8" step=".01" value={shear} onChange={e=>setShear(Number(e.target.value))}/></label>
            </>}
            {mode!=='stretch' && <label><span>{copy.spinRate} <strong>{fmt(spin,2)}</strong></span><input type="range" min="-.9" max=".9" step=".01" value={spin} onChange={e=>setSpin(Number(e.target.value))}/></label>}
          </div>

          <div className="transport-metrics">
            <div><span>{copy.normD}</span><strong>{fmt(frob(data.D))}</strong></div>
            <div><span>{copy.normW}</span><strong>{fmt(frob(data.W))}</strong></div>
            <div><span>{copy.traceD}</span><strong>{fmt(data.D[0][0]+data.D[1][1])}</strong></div>
            <div><span>{copy.reconstruction}</span><strong>{fmt(frob(sub(data.L,data.rec)),6)}</strong></div>
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
