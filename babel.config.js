module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                targets: {
                    node: '8.12',
                },
            },
        ],
    ],
    env: {
        test: {
            presets: [
                [
                    '@babel/preset-env',
                    {
                        targets: {
                            node: '8.12',
                        },
                    },
                ],
            ],
        },
    },
};
