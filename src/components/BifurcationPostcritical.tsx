import { useMemo, useState } from 'react'
import type { Language, NotationMode } from '../i18n'
import { DepthNote } from './DepthNote'
import { ApplicationLinks } from './ApplicationLinks'

type Props={notation:NotationMode;language:Language;onBack?:()=>void}
type Mode='pitchfork'|'limit'|'energy'

const text={
ru:{
 title:'Бифуркации и посткритическое поведение',
 lead:'Критическая точка — не конец решения. После потери устойчивости система может перейти на новую ветвь равновесия, перескочить в другое состояние или потребовать специального алгоритма продолжения.',
 key:'БИФУРКАЦИЯ — ЭТО ИЗМЕНЕНИЕ СТРУКТУРЫ МНОЖЕСТВА РАВНОВЕСНЫХ СОСТОЯНИЙ',
 keyText:'В критической точке исходная ветвь может потерять устойчивость, а рядом возникают альтернативные решения. Посткритическая ветвь показывает, что система делает после критического состояния.',
 branch:'Ветви равновесия',shape:'Форма системы',energy:'Энергия',
 pitch:'Симметричная бифуркация',limit:'Предельная точка',eland:'Энергетический ландшафт',
 control:'управляющий параметр λ',imperfection:'несовершенство ε',
 stable:'устойчивая ветвь',unstable:'неустойчивая ветвь',critical:'критическая точка',
 sceneKicker:'ВЕТВИ · ФОРМА · ЭНЕРГИЯ',sceneTitle:'меняй нагрузку и следи, как одно и то же состояние выглядит в трёх представлениях',
 before:'до критики',at:'около критики',after:'после критики',
 checkpoint:'ПРОВЕРЬ ИНТУИЦИЮ',checkpointTitle:'Почему λ_min(K_T)=0 недостаточно для понимания дальнейшего поведения?',
 checkpointText:'Потому что нулевое собственное значение сообщает о потере локальной жёсткости, но не говорит, какие ветви существуют дальше, устойчивы ли они и можно ли пройти критическую область обычным управлением нагрузкой.',
 conclusion:'ВЫВОД',conclusionTitle:'После критической точки нужно исследовать не одно решение, а структуру ветвей.',
 conclusionText:'Именно поэтому анализ устойчивости естественно переходит в continuation-методы, arc-length и исследование посткритического пути.',
 deepen:'Углубиться',deepenText:'Для симметричной нормальной формы Π(q)=¼q⁴−½μq² минимум q=0 устойчив при μ<0. При μ>0 центральное состояние становится неустойчивым, а устойчивые минимумы появляются при q=±√μ.',
 research:'Исследовательское замечание',researchText:'В вычислительной механике геометрические несовершенства часто снимают идеальную симметрию: математически идеальная pitchfork-бифуркация превращается в асимметричный путь, более похожий на эксперимент.',
 warning:'ВАЖНО',warningTitle:'Предельная точка и бифуркационная точка — не одно и то же.',
 warningText:'В предельной точке ветвь разворачивается по параметру нагрузки. В бифуркационной точке пересекаются или рождаются разные ветви равновесия.',
 back:'← D09',interactive:'ИНТЕРАКТИВНО'
},
en:{
 title:'Bifurcations and post-critical behavior',
 lead:'A critical point is not the end of the solution. After loss of stability the system may follow a new equilibrium branch, jump to another state, or require a dedicated continuation algorithm.',
 key:'A BIFURCATION CHANGES THE STRUCTURE OF THE SET OF EQUILIBRIUM STATES',
 keyText:'At a critical point the original branch may lose stability while alternative solutions appear nearby. The post-critical branch tells us what the system does after the critical state.',
 branch:'Equilibrium branches',shape:'System shape',energy:'Energy',
 pitch:'Symmetric bifurcation',limit:'Limit point',eland:'Energy landscape',
 control:'control parameter λ',imperfection:'imperfection ε',
 stable:'stable branch',unstable:'unstable branch',critical:'critical point',
 sceneKicker:'BRANCHES · SHAPE · ENERGY',sceneTitle:'change the load and watch the same state through three synchronized representations',
 before:'pre-critical',at:'near critical',after:'post-critical',
 checkpoint:'CHECK YOUR INTUITION',checkpointTitle:'Why is λ_min(K_T)=0 insufficient to predict what happens next?',
 checkpointText:'Because a zero eigenvalue signals loss of local stiffness but does not reveal which branches exist beyond the point, whether they are stable, or whether ordinary load control can traverse the critical region.',
 conclusion:'CONCLUSION',conclusionTitle:'Beyond the critical point we must study a structure of branches, not a single solution.',
 conclusionText:'This is why stability analysis naturally leads to continuation methods, arc-length control, and post-critical path tracing.',
 deepen:'Go deeper',deepenText:'For the symmetric normal form Π(q)=¼q⁴−½μq², q=0 is stable for μ<0. For μ>0 the central state becomes unstable and stable minima emerge at q=±√μ.',
 research:'Research note',researchText:'In computational mechanics geometric imperfections often break perfect symmetry: an ideal pitchfork bifurcation unfolds into an asymmetric path that more closely resembles experiments.',
 warning:'IMPORTANT',warningTitle:'A limit point and a bifurcation point are not the same.',
 warningText:'At a limit point the branch turns with respect to the load parameter. At a bifurcation point distinct equilibrium branches intersect or emerge.',
 back:'← D09',interactive:'INTERACTIVE'
}} as const

