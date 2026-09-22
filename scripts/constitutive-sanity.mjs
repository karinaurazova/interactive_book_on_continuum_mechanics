const eps=1e-9;
const near=(a,b,t=eps)=>Math.abs(a-b)<=t;
const assert=(c,m)=>{if(!c) throw new Error(m)};

// 1) Isotropic elastic constants
{
  const E=1.5, nu=.3;
  const G=E/(2*(1+nu));
  const K=E/(3*(1-2*nu));
  const lam=E*nu/((1+nu)*(1-2*nu));
  assert(near(G,.5769230769230769,1e-12),"G(E,nu) failed");
  assert(near(K,1.25,1e-12),"K(E,nu) failed");
  assert(near(lam,.8653846153846153,1e-12),"lambda(E,nu) failed");
}

// 2) Volumetric/deviatoric split
{
  const K=3, G=1, trE=.12, dev=.18;
  const mean=K*trE;
  const devStress=2*G*dev;
  const psi=.5*K*trE*trE + G*2*dev*dev;
  assert(near(mean,.36),"volumetric stress failed");
  assert(near(devStress,.36),"deviatoric stress failed");
  assert(psi>0,"elastic energy must be positive in this example");
}

// 3) Near-incompressible penalty
{
  const K=25, J=1.03;
  const U=.5*K*(J-1)**2;
  const p=K*(J-1);
  assert(U>0 && p>0,"near-incompressible penalty failed");
}

// 4) Objectivity: C* = C under F* = QF
{
  const a=.73, c=Math.cos(a), s=Math.sin(a);
  const Q=[[c,-s],[s,c]], F=[[1.2,.2],[0,.9]];
  const mul=(A,B)=>[
    [A[0][0]*B[0][0]+A[0][1]*B[1][0],A[0][0]*B[0][1]+A[0][1]*B[1][1]],
    [A[1][0]*B[0][0]+A[1][1]*B[1][0],A[1][0]*B[0][1]+A[1][1]*B[1][1]]
  ];
  const T=A=>[[A[0][0],A[1][0]],[A[0][1],A[1][1]]];
  const Fs=mul(Q,F), C=mul(T(F),F), Cs=mul(T(Fs),Fs);
  assert(near(C[0][0],Cs[0][0],1e-12)&&near(C[0][1],Cs[0][1],1e-12)&&near(C[1][1],Cs[1][1],1e-12),"objectivity C*=C failed");
}

// 5) Nonnegative viscous dissipation for eta >= 0
{
  const eta=.6, rate=.25;
  const D=eta*rate*rate;
  assert(D>=0,"viscous dissipation failed");
}

console.log("Constitutive sanity checks passed.");