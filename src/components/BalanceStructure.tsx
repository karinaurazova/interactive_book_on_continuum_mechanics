import { useMemo, useState } from 'react'
import type { Language, NotationMode } from '../i18n'
import { DepthNote } from './DepthNote'

type Props = {
  notation: NotationMode
  language: Language
  onNext: () => void
}

const text = {
  ru: {
    title:'Что означает закон баланса?',
    lead:'Законы сохранения массы, импульса и энергии отличаются физическим содержанием, но устроены одинаково: нужно учесть, сколько величины накопилось внутри области, сколько ушло через границу и сколько было создано или передано источниками.',
    key:'УНИВЕРСАЛЬНАЯ СТРУКТУРА',
    keyText:'Накопление + чистый отток через границу = объёмные и поверхностные источники соответствующей величины.',
    accumulation:'Накопление',
    accumulationText:'Показывает, как быстро меняется количество рассматриваемой величины внутри выбранной области.',
    flux:'Чистый отток',
    fluxText:'Учитывает перенос величины через границу. Положительный чистый отток уменьшает запас внутри области, если нет компенсирующих источников.',
    source:'Источники',
    sourceText:'Описывают создание, уничтожение или внешнюю передачу рассматриваемой величины внутри области или через её границу.',
    sceneKicker:'СТРУКТУРА БАЛАНСА',
    sceneTitle:'меняй поток и источник и наблюдай, как меняется накопление',
    inflow:'входящий поток',
    outflow:'выходящий поток',
    sourceRate:'источник',
    netOut:'чистый отток',
    accumulationRate:'скорость накопления',
    stored:'запас внутри',
    time:'время t',
    warning:'ВАЖНО',
    warningTitle:'«Баланс» не всегда означает «сохранение».',
    warningText:'Если у величины есть источники или стоки, её интеграл по области может меняться даже без потока через границу. Закон сохранения — частный случай баланса при соответствующих нулевых источниках.',
    question:'ВОПРОС ДЛЯ ПРОВЕРКИ',
    questionTitle:'Что должно произойти, если источник точно компенсирует чистый отток?',
    questionText:'Скорость накопления станет нулевой: запас внутри области в этот момент не меняется.',
    conclusion:'ВЫВОД',
    conclusionTitle:'Масса, импульс и энергия отличаются не схемой баланса, а тем, что именно накапливается, переносится и выступает источником.',
    conclusionText:'Следующий модуль применит эту структуру к массе и приведёт к уравнению неразрывности.',
    deepen:'Углубиться',
    deepenText:'Для произвольной интегральной величины с объёмной плотностью b можно записать баланс как d/dt ∫V b dv + ∫∂V j·n da = ∫V s dv + поверхностные внешние вклады. Конкретный физический закон определяется выбором b, потока j и источников s.',
    research:'Исследовательское замечание',
    researchText:'В механике сплошных сред одна и та же физика может быть записана в материальной, пространственной или контрольной форме. Эквивалентность форм требует корректного применения транспортной теоремы и теоремы Гаусса.',
    interactive:'ИНТЕРАКТИВНО',
    next:'Перейти к балансу массы →',
  },
  en: {
    title:'What does a balance law mean?',
    lead:'Conservation of mass, momentum, and energy differ in physical content but share the same structure: account for what accumulates inside a region, what leaves through its boundary, and what is supplied by sources.',
    key:'UNIVERSAL STRUCTURE',
    keyText:'Accumulation + net outward flux through the boundary = volumetric and surface sources of the corresponding quantity.',
    accumulation:'Accumulation',
    accumulationText:'Measures how fast the amount of the chosen quantity changes inside the region.',
    flux:'Net outward flux',
    fluxText:'Accounts for transport through the boundary. Positive net outward flux reduces the amount stored inside unless compensated by sources.',
    source:'Sources',
    sourceText:'Represent production, destruction, or external supply of the quantity inside the region or through its boundary.',
    sceneKicker:'BALANCE STRUCTURE',
    sceneTitle:'change flux and source and observe the accumulation rate',
    inflow:'inflow',
    outflow:'outflow',
    sourceRate:'source',
    netOut:'net outward flux',
    accumulationRate:'accumulation rate',
    stored:'stored amount',
    time:'time t',
    warning:'IMPORTANT',
    warningTitle:'A balance law is not always a conservation law.',
    warningText:'If sources or sinks are present, the integral over a region may change even without boundary transport. Conservation is a special balance case with the relevant sources equal to zero.',
    question:'CHECKPOINT',
    questionTitle:'What happens if the source exactly compensates the net outward flux?',
    questionText:'The accumulation rate becomes zero: the stored amount is instantaneously constant.',
    conclusion:'CONCLUSION',
    conclusionTitle:'Mass, momentum, and energy differ not in balance structure but in what is stored, transported, and supplied.',
    conclusionText:'The next module applies this structure to mass and leads to the continuity equation.',
    deepen:'Go deeper',
    deepenText:'For an integral quantity with volumetric density b, a generic balance may be written as d/dt ∫V b dv + ∫∂V j·n da = ∫V s dv plus possible external surface contributions. The particular physical law is set by the choice of b, flux j, and sources s.',
    research:'Research note',
    researchText:'In continuum mechanics, the same physics may be written in material, spatial, or control-volume form. Equivalence requires consistent use of the transport theorem and Gauss theorem.',
    interactive:'INTERACTIVE',
    next:'Continue to mass balance →',
  }
} as const

