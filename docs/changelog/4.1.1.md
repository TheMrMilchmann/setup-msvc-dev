### 4.1.1

_Released 2026 Nov 21_

#### Fixes

- Duplicate entries are removed from exactly the path-like variables (`PATH`, `INCLUDE`, `LIB`, `LIBPATH`).
  - Previously, `INCLUDE` was skipped and every other changed variable was split on `;` and deduplicated.
