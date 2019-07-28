module.exports = {
  outputDir: "./../bangbangboom/wwwroot/",
  pwa: {
    workboxPluginMode: 'GenerateSW',
    workboxOptions: {
      importWorkboxFrom: 'local'
    }
  },
}