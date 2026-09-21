import { useMemo, useState } from 'react'
import type { Language, NotationMode } from '../i18n'

type Props = {
  notation: NotationMode
  language: Language
  onBack: () => void
}

const text = {
  ru: {
    back: '← M04',
    title: 'Как читать компоненты тензора напряжений',
    lead: 'Компонента σᵢⱼ отвечает на очень конкретный вопрос: какая i-я компонента вектора напряжения действует на площадке, нормаль которой направлена вдоль eⱼ.',
    key: 'КЛЮЧЕВАЯ МЫСЛЬ',
    keyText: 'В принятой здесь записи второй индекс выбирает площадку, а первый — направление компоненты вектора напряжения.',
    interpretation: 'Интерпретация компоненты',
    interpretationText: 'При фиксированном j мы читаем j-й столбец матрицы как вектор напряжения на площадке с нормалью eⱼ.',
    convention: 'Принятая конвенция',
    conventionText: 'Используем tᵢ = σᵢⱼ nⱼ. Поэтому j-й столбец матрицы σ равен вектору t(eⱼ). В литературе встречаются и другие соглашения, поэтому порядок индексов всегда нужно проверять.',
    selectTitle: 'Выберите компоненту σᵢⱼ',
    selectHint: 'Нажмите на любую ячейку матрицы. Столбец j задаёт площадку, строка i — направление компоненты.',
    rowAxis: 'строка i → направление',
    colAxis: 'столбец j → площадка',
    selected: 'Выбранная компонента',
    face: 'площадка',
    direction: 'направление',
    normal: 'нормаль',
    value: 'значение',
    question: 'ВОПРОС ДЛЯ ПРОВЕРКИ',
    questionTitle: 'Что означает σ₂₃?',
    questionText: 'Выбери σ₂₃ в матрице: это вторая компонента вектора напряжения на площадке с нормалью e₃.',
    warning: 'ВАЖНО',
    warningTitle: 'σ₁₂ и σ₂₁ — не одна и та же “компонента по определению”.',
    warningText: 'Их равенство появляется позже из баланса момента импульса для классического неполярного континуума.',
    sceneKicker: 'КОМПОНЕНТЫ σᵢⱼ',
    sceneTitle: 'выбери элемент матрицы и посмотри его геометрический смысл',
    interactive: 'ИНТЕРАКТИВНО',
    aria: 'Матрица тензора напряжений и геометрическая интерпретация выбранной компоненты',
  },
  en: {
    back: '← M04',
    title: 'How to read stress-tensor components',
    lead: 'A component σᵢⱼ answers a specific question: what is the i-th component of the traction vector acting on the plane whose normal is aligned with eⱼ?',
    key: 'KEY IDEA',
    keyText: 'With the convention used here, the second index selects the plane and the first index selects the traction-component direction.',
    interpretation: 'Component interpretation',
    interpretationText: 'For fixed j, the j-th matrix column is the traction vector on the plane with normal eⱼ.',
    convention: 'Convention used here',
    conventionText: 'We use tᵢ = σᵢⱼ nⱼ. Therefore the j-th column of σ equals t(eⱼ). Other conventions exist in the literature, so index order should always be checked.',
    selectTitle: 'Choose a component σᵢⱼ',
    selectHint: 'Click any matrix cell. Column j selects the plane, row i selects the component direction.',
    rowAxis: 'row i → direction',
    colAxis: 'column j → plane',
    selected: 'Selected component',
    face: 'plane',
    direction: 'direction',
    normal: 'normal',
    value: 'value',
    question: 'CHECKPOINT',
    questionTitle: 'What does σ₂₃ mean?',
    questionText: 'Select σ₂₃ in the matrix: it is the second component of traction on the plane with normal e₃.',
    warning: 'IMPORTANT',
    warningTitle: 'σ₁₂ and σ₂₁ are not identical by definition.',
    warningText: 'Their equality follows later from angular-momentum balance for a classical non-polar continuum.',
    sceneKicker: 'COMPONENTS σᵢⱼ',
    sceneTitle: 'select a matrix entry and inspect its geometric meaning',
    interactive: 'INTERACTIVE',
    aria: 'Stress tensor matrix with geometric interpretation of a selected component',
  },
} as const

const sigma = [
  [1.20, 0.42, -0.18],
  [0.42, 0.86, 0.31],
  [-0.18, 0.31, 0.64],
]

function fmt(v: number) {
  return v.toFixed(2)
}

