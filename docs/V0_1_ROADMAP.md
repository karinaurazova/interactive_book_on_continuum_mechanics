# v0.1 Roadmap — Stress State at a Point

## Goal

Build one complete vertical slice that proves the format of the project.

A successful v0.1 should allow a learner to move from the continuum hypothesis to the Cauchy stress tensor through interactive reasoning rather than memorization.

## Milestone A — Content foundation

- [x] project vision
- [x] design system
- [x] module map
- [ ] final educational text for M00–M04
- [ ] notation conventions document
- [ ] reference notes per module

## Milestone B — Front-end shell

- [ ] Jupyter Book / MyST content shell
- [ ] React interactive mount points
- [ ] shared design tokens
- [ ] module navigation
- [ ] notation switch
- [ ] responsive layout

## Milestone C — Interactive scenes

- [ ] M00 scale transition: discrete structure → continuum field
- [ ] M01 imaginary cut through a loaded body
- [ ] M02 traction vector and shrinking area
- [ ] M03 orientation sphere / map n → t(n)
- [ ] M04 Cauchy tetrahedron with h² vs h³ scaling

## Milestone D — Computational layer

- [ ] JupyterLite proof of concept
- [ ] Pyodide kernel
- [ ] NumPy tensor examples
- [ ] executable traction calculation

## Milestone E — Validation

- [ ] notation review
- [ ] mechanics review
- [ ] “clean-slate learner” test
- [ ] mobile test
- [ ] accessibility pass
- [ ] deploy preview

## Definition of done for v0.1

A learner should be able to explain, without memorized slogans:

1. why continuum mechanics uses fields;
2. why an imaginary cut exposes internal interaction;
3. what the traction vector is;
4. why traction depends on surface orientation;
5. why a second-order tensor is the compact object needed to encode stress state;
6. where the Cauchy relation comes from.
