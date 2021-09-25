module.exports = {
  extends: [require.resolve('@umijs/fabric/dist/eslint')],
  rules: {
    quotes: [2, 'single'],
    'quote-props': [2, 'as-needed'],
    'no-array-constructor': 2,
    'no-multiple-empty-lines': [2, { max: 2 }],
    'jsx-quotes': [2, 'prefer-single'],
    'no-restricted-syntax': ['error', 'LabeledStatement', 'WithStatement'],
    'import/no-unresolved': 'off',
    'import/no-extraneous-dependencies': 'off',
    'no-param-reassign': 'off',
    'no-use-before-define': 'off',
    'no-explicit-any': 'off',
    'no-underscore-dangle': 'off',
  },
};
