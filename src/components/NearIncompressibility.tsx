import { useMemo, useState } from 'react'
import type { Language, NotationMode } from '../i18n'
import { DepthNote } from './DepthNote'
import { ApplicationLinks } from './ApplicationLinks'

type Props={notation:NotationMode;language:Language;onBack?:()=>void;onNext?:()=>void}
type Formulation='penalty'|'mixed'

const text={
ru:{title:'Почти несжимаемость: давление, штрафной метод и смешанная u–p постановка',lead:'Когда материал почти не меняет объём, объёмный модуль κ становится намного больше сдвигового модуля μ. Это приближает J к единице, но одновременно делает численную задачу жёсткой и может приводить к объёмной блокировке.',key:'НЕСЖИМАЕМОСТЬ — ЭТО ОГРАНИЧЕНИЕ, А НЕ ПРОСТО «ОЧЕНЬ БОЛЬШОЙ κ»',keyText:'Штрафной метод (penalty method) приближает J = 1 через большой κ, а смешанная u–p постановка вводит давление p как отдельную неизвестную и контролирует несжимаемость иначе.',penalty:'Штрафной метод',penaltyText:'Простейший объёмный вклад можно записать как Ψ_vol = κ/2 (J−1)². Тогда p ≈ κ(J−1): чем больше κ, тем меньше допускаемое изменение объёма.',mixed:'Смешанная u–p постановка',mixedText:'Давление становится независимой переменной, а условие J ≈ 1 задаётся как отдельное уравнение. Это особенно важно для почти несжимаемых материалов в МКЭ.',formulation:'постановка',load:'объёмная нагрузка q',ratio:'отношение κ/μ',J:'J',pressure:'давление p',error:'|J−1|',stiffness:'условная численная жёсткость',sceneKicker:'ПОЧТИ НЕСЖИМАЕМЫЙ МАТЕРИАЛ',sceneTitle:'увеличивай κ/μ и наблюдай компромисс между J≈1 и численной жёсткостью',checkpoint:'ВОПРОС ДЛЯ ПРОВЕРКИ',checkpointTitle:'Почему нельзя бесконечно увеличивать κ в штрафном методе?',checkpointText:'Потому что одновременно с уменьшением |J−1| растёт контраст жёсткостей, ухудшается обусловленность системы и повышается риск объёмной блокировки.',conclusion:'ВЫВОД',conclusionTitle:'Почти несжимаемость — одновременно физическая и численная проблема.',conclusionText:'Следующий шаг — связать гиперупругую модель с вариационной постановкой и увидеть, как нелинейная материальная и геометрическая жёсткости входят в МКЭ.',deepen:'Углубиться',deepenText:'Для точной несжимаемости давление играет роль множителя Лагранжа. В смешанной постановке неизвестными становятся перемещение u и давление p, а дискретизация должна удовлетворять условиям устойчивости для пары пространств u–p.',research:'Исследовательское замечание',researchText:'В биомеханике мягких тканей κ/μ часто велико, поэтому выбор конечных элементов и постановки может влиять на результат не меньше, чем сама конститутивная модель.',warning:'ВАЖНО',warningTitle:'Малое |J−1| само по себе ещё не гарантирует хорошую численную постановку.',warningText:'Можно получить почти несжимаемое решение и одновременно сильно переоценить жёсткость из-за блокировки. Поэтому нужно контролировать и физическую ошибку по объёму, и качество дискретизации.',penaltyMode:'штрафной метод',mixedMode:'смешанная u–p',back:'← D06',next:'D08 → нелинейный МКЭ и метод Ньютона',interactive:'ИНТЕРАКТИВНО'},
en:{title:'Near incompressibility: pressure, penalty method, and mixed u–p formulation',lead:'When a material changes volume only slightly, the bulk modulus κ becomes much larger than the shear modulus μ. This drives J toward one but also makes the numerical problem stiff and may cause volumetric locking.',key:'INCOMPRESSIBILITY IS A CONSTRAINT, NOT JUST “A VERY LARGE κ”',keyText:'The penalty method approximates J = 1 through large κ, whereas a mixed u–p formulation introduces pressure p as an independent unknown.',penalty:'Penalty method',penaltyText:'A simple volumetric energy is Ψ_vol = κ/2 (J−1)², giving p ≈ κ(J−1): increasing κ reduces admissible volume change.',mixed:'Mixed u–p formulation',mixedText:'Pressure becomes an independent variable and J ≈ 1 is imposed through a separate equation. This is especially important for nearly incompressible finite-element models.',formulation:'formulation',load:'volumetric load q',ratio:'ratio κ/μ',J:'J',pressure:'pressure p',error:'|J−1|',stiffness:'relative numerical stiffness',sceneKicker:'NEARLY INCOMPRESSIBLE MATERIAL',sceneTitle:'increase κ/μ and observe the trade-off between J≈1 and numerical stiffness',checkpoint:'CHECKPOINT',checkpointTitle:'Why not increase κ without limit in a penalty formulation?',checkpointText:'Because reducing |J−1| also increases stiffness contrast, worsens conditioning, and raises the risk of volumetric locking.',conclusion:'CONCLUSION',conclusionTitle:'Near incompressibility is both a physical and a numerical issue.',conclusionText:'Next we connect hyperelasticity with the variational formulation and see how material and geometric tangents enter nonlinear FEM.',deepen:'Go deeper',deepenText:'For exact incompressibility, pressure acts as a Lagrange multiplier. In mixed form the unknowns are displacement u and pressure p, and the discrete u–p spaces must satisfy stability requirements.',research:'Research note',researchText:'In soft-tissue biomechanics κ/μ is often large, so finite-element choice and formulation can influence results as much as the constitutive model itself.',warning:'IMPORTANT',warningTitle:'Small |J−1| alone does not guarantee a good numerical formulation.',warningText:'A solution may be nearly incompressible yet excessively stiff because of locking. Both volume error and discretization quality must be monitored.',penaltyMode:'penalty method',mixedMode:'mixed u–p',back:'← D06',next:'D08 → nonlinear FEM and Newton method',interactive:'INTERACTIVE'}
} as const

