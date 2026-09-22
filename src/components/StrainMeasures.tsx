import { useMemo, useState } from 'react'
import type { Language, NotationMode } from '../i18n'

type Props = {
  notation: NotationMode
  language: Language
  onBack: () => void
  onNext: () => void
}

const text = {
  ru: {
    back: '← K06',
    title: 'Меры деформации: Грина–Лагранжа и Эйлера–Альманси',
    lead: 'Тензоры C и B уже избавили нас от прямого влияния жёсткого поворота. Теперь из них можно построить меры деформации, которые количественно описывают изменение метрики относительно выбранной конфигурации.',
    key: 'КЛЮЧЕВАЯ МЫСЛЬ',
    keyText: 'Тензор Грина–Лагранжа E относится к материальной конфигурации, а тензор Эйлера–Альманси e — к текущей. Обе меры обнуляются при чистом жёстком движении.',
    green: 'Тензор деформации Грина–Лагранжа',
    greenText: 'E = 1/2(C − I). Эта мера естественно работает с материальными направлениями dX.',
    almansi: 'Тензор деформации Эйлера–Альманси',
    almansiText: 'e = 1/2(I − B⁻¹). Эта мера формулируется в текущей конфигурации и работает с пространственными направлениями.',
    rotation: 'жёсткий поворот',
    stretchX: 'растяжение 1',
    stretchY: 'растяжение 2',
    shear: 'сдвиг',
    rigidOnly: 'чистый поворот',
    general: 'деформация + поворот',
    sceneKicker: 'МЕРЫ ДЕФОРМАЦИИ',
    sceneTitle: 'сравни E и e для одного и того же движения',
    normE: '‖E‖',
    norme: '‖e‖',
    traceE: 'tr E',
    tracee: 'tr e',
    warning: 'ВАЖНО',
    warningTitle: 'E и e нельзя напрямую сравнивать покомпонентно без учёта конфигурации.',
    warningText: 'Они относятся к разным пространствам описания. Их смысл согласован, но компоненты зависят от того, используем ли мы материальное или пространственное представление.',
    question: 'ВОПРОС ДЛЯ ПРОВЕРКИ',
    questionTitle: 'Что должно произойти с E и e при F = R?',
    questionText: 'Обе меры должны стать нулевыми, потому что чистый жёсткий поворот не меняет длины и углы.',
    conclusion: 'ВЫВОД',
    conclusionTitle: 'Мера деформации — это не просто «ещё один тензор».',
    conclusionText: 'Она всегда связана с тем, относительно какой конфигурации мы измеряем изменение геометрии.',
    interactive: 'ИНТЕРАКТИВНО',
    next: 'Перейти к полярному разложению →',
  },
  en: {
    back: '← K06',
    title: 'Strain measures: Green–Lagrange and Euler–Almansi',
    lead: 'The tensors C and B already remove the direct effect of rigid rotation. From them we can construct strain measures that quantify metric change relative to a chosen configuration.',
    key: 'KEY IDEA',
    keyText: 'Green–Lagrange strain E belongs to the material description, while Euler–Almansi strain e belongs to the current description. Both vanish under pure rigid motion.',
    green: 'Green–Lagrange',
    greenText: 'E = 1/2(C − I). This measure naturally acts on material directions dX.',
    almansi: 'Euler–Almansi',
    almansiText: 'e = 1/2(I − B⁻¹). This measure is formulated in the current configuration and acts on spatial directions.',
    rotation: 'rigid rotation',
    stretchX: 'stretch 1',
    stretchY: 'stretch 2',
    shear: 'shear',
    rigidOnly: 'pure rotation',
    general: 'deformation + rotation',
    sceneKicker: 'STRAIN MEASURES',
    sceneTitle: 'compare E and e for the same motion',
    normE: '‖E‖',
    norme: '‖e‖',
    traceE: 'tr E',
    tracee: 'tr e',
    warning: 'IMPORTANT',
    warningTitle: 'E and e should not be compared component-by-component without accounting for configuration.',
    warningText: 'They live in different descriptions. Their meaning is consistent, but their components depend on whether a material or spatial representation is used.',
    question: 'CHECKPOINT',
    questionTitle: 'What should happen to E and e when F = R?',
    questionText: 'Both measures should vanish because a pure rigid rotation changes neither lengths nor angles.',
    conclusion: 'CONCLUSION',
    conclusionTitle: 'A strain measure is not just another tensor.',
    conclusionText: 'It is always tied to the configuration relative to which geometric change is measured.',
    interactive: 'INTERACTIVE',
    next: 'Continue to polar decomposition →',
  },
} as const

function fmt(v:number, d=3) {
  return (Math.abs(v) < 1e-10 ? 0 : v).toFixed(d)
}

function matMul(a:number[][],b:number[][]) {
  return a.map((row)=>b[0].map((_,j)=>row.reduce((s,v,k)=>s+v*b[k][j],0)))
}

function transpose(a:number[][]) {
  return a[0].map((_,j)=>a.map(row=>row[j]))
}

function inverse2(a:number[][]) {
  const det=a[0][0]*a[1][1]-a[0][1]*a[1][0]
  return [
    [ a[1][1]/det, -a[0][1]/det],
    [-a[1][0]/det,  a[0][0]/det],
  ]
}

function frob(a:number[][]) {
  return Math.sqrt(a.flat().reduce((s,v)=>s+v*v,0))
}

