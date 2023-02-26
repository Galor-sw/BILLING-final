module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true
  },
  extends: 'standard',
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    'no-case-declarations': 0,
    semi: [2, 'always'],
    'n/handle-callback-err': 0,
    'no-undef': 0,
    'no-trailing-spaces': 0,
    'no-warning-comments': 0,
    eqeqeq: 0
  }
};
