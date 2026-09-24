import { useMemo, useState } from 'react'
import type { Language, NotationMode } from '../i18n'

type Props = {
  notation: NotationMode
  language: Language
  onBack?: () => void
  onNext?: () => void
}

type Question = {
  prompt: string
  options: string[]
  answer: number
  explanation: string
}

const text = {
  ru: {
    title:'Итоговая самопроверка по конечным деформациям и гиперупругости',
    lead:'Проверь не запоминание отдельных формул, а целостное понимание главы: меры напряжений, функция энергии, почти несжимаемость, нелинейный МКЭ, устойчивость, продолжение ветвей и несовершенства.',
    kicker:'ФИНАЛЬНАЯ САМОПРОВЕРКА',
    intro:'10 вопросов · мгновенная обратная связь · итоговый результат',
    score:'Результат',
    answered:'Отвечено',
    reset:'Пройти заново',
    correct:'Верно',
    wrong:'Неверно',
    explanation:'Почему',
    synthesis:'ФИНАЛЬНЫЙ СИНТЕЗ',
    synthesisTitle:'Собери главу в одну причинную цепочку',
    synthesisText:'Попробуй без подсказки объяснить в 3–5 предложениях, как связаны функция энергии Ψ, внутренние силы, касательная жёсткость K_T, критическое состояние, метод длины дуги и несовершенства.',
    takeaway:'ГЛАВНАЯ МЫСЛЬ',
    takeawayTitle:'Конечные деформации — это не просто “другая формула для напряжения”.',
    takeawayText:'Это связанная система: кинематика задаёт меру деформации, конститутивный закон формирует внутренний отклик, текущая геометрия меняет касательную жёсткость, а устойчивость и алгоритм продолжения определяют доступный путь равновесия.',
    back:'← D13',
    next:'E00 → material memory',
    next:'E00 → память материала',
    perfect:'Отлично: каркас главы собран целиком.',
    good:'Хорошо: основная логика есть, но пару связей стоит повторить.',
    retry:'Есть смысл ещё раз пройти D08–D12 и вернуться к тесту.',
  },
  en: {
    title:'Final self-check on finite strain and hyperelasticity',
    lead:'Test integrated understanding rather than isolated formulas: stress measures, strain energy, near incompressibility, nonlinear FEM, stability, continuation, and imperfections.',
    kicker:'FINAL SELF-CHECK',
    intro:'10 questions · instant feedback · final score',
    score:'Score',
    answered:'Answered',
    reset:'Reset',
    correct:'Correct',
    wrong:'Not quite',
    explanation:'Why',
    synthesis:'FINAL SYNTHESIS',
    synthesisTitle:'Connect the chapter into one causal chain',
    synthesisText:'Without hints, explain in 3–5 sentences how strain energy Ψ, internal forces, tangent stiffness K_T, a critical state, arc-length continuation, and imperfections are connected.',
    takeaway:'KEY IDEA',
    takeawayTitle:'Finite strain is not merely “another stress formula”.',
    takeawayText:'It is a connected system: kinematics defines deformation measures, the constitutive law defines internal response, current geometry changes tangent stiffness, while stability and continuation determine which equilibrium path can be followed.',
    back:'← D13',
    perfect:'Excellent: the chapter is connected as one system.',
    good:'Good: the main logic is there, but a few links deserve review.',
    retry:'Review D08–D12 once more, then return to the test.',
  },
} as const

