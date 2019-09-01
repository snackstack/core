const { execSync } = require('child_process');

const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
};

const question = str => {
  const readline = require('readline');

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
  });

  return new Promise(resolve => {
    rl.question(`\n${str}? (Y/N)\n`, answer => {
      rl.close();

      resolve(answer.toLowerCase() === 'y');
    });
  });
};

const print = (str = '', color = '', args = '') => {
  // eslint-disable-next-line no-console
  console.log(`${color}${str}\x1b[0m`, args);
};

const execSyncWithErrors = (
  cmd,
  options = { stdio: ['ignore', 'ignore', 'inherit'] },
) => execSync(cmd, options);

const getCurrentVersion = () => {
  const packagejson = require('./package.json');

  return packagejson.version;
};

const steps = {
  newVersion: '0.0.0',
  start: () => {
    print('Starting release...', colors.cyan);

    steps
      .updateVersion()
      .catch(() => print('\nError during release!\n', colors.red));
  },
  updateVersion: async () => {
    const versionArg = process.argv[2] || 'patch';

    const shouldUpdate = await question(
      `Are you sure you want to modify the current version using '${versionArg}'`,
    );

    if (shouldUpdate) {
      execSyncWithErrors(`npm version ${versionArg} -m "Update to %s"`);

      steps.newVersion = getCurrentVersion();
    } else {
      return steps.abort('Version update was not confirmed by user');
    }

    return steps.pushChanges();
  },
  pushChanges: async () => {
    const shouldPush = await question(
      `Do you want to push the changes related to v${steps.newVersion} to the remote repository`,
    );

    if (shouldPush) {
      execSyncWithErrors('git push --follow-tags');

      return steps.publish();
    } else {
      return steps.abort(
        'Remote repository should not be out of sync with releases',
      );
    }
  },
  publish: async () => {
    const shouldPublish = await question(
      `Do you want to publish v${steps.newVersion} to the npm registry`,
    );

    if (shouldPublish) {
      execSyncWithErrors('npm publish');

      print('\nPublished release!\n', colors.green);
    }
  },
  abort: (reason = 'none') =>
    print(`\nAborted release! Reason: ${reason}.\n`, colors.yellow),
};

steps.start();
