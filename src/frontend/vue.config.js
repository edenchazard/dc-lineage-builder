var config = {
    devServer: {
        proxy: {
            '^/api': {
                target: 'http://api:8080',
                changeOrigin: true
            }
        }
    },
    transpileDependencies: ['unique-names-generator']/*,
    pluginOptions: {
        sitemap: {
            baseURL: 'https://chazza.me/dc/',
            routes,
        }
    }*/
};

if(process.env.NODE_ENV === 'production'){
    config.publicPath = '/dc/lineage-builder/';
}

module.exports = config;