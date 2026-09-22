import { useState } from 'react'
import type { Language, NotationMode } from '../i18n'
import { DepthNote } from './DepthNote'

type Props = {
  notation: NotationMode
  language: Language
  onBack: () => void
  onNext: () => void
}

type Step = 'strong' | 'test' | 'parts' | 'weak'

const text = {
  ru: {
    back:'← B08',
    title:'Слабая форма и мост к методу конечных элементов',
    lead:'Метод конечных элементов обычно не решает сильную форму уравнения напрямую. Сначала уравнение умножают на тестовую функцию, интегрируют по области и переносят производную со напряжения на тестовую функцию.',
    key:'СЛАБАЯ ФОРМА СНИЖАЕТ ТРЕБОВАНИЯ К ПРОИЗВОДНЫМ',
    keyText:'Интегрирование по частям заменяет дивергенцию напряжений внутренней работой и граничным членом.',
    strong:'сильная форма',
    test:'тестовая функция',
    parts:'интегрирование по частям',
    weak:'слабая форма',
    strongTitle:'Сильная форма',
    strongText:'Локальное уравнение должно выполняться почти в каждой точке области: ρü − ∇·σ − ρb = 0.',
    testTitle:'Умножение на тестовую функцию',
    testText:'Берём допустимую тестовую функцию w, равную нулю на части границы с заданным перемещением, и интегрируем невязку по Ω.',
    partsTitle:'Интегрирование по частям',
    partsText:'Производная переносится с σ на w, а на границе появляется член (σn)·w.',
    weakTitle:'Слабая форма',
    weakText:'После подстановки естественного условия σn = t̄ остаются инерционный, внутренний и внешние виртуальные работы.',
    sceneKicker:'ОТ PDE К FEM',
    sceneTitle:'переключай шаги и наблюдай, как сильная форма превращается в вариационную',
    domain:'область Ω',
    essential:'Γᵤ: w = 0',
    natural:'Γₜ: σn = t̄',
    derivative:'производная σ',
    transferred:'производная w',
    boundaryTerm:'граничный член',
    warning:'ВАЖНО',
    warningTitle:'Слабая форма не является приближением сама по себе.',
    warningText:'При достаточной регулярности сильная и слабая формы эквивалентны. Приближение появляется позже — когда выбирается конечномерное пространство базисных функций и строится дискретная задача.',
    question:'ВОПРОС ДЛЯ ПРОВЕРКИ',
    questionTitle:'Почему силовое граничное условие называют естественным?',
    questionText:'Потому что оно возникает непосредственно из граничного члена после интегрирования по частям и не требует жёсткого встраивания в пространство пробных функций.',
    conclusion:'ВЫВОД',
    conclusionTitle:'Слабая форма — математический мост между законами баланса и FEM.',
    conclusionText:'Следующий модуль — итоговая самопроверка всей главы балансов.',
    deepen:'Углубиться',
    deepenText:'Для динамической задачи малых деформаций: найти u в допустимом пространстве так, чтобы для любой тестовой функции w выполнялось ∫Ω ρ w·ü dv + ∫Ω ∇^s w:σ dv = ∫Ω ρ w·b dv + ∫Γₜ w·t̄ da. Здесь ∇^s w — симметричная часть градиента тестовой функции.',
    research:'Исследовательское замечание',
    researchText:'В нелинейной FEM слабая форма приводит к невязке R(u)=0. Для метода Ньютона нужна согласованная линеаризация δR, то есть касательный оператор. Именно качество этой линеаризации часто определяет устойчивость и скорость сходимости нелинейного решателя.',
    interactive:'ИНТЕРАКТИВНО',
    next:'Перейти к итоговой самопроверке →',
  },
  en: {
    back:'← B08',
    title:'Weak form and the bridge to the finite-element method',
    lead:'Finite-element methods usually do not solve the strong PDE form directly. The equation is multiplied by a test function, integrated over the domain, and derivatives are transferred from stress to the test function.',
    key:'THE WEAK FORM LOWERS DERIVATIVE REQUIREMENTS',
    keyText:'Integration by parts replaces stress divergence with internal work plus a boundary term.',
    strong:'strong form',
    test:'test function',
    parts:'integration by parts',
    weak:'weak form',
    strongTitle:'Strong form',
    strongText:'The local equation must hold almost everywhere: ρü − ∇·σ − ρb = 0.',
    testTitle:'Multiply by a test function',
    testText:'Choose an admissible test function w that vanishes on the displacement boundary and integrate the residual over Ω.',
    partsTitle:'Integration by parts',
    partsText:'The derivative is transferred from σ to w, and the boundary term (σn)·w appears.',
    weakTitle:'Weak form',
    weakText:'After applying σn = t̄ on the traction boundary, inertia, internal virtual work, and external virtual work remain.',
    sceneKicker:'FROM PDE TO FEM',
    sceneTitle:'switch steps and watch the strong form become a variational form',
    domain:'domain Ω',
    essential:'Γᵤ: w = 0',
    natural:'Γₜ: σn = t̄',
    derivative:'derivative on σ',
    transferred:'derivative on w',
    boundaryTerm:'boundary term',
    warning:'IMPORTANT',
    warningTitle:'The weak form is not itself an approximation.',
    warningText:'With sufficient regularity, strong and weak forms are equivalent. Approximation enters later when a finite-dimensional basis is chosen and the problem is discretized.',
    question:'CHECKPOINT',
    questionTitle:'Why is the traction boundary condition called natural?',
    questionText:'Because it arises directly from the boundary term after integration by parts and need not be imposed strongly in the trial space.',
    conclusion:'CONCLUSION',
    conclusionTitle:'The weak form is the mathematical bridge from balance laws to FEM.',
    conclusionText:'Next comes the final self-check for the balance-laws chapter.',
    deepen:'Go deeper',
    deepenText:'For small-strain dynamics: find u in an admissible space such that for every test function w, ∫Ω ρ w·ü dv + ∫Ω ∇^s w:σ dv = ∫Ω ρ w·b dv + ∫Γₜ w·t̄ da. Here ∇^s w is the symmetric gradient of the test function.',
    research:'Research note',
    researchText:'In nonlinear FEM the weak form defines a residual R(u)=0. Newton iterations require a consistent linearization δR, i.e. the tangent operator. Its quality often controls robustness and convergence speed.',
    interactive:'INTERACTIVE',
    next:'Continue to final self-check →',
  }
} as const

