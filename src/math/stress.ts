import { determinant3, matMul, trace, type Matrix } from './linalg'

export function stressInvariants(sigma: Matrix) {
  const i1 = trace(sigma)
  const sigma2 = matMul(sigma, sigma)
  const i2 = 0.5 * (i1 * i1 - trace(sigma2))
  const i3 = determinant3(sigma)
  return [i1, i2, i3] as const
}

export function meanStress(sigma: Matrix) {
  return trace(sigma) / sigma.length
}

export function deviator(sigma: Matrix) {
  const mean = meanStress(sigma)
  return sigma.map((row, i) => row.map((value, j) => value - (i === j ? mean : 0)))
}

export function symmetryError(sigma: Matrix) {
  let error = 0
  for (let i = 0; i < sigma.length; i++) {
    for (let j = i + 1; j < sigma.length; j++) {
      error = Math.max(error, Math.abs(sigma[i][j] - sigma[j][i]))
    }
  }
  return error
}

export function jacobiEigenvaluesSymmetric3(input: Matrix) {
  const a = input.map((row) => [...row])
  for (let iter = 0; iter < 40; iter++) {
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
