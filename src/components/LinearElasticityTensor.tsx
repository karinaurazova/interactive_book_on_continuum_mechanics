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
    back:'← C03',
    title:'Линейная упругость и тензор жёсткости четвёртого порядка',
    lead:'В линейной упругости напряжение линейно зависит от малой деформации. Но в 3D это не просто одно число E: каждая компонента напряжения может зависеть от нескольких компонент деформации.',
    key:'ЖЁСТКОСТЬ В 3D — ЭТО ТЕНЗОР ЧЕТВЁРТОГО ПОРЯДКА',
    keyText:'Общий линейно-упругий закон записывается как σ = 𝓒:ε, или σᵢⱼ = Cᵢⱼₖₗ εₖₗ.',
    map:'Линейное отображение',
    mapText:'Тензор 𝓒 задаёт линейное отображение из пространства симметричных деформаций в пространство симметричных напряжений.',
    coupling:'Связь компонент',
    couplingText:'Даже если изменяется одна компонента деформации, материал может отвечать несколькими компонентами напряжения. Это особенно важно для анизотропных материалов.',
    sceneKicker:'ε → 𝓒 → σ',
    sceneTitle:'меняй компоненты деформации и коэффициенты связи',
    e11:'ε₁₁',
    e22:'ε₂₂',
    e12:'ε₁₂',
    c11:'C₁₁₁₁',
    c12:'C₁₁₂₂',
    c44:'C₁₂₁₂',
    s11:'σ₁₁',
    s22:'σ₂₂',
    s12:'σ₁₂',
    warning:'ВАЖНО',
    warningTitle:'Матрица жёсткости — это представление тензора, а не сам тензор.',
    warningText:'После выбора базиса и соглашения Фойгта компоненты 𝓒 можно записать матрицей. Но её вид зависит от выбранного представления и правил для сдвиговых компонент.',
    question:'ВОПРОС ДЛЯ ПРОВЕРКИ',
    questionTitle:'Почему для общего анизотропного материала недостаточно одного модуля Юнга E?',
    questionText:'Потому что отклик зависит от направления и от взаимных связей между компонентами деформации и напряжения.',
    conclusion:'ВЫВОД',
    conclusionTitle:'Линейная упругость — это линейное тензорное отображение ε → σ.',
    conclusionText:'Следующий шаг — симметрии 𝓒 и сокращение числа независимых коэффициентов.',
    deepen:'Углубиться',
    deepenText:'В трёхмерном пространстве у Cᵢⱼₖₗ формально 3⁴ = 81 компонент. Симметрия σ и ε даёт малые симметрии Cᵢⱼₖₗ = Cⱼᵢₖₗ = Cᵢⱼₗₖ. При существовании упругого потенциала добавляется большая симметрия Cᵢⱼₖₗ = Cₖₗᵢⱼ.',
    research:'Исследовательское замечание',
    researchText:'В экспериментальной механике мягких тканей линейный закон обычно применим только в малом диапазоне деформаций. Но структура тензора жёсткости полезна и как локальная касательная жёсткость нелинейной модели.',
    interactive:'ИНТЕРАКТИВНО',
    next:'Перейти к симметриям тензора жёсткости →',
  },
  en: {
    back:'← C03',
    title:'Linear elasticity and the fourth-order stiffness tensor',
    lead:'In linear elasticity, stress depends linearly on small strain. In 3D this is not just one number E: each stress component may depend on several strain components.',
    key:'3D STIFFNESS IS A FOURTH-ORDER TENSOR',
    keyText:'The general linear elastic law is σ = 𝓒:ε, or σᵢⱼ = Cᵢⱼₖₗ εₖₗ.',
    map:'Linear mapping',
    mapText:'The tensor 𝓒 defines a linear mapping from symmetric strain tensors to symmetric stress tensors.',
    coupling:'Component coupling',
    couplingText:'Even if only one strain component changes, a material may respond with several stress components. This is especially important for anisotropic materials.',
    sceneKicker:'ε → 𝓒 → σ',
    sceneTitle:'change strain components and coupling coefficients',
    e11:'ε₁₁',
    e22:'ε₂₂',
    e12:'ε₁₂',
    c11:'C₁₁₁₁',
    c12:'C₁₁₂₂',
    c44:'C₁₂₁₂',
    s11:'σ₁₁',
    s22:'σ₂₂',
    s12:'σ₁₂',
    warning:'IMPORTANT',
    warningTitle:'A stiffness matrix is a representation of the tensor, not the tensor itself.',
    warningText:'After choosing a basis and a Voigt convention, components of 𝓒 can be written as a matrix. Its appearance depends on the representation and on the convention used for shear components.',
    question:'CHECKPOINT',
    questionTitle:'Why is one Young modulus E insufficient for a general anisotropic material?',
    questionText:'Because the response depends on direction and on coupling between strain and stress components.',
    conclusion:'CONCLUSION',
    conclusionTitle:'Linear elasticity is a linear tensor map ε → σ.',
    conclusionText:'Next we study symmetries of 𝓒 and the reduction in independent coefficients.',
    deepen:'Go deeper',
    deepenText:'In 3D, Cᵢⱼₖₗ formally has 3⁴ = 81 components. Symmetry of σ and ε gives minor symmetries Cᵢⱼₖₗ = Cⱼᵢₖₗ = Cᵢⱼₗₖ. If an elastic potential exists, major symmetry Cᵢⱼₖₗ = Cₖₗᵢⱼ also follows.',
    research:'Research note',
    researchText:'In soft-tissue experiments, a linear law is usually valid only over a small strain range. Still, the stiffness-tensor structure remains useful as the local tangent stiffness of a nonlinear model.',
    interactive:'INTERACTIVE',
    next:'Continue to stiffness symmetries →',
  }
} as const

