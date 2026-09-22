import { useMemo, useState } from 'react'
import type { Language, NotationMode } from '../i18n'

type Props = {
  notation: NotationMode
  language: Language
  onBack: () => void
  onNext: () => void
}

type Matrix3 = number[][]

const text = {
  ru: {
    back: '← M12',
    title: 'Вычислительная лаборатория',
    lead: 'Теперь все конструкции главы собираются в одном рабочем пространстве. Задай напряжённое состояние, выбери площадку и исследуй тензор как вычислительный объект.',
    key: 'РЕЖИМ ЛАБОРАТОРИИ',
    keyText: 'Меняй исходные данные и проверяй, как согласуются геометрия, матрица, инварианты, главные значения и Python-представление.',
    editor: 'Редактор тензора',
    presets: 'готовые состояния',
    uniaxial: 'одноосное',
    shear: 'чистый сдвиг',
    hydro: 'гидростатическое',
    custom: 'текущий',
    orientation: 'Ориентация площадки',
    theta: 'θ',
    phi: 'φ',
    traction: 'вектор t',
    sigmaN: 'σₙ',
    tau: '|τ|',
    invariants: 'Инварианты',
    principals: 'Главные напряжения',
    mean: 'среднее напряжение',
    devTrace: 'tr(s)',
    checks: 'Автоматические проверки',
    checkUnit: '‖n‖ = 1',
    checkOrth: 'τ ⟂ n',
    checkDev: 'tr(s) = 0',
    checkSym: 'σ = σᵀ',
    passed: 'выполнено',
    failed: 'не выполнено',
    python: 'Python-представление',
    pythonHint: 'Код соответствует текущему состоянию лаборатории.',
    sceneKicker: 'STRESS TENSOR LAB',
    sceneTitle: 'один тензор — несколько связанных представлений',
    interactive: 'ИНТЕРАКТИВНО',
    question: 'ЗАДАНИЕ',
    questionTitle: 'Попробуй найти ориентацию, где |τ| почти равно нулю.',
    questionText: 'Сравни найденное направление с главным направлением из собственного разложения.',
    conclusion: 'ИТОГ',
    conclusionTitle: 'Теперь глава работает как единая вычислительная система.',
    conclusionText: 'В следующем модуле подсказки исчезнут: останется только задача и твои инструменты.',
    aria: 'Вычислительная лаборатория для анализа тензора напряжений',
    next: 'Перейти к финальному challenge →',
  },
  en: {
    back: '← M12',
    title: 'Computational laboratory',
    lead: 'All constructions from the chapter now come together in one workspace. Define a stress state, choose a plane, and investigate the tensor as a computational object.',
    key: 'LAB MODE',
    keyText: 'Change the inputs and verify how geometry, matrix form, invariants, principal values, and Python representation stay consistent.',
    editor: 'Tensor editor',
    presets: 'preset states',
    uniaxial: 'uniaxial',
    shear: 'pure shear',
    hydro: 'hydrostatic',
    custom: 'current',
    orientation: 'Plane orientation',
    theta: 'θ',
    phi: 'φ',
    traction: 'traction t',
    sigmaN: 'σₙ',
    tau: '|τ|',
    invariants: 'Invariants',
    principals: 'Principal stresses',
    mean: 'mean stress',
    devTrace: 'tr(s)',
    checks: 'Automatic checks',
    checkUnit: '‖n‖ = 1',
    checkOrth: 'τ ⟂ n',
    checkDev: 'tr(s) = 0',
    checkSym: 'σ = σᵀ',
    passed: 'passed',
    failed: 'failed',
    python: 'Python representation',
    pythonHint: 'The code matches the current laboratory state.',
    sceneKicker: 'STRESS TENSOR LAB',
    sceneTitle: 'one tensor — multiple linked representations',
    interactive: 'INTERACTIVE',
    question: 'TASK',
    questionTitle: 'Try to find an orientation where |τ| is nearly zero.',
    questionText: 'Compare that direction with a principal direction from the eigen-decomposition.',
    conclusion: 'CONCLUSION',
    conclusionTitle: 'The chapter now behaves as one computational system.',
    conclusionText: 'In the next module the hints disappear: only the problem and your tools remain.',
    aria: 'Computational laboratory for stress tensor analysis',
    next: 'Continue to final challenge →',
  },
} as const

