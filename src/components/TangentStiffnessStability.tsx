import { useMemo, useState } from 'react'
import type { Language, NotationMode } from '../i18n'
import { DepthNote } from './DepthNote'
import { ApplicationLinks } from './ApplicationLinks'

type Props={notation:NotationMode;language:Language;onBack?:()=>void}

const text={
ru:{title:'Материальная и геометрическая жёсткость. Потеря устойчивости',lead:'В нелинейной механике касательная жёсткость зависит не только от материала. Текущее напряжённое состояние само влияет на способность конструкции сопротивляться дополнительным возмущениям — это и есть геометрический вклад.',key:'ПОТЕРЯ УСТОЙЧИВОСТИ ВИДНА ЧЕРЕЗ ВЫРОЖДЕНИЕ КАСАТЕЛЬНОЙ ЖЁСТКОСТИ',keyText:'Если минимальное собственное значение K_T приближается к нулю, система теряет локальную жёсткость по одному из направлений возмущения. Это сигнал приближения к критическому состоянию.',mat:'Материальная жёсткость',matText:'K_mat возникает из производной конститутивного закона и отражает локальный отклик материала на дополнительную деформацию.',geo:'Геометрическая жёсткость',geoText:'K_geo зависит от текущих напряжений и геометрии. При сжатии она может уменьшать полную касательную жёсткость и приближать систему к потере устойчивости.',load:'нагрузка N',material:'материальная жёсткость k_mat',geom:'геометрический коэффициент γ',kt:'K_T',kmat:'K_mat',kgeo:'K_geo',mineig:'минимальное собственное значение',state:'состояние',stable:'устойчиво',critical:'критическое',unstable:'неустойчиво',sceneKicker:'УСТОЙЧИВОСТЬ И КАСАТЕЛЬНАЯ ЖЁСТКОСТЬ',sceneTitle:'увеличивай сжимающую нагрузку и следи за приближением λ_min(K_T) к нулю',checkpoint:'ВОПРОС ДЛЯ ПРОВЕРКИ',checkpointTitle:'Почему отрицательная геометрическая жёсткость особенно важна при сжатии?',checkpointText:'Потому что текущие сжимающие напряжения могут уменьшать сопротивление поперечным возмущениям. Даже при положительной материальной жёсткости полная K_T может потерять положительную определённость.',conclusion:'ВЫВОД',conclusionTitle:'Устойчивость определяется полной касательной жёсткостью, а не только свойствами материала.',conclusionText:'Следующий шаг — перейти к бифуркациям и проследить, как из критической точки возникают альтернативные ветви решения.',deepen:'Углубиться',deepenText:'В дискретной задаче критическое состояние часто связывают с det K_T = 0 или с λ_min(K_T)=0. Для больших систем собственные значения используют как диагностический индикатор близости к потере устойчивости.',research:'Исследовательское замечание',researchText:'В реальном нелинейном МКЭ критическую точку часто отслеживают вместе с continuation-методами и дуговым параметрированием, потому что обычное управление нагрузкой может перестать проходить через предельную точку.',warning:'ВАЖНО',warningTitle:'Нулевое собственное значение ещё не говорит, какой именно тип неустойчивости реализуется.',warningText:'Нужно анализировать форму собственного вектора, симметрию задачи, путь нагружения и посткритическое поведение.',back:'← D08',interactive:'ИНТЕРАКТИВНО'},
en:{title:'Material and geometric stiffness. Loss of stability',lead:'In nonlinear mechanics, tangent stiffness depends on more than material response. The current stress state itself changes how the structure resists additional perturbations; this is the geometric contribution.',key:'LOSS OF STABILITY APPEARS AS A DEGENERATION OF TANGENT STIFFNESS',keyText:'When the smallest eigenvalue of K_T approaches zero, the system loses local stiffness along one perturbation direction. This signals a critical state.',mat:'Material stiffness',matText:'K_mat comes from the constitutive derivative and reflects the local material response to an incremental strain.',geo:'Geometric stiffness',geoText:'K_geo depends on current stress and geometry. Under compression it can reduce total tangent stiffness and drive the system toward instability.',load:'load N',material:'material stiffness k_mat',geom:'geometric coefficient γ',kt:'K_T',kmat:'K_mat',kgeo:'K_geo',mineig:'smallest eigenvalue',state:'state',stable:'stable',critical:'critical',unstable:'unstable',sceneKicker:'STABILITY AND TANGENT STIFFNESS',sceneTitle:'increase compressive load and watch λ_min(K_T) approach zero',checkpoint:'CHECKPOINT',checkpointTitle:'Why is negative geometric stiffness especially important in compression?',checkpointText:'Because compressive prestress can reduce resistance to transverse perturbations. Even with positive material stiffness, total K_T may lose positive definiteness.',conclusion:'CONCLUSION',conclusionTitle:'Stability is governed by total tangent stiffness, not material stiffness alone.',conclusionText:'Next we move to bifurcations and see how alternative equilibrium branches emerge from a critical point.',deepen:'Go deeper',deepenText:'In a discrete problem, a critical state is often associated with det K_T = 0 or λ_min(K_T)=0. In large systems eigenvalues are useful diagnostics of proximity to instability.',research:'Research note',researchText:'In practical nonlinear FEM, critical points are often tracked together with continuation and arc-length methods because ordinary load control may fail at limit points.',warning:'IMPORTANT',warningTitle:'A zero eigenvalue alone does not identify the type of instability.',warningText:'The eigenvector shape, problem symmetry, loading path, and post-critical response must also be examined.',back:'← D08',interactive:'INTERACTIVE'}
} as const