export function StressComponents({ notation, language, onBack }: Props) {
  const copy = text[language]
  const [row, setRow] = useState(1)
  const [col, setCol] = useState(2)

  const value = sigma[row][col]
  const component = `σ${row + 1}${col + 1}`
  const normalLabel = `e${col + 1}`
  const directionLabel = `e${row + 1}`

  const columnVector = useMemo(() => sigma.map((r) => r[col]), [col])

  const notationLine =
    notation === 'Index' ? `tᵢ(e${col + 1}) = σᵢ${col + 1}` :
    notation === 'Matrix' ? `t(e${col + 1}) = column ${col + 1} of [σ]` :
    notation === 'Python' ? `t = sigma[:, ${col}]` :
    `𝐭(𝐞${col + 1}) = σ𝐞${col + 1}`

  const faceCenter = col === 0
    ? { x: 33, y: 36 }
    : col === 1
    ? { x: 50, y: 47 }
    : { x: 64, y: 29 }

  const normalEnd = col === 0
    ? { x: faceCenter.x - 14, y: faceCenter.y }
    : col === 1
    ? { x: faceCenter.x, y: faceCenter.y + 14 }
    : { x: faceCenter.x + 10, y: faceCenter.y - 11 }

  const dirVec =
    row === 0 ? { x: 14, y: 0 } :
    row === 1 ? { x: 0, y: -14 } :
    { x: -10, y: 10 }

  const componentEnd = {
    x: faceCenter.x + dirVec.x * Math.sign(value || 1),
    y: faceCenter.y + dirVec.y * Math.sign(value || 1),
  }

  return (
    <section className="module-view">
      <div className="lesson-copy">
        <button className="text-button" onClick={onBack}>{copy.back}</button>
        <div className="lesson-index">M05 / 06</div>
        <h1>{copy.title}</h1>
        <p className="lead">{copy.lead}</p>

        <div className="concept-card">
          <span>{copy.key}</span>
          <strong>{copy.keyText}</strong>
        </div>

        <div className="definition">
          <div className="definition-label">{copy.interpretation}</div>
          <div className="formula">{notationLine}</div>
          <p>{copy.interpretationText}</p>
        </div>

        <div className="definition">
          <div className="definition-label">{copy.convention}</div>
          <div className="formula">tᵢ = σᵢⱼ nⱼ</div>
          <p>{copy.conventionText}</p>
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

          <div className="stress-select-panel">
            <div className="stress-select-copy">
              <strong>{copy.selectTitle}</strong>
              <p>{copy.selectHint}</p>
            </div>

            <div className="matrix-axis-label matrix-axis-top">{copy.colAxis}</div>

            <div className="stress-matrix-wrap">
              <div className="matrix-axis-label matrix-axis-side">{copy.rowAxis}</div>

              <div className="stress-matrix" aria-label={copy.aria}>
                {sigma.map((r, i) =>
                  r.map((v, j) => (
                    <button
                      key={`${i}-${j}`}
                      className={row === i && col === j ? 'stress-cell active' : 'stress-cell'}
                      onClick={() => {
                        setRow(i)
                        setCol(j)
                      }}
                      aria-pressed={row === i && col === j}
                    >
                      <span>σ<sub>{i + 1}{j + 1}</sub></span>
                      <strong>{fmt(v)}</strong>
                    </button>
                  )),
                )}
              </div>
            </div>
          </div>

          <div className="stress-component-layout">
            <div className="stress-selection-explainer">
              <div className="selection-chip">
                <span>{copy.selected}</span>
                <strong>{component}</strong>
              </div>
              <div className="selection-chip">
                <span>{copy.normal}</span>
                <strong>{normalLabel}</strong>
              </div>
              <div className="selection-chip">
                <span>{copy.direction}</span>
                <strong>{directionLabel}</strong>
              </div>
              <div className="selection-chip">
                <span>{copy.value}</span>
                <strong>{fmt(value)}</strong>
              </div>
            </div>

            <svg className="component-scene" viewBox="0 0 100 72">
              <rect x="22" y="18" width="54" height="36" rx="5" fill="#20242C" stroke="#414752" strokeWidth="0.8" />

              <line x1="22" y1="54" x2="34" y2="61" stroke="#414752" strokeWidth="0.7" />
              <line x1="76" y1="54" x2="88" y2="61" stroke="#414752" strokeWidth="0.7" />
              <line x1="34" y1="61" x2="88" y2="61" stroke="#414752" strokeWidth="0.7" />
              <line x1="76" y1="18" x2="88" y2="25" stroke="#414752" strokeWidth="0.7" />
              <line x1="88" y1="25" x2="88" y2="61" stroke="#414752" strokeWidth="0.7" />

              <circle cx={faceCenter.x} cy={faceCenter.y} r="1.6" fill="#F4F2EC" />

              <line
                x1={faceCenter.x}
                y1={faceCenter.y}
                x2={normalEnd.x}
                y2={normalEnd.y}
                stroke="#2864FF"
                strokeWidth="1.6"
              />
              <text x={normalEnd.x + 1.2} y={normalEnd.y - 1} fill="#F4F2EC" fontSize="3.8">{normalLabel}</text>

              <line
                x1={faceCenter.x}
                y1={faceCenter.y}
                x2={componentEnd.x}
                y2={componentEnd.y}
                stroke="#A9E3D2"
                strokeWidth="2"
              />
              <text x={componentEnd.x + 1.2} y={componentEnd.y - 1} fill="#F4F2EC" fontSize="3.8">{component}</text>

              <text x="13" y="16" fill="#8E96A3" fontSize="3.2">e₃</text>
              <text x="89" y="64" fill="#8E96A3" fontSize="3.2">e₁</text>
              <text x="18" y="62" fill="#8E96A3" fontSize="3.2">e₂</text>
            </svg>
          </div>



          <div className="definition component-vector-card">
            <div className="definition-label">{copy.face} n = {normalLabel}</div>
            <div className="formula">
              t({normalLabel}) = [{columnVector.map(fmt).join('; ')}]
            </div>
          </div>
        </div>

        <div className="bottom-grid">
          <div className="prediction-card">
            <span>{copy.question}</span>
            <strong>{copy.questionTitle}</strong>
            <p>{copy.questionText}</p>
          </div>
          <div className="warning-card">
            <span>{copy.warning}</span>
            <strong>{copy.warningTitle}</strong>
            <p>{copy.warningText}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
