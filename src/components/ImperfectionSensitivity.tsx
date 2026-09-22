import { useMemo, useState } from 'react'
import type { Language, NotationMode } from '../i18n'
import { DepthNote } from './DepthNote'
import { ApplicationLinks } from './ApplicationLinks'

type Props={notation:NotationMode;language:Language;onBack?:()=>void}

const text={
ru:{
 title:'Чувствительность к несовершенствам и реальная потеря устойчивости',
 lead:'Идеальная модель может иметь точную симметрию и красивую бифуркацию, но реальная конструкция почти всегда содержит геометрические отклонения, неоднородность материала или неточность нагружения. Даже очень малое несовершенство способно заметно изменить критический путь.',
 key:'НЕСОВЕРШЕНСТВО НЕ ОБЯЗАТЕЛЬНО СИЛЬНО МЕНЯЕТ УРАВНЕНИЯ — НО МОЖЕТ СИЛЬНО МЕНЯТЬ НАБЛЮДАЕМЫЙ ПУТЬ',
 keyText:'В идеальной симметричной задаче после критической точки возможны несколько эквивалентных ветвей. Малое несовершенство заранее выделяет одно направление и снимает точную симметрию.',
 perfect:'Идеальная система',imperfect:'Система с несовершенством',
 geometry:'геометрическое несовершенство ε',sensitivity:'чувствительность β',load:'параметр нагрузки λ',
 selected:'выбранная ветвь',symmetric:'симметрия сохранена',broken:'симметрия нарушена',
 sceneKicker:'ИДЕАЛЬНАЯ МОДЕЛЬ ↔ РЕАЛЬНАЯ СИСТЕМА',sceneTitle:'увеличивай малое несовершенство и наблюдай, как меняется посткритический путь',
 checkpoint:'ПРОВЕРЬ ИНТУИЦИЮ',checkpointTitle:'Почему нельзя сравнивать эксперимент с идеально симметричной моделью только по критической нагрузке?',
 checkpointText:'Потому что экспериментальная система уже содержит несовершенства. Они могут заранее выбрать форму потери устойчивости, изменить максимальную нагрузку и сгладить идеальную бифуркацию.',
 conclusion:'ВЫВОД',conclusionTitle:'Чем ближе система к потере устойчивости, тем важнее становится информация о малых несовершенствах.',
 conclusionText:'Поэтому нелинейный расчёт устойчивости часто включает анализ чувствительности: одну и ту же модель решают для семейства малых возмущений и сравнивают не только критическую точку, но и весь путь нагружения.',
 deepen:'Углубиться',deepenText:'Минимальная нормальная форма с несовершенством может быть записана как q³−μq−ε=0. При ε=0 сохраняется точная симметрия q↔−q; при ε≠0 она нарушается, и одна ветвь становится предпочтительной.',
 research:'Исследовательское замечание',researchText:'Для тонких оболочек и других сильно чувствительных систем экспериментальная несущая способность может существенно зависеть от формы и амплитуды исходных геометрических отклонений, поэтому один расчёт идеальной геометрии недостаточен.',
 warning:'ВАЖНО',warningTitle:'Несовершенство — это не обязательно «ошибка модели».',
 warningText:'Оно может быть реальной частью физической постановки: начальная кривизна, эксцентриситет нагрузки, неоднородность толщины, остаточные напряжения или вариация свойств материала.',
 back:'← D11',interactive:'ИНТЕРАКТИВНО'
},
en:{
 title:'Imperfection sensitivity and real instability',
 lead:'An ideal model may have exact symmetry and a clean bifurcation, but a real structure almost always contains geometric deviations, material heterogeneity, or loading eccentricity. Even a very small imperfection can strongly alter the critical path.',
 key:'AN IMPERFECTION MAY ONLY SLIGHTLY CHANGE THE EQUATIONS WHILE STRONGLY CHANGING THE OBSERVED PATH',
 keyText:'In an ideal symmetric problem, several equivalent branches may exist beyond the critical point. A small imperfection selects a preferred direction in advance and removes exact symmetry.',
 perfect:'Perfect system',imperfect:'Imperfect system',
 geometry:'geometric imperfection ε',sensitivity:'sensitivity β',load:'load parameter λ',
 selected:'selected branch',symmetric:'symmetry preserved',broken:'symmetry broken',
 sceneKicker:'IDEAL MODEL ↔ REAL SYSTEM',sceneTitle:'increase a small imperfection and watch the post-critical path change',
 checkpoint:'CHECK YOUR INTUITION',checkpointTitle:'Why is it insufficient to compare an experiment with a perfectly symmetric model using critical load alone?',
 checkpointText:'Because the experimental system already contains imperfections. They may preselect the instability mode, change the maximum load, and smooth an ideal bifurcation.',
 conclusion:'CONCLUSION',conclusionTitle:'The closer a system is to instability, the more important small imperfections become.',
 conclusionText:'Nonlinear stability analysis therefore often includes sensitivity studies: the same model is solved for a family of small perturbations and the full loading path is compared, not only the critical point.',
 deepen:'Go deeper',deepenText:'A minimal imperfect normal form can be written as q³−μq−ε=0. For ε=0 the exact symmetry q↔−q is preserved; for ε≠0 it is broken and one branch becomes preferred.',
 research:'Research note',researchText:'For thin shells and other highly sensitive systems, experimental load capacity may depend strongly on the shape and amplitude of initial geometric deviations, so a single perfect-geometry simulation is insufficient.',
 warning:'IMPORTANT',warningTitle:'An imperfection is not necessarily a modeling error.',
 warningText:'It may be a real part of the physical problem: initial curvature, load eccentricity, thickness variation, residual stress, or spatial variation of material properties.',
 back:'← D11',interactive:'INTERACTIVE'
}} as const

