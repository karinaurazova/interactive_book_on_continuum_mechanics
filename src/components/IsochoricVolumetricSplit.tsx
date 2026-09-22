import { useMemo, useState } from 'react'
import type { Language, NotationMode } from '../i18n'
import { DepthNote } from './DepthNote'
import { ApplicationLinks } from './ApplicationLinks'

type Props={notation:NotationMode;language:Language;onBack?:()=>void;onNext?:()=>void}

type Mode='isochoric'|'volumetric'|'mixed'

const text={
ru:{title:'Изохорно-объёмное разложение',lead:'Для почти несжимаемых материалов полезно отделять изменение формы от изменения объёма. Это позволяет независимо контролировать сдвиговой и объёмный отклик и избегать смешивания двух разных физических механизмов.',key:'ФОРМА И ОБЪЁМ — РАЗНЫЕ ЧАСТИ ДЕФОРМАЦИИ',keyText:'Разложение F = J^{1/3} F̄ выделяет изохорную часть F̄ с det F̄ = 1 и чисто объёмный масштаб J^{1/3}.',split:'Кинематическое разложение',splitText:'В трёхмерной постановке F̄ = J^{-1/3}F, поэтому det F̄ = 1. Изохорные инварианты строятся уже из C̄ = F̄ᵀF̄.',energy:'Разделение энергии',energyText:'Типичная гиперупругая модель записывается как Ψ = Ψ_iso(C̄) + Ψ_vol(J). Первый вклад отвечает за форму, второй — за объём.',mode:'режим',iso:'изменение формы',vol:'изменение объёма',mixed:'смешанный режим',l1:'λ₁',l2:'λ₂',l3:'λ₃',J:'J',Jbar:'det F̄',I1bar:'Ī₁',psiIso:'Ψ_iso',psiVol:'Ψ_vol',sceneKicker:'ИЗОХОРНАЯ / ОБЪЁМНАЯ ЧАСТЬ',sceneTitle:'переключай режим и смотри, что меняется: форма, объём или оба',checkpoint:'ВОПРОС ДЛЯ ПРОВЕРКИ',checkpointTitle:'Что должно происходить с Ψ_vol при чисто изохорной деформации?',checkpointText:'Если J = 1, объёмный вклад должен исчезать или достигать своего минимума, а вся энергия деформации остаётся в Ψ_iso.',conclusion:'ВЫВОД',conclusionTitle:'Почти несжимаемые материалы требуют раздельного контроля формы и объёма.',conclusionText:'Следующий шаг — разобрать давление, объёмный штраф и численные проблемы почти несжимаемых моделей.',deepen:'Углубиться',deepenText:'Для изохорных инвариантов используют Ī₁ = J^{-2/3}I₁ и Ī₂ = J^{-4/3}I₂. Они не чувствуют чистое равномерное изменение объёма.',research:'Исследовательское замечание',researchText:'В нелинейном МКЭ большой объёмный модуль κ приводит к жёсткой системе и может вызвать объёмную блокировку (volumetric locking). Поэтому для почти несжимаемых материалов часто используют смешанные u–p постановки.',warning:'ВАЖНО',warningTitle:'Большой κ — это не то же самое, что точное условие J = 1.',warningText:'Штрафной метод (penalty method) лишь приближает несжимаемость. Строгое ограничение обычно требует отдельной переменной давления или смешанной постановки.',back:'← D05',next:'D07 → почти несжимаемость',interactive:'ИНТЕРАКТИВНО'},
en:{title:'Isochoric–volumetric split',lead:'For nearly incompressible materials it is useful to separate shape change from volume change. This allows shear and volumetric responses to be controlled independently.',key:'SHAPE AND VOLUME ARE DISTINCT PARTS OF DEFORMATION',keyText:'The split F = J^{1/3} F̄ isolates an isochoric part F̄ with det F̄ = 1 and a purely volumetric scale J^{1/3}.',split:'Kinematic split',splitText:'In three dimensions F̄ = J^{-1/3}F, hence det F̄ = 1. Isochoric invariants are then formed from C̄ = F̄ᵀF̄.',energy:'Energy split',energyText:'A typical hyperelastic model is written Ψ = Ψ_iso(C̄) + Ψ_vol(J). The first term controls shape, the second volume.',mode:'mode',iso:'shape change',vol:'volume change',mixed:'mixed mode',l1:'λ₁',l2:'λ₂',l3:'λ₃',J:'J',Jbar:'det F̄',I1bar:'Ī₁',psiIso:'Ψ_iso',psiVol:'Ψ_vol',sceneKicker:'ИЗОХОРНАЯ / ОБЪЁМНАЯ ЧАСТЬ',sceneTitle:'switch modes and see whether shape, volume, or both are changing',checkpoint:'CHECKPOINT',checkpointTitle:'What should happen to Ψ_vol during purely isochoric deformation?',checkpointText:'If J = 1, the volumetric contribution should vanish or attain its minimum, leaving deformation energy in Ψ_iso.',conclusion:'CONCLUSION',conclusionTitle:'Nearly incompressible materials require separate control of shape and volume.',conclusionText:'Next we examine pressure, volumetric penalties, and numerical issues in nearly incompressible models.',deepen:'Go deeper',deepenText:'Isochoric invariants are often defined as Ī₁ = J^{-2/3}I₁ and Ī₂ = J^{-4/3}I₂. They are insensitive to uniform volume change.',research:'Research note',researchText:'In nonlinear FEM, a very large bulk modulus κ produces a stiff system and can cause volumetric locking. Mixed u–p formulations are therefore common for nearly incompressible materials.',warning:'IMPORTANT',warningTitle:'Large κ is not the same as enforcing J = 1 exactly.',warningText:'A penalty approach only approximates incompressibility. Exact enforcement typically introduces pressure as an independent variable or uses a mixed formulation.',back:'← D05',next:'D07 → near incompressibility',interactive:'INTERACTIVE'}
} as const

