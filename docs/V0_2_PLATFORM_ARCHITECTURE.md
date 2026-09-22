# v0.2 Platform Architecture

## Goal

Turn the v0.1 pilot into a scalable interactive continuum-mechanics platform without changing the scientific content of M00–M14.

The platform should support many chapters without requiring manual edits to the root application for every new module.

## Core principles

1. **Content registry, not hard-coded routing**
   - Chapters and modules are declared in `src/content/catalog.tsx`.
   - `App.tsx` renders the active module from the registry.
   - Navigation and chapter progress are derived from the registry.

2. **Shared mathematics, not duplicated formulas**
   - Pure linear-algebra functions live in `src/math/linalg.ts`.
   - Stress-specific operations live in `src/math/stress.ts`.
   - Interactive components should consume these functions instead of reimplementing them.

3. **Components own interaction, registry owns structure**
   - A lesson component controls its local interactive state and visualization.
   - The registry controls chapter membership, order, metadata, and navigation.

4. **Bilingual by construction**
   - Module title/subtitle metadata live beside the module registration.
   - Global shell labels remain in `src/i18n.ts`.
   - Every new learning component must ship RU and EN copy together.

5. **One mathematical state, multiple representations**
   Each experiment should connect as many of these as relevant:
   - physical scene
   - tensor notation
   - index notation
   - matrix notation
   - Python
   - derived quantities / plots

## Current structure

```text
src/
  components/          interactive learning modules
  content/
    catalog.tsx        chapter + module registry
  math/
    linalg.ts          generic vector/matrix operations
    stress.ts          stress-tensor operations
  App.tsx              platform shell
  i18n.ts              global interface copy
```

## Module registry contract

Each module defines:

- stable module id
- chapter id
- localized title
- localized subtitle
- render function

The root app should not contain module-specific imports or `active === "Mxx"` branches.

## Math-layer contract

Math modules must:

- be UI-independent;
- accept plain numeric arrays;
- return deterministic numeric results;
- avoid React state and DOM dependencies;
- be reusable in visual modules, laboratories, tests, and future Python parity checks.

Current stress utilities include:

- invariants
- mean stress
- deviatoric stress
- symmetry error
- symmetric 3×3 Jacobi eigenvalue solver

## v0.2 milestones

### A. Registry foundation — implemented

- chapter registry
- module registry
- automatic module navigation
- automatic chapter progress
- localized module metadata in registry

### B. Shared mathematics — started

- linear algebra layer
- stress tensor layer
- M13 computational lab migrated to shared math

### C. Platform navigation — next

When the second chapter is implemented:

- chapter selector
- chapter-level progress
- previous/next chapter transitions
- optional deep links to chapter/module

### D. Learning-state layer — next

Prepare a reusable state model for:

- visited modules
- completed experiments
- completed self-checks
- per-chapter progress

Persistence can initially use local browser storage; account sync is a later concern.

### E. Reusable experiment primitives — next

Extract common UI patterns:

- interactive scene shell
- parameter slider
- metric card
- prediction/checkpoint block
- matrix editor
- vector display
- validation indicator
- Python code panel

Do not over-abstract before at least two chapters use the same pattern.

## v0.3 planned chapter: Kinematics of deformation

Working sequence:

- K00 — motion and configuration
- K01 — material vs spatial coordinates
- K02 — local neighborhood of a material point
- K03 — deformation gradient F
- K04 — local stretch, shear, and rotation
- K05 — determinant J and local volume change
- K06 — right and left Cauchy–Green tensors
- K07 — Green–Lagrange and Euler–Almansi strains
- K08 — polar decomposition F = RU = VR
- K09 — principal stretches and directions
- K10 — limiting cases and rigid-body motion
- K11 — computational kinematics lab
- K12 — final self-check

The chapter should preserve the same learning loop established by the pilot:

**physical question → prediction → manipulation → exact definition → derivation → representation switch → computation → self-check**

## Definition of done for v0.2

v0.2 is ready to become the new stable base when:

- the v0.1 chapter builds unchanged through the registry;
- CI is green on `v0.2-platform`;
- M13 uses the shared math layer;
- no module-specific routing remains in `App.tsx`;
- adding a new module no longer requires editing `App.tsx`;
- the architecture document is committed;
- the existing public v0.1 deployment remains unaffected until v0.2 is explicitly promoted.
