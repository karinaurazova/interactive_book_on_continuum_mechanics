# Interactive Book on Continuum Mechanics — Project Vision

## What this project is

This repository develops an interactive textbook on continuum mechanics in which a mathematical object, its geometric meaning, its physical interpretation, and its computational representation are presented together.

The project is not a collection of static lecture notes with occasional widgets. Its central unit is an **interactive experiment**.

A typical learning sequence is:

**physical question → prediction → manipulation → observation → mathematical formulation → interpretation → computation → self-check**

The first vertical prototype is:

> **Stress state at a point: from an imaginary cut to the Cauchy stress tensor.**

## Core principles

1. **Rigorous without unnecessary opacity.**  
   The mathematics is not replaced by metaphors. New objects appear only after the physical problem that makes them necessary has been made explicit.

2. **One object, several representations.**  
   Wherever useful, the same object can be viewed in direct tensor notation, index notation, matrix notation, geometric form, and code.

3. **Interactivity is explanatory, not decorative.**  
   Every slider, 3D scene, plot, or animation must answer a concrete conceptual question.

4. **Layered depth.**  
   The default explanation is readable for a student meeting continuum mechanics for the first time, while expandable derivations preserve graduate-level rigor.

5. **Notation is explicit.**  
   Sign conventions, index conventions, and alternative notations are stated rather than hidden.

6. **Misconceptions are first-class content.**  
   Each module contains a short “Do not confuse” block explaining common conceptual errors.

7. **Open and reproducible.**  
   The book, interactive components, and computational laboratories are developed openly in this repository.

## Design identity

The visual language follows the research-editorial style of **«Закулисье МатМодельера»**:

- graphite: `#111318`
- warm off-white: `#F4F2EC`
- blue accent: `#2864FF`
- mint accent: `#A9E3D2`
- orange reserved for warnings and misconceptions

The interface should feel like a modern researcher’s workspace rather than a school poster. The visual balance is approximately:

- 70% neutral scientific environment,
- 20% recognizable authorial identity,
- 10% expressive accents.

## v0.1 learning modules

- M00 — What continuum mechanics describes
- M01 — Imaginary cut through a body
- M02 — Traction vector
- M03 — Dependence on surface orientation and the need for a tensor
- M04 — Cauchy tetrahedron and the Cauchy stress tensor
- M05 — Reading stress tensor components
- M06 — Angular momentum balance and symmetry
- M07 — Normal and tangential traction components
- M08 — Change of basis
- M09 — Principal stresses and directions
- M10 — Stress invariants
- M11 — Spherical and deviatoric stress
- M12 — Mohr circles
- M13 — Computational laboratory
- M14 — Challenge and self-assessment

The first implementation milestone covers **M00–M04**.

## Reference philosophy

The text is written independently and checked against multiple authoritative sources rather than paraphrasing one textbook.

Core reference corpus:

- L. I. Sedov — *Continuum Mechanics*
- A. I. Lurie — *Theory of Elasticity*
- L. E. Malvern — *Introduction to the Mechanics of a Continuous Medium*
- W. M. Lai, D. Rubin, E. Krempl — *Introduction to Continuum Mechanics*
- M. E. Gurtin, E. Fried, L. Anand — *The Mechanics and Thermodynamics of Continua*
- G. A. Holzapfel — *Nonlinear Solid Mechanics*
- J. Bonet, R. D. Wood — *Nonlinear Continuum Mechanics for Finite Element Analysis*
- P. Chadwick — *Continuum Mechanics*
- F. Irgens — *Continuum Mechanics*

## Long-term direction

The project should ultimately support three modes:

- **Learn** — guided conceptual path;
- **Explore** — free manipulation of mathematical and mechanical objects;
- **Lab** — executable computational experiments in the browser.

The long-term scope extends from foundations of continuum mechanics to nonlinear solid mechanics, finite deformation, constitutive modeling, computational mechanics, and biomechanics.
