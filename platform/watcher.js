// watcher.js
// Watcher that auto git add/commit/push on changes - simple and conservative.
// Run with: node watcher.js

const { exec } = require('child_process');
const chokidar = require('chokidar');
const path = require('path');

const REPO_PATH = path.resolve(__dirname); // adjust if watcher not in repo root
const BRANCH = 'main';
const DEBOUNCE_MS = 3000; // wait this long after changes before committing
let timeout = null;
let busy = false;

function run(cmd, cb) {
  exec(cmd, { cwd: REPO_PATH, maxBuffer: 1024 * 1024 }, (err, stdout, stderr) => {
    if (err) {
      console.error('CMD ERR', cmd, err.message);
    }
    if (stdout) console.log(stdout.trim());
    if (stderr) console.error(stderr.trim());
    if (cb) cb(err, stdout, stderr);
  });
}

function pushChanges() {
  if (busy) return;
  busy = true;
  const timestamp = new Date().toISOString().replace('T',' ').replace('Z','');
  console.log('Auto Git Push Running...','Time:', timestamp);
  // 1) pull rebase (safe merge strategy)
  run(`git pull origin ${BRANCH} --rebase`, (err) => {
    // 2) add all
    run(`git add -A`, () => {
      // 3) commit (only if there are changes)
      run(`git diff --cached --quiet || git commit -m "Auto update: ${timestamp}"`, () => {
        // 4) push - try
        run(`git push origin ${BRANCH}`, () => {
          console.log('Auto push cycle finished.');
          busy = false;
        });
      });
    });
  });
}

// initialize watcher - ignore .git, node_modules, .env, etc.
const watcher = chokidar.watch(REPO_PATH, {
  ignored: [
    /(^|[\/\\])\../, // dotfiles and .git
    '**/.git/**',
    '**/node_modules/**',
    '**/dist/**',
    '**/.env',
    '**/*.log',
    '**/auto-push.*',
    '**/post-commit*'
  ],
  ignoreInitial: true,
  persistent: true,
  awaitWriteFinish: {
    stabilityThreshold: 500,
    pollInterval: 100
  }
});

watcher.on('all', (event, pathChanged) => {
  console.log(`[watcher] ${event} - ${pathChanged}`);
  if (timeout) clearTimeout(timeout);
  timeout = setTimeout(pushChanges, DEBOUNCE_MS);
});

console.log('Watcher started. Monitoring repo for changes...');