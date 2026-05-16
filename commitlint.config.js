module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'header-max-length': [2, 'always', 72],

    'scope-empty': [2, 'never'],

    'scope-enum': [
      2,
      'always',
      [
        'ui',
        'api',
        'vitalpath',
        'web',
        'shared',
        'config',
        'deps',
        'root',
        'docs',
      ],
    ],

    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'perf',
        'test',
        'chore',
        'ci',
        'build',
        'revert',
      ],
    ],

    // El type es obligatorio
    'type-empty': [2, 'never'],

    // El subject (descripción) es obligatorio
    'subject-empty': [2, 'never'],

    // El subject no debe terminar con punto
    'subject-full-stop': [2, 'never', '.'],

    // El subject debe estar en minúsculas
    'subject-case': [2, 'always', 'lower-case'],
  },
};
