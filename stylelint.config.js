module.exports = {
    customSyntax: 'postcss-less',
    extends: [
        // 'stylelint-config-recommended-scss',
        'stylelint-config-standard',
        'stylelint-config-css-modules',
        'stylelint-config-recess-order',
        'stylelint-prettier/recommended',
    ],
    rules: {
        'selector-class-pattern': null,
        'custom-property-pattern': null,
        'no-duplicate-selectors': null, // 取消禁止重复定义,这样可以在css module中单独定义变量
        'block-no-empty': true, // 禁止出现空块
        'declaration-empty-line-before': 'never',
        'declaration-block-no-duplicate-properties': true, // 在声明的块中中禁止出现重复的属性
        'declaration-block-no-redundant-longhand-properties': true, // 禁止使用可以缩写却不缩写的属性
        'shorthand-property-no-redundant-values': true, // 禁止在简写属性中使用冗余值
        'color-hex-length': 'short', // 指定十六进制颜色是否使用缩写
        'comment-no-empty': true, // 禁止空注释
        'font-family-name-quotes': 'always-unless-keyword', // 指定字体名称是否需要使用引号引起来 | 期待每一个不是关键字的字体名都使用引号引起来
        'font-weight-notation': 'numeric', // 要求使用数字或命名的 (可能的情况下) font-weight 值
        'function-url-quotes': 'always', // 要求或禁止 url 使用引号
        'property-no-vendor-prefix': true, // 禁止属性使用浏览器引擎前缀
        'value-no-vendor-prefix': true, // 禁止给值添加浏览器引擎前缀
        'selector-no-vendor-prefix': true, // 禁止使用浏览器引擎前缀
        'no-descending-specificity': null, // 禁止低优先级的选择器出现在高优先级的选择器之后
        'property-no-unknown': [
            true,
            {
                ignoreProperties: [
                    // CSS Modules composition
                    // https://github.com/css-modules/css-modules#composition
                    'composes',
                ],
            },
        ],

        'selector-pseudo-class-no-unknown': [
            true,
            {
                ignorePseudoClasses: [
                    // CSS Modules :global scope
                    // https://github.com/css-modules/css-modules#exceptions
                    'global',
                    'local',
                ],
            },
        ],
        'rule-empty-line-before': [
            // 要求或禁止在规则声明之前有空行
            'always-multi-line',
            {
                except: ['first-nested'],
                ignore: ['after-comment'],
            },
        ],
        'at-rule-empty-line-before': [
            // 要求或禁止在 at 规则之前有空行
            'always',
            {
                except: ['blockless-after-same-name-blockless', 'first-nested'],
                ignore: ['after-comment'],
            },
        ],
        'comment-empty-line-before': [
            // 要求或禁止在注释之前有空行
            'always',
            {
                except: ['first-nested'],
                ignore: ['stylelint-commands'],
            },
        ],
    },
};
