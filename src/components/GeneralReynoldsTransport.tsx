import { useMemo, useState } from 'react'
import type { Language, NotationMode } from '../i18n'

type Props = {
  notation: NotationMode
  language: Language
  onBack: () => void
}

type Mode = 'fixed' | 'material' | 'moving'

const text = {
  ru: {
    back:'← T08',
    title:'Общая теорема Рейнольдса для движущегося контрольного объёма',
    lead:'Фиксированный контрольный объём и материальная область — это два предельных случая одной общей картины. Если граница движется со своей скоростью w, поток через неё определяется относительной скоростью вещества и границы.',
    key:'ОТНОСИТЕЛЬНАЯ СКОРОСТЬ ЧЕРЕЗ ГРАНИЦУ',
    keyText:'Для движущегося контрольного объёма V(t) поверхностный поток определяется величиной φ(v−w)·n.',
    general:'Общая форма',
    generalText:'Скорость изменения интеграла по движущемуся контрольному объёму складывается из локального накопления и относительного потока через его границу.',
    limits:'Два важных предельных случая',
    limitsText:'Если w = 0, получаем фиксированный контрольный объём. Если w = v на границе, относительный поток исчезает и область становится материальной.',
    fixed:'фиксированный объём',
    material:'материальная область',
    moving:'движущаяся граница',
    sceneKicker:'ОБЩАЯ ТЕОРЕМА РЕЙНОЛЬДСА',
    sceneTitle:'меняй скорость границы и наблюдай относительный поток',
    materialSpeed:'скорость вещества v',
    boundarySpeed:'скорость границы w',
    relativeSpeed:'относительная скорость v−w',
    fieldLevel:'уровень поля φ',
    accumulation:'накопление внутри',
    relativeFlux:'относительный поток',
    total:'итоговая скорость изменения',
    warning:'ВАЖНО',
    warningTitle:'Материальная область — это не «ещё один контрольный объём», а специальный выбор скорости границы.',
    warningText:'На материальной границе w = v, поэтому ни одна материальная частица не пересекает поверхность и относительный поток через неё равен нулю.',
    question:'ВОПРОС ДЛЯ ПРОВЕРКИ',
    questionTitle:'При каком условии поверхностный поток исчезает?',
    questionText:'Когда нормальные компоненты скоростей вещества и границы совпадают: (v−w)·n = 0.',
    conclusion:'ВЫВОД',
    conclusionTitle:'Фиксированная, движущаяся и материальная области объединяются одной формулой.',
    conclusionText:'После этого кинематический аппарат готов к переходу к законам сохранения.',
    interactive:'ИНТЕРАКТИВНО',
  },
  en: {
    back:'← T08',
    title:'General Reynolds transport theorem for a moving control volume',
    lead:'A fixed control volume and a material region are two limiting cases of one general picture. If the boundary moves with its own velocity w, transport across it is governed by the relative velocity between material and boundary.',
    key:'RELATIVE VELOCITY THROUGH THE BOUNDARY',
    keyText:'For a moving control volume V(t), the surface transport term is governed by φ(v−w)·n.',
    general:'General form',
    generalText:'The rate of change of an integral over a moving control volume combines local accumulation and relative transport through its boundary.',
    limits:'Two important limiting cases',
    limitsText:'If w = 0, the control volume is fixed. If w = v at the boundary, relative flux vanishes and the region is material.',
    fixed:'fixed volume',
    material:'material region',
    moving:'moving boundary',
    sceneKicker:'GENERAL REYNOLDS THEOREM',
    sceneTitle:'change boundary speed and observe relative flux',
    materialSpeed:'material speed v',
    boundarySpeed:'boundary speed w',
    relativeSpeed:'relative speed v−w',
    fieldLevel:'field level φ',
    accumulation:'accumulation inside',
    relativeFlux:'relative flux',
    total:'total rate',
    warning:'IMPORTANT',
    warningTitle:'A material region is not just another control volume; it is a special choice of boundary velocity.',
    warningText:'On a material boundary w = v, so no material particle crosses the surface and relative flux vanishes.',
    question:'CHECKPOINT',
    questionTitle:'When does the surface flux disappear?',
    questionText:'When the normal components of material and boundary velocities agree: (v−w)·n = 0.',
    conclusion:'CONCLUSION',
    conclusionTitle:'Fixed, moving, and material regions are unified by one formula.',
    conclusionText:'The kinematic framework is now ready for the conservation laws.',
    interactive:'INTERACTIVE',
  }
} as const

function fmt(v:number,d=3){
  return (Math.abs(v)<1e-10?0:v).toFixed(d)
}

