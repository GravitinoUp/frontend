module.exports = {
    root: true,
    env: { browser: true, es2020: true },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:react-hooks/recommended',
        'plugin:react/recommended',
        'plugin:react/jsx-runtime',
    ],
    ignorePatterns: ['dist', '.eslintrc.cjs'],
    parser: '@typescript-eslint/parser',
    plugins: ['react-refresh', 'import', 'i18n'],
    rules: {
        'import/no-unresolved': 'off',
        'consistent-return': 'error',
        'arrow-body-style': ['error', 'as-needed'],
        'react/prop-types': 0,
        'react-refresh/only-export-components': [
            'warn',
            { allowConstantExport: true },
        ],
        'import/order': [
            'error',
            {
                groups: [
                    ['builtin', 'external'],
                    ['internal', 'parent', 'sibling', 'index'],
                ],
                pathGroups: [
                    { pattern: 'react', group: 'external', position: 'before' },
                ],
                pathGroupsExcludedImportTypes: ['react'],
                alphabetize: { order: 'asc', caseInsensitive: true },
            },
        ],
        'i18n/no-russian-character': 1,
    },
    settings: {
        'import/parsers': {
            '@typescript-eslint/parser': ['.ts', '.tsx'],
        },
        'import/resolver': {
            node: {
                extensions: ['.js', '.jsx', '.ts', '.tsx'],
            },
            typescript: {},
        },
    },
}
