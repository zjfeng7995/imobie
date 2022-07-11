const path = require('path')
function resolve(dir) {
    return path.join(__dirname, dir)
}
module.exports = {
    lintOnSave: false,
    css: {
        sourceMap: true,
        extract: process.env.NODE_ENV === "production",
    },
    configureWebpack: {
        name: 'Imobie Vue Admin',
        devtool: 'cheap-module-source-map',
        resolve: {
            alias: {
                '@AST': resolve('src/assets')
            }
        }
    }
}