export function WeakFormBridge({notation,language,onBack,onNext}:Props){
  const copy=text[language]
  const [step,setStep]=useState<Step>('strong')

  const formula =
    step==='strong'
      ? (notation==='Index' ? 'ρ üᵢ − ∂σᵢⱼ/∂xⱼ − ρbᵢ = 0' : notation==='Python' ? 'rho*u_ddot - div_sigma - rho*b = 0' : 'ρü − ∇·σ − ρb = 0')
      : step==='test'
      ? '∫Ω w·(ρü − ∇·σ − ρb) dv = 0'
      : step==='parts'
      ? '∫Ω ρw·ü dv + ∫Ω ∇w:σ dv − ∫∂Ω w·(σn) da − ∫Ω ρw·b dv = 0'
      : '∫Ω ρw·ü dv + ∫Ω ∇ˢw:σ dv = ∫Ω ρw·b dv + ∫Γₜ w·t̄ da'

  const title=step==='strong'?copy.strongTitle:step==='test'?copy.testTitle:step==='parts'?copy.partsTitle:copy.weakTitle
  const body=step==='strong'?copy.strongText:step==='test'?copy.testText:step==='parts'?copy.partsText:copy.weakText

  return (
    <section className="module-view module-view-stacked">
      <div className="lesson-copy">
        <button className="text-button" onClick={onBack}>{copy.back}</button>
        <div className="lesson-index">B09 / 10</div>
        <h1>{copy.title}</h1>
        <p className="lead">{copy.lead}</p>

        <div className="concept-card">
          <span>{copy.key}</span>
          <strong>{copy.keyText}</strong>
        </div>

        <div className="definition">
          <div className="definition-label">{title}</div>
          <div className="formula">{formula}</div>
          <p>{body}</p>
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

          <div className="constitutive-mode-switch weak-step-switch">
            {([
              ['strong',copy.strong],
              ['test',copy.test],
              ['parts',copy.parts],
              ['weak',copy.weak],
            ] as const).map(([id,label])=>(
              <button
                key={id}
                className={step===id?'constitutive-mode-button active':'constitutive-mode-button'}
                onClick={()=>setStep(id)}
              >
                {label}
              </button>
            ))}
          </div>

          <svg className="balance-scene" viewBox="0 0 100 72" role="img">
            <rect x="5" y="6" width="90" height="60" rx="9" fill="#111318"/>
            <rect x="22" y="20" width="56" height="32" rx="5" fill="rgba(244,242,236,.04)" stroke="#69717C" strokeWidth=".8"/>
            <text x="46" y="38" fill="#F4F2EC" fontSize="4">Ω</text>

            <line x1="22" y1="20" x2="22" y2="52" stroke="#2864FF" strokeWidth="2"/>
            <line x1="78" y1="20" x2="78" y2="52" stroke="#A9E3D2" strokeWidth="2"/>
            <text x="13" y="18" fill="#2864FF" fontSize="2.4">{copy.essential}</text>
            <text x="68" y="18" fill="#A9E3D2" fontSize="2.4">{copy.natural}</text>

            {step==='strong' && <text x="32" y="58" fill="#DD7A2B" fontSize="2.5">{copy.derivative}</text>}
            {step==='parts' && <>
              <text x="31" y="58" fill="#A9E3D2" fontSize="2.5">{copy.transferred}</text>
              <text x="67" y="58" fill="#DD7A2B" fontSize="2.5">{copy.boundaryTerm}</text>
            </>}
            {step==='weak' && <text x="36" y="58" fill="#A9E3D2" fontSize="2.5">{copy.boundaryTerm}</text>}
          </svg>
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
