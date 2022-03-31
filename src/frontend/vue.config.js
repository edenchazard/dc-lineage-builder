var config = {
    devServer: {
        proxy: {
            '^/api': {
                target: 'http://api',
                changeOrigin: true
            }
        }
    },
    transpileDependencies: ['unique-names-generator'],
    publicPath: process.env.VUE_APP_URL
};

module.exports = config;