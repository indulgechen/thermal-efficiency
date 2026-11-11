// 把 dev-optics/ 下的 HTML、CSS、JS 合成单文件
const fs = require('fs');
const path = require('path');

const dir = __dirname;
const html = fs.readFileSync(path.join(dir, 'dev-optics', 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(dir, 'dev-optics', 'styles.css'), 'utf8');
const js = fs.readFileSync(path.join(dir, 'dev-optics', 'app.js'), 'utf8');

const out = html
  .replace('<link rel="stylesheet" href="styles.css">', '<style>\n' + css + '\n</style>')
  .replace('<script src="app.js"></script>', '<script>\n' + js + '\n</script>');

const target = path.join(dir, '杨氏双缝干涉-3D交互课件.html');
fs.writeFileSync(target, out, 'utf8');
console.log('built:', target, (out.length / 1024).toFixed(1) + ' KB');
