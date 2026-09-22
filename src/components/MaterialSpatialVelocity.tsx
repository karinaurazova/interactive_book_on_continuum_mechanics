import { useMemo, useState } from 'react'
import type { Language, NotationMode } from '../i18n'

type Props = {
  notation: NotationMode
  language: Language
  onBack: () => void
}

type Mode = 'material' | 'spatial'

const text = {
  ru: {
    back: '← T00',
    title: 'Материальное и пространственное описание скорости',
    lead: 'Одну и ту же физическую скорость можно описывать двумя способами. В материальном описании мы спрашиваем о скорости выбранной частицы X. В пространственном — о скорости той частицы, которая в данный момент находится в точке x.',
    key: 'ОДНА СКОРОСТЬ — ДВА АРГУМЕНТА',
    keyText: 'Материальное поле V(X,t) и пространственное поле v(x,t) описывают одну физическую величину. Они связаны заменой аргумента через отображение движения.',
    material: 'Следить за частицей X',
    spatial: 'Фиксировать точку пространства x*',
    materialText: 'Фиксируем материальную метку X и вычисляем V(X,t) = ∂χ(X,t)/∂t.',
    spatialText: 'Фиксируем пространственную точку x* и находим материальную метку X = χ⁻¹(x*,t), которая находится там в данный момент.',
    relation: 'Связь описаний',
    relationText: 'Пространственное поле скорости получается композицией материальной скорости с обратным движением.',
    sceneKicker: 'ДВА ВЗГЛЯДА НА СКОРОСТЬ',
    sceneTitle: 'переключайся между частицей и фиксированной точкой пространства',
    time: 'время t',
    stretch: 'масштаб движения a(t)',
    translation: 'перенос b(t)',
    selectedX: 'выбранная X',
    fixedx: 'фиксированная x*',
    currentx: 'текущее x',
    recoveredX: 'найденная X',
    velocity: 'скорость',
    materialMode: 'материальное описание',
    spatialMode: 'пространственное описание',
    warning: 'ВАЖНО',
    warningTitle: 'v(x,t) — не другая скорость.',
    warningText: 'Это та же скорость, только выраженная как функция текущей точки пространства. Различается способ адресации состояния, а не физическая величина.',
    question: 'ВОПРОС ДЛЯ ПРОВЕРКИ',
    questionTitle: 'Почему при фиксированной x* материальная метка X обычно меняется со временем?',
    questionText: 'Потому что через одну и ту же точку пространства в разные моменты проходят разные материальные частицы.',
    conclusion: 'ВЫВОД',
    conclusionTitle: 'Материальное описание отвечает «что делает эта частица?», пространственное — «что происходит здесь?».',
    conclusionText: 'Следующий шаг — ускорение и материальная производная, где различие этих двух взглядов становится особенно важным.',
    interactive: 'ИНТЕРАКТИВНО',
  },
  en: {
    back: '← T00',
    title: 'Material and spatial descriptions of velocity',
    lead: 'The same physical velocity can be described in two ways. The material description asks for the velocity of a selected particle X. The spatial description asks for the velocity of the particle currently located at x.',
    key: 'ONE VELOCITY — TWO ARGUMENTS',
    keyText: 'The material field V(X,t) and the spatial field v(x,t) describe the same physical quantity. They are related by changing arguments through the motion map.',
    material: 'Follow particle X',
    spatial: 'Fix spatial point x*',
    materialText: 'Fix the material label X and compute V(X,t) = ∂χ(X,t)/∂t.',
    spatialText: 'Fix a spatial point x* and determine X = χ⁻¹(x*,t), the material label currently located there.',
    relation: 'Relation between descriptions',
    relationText: 'The spatial velocity field is obtained by composing material velocity with the inverse motion.',
    sceneKicker: 'TWO VIEWS OF VELOCITY',
    sceneTitle: 'switch between a material particle and a fixed spatial point',
    time: 'time t',
    stretch: 'motion scale a(t)',
    translation: 'translation b(t)',
    selectedX: 'selected X',
    fixedx: 'fixed x*',
    currentx: 'current x',
    recoveredX: 'recovered X',
    velocity: 'velocity',
    materialMode: 'material description',
    spatialMode: 'spatial description',
    warning: 'IMPORTANT',
    warningTitle: 'v(x,t) is not a different velocity.',
    warningText: 'It is the same velocity expressed as a function of current spatial position. The addressing of the state changes, not the physical quantity.',
    question: 'CHECKPOINT',
    questionTitle: 'Why does the material label X usually change with time when x* is fixed?',
    questionText: 'Because different material particles pass through the same spatial point at different times.',
    conclusion: 'CONCLUSION',
    conclusionTitle: 'Material description asks “what is this particle doing?”, spatial description asks “what is happening here?”.',
    conclusionText: 'Next we move to acceleration and the material derivative, where this distinction becomes essential.',
    interactive: 'INTERACTIVE',
  },
} as const

function fmt(v:number,d=2){
  return (Math.abs(v)<1e-10?0:v).toFixed(d)
}

