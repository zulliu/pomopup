module.exports = {
  env: {
    browser: true,
    es2021: true,
    jest: true,
  },
  plugins: [
    'react',
    '@typescript-eslint',
  ],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/function-component-definition': ['error', { namedComponents: 'arrow-function' }],

  },

  overrides: [
    {
      // TypeScript files
      files: ['**/*.ts', '**/*.tsx'],
      parser: '@typescript-eslint/parser',
      extends: [
        'airbnb',
        'airbnb/hooks',
        'airbnb-typescript',
        'plugin:@typescript-eslint/recommended',
      ],
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json',
      },
    },
    {
      // JavaScript files
      files: ['**/*.js', '**/*.jsx'],
      extends: ['airbnb', 'airbnb/hooks'],
      rules: {
      },
    },
    {
      env: {
        node: true,
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
};