export function StrainMeasures({ notation, language, onBack, onNext }: Props) {
  const copy=text[language]
  const [rotationDeg,setRotationDeg]=useState(30)
  const [stretchX,setStretchX]=useState(1.25)
  const [stretchY,setStretchY]=useState(0.85)
  const [shear,setShear]=useState(0.18)
  const [rigidOnly,setRigidOnly]=useState(false)

  const F=useMemo(()=>{
    const t=rotationDeg*Math.PI/180
    const c=Math.cos(t), s=Math.sin(t)
    const R=[[c,-s],[s,c]]
    if (rigidOnly) return R
    const U=[[stretchX,shear],[shear,stretchY]]
    return matMul(R,U)
  },[rotationDeg,stretchX,stretchY,shear,rigidOnly])

  const C=useMemo(()=>matMul(transpose(F),F),[F])
  const B=useMemo(()=>matMul(F,transpose(F)),[F])
  const Binv=useMemo(()=>inverse2(B),[B])

  const E=useMemo(()=>[
    [0.5*(C[0][0]-1),0.5*C[0][1]],
    [0.5*C[1][0],0.5*(C[1][1]-1)],
  ],[C])

  const e=useMemo(()=>[
    [0.5*(1-Binv[0][0]),-0.5*Binv[0][1]],
    [-0.5*Binv[1][0],0.5*(1-Binv[1][1])],
  ],[Binv])

  const notationLine =
    notation === 'Index' ? 'Eᵢⱼ = 1/2(Cᵢⱼ − δᵢⱼ),   eᵢⱼ = 1/2(δᵢⱼ − B⁻¹ᵢⱼ)' :
    notation === 'Matrix' ? 'E = 1/2(C − I),   e = 1/2(I − B⁻¹)' :
    notation === 'Python' ? 'E = 0.5*(C-I); e = 0.5*(I-np.linalg.inv(B))' :
    '𝐄 = 1/2(𝐂 − 𝐈),   𝐞 = 1/2(𝐈 − 𝐁⁻¹)'

  const traceE=E[0][0]+E[1][1]
  const tracee=e[0][0]+e[1][1]

  return (
    <section className="module-view module-view-stacked">
      <div className="lesson-copy">
        <button className="text-button" onClick={onBack}>{copy.back}</button>
        <div className="lesson-index">K07 / 13</div>
        <h1>{copy.title}</h1>
        <p className="lead">{copy.lead}</p>

        <div className="concept-card">
          <span>{copy.key}</span>
          <strong>{copy.keyText}</strong>
        </div>

        <div className="definition">
          <div className="definition-label">{copy.green}</div>
          <div className="formula">{notationLine}</div>
          <p>{copy.greenText}</p>
        </div>

        <div className="definition">
          <div className="definition-label">{copy.almansi}</div>
          <div className="formula">𝐞 = 1/2(𝐈 − 𝐁⁻¹)</div>
          <p>{copy.almansiText}</p>
        </div>

        <div className="warning-card kinematics-warning">
          <span>{copy.warning}</span>
          <strong>{copy.warningTitle}</strong>
          <p>{copy.warningText}</p>
        </div>

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

          <div className="decomp-toggle-row">
            <button className={!rigidOnly ? 'decomp-toggle active' : 'decomp-toggle'} onClick={()=>setRigidOnly(false)}>{copy.general}</button>
            <button className={rigidOnly ? 'decomp-toggle active' : 'decomp-toggle'} onClick={()=>setRigidOnly(true)}>{copy.rigidOnly}</button>
          </div>

          <div className="strain-grid">
            {[
              ['F',F],
              ['E',E],
              ['e',e],
            ].map(([label,matrix])=>(
              <div className="gradient-matrix-card" key={String(label)}>
                <span>{label as string}</span>
                <div className="gradient-matrix">
                  {(matrix as number[][]).flat().map((v,i)=><strong key={i}>{fmt(v)}</strong>)}
                </div>
              </div>
            ))}
          </div>

          <div className="control-stack">
            <label><span>{copy.rotation} <strong>{rotationDeg}°</strong></span><input type="range" min="-90" max="90" step="1" value={rotationDeg} onChange={e=>setRotationDeg(Number(e.target.value))}/></label>
            {!rigidOnly && <>
              <label><span>{copy.stretchX} <strong>{fmt(stretchX,2)}</strong></span><input type="range" min="0.55" max="1.65" step="0.01" value={stretchX} onChange={e=>setStretchX(Number(e.target.value))}/></label>
              <label><span>{copy.stretchY} <strong>{fmt(stretchY,2)}</strong></span><input type="range" min="0.55" max="1.65" step="0.01" value={stretchY} onChange={e=>setStretchY(Number(e.target.value))}/></label>
              <label><span>{copy.shear} <strong>{fmt(shear,2)}</strong></span><input type="range" min="-0.45" max="0.45" step="0.01" value={shear} onChange={e=>setShear(Number(e.target.value))}/></label>
            </>}
          </div>

          <div className="strain-metrics">
            <div><span>{copy.normE}</span><strong>{fmt(frob(E))}</strong></div>
            <div><span>{copy.norme}</span><strong>{fmt(frob(e))}</strong></div>
            <div><span>{copy.traceE}</span><strong>{fmt(traceE)}</strong></div>
            <div><span>{copy.tracee}</span><strong>{fmt(tracee)}</strong></div>
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
