export type Matrix = number[][]
export type Vector = number[]

export function dot(a: Vector, b: Vector) {
  return a.reduce((sum, value, i) => sum + value * b[i], 0)
}

export function norm(a: Vector) {
  return Math.sqrt(dot(a, a))
}

export function matVec(a: Matrix, x: Vector) {
  return a.map((row) => dot(row, x))
}

export function matMul(a: Matrix, b: Matrix) {
  return a.map((row) =>
    b[0].map((_, j) => row.reduce((sum, value, k) => sum + value * b[k][j], 0)),
  )
}

export function transpose(a: Matrix) {
  return a[0].map((_, j) => a.map((row) => row[j]))
}

export function trace(a: Matrix) {
  return a.reduce((sum, row, i) => sum + row[i], 0)
}

export function determinant3(a: Matrix) {
  return (
    a[0][0] * (a[1][1] * a[2][2] - a[1][2] * a[2][1]) -
    a[0][1] * (a[1][0] * a[2][2] - a[1][2] * a[2][0]) +
    a[0][2] * (a[1][0] * a[2][1] - a[1][1] * a[2][0])
  )
}
