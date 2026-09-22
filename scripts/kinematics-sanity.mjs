const eps = 1e-10;

function det(F) {
  return F[0][0] * F[1][1] - F[0][1] * F[1][0];
}

function transpose(A) {
  return [[A[0][0], A[1][0]], [A[0][1], A[1][1]]];
}

function mul(A, B) {
  return [
    [
      A[0][0] * B[0][0] + A[0][1] * B[1][0],
      A[0][0] * B[0][1] + A[0][1] * B[1][1],
    ],
    [
      A[1][0] * B[0][0] + A[1][1] * B[1][0],
      A[1][0] * B[0][1] + A[1][1] * B[1][1],
    ],
  ];
}

function C(F) {
  return mul(transpose(F), F);
}

function E(F) {
  const c = C(F);
  return [
    [0.5 * (c[0][0] - 1), 0.5 * c[0][1]],
    [0.5 * c[1][0], 0.5 * (c[1][1] - 1)],
  ];
}

function norm(A) {
  return Math.sqrt(A.flat().reduce((s, v) => s + v * v, 0));
}

function eigSym2(A) {
  const a = A[0][0];
  const b = 0.5 * (A[0][1] + A[1][0]);
  const d = A[1][1];
  const disc = Math.sqrt((a - d) ** 2 + 4 * b * b);
  return [(a + d + disc) / 2, (a + d - disc) / 2];
}

function stretches(F) {
  return eigSym2(C(F)).map((x) => Math.sqrt(Math.max(x, 0)));
}

function near(a, b, tol = 1e-9) {
  return Math.abs(a - b) <= tol;
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const I = [[1, 0], [0, 1]];
assert(near(det(I), 1), "identity: J must be 1");
assert(norm(E(I)) < eps, "identity: E must be zero");

const theta = 0.71;
const R = [
  [Math.cos(theta), -Math.sin(theta)],
  [Math.sin(theta), Math.cos(theta)],
];
assert(near(det(R), 1), "rotation: J must be 1");
assert(norm(E(R)) < 1e-9, "rotation: E must be zero");
const lamR = stretches(R);
assert(near(lamR[0], 1, 1e-9) && near(lamR[1], 1, 1e-9), "rotation: stretches must be 1");

const gamma = 0.6;
const S = [[1, gamma], [0, 1]];
assert(near(det(S), 1), "simple shear: J must be 1");
assert(norm(E(S)) > 0.1, "simple shear: E must be nonzero");

const Fstretch = [[1.4, 0], [0, 0.8]];
const lam = stretches(Fstretch);
assert(near(lam[0], 1.4, 1e-9), "stretch: lambda1");
assert(near(lam[1], 0.8, 1e-9), "stretch: lambda2");
assert(near(det(Fstretch), 1.12, 1e-9), "stretch: J");

const reflection = [[-1, 0], [0, 1]];
assert(det(reflection) < 0, "reflection: J must be negative");

console.log("Kinematics sanity checks passed.");
