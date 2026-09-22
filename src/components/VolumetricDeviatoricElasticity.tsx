import { useMemo, useState } from 'react'
import type { Language, NotationMode } from '../i18n'
import { DepthNote } from './DepthNote'

type Props = {
  notation: NotationMode
  language: Language
  onBack: () => void
  onNext: () => void
}

const text = {
  ru: {
    back:'← C06',
    title:'Объёмный и девиаторный отклик через K и G',
    lead:'Изотропный линейно-упругий отклик удобно разделить на две независимые части: сопротивление изменению объёма и сопротивление изменению формы.',
    key:'K УПРАВЛЯЕТ ОБЪЁМНЫМ ОТКЛИКОМ, G — ДЕВИАТОРНЫМ',
    keyText:'Для изотропной линейной упругости σ = K tr(ε) I + 2G ε_dev.',
    volumetric:'Объёмная часть',
    volumetricText:'Среднее напряжение связано с объёмной деформацией через K. Чем больше K, тем дороже изменить объём.',
    deviatoric:'Девиаторная часть',
    deviatoricText:'Девиаторное напряжение связано с ε_dev через G и отвечает за сопротивление изменению формы при сохранении следа.',
    sceneKicker:'ДВА НЕЗАВИСИМЫХ КАНАЛА ОТКЛИКА',
    sceneTitle:'меняй объёмную и девиаторную деформацию отдельно',
    K:'объёмный модуль K',
    G:'модуль сдвига G',
    trE:'объёмная деформация tr ε',
    devAmp:'девиаторная амплитуда',
    meanStress:'среднее напряжение',
    devStress:'девиаторное напряжение',
    volumetricEnergy:'объёмная энергия',
    deviatoricEnergy:'девиаторная энергия',
    totalEnergy:'полная энергия',
    warning:'ВАЖНО',
    warningTitle:'Разложение отклика не означает, что любая сложная модель энергии обязана быть аддитивно разделимой.',
    warningText:'Для линейной изотропной упругости такое разделение естественно и точно. В нелинейных анизотропных моделях объёмные и девиаторные эффекты могут быть связаны сложнее.',
    question:'ВОПРОС ДЛЯ ПРОВЕРКИ',
    questionTitle:'Что произойдёт, если tr ε = 0, но ε_dev ≠ 0?',
    questionText:'Объёмный вклад исчезнет, но девиаторное напряжение и энергия останутся ненулевыми.',
    conclusion:'ВЫВОД',
    conclusionTitle:'K и G разделяют сопротивление объёму и форме в изотропной линейной упругости.',
    conclusionText:'Следующий шаг — почти несжимаемый предел и роль давления как множителя Лагранжа.',
    deepen:'Углубиться',
    deepenText:'Для малых деформаций ψ = (K/2)(tr ε)² + G ε_dev:ε_dev. Тогда σ = ∂ψ/∂ε = K tr(ε) I + 2G ε_dev.',
    research:'Исследовательское замечание',
    researchText:'В моделях мягких тканей часто вводят отдельную объёмную штрафную энергию и изохорную часть. Это удобно численно, но требует аккуратного выбора меры деформации и не должно автоматически переноситься на любые анизотропные модели.',
    interactive:'ИНТЕРАКТИВНО',
    next:'Перейти к несжимаемости →',
  },
  en: {
    back:'← C06',
    title:'Volumetric and deviatoric response through K and G',
    lead:'The isotropic linear elastic response can be split naturally into resistance to volume change and resistance to shape change.',
    key:'K CONTROLS VOLUMETRIC RESPONSE, G CONTROLS DEVIATORIC RESPONSE',
    keyText:'For isotropic linear elasticity, σ = K tr(ε) I + 2G ε_dev.',
    volumetric:'Volumetric part',
    volumetricText:'Mean stress is linked to volumetric strain through K. Larger K makes volume change more expensive.',
    deviatoric:'Deviatoric part',
    deviatoricText:'Deviatoric stress is linked to ε_dev through G and governs resistance to shape change at fixed trace.',
    sceneKicker:'TWO INDEPENDENT RESPONSE CHANNELS',
    sceneTitle:'change volumetric and deviatoric strain independently',
    K:'bulk modulus K',
    G:'shear modulus G',
    trE:'volumetric strain tr ε',
    devAmp:'deviatoric amplitude',
    meanStress:'mean stress',
    devStress:'deviatoric stress',
    volumetricEnergy:'volumetric energy',
    deviatoricEnergy:'deviatoric energy',
    totalEnergy:'total energy',
    warning:'IMPORTANT',
    warningTitle:'The response split does not mean every complex energy model must be additively separable.',
    warningText:'For isotropic linear elasticity the split is exact and natural. Nonlinear anisotropic models may couple volumetric and deviatoric effects more strongly.',
    question:'CHECKPOINT',
    questionTitle:'What happens when tr ε = 0 but ε_dev ≠ 0?',
    questionText:'The volumetric contribution vanishes, while deviatoric stress and energy remain nonzero.',
    conclusion:'CONCLUSION',
    conclusionTitle:'K and G separate resistance to volume and shape in isotropic linear elasticity.',
    conclusionText:'Next comes the nearly incompressible limit and pressure as a Lagrange multiplier.',
    deepen:'Go deeper',
    deepenText:'For small strain, ψ = (K/2)(tr ε)² + G ε_dev:ε_dev. Hence σ = ∂ψ/∂ε = K tr(ε) I + 2G ε_dev.',
    research:'Research note',
    researchText:'Soft-tissue models often use a separate volumetric penalty energy and an isochoric part. This is numerically convenient but requires careful strain measures and should not be transferred blindly to all anisotropic models.',
    interactive:'INTERACTIVE',
    next:'Continue to incompressibility →',
  }
} as const

