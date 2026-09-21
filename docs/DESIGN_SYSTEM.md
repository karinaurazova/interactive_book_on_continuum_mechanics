# Design System

## Visual direction

The visual identity is based on the research-editorial language of **«Закулисье МатМодельера»**.

The interface should feel:

- scientific;
- contemporary;
- editorial;
- calm;
- precise;
- personal without becoming decorative.

Avoid:

- blackboard aesthetics;
- notebook-paper motifs;
- clip-art icons;
- school-poster layouts;
- excessive gradients;
- decorative 3D without explanatory value;
- dense infographic screens.

## Palette

| Role | Color |
|---|---|
| Graphite / primary text | `#111318` |
| Warm paper background | `#F4F2EC` |
| Primary interactive accent | `#2864FF` |
| Secondary / geometric accent | `#A9E3D2` |
| Warning / misconception | orange only |

## Semantic color use

- normal vector `n` — blue
- traction vector `t` — mint
- normal traction component — blue
- tangential traction component — dark teal
- warnings and misconception markers — orange

Color must never be the only carrier of meaning.

## Layout

Preferred desktop learning screen:

```
┌──────────────────────────────────────────────────────────────┐
│ module / progress / notation / mode                         │
├───────────────┬──────────────────────────────┬───────────────┤
│ theory        │ interactive scene            │ controls      │
│               │                              │ notation      │
│ explanation   │ 3D / 2D / plot              │ parameters    │
│ formula       │                              │ values        │
├───────────────┴──────────────────────────────┴───────────────┤
│ misconception / challenge / author note                     │
└──────────────────────────────────────────────────────────────┘
```

Mobile layout should collapse to:

**concept → scene → controls → explanation → self-check**

## Typography

Recommended families:

- interface/body: Inter, IBM Plex Sans, or Manrope
- code: IBM Plex Mono or JetBrains Mono
- mathematics: high-quality MathJax/KaTeX rendering

Rules:

- large editorial headings;
- short paragraphs;
- generous whitespace;
- mathematical expressions are primary content, not visual footnotes.

## Reusable blocks

### Concept

A compact statement of the physical idea.

### Definition

A precise mathematical definition.

### Derivation

Expandable derivation for readers who want full detail.

### Notation Inspector

A global switch:

`Tensor | Index | Matrix | Python`

### Do not confuse

Short misconception block. Use orange sparingly.

### Prediction

A question asked before interaction.

### Observation

What the user should notice after manipulating the scene.

### Explanation

The mathematical explanation after the observation.

### Note from MathModeller

A short authorial comment used when it genuinely improves understanding.

### Professor of Evil

Rare, optional ironic warning for especially common mistakes. Never use it as the dominant tone.

## Interaction constraints

- one primary conceptual action per screen;
- no more than one dominant 3D scene per screen;
- no more than 2–3 accent colors in a single viewport;
- progressive disclosure for derivations and advanced notation;
- interaction must change an interpretable mathematical or physical quantity;
- every animation must have a pause/reset state;
- all key values must be readable numerically as well as visually.

## Accessibility

- keyboard-accessible controls;
- high contrast;
- labels in addition to color;
- reduced-motion mode;
- meaningful alt text for static illustrations;
- equations available as selectable text;
- mobile-safe layouts.
