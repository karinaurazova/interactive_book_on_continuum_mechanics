# Interactive Book on Continuum Mechanics

**An interactive textbook where continuum mechanics can be manipulated, not only read.**

The project combines rigorous mechanics, live 3D geometry, multiple mathematical notations, and browser-based computational experiments.

> **Current release candidate: v0.3.1.** The project now contains two complete interactive learning lines: stress state at a point and finite-deformation kinematics.

## Why this project

Continuum mechanics is often taught through static diagrams and formulas even when its central objects are geometric and highly interactive.

This project explores a different approach:

**physical question → prediction → manipulation → observation → mathematics → computation → self-check**

A learner should be able to rotate a plane, change a tensor component, inspect a vector, switch notation, and immediately see how all representations of the same mechanical object change together.

## Core features

- interactive 3D mechanics scenes;
- synchronized tensor / index / matrix / Python notation;
- progressive mathematical derivations;
- explicit notation and sign conventions;
- misconception blocks;
- prediction-first learning;
- browser-side Python laboratories;
- open-source development.

## v0.1 modules

| Module | Topic |
|---|---|
| M00 | What continuum mechanics describes |
| M01 | Imaginary cut through a body |
| M02 | Traction vector |
| M03 | Surface orientation and the need for a tensor |
| M04 | Cauchy tetrahedron and Cauchy stress tensor |

Planned continuation includes tensor components, symmetry from angular momentum balance, stress transformation, principal stresses, invariants, spherical/deviatoric split, Mohr circles, and computational labs.

## Design identity

The visual language is based on the research-editorial style of **«Закулисье МатМодельера»**:

- graphite `#111318`
- warm off-white `#F4F2EC`
- blue `#2864FF`
- mint `#A9E3D2`
- orange reserved for warnings and misconceptions

The goal is a modern researcher’s workspace — not a school poster.

## Educational principles

- rigor without unnecessary opacity;
- no mathematical object before its physical motivation;
- one concept per primary interaction;
- multiple synchronized representations of one object;
- explicit conventions instead of hidden assumptions;
- interactivity used only when it improves understanding.

## Project documents

- [Project vision](docs/PROJECT_VISION.md)
- [Design system](docs/DESIGN_SYSTEM.md)
- [Notation conventions](docs/NOTATION_CONVENTIONS.md)
- [Technical architecture](docs/TECHNICAL_ARCHITECTURE.md)
- [v0.1 roadmap](docs/V0_1_ROADMAP.md)

## Current content

- [M00 — Что изучает механика сплошной среды?](content/m00_continuum.md)
- [M01 — Мысленный разрез тела](content/m01_imaginary_cut.md)
- [M02 — Вектор напряжения](content/m02_traction_vector.md)
- [M03 — Зависимость от ориентации и идея тензора](content/m03_orientation.md)
- [M04 — Тетраэдр Коши и тензор напряжений](content/m04_cauchy_tetrahedron.md)

## Planned technology

- Jupyter Book 2 / MyST for structured educational content;
- React + TypeScript for interface components;
- Three.js / React Three Fiber for 3D;
- Plotly/D3 where 2D scientific plots are appropriate;
- JupyterLite + Pyodide for browser-side computational laboratories;
- GitHub Pages + GitHub Actions for deployment.

## Reference philosophy

The educational text is written independently and checked against several authoritative sources, including Sedov, Lurie, Malvern, Lai–Rubin–Krempl, Gurtin–Fried–Anand, Holzapfel, Bonet–Wood, Chadwick, and Irgens.

The aim is not to reproduce any one textbook, but to build a coherent modern learning path with explicit notation and interactive reasoning.

## Status

**v0.3.1 release candidate.**

The current milestone is scientific and UX hardening of the completed stress and kinematics chapters before starting v0.4: kinematics in time and transport.

## License

See [LICENSE](LICENSE).
