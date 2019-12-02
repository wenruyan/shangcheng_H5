module.exports = {
  baseUrl: process.env.NODE_ENV == 'production' ? './' : '/',
  lintOnSave: true,
  productionSourceMap: false,
  devServer: {
    open: true,
    // host: 'localhost',
    port: 8091,
    proxy: {
      "/api": {
        // target: "http://rest.apizza.net/mock/10a3983d31dbc231f1c2180d762a166c",
        // target: "http://focus.api:3000",
        // target: "http://192.168.33.202:3000",
        // target: "http://192.168.31.43:3000",
        // target: "http://free.idcfengye.com:11592",
        // target: 'https://dietcoke.focus-base.com',
        target: "http://erikdeleyeuat.focus-base.com:8999/",
        // target: 'http://210.22.122.126:13000',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      },
      "/bpeClean": {
        // target: "http://focus.api:8181",
        // target: "http://114.87.0.153:8181",
        // target: "http://free.idcfengye.com:18248",
        target: 'http://dietcoke.focus-base.com:61908',
        changeOrigin: true
      }
    }
  }
}
