# Guía de Commits - VitalPathAI

Este proyecto utiliza **Husky**, **Commitlint** y **lint-staged** para asegurar la calidad y consistencia de los commits.

## Formato de Commit Requerido

Todos los commits deben seguir el formato de **Conventional Commits**:

```
<type>(<scope>): <description>
```

### Ejemplo

```bash
feat(ui): add new button component
fix(api): resolve authentication bug
refactor(native): improve performance
```

## Reglas

### 1. **Máximo 72 caracteres**

El mensaje completo del commit no debe exceder 72 caracteres.

### 2. **Type (Tipo)** - Obligatorio

Indica el tipo de cambio:

- `feat` - Nueva funcionalidad
- `fix` - Corrección de bug
- `docs` - Documentación
- `style` - Formato, sin cambios de código
- `refactor` - Refactorización
- `perf` - Mejora de rendimiento
- `test` - Añadir o corregir tests
- `chore` - Tareas de mantenimiento
- `ci` - Cambios en CI/CD
- `build` - Cambios en el sistema de build
- `revert` - Revertir commit anterior

### 3. **Scope (Ámbito)** - Obligatorio

Indica el área del monorepo afectada:

- `ui` - packages/ui
- `api` - apps/api
- `native` - apps/native
- `web` - apps/web
- `shared` - Código compartido
- `config` - Configuración
- `deps` - Dependencias
- `root` - Cambios en la raíz del monorepo

### 4. **Description (Descripción)** - Obligatorio

- Debe estar en **minúsculas**
- No debe terminar con punto
- Debe ser concisa y descriptiva

## Ejemplos Válidos

```bash
✅ feat(ui): add calendar component
✅ fix(api): resolve cors issue
✅ docs(root): update readme with setup instructions
✅ refactor(native): optimize image loading
```

## Ejemplos Inválidos

```bash
❌ Add new feature                    # Sin type ni scope
❌ feat: add button                   # Sin scope
❌ feat(ui) add button                # Falta dos puntos (:)
❌ FEAT(ui): Add Button               # Type y description en mayúsculas
❌ feat(ui): this is a very long commit message that exceeds the maximum allowed length of seventy two characters  # Más de 72 caracteres
```

## Lint-Staged

Antes de cada commit, **lint-staged** ejecutará automáticamente:

- **Prettier** en todos los archivos staged (`.ts`, `.tsx`, `.js`, `.jsx`, `.md`, `.json`)

Esto asegura que todo el código esté formateado correctamente antes de hacer commit.

## ¿Qué pasa si mi commit es rechazado?

Si tu commit es rechazado, verás un mensaje de error indicando qué regla no se cumplió:

```bash
⧗   input: add new feature
✖   subject may not be empty [subject-empty]
✖   type may not be empty [type-empty]
✖   scope may not be empty [scope-empty]
```

Simplemente corrige el mensaje y vuelve a intentar:

```bash
git commit -m "feat(ui): add new feature"
```

## Desactivar temporalmente (No recomendado)

Si por alguna razón necesitas hacer un commit sin validación (no recomendado), puedes usar:

```bash
git commit --no-verify -m "your message"
```

**Nota:** Esto solo debe usarse en casos excepcionales.
