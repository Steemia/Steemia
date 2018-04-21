// Added font-awesome as custom script
// Added MDI as custom script

// this is a custom dictionary to make it easy to extend/override
// provide a name for an entry, it can be anything such as 'copyAssets' or 'copyFonts'
// then provide an object with a `src` array of globs and a `dest` string
const existingConfig = require('../node_modules/@ionic/app-scripts/config/copy.config');
module.exports = Object.assign(existingConfig, {
      copyCryptoAssets: {
            src: ['{{ROOT}}/node_modules/cryptocoins-icons/webfont/**/*'],
            dest: '{{WWW}}/assets/css'
      },
      copyMdiFonts: {
            src: ['{{ROOT}}/node_modules/mdi/fonts/**/*'],
            dest: '{{WWW}}/assets/fonts'
      },
      copyMdiCss: {
            src: ['{{ROOT}}/node_modules/mdi/css/**/*'],
            dest: '{{WWW}}/assets/css'
      }
}
);