const questions: Record<Language, Question[]> = {
  ru: [
    {
      prompt:'Что принципиально отличает гиперупругий материал?',
      options:['Напряжение зависит только от скорости деформации','Напряжения выводятся из функции энергии','Материал всегда несжимаем','Материал всегда линейный'],
      answer:1,
      explanation:'Для гиперупругого материала конститутивный отклик получают из потенциальной функции энергии деформации Ψ.',
    },
    {
      prompt:'Какая величина непосредственно описывает локальное изменение объёма при конечной деформации?',
      options:['I₁','I₂','J = det F','λ₁'],
      answer:2,
      explanation:'Якобиан J = det F задаёт отношение текущего локального объёма к исходному.',
    },
    {
      prompt:'Почему напряжения Коши σ, Пиолы P и второго Пиолы–Кирхгофа S нельзя бездумно подставлять вместо друг друга?',
      options:['Они имеют разные единицы','Они относятся к разным конфигурациям и площадям','Только σ является тензором','P существует только для линейной упругости'],
      answer:1,
      explanation:'Эти меры напряжений энергетически сопряжены с разными мерами деформации и относятся к разным конфигурациям.',
    },
    {
      prompt:'Что чаще всего происходит при почти несжимаемом отклике, если использовать простую displacement-only формулировку?',
      options:['Исчезает давление','Возникает объёмная блокировка','Система становится линейной','J автоматически становится равным нулю'],
      answer:1,
      explanation:'При очень большой объёмной жёсткости стандартные элементы могут искусственно переужесточаться — возникает volumetric locking.',
    },
    {
      prompt:'Что является сердцем одной итерации Ньютона в нелинейном МКЭ?',
      options:['R = 0 без обновления','K_T Δu = −R','σ = Eε','J = 1'],
      answer:1,
      explanation:'На каждой итерации линеаризуют остаток и решают систему с текущей касательной жёсткостью K_T.',
    },
    {
      prompt:'Если минимальное собственное значение K_T приближается к нулю, это прежде всего сигнал о…',
      options:['росте плотности','приближении к критическому состоянию','нулевой деформации','обязательной потере объективности'],
      answer:1,
      explanation:'Вырождение касательной жёсткости связано с потерей локальной единственности/устойчивости равновесного состояния.',
    },
    {
      prompt:'Чем предельная точка отличается от бифуркационной?',
      options:['Ничем','В предельной точке ветвь разворачивается по параметру нагрузки, а при бифуркации появляются альтернативные ветви','Бифуркация существует только в линейных задачах','Предельная точка возможна только при J=1'],
      answer:1,
      explanation:'Limit point связан с поворотом равновесной ветви, а bifurcation — с появлением нескольких допустимых направлений продолжения.',
    },
    {
      prompt:'Почему обычное управление нагрузкой может не пройти snap-through?',
      options:['Потому что материал обязательно разрушился','Потому что нагрузка перестаёт быть удобным однозначным параметром пути','Потому что метод Ньютона запрещён','Потому что F становится симметричным'],
      answer:1,
      explanation:'После предельной точки одна и та же нагрузка может соответствовать нескольким состояниям, поэтому нужен иной параметр продолжения.',
    },
    {
      prompt:'Что делает метод длины дуги?',
      options:['Заменяет конститутивную модель','Добавляет ограничение на совместное приращение нагрузки и перемещений','Всегда стабилизирует физически неустойчивую ветвь','Удаляет геометрическую нелинейность'],
      answer:1,
      explanation:'Arc-length вводит дополнительное условие, позволяющее параметризовать путь комбинацией приращений u и параметра нагрузки.',
    },
    {
      prompt:'Как малое геометрическое несовершенство влияет на идеальную симметричную бифуркацию?',
      options:['Всегда повышает критическую нагрузку','Снимает точную симметрию и может выбрать одну посткритическую ветвь','Делает материал линейным','Устраняет зависимость от геометрии'],
      answer:1,
      explanation:'Даже малое несовершенство нарушает идеальную симметрию и часто превращает “идеальную” развилку в смещённый реальный путь.',
    },
  ],
  en: [
    {
      prompt:'What fundamentally distinguishes a hyperelastic material?',
      options:['Stress depends only on strain rate','Stress follows from a strain-energy function','The material is always incompressible','The material is always linear'],
      answer:1,
      explanation:'A hyperelastic constitutive response is derived from a strain-energy potential Ψ.',
    },
    {
      prompt:'Which quantity directly measures local volume change at finite strain?',
      options:['I₁','I₂','J = det F','λ₁'],
      answer:2,
      explanation:'The Jacobian J = det F is the local current-to-reference volume ratio.',
    },
    {
      prompt:'Why can Cauchy stress σ, first Piola stress P, and second Piola–Kirchhoff stress S not be interchanged blindly?',
      options:['They have different units','They refer to different configurations and area measures','Only σ is a tensor','P exists only in linear elasticity'],
      answer:1,
      explanation:'They are energetically conjugate to different deformation measures and refer to different configurations.',
    },
    {
      prompt:'What commonly happens for a nearly incompressible material in a simple displacement-only formulation?',
      options:['Pressure disappears','Volumetric locking may occur','The system becomes linear','J automatically becomes zero'],
      answer:1,
      explanation:'Very high volumetric stiffness may make standard displacement elements artificially stiff.',
    },
    {
      prompt:'What is the core equation of one Newton iteration in nonlinear FEM?',
      options:['R = 0 with no update','K_T Δu = −R','σ = Eε','J = 1'],
      answer:1,
      explanation:'The residual is linearized at the current state and solved using the tangent stiffness K_T.',
    },
    {
      prompt:'If the smallest eigenvalue of K_T approaches zero, this primarily signals…',
      options:['increasing density','approach to a critical state','zero deformation','mandatory loss of objectivity'],
      answer:1,
      explanation:'A nearly singular tangent stiffness is associated with loss of local uniqueness or stability.',
    },
    {
      prompt:'How does a limit point differ from a bifurcation point?',
      options:['They are identical','At a limit point the branch turns in load space; at bifurcation alternative branches emerge','Bifurcation only exists in linear problems','A limit point requires J=1'],
      answer:1,
      explanation:'A limit point is a turning point of one equilibrium path, whereas bifurcation introduces multiple possible branches.',
    },
    {
      prompt:'Why can simple load control fail to pass through snap-through?',
      options:['Because the material must have failed','Because load ceases to be a convenient single-valued path parameter','Because Newton iteration is forbidden','Because F becomes symmetric'],
      answer:1,
      explanation:'Beyond a limit point, the same load can correspond to multiple states, so a different continuation parameter is needed.',
    },
    {
      prompt:'What does the arc-length method add?',
      options:['A new constitutive model','A constraint coupling displacement and load increments','Physical stabilization of every unstable branch','Removal of geometric nonlinearity'],
      answer:1,
      explanation:'Arc-length continuation adds a constraint that parametrizes the path using both displacement and load increments.',
    },
    {
      prompt:'How does a small geometric imperfection affect an ideal symmetric bifurcation?',
      options:['It always increases critical load','It breaks exact symmetry and may select one post-critical branch','It linearizes the material','It removes geometric dependence'],
      answer:1,
      explanation:'Even a small imperfection breaks perfect symmetry and can strongly alter the observed post-critical path.',
    },
  ],
}