function fmt(v:number,d=2){
  return (Math.abs(v)<1e-10?0:v).toFixed(d)
}

export function BalanceStructure({notation,language,onNext}:Props){
  const copy=text[language]
  const [inflow,setInflow]=useState(0.70)
  const [outflow,setOutflow]=useState(0.45)
  const [source,setSource]=useState(0.10)
  const [time,setTime]=useState(0.60)

  const data=useMemo(()=>{
    const netOut=outflow-inflow
    const accumulation=source-netOut
    const initial=1.0
    const stored=initial+accumulation*time
    return {netOut,accumulation,stored}
  },[inflow,outflow,source,time])

  const notationLine =
    notation==='Index' ? 'dB/dt + ∮ jᵢ nᵢ da = S' :
    notation==='Matrix' ? 'dB/dt + ∮ j·n da = S' :
    notation==='Python' ? 'accumulation + net_outflux = source' :
    'накопление + чистый отток = источники'

  const sourceHeight=Math.max(0,Math.min(16,8+8*source))
  const storedHeight=Math.max(4,Math.min(24,8+8*data.stored))

  return (
    <section className="module-view module-view-stacked">
      <div className="lesson-copy">
        <div className="lesson-index">B00 / 10</div>
        <h1>{copy.title}</h1>
        <p className="lead">{copy.lead}</p>

        <div className="concept-card">
          <span>{copy.key}</span>
          <strong>{copy.keyText}</strong>
        </div>

        <div className="definition">
          <div className="definition-label">{copy.accumulation}</div>
          <div className="formula">{notationLine}</div>
          <p>{copy.accumulationText}</p>
        </div>

        <div className="definition">
          <div className="definition-label">{copy.flux}</div>
          <p>{copy.fluxText}</p>
        </div>

        <div className="definition">
          <div className="definition-label">{copy.source}</div>
          <p>{copy.sourceText}</p>
        </div>

        <div className="warning-card kinematics-warning">
          <span>{copy.warning}</span>
          <strong>{copy.warningTitle}</strong>
          <p>{copy.warningText}</p>
        </div>

        <DepthNote label={copy.deepen}>
          <p>{copy.deepenText}</p>
        </DepthNote>
        <DepthNote label={copy.research} variant="research">
          <p>{copy.researchText}</p>
        </DepthNote>

        <button className="primary-button" onClick={onNext}>{copy.next}</button>
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

          <svg className="balance-scene" viewBox="0 0 100 68" role="img">
            <rect x="5" y="6" width="90" height="56" rx="9" fill="#111318"/>
            <rect x="28" y="20" width="44" height="30" rx="3" fill="rgba(40,100,255,.08)" stroke="#2864FF" strokeWidth=".8"/>

            <rect x="33" y={48-storedHeight} width="34" height={storedHeight} rx="2" fill="rgba(169,227,210,.16)"/>
            <text x="40" y="55" fill="#A9E3D2" fontSize="2.5">{copy.stored}: {fmt(data.stored)}</text>

            <line x1="12" y1="34" x2="27" y2="34" stroke="#A9E3D2" strokeWidth={1+1.8*Math.abs(inflow)}/>
            <line x1="73" y1="34" x2="88" y2="34" stroke="#2864FF" strokeWidth={1+1.8*Math.abs(outflow)}/>
            <text x="10" y="29" fill="#A9E3D2" fontSize="2.4">{copy.inflow}</text>
            <text x="77" y="29" fill="#2864FF" fontSize="2.4">{copy.outflow}</text>

            <line x1="50" y1="18" x2="50" y2={18-sourceHeight} stroke="#DD7A2B" strokeWidth="1.4"/>
            <text x="52" y="13" fill="#DD7A2B" fontSize="2.4">{copy.sourceRate}</text>
          </svg>

          <div className="control-stack">
            <label><span>{copy.inflow} <strong>{fmt(inflow)}</strong></span><input type="range" min="0" max="1.2" step=".01" value={inflow} onChange={e=>setInflow(Number(e.target.value))}/></label>
            <label><span>{copy.outflow} <strong>{fmt(outflow)}</strong></span><input type="range" min="0" max="1.2" step=".01" value={outflow} onChange={e=>setOutflow(Number(e.target.value))}/></label>
            <label><span>{copy.sourceRate} <strong>{fmt(source)}</strong></span><input type="range" min="-.8" max=".8" step=".01" value={source} onChange={e=>setSource(Number(e.target.value))}/></label>
            <label><span>{copy.time} <strong>{fmt(time)}</strong></span><input type="range" min="0" max="1.5" step=".01" value={time} onChange={e=>setTime(Number(e.target.value))}/></label>
          </div>

          <div className="transport-metrics">
            <div><span>{copy.netOut}</span><strong>{fmt(data.netOut)}</strong></div>
            <div><span>{copy.sourceRate}</span><strong>{fmt(source)}</strong></div>
            <div><span>{copy.accumulationRate}</span><strong>{fmt(data.accumulation)}</strong></div>
            <div><span>{copy.stored}</span><strong>{fmt(data.stored)}</strong></div>
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
