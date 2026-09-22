import { useMemo, useState } from 'react'
import type { Language, NotationMode } from '../i18n'
import { DepthNote } from './DepthNote'

type Props = {
  notation: NotationMode
  language: Language
  onBack: () => void
}

type M2 = [[number,number],[number,number]]

const text = {
  ru: {
    back:'← C01',
    title:'Материальная объективность: физика не должна зависеть от наблюдателя',
    lead:'Если к одному и тому же физическому процессу применить жёсткое движение наблюдателя, конститутивная модель должна преобразовывать физические величины согласованно, а не создавать новый материальный отклик.',
    key:'ПОВОРОТ НАБЛЮДАТЕЛЯ НЕ СОЗДАЁТ НОВУЮ ДЕФОРМАЦИЮ МАТЕРИАЛА',
    keyText:'При F* = QF тензор C = FᵀF остаётся неизменным, а пространственные тензоры должны вращаться вместе с наблюдателем.',
    observer:'Смена наблюдателя',
    observerText:'Для наложенного жёсткого поворота Q новая запись градиента деформации имеет вид F* = QF. Это меняет компоненты в пространственном описании, но не должно менять физическое содержание деформации.',
    stress:'Объективное преобразование напряжений',
    stressText:'Для тензора Коши требуется σ* = QσQᵀ. Ни величина напряжённого состояния, ни материальный закон не должны зависеть от произвольного выбора наблюдателя.',
    sceneKicker:'ПРОВЕРКА ОБЪЕКТИВНОСТИ',
    sceneTitle:'вращай наблюдателя и сравни неизменные и вращающиеся величины',
    angle:'поворот наблюдателя φ',
    stretchX:'растяжение λ₁',
    stretchY:'растяжение λ₂',
    shear:'сдвиг γ',
    cError:'‖C*−C‖',
    stressError:'‖σ*−QσQᵀ‖',
    invariant:'инвариантная мера C',
    rotates:'пространственное напряжение σ',
    warning:'ВАЖНО',
    warningTitle:'Объективность и изотропия — разные требования.',
    warningText:'Объективность относится к смене наблюдателя. Изотропия описывает симметрию самого материала относительно поворота материальных направлений. Анизотропный материал тоже должен быть объективным.',
    question:'ВОПРОС ДЛЯ ПРОВЕРКИ',
    questionTitle:'Почему нельзя строить конечнодеформационный закон напрямую как произвольную функцию от F?',
    questionText:'Потому что F меняется при наложенном жёстком повороте Q. Закон должен зависеть от F так, чтобы выполнялось требование объективности, например через объективные меры деформации или корректно преобразующиеся тензорные аргументы.',
    conclusion:'ВЫВОД',
    conclusionTitle:'Объективность ограничивает допустимую математическую форму конститутивного закона.',
    conclusionText:'Следующий шаг — симметрии самого материала: изотропия и анизотропия.',
    deepen:'Углубиться',
    deepenText:'Поскольку F* = QF и QᵀQ = I, имеем C* = F*ᵀF* = FᵀQᵀQF = FᵀF = C. Для левого тензора Коши–Грина B* = Q B Qᵀ. Поэтому изотропная пространственная функция σ = f(B) должна удовлетворять σ* = f(B*) = Q f(B) Qᵀ.',
    research:'Исследовательское замечание',
    researchText:'Для скоростных конститутивных моделей возникает дополнительная проблема: обычная компонентная производная тензора не является объективной. Тогда вводят объективные тензорные скорости или формулируют модель через объективные конечнодеформационные меры.',
    interactive:'ИНТЕРАКТИВНО',
  },
  en: {
    back:'← C01',
    title:'Material objectivity: physics must not depend on the observer',
    lead:'If the same physical process is viewed through a superposed rigid observer motion, a constitutive model must transform physical quantities consistently rather than create a new material response.',
    key:'OBSERVER ROTATION DOES NOT CREATE NEW MATERIAL DEFORMATION',
    keyText:'Under F* = QF, C = FᵀF is unchanged, while spatial tensors rotate consistently with the observer.',
    observer:'Change of observer',
    observerText:'For a superposed rigid rotation Q, the deformation gradient becomes F* = QF. Spatial components change, but the physical deformation content must not.',
    stress:'Objective stress transformation',
    stressText:'For Cauchy stress, σ* = QσQᵀ. Neither the stress state nor the material law should depend on an arbitrary observer choice.',
    sceneKicker:'OBJECTIVITY CHECK',
    sceneTitle:'rotate the observer and compare invariant and rotating quantities',
    angle:'observer rotation φ',
    stretchX:'stretch λ₁',
    stretchY:'stretch λ₂',
    shear:'shear γ',
    cError:'‖C*−C‖',
    stressError:'‖σ*−QσQᵀ‖',
    invariant:'invariant measure C',
    rotates:'spatial stress σ',
    warning:'IMPORTANT',
    warningTitle:'Objectivity and isotropy are different requirements.',
    warningText:'Objectivity concerns change of observer. Isotropy describes symmetry of the material itself under rotations of material directions. An anisotropic material must still be objective.',
    question:'CHECKPOINT',
    questionTitle:'Why can a finite-strain law not be an arbitrary function of F?',
    questionText:'Because F changes under a superposed rigid rotation Q. Dependence on F must be structured so that objectivity is satisfied, for example through objective strain measures or properly transforming tensor arguments.',
    conclusion:'CONCLUSION',
    conclusionTitle:'Objectivity restricts the admissible mathematical form of constitutive laws.',
    conclusionText:'Next we move to material symmetries: isotropy and anisotropy.',
    deepen:'Go deeper',
    deepenText:'Since F* = QF and QᵀQ = I, C* = F*ᵀF* = FᵀQᵀQF = FᵀF = C. For the left Cauchy–Green tensor, B* = Q B Qᵀ. Therefore an isotropic spatial law σ = f(B) must satisfy σ* = f(B*) = Q f(B) Qᵀ.',
    research:'Research note',
    researchText:'Rate-type constitutive models add another issue: an ordinary componentwise tensor time derivative is not objective. One then introduces objective tensor rates or formulates the model using objective finite-strain measures.',
    interactive:'INTERACTIVE',
  }
} as const

