// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config')
const { addLiveStoreDevtoolsMiddleware } = require('@livestore/devtools-expo')

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname)

addLiveStoreDevtoolsMiddleware(config, { schemaPath: './src/lib/livestore/schema.ts' })

// console.log(config)
module.exports = config
