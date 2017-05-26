const fs = require('fs');
const io = require('socket.io')(8081);
const chokidar = require('chokidar');

// Move to project root
process.chdir(__dirname + '/..');

// Utils
const re = new RegExp('^docs/shaders/(.*).frag$');
const num = path => (path.toString().match(re) || [])[1];

const watcher = chokidar.watch('docs/shaders/*.frag', { ignoreInitial: true });
io.on('connection', socket => {
  watcher.on('all', (event, path) => {
    if (event !== 'add' && event !== 'change') { return; }
    fs.readFile(path, 'utf8', (err, data) => {
      io.emit('reload', [num(path), data]);
    });
  });
});