function fmt(v:number,d=3){ return (Math.abs(v)<1e-12?0:v).toFixed(d) }

export function LinearElasticityTensor({notation,language,onBack,onNext}:Props){
  const copy=text[language]
  const [e11,setE11]=useState(.20)
  const [e22,setE22]=useState(-.05)
  const [e12,setE12]=useState(.08)
  const [c11,setC11]=useState(2.0)
  const [c12,setC12]=useState(.7)
  const [c44,setC44]=useState(1.1)

  const data=useMemo(()=>{
    const s11=c11*e11+c12*e22
    const s22=c12*e11+c11*e22
    const s12=2*c44*e12
    return {s11,s22,s12}
  },[e11,e22,e12,c11,c12,c44])

  const formula =
    notation==='Index' ? 'σᵢⱼ = Cᵢⱼₖₗ εₖₗ' :
    notation==='Matrix' ? '[σ] = [C][ε]' :
    notation==='Python' ? 'sigma = np.einsum("ijkl,kl->ij", C, eps)' :
    'σ = 𝓒:ε'

  const scale=(v:number)=>Math.max(3,Math.min(28,10+7*Math.abs(v)))

  return (
    <section className="module-view module-view-stacked">
      <div className="lesson-copy">
        <button className="text-button" onClick={onBack}>{copy.back}</button>
        <div className="lesson-index">C04</div>
        <h1>{copy.title}</h1>
        <p className="lead">{copy.lead}</p>

        <div className="concept-card">
          <span>{copy.key}</span>
          <strong>{copy.keyText}</strong>
        </div>

        <div className="definition">
          <div className="definition-label">{copy.map}</div>
          <div className="formula">{formula}</div>
          <p>{copy.mapText}</p>
        </div>

        <div className="definition">
          <div className="definition-label">{copy.coupling}</div>
          <p>{copy.couplingText}</p>
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
            <rect x="13" y="21" width="20" height="30" rx="3" fill="rgba(40,100,255,.10)" stroke="#2864FF" strokeWidth=".8"/>
            <rect x="40" y="21" width="20" height="30" rx="3" fill="rgba(244,242,236,.04)" stroke="#69717C" strokeWidth=".8"/>
            <rect x="67" y="21" width="20" height="30" rx="3" fill="rgba(169,227,210,.10)" stroke="#A9E3D2" strokeWidth=".8"/>

            <text x="20" y="17" fill="#2864FF" fontSize="2.5">ε</text>
            <text x="48" y="17" fill="#F4F2EC" fontSize="2.5">𝓒</text>
            <text x="74" y="17" fill="#A9E3D2" fontSize="2.5">σ</text>

            <text x="16" y="30" fill="#F4F2EC" fontSize="2.2">{fmt(e11)}</text>
            <text x="16" y="37" fill="#F4F2EC" fontSize="2.2">{fmt(e22)}</text>
            <text x="16" y="44" fill="#F4F2EC" fontSize="2.2">{fmt(e12)}</text>

            <line x1="34" y1="36" x2="39" y2="36" stroke="#69717C" strokeWidth="1"/>
            <line x1="61" y1="36" x2="66" y2="36" stroke="#69717C" strokeWidth="1"/>

            <rect x="44" y={47-scale(c11/3)} width="4" height={scale(c11/3)} rx="1" fill="rgba(244,242,236,.35)"/>
            <rect x="50" y={47-scale(c12)} width="4" height={scale(c12)} rx="1" fill="rgba(244,242,236,.22)"/>
            <rect x="56" y={47-scale(c44/2)} width="4" height={scale(c44/2)} rx="1" fill="rgba(244,242,236,.28)"/>

            <text x="70" y="30" fill="#A9E3D2" fontSize="2.2">{fmt(data.s11)}</text>
            <text x="70" y="37" fill="#A9E3D2" fontSize="2.2">{fmt(data.s22)}</text>
            <text x="70" y="44" fill="#A9E3D2" fontSize="2.2">{fmt(data.s12)}</text>
          </svg>

          <div className="control-stack">
            <label><span>{copy.e11} <strong>{fmt(e11,2)}</strong></span><input type="range" min="-.4" max=".4" step=".01" value={e11} onChange={e=>setE11(Number(e.target.value))}/></label>
            <label><span>{copy.e22} <strong>{fmt(e22,2)}</strong></span><input type="range" min="-.4" max=".4" step=".01" value={e22} onChange={e=>setE22(Number(e.target.value))}/></label>
            <label><span>{copy.e12} <strong>{fmt(e12,2)}</strong></span><input type="range" min="-.3" max=".3" step=".01" value={e12} onChange={e=>setE12(Number(e.target.value))}/></label>
            <label><span>{copy.c11} <strong>{fmt(c11,2)}</strong></span><input type="range" min=".2" max="4" step=".01" value={c11} onChange={e=>setC11(Number(e.target.value))}/></label>
            <label><span>{copy.c12} <strong>{fmt(c12,2)}</strong></span><input type="range" min="-.5" max="2" step=".01" value={c12} onChange={e=>setC12(Number(e.target.value))}/></label>
            <label><span>{copy.c44} <strong>{fmt(c44,2)}</strong></span><input type="range" min=".1" max="3" step=".01" value={c44} onChange={e=>setC44(Number(e.target.value))}/></label>
          </div>

          <div className="transport-metrics">
            <div><span>{copy.s11}</span><strong>{fmt(data.s11)}</strong></div>
            <div><span>{copy.s22}</span><strong>{fmt(data.s22)}</strong></div>
            <div><span>{copy.s12}</span><strong>{fmt(data.s12)}</strong></div>
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
