# Interactive Book on Continuum Mechanics

**An interactive textbook where continuum mechanics can be manipulated, not only read.**

> **Current release candidate: v0.3.1.**

The project combines rigorous continuum mechanics, synchronized mathematical representations, interactive geometry, and browser-based computational experiments.

## Why this project

Continuum mechanics is often taught through static diagrams and formulas even though many of its central objects are geometric, tensorial, and easier to understand when they can be manipulated.

The learning flow is:

**physical question → prediction → manipulation → observation → mathematics → computation → self-check**

The same mechanical object is connected across several views:

**physical object → tensor → components → geometry → computation**

Notation can be switched between tensor, index, matrix, and Python forms.

## Current chapters

### 1. Stress state at a point — M00–M14

The chapter develops the Cauchy stress concept from a physical cut through a body to tensor analysis and computation.

Topics include:

- continuum idealization;
- imaginary cut and traction vector;
- orientation dependence;
- Cauchy tetrahedron;
- stress-tensor components;
- symmetry from angular-momentum balance;
- normal/tangential traction decomposition;
- change of basis;
- principal stresses;
- invariants;
- spherical and deviatoric parts;
- Mohr circle;
- computational stress laboratory;
- final self-check.

### 2. Kinematics of motion and deformation — K00–K12

The chapter develops finite-deformation kinematics from the motion map to computational analysis.

Topics include:

- motion and configurations;
- material and spatial coordinates;
- alternative notation: \(X\), \(x\), \(\xi\), \(\chi\);
- local neighborhood of a material point;
- deformation gradient \(F\);
- stretch, shear, and rotation;
- Jacobian \(J=\det F\);
- right and left Cauchy–Green tensors;
- Green–Lagrange and Euler–Almansi strain measures;
- polar decomposition \(F=RU=VR\);
- principal stretches and principal directions;
- limiting cases and rigid motion;
- computational kinematics laboratory;
- final self-check.

## Core features

- bilingual Russian / English interface;
- synchronized tensor / index / matrix / Python notation;
- interactive geometry rather than static illustration;
- explicit notation and sign conventions;
- prediction-first learning;
- misconception and limiting-case blocks;
- editable computational laboratories;
- sanity checks for benchmark mechanical states;
- responsive browser interface;
- open-source development.

## Scientific conventions

The project keeps conventions explicit rather than implicit.

Examples:

\[
\mathbf t(\mathbf n)=\boldsymbol\sigma\mathbf n,
\qquad
t_i=\sigma_{ij}n_j,
\]

and in kinematics

\[
\mathbf x=\boldsymbol\chi(\mathbf X,t),
\qquad
\mathbf F=\frac{\partial \mathbf x}{\partial \mathbf X},
\qquad
J=\det\mathbf F.
\]

The notation guide also documents alternative symbols used in the literature and distinguishes reference/material and current/spatial descriptions.

## Design identity

The visual language uses a modern scientific editorial system:

- graphite `#111318`
- warm off-white `#F4F2EC`
- blue `#2864FF`
- mint `#A9E3D2`
- orange reserved for warnings and problematic states

The goal is a research workspace rather than a school-poster aesthetic.

## Educational principles

- physical motivation before formalism;
- one main cognitive step per screen;
- exact formulas together with geometric meaning;
- one mathematical state shown through multiple representations;
- explicit treatment of assumptions and limiting cases;
- interactivity only when it changes understanding;
- computational checks as part of learning, not as decoration.

## Technical stack

- React + TypeScript;
- Vite;
- SVG-based interactive mechanics scenes;
- shared mathematical utilities;
- GitHub Actions for CI;
- GitHub Pages for deployment;
- JupyterLite / Pyodide planned for executable browser-side Python where appropriate.

## Verification

The `v0.3.1-hardening` branch includes automated kinematics sanity checks for:

- identity motion;
- proper rigid rotation;
- simple shear;
- finite stretch;
- negative-J reflection case.

The CI pipeline runs both the mathematical checks and the production build.

## Reference philosophy

The educational text is independently written and cross-checked against standard continuum-mechanics and biomechanics references, including Sedov, Lurie, Malvern, Lai–Rubin–Krempl, Gurtin–Fried–Anand, Holzapfel, Bonet–Wood, Chadwick, and Irgens.

The goal is not to reproduce any one textbook, but to build a coherent interactive learning path with explicit assumptions, conventions, and computational reasoning.

## Project documents

- [Project vision](docs/PROJECT_VISION.md)
- [Design system](docs/DESIGN_SYSTEM.md)
- [Notation conventions](docs/NOTATION_CONVENTIONS.md)
- [Technical architecture](docs/TECHNICAL_ARCHITECTURE.md)
- [v0.1 roadmap](docs/V0_1_ROADMAP.md)
- [v0.2 platform architecture](docs/V0_2_PLATFORM_ARCHITECTURE.md)

## Status

**v0.3.1 release candidate**

Completed:

- full stress chapter M00–M14;
- full kinematics chapter K00–K12;
- scientific hardening of kinematics;
- terminology normalization;
- responsive visual audit;
- automated kinematics sanity checks.

Next planned milestone:

**v0.4 — kinematics in time and transport**, including velocity, acceleration, material derivative, velocity gradient, rate-of-deformation tensor, spin, and transport relations.

## License

See [LICENSE](LICENSE).
