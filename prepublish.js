/**
 * Prepublish script changes the main entry of package.json
 */
'use strict';

const fs = require('fs');

const packageJson = JSON.parse(fs.readFileSync('./package.json'));
packageJson.main = 'dist/index.js';

fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, 2));