export function FiniteStrainFinalChallenge({language,onBack,onNext}:Props){
  const copy = text[language]
  const qs = questions[language]
  const [answers,setAnswers] = useState<Record<number,number>>({})

  const score = useMemo(
    () => qs.reduce((sum,q,i)=>sum+(answers[i]===q.answer?1:0),0),
    [answers,qs]
  )
  const answered = Object.keys(answers).length
  const finished = answered===qs.length
  const verdict = score>=9 ? copy.perfect : score>=7 ? copy.good : copy.retry

  const reset = () => setAnswers({})

  return <section className="module-view module-view-stacked">
    <div className="lesson-copy">
      <div className="lesson-index">D14</div>
      <h1>{copy.title}</h1>
      <p className="lead">{copy.lead}</p>
      <div className="concept-card"><span>{copy.kicker}</span><strong>{copy.intro}</strong></div>
      <div className="definition">
        <div className="formula">{copy.score}: {score}/{qs.length}</div>
        <p>{copy.answered}: {answered}/{qs.length}{finished ? ` · ${verdict}` : ''}</p>
      </div>
      <button className="text-button" onClick={reset}>{copy.reset}</button>
      <div className="module-actions">
        {onBack&&<button className="text-button" onClick={onBack}>{copy.back}</button>}
        {onNext&&<button className="primary-button" onClick={onNext}>{copy.next}</button>}
      </div>
    </div>

    <div className="scene-column">
      <div className="scene-card">
        <div className="scene-head">
          <div><span className="scene-kicker">{copy.kicker}</span><h2>{copy.intro}</h2></div>
          <div className="live-badge">{score}/{qs.length}</div>
        </div>

        <div className="control-stack">
          {qs.map((q,i)=>{
            const picked=answers[i]
            const isAnswered=picked!==undefined
            const isCorrect=picked===q.answer
            return <div className="prediction-card" key={i}>
              <span>D14 · {String(i+1).padStart(2,'0')}</span>
              <strong>{q.prompt}</strong>
              <div className="mode-switcher">
                {q.options.map((option,j)=>
                  <button
                    key={j}
                    className={picked===j?'active':''}
                    onClick={()=>setAnswers(prev=>({...prev,[i]:j}))}
                  >{option}</button>
                )}
              </div>
              {isAnswered&&<p><strong>{isCorrect?copy.correct:copy.wrong}.</strong> {copy.explanation}: {q.explanation}</p>}
            </div>
          })}
        </div>
      </div>

      <div className="bottom-grid">
        <div className="prediction-card">
          <span>{copy.synthesis}</span>
          <strong>{copy.synthesisTitle}</strong>
          <p>{copy.synthesisText}</p>
        </div>
        <div className="author-card">
          <span>{copy.takeaway}</span>
          <strong>{copy.takeawayTitle}</strong>
          <p>{copy.takeawayText}</p>
        </div>
      </div>
    </div>
  </section>
}
