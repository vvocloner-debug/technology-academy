// watcher.js
const { exec } = require('child_process');
const chokidar = require('chokidar');
const path = require('path');

const REPO_PATH = path.resolve(__dirname);
const BRANCH = 'main';
const DEBOUNCE_MS = 3000;
let timeout = null;
let busy = false;

function run(cmd, cb) {
  exec(cmd, { cwd: REPO_PATH, maxBuffer: 1024 * 1024 }, (err, stdout, stderr) => {
    if (err) console.error('CMD ERR', cmd, err.message);
    if (stdout) console.log(stdout.trim());
    if (stderr) console.error(stderr.trim());
    if (cb) cb(err, stdout, stderr);
  });
}

function pushChanges() {
  if (busy) return;
  busy = true;
  const timestamp = new Date().toISOString().replace('T',' ').replace('Z','');
  console.log('Auto Git Push Running... Time:', timestamp);
  run(`git pull origin ${BRANCH} --rebase`, (err) => {
    run(`git add -A`, () => {
      run(`git diff --cached --quiet || git commit -m "Auto update: ${timestamp}"`, () => {
        run(`git push origin ${BRANCH}`, () => {
          console.log('Auto push cycle finished.');
          busy = false;
        });
      });
    });
  });
}

const watcher = chokidar.watch(REPO_PATH, {
  ignored: [
    /(^|[\/\\])\../,
    '**/.git/**',
    '**/node_modules/**',
    '**/dist/**',
    '**/.env',
    '**/*.log',
    '**/auto-push.*',
    '**/post-commit*',
    '**/platform-uploads/**'
  ],
  ignoreInitial: true,
  persistent: true,
  awaitWriteFinish: { stabilityThreshold: 500, pollInterval: 100 }
});

watcher.on('all', (event, pathChanged) => {
  console.log(`[watcher] ${event} - ${pathChanged}`);
  if (timeout) clearTimeout(timeout);
  timeout = setTimeout(pushChanges, DEBOUNCE_MS);
});

console.log('Watcher started. Monitoring repo for changes...');