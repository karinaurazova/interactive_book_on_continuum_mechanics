import { useMemo, useState } from 'react'
import type { Language, NotationMode } from '../i18n'
import { DepthNote } from './DepthNote'

type Props = {
  notation: NotationMode
  language: Language
  onBack: () => void
}

const text = {
  ru: {
    back:'← B04',
    title:'Мощность напряжений: сферическая и девиаторная части',
    lead:'Мощность напряжений σ:D показывает скорость механической работы на единицу текущего объёма. Разложение σ и D позволяет отделить вклад среднего напряжения от вклада девиаторных частей.',
    key:'МОЩНОСТЬ РАЗЛАГАЕТСЯ ТОЧНО',
    keyText:'σ:D = (1/3 trσ)(trD) + s:D_dev.',
    split:'Алгебраическое разложение',
    splitText:'Сферическая часть σ взаимодействует только со сферической частью D, а девиатор s — только с D_dev, потому что след девиаторов равен нулю.',
    interpretation:'Физическая интерпретация',
    interpretationText:'При заданных σ и D первый член связан с текущей объёмной скоростью деформации, второй — с девиаторной частью скорости деформации. Но это ещё не означает универсального разделения всей энергии материала на «объёмную» и «формоизменяющую» части.',
    sceneKicker:'МОЩНОСТЬ НАПРЯЖЕНИЙ',
    sceneTitle:'меняй сферический и девиаторный вклады и наблюдай полный энергетический отклик',
    meanStress:'среднее напряжение p̄',
    devStress:'девиаторная амплитуда s',
    volumetricRate:'tr D',
    devRate:'девиаторная амплитуда D_dev',
    sphericalPower:'сферический вклад',
    deviatoricPower:'девиаторный вклад',
    totalPower:'σ:D',
    residual:'проверка суммы',
    warning:'ВАЖНО',
    warningTitle:'Сферическая часть напряжений не означает автоматически «чистое изменение объёма».',
    warningText:'Разложение мощности — точная алгебраика. Связь между напряжением, деформацией и энергией определяется конститутивной моделью; особенно это важно для анизотропных, несжимаемых и биологических материалов.',
    question:'ВОПРОС ДЛЯ ПРОВЕРКИ',
    questionTitle:'Можно ли получить ненулевую мощность при tr D = 0?',
    questionText:'Да. Если s:D_dev ≠ 0, девиаторный вклад остаётся ненулевым даже при нулевой объёмной скорости.',
    conclusion:'ВЫВОД',
    conclusionTitle:'Мощность напряжений естественно отделяет сферическую и девиаторную пары, но не заменяет конститутивный закон.',
    conclusionText:'Следующий шаг — второй закон термодинамики и ограничение допустимых конститутивных моделей через диссипацию.',
    deepen:'Углубиться',
    deepenText:'Пусть σ = p̄I + s, где p̄ = trσ/3 и tr s = 0, а D = (trD/3)I + D_dev, где tr D_dev = 0. Тогда смешанные двойные свёртки исчезают: (p̄I):D_dev = 0 и s:((trD/3)I)=0, поэтому σ:D = p̄ trD + s:D_dev.',
    research:'Исследовательское замечание',
    researchText:'В мягких тканях и других анизотропных материалах энергетический отклик определяется ориентацией волокон, структурными тензорами и выбранной свободной энергией. Поэтому девиаторная/сферическая декомпозиция полезна, но не должна подменять анизотропную конститутивную структуру.',
    interactive:'ИНТЕРАКТИВНО',
  },
  en: {
    back:'← B04',
    title:'Stress power: spherical and deviatoric parts',
    lead:'Stress power σ:D is the mechanical work rate per unit current volume. Decomposing σ and D separates the mean-stress contribution from the deviatoric contribution.',
    key:'STRESS POWER SPLITS EXACTLY',
    keyText:'σ:D = (1/3 trσ)(trD) + s:D_dev.',
    split:'Algebraic decomposition',
    splitText:'The spherical part of σ couples only to the spherical part of D, while s couples only to D_dev, because both deviators are traceless.',
    interpretation:'Physical interpretation',
    interpretationText:'For given σ and D, the first term is associated with the current volumetric strain rate and the second with the deviatoric strain-rate part. This does not universally split the total material energy into purely volumetric and shape-changing parts.',
    sceneKicker:'STRESS POWER',
    sceneTitle:'change spherical and deviatoric contributions and observe total mechanical power',
    meanStress:'mean stress p̄',
    devStress:'deviatoric amplitude s',
    volumetricRate:'tr D',
    devRate:'deviatoric amplitude D_dev',
    sphericalPower:'spherical contribution',
    deviatoricPower:'deviatoric contribution',
    totalPower:'σ:D',
    residual:'sum residual',
    warning:'IMPORTANT',
    warningTitle:'Spherical stress does not automatically mean “pure volume change”.',
    warningText:'The power split is an exact algebraic identity. The stress–strain–energy relation is constitutive, especially for anisotropic, incompressible, and biological materials.',
    question:'CHECKPOINT',
    questionTitle:'Can stress power be nonzero when tr D = 0?',
    questionText:'Yes. If s:D_dev ≠ 0, the deviatoric contribution remains nonzero even at zero volumetric rate.',
    conclusion:'CONCLUSION',
    conclusionTitle:'Stress power separates spherical and deviatoric pairs naturally, but does not replace a constitutive law.',
    conclusionText:'Next we introduce the second law and dissipation restrictions on constitutive models.',
    deepen:'Go deeper',
    deepenText:'Let σ = p̄I + s with p̄ = trσ/3 and tr s = 0, and D = (trD/3)I + D_dev with tr D_dev = 0. The mixed double contractions vanish, so σ:D = p̄ trD + s:D_dev.',
    research:'Research note',
    researchText:'In soft tissues and other anisotropic materials, energetic response depends on fiber orientation, structural tensors, and the chosen free-energy function. The spherical/deviatoric split is useful but should not replace anisotropic constitutive structure.',
    interactive:'INTERACTIVE',
  }
} as const