function fmt(v:number,d=4){return (Math.abs(v)<1e-12?0:v).toFixed(d)}

export function NearIncompressibility({notation,language,onBack,onNext}:Props){
 const copy=text[language]
 const [formulation,setFormulation]=useState<Formulation>('penalty')
 const [mu,setMu]=useState(10)
 const [ratio,setRatio]=useState(100)
 const [q,setQ]=useState(2)

 const data=useMemo(()=>{
   const kappa=mu*ratio
   if(formulation==='penalty'){
     const J=1+q/kappa
     const p=kappa*(J-1)
     const err=Math.abs(J-1)
     const stiffness=1+ratio
     return {kappa,J,p,err,stiffness}
   }
   const J=1
   const p=q
   const err=0
   const stiffness=1+Math.sqrt(ratio)
   return {kappa,J,p,err,stiffness}
 },[mu,ratio,q,formulation])

 const formula=notation==='Python'
 ? "psi_vol = 0.5*kappa*(J-1)**2; p = kappa*(J-1)"
 : notation==='Index'
 ? 'p = κ(J−1),   J → 1 as κ/μ → ∞'
 : 'Ψ_vol = κ/2 (J−1)²,   p = ∂Ψ_vol/∂J = κ(J−1)'

 const curve=Array.from({length:90},(_,i)=>{
   const r=Math.pow(10,1+i*(3/89))
   const err=formulation==='penalty'?Math.abs(q/(mu*r)):0
   const stiff=formulation==='penalty'?1+r:1+Math.sqrt(r)
   return {r,err,stiff}
 })
 const maxErr=Math.max(...curve.map(x=>x.err),1e-8)
 const maxSt=Math.max(...curve.map(x=>x.stiff),1)
 const errPath=curve.map((v,i)=>{const x=8+i/89*84;const y=52-v.err/maxErr*36;return `${i?'L':'M'} ${x.toFixed(2)} ${y.toFixed(2)}`}).join(' ')
 const stiffPath=curve.map((v,i)=>{const x=8+i/89*84;const y=52-v.stiff/maxSt*36;return `${i?'L':'M'} ${x.toFixed(2)} ${y.toFixed(2)}`}).join(' ')

 return <section className="module-view module-view-stacked"><div className="lesson-copy">
 <div className="lesson-index">D07</div><h1>{copy.title}</h1><p className="lead">{copy.lead}</p>
 <div className="concept-card"><span>{copy.key}</span><strong>{copy.keyText}</strong></div>
 <div className="definition"><div className="definition-label">{copy.penalty}</div><div className="formula">{formula}</div><p>{copy.penaltyText}</p></div>
 <div className="definition"><div className="definition-label">{copy.mixed}</div><div className="formula">u, p → J = 1</div><p>{copy.mixedText}</p></div>
 <div className="warning-card kinematics-warning"><span>{copy.warning}</span><strong>{copy.warningTitle}</strong><p>{copy.warningText}</p></div>
 <DepthNote label={copy.deepen}><p>{copy.deepenText}</p></DepthNote><DepthNote label={copy.research} variant="research"><p>{copy.researchText}</p></DepthNote>
 <ApplicationLinks language={language} items={[{ru:'Почти несжимаемые материалы',en:'Nearly incompressible materials'},{ru:'Мягкие ткани',en:'Soft tissues'},{ru:'Смешанный МКЭ',en:'Mixed FEM'},{ru:'Объёмная блокировка',en:'Volumetric locking'}]}/>
 <div className="mini-toggle-row" style={{marginTop:20}}>{onBack&&<button className="text-button" onClick={onBack}>{copy.back}</button>}{onNext&&<button className="primary-button" onClick={onNext}>{copy.next}</button>}</div>
 </div><div className="scene-column"><div className="scene-card">
 <div className="scene-head"><div><span className="scene-kicker">{copy.sceneKicker}</span><h2>{copy.sceneTitle}</h2></div><div className="live-badge">{copy.interactive}</div></div>
 <div className="mini-toggle-row" style={{marginBottom:14}}>
 <button className={formulation==='penalty'?'toggle active':'toggle'} onClick={()=>setFormulation('penalty')}>{copy.penaltyMode}</button>
 <button className={formulation==='mixed'?'toggle active':'toggle'} onClick={()=>setFormulation('mixed')}>{copy.mixedMode}</button>
 </div>
 <svg className="balance-scene" viewBox="0 0 100 60"><rect x="5" y="5" width="90" height="50" rx="8" fill="#111318"/><line x1="8" y1="52" x2="94" y2="52" stroke="#69717C" strokeWidth=".6"/><line x1="8" y1="52" x2="8" y2="10" stroke="#69717C" strokeWidth=".6"/><path d={errPath} fill="none" stroke="#A9E3D2" strokeWidth="1.3"/><path d={stiffPath} fill="none" stroke="#2864FF" strokeWidth="1.3"/><text x="10" y="13" fill="#A9E3D2" fontSize="2.2">|J−1|</text><text x="10" y="17" fill="#2864FF" fontSize="2.2">{language==='ru'?'численная жёсткость':'numerical stiffness'}</text><text x="74" y="56" fill="#F4F2EC" fontSize="2.1">κ/μ →</text></svg>
 <div className="control-stack">
 <label><span>μ<strong>{fmt(mu,1)}</strong></span><input type="range" min="1" max="40" step="1" value={mu} onChange={e=>setMu(Number(e.target.value))}/></label>
 <label><span>{copy.ratio}<strong>{fmt(ratio,0)}</strong></span><input type="range" min="10" max="1000" step="10" value={ratio} onChange={e=>setRatio(Number(e.target.value))}/></label>
 <label><span>{copy.load}<strong>{fmt(q,2)}</strong></span><input type="range" min=".2" max="8" step=".1" value={q} onChange={e=>setQ(Number(e.target.value))}/></label>
 </div>
 <div className="transport-metrics"><div><span>{copy.J}</span><strong>{fmt(data.J,6)}</strong></div><div><span>{copy.pressure}</span><strong>{fmt(data.p)}</strong></div><div><span>{copy.error}</span><strong>{data.err.toExponential(2)}</strong></div></div>
 <div className="transport-metrics metrics-secondary"><div><span>κ</span><strong>{fmt(data.kappa,0)}</strong></div><div><span>{copy.stiffness}</span><strong>{fmt(data.stiffness,1)}</strong></div><div><span>{copy.formulation}</span><strong>{formulation==='penalty'?copy.penaltyMode:copy.mixedMode}</strong></div></div>
 </div><div className="bottom-grid"><div className="prediction-card"><span>{copy.checkpoint}</span><strong>{copy.checkpointTitle}</strong><p>{copy.checkpointText}</p></div><div className="author-card"><span>{copy.conclusion}</span><strong>{copy.conclusionTitle}</strong><p>{copy.conclusionText}</p></div></div></div></section>
}