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
      favicon32: 'favicon.ico',
      favicon16: '',
      appleTouchIcon: 'favicon.png',
      maskIcon: 'favicon.png',
      msTileImage: 'favicon.png',
    }
  },
}