const presets: Record<string, Matrix3> = {
  custom: [
    [1.30, 0.50, 0.18],
    [0.50, 0.85, 0.22],
    [0.18, 0.22, 0.62],
  ],
  uniaxial: [
    [1.40, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ],
  shear: [
    [0, 0.75, 0],
    [0.75, 0, 0],
    [0, 0, 0],
  ],
  hydro: [
    [0.90, 0, 0],
    [0, 0.90, 0],
    [0, 0, 0.90],
  ],
}

function fmt(v: number, d = 3) {
  return (Math.abs(v) < 1e-10 ? 0 : v).toFixed(d)
}

function matVec(a: Matrix3, x: number[]) {
  return a.map((row) => row.reduce((s, v, i) => s + v * x[i], 0))
}

function dot(a: number[], b: number[]) {
  return a.reduce((s, v, i) => s + v * b[i], 0)
}

function norm(a: number[]) {
  return Math.sqrt(dot(a, a))
}

function trace(a: Matrix3) {
  return a[0][0] + a[1][1] + a[2][2]
}

function matMul(a: Matrix3, b: Matrix3) {
  return a.map((row) => b[0].map((_, j) => row.reduce((s, v, k) => s + v * b[k][j], 0)))
}

function invariants(a: Matrix3) {
  const i1 = trace(a)
  const a2 = matMul(a, a)
  const i2 = 0.5 * (i1 * i1 - trace(a2))
  const i3 =
    a[0][0] * (a[1][1] * a[2][2] - a[1][2] * a[2][1]) -
    a[0][1] * (a[1][0] * a[2][2] - a[1][2] * a[2][0]) +
    a[0][2] * (a[1][0] * a[2][1] - a[1][1] * a[2][0])
  return [i1, i2, i3]
}

function jacobiEigenvalues(input: Matrix3) {
  const a = input.map((r) => [...r])
  for (let iter = 0; iter < 30; iter++) {
    let p = 0
    let q = 1
    let max = Math.abs(a[0][1])
    for (const [i, j] of [[0, 2], [1, 2]] as const) {
      if (Math.abs(a[i][j]) > max) {
        max = Math.abs(a[i][j])
        p = i
        q = j
      }
    }
    if (max < 1e-12) break
    const phi = 0.5 * Math.atan2(2 * a[p][q], a[q][q] - a[p][p])
    const c = Math.cos(phi)
    const s = Math.sin(phi)
    const app = c * c * a[p][p] - 2 * s * c * a[p][q] + s * s * a[q][q]
    const aqq = s * s * a[p][p] + 2 * s * c * a[p][q] + c * c * a[q][q]
    for (let k = 0; k < 3; k++) {
      if (k !== p && k !== q) {
        const akp = c * a[k][p] - s * a[k][q]
        const akq = s * a[k][p] + c * a[k][q]
        a[k][p] = a[p][k] = akp
        a[k][q] = a[q][k] = akq
      }
    }
    a[p][p] = app
    a[q][q] = aqq
    a[p][q] = a[q][p] = 0
  }
  return [a[0][0], a[1][1], a[2][2]].sort((x, y) => y - x)
}

export function ComputationalLab({ notation, language, onBack, onNext }: Props) {
  const copy = text[language]
  const [sigma, setSigma] = useState<Matrix3>(presets.custom.map(r => [...r]))
  const [thetaDeg, setThetaDeg] = useState(40)
  const [phiDeg, setPhiDeg] = useState(35)

  const theta = thetaDeg * Math.PI / 180
  const phi = phiDeg * Math.PI / 180
  const n = useMemo(() => [
    Math.sin(theta) * Math.cos(phi),
    Math.sin(theta) * Math.sin(phi),
    Math.cos(theta),
  ], [theta, phi])

  const t = useMemo(() => matVec(sigma, n), [sigma, n])
  const sigmaN = dot(t, n)
  const normalPart = n.map((v) => sigmaN * v)
  const tauVec = t.map((v, i) => v - normalPart[i])
  const tauMag = norm(tauVec)

  const inv = useMemo(() => invariants(sigma), [sigma])
  const principal = useMemo(() => jacobiEigenvalues(sigma), [sigma])
  const mean = trace(sigma) / 3
  const deviator = sigma.map((row, i) => row.map((v, j) => v - (i === j ? mean : 0)))
  const devTrace = trace(deviator)

  const symmetryError = Math.max(
    Math.abs(sigma[0][1] - sigma[1][0]),
    Math.abs(sigma[0][2] - sigma[2][0]),
    Math.abs(sigma[1][2] - sigma[2][1]),
  )
  const orthError = Math.abs(dot(tauVec, n))
  const unitError = Math.abs(norm(n) - 1)

  const setSymmetricEntry = (i: number, j: number, value: number) => {
    setSigma((prev) => {
      const next = prev.map((r) => [...r])
      next[i][j] = value
      next[j][i] = value
      return next
    })
  }

  const setDiagEntry = (i: number, value: number) => {
    setSigma((prev) => {
      const next = prev.map((r) => [...r])
      next[i][i] = value
      return next
    })
  }

  const applyPreset = (key: string) => setSigma(presets[key].map(r => [...r]))

  const pythonCode = `import numpy as np

sigma = np.array([
    [${fmt(sigma[0][0],2)}, ${fmt(sigma[0][1],2)}, ${fmt(sigma[0][2],2)}],
    [${fmt(sigma[1][0],2)}, ${fmt(sigma[1][1],2)}, ${fmt(sigma[1][2],2)}],
    [${fmt(sigma[2][0],2)}, ${fmt(sigma[2][1],2)}, ${fmt(sigma[2][2],2)}]
])

n = np.array([${fmt(n[0],4)}, ${fmt(n[1],4)}, ${fmt(n[2],4)}])

t = sigma @ n
sigma_n = n @ sigma @ n
tau = t - sigma_n * n

eigvals, eigvecs = np.linalg.eigh(sigma)
I1 = np.trace(sigma)
I2 = 0.5 * (I1**2 - np.trace(sigma @ sigma))
I3 = np.linalg.det(sigma)`

  const notationLine =
    notation === 'Index' ? 'tᵢ = σᵢⱼnⱼ' :
    notation === 'Matrix' ? 't = [σ]n' :
    notation === 'Python' ? 't = sigma @ n' :
    '𝐭 = σ𝐧'

  const checks = [
    [copy.checkUnit, unitError < 1e-10],
    [copy.checkOrth, orthError < 1e-10],
    [copy.checkDev, Math.abs(devTrace) < 1e-10],
    [copy.checkSym, symmetryError < 1e-10],
  ] as const

  return (
    <section className="module-view module-view-wide-title">
      <div className="lesson-copy">
        <button className="text-button" onClick={onBack}>{copy.back}</button>
        <div className="lesson-index">M13 / 14</div>
        <h1>{copy.title}</h1>
        <p className="lead">{copy.lead}</p>

        <div className="concept-card">
          <span>{copy.key}</span>
          <strong>{copy.keyText}</strong>
        </div>

        <div className="definition">
          <div className="definition-label">{copy.orientation}</div>
          <div className="formula">{notationLine}</div>
          <p>n = [{n.map(v => fmt(v)).join(', ')}]</p>
        </div>

        <button className="primary-button" onClick={onNext}>{copy.next}</button>
      </div>

      <div className="scene-column">
        <div className="scene-card lab-card">
          <div className="scene-head">
            <div>
              <span className="scene-kicker">{copy.sceneKicker}</span>
              <h2>{copy.sceneTitle}</h2>
            </div>
            <div className="live-badge">{copy.interactive}</div>
          </div>

          <div className="lab-top-grid">
            <div className="lab-section">
              <div className="lab-section-head">
                <strong>{copy.editor}</strong>
                <span>{copy.presets}</span>
              </div>

              <div className="lab-presets">
                <button onClick={() => applyPreset('uniaxial')}>{copy.uniaxial}</button>
                <button onClick={() => applyPreset('shear')}>{copy.shear}</button>
                <button onClick={() => applyPreset('hydro')}>{copy.hydro}</button>
                <button onClick={() => applyPreset('custom')}>{copy.custom}</button>
              </div>

              <div className="lab-matrix-editor" aria-label={copy.aria}>
                {[
                  [0,0],[0,1],[0,2],
                  [1,0],[1,1],[1,2],
                  [2,0],[2,1],[2,2],
                ].map(([i,j]) => (
                  <input
                    key={`${i}-${j}`}
                    type="number"
                    step="0.05"
                    value={sigma[i][j]}
                    onChange={(e) => {
                      const value = Number(e.target.value)
                      if (i === j) setDiagEntry(i, value)
                      else setSymmetricEntry(i, j, value)
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="lab-section">
              <div className="lab-section-head"><strong>{copy.orientation}</strong></div>
              <div className="control-stack">
                <label>
                  <span>{copy.theta} <strong>{thetaDeg}°</strong></span>
                  <input type="range" min="0" max="180" step="1" value={thetaDeg} onChange={(e) => setThetaDeg(Number(e.target.value))} />
                </label>
                <label>
                  <span>{copy.phi} <strong>{phiDeg}°</strong></span>
                  <input type="range" min="-180" max="180" step="1" value={phiDeg} onChange={(e) => setPhiDeg(Number(e.target.value))} />
                </label>
              </div>

              <div className="lab-vector-results">
                <div><span>{copy.traction}</span><strong>[{t.map(v => fmt(v)).join(', ')}]</strong></div>
                <div><span>{copy.sigmaN}</span><strong>{fmt(sigmaN)}</strong></div>
                <div><span>{copy.tau}</span><strong>{fmt(tauMag)}</strong></div>
              </div>
            </div>
          </div>

          <div className="lab-analysis-grid">
            <div className="lab-analysis-card">
              <span>{copy.invariants}</span>
              <strong>I₁ = {fmt(inv[0])}</strong>
              <strong>I₂ = {fmt(inv[1])}</strong>
              <strong>I₃ = {fmt(inv[2])}</strong>
            </div>

            <div className="lab-analysis-card">
              <span>{copy.principals}</span>
              {principal.map((v, i) => <strong key={i}>σ{i + 1} = {fmt(v)}</strong>)}
            </div>

            <div className="lab-analysis-card">
              <span>{copy.mean}</span>
              <strong>{fmt(mean)}</strong>
              <span>{copy.devTrace}</span>
              <strong>{fmt(devTrace)}</strong>
            </div>
          </div>

          <div className="lab-checks">
            <div className="lab-section-head"><strong>{copy.checks}</strong></div>
            <div className="lab-check-grid">
              {checks.map(([label, ok]) => (
                <div className={ok ? 'lab-check ok' : 'lab-check fail'} key={label}>
                  <span>{label}</span>
                  <strong>{ok ? '✓' : '!'}</strong>
                  <small>{ok ? copy.passed : copy.failed}</small>
                </div>
              ))}
            </div>
          </div>

          <div className="lab-python">
            <div className="lab-section-head">
              <strong>{copy.python}</strong>
              <span>{copy.pythonHint}</span>
            </div>
            <pre><code>{pythonCode}</code></pre>
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