function fmt(v:number,d=3){ return (Math.abs(v)<1e-12?0:v).toFixed(d) }

export function VolumetricDeviatoricElasticity({notation,language,onBack,onNext}:Props){
  const copy=text[language]
  const [K,setK]=useState(3.0)
  const [G,setG]=useState(1.0)
  const [trE,setTrE]=useState(.12)
  const [devAmp,setDevAmp]=useState(.18)

  const data=useMemo(()=>{
    const meanStress=K*trE
    const devStress=2*G*devAmp
    const volumetricEnergy=.5*K*trE*trE
    const deviatoricEnergy=G*2*devAmp*devAmp
    const totalEnergy=volumetricEnergy+deviatoricEnergy
    return {meanStress,devStress,volumetricEnergy,deviatoricEnergy,totalEnergy}
  },[K,G,trE,devAmp])

  const formula =
    notation==='Index' ? 'σᵢⱼ = K εₖₖ δᵢⱼ + 2G εᵈᵉᵛᵢⱼ' :
    notation==='Matrix' ? 'σ = K tr(ε) I + 2G ε_dev' :
    notation==='Python' ? 'sigma = K * np.trace(eps) * I + 2 * G * eps_dev' :
    'σ = K tr(ε) I + 2G ε_dev'

  const bar=(v:number)=>Math.max(3,Math.min(32,8+12*Math.abs(v)))

  return (
    <section className="module-view module-view-stacked">
      <div className="lesson-copy">
        <button className="text-button" onClick={onBack}>{copy.back}</button>
        <div className="lesson-index">C07</div>
        <h1>{copy.title}</h1>
        <p className="lead">{copy.lead}</p>

        <div className="concept-card">
          <span>{copy.key}</span>
          <strong>{copy.keyText}</strong>
        </div>

        <div className="definition">
          <div className="definition-label">{copy.volumetric}</div>
          <div className="formula">{formula}</div>
          <p>{copy.volumetricText}</p>
        </div>

        <div className="definition">
          <div className="definition-label">{copy.deviatoric}</div>
          <p>{copy.deviatoricText}</p>
        </div>

        <div className="warning-card kinematics-warning">
          <span>{copy.warning}</span>
          <strong>{copy.warningTitle}</strong>
          <p>{copy.warningText}</p>
        </div>

        <DepthNote label={copy.deepen}><p>{copy.deepenText}</p></DepthNote>
        <DepthNote label={copy.research} variant="research"><p>{copy.researchText}</p></DepthNote>

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

          <svg className="balance-scene" viewBox="0 0 100 72" role="img">
            <rect x="5" y="6" width="90" height="60" rx="9" fill="#111318"/>
            <rect x="16" y="21" width="28" height="34" rx="4" fill="rgba(40,100,255,.08)" stroke="#2864FF" strokeWidth=".8"/>
            <rect x="56" y="21" width="28" height="34" rx="4" fill="rgba(169,227,210,.08)" stroke="#A9E3D2" strokeWidth=".8"/>

            <text x="22" y="17" fill="#2864FF" fontSize="2.4">K · tr ε</text>
            <text x="62" y="17" fill="#A9E3D2" fontSize="2.4">2G · εdev</text>

            <rect x="23" y={50-bar(data.meanStress)} width="12" height={bar(data.meanStress)} rx="2" fill="rgba(40,100,255,.52)"/>
            <rect x="63" y={50-bar(data.devStress)} width="12" height={bar(data.devStress)} rx="2" fill="rgba(169,227,210,.52)"/>

            <text x="18" y="61" fill="#2864FF" fontSize="2.15">{copy.volumetric}</text>
            <text x="57" y="61" fill="#A9E3D2" fontSize="2.15">{copy.deviatoric}</text>
          </svg>

          <div className="control-stack">
            <label><span>{copy.K} <strong>{fmt(K,2)}</strong></span><input type="range" min=".2" max="8" step=".01" value={K} onChange={e=>setK(Number(e.target.value))}/></label>
            <label><span>{copy.G} <strong>{fmt(G,2)}</strong></span><input type="range" min=".1" max="4" step=".01" value={G} onChange={e=>setG(Number(e.target.value))}/></label>
            <label><span>{copy.trE} <strong>{fmt(trE,3)}</strong></span><input type="range" min="-.3" max=".3" step=".005" value={trE} onChange={e=>setTrE(Number(e.target.value))}/></label>
            <label><span>{copy.devAmp} <strong>{fmt(devAmp,3)}</strong></span><input type="range" min="0" max=".35" step=".005" value={devAmp} onChange={e=>setDevAmp(Number(e.target.value))}/></label>
          </div>

          <div className="transport-metrics">
            <div><span>{copy.meanStress}</span><strong>{fmt(data.meanStress)}</strong></div>
            <div><span>{copy.devStress}</span><strong>{fmt(data.devStress)}</strong></div>
            <div><span>{copy.volumetricEnergy}</span><strong>{fmt(data.volumetricEnergy)}</strong></div>
            <div><span>{copy.deviatoricEnergy}</span><strong>{fmt(data.deviatoricEnergy)}</strong></div>
            <div><span>{copy.totalEnergy}</span><strong>{fmt(data.totalEnergy)}</strong></div>
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