export function MaterialSpatialVelocity({notation,language,onBack}:Props){
  const copy=text[language]
  const [mode,setMode]=useState<Mode>('material')
  const [time,setTime]=useState(0.30)
  const [X,setX]=useState(0.30)
  const [xStar,setXStar]=useState(0.55)

  const data=useMemo(()=>{
    const a=1+0.28*Math.sin(2*Math.PI*time)
    const adot=0.56*Math.PI*Math.cos(2*Math.PI*time)
    const b=0.22*Math.sin(2*Math.PI*time+0.45)
    const bdot=0.44*Math.PI*Math.cos(2*Math.PI*time+0.45)

    const x=a*X+b
    const V=adot*X+bdot
    const recoveredX=(xStar-b)/a
    const vStar=adot*recoveredX+bdot

    return {a,adot,b,bdot,x,V,recoveredX,vStar}
  },[time,X,xStar])

  const notationLine =
    notation==='Index' ? 'vᵢ(x,t) = Vᵢ(χ⁻¹(x,t),t)' :
    notation==='Matrix' ? 'v(x,t) = V(χ⁻¹(x,t), t)' :
    notation==='Python' ? 'v = V(chi_inv(x, t), t)' :
    '𝐯(𝐱,t) = 𝐕(χ⁻¹(𝐱,t),t)'

  const mapX=(q:number)=>12+76*(q+0.3)/1.6
  const particleX=mode==='material'?X:data.recoveredX
  const currentX=mode==='material'?data.x:xStar
  const vel=mode==='material'?data.V:data.vStar
  const pRef=mapX(particleX)
  const pCur=mapX(currentX)
  const velEnd=pCur+8*vel

  return (
    <section className="module-view module-view-stacked">
      <div className="lesson-copy">
        <button className="text-button" onClick={onBack}>{copy.back}</button>
        <div className="lesson-index">T01 / 11</div>
        <h1>{copy.title}</h1>
        <p className="lead">{copy.lead}</p>

        <div className="concept-card">
          <span>{copy.key}</span>
          <strong>{copy.keyText}</strong>
        </div>

        <div className="definition">
          <div className="definition-label">{mode==='material'?copy.material:copy.spatial}</div>
          <div className="formula">
            {mode==='material' ? '𝐕(𝐗,t) = ∂χ(𝐗,t)/∂t |𝐗' : notationLine}
          </div>
          <p>{mode==='material'?copy.materialText:copy.spatialText}</p>
        </div>

        <div className="definition">
          <div className="definition-label">{copy.relation}</div>
          <div className="formula">{notationLine}</div>
          <p>{copy.relationText}</p>
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
            <button className={mode==='material'?'decomp-toggle active':'decomp-toggle'} onClick={()=>setMode('material')}>{copy.materialMode}</button>
            <button className={mode==='spatial'?'decomp-toggle active':'decomp-toggle'} onClick={()=>setMode('spatial')}>{copy.spatialMode}</button>
          </div>

          <svg className="transport-scene" viewBox="0 0 100 64" role="img">
            <rect x="5" y="6" width="90" height="52" rx="9" fill="#111318"/>
            <line x1="12" y1="22" x2="88" y2="22" stroke="#5E6774" strokeWidth=".7"/>
            <line x1="12" y1="43" x2="88" y2="43" stroke="#5E6774" strokeWidth=".7"/>
            <text x="8" y="17" fill="#8E96A3" fontSize="2.7">reference</text>
            <text x="8" y="38" fill="#8E96A3" fontSize="2.7">current</text>

            <circle cx={pRef} cy="22" r="1.8" fill="#A9E3D2"/>
            <circle cx={pCur} cy="43" r="2.0" fill={mode==='material'?'#2864FF':'#DD7A2B'}/>
            <line x1={pRef} y1="24" x2={pCur} y2="41" stroke="rgba(244,242,236,.28)" strokeDasharray="1.4 1.4" strokeWidth=".6"/>
            <line x1={pCur} y1="43" x2={velEnd} y2="43" stroke="#2864FF" strokeWidth="1.5"/>

            {mode==='spatial' && <>
              <line x1={mapX(xStar)} y1="33" x2={mapX(xStar)} y2="53" stroke="#DD7A2B" strokeWidth=".7" strokeDasharray="1 1"/>
              <text x={mapX(xStar)+1.5} y="52" fill="#DD7A2B" fontSize="2.5">x*</text>
            </>}
          </svg>

          <div className="control-stack">
            <label><span>{copy.time} <strong>{fmt(time)}</strong></span><input type="range" min="0" max="1" step=".01" value={time} onChange={e=>setTime(Number(e.target.value))}/></label>
            {mode==='material' ? (
              <label><span>{copy.selectedX} <strong>{fmt(X)}</strong></span><input type="range" min="-.15" max=".85" step=".01" value={X} onChange={e=>setX(Number(e.target.value))}/></label>
            ) : (
              <label><span>{copy.fixedx} <strong>{fmt(xStar)}</strong></span><input type="range" min="-.10" max="1.05" step=".01" value={xStar} onChange={e=>setXStar(Number(e.target.value))}/></label>
            )}
          </div>

          <div className="transport-metrics">
            <div><span>{mode==='material'?copy.selectedX:copy.recoveredX}</span><strong>{fmt(particleX)}</strong></div>
            <div><span>{copy.currentx}</span><strong>{fmt(currentX)}</strong></div>
            <div><span>{copy.velocity}</span><strong>{fmt(vel)}</strong></div>
            <div><span>a(t), b(t)</span><strong>{fmt(data.a)}, {fmt(data.b)}</strong></div>
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
