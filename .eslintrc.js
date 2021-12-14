module.exports = {
    parser: '@typescript-eslint/parser',
    extends: [
        // airbnb规范
        // https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb
        'airbnb',
        // 兼容typescript的airbnb规范
        // https://github.com/iamturns/eslint-config-airbnb-typescript
        'airbnb-typescript',
        // react hooks的airbnb规范
        'airbnb/hooks',

        // typescript的eslint插件
        // https://github.com/typescript-eslint/typescript-eslint/blob/master/docs/getting-started/linting/README.md
        // https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',

        // jest测试插件
        // https://github.com/jest-community/eslint-plugin-jest
        'plugin:jest/recommended',

        // 使用prettier格式化代码
        // https://github.com/prettier/eslint-config-prettier#readme
        'prettier',
        // 整合typescript-eslint与prettier
        // https://github.com/prettier/eslint-plugin-prettier
        'plugin:prettier/recommended',
    ],
    parserOptions: {
        // 指定ESLint可以解析JSX语法
        ecmaVersion: '2020',
        sourceType: 'module',
        project: './tsconfig.eslint.json',
        // React启用jsx
        ecmaFeatures: {
            jsx: true,
        },
    },
    env: {
        es6: true,
        browser: true,
        jest: true,
        node: true,
    },
    plugins: ['@typescript-eslint', 'import', 'jest', 'unused-imports'],
    rules: {
        /* ********************************** ES6+ ********************************** */
        'no-console': 0,
        'no-var-requires': 0,
        'no-restricted-syntax': 0,
        'no-continue': 0,
        'no-await-in-loop': 0,
        'no-return-await': 0,
        'no-multi-assign': 0,
        'no-param-reassign': [2, { props: false }],
        'max-classes-per-file': 0,
        'class-methods-use-this': 0,
        'guard-for-in': 0,
        'no-underscore-dangle': 0,
        'no-plusplus': 0,
        'no-lonely-if': 0,
        'no-bitwise': ['error', { allow: ['~'] }],

        /* ********************************** Module Import ********************************** */

        'import/prefer-default-export': 0,
        'import/no-cycle': 0,
        'import/no-dynamic-require': 0,
        'import/no-absolute-path': 0,
        'import/extensions': 0,

        // 一部分文件在导入devDependencies的依赖时不报错
        'import/no-extraneous-dependencies': [
            1,
            {
                devDependencies: [
                    '**/*.test.{ts,js}',
                    '**/*.spec.{ts,js}',
                    'build/**/*.{ts,js}',
                    'mock/**/*.{ts,js}',
                    '**.{ts,js}',
                ],
            },
        ],
        // 模块导入顺序规则
        'import/order': [
            1,
            {
                pathGroups: [
                    {
                        pattern: '@/**',
                        group: 'external',
                        position: 'after',
                    },
                ],
                alphabetize: { order: 'asc', caseInsensitive: false },
                'newlines-between': 'always-and-inside-groups',
                warnOnUnassignedImports: true,
            },
        ],
        // 自动删除未使用的导入
        // https://github.com/sweepline/eslint-plugin-unused-imports
        'no-unused-vars': 0,
        '@typescript-eslint/no-unused-vars': 0,
        'react/jsx-uses-react': 1,
        'react/jsx-uses-vars': 1,
        'unused-imports/no-unused-imports': 1,
        'unused-imports/no-unused-vars': [
            'error',
            {
                vars: 'all',
                args: 'none',
                ignoreRestSiblings: true,
            },
        ],

        // 自动删除未使用导入(另一种方案)
        // https://github.com/aladdin-add/eslint-plugin/tree/master/packages/autofix
        // 'no-unused-vars': [
        //     'error',
        //     {
        //         vars: 'all',
        //         args: 'none',
        //         ignoreRestSiblings: true,
        //     },
        // ],
        // 'autofix/no-unused-vars': [
        //     'error',
        //     {
        //         vars: 'all',
        //         args: 'none',
        //         ignoreRestSiblings: true,
        //     },
        // ],
        // '@typescript-eslint/no-unused-vars': [
        //     'error',
        //     {
        //         vars: 'all',
        //         args: 'none',
        //         ignoreRestSiblings: true,
        //     },
        // ],

        /* ********************************** Typescript ********************************** */
        '@typescript-eslint/no-empty-interface': 0,
        '@typescript-eslint/no-this-alias': 0,
        '@typescript-eslint/no-var-requires': 0,
        '@typescript-eslint/no-use-before-define': 0,
        '@typescript-eslint/explicit-member-accessibility': 0,
        '@typescript-eslint/no-non-null-assertion': 0,
        '@typescript-eslint/no-unnecessary-type-assertion': 0,
        '@typescript-eslint/require-await': 0,
        '@typescript-eslint/no-for-in-array': 0,
        '@typescript-eslint/interface-name-prefix': 0,
        '@typescript-eslint/explicit-function-return-type': 0,
        '@typescript-eslint/no-explicit-any': 0,
        '@typescript-eslint/explicit-module-boundary-types': 0,
        '@typescript-eslint/no-floating-promises': 0,
        '@typescript-eslint/restrict-template-expressions': 0,
        '@typescript-eslint/no-unsafe-assignment': 0,
        '@typescript-eslint/no-unsafe-return': 0,
        '@typescript-eslint/no-unused-expressions': 0,
        '@typescript-eslint/no-misused-promises': 0,
        '@typescript-eslint/no-unsafe-member-access': 0,
        '@typescript-eslint/no-unsafe-call': 0,
        '@typescript-eslint/no-unsafe-argument': 0,

        /* ********************************** React and Hooks ********************************** */
        'react/display-name': 0,
        'react/button-has-type': 0,
        'react/prop-types': 0,
        'react/jsx-props-no-spreading': 0,
        'react/destructuring-assignment': 0,
        'react/static-property-placement': 0,
        'react/react-in-jsx-scope': 0,
        'react/require-default-props': 0,
        'react/jsx-filename-extension': [1, { extensions: ['.jsx', '.tsx'] }],
        'react/function-component-definition': [
            2,
            { namedComponents: 'arrow-function', unnamedComponents: 'arrow-function' },
        ],
        'react-hooks/exhaustive-deps': 0,

        /* ********************************** jax-a11y ********************************** */
        'jsx-a11y/anchor-is-valid': 0,
        'jsx-a11y/no-static-element-interactions': 0,
        'jsx-a11y/click-events-have-key-events': 0,
        'jsx-a11y/label-has-associated-control': [
            'error',
            {
                required: {
                    some: ['nesting', 'id'],
                },
            },
        ],
    },

    settings: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.d.ts', '.json'],
    },
};
