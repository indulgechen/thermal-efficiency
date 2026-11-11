// 把 dev/ 下的 HTML、CSS、JS 合成一个可离线双击打开的单文件
const fs = require('fs');
const path = require('path');

const dir = __dirname;
const html = fs.readFileSync(path.join(dir, 'dev', 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(dir, 'dev', 'styles.css'), 'utf8');
const js = fs.readFileSync(path.join(dir, 'dev', 'app.js'), 'utf8');

const out = html
  .replace('<link rel="stylesheet" href="styles.css">', '<style>\n' + css + '\n</style>')
  .replace('<script src="app.js"></script>', '<script>\n' + js + '\n</script>');

const target = path.join(dir, '铁的冶炼-高炉3D交互课件.html');
fs.writeFileSync(target, out, 'utf8');
console.log('built:', target, (out.length / 1024).toFixed(1) + ' KB');