function fmt(v:number,d=4){
  return (Math.abs(v)<1e-10?0:v).toFixed(d)
}

export function StressPowerSplit({notation,language,onBack}:Props){
  const copy=text[language]
  const [meanStress,setMeanStress]=useState(.45)
  const [devStress,setDevStress]=useState(.35)
  const [trD,setTrD]=useState(.30)
  const [devRate,setDevRate]=useState(.25)

  const data=useMemo(()=>{
    const sphericalPower=meanStress*trD
    const deviatoricPower=2*devStress*devRate
    const totalPower=sphericalPower+deviatoricPower
    const residual=totalPower-sphericalPower-deviatoricPower
    return {sphericalPower,deviatoricPower,totalPower,residual}
  },[meanStress,devStress,trD,devRate])

  const formula =
    notation==='Index' ? 'σᵢⱼDᵢⱼ = (1/3 σₖₖ)Dₘₘ + sᵢⱼDᵈᵉᵛᵢⱼ' :
    notation==='Matrix' ? 'σ:D = (trσ/3)(trD) + s:D_dev' :
    notation==='Python' ? 'power = np.tensordot(sigma, D, axes=2)' :
    'σ:𝐃 = (1/3 trσ)(tr𝐃) + 𝐬:𝐃_dev'

  const sphBar=Math.max(0,Math.min(30,15+9*data.sphericalPower))
  const devBar=Math.max(0,Math.min(30,15+9*data.deviatoricPower))
  const totalBar=Math.max(0,Math.min(34,16+8*data.totalPower))

  return (
    <section className="module-view module-view-stacked">
      <div className="lesson-copy">
        <button className="text-button" onClick={onBack}>{copy.back}</button>
        <div className="lesson-index">B05 / 10</div>
        <h1>{copy.title}</h1>
        <p className="lead">{copy.lead}</p>

        <div className="concept-card">
          <span>{copy.key}</span>
          <strong>{copy.keyText}</strong>
        </div>

        <div className="definition">
          <div className="definition-label">{copy.split}</div>
          <div className="formula">{formula}</div>
          <p>{copy.splitText}</p>
        </div>

        <div className="definition">
          <div className="definition-label">{copy.interpretation}</div>
          <p>{copy.interpretationText}</p>
        </div>

        <div className="warning-card kinematics-warning">
          <span>{copy.warning}</span>
          <strong>{copy.warningTitle}</strong>
          <p>{copy.warningText}</p>
        </div>

        <DepthNote label={copy.deepen}><p>{copy.deepenText}</p></DepthNote>
        <DepthNote label={copy.research} variant="research"><p>{copy.researchText}</p></DepthNote>
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

          <svg className="balance-scene" viewBox="0 0 100 70" role="img">
            <rect x="5" y="6" width="90" height="58" rx="9" fill="#111318"/>
            <rect x="18" y="21" width="64" height="30" rx="4" fill="rgba(244,242,236,.04)" stroke="#69717C" strokeWidth=".8"/>

            <rect x="24" y={48-sphBar} width="12" height={sphBar} rx="2" fill="rgba(40,100,255,.32)"/>
            <rect x="44" y={48-devBar} width="12" height={devBar} rx="2" fill="rgba(169,227,210,.30)"/>
            <rect x="64" y={48-totalBar} width="12" height={totalBar} rx="2" fill="rgba(244,242,236,.18)"/>

            <text x="22" y="57" fill="#2864FF" fontSize="2.35">p̄ trD</text>
            <text x="42" y="57" fill="#A9E3D2" fontSize="2.35">s:Ddev</text>
            <text x="64" y="57" fill="#F4F2EC" fontSize="2.35">σ:D</text>
          </svg>

          <div className="control-stack">
            <label><span>{copy.meanStress} <strong>{fmt(meanStress,2)}</strong></span><input type="range" min="-.8" max="1.2" step=".01" value={meanStress} onChange={e=>setMeanStress(Number(e.target.value))}/></label>
            <label><span>{copy.devStress} <strong>{fmt(devStress,2)}</strong></span><input type="range" min="-.8" max="1.2" step=".01" value={devStress} onChange={e=>setDevStress(Number(e.target.value))}/></label>
            <label><span>{copy.volumetricRate} <strong>{fmt(trD,2)}</strong></span><input type="range" min="-.8" max=".8" step=".01" value={trD} onChange={e=>setTrD(Number(e.target.value))}/></label>
            <label><span>{copy.devRate} <strong>{fmt(devRate,2)}</strong></span><input type="range" min="-.8" max=".8" step=".01" value={devRate} onChange={e=>setDevRate(Number(e.target.value))}/></label>
          </div>

          <div className="transport-metrics">
            <div><span>{copy.sphericalPower}</span><strong>{fmt(data.sphericalPower)}</strong></div>
            <div><span>{copy.deviatoricPower}</span><strong>{fmt(data.deviatoricPower)}</strong></div>
            <div><span>{copy.totalPower}</span><strong>{fmt(data.totalPower)}</strong></div>
            <div><span>{copy.residual}</span><strong>{fmt(data.residual,7)}</strong></div>
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