function fmt(v:number,d=3){return (Math.abs(v)<1e-12?0:v).toFixed(d)}

export function TangentStiffnessStability({notation,language,onBack}:Props){
 const copy=text[language]
 const [load,setLoad]=useState(2.8)
 const [kmat,setKmat]=useState(8)
 const [gamma,setGamma]=useState(1.5)

 const data=useMemo(()=>{
   const kgeo=-gamma*load
   const kt=kmat+kgeo
   const eig1=kt
   const eig2=kmat+.35*gamma*load
   const mineig=Math.min(eig1,eig2)
   const eps=.15
   const state=mineig>eps?'stable':mineig>=-eps?'critical':'unstable'
   const criticalLoad=kmat/gamma
   return {kgeo,kt,eig1,eig2,mineig,state,criticalLoad}
 },[load,kmat,gamma])

 const formula=notation==='Python'
 ? 'K_t = K_mat + K_geo; eigmin = np.linalg.eigvalsh(K_t).min()'
 : notation==='Index'
 ? 'K^T_ab = K^mat_ab + K^geo_ab,   λ_min(K^T) → 0'
 : 'K_T = K_mat + K_geo,   λ_min(K_T) → 0'

 const curve=Array.from({length:100},(_,i)=>{
   const n=i/99*Math.max(8,data.criticalLoad*1.35)
   return {n,e:kmat-gamma*n}
 })
 const maxAbs=Math.max(...curve.map(v=>Math.abs(v.e)),1)
 const path=curve.map((v,i)=>{const x=8+i/99*84;const y=31-v.e/maxAbs*19;return `${i?'L':'M'} ${x.toFixed(2)} ${y.toFixed(2)}`}).join(' ')
 const cx=8+Math.min(1,load/Math.max(8,data.criticalLoad*1.35))*84
 const cy=31-data.mineig/maxAbs*19

 return <section className="module-view module-view-stacked"><div className="lesson-copy">
 <div className="lesson-index">D09</div><h1>{copy.title}</h1><p className="lead">{copy.lead}</p>
 <div className="concept-card"><span>{copy.key}</span><strong>{copy.keyText}</strong></div>
 <div className="definition"><div className="definition-label">{copy.mat}</div><div className="formula">K_mat = ∂f_int/∂u | material</div><p>{copy.matText}</p></div>
 <div className="definition"><div className="definition-label">{copy.geo}</div><div className="formula">{formula}</div><p>{copy.geoText}</p></div>
 <div className="warning-card kinematics-warning"><span>{copy.warning}</span><strong>{copy.warningTitle}</strong><p>{copy.warningText}</p></div>
 <DepthNote label={copy.deepen}><p>{copy.deepenText}</p></DepthNote><DepthNote label={copy.research} variant="research"><p>{copy.researchText}</p></DepthNote>
 <ApplicationLinks language={language} items={[{ru:'Устойчивость конструкций',en:'Structural stability'},{ru:'Нелинейный МКЭ',en:'Nonlinear FEM'},{ru:'Бифуркации',en:'Bifurcations'},{ru:'Продолжение ветвей решения',en:'Continuation methods'}]}/>
 {onBack&&<button className="text-button" onClick={onBack}>{copy.back}</button>}
 </div><div className="scene-column"><div className="scene-card">
 <div className="scene-head"><div><span className="scene-kicker">{copy.sceneKicker}</span><h2>{copy.sceneTitle}</h2></div><div className="live-badge">{copy.interactive}</div></div>
 <svg className="balance-scene" viewBox="0 0 100 62"><rect x="5" y="5" width="90" height="52" rx="8" fill="#111318"/><line x1="8" y1="31" x2="94" y2="31" stroke="#69717C" strokeWidth=".7"/><line x1="8" y1="52" x2="8" y2="10" stroke="#69717C" strokeWidth=".6"/><path d={path} fill="none" stroke="#A9E3D2" strokeWidth="1.4"/><circle cx={cx} cy={cy} r="1.8" fill="#2864FF"/><text x="10" y="13" fill="#F4F2EC" fontSize="2.2">λ_min(K_T)</text><text x="72" y="57" fill="#F4F2EC" fontSize="2.1">{copy.load} →</text></svg>
 <div className="control-stack">
 <label><span>{copy.load}<strong>{fmt(load,2)}</strong></span><input type="range" min="0" max="8" step=".05" value={load} onChange={e=>setLoad(Number(e.target.value))}/></label>
 <label><span>{copy.material}<strong>{fmt(kmat,2)}</strong></span><input type="range" min="1" max="15" step=".1" value={kmat} onChange={e=>setKmat(Number(e.target.value))}/></label>
 <label><span>{copy.geom}<strong>{fmt(gamma,2)}</strong></span><input type="range" min=".2" max="3" step=".05" value={gamma} onChange={e=>setGamma(Number(e.target.value))}/></label>
 </div>
 <div className="transport-metrics"><div><span>{copy.kmat}</span><strong>{fmt(kmat)}</strong></div><div><span>{copy.kgeo}</span><strong>{fmt(data.kgeo)}</strong></div><div><span>{copy.kt}</span><strong>{fmt(data.kt)}</strong></div></div>
 <div className="transport-metrics metrics-secondary"><div><span>{copy.mineig}</span><strong>{fmt(data.mineig)}</strong></div><div><span>{language==='ru'?'критическая нагрузка':'critical load'}</span><strong>{fmt(data.criticalLoad)}</strong></div><div><span>{copy.state}</span><strong>{data.state==='stable'?copy.stable:data.state==='critical'?copy.critical:copy.unstable}</strong></div></div>
 </div><div className="bottom-grid"><div className="prediction-card"><span>{copy.checkpoint}</span><strong>{copy.checkpointTitle}</strong><p>{copy.checkpointText}</p></div><div className="author-card"><span>{copy.conclusion}</span><strong>{copy.conclusionTitle}</strong><p>{copy.conclusionText}</p></div></div></div></section>
}