# Technical Architecture

## Goal

The implementation should separate educational content from interactive rendering so that both can evolve independently.

## Proposed stack

### Content layer

- Jupyter Book 2 / MyST
- Markdown/MyST source files
- MathJax or KaTeX-compatible mathematics
- bibliography and cross-references

### Interactive layer

- React
- TypeScript
- Three.js / React Three Fiber for 3D scenes
- Plotly or D3 for 2D scientific plots where needed

### Computational laboratory

- JupyterLite
- Pyodide
- NumPy
- browser-side Python examples

### Deployment

- GitHub Pages
- GitHub Actions
- static build wherever possible

## Architectural principle

JupyterLite is the **computational laboratory**, not the entire user interface.

Key conceptual interactions should remain lightweight browser components so that the book loads quickly and remains usable without starting a Python kernel.

## Suggested repository structure

```text
.
├── content/
│   ├── m00_continuum.md
│   ├── m01_imaginary_cut.md
│   ├── m02_traction_vector.md
│   ├── m03_orientation.md
│   └── m04_cauchy_tetrahedron.md
├── docs/
│   ├── PROJECT_VISION.md
│   ├── DESIGN_SYSTEM.md
│   ├── NOTATION_CONVENTIONS.md
│   ├── TECHNICAL_ARCHITECTURE.md
│   └── V0_1_ROADMAP.md
├── book/                 # future MyST/Jupyter Book configuration
├── web/                  # future React interactive components
├── labs/                 # future JupyterLite notebooks
├── tests/                # math + UI validation
└── README.md
```

## Shared interactive component ideas

- `NotationInspector`
- `VectorArrow3D`
- `OrientedPlane`
- `StressCube`
- `CauchyTetrahedron`
- `ScaleExplorer`
- `PredictionCard`
- `MisconceptionCard`
- `ParameterPanel`
- `MathValueBadge`

## State model

Interactive scenes should expose a small explicit state object.

Example:

```ts
type TractionSceneState = {
  normal: [number, number, number];
  sigma: number[][];
  showNormalComponent: boolean;
  showTangentialComponent: boolean;
};
```

Derived values such as

[
mathbf t=oldsymbol{sigma}mathbf n
]

should be computed from state rather than stored independently.

## Validation

Every mathematical interaction should have at least one numerical test.

Examples:

- normalized plane normal remains unit length;
- traction equals matrix-vector product;
- tangential component is orthogonal to the normal;
- Cauchy tetrahedron scaling behaves as (h^2) and (h^3);
- notation variants remain algebraically equivalent.

## Performance

- lazy-load 3D scenes;
- avoid launching Pyodide unless the Lab mode is opened;
- keep default scene meshes simple;
- use reduced-motion preferences;
- provide static fallback figures where appropriate.
