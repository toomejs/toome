/** @format */
module.exports = {
    singleQuote: true,
    trailingComma: 'all',
    printWidth: 100,
    proseWrap: 'never',
    endOfLine: 'auto',
    semi: true,
    tabWidth: 4,
    vueIndentScriptAndStyle: true,
    htmlWhitespaceSensitivity: 'strict',
    overrides: [
        {
            files: '.prettierrc',
            options: {
                parser: 'json',
            },
        },
        {
            files: 'document.ejs',
            options: {
                parser: 'html',
            },
        },
    ],
};
