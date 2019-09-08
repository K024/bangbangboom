module.exports = {
  outputDir: "./../bangbangboom/wwwroot/",
  pwa: {
    workboxPluginMode: 'GenerateSW',
    workboxOptions: {
      importWorkboxFrom: 'local'
    },
    themeColor: "#ffffff",
    appleMobileWebAppCapable: true,
    appleMobileWebAppStatusBarStyle: "black-translucent",
    iconPaths: {
      favicon32: 'favicon-32x32.png',
      favicon16: 'favicon-16x316.png',
      appleTouchIcon: 'apple-touch-icon.png',
      maskIcon: 'apple-touch-icon.png',
      msTileImage: 'apple-touch-icon.png',
    }
  },
  devServer: {
    proxy: {
      '/api': {
        target: 'https://localhost:5001',
        changeOrigin: true,
      }
    }
  }
}