function roots(mu:number,eps:number){
 const vals:{q:number;r:number}[]=[]
 for(let i=0;i<=500;i++){
   const q=-2+i/500*4
   const r=q*q*q-mu*q-eps
   vals.push({q,r})
 }
 const out:number[]=[]
 for(let i=1;i<vals.length;i++){
   if(vals[i-1].r===0||vals[i-1].r*vals[i].r<0){
     let a=vals[i-1].q,b=vals[i].q
     for(let k=0;k<22;k++){
       const m=(a+b)/2
       const ra=a*a*a-mu*a-eps
       const rm=m*m*m-mu*m-eps
       if(ra*rm<=0)b=m;else a=m
     }
     const q=(a+b)/2
     if(!out.some(x=>Math.abs(x-q)<.02))out.push(q)
   }
 }
 return out
}

function map(q:number,lambda:number){
 const x=50+q/1.8*36
 const y=52-(lambda-.35)/1.95*39
 return {x,y}
}

export function ImperfectionSensitivity({notation,language,onBack}:Props){
 const copy=text[language]
 const [eps,setEps]=useState(.035)
 const [beta,setBeta]=useState(1)
 const [lambda,setLambda]=useState(1.28)

 const mu=(lambda-1)*beta
 const candidates=useMemo(()=>roots(mu,eps),[mu,eps])
 const q=candidates.length?candidates.reduce((a,b)=>Math.abs(b)>=Math.abs(a)?b:a):0

 const idealBranches=useMemo(()=>{
   const upper:{x:number;y:number}[]=[]
   const lower:{x:number;y:number}[]=[]
   for(let i=0;i<80;i++){
     const l=.35+i/79*1.95
     const m=(l-1)*beta
     const a=m>0?Math.sqrt(m):0
     upper.push(map(a,l));lower.push(map(-a,l))
   }
   return {upper,lower}
 },[beta])

 const imperfect=useMemo(()=>{
   const pts:{x:number;y:number}[]=[]
   for(let i=0;i<110;i++){
     const l=.35+i/109*1.95
     const m=(l-1)*beta
     const rs=roots(m,eps)
     const qq=rs.length?rs.reduce((a,b)=>Math.abs(b)>=Math.abs(a)?b:a):0
     pts.push(map(qq,l))
   }
   return pts
 },[eps,beta])

 const path=(pts:{x:number;y:number}[])=>pts.map((p,i)=>`${i?'L':'M'} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(' ')
 const p=map(q,lambda)

 const formula=notation==='Python'
 ? 'q**3 - mu*q - eps = 0'
 : notation==='Index'
 ? 'q³ - μq - ε = 0,   μ = β(λ-λ_c)'
 : 'q³ − μq − ε = 0,   μ = β(λ − λ_c)'

 return <section className="module-view module-view-stacked"><div className="lesson-copy">
  <div className="lesson-index">D12</div><h1>{copy.title}</h1><p className="lead">{copy.lead}</p>
  <div className="concept-card"><span>{copy.key}</span><strong>{copy.keyText}</strong></div>
  <div className="definition"><div className="definition-label">{copy.perfect}</div><p>{copy.keyText}</p></div>
  <div className="definition"><div className="definition-label">{copy.imperfect}</div><div className="formula">{formula}</div><p>{copy.warningText}</p></div>
  <div className="warning-card kinematics-warning"><span>{copy.warning}</span><strong>{copy.warningTitle}</strong><p>{copy.warningText}</p></div>
  <DepthNote label={copy.deepen}><p>{copy.deepenText}</p></DepthNote>
  <DepthNote label={copy.research} variant="research"><p>{copy.researchText}</p></DepthNote>
  <ApplicationLinks language={language} items={[{ru:'Тонкостенные оболочки',en:'Thin shells'},{ru:'Колонны и стержни',en:'Columns and rods'},{ru:'Посткритический анализ',en:'Post-buckling analysis'},{ru:'Анализ чувствительности',en:'Sensitivity analysis'}]}/>
  {onBack&&<button className="text-button" onClick={onBack}>{copy.back}</button>}
 </div><div className="scene-column">
  <div className="scene-card">
   <div className="scene-head"><div><span className="scene-kicker">{copy.sceneKicker}</span><h2>{copy.sceneTitle}</h2></div><div className="live-badge">{copy.interactive}</div></div>
   <svg className="balance-scene" viewBox="0 0 100 62">
    <rect x="5" y="5" width="90" height="52" rx="8" fill="#111318"/>
    <line x1="50" y1="54" x2="50" y2="10" stroke="#69717C" strokeWidth=".55"/>
    <line x1="8" y1="52" x2="93" y2="52" stroke="#69717C" strokeWidth=".55"/>
    <path d={path(idealBranches.upper)} fill="none" stroke="#69717C" strokeDasharray="2 2" strokeWidth=".9"/>
    <path d={path(idealBranches.lower)} fill="none" stroke="#69717C" strokeDasharray="2 2" strokeWidth=".9"/>
    <path d={path(imperfect)} fill="none" stroke="#A9E3D2" strokeWidth="1.5"/>
    <circle cx={p.x} cy={p.y} r="2" fill="#2864FF"/>
    <text x="9" y="12" fill="#F4F2EC" fontSize="2.1">λ</text>
    <text x="85" y="58" fill="#F4F2EC" fontSize="2.1">q →</text>
   </svg>
   <div className="transport-metrics">
    <div><span>{copy.selected}</span><strong>{q>=0?'+':'−'}</strong></div>
    <div><span>{copy.load}</span><strong>{lambda.toFixed(2)}</strong></div>
    <div><span>{Math.abs(eps)<.001?copy.symmetric:copy.broken}</span><strong>{Math.abs(eps)<.001?'✓':'↗'}</strong></div>
   </div>
   <div className="control-stack">
    <label><span>{copy.geometry}<strong>{eps.toFixed(3)}</strong></span><input type="range" min="-.12" max=".12" step=".005" value={eps} onChange={e=>setEps(Number(e.target.value))}/></label>
    <label><span>{copy.sensitivity}<strong>{beta.toFixed(2)}</strong></span><input type="range" min=".45" max="1.8" step=".05" value={beta} onChange={e=>setBeta(Number(e.target.value))}/></label>
    <label><span>{copy.load}<strong>{lambda.toFixed(2)}</strong></span><input type="range" min=".35" max="2.3" step=".01" value={lambda} onChange={e=>setLambda(Number(e.target.value))}/></label>
   </div>
  </div>
  <div className="bottom-grid"><div className="prediction-card"><span>{copy.checkpoint}</span><strong>{copy.checkpointTitle}</strong><p>{copy.checkpointText}</p></div><div className="author-card"><span>{copy.conclusion}</span><strong>{copy.conclusionTitle}</strong><p>{copy.conclusionText}</p></div></div>
 </div></section>
}
