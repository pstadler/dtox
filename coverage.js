/**
 * Runs coverage
 */
'use strict';

const fs = require('fs');
const rimraf = require('rimraf');
const { execSync } = require('child_process');

console.log('Executing coverage.js');

const packageJson = JSON.parse(fs.readFileSync('./package.json'));
packageJson.main = 'index.js';

fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, 2));

console.log('* Updated package.json');

rimraf('./dist', () => {
  console.log('* Removed ./dist folder');

  execSync('./node_modules/.bin/babel-istanbul cover --report lcovonly -x \'**/examples/**\'' +
    ' ./node_modules/.bin/_mocha -- -R spec');

  console.log('* Coverage report created');

  execSync('git checkout -- package.json');

  console.log('* Reverted change to package.json');
});