export function GeneralReynoldsTransport({notation,language,onBack}:Props){
  const copy=text[language]
  const [mode,setMode]=useState<Mode>('moving')
  const [v,setV]=useState(0.75)
  const [w,setW]=useState(0.30)
  const [phi,setPhi]=useState(1.20)

  const boundarySpeed = mode==='fixed' ? 0 : mode==='material' ? v : w
  const relative = v-boundarySpeed

  const data=useMemo(()=>{
    // 1D moving control interval with constant length L=1 translated by w
    // uniform phi with explicit local growth q
    const q=0.20
    const accumulation=q
    // equal-length interval: net relative surface flux cancels for uniform phi.
    // To visualize a nonzero net term, use phi(x)=phi + c x with c fixed.
    const c=0.35
    const netRelativeFlux=relative*c
    const total=accumulation+netRelativeFlux
    return {q,c,accumulation,netRelativeFlux,total}
  },[relative])

  const notationLine =
    notation==='Index'
      ? 'd/dt ∫V(t) φ dv = ∫V(t) ∂φ/∂t dv − ∫∂V(t) φ (vᵢ−wᵢ)nᵢ da'
      : notation==='Matrix'
      ? 'd/dt ∫V(t) φ dv = ∫V(t) ∂φ/∂t dv − ∫∂V(t) φ (v−w)·n da'
      : notation==='Python'
      ? 'rate = accumulation - relative_boundary_flux'
      : 'd/dt ∫V(t) φ dv = ∫V(t) ∂φ/∂t dv − ∫∂V(t) φ (𝐯−𝐰)·𝐧 da'

  const boxX=22+10*boundarySpeed
  const boxW=52
  const particleShift=12*v

  return (
    <section className="module-view module-view-stacked">
      <div className="lesson-copy">
        <button className="text-button" onClick={onBack}>{copy.back}</button>
        <div className="lesson-index">T09 / 11</div>
        <h1>{copy.title}</h1>
        <p className="lead">{copy.lead}</p>

        <div className="concept-card">
          <span>{copy.key}</span>
          <strong>{copy.keyText}</strong>
        </div>

        <div className="definition">
          <div className="definition-label">{copy.general}</div>
          <div className="formula">{notationLine}</div>
          <p>{copy.generalText}</p>
        </div>

        <div className="definition">
          <div className="definition-label">{copy.limits}</div>
          <p>{copy.limitsText}</p>
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
            <button className={mode==='fixed'?'decomp-toggle active':'decomp-toggle'} onClick={()=>setMode('fixed')}>{copy.fixed}</button>
            <button className={mode==='moving'?'decomp-toggle active':'decomp-toggle'} onClick={()=>setMode('moving')}>{copy.moving}</button>
            <button className={mode==='material'?'decomp-toggle active':'decomp-toggle'} onClick={()=>setMode('material')}>{copy.material}</button>
          </div>

          <svg className="transport-scene" viewBox="0 0 100 66" role="img">
            <rect x="5" y="6" width="90" height="54" rx="9" fill="#111318"/>
            <rect x={boxX} y="20" width={boxW} height="28" rx="3" fill="rgba(40,100,255,.08)" stroke="#2864FF" strokeWidth=".85"/>

            <line x1={boxX} y1="16" x2={boxX+8*boundarySpeed} y2="16" stroke="#DD7A2B" strokeWidth="1.3"/>
            <text x={boxX+1} y="13" fill="#DD7A2B" fontSize="2.5">w</text>

            <line x1={boxX+18} y1="34" x2={boxX+18+particleShift} y2="34" stroke="#A9E3D2" strokeWidth="1.4"/>
            <text x={boxX+19} y="30" fill="#A9E3D2" fontSize="2.5">v</text>

            <line x1={boxX+18} y1="43" x2={boxX+18+10*relative} y2="43" stroke="#2864FF" strokeWidth="1.4"/>
            <text x={boxX+19} y="47" fill="#2864FF" fontSize="2.5">v−w</text>
          </svg>

          <div className="control-stack">
            <label><span>{copy.materialSpeed} <strong>{fmt(v,2)}</strong></span><input type="range" min="-.9" max=".9" step=".01" value={v} onChange={e=>setV(Number(e.target.value))}/></label>
            {mode==='moving' && <label><span>{copy.boundarySpeed} <strong>{fmt(w,2)}</strong></span><input type="range" min="-.9" max=".9" step=".01" value={w} onChange={e=>setW(Number(e.target.value))}/></label>}
            <label><span>{copy.fieldLevel} <strong>{fmt(phi,2)}</strong></span><input type="range" min=".3" max="1.8" step=".01" value={phi} onChange={e=>setPhi(Number(e.target.value))}/></label>
          </div>

          <div className="transport-metrics">
            <div><span>{copy.materialSpeed}</span><strong>{fmt(v)}</strong></div>
            <div><span>{copy.boundarySpeed}</span><strong>{fmt(boundarySpeed)}</strong></div>
            <div><span>{copy.relativeSpeed}</span><strong>{fmt(relative)}</strong></div>
            <div><span>{copy.accumulation}</span><strong>{fmt(data.accumulation)}</strong></div>
            <div><span>{copy.relativeFlux}</span><strong>{fmt(data.netRelativeFlux)}</strong></div>
            <div><span>{copy.total}</span><strong>{fmt(data.total)}</strong></div>
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
