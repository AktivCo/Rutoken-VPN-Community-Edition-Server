module.exports = {
    arrowParens: "always",
    trailingComma: "all",
    tabWidth: 4,
    semi: true,
    singleQuote: true,
    bracketSpacing: true,
    printWidth: 140,
    endOfLine: "lf",
    overrides: [
        {
            files: '*.component.html',
            options: {
                parser: 'angular',
            },
        },
    ]
};