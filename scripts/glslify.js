const fs = require('fs');
const glsl = require('glslify');
const chokidar = require('chokidar');
const logger = require("eazy-logger").Logger({
    prefix: "{blue:[}{magenta:glslify}{blue:] }",
    useLevelPrefixes: true
});

// Move to project root
process.chdir(__dirname + '/..');

// Utils
const re = new RegExp('^articles/(.*)/index.frag$');
const num = path => (path.toString().match(re) || [])[1];
const dst = n => process.cwd() + `/docs/shaders/${n}.frag`;
const src = path => process.cwd() + '/' + path;
const srcAndDst = path => [src(path), dst(num(path))];

const write = (dst, data) => {
  fs.writeFile(dst, data, 'utf8', err => {
    if (err) {
      logger.error(`Failed to write file ${dst}: ${err.message}`);
    }
  })
};

// Build
const glob = require("glob");
const files = glob.sync('articles/**/index.frag');
files.forEach(path => {
  const [src, dst] = srcAndDst(path);
  write(dst, glsl.file(src));
});
logger.info(`Wrote ${files.length} files to docs/shaders`);

// Watch
if (process.argv[2] === '-w') {
  const watcher = chokidar.watch('articles/**/index.frag', { ignoreInitial: true });
  watcher.on('add', path => {
    const [src, dst] = srcAndDst(path);

    logger.info(`Add detected: ${src}`);
    write(dst, glsl.file(src));
    logger.info(`Wrote file: ${dst}`);
  });
  watcher.on('change', path => {
    const [src, dst] = srcAndDst(path);

    logger.info(`Change detected: ${src}`);
    write(dst, glsl.file(src));
    logger.info(`Wrote file: ${dst}`);
  });
  watcher.on('unlink', path => {
    const [src, dst] = srcAndDst(path);

    logger.info(`Remove detected: ${src}`);
    fs.unlink(dst, err => {
      if (err) {
        logger.error(`Failed to remove file ${dst}: ${err.message}`);
      }
      else {
        logger.info(`Removed file: ${dst}`);
      }
    });
  });
}
