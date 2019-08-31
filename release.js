const execSync = require('child_process').execSync;

const version = process.argv[2] || 'patch';

execSync(`npm version ${version} -m "Updated to %s"`, { stdio: [0, 1, 2] });
execSync('npm publish', { stdio: [0, 1, 2] });
