var config = {
    devServer: {
        proxy: {
            '^/api': {
                target: 'http://dc-lineage-builder-api-1:80',
                changeOrigin: true
            }
        }
    },
    transpileDependencies: ['unique-names-generator'],
    publicPath: process.env.VUE_APP_URL
};

module.exports = config;