function mul(A:M2,B:M2):M2 {
  return [
    [A[0][0]*B[0][0]+A[0][1]*B[1][0], A[0][0]*B[0][1]+A[0][1]*B[1][1]],
    [A[1][0]*B[0][0]+A[1][1]*B[1][0], A[1][0]*B[0][1]+A[1][1]*B[1][1]],
  ]
}
function tr(A:M2):M2 { return [[A[0][0],A[1][0]],[A[0][1],A[1][1]]] }
function sub(A:M2,B:M2):M2 { return [[A[0][0]-B[0][0],A[0][1]-B[0][1]],[A[1][0]-B[1][0],A[1][1]-B[1][1]]] }
function norm(A:M2){ return Math.sqrt(A.flat().reduce((s,x)=>s+x*x,0)) }
function fmt(v:number,d=4){ return (Math.abs(v)<1e-12?0:v).toFixed(d) }

export function MaterialObjectivity({notation,language,onBack}:Props){
  const copy=text[language]
  const [angle,setAngle]=useState(35)
  const [l1,setL1]=useState(1.25)
  const [l2,setL2]=useState(.88)
  const [gamma,setGamma]=useState(.22)

  const data=useMemo(()=>{
    const a=angle*Math.PI/180
    const Q:M2=[[Math.cos(a),-Math.sin(a)],[Math.sin(a),Math.cos(a)]]
    const F:M2=[[l1,gamma],[0,l2]]
    const Fstar=mul(Q,F)
    const C=mul(tr(F),F)
    const Cstar=mul(tr(Fstar),Fstar)
    const B=mul(F,tr(F))
    const Bstar=mul(Fstar,tr(Fstar))
    const mu=.8
    const I:M2=[[1,0],[0,1]]
    const sigma:M2=[[mu*(B[0][0]-1),mu*B[0][1]],[mu*B[1][0],mu*(B[1][1]-1)]]
    const sigmaStar:M2=[[mu*(Bstar[0][0]-1),mu*Bstar[0][1]],[mu*Bstar[1][0],mu*(Bstar[1][1]-1)]]
    const rotated=mul(mul(Q,sigma),tr(Q))
    return {
      Q,F,Fstar,C,Cstar,sigma,sigmaStar,
      cError:norm(sub(Cstar,C)),
      stressError:norm(sub(sigmaStar,rotated)),
      detQ:Q[0][0]*Q[1][1]-Q[0][1]*Q[1][0],
      I,
    }
  },[angle,l1,l2,gamma])

  const formula =
    notation==='Index' ? 'F*ᵢJ = Qᵢk FₖJ,   C*IJ = CIJ,   σ*ᵢⱼ = Qᵢk σₖₗ Qⱼₗ' :
    notation==='Matrix' ? 'F* = QF,   C* = C,   σ* = QσQᵀ' :
    notation==='Python' ? 'F_star = Q @ F; C_star = F_star.T @ F_star; sigma_star = Q @ sigma @ Q.T' :
    'F* = QF,   C* = F*ᵀF* = C,   σ* = QσQᵀ'

  const ax=(x:number,y:number)=>[50+18*x,36-18*y]
  const e1=ax(data.Fstar[0][0],data.Fstar[1][0])
  const e2=ax(data.Fstar[0][1],data.Fstar[1][1])

  return (
    <section className="module-view module-view-stacked">
      <div className="lesson-copy">
        <button className="text-button" onClick={onBack}>{copy.back}</button>
        <div className="lesson-index">C02</div>
        <h1>{copy.title}</h1>
        <p className="lead">{copy.lead}</p>

        <div className="concept-card">
          <span>{copy.key}</span>
          <strong>{copy.keyText}</strong>
        </div>

        <div className="definition">
          <div className="definition-label">{copy.observer}</div>
          <div className="formula">{formula}</div>
          <p>{copy.observerText}</p>
        </div>

        <div className="definition">
          <div className="definition-label">{copy.stress}</div>
          <p>{copy.stressText}</p>
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

          <svg className="balance-scene" viewBox="0 0 100 72" role="img">
            <rect x="5" y="6" width="90" height="60" rx="9" fill="#111318"/>
            <line x1="50" y1="36" x2={e1[0]} y2={e1[1]} stroke="#2864FF" strokeWidth="1.5"/>
            <line x1="50" y1="36" x2={e2[0]} y2={e2[1]} stroke="#A9E3D2" strokeWidth="1.5"/>
            <circle cx="50" cy="36" r="2.2" fill="#F4F2EC"/>
            <text x="13" y="17" fill="#F4F2EC" fontSize="2.5">φ = {fmt(angle,0)}°</text>
            <text x="13" y="56" fill="#2864FF" fontSize="2.3">{copy.invariant}</text>
            <text x="62" y="56" fill="#A9E3D2" fontSize="2.3">{copy.rotates}</text>
          </svg>

          <div className="control-stack">
            <label><span>{copy.angle} <strong>{fmt(angle,0)}°</strong></span><input type="range" min="0" max="180" step="1" value={angle} onChange={e=>setAngle(Number(e.target.value))}/></label>
            <label><span>{copy.stretchX} <strong>{fmt(l1,2)}</strong></span><input type="range" min=".6" max="1.6" step=".01" value={l1} onChange={e=>setL1(Number(e.target.value))}/></label>
            <label><span>{copy.stretchY} <strong>{fmt(l2,2)}</strong></span><input type="range" min=".6" max="1.6" step=".01" value={l2} onChange={e=>setL2(Number(e.target.value))}/></label>
            <label><span>{copy.shear} <strong>{fmt(gamma,2)}</strong></span><input type="range" min="-.6" max=".6" step=".01" value={gamma} onChange={e=>setGamma(Number(e.target.value))}/></label>
          </div>

          <div className="transport-metrics">
            <div><span>{copy.cError}</span><strong>{fmt(data.cError,8)}</strong></div>
            <div><span>{copy.stressError}</span><strong>{fmt(data.stressError,8)}</strong></div>
            <div><span>det Q</span><strong>{fmt(data.detQ,6)}</strong></div>
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
