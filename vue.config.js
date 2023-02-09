module.exports = {

    devServer: {
        public: 'http://localhost:8080'
    },

    chainWebpack: config => {

        // GraphQL Loader
        config.module
            .rule('glslify')
            .test(/\.(glsl|vs|fs|vert|frag)$/)
            .use('raw-loader')
            .loader('raw-loader')
            .end()
            .use('glslify-loader')
            .loader('glslify-loader')
            .end()
        // Add another loader
    },

}