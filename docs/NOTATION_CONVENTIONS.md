# Notation Conventions

This document fixes the notation used throughout the interactive textbook.

## Vectors and tensors

- vectors are bold lowercase: (mathbf v, mathbf n, mathbf t)
- second-order tensors are bold Greek or bold uppercase: (oldsymbol{sigma}, mathbf F)
- scalars are italic: (ho, p, sigma_n)

## Basis

A Cartesian orthonormal basis is written

[
{mathbf e_1,mathbf e_2,mathbf e_3}.
]

## Einstein summation convention

Repeated indices imply summation unless stated otherwise.

For example,

[
t_i=sigma_{ij}n_j
]

means

[
t_i=sum_{j=1}^{3}sigma_{ij}n_j.
]

## Cauchy formula

The project adopts

[
oxed{mathbf t(mathbf n)=oldsymbol{sigma}mathbf n}
]

and therefore

[
oxed{t_i=sigma_{ij}n_j}.
]

For a coordinate plane with normal (mathbf e_j),

[
mathbf t^{(j)}=oldsymbol{sigma}mathbf e_j.
]

Hence the (j)-th column of ([sigma_{ij}]) contains the components of traction on the plane with normal (mathbf e_j).

## Stress sign convention

Tension-positive convention is used for normal stress unless a module explicitly states otherwise.

Pressure will therefore be introduced with its sign convention stated explicitly rather than silently identifying it with mean normal stress.

## Traction orientation

Opposite sides of the same internal cut carry opposite tractions in accordance with action-reaction:

[
mathbf t(mathbf x,-mathbf n)=-mathbf t(mathbf x,mathbf n).
]

## Matrix representation

A matrix is treated as the coordinate representation of a tensor in a chosen basis, not as the tensor itself.

This distinction should be preserved in all educational text and interface labels.

## Terminology

Preferred Russian terms:

- continuum — сплошная среда / континуум
- traction vector — вектор напряжения
- Cauchy stress tensor — тензор напряжений Коши
- body force — объёмная сила
- surface force — поверхностная сила
- principal stress — главное напряжение
- principal direction — главное направление
- deviatoric stress — девиаторная часть напряжения

English terms may be shown in parentheses at first appearance when useful.


## Kinematics: reference and current coordinates

The textbook uses the canonical pair

\[
\mathbf X \longrightarrow \mathbf x=\boldsymbol\chi(\mathbf X,t),
\]

where:

- \(\mathbf X\) labels a material point in the reference configuration;
- \(\mathbf x\) is the current spatial position of that same material point;
- \(\boldsymbol\chi\) is the motion map.

### Equivalent notation in the literature

Different authors may use different symbols for the same physical roles.

Examples include:

\[
\mathbf X \mapsto \mathbf x,
\qquad
\boldsymbol\xi \mapsto \mathbf x,
\]

with the motion written, for example, as

\[
\mathbf x=\boldsymbol\chi(\mathbf X,t)
\quad\text{or}\quad
\mathbf x=\boldsymbol\chi(\boldsymbol\xi,t).
\]

The symbol \(\boldsymbol\xi\) (xi) may therefore play the same role as \(\mathbf X\): a material/reference label.

The symbol \(\boldsymbol\chi\) (chi) normally denotes the mapping itself, not a third coordinate system.

Some texts also use other symbols such as \(\mathbf a\), \(\mathbf X_0\), \(\boldsymbol\varphi\), or \(\boldsymbol\phi\). Symbol choice is author-dependent.

**Rule for students:** identify the physical role from the definition and configuration before interpreting a symbol. Do not assume that a letter has a universal meaning across textbooks.


## Kinematics terminology / Терминология кинематики

For the Russian interface and teaching text, use the following preferred terms consistently:

- reference configuration — референсная конфигурация; «исходная конфигурация» may be used in introductory explanatory text when it improves readability;
- current configuration — текущая конфигурация;
- material coordinate / material label — материальная координата / материальная метка;
- spatial coordinate — пространственная координата;
- motion map — отображение движения;
- deformation gradient — градиент деформации;
- Jacobian — якобиан движения, \(J=\det\mathbf F\);
- right Cauchy–Green tensor — правый тензор Коши–Грина, \(\mathbf C=\mathbf F^T\mathbf F\);
- left Cauchy–Green tensor — левый тензор Коши–Грина, \(\mathbf B=\mathbf F\mathbf F^T\);
- Green–Lagrange strain tensor — тензор деформации Грина–Лагранжа;
- Euler–Almansi strain tensor — тензор деформации Эйлера–Альманси;
- polar decomposition — полярное разложение;
- right stretch tensor — правый тензор растяжения \(\mathbf U\);
- left stretch tensor — левый тензор растяжения \(\mathbf V\);
- proper rotation — собственно поворот / собственно ортогональное вращение; in introductory text «жёсткий поворот» is acceptable when \(\det\mathbf R=+1\) is clear;
- principal stretch — главное растяжение;
- principal direction — главное направление;
- rigid motion — жёсткое движение;
- simple shear — простой сдвиг.

### Configuration rule

Whenever two tensors belong to different configurations, the teaching text must state this explicitly rather than comparing their components directly.

In particular:

\[
\mathbf C=\mathbf F^T\mathbf F
\]

belongs to the reference/material description, while

\[
\mathbf B=\mathbf F\mathbf F^T
\]

belongs to the current/spatial description.

Likewise, \(\mathbf E\) (Green–Lagrange) and \(\mathbf e\) (Euler–Almansi) must not be presented as directly component-wise comparable without an appropriate mapping between configurations.

### Admissibility rule

For an ordinary orientation-preserving continuum deformation, use

\[
J=\det\mathbf F>0.
\]

State separately that local positivity of \(J\) does not by itself guarantee global injectivity of the motion.
