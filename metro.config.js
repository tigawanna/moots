// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config')

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname)
// for livestore stuff
//  for better-auth intergration
config.resolver.unstable_enablePackageExports = true; 
// console.log(config)
module.exports = config
