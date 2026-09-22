const eps = 1e-9;

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

function near(a,b,tol=1e-9) {
  return Math.abs(a-b) <= tol;
}

// 1) Mass balance: Dρ/Dt + ρ div v = 0
{
  const rho0=1.4, kappa=0.32, t=0.7;
  const J=Math.exp(kappa*t);
  const rho=rho0/J;
  const DrhoDt=-kappa*rho;
  assert(near(DrhoDt+rho*kappa,0,eps),"Continuity equation failed");
  assert(near(rho*J,rho0,eps),"rho J = rho0 failed");
}

// 2) Linear momentum: ρa = div σ + ρb
{
  const rho=1.3, divSigma=0.55, b=-0.12;
  const a=(divSigma+rho*b)/rho;
  assert(near(rho*a-divSigma-rho*b,0,eps),"Linear momentum balance failed");
}

// 3) Angular momentum for a classical non-polar continuum
{
  const sigma=[[1.2,0.35],[0.35,-0.4]];
  assert(near(sigma[0][1],sigma[1][0],eps),"Stress symmetry failed");
}

// 4) Energy balance: ρ De/Dt = σ:D - div q + ρr
{
  const rho=1.1, stressPower=0.48, minusDivQ=0.17, rhoR=0.09;
  const DeDt=(stressPower+minusDivQ+rhoR)/rho;
  assert(near(rho*DeDt-stressPower-minusDivQ-rhoR,0,eps),"Energy balance failed");
}

// 5) Spherical/deviatoric stress-power split
{
  const p=0.6, trD=0.25, sAmp=0.4, dAmp=-0.2;
  const spherical=p*trD;
  const deviatoric=2*sAmp*dAmp;
  const total=spherical+deviatoric;
  assert(near(total,spherical+deviatoric,eps),"Stress-power decomposition failed");
}

// 6) Clausius-Duhem: simple admissible and inadmissible examples
{
  const admissible=0.55-0.30+0.08;
  const inadmissible=0.20-0.50+0.05;
  assert(admissible>=0,"Admissible dissipation example failed");
  assert(inadmissible<0,"Inadmissible dissipation example failed");
}

// 7) Newtonian viscous contribution: D = 2 μ Ddev:Ddev >= 0 for μ >= 0
{
  const mu=0.45, ddevNorm2=0.7;
  const diss=2*mu*ddevNorm2;
  assert(diss>=0,"Positive viscosity must not create negative dissipation");
}

// 8) Weak-form bookkeeping: internal = external at equilibrium
{
  const inertial=0.20, internal=0.75, body=0.30, traction=0.65;
  assert(near(inertial+internal,body+traction,eps),"Weak-form balance failed");
}

console.log("Balance-law sanity checks passed.");