// 通用打包：node build-machines.js <dev目录> <输出文件名>
const fs = require('fs');
const path = require('path');

const dir = __dirname;
const src = process.argv[2] || 'dev-engine';
const outName = process.argv[3] || '热机-3D交互课件.html';

const html = fs.readFileSync(path.join(dir, src, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(dir, src, 'styles.css'), 'utf8');
const js = fs.readFileSync(path.join(dir, src, 'app.js'), 'utf8');

const out = html
  .replace('<link rel="stylesheet" href="styles.css">', '<style>\n' + css + '\n</style>')
  .replace('<script src="app.js"></script>', '<script>\n' + js + '\n</script>');

const target = path.join(dir, outName);
fs.writeFileSync(target, out, 'utf8');
console.log('built:', target, (out.length / 1024).toFixed(1) + ' KB');
