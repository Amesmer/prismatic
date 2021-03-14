module.exports = function override(config, env) {
    config.resolve = {
        alias: {
            'react': 'anujs',
            'react-dom': 'anujs',
        }
    };
    return config;
}