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