function path(points:{x:number;y:number}[],x0=8,y0=52,w=84,h=40){
 const xs=points.map(p=>p.x),ys=points.map(p=>p.y)
 const xmin=Math.min(...xs),xmax=Math.max(...xs),ymin=Math.min(...ys),ymax=Math.max(...ys)
 return points.map((p,i)=>{const x=x0+(p.x-xmin)/(xmax-xmin||1)*w;const y=y0-(p.y-ymin)/(ymax-ymin||1)*h;return `${i?'L':'M'} ${x.toFixed(2)} ${y.toFixed(2)}`}).join(' ')
}

export function BifurcationPostcritical({notation,language,onBack}:Props){
 const copy=text[language]
 const [mode,setMode]=useState<Mode>('pitchfork')
 const [lambda,setLambda]=useState(.85)
 const [eps,setEps]=useState(0)

 const state=useMemo(()=>{
   const mu=lambda-1
   const qIdeal=mu>0?Math.sqrt(mu):0
   const q=eps===0?qIdeal:Math.cbrt(eps+Math.max(mu,0)*.22)
   const label=lambda<.94?copy.before:lambda<1.06?copy.at:copy.after
   return {mu,q,label}
 },[lambda,eps,copy])

 const branchData=useMemo(()=>{
   if(mode==='limit'){
     return Array.from({length:90},(_,i)=>{const q=-1.5+i/89*3;return {x:q,y:1.25*q-.38*q*q*q}})
   }
   const pts:{x:number;y:number}[]=[]
   for(let i=0;i<55;i++){const q=-1.55+i/54*1.55;pts.push({x:q,y:1+q*q})}
   for(let i=0;i<55;i++){const q=i/54*1.55;pts.push({x:q,y:1+q*q})}
   return pts
 },[mode])

 const energyData=useMemo(()=>Array.from({length:90},(_,i)=>{
   const q=-1.6+i/89*3.2
   const pi=.25*q**4-.5*state.mu*q*q-eps*q
   return {x:q,y:pi}
 }),[state.mu,eps])

 const formula=notation==='Python'
   ? 'Pi = 0.25*q**4 - 0.5*mu*q**2 - eps*q'
   : notation==='Index'
   ? 'R_a(u,λ)=0,   det(K^T_ab)=0'
   : 'R(u,λ)=0,   det K_T = 0'

 const amp=Math.max(-1.3,Math.min(1.3,state.q))*12
 const branchPath=path(branchData)
 const energyPath=path(energyData,8,52,84,40)

 return <section className="module-view module-view-stacked"><div className="lesson-copy">
   <div className="lesson-index">D10</div><h1>{copy.title}</h1><p className="lead">{copy.lead}</p>
   <div className="concept-card"><span>{copy.key}</span><strong>{copy.keyText}</strong></div>
   <div className="definition"><div className="definition-label">{copy.branch}</div><div className="formula">{formula}</div><p>{copy.keyText}</p></div>
   <div className="warning-card kinematics-warning"><span>{copy.warning}</span><strong>{copy.warningTitle}</strong><p>{copy.warningText}</p></div>
   <DepthNote label={copy.deepen}><p>{copy.deepenText}</p></DepthNote>
   <DepthNote label={copy.research} variant="research"><p>{copy.researchText}</p></DepthNote>
   <ApplicationLinks language={language} items={[{ru:'Потеря устойчивости оболочек',en:'Shell buckling'},{ru:'Snap-through конструкций',en:'Structural snap-through'},{ru:'Нелинейный МКЭ',en:'Nonlinear FEM'},{ru:'Continuation / arc-length',en:'Continuation / arc-length'}]}/>
   {onBack&&<button className="text-button" onClick={onBack}>{copy.back}</button>}
 </div><div className="scene-column">
   <div className="scene-card">
    <div className="scene-head"><div><span className="scene-kicker">{copy.sceneKicker}</span><h2>{copy.sceneTitle}</h2></div><div className="live-badge">{copy.interactive}</div></div>
    <div className="mode-switcher">
      <button className={mode==='pitchfork'?'active':''} onClick={()=>setMode('pitchfork')}>{copy.pitch}</button>
      <button className={mode==='limit'?'active':''} onClick={()=>setMode('limit')}>{copy.limit}</button>
      <button className={mode==='energy'?'active':''} onClick={()=>setMode('energy')}>{copy.eland}</button>
    </div>
    <svg className="balance-scene" viewBox="0 0 100 62">
      <rect x="5" y="5" width="90" height="52" rx="8" fill="#111318"/>
      <line x1="8" y1="52" x2="94" y2="52" stroke="#69717C" strokeWidth=".55"/>
      <line x1="50" y1="54" x2="50" y2="10" stroke="#69717C" strokeWidth=".55"/>
      {mode==='energy'
       ? <path d={energyPath} fill="none" stroke="#A9E3D2" strokeWidth="1.4"/>
       : <><path d={branchPath} fill="none" stroke="#A9E3D2" strokeWidth="1.35"/>
          {mode==='pitchfork'&&<line x1="50" y1="52" x2="50" y2="11" stroke="#F28C52" strokeDasharray="2 2" strokeWidth=".8"/>}</>}
      <circle cx={50+amp} cy={mode==='energy'?38:Math.max(13,49-(lambda-.55)*22)} r="1.8" fill="#2864FF"/>
      <text x="10" y="13" fill="#F4F2EC" fontSize="2.1">{mode==='energy'?'Π(q)':copy.branch}</text>
      <text x="73" y="57" fill="#F4F2EC" fontSize="2.0">{mode==='energy'?'q →':'state →'}</text>
    </svg>

    <div className="transport-metrics">
      <div><span>{copy.shape}</span><strong>{state.label}</strong></div>
      <div><span>q</span><strong>{state.q.toFixed(3)}</strong></div>
      <div><span>μ = λ − λc</span><strong>{state.mu.toFixed(3)}</strong></div>
    </div>

    <svg className="balance-scene" viewBox="0 0 100 38">
      <rect x="5" y="4" width="90" height="30" rx="8" fill="#111318"/>
      <line x1="20" y1="29" x2="80" y2="29" stroke="#69717C" strokeWidth=".8"/>
      <line x1="50" y1="28" x2={50+amp} y2="10" stroke="#A9E3D2" strokeWidth="2"/>
      <circle cx={50+amp} cy="10" r="2.2" fill="#2864FF"/>
      <path d="M 15 31 L 20 26 L 20 32 Z" fill="#69717C"/><path d="M 85 31 L 80 26 L 80 32 Z" fill="#69717C"/>
      <text x="8" y="9" fill="#F4F2EC" fontSize="2.2">{copy.shape}</text>
    </svg>

    <div className="control-stack">
      <label><span>{copy.control}<strong>{lambda.toFixed(2)}</strong></span><input type="range" min=".45" max="2.2" step=".01" value={lambda} onChange={e=>setLambda(Number(e.target.value))}/></label>
      <label><span>{copy.imperfection}<strong>{eps.toFixed(3)}</strong></span><input type="range" min="-.18" max=".18" step=".005" value={eps} onChange={e=>setEps(Number(e.target.value))}/></label>
    </div>
   </div>
   <div className="bottom-grid"><div className="prediction-card"><span>{copy.checkpoint}</span><strong>{copy.checkpointTitle}</strong><p>{copy.checkpointText}</p></div><div className="author-card"><span>{copy.conclusion}</span><strong>{copy.conclusionTitle}</strong><p>{copy.conclusionText}</p></div></div>
 </div></section>
}
