module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    // Limitar el header a 72 caracteres
    "header-max-length": [2, "always", 72],

    // Requerir scope (área del monorepo)
    "scope-empty": [2, "never"],

    // Definir scopes permitidos basados en la estructura del monorepo
    "scope-enum": [
      2,
      "always",
      [
        "ui", // packages/ui
        "api", // apps/api
        "native", // apps/native
        "web", // apps/web
        "shared", // código compartido
        "config", // configuración
        "deps", // dependencias
        "root", // cambios en la raíz del monorepo
      ],
    ],

    // Tipos permitidos
    "type-enum": [
      2,
      "always",
      [
        "feat", // nueva funcionalidad
        "fix", // corrección de bug
        "docs", // documentación
        "style", // formato, sin cambios de código
        "refactor", // refactorización
        "perf", // mejora de rendimiento
        "test", // añadir o corregir tests
        "chore", // tareas de mantenimiento
        "ci", // cambios en CI/CD
        "build", // cambios en el sistema de build
        "revert", // revertir commit anterior
      ],
    ],

    // El type es obligatorio
    "type-empty": [2, "never"],

    // El subject (descripción) es obligatorio
    "subject-empty": [2, "never"],

    // El subject no debe terminar con punto
    "subject-full-stop": [2, "never", "."],

    // El subject debe estar en minúsculas
    "subject-case": [2, "always", "lower-case"],
  },
};
