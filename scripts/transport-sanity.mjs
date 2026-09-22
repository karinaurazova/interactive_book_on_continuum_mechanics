const eps = 1e-9;

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

function near(a,b,tol=1e-9) {
  return Math.abs(a-b) <= tol;
}

function det(A) {
  return A[0][0]*A[1][1]-A[0][1]*A[1][0];
}

function inv(A) {
  const d=det(A);
  return [[A[1][1]/d,-A[0][1]/d],[-A[1][0]/d,A[0][0]/d]];
}

function mul(A,B) {
  return [
    [
      A[0][0]*B[0][0]+A[0][1]*B[1][0],
      A[0][0]*B[0][1]+A[0][1]*B[1][1],
    ],
    [
      A[1][0]*B[0][0]+A[1][1]*B[1][0],
      A[1][0]*B[0][1]+A[1][1]*B[1][1],
    ],
  ];
}

function transpose(A) {
  return [[A[0][0],A[1][0]],[A[0][1],A[1][1]]];
}

function add(A,B) {
  return [
    [A[0][0]+B[0][0],A[0][1]+B[0][1]],
    [A[1][0]+B[1][0],A[1][1]+B[1][1]],
  ];
}

function sub(A,B) {
  return [
    [A[0][0]-B[0][0],A[0][1]-B[0][1]],
    [A[1][0]-B[1][0],A[1][1]-B[1][1]],
  ];
}

function scale(A,s) {
  return [[s*A[0][0],s*A[0][1]],[s*A[1][0],s*A[1][1]]];
}

function norm(A) {
  return Math.sqrt(A.flat().reduce((acc,x)=>acc+x*x,0));
}

// 1) Velocity-gradient identity L = Fdot F^{-1}
{
  const F=[[1.2,0.3],[0.1,0.9]];
  const Fdot=[[0.4,-0.2],[0.15,0.25]];
  const L=mul(Fdot,inv(F));
  const recovered=mul(L,F);
  assert(norm(sub(recovered,Fdot))<eps,"L = Fdot F^{-1} failed");
}

// 2) Symmetric/skew decomposition
{
  const L=[[0.5,-0.7],[0.9,-0.1]];
  const Lt=transpose(L);
  const D=scale(add(L,Lt),0.5);
  const W=scale(sub(L,Lt),0.5);
  assert(norm(sub(L,add(D,W)))<eps,"L = D + W failed");
  assert(norm(sub(D,transpose(D)))<eps,"D must be symmetric");
  assert(norm(add(W,transpose(W)))<eps,"W must be skew-symmetric");
}

// 3) Jacobian-rate identity Jdot = J tr L = J tr D
{
  const alpha=0.35, beta=-0.12, gamma=0.4, t=0.6;
  const a=Math.exp(alpha*t);
  const b=Math.exp(beta*t);
  const F=[[a,gamma*t],[0,b]];
  const Fdot=[[alpha*a,gamma],[0,beta*b]];
  const L=mul(Fdot,inv(F));
  const Lt=transpose(L);
  const D=scale(add(L,Lt),0.5);
  const J=det(F);
  const Jdot=(alpha+beta)*J;
  assert(near(Jdot,J*(L[0][0]+L[1][1]),1e-10),"Jdot = J tr L failed");
  assert(near(Jdot,J*(D[0][0]+D[1][1]),1e-10),"Jdot = J tr D failed");
}

// 4) Material derivative along a trajectory
{
  const X=0.3, t=0.22, h=1e-5, w=2*Math.PI;
  const evalAlong=(tt)=>{
    const a=1+0.22*Math.sin(w*tt);
    const b=0.18*Math.sin(w*tt+0.4);
    const x=a*X+b;
    return Math.sin(Math.PI*x)*Math.cos(0.8*tt)+0.25*tt;
  };

  const a=1+0.22*Math.sin(w*t);
  const adot=0.22*w*Math.cos(w*t);
  const b=0.18*Math.sin(w*t+0.4);
  const bdot=0.18*w*Math.cos(w*t+0.4);
  const x=a*X+b;
  const v=adot*X+bdot;
  const local=-0.8*Math.sin(0.8*t)*Math.sin(Math.PI*x)+0.25;
  const grad=Math.PI*Math.cos(Math.PI*x)*Math.cos(0.8*t);
  const material=local+v*grad;
  const finite=(evalAlong(t+h)-evalAlong(t-h))/(2*h);

  assert(near(material,finite,1e-6),"Material derivative trajectory check failed");
}

// 5) Material-region transport theorem
{
  const t=0.45, kappa=0.35, q=0.30, c=0.45;
  const a=Math.exp(kappa*t);
  const adot=kappa*a;
  const direct=adot*(1+q*t)+a*q+c*a*adot;
  const materialTerm=q*a+0.5*kappa*c*a*a;
  const volumeTerm=kappa*(a*(1+q*t)+0.5*c*a*a);
  assert(near(direct,materialTerm+volumeTerm,1e-10),"Material transport theorem failed");
}

// 6) Fixed control-volume transport balance
{
  const q=0.25, v=0.65, c=0.40;
  const accumulation=q;
  const netOut=v*c;
  const materialRate=q+v*c;
  assert(near(accumulation+netOut,materialRate,1e-12),"Fixed control-volume balance failed");
}

// 7) Moving-control-volume invariance with respect to boundary speed w
{
  const q=0.20, v=0.75, c=0.55;
  const expected=q+v*c;
  for (const w of [-0.5,0,0.2,0.75,1.1]) {
    const accumulation=q+w*c;
    const relativeFlux=(v-w)*c;
    assert(near(accumulation+relativeFlux,expected,1e-12),
      "Moving control-volume transport must be independent of w");
  }
}

// 8) Material-boundary limit: w = v -> zero relative flux
{
  const v=0.72, w=v, c=0.4;
  assert(near((v-w)*c,0,eps),"Material boundary relative flux must vanish");
}

console.log("Transport sanity checks passed.");