function fmt(v:number,d=4){return (Math.abs(v)<1e-12?0:v).toFixed(d)}

export function IsochoricVolumetricSplit({notation,language,onBack,onNext}:Props){
 const copy=text[language]
 const [mode,setMode]=useState<Mode>('mixed')
 const [shape,setShape]=useState(1.25)
 const [volume,setVolume]=useState(1.06)
 const [mu,setMu]=useState(15)
 const [kappa,setKappa]=useState(120)

 const data=useMemo(()=>{
   let l1=1,l2=1,l3=1
   if(mode==='isochoric'){ l1=shape; l2=Math.pow(shape,-.5); l3=l2 }
   if(mode==='volumetric'){ const q=Math.pow(volume,1/3); l1=q;l2=q;l3=q }
   if(mode==='mixed'){ const q=Math.pow(volume,1/3); l1=q*shape;l2=q*Math.pow(shape,-.5);l3=l2 }
   const J=l1*l2*l3
   const q=Math.pow(J,-1/3)
   const b1=q*l1,b2=q*l2,b3=q*l3
   const Jbar=b1*b2*b3
   const I1bar=b1*b1+b2*b2+b3*b3
   const psiIso=.5*mu*(I1bar-3)
   const psiVol=.5*kappa*Math.pow(J-1,2)
   return {l1,l2,l3,J,Jbar,I1bar,psiIso,psiVol}
 },[mode,shape,volume,mu,kappa])

 const formula=notation==='Python'
 ? 'J=np.linalg.det(F); Fbar=J**(-1/3)*F'
 : notation==='Index'
 ? 'F̄_iJ = J^{-1/3} F_iJ,   det F̄ = 1'
 : 'F = J^{1/3}F̄,   F̄ = J^{-1/3}F,   det F̄ = 1'

 const sx=22*data.l1, sy=22*data.l2
 return <section className="module-view module-view-stacked"><div className="lesson-copy">
 <div className="lesson-index">D06</div><h1>{copy.title}</h1><p className="lead">{copy.lead}</p>
 <div className="concept-card"><span>{copy.key}</span><strong>{copy.keyText}</strong></div>
 <div className="definition"><div className="definition-label">{copy.split}</div><div className="formula">{formula}</div><p>{copy.splitText}</p></div>
 <div className="definition"><div className="definition-label">{copy.energy}</div><div className="formula">Ψ = Ψ_iso(C̄) + Ψ_vol(J)</div><p>{copy.energyText}</p></div>
 <div className="warning-card kinematics-warning"><span>{copy.warning}</span><strong>{copy.warningTitle}</strong><p>{copy.warningText}</p></div>
 <DepthNote label={copy.deepen}><p>{copy.deepenText}</p></DepthNote><DepthNote label={copy.research} variant="research"><p>{copy.researchText}</p></DepthNote>
 <ApplicationLinks language={language} items={[{ru:'Мягкие ткани',en:'Soft tissues'},{ru:'Эластомеры',en:'Elastomers'},{ru:'Нелинейный МКЭ',en:'Nonlinear FEM'},{ru:'Смешанные u–p постановки',en:'Mixed u–p formulations'}]}/>
 <div className="mini-toggle-row" style={{marginTop:20}}>{onBack&&<button className="text-button" onClick={onBack}>{copy.back}</button>}{onNext&&<button className="primary-button" onClick={onNext}>{copy.next}</button>}</div>
 </div><div className="scene-column"><div className="scene-card">
 <div className="scene-head"><div><span className="scene-kicker">{copy.sceneKicker}</span><h2>{copy.sceneTitle}</h2></div><div className="live-badge">{copy.interactive}</div></div>
 <div className="mini-toggle-row" style={{marginBottom:14}}>
 <button className={mode==='isochoric'?'toggle active':'toggle'} onClick={()=>setMode('isochoric')}>{copy.iso}</button>
 <button className={mode==='volumetric'?'toggle active':'toggle'} onClick={()=>setMode('volumetric')}>{copy.vol}</button>
 <button className={mode==='mixed'?'toggle active':'toggle'} onClick={()=>setMode('mixed')}>{copy.mixed}</button>
 </div>
 <svg className="balance-scene" viewBox="0 0 100 64"><rect x="5" y="6" width="90" height="52" rx="9" fill="#111318"/><rect x="17" y="21" width="22" height="22" fill="none" stroke="#69717C" strokeWidth=".8"/><rect x={70-sx/2} y={32-sy/2} width={sx} height={sy} fill="rgba(169,227,210,.10)" stroke="#A9E3D2" strokeWidth="1.1"/><line x1="40" y1="32" x2="56" y2="32" stroke="#2864FF" strokeWidth="1.2"/><polygon points="56,32 52.5,30 52.5,34" fill="#2864FF"/><text x="17" y="17" fill="#F4F2EC" fontSize="2.3">{language==='ru'?'начальная':'reference'}</text><text x="62" y="17" fill="#F4F2EC" fontSize="2.3">{language==='ru'?'текущая':'current'}</text></svg>
 <div className="control-stack">
 <label><span>{copy.iso}<strong>{fmt(shape,2)}</strong></span><input type="range" min=".7" max="1.6" step=".01" value={shape} onChange={e=>setShape(Number(e.target.value))}/></label>
 <label><span>{copy.vol}<strong>{fmt(volume,3)}</strong></span><input type="range" min=".82" max="1.18" step=".005" value={volume} onChange={e=>setVolume(Number(e.target.value))}/></label>
 <label><span>μ<strong>{fmt(mu,1)}</strong></span><input type="range" min="2" max="50" step="1" value={mu} onChange={e=>setMu(Number(e.target.value))}/></label>
 <label><span>κ<strong>{fmt(kappa,0)}</strong></span><input type="range" min="10" max="400" step="10" value={kappa} onChange={e=>setKappa(Number(e.target.value))}/></label>
 </div>
 <div className="transport-metrics"><div><span>{copy.J}</span><strong>{fmt(data.J)}</strong></div><div><span>{copy.Jbar}</span><strong>{fmt(data.Jbar)}</strong></div><div><span>{copy.I1bar}</span><strong>{fmt(data.I1bar)}</strong></div></div>
 <div className="transport-metrics metrics-secondary"><div><span>{copy.psiIso}</span><strong>{fmt(data.psiIso)}</strong></div><div><span>{copy.psiVol}</span><strong>{fmt(data.psiVol)}</strong></div><div><span>{copy.l1},{copy.l2},{copy.l3}</span><strong>{fmt(data.l1,2)} · {fmt(data.l2,2)} · {fmt(data.l3,2)}</strong></div></div>
 </div><div className="bottom-grid"><div className="prediction-card"><span>{copy.checkpoint}</span><strong>{copy.checkpointTitle}</strong><p>{copy.checkpointText}</p></div><div className="author-card"><span>{copy.conclusion}</span><strong>{copy.conclusionTitle}</strong><p>{copy.conclusionText}</p></div></div></div